# Subagent Configuration Reference

Complete reference for the Oh My Pi (OMP) task/subagent system. Covers every configurable surface: agent definitions, global settings, model registry, per-call parameters, execution modes, IRC coordination, environment variables, hard limits, and discovery/precedence rules.

**Source:** Harness documentation at `omp://tools/task.md`, `omp://models.md`, `omp://config-usage.md`, `omp://task-agent-discovery.md`, `omp://tools/irc.md`, `omp://environment-variables.md`, `omp://sdk.md`.

**Implementation:**
- Task tool: `packages/coding-agent/src/task/index.ts`
- Agent discovery: `packages/coding-agent/src/task/discovery.ts`
- Agent definitions: `packages/coding-agent/src/task/agents.ts`
- Executor: `packages/coding-agent/src/task/executor.ts`
- Parallel scheduling: `packages/coding-agent/src/task/parallel.ts`
- Isolation: `packages/coding-agent/src/task/isolation-backend.ts`, `worktree.ts`
- Output management: `packages/coding-agent/src/task/output-manager.ts`
- IRC: `packages/coding-agent/src/tools/irc.ts`, `registry/agent-registry.ts`
- Settings: `packages/coding-agent/src/config/settings-schema.ts`
- Model registry: `packages/coding-agent/src/config/model-registry.ts`, `model-resolver.ts`

---

## 1. Overview

The task tool launches subagents — child agent sessions that run in parallel within the same process. Each subagent is an independent agent session with its own conversation history, tool access, and model configuration. Subagents cannot see the parent conversation; they receive only what is explicitly passed via `assignment`, `context`, and workspace files.

### High-level flow

1. Parent calls the `task` tool with an `agent` type and a batch of `tasks`.
2. The tool discovers available agent definitions from filesystem and bundled sources.
3. For each task, it creates a child `AgentSession` with:
   - Isolated settings snapshot
   - The agent's system prompt, model, tool whitelist, and spawn policy
   - Shared `context` (if allowed by mode)
   - Output schema (resolved from task call → agent frontmatter → parent session)
4. Child sessions run in parallel (bounded by `task.maxConcurrency`).
5. Each child must finish via the hidden `yield` tool. If it doesn't, up to 3 reminder prompts are sent; the last forces `toolChoice = yield`.
6. Results are aggregated and returned to the parent with `agent://<id>` handles for full output.

### Key concepts

| Concept | Description |
|---------|-------------|
| **Agent definition** | A markdown file with YAML frontmatter defining an agent's name, model, tools, system prompt, etc. |
| **Agent type** | The `agent` field in a task call — selects which agent definition to use for the batch |
| **Task item** | One unit of work: `{ id, description, assignment }` — the child sees only `assignment` |
| **Context** | Optional shared background string prepended to every task item's assignment |
| **Isolation** | Optional git worktree/FUSE overlay per task, preventing file-level conflicts between parallel tasks |
| **IRC** | In-process message passing between live subagents; not a real IRC server |
| **Schema** | Optional structured-output schema enforced on subagent `yield` output |

---

## 2. Agent Definition Files

Agent definitions are markdown files (`.md`) with YAML frontmatter. They control everything about how a subagent behaves: which model it uses, which tools it can access, what system prompt it receives, and whether it can spawn its own subagents.

### 2.1 File format

```markdown
---
name: my-custom-agent
description: Does X, Y, and Z
model: anthropic/claude-sonnet-4-20250514
thinkingLevel: high
tools: read,search,find,edit,write,bash,lsp
spawns: explore,quick_task
blocking: true
output:
  type: object
  properties:
    summary:
      type: string
    files:
      type: array
      items:
        type: string
---

You are a specialized agent for X. Follow these rules:
- Rule 1
- Rule 2
```

The YAML frontmatter is between `---` delimiters. The markdown body becomes the agent's `systemPrompt`.

### 2.2 Frontmatter fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | `string` | **Yes** | — | Agent identifier. Must be unique across all discovered agents. Case-sensitive. |
| `description` | `string` | **Yes** | — | Short description of what this agent does. Used in tool descriptions and UI. |
| `systemPrompt` | `string` | No | Markdown body | The agent's system prompt. If omitted, the markdown body is used. |
| `model` | `string` | No | Session default | Model selector for this agent. Accepts: `provider/modelId`, canonical id, or bare model id. Resolved through `ModelResolver`. |
| `thinkingLevel` | `string` | No | Model default | Reasoning effort. Values: `off`, `minimal`, `low`, `medium`, `high`, `xhigh`. |
| `tools` | `string` or `string[]` | No | All built-in | Tool whitelist. CSV string (`"read,search,edit"`) or YAML array. The `yield` tool is auto-added. |
| `spawns` | `string` or `string[]` | No | — | Which agent types this agent can spawn via the `task` tool. Accepts `*` (all), CSV, or YAML array. Backward-compat: if `spawns` is missing but `tools` includes `task`, `spawns` becomes `*`. |
| `output` | `object` | No | — | Structured output schema (JTD). Enforced when the subagent calls `yield`. |
| `blocking` | `boolean` | No | `false` | If `true`, forces synchronous (blocking) execution even when async mode is enabled. |

### 2.3 Validation rules

- Missing `name` or `description` → parse failure → agent is skipped with a warning.
- `tools` is parsed as CSV or array; `yield` is auto-appended.
- `spawns` is parsed as `*`, CSV, or array.
- Frontmatter parse errors at `warn` level: a warning is logged, then a simple `key: value` line parser is tried as fallback. If required fields are still missing, the file is skipped.

### 2.4 File locations

Agent definitions are discovered from multiple directory roots. Within each root, files are placed directly in an `agents/` subdirectory:

```
<root>/agents/
  ├── my-agent.md
  └── another-agent.md
```

Each `.md` file in the directory is parsed as an agent definition. Files are read in lexicographic filename order.

### 2.5 Discovery order and precedence

Agents are discovered in this order (first match by name wins):

```
1. Project-level directories (nearest ancestor first)
   <cwd>/.omp/agents/           (native, priority 100)
   <cwd>/.claude/agents/        (priority 80)
   <cwd>/.codex/agents/         (priority 70)
   <cwd>/.gemini/agents/        (priority 60)

2. User-level directories
   ~/.omp/agent/agents/          (native, priority 100)
   ~/.claude/agents/             (priority 80)
   ~/.codex/agents/              (priority 70)
   ~/.gemini/agents/             (priority 60)

3. Plugin agent directories
   Project-scope plugin agents/
   User-scope plugin agents/

4. Bundled agents (embedded at build time)
   explore, plan, designer, reviewer, task, quick_task, librarian, oracle
```

**Collision rules:**
- Same name → first discovered wins (higher-priority source overrides lower).
- Project overrides user for the same source family (`.omp` project before `.omp` user).
- `.omp` overrides `.claude` overrides `.codex` overrides `.gemini`.
- Non-bundled overrides bundled by the same name.
- Case-sensitive: `Task` and `task` are distinct agents.

**Re-discovery:** `TaskTool.create()` caches agents for tool description rendering. `#executeSync()` re-discovers agents from disk on every call, so runtime agent set can differ from what was listed earlier in the session if files changed mid-session.

### 2.6 Overriding bundled agents

To replace a bundled agent (e.g., customize `task` or `explore`), place a file with the same `name` in any discoverable `agents/` directory:

```markdown
---
name: explore
description: Custom read-only scout with project-specific output format
model: anthropic/claude-haiku-4-5
tools: read,search,find,lsp,web_search
output:
  type: object
  properties:
    summary: { type: string }
    files: { type: array, items: { type: string } }
---

You are a read-only codebase scout for the Acme project...
```

This file at `.omp/agents/explore.md` will shadow the bundled `explore` agent.

---

## 3. Bundled Agents

Eight agent types are embedded at build time in `packages/coding-agent/src/task/agents.ts`. Their definitions use `parseAgent(..., "bundled", "fatal")` — malformed bundled frontmatter throws and can fail discovery entirely.

| Agent | Role | Default Model | Default Tools | Can Spawn | Description |
|-------|------|---------------|---------------|-----------|-------------|
| `explore` | Read-only codebase scout | Session default | `read`, `search`, `find`, `lsp`, `web_search` | None | Fast read-only scout returning structured handoff output. Cannot edit files. |
| `plan` | Architecture/planning | Session default | Restricted subset | `explore` | Software architect for complex multi-file decisions. May spawn `explore` for scouting. Not for simple tasks or single-file changes. |
| `designer` | UI/UX specialist | Session default | Full set | None | UI/UX specialist for design implementation, review, and visual refinement. |
| `reviewer` | Code review | Session default | Full set + `report_finding` | None | Code review specialist with `report_finding` extraction for structured findings. |
| `librarian` | External library research | Session default | Full set | None | Researches external libraries and APIs by reading source code. Returns source-verified answers. |
| `oracle` | Senior engineer consultation | Session default | Full set | None | Wise senior engineer for debugging, architecture, second opinions, and hands-on implementation. |
| `task` | General-purpose worker | Session default | Full set | `*` (all) | General-purpose subagent with full capabilities for delegated multi-step tasks. Can spawn any other agent type (subject to recursion depth). |
| `quick_task` | Low-reasoning mechanical worker | Session default | Full set | `*` (all) | Low-reasoning agent for strictly mechanical updates or data collection only. Uses the same prompt body as `task`. |

### Notes

- `explore` and `reviewer` have built-in structured output schemas. Output-format instructions in prose assignment text can conflict with these built-in schemas and produce `null` outputs. Avoid redundant format instructions for these agents.
- `task` and `quick_task` share the same prompt body from `packages/coding-agent/src/prompts/agents/task.md`, but `quick_task` gets injected frontmatter that signals low-reasoning mode.
- Plan mode (parent-level) overrides any selected agent: prepends plan-mode subagent system prompt, restricts tools to `read`, `search`, `find`, `lsp`, `web_search`, and clears child spawns.

---

## 4. Global Settings (`~/.omp/agent/config.yml`)

Settings are layered: `defaults ← global (config.yml) ← project ← runtime overrides`.

File: `~/.omp/agent/config.yml` (global). Project settings discovered via capability providers.

### 4.1 Task execution settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `task.maxConcurrency` | `number` | — | Maximum number of subagents running in parallel. Controls `Semaphore()` in async mode and `mapWithConcurrencyLimit()` in sync mode. |
| `task.maxRecursionDepth` | `number` | — | Maximum nesting depth for subagent spawning. At or past this depth, the `task` tool is removed from the child's available tools and `spawns` is set to empty. |
| `task.disabledAgents` | `string[]` | `[]` | Blacklist of agent names that cannot be spawned. Checked after agent resolution; results in immediate error with list of available alternatives. |
| `task.simple` | `string` | `"default"` | Controls which task tool fields are accepted. See §7.2 Simple Modes. |
| `task.isolation.enabled` | `boolean` | `false` | Whether the `isolated` parameter appears on the task tool. When `false`, the field is hidden from the schema. |
| `task.isolation.mode` | `string` | — | Isolation backend: `"worktree"`, `"fuse-overlay"`, `"fuse-projfs"`. See §7.3 Isolation. |

### 4.2 Model role settings

Model roles map symbolic names to concrete models. Each role can point to:
- A concrete `provider/modelId` (pins to exact variant)
- A canonical id (allows provider coalescing)
- Optionally append a thinking selector: `:minimal`, `:low`, `:medium`, `:high`

If a role points at another role, the target model inherits normally; explicit suffix on the referring role wins for that role-specific use.

| Role | Purpose | Affects |
|------|---------|---------|
| `modelRoles.default` | Main session model | Parent session, fallback for all roles |
| `modelRoles.smol` | Fast/cheap model | `eval` tool `llm(model: "smol")`, internal cheap operations |
| `modelRoles.slow` | Most capable model | `eval` tool `llm(model: "slow")`, complex reasoning |
| `modelRoles.task` | Subagent model | Default model for all subagent sessions |
| `modelRoles.plan` | Planning model | Plan-mode agent |
| `modelRoles.designer` | Design model | `designer` agent |
| `modelRoles.commit` | Commit generation | Commit message creation |
| `modelRoles.vision` | Vision model | Image analysis tasks |

**Precedence:** Agent frontmatter `model` field overrides `modelRoles.task` for that specific agent.

### 4.3 Model filtering settings

| Setting | Type | Description |
|---------|------|-------------|
| `enabledModels` | `ScopedPatternList` | Allowlist of model patterns. Supports exact canonical ids, `provider/modelId`, and globs (`openai/*`, `*sonnet*`). Empty = all enabled. |
| `disabledProviders` | `ScopedPatternList` | Blacklist of provider names. |
| `modelProviderOrder` | `string[]` | Global provider precedence for canonical model coalescing. |

**Scoped entries** support path-scoping:

```yaml
enabledModels:
  - claude-sonnet-4-5
  - path: ~/work
    models:
      - anthropic/claude-opus-4-5
disabledProviders:
  - ollama
  - path: ~/private
    providers:
      - anthropic
```

String entries apply everywhere. Scoped entries apply when `cwd` is the configured path or a subdirectory. Keys `path`/`paths`/`pathPrefix`/`pathPrefixes` are interchangeable; use `models` for `enabledModels`, `providers` for `disabledProviders`, or `values` for either.

### 4.4 IRC settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `irc.enabled` | `boolean` | `true` | Enable/disable IRC tool for subagent coordination. Subagents inherit this setting. |
| `irc.timeoutMs` | `number` | `120000` | Timeout in ms for IRC reply waits. `0` disables timeout (parent abort still works). Non-finite values fall back to default. Positive values clamped to ≥ 1ms. |

### 4.5 Async settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `async.enabled` | `boolean` | — | Enable async task execution. When off, all tasks run synchronously. |

### 4.6 Provider-specific settings

| Setting | Description |
|---------|-------------|
| `providers.tinyModelDevice` | ONNX execution provider for local tiny models. Overridden by `PI_TINY_DEVICE`. |
| `providers.tinyModelDtype` | ONNX quantization for local tiny models. Overridden by `PI_TINY_DTYPE`. |
| `providers.kimiApiFormat` | Kimi request format: `"openai"` or `"anthropic"`. |
| `providers.openaiWebsockets` | OpenAI Codex websocket transport: `"auto"`, `"off"`, `"on"`. |

### 4.7 Settings file format

Supported formats: `.yml` / `.yaml` (preferred), `.json` / `.jsonc` (legacy).

Legacy migration still active:
- If `config.yml` is missing, migrates from `~/.omp/agent/settings.json` (renamed to `.bak` on success).
- Merges with legacy DB settings from `agent.db`.
- Field-level migrations: `queueMode` → `steeringMode`, `ask.timeout` ms → seconds, flat `theme` → `theme.dark/light`.

---

## 5. Model Configuration (`~/.omp/agent/models.yml`)

The model registry controls which models are available, how they authenticate, and how they're routed. File: `~/.omp/agent/models.yml` (or `.json`/`.jsonc` for legacy).

### 5.1 Top-level structure

```yaml
providers:
  <provider-id>:
    # provider-level config (see §5.2)
equivalence:
  overrides:
    <provider-id>/<model-id>: <canonical-model-id>
  exclude:
    - <provider-id>/<model-id>
```

### 5.2 Provider-level fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `baseUrl` | `string` | Yes (full provider) | API endpoint base URL |
| `apiKey` | `string` | Yes (unless `auth: none`) | Env var name OR literal API key. Checked as env var first, then used as literal. |
| `api` | `string` | Yes (at provider or model level) | Transport API. See §5.4. |
| `auth` | `string` | No | `"apiKey"` (default), `"none"`, `"oauth"` |
| `authHeader` | `boolean` | No | If `true` + `apiKey` set → injects `Authorization: Bearer <key>` |
| `headers` | `object` | No | Extra HTTP headers merged into every request |
| `disableStrictTools` | `boolean` | No | Set `true` for Anthropic-fronted proxies that reject `strict` |
| `discovery` | `object` | No | Runtime model discovery config. See §5.5. |
| `modelOverrides` | `object` | No | Per-model metadata overrides keyed by model id |
| `models` | `array` | No | Custom model definitions. See §5.3. |

### 5.3 Model definition fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Model identifier within the provider |
| `name` | `string` | No | Display name |
| `api` | `string` | No | Per-model API override (falls back to provider `api`) |
| `reasoning` | `boolean` | No | Whether this is a reasoning model |
| `thinking` | `boolean` | No | Whether thinking/reasoning is supported |
| `input` | `string[]` | No | Input modalities: `[text]`, `[text, image]` |
| `contextWindow` | `number` | No | Context window size in tokens |
| `maxTokens` | `number` | No | Max output tokens |
| `cost` | `object` | No | `{ input, output, cacheRead?, cacheWrite? }` per million tokens |
| `premiumMultiplier` | `number` | No | Cost multiplier |
| `headers` | `object` | No | Per-model HTTP headers (override provider headers by key) |
| `compat` | `object` | No | Compatibility flags. See §5.6. |
| `contextPromotionTarget` | `string` | No | Model to promote to on context overflow. See §5.7. |

### 5.4 Allowed `api` values

| Value | Provider |
|-------|----------|
| `openai-completions` | OpenAI Chat Completions API |
| `openai-responses` | OpenAI Responses API |
| `openai-codex-responses` | OpenAI Codex Responses (websocket-capable) |
| `azure-openai-responses` | Azure OpenAI |
| `anthropic-messages` | Anthropic Messages API |
| `google-generative-ai` | Google Gemini |
| `google-vertex` | Google Vertex AI |

### 5.5 Discovery types

| `discovery.type` | Behavior |
-------------------|----------|
| `ollama` | Queries Ollama API for local models |
| `llama.cpp` | Queries llama.cpp server for local models |
| `lm-studio` | Queries LM Studio for local models |
| `openai-models-list` | Queries `GET /models` endpoint |
| `proxy` | Auto-detects per-model API from `supported_endpoint_types` (Anthropic vs OpenAI) |

Implicit discovery (no config needed):
- `ollama`: `OLLAMA_BASE_URL` or `http://127.0.0.1:11434`
- `llama.cpp`: `LLAMA_CPP_BASE_URL` or `http://127.0.0.1:8080`
- `lm-studio`: `LM_STUDIO_BASE_URL` or `http://127.0.0.1:1234/v1`

### 5.6 Compatibility (`compat`) fields

All optional. Provider-level `compat` is baseline; per-model `compat` is deep-merged on top. Nested objects (`openRouterRouting`, `vercelGatewayRouting`, `extraBody`) are merged, not replaced.

#### Request shaping

| Field | Default | Description |
|-------|---------|-------------|
| `supportsStore` | auto | Emit `store: false` on requests |
| `supportsDeveloperRole` | auto | Use `developer` role for reasoning models |
| `supportsMultipleSystemMessages` | auto | Preserve separate system/developer messages |
| `supportsUsageInStreaming` | `true` | Send `stream_options: { include_usage: true }` |
| `maxTokensField` | auto | `"max_completion_tokens"` or `"max_tokens"` |
| `supportsToolChoice` | `true` | Emit `tool_choice` parameter |
| `disableReasoningOnForcedToolChoice` | auto | Drop reasoning when `tool_choice` is forced |
| `disableReasoningOnToolChoice` | auto | Drop reasoning when any `tool_choice` is set |
| `extraBody` | — | Extra top-level fields merged into every request body |

#### Reasoning / thinking

| Field | Default | Description |
|-------|---------|-------------|
| `supportsReasoningEffort` | auto | Accept `reasoning_effort` parameter |
| `reasoningEffortMap` | — | Map internal levels to provider-specific strings |
| `thinkingFormat` | `"openai"` | `"openai"`, `"openrouter"`, `"zai"`, `"qwen"`, `"qwen-chat-template"` |
| `reasoningContentField` | auto | `"reasoning_content"`, `"reasoning"`, or `"reasoning_text"` |
| `requiresReasoningContentForToolCalls` | `false` | Round-trip reasoning field on tool-call turns |
| `allowsSyntheticReasoningContentForToolCalls` | `true` | Allow placeholder reasoning on tool-call turns |
| `requiresAssistantContentForToolCalls` | `false` | Non-empty text content required on tool-call turns |

#### Tool / message normalization

| Field | Default | Description |
|-------|---------|-------------|
| `requiresToolResultName` | auto | Tool results need `name` field (Mistral) |
| `requiresAssistantAfterToolResult` | auto | User message after tool result needs assistant turn |
| `requiresThinkingAsText` | auto | Convert thinking blocks to `<thinking>` wrapped text |
| `requiresMistralToolIds` | auto | Normalize tool-call ids to exactly 9 alphanumeric chars |
| `supportsStrictMode` | auto | Accept per-tool `strict` field |
| `toolStrictMode` | mixed | `"all_strict"` or `"none"` to force all/no tools |

#### Gateway routing

| Field | Description |
|-------|-------------|
| `openRouterRouting.only` | Provider routing on openrouter.ai |
| `openRouterRouting.order` | Provider routing order on openrouter.ai |
| `vercelGatewayRouting.only` | Provider routing on Vercel AI Gateway |
| `vercelGatewayRouting.order` | Provider routing order on Vercel AI Gateway |

### 5.7 Context promotion (overflow fallback)

When a request fails with a context overflow error, the session attempts promotion before compaction:

1. If `contextPromotion.enabled` is true, resolve a promotion target.
2. Target selection: `currentModel.contextPromotionTarget` → smallest larger-context model on same provider + API.
3. Switch to target model and retry — no compaction needed.
4. If no target available, fall through to auto-compaction on current model.

Promotion uses temporary switching (`setModelTemporary`) — does not rewrite saved role mapping.

`contextPromotionTarget` accepts: `provider/model-id` (explicit) or `model-id` (resolved within current provider).

### 5.8 Model equivalence and canonical grouping

The registry builds a canonical layer above concrete provider models:

1. Exact user override from `equivalence.overrides`
2. Bundled official-id matches from built-in model metadata
3. Conservative heuristic normalization (strip embedded upstream prefixes, match version variants)
4. Fallback to concrete model's own id

When multiple concrete variants share a canonical id, resolution uses: availability + auth → `modelProviderOrder` → registry order.

### 5.9 Auth resolution order

For a given provider:

1. Runtime override (CLI `--api-key`)
2. Stored API key credential in `agent.db`
3. Stored OAuth credential in `agent.db` (with refresh)
4. Environment variable mapping (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.)
5. `ModelRegistry` fallback resolver (`models.yml` provider `apiKey`)

Keyless providers (`auth: none`) are treated as available without credentials.

### 5.10 Merge and override order

Registry refresh pipeline:

1. Load built-in providers/models from `@oh-my-pi/pi-ai`.
2. Load `models.yml` custom config.
3. Apply provider overrides (`baseUrl`, `headers`, `disableStrictTools`) to built-in models.
4. Apply `modelOverrides` (per provider + model id).
5. Merge custom `models` (same `provider + id` replaces; otherwise append).
6. Load cached/runtime-discovered models (Ollama, llama.cpp, LM Studio).
7. Re-apply model overrides.

### 5.11 Example configurations

#### Local Ollama (no auth)

```yaml
providers:
  ollama:
    baseUrl: http://127.0.0.1:11434
    api: openai-responses
    auth: none
    discovery:
      type: ollama
```

#### Custom provider with specific model

```yaml
providers:
  custom:
    baseUrl: https://api.example.com/v1
    apiKey: CUSTOM_API_KEY
    api: openai-completions
    models:
      - id: my-model
        name: My Model
        reasoning: false
        input: [text]
        contextWindow: 128000
        maxTokens: 8192
        cost:
          input: 0
          output: 0
```

#### Override built-in model metadata

```yaml
providers:
  openrouter:
    modelOverrides:
      anthropic/claude-sonnet-4:
        name: Sonnet 4 (Corp)
        compat:
          openRouterRouting:
            only: [anthropic]
```

---

## 6. Per-Call Parameters (Task Tool Invocation)

These are the parameters passed when calling the `task` tool. Availability of some fields depends on the `task.simple` mode (see §7.2).

### 6.1 Default mode (`task.simple = "default"`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent` | `string` | Yes | Agent type name. Resolved at execution time via `discoverAgents()`. |
| `tasks` | `Array<{ id, description, assignment }>` | Yes | Batch of task items. See §6.2. |
| `context` | `string` | No | Shared background prepended to every subagent's system prompt. |
| `schema` | `string` | No | JSON-encoded JTD schema. Overrides agent/session output schema. |
| `isolated` | `boolean` | No | Request isolated execution. Only present when `task.isolation.enabled` is true. |

### 6.2 Task item fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | CamelCase identifier, max 48 chars. Used for IRC addressing and `agent://` URLs. Case-insensitive duplicates are rejected at runtime. |
| `description` | `string` | Yes | UI label only. The subagent **never** sees this. |
| `assignment` | `string` | Yes | Complete self-contained instructions. The subagent sees only this (+ shared `context` if applicable). One-liners and missing acceptance criteria are rejected. |

### 6.3 Schema-free mode (`task.simple = "schema-free"`)

Same as default mode, except `schema` is **rejected**. `context` is still accepted.

### 6.4 Independent mode (`task.simple = "independent"`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent` | `string` | Yes | Agent type name. |
| `tasks` | `Array<{ id, description, assignment }>` | Yes | Each `assignment` must carry all required background. |
| `isolated` | `boolean` | No | Request isolated execution. |

Both `context` and `schema` are **rejected**.

### 6.5 Output schema precedence

The effective output schema for a subagent is resolved in this priority order:

1. Task call `schema` parameter (if allowed by mode)
2. Agent frontmatter `output` field
3. Parent session `outputSchema`

### 6.6 Output and artifacts

Each subagent that completes produces:
- `<id>.md` — full raw output artifact (always written, even if truncated in the inline response)
- `<id>.jsonl` — session history (when parent persists artifacts)
- `agent://<id>` — URL handle for reading the full output via the `read` tool
- `agent://<id>/<path>` — JSON field extraction (if output is JSON)
- `agent://<id>?q=<query>` — JSON query (if output is JSON)

Inline summary in the parent response: full output up to 5000 chars (`fullOutputThreshold`). Longer outputs are summarized with `agent://<id>` reference.

### 6.7 Validation errors (returned as text, not exceptions)

- Invalid simple-mode fields
- Unknown or disabled agent
- Missing tasks
- Missing or duplicate task ids
- Spawn-policy denial
- `isolated` requested when isolation mode is `none`

### 6.8 Payload delivery

Large payloads should be passed via `local://path` URIs in the assignment, not inlined. The `local://` root is shared between parent and subagents.

---

## 7. Execution Modes

### 7.1 Sync vs Async execution

| Mode | When | Behavior |
|------|------|----------|
| **Sync** | `async.enabled` is false, OR selected agent has `blocking: true`, OR `tasks.length === 0` | Tasks run inline, parent waits for all to complete. Uses `mapWithConcurrencyLimit()` bounded by `task.maxConcurrency`. |
| **Async** | `async.enabled` is true AND agent is not `blocking` | Tasks run as background jobs via `session.asyncJobManager`. Parent gets immediate response with `async: { state, jobId }`. Progress snapshots emitted via `onUpdate()`. Semaphore-bounded concurrency. |

Async path details:
- One async job per task item registered via `session.asyncJobManager.register(...)`.
- `Semaphore(task.maxConcurrency)` limits concurrent job bodies.
- Each job body calls `#executeSync(...)` with a one-task batch.
- Parent can track progress via `details.progress` and `details.async`.

### 7.2 Simple modes

Controlled by `task.simple` in `config.yml`. Determines which fields the task tool accepts.

| Mode | `context` | `schema` | Notes |
|------|-----------|----------|-------|
| `default` | ✅ Accepted | ✅ Accepted | Full feature set. |
| `schema-free` | ✅ Accepted | ❌ Rejected | No structured output enforcement at task level. |
| `independent` | ❌ Rejected | ❌ Rejected | Each assignment must be fully self-contained. |

### 7.3 Isolation

When `task.isolation.enabled` is `true` and `isolated: true` is passed in the task call, each task runs in its own workspace to prevent file conflicts between parallel subagents.

**Requirements:** Git repository at `cwd`. Isolated execution without a git repo returns an error.

**Backend resolution** (`resolveIsolationBackendForTaskExecution`):

| Backend | Platform | Mechanism |
|---------|----------|-----------|
| `worktree` | All | Detached git worktree + baseline replay |
| `fuse-overlay` | Linux/macOS | FUSE overlay mount (`fuse-overlayfs`, `fusermount`/`fusermount3`) |
| `fuse-projfs` | Windows | ProjFS overlay via `@oh-my-pi/pi-natives` |

Platform fallback: `fuse-projfs` on Windows → `worktree`. Backend resolution can return non-fatal warnings with fallback.

**Merge strategies:**

| Strategy | Behavior |
|----------|----------|
| **Patch mode** (default) | Each successful task produces a `<id>.patch`. Patches are combined, dry-checked with `git.patch.canApplyText(...)`, then applied. Failed application leaves patch artifacts for manual resolution. |
| **Branch mode** | Each task commits to `omp/task/<id>` branch. After all tasks complete, branches are cherry-picked into parent. Failed merges preserve branches. Temporary stash of parent repo before cherry-pick. |

**Nested repos:** Nested git repos are handled separately — copied into worktrees, diffed independently, merged with `applyNestedPatches()`.

### 7.4 Recursion depth

Controlled by `task.maxRecursionDepth`.

- At or past max depth: `task` tool is removed from child's available tools, and `spawns` is set to empty.
- Depth is tracked via `taskDepth` context passed through child session creation.

### 7.5 Child session characteristics

Each child `AgentSession` receives:

- **Isolated settings snapshot** via `Settings.isolated(...)`: forces `async.enabled = false` and `bash.autoBackground.enabled = false`.
- **Agent definition**: system prompt, model, thinking level, tool whitelist, spawn policy.
- **Shared `context`** (if mode allows it).
- **Optional `context.md`** reference (from parent session compact context).
- **Output schema** (resolved per §6.5).
- **IRC peer roster** for coordination.
- **Shared `local://` root** for file passing.
- **Shared MCP connections** via proxy tools (parent `mcpManager` reused; 60,000 ms timeout).
- **Workspace tree, skills, context files** (AGENTS.md, etc.) loaded from `cwd`.

### 7.6 Child tool availability

Derived from agent definition + runtime guards:

1. If agent has explicit `tools` list → use that list.
2. Auto-add `task` when agent has `spawns` and recursion depth allows it.
3. Expand `exec` to `eval` and `bash`.
4. Strip parent-owned `todo_write` after session creation.
5. At max recursion depth → remove `task` entirely.

### 7.7 Yield enforcement

Each child must finish by calling the hidden `yield` tool. If it doesn't:

1. Up to 3 reminder prompts sent to the child.
2. Last reminder forces `toolChoice = yield` (when supported by provider).
3. If child still doesn't yield: `finalizeSubprocessOutput(...)` injects a warning: `"SYSTEM WARNING: Subagent exited without calling yield tool after 3 reminders."`

### 7.8 Failure handling

- `mapWithConcurrencyLimit()` fails fast on non-abort worker exceptions. Already completed results are preserved in thrown path's local state.
- Child-session failures surface as `SingleResult.exitCode = 1` with `stderr`/`error` populated.
- Parent abort stops scheduling new work, aborts active child sessions, marks unscheduled tasks as skipped.
- Isolation cleanup always runs regardless of success/failure (worktree removal, overlay unmount).

---

## 8. IRC Coordination

In-process message passing between live subagents. Not a real IRC server — no servers, sockets, channels, or auth handshakes. Addressing is by exact agent id from the process-global `AgentRegistry`.

### 8.1 Availability

- Requires `irc.enabled = true` (default).
- Main agent: `irc` tool is **hidden** when `async.enabled` is off (main agent has no concurrent peers in sync mode).
- Subagents: inherit `irc.enabled` from task executor settings.
- Tool only constructed when session has both an `AgentRegistry` and `getAgentId`.

### 8.2 Operations

#### `op: "list"`

Lists peers visible to the caller. Returns:
- `"No other live agents."` if no peers
- Bullet list of peers with id and status
- `channels`: `['all', ...peerIds]` (synthetic — no join/part state)

Visibility: only peers in status `running` or `idle` via `listVisibleTo(senderId)`.

#### `op: "send"`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `op` | `"send"` | Yes | — | Send a message |
| `to` | `string` | Yes | — | Peer id (e.g. `0-Main`) or `"all"` for broadcast. Whitespace trimmed. |
| `message` | `string` | Yes | — | Message body. Whitespace trimmed; empty-after-trim rejected. |
| `awaitReply` | `boolean` | No | `true` (direct), `false` (broadcast) | Wait for prose replies. |

### 8.3 Reply behavior

- `awaitReply = true`: recipient performs a no-tools ephemeral LLM turn (`runEphemeralTurn` with `toolChoice: "none"`) and returns prose.
- `awaitReply = false`: recipient records the incoming message but does not generate a reply.
- Replies are generated from `packages/coding-agent/src/prompts/system/irc-incoming.md`.
- No tools available in auto-reply turns.

### 8.4 Message delivery

- Each target dispatched in parallel via `target.session.respondAsBackground(...)`.
- One slow or failing peer does not block dispatch to others.
- Deferred injection: messages are queued and injected after the recipient finishes its current stream (polls every 50ms).
- Timeout: bounded by `irc.timeoutMs` (default 120,000ms). `0` disables timeout. Parent aborts still abort dispatch.

### 8.5 Agent ID naming

Agent IDs are numeric-prefixed by `AgentOutputManager`: `0-Main`, `1-Task`, `0-Parent.0-Child` (nested). This prevents artifact collisions across repeated or nested task invocations. Addressing is by exact agent id — no fuzzy lookup or aliasing.

### 8.6 Persistence

- Per recipient history, not per sender history. Sender gets the tool result; recipient later sees injected custom messages on its next turn.
- Main UI may show IRC relays for conversations it was not part of — these are display-only, not persisted to main agent history.

### 8.7 Error handling

All errors returned as text results, not thrown:
- Missing registry: `"IRC is unavailable in this session."`
- Missing sender id: `"IRC is unavailable: caller has no agent id."`
- Unknown/unavailable/self-addressed targets: reported under `details.notFound`.
- Per-target dispatch failures: caught and surfaced under `details.failed` as `{ id, error }`. Other recipients still complete.
- No successful recipients: `"No recipients received the message."`

---

## 9. Environment Variables

Env resolution via `$env` (`packages/utils/src/env.ts`). Loading order:

1. Existing process environment (`Bun.env`)
2. Project `.env` (`$PWD/.env`) for unset keys
3. Agent `.env` (`~/.omp/agent/.env`) for unset keys
4. Config-root `.env` (`~/.omp/.env`) for unset keys
5. Home `.env` (`~/.env`) for unset keys

Additional rule: within each `.env` file, `OMP_*` keys are mirrored to `PI_*`.

### 9.1 Task/subagent variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PI_TASK_MAX_OUTPUT_BYTES` | `500000` | Max captured output bytes per subagent. Full raw output still written to `<id>.md` before truncation. |
| `PI_TASK_MAX_OUTPUT_LINES` | `5000` | Max captured output lines per subagent. |
| `PI_BLOCKED_AGENT` | — | Blocks a specific subagent type by name. Checked at tool construction time. |
| `PI_SUBPROCESS_CMD` | — | Overrides subagent spawn command (`omp` / `omp.cmd` resolution bypass). |

### 9.2 Model role override variables

These provide ephemeral, single-session overrides. CLI flags take precedence.

| Variable | Overrides |
|----------|-----------|
| `PI_SMOL_MODEL` | `modelRoles.smol` |
| `PI_SLOW_MODEL` | `modelRoles.slow` |
| `PI_PLAN_MODEL` | `modelRoles.plan` |

### 9.3 Model provider credentials (subset relevant to subagents)

Subagents use the same model provider as resolved by the agent definition + model roles. They inherit parent auth.

| Variable | Provider |
|----------|----------|
| `ANTHROPIC_OAUTH_TOKEN` | Anthropic (highest precedence) |
| `ANTHROPIC_API_KEY` | Anthropic (fallback) |
| `ANTHROPIC_FOUNDRY_API_KEY` | Anthropic Foundry mode |
| `OPENAI_API_KEY` | OpenAI |
| `GEMINI_API_KEY` | Google Gemini |
| `OPENROUTER_API_KEY` | OpenRouter |
| `DEEPSEEK_API_KEY` | DeepSeek |
| `XAI_API_KEY` | xAI |
| `OLLAMA_API_KEY` | Ollama (optional for auth) |
| `LM_STUDIO_API_KEY` | LM Studio (optional) |

### 9.4 Local model discovery URLs

| Variable | Default | Provider |
|----------|---------|----------|
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` | Ollama |
| `LLAMA_CPP_BASE_URL` | `http://127.0.0.1:8080` | llama.cpp |
| `LM_STUDIO_BASE_URL` | `http://127.0.0.1:1234/v1` | LM Studio |

### 9.5 Runtime behavior toggles

| Variable | Description |
|----------|-------------|
| `PI_NO_INTERLEAVED_THINKING` | Disables Anthropic interleaved thinking; uses output-token inflation instead |
| `PI_CACHE_RETENTION` | If `"long"`, enables long cache retention where supported |
| `NULL_PROMPT` | If `"true"`, system prompt builder returns empty string |
| `PI_NO_TITLE` | Disables auto session title generation |
| `PI_NO_PTY` | Disables interactive PTY path for bash tool |
| `PI_BASH_NO_CI` | Suppresses automatic `CI=true` injection |
| `PI_BASH_NO_LOGIN` | Disables login-shell mode |
| `PI_SHELL_PREFIX` | Optional command prefix wrapper for shell commands |

### 9.6 Auth broker variables

| Variable | Description |
|----------|-------------|
| `OMP_AUTH_BROKER_URL` | Remote auth-broker base URL; selects broker mode. Wins over `auth.broker.url` in config. |
| `OMP_AUTH_BROKER_TOKEN` | Bearer token for broker. Resolution: this env → `auth.broker.token` → `<config-dir>/auth-broker.token`. |

### 9.7 Storage and config paths

| Variable | Default | Description |
|----------|---------|-------------|
| `PI_CONFIG_DIR` | `.omp` | Config root dirname under home |
| `PI_CODING_AGENT_DIR` | `~/<PI_CONFIG_DIR>/agent` | Full override for agent directory |

### 9.8 MCP timeout

| Variable | Default | Description |
|----------|---------|-------------|
| `OMP_MCP_TIMEOUT_MS` | `30000` | Overrides MCP client request timeout for every MCP server. `0` disables client-side timeouts. |

---

## 10. Limits & Caps

All hard-coded runtime limits from the implementation.

### 10.1 Task tool

| Limit | Value | Location |
|-------|-------|----------|
| Per-subagent max output bytes | `500,000` (overridable via `PI_TASK_MAX_OUTPUT_BYTES`) | `task/types.ts` |
| Per-subagent max output lines | `5,000` (overridable via `PI_TASK_MAX_OUTPUT_LINES`) | `task/types.ts` |
| Progress coalesce interval | `150ms` | `task/executor.ts` |
| Recent output tail for progress | `8,192 bytes` / last 8 non-empty lines | `task/executor.ts` |
| Yield reminder retries | `3` | `task/executor.ts` |
| MCP proxy timeout | `60,000ms` | `task/executor.ts` |
| Task id max length | `48` (schema) / `≤32` (prompt text) — mismatch is real | `task/types.ts` |
| Full output inline threshold | `5,000 chars` — longer outputs summarized | `task/index.ts` |

### 10.2 IRC

| Limit | Value | Location |
|-------|-------|----------|
| Default reply timeout | `120,000ms` | `tools/irc.ts` |
| Flush polling interval | `50ms` | `agent-session.ts` |

### 10.3 Model registry

- `getAll()` returns all loaded models (built-in + custom + discovered).
- `getAvailable()` filters to keyless or auth-resolved models.
- Models exist in registry but aren't selectable until auth is available.

### 10.4 Context promotion

Candidates are ignored unless credentials resolve (`ModelRegistry.getApiKey(...)`). Promotion uses `setModelTemporary` — recorded as temporary `model_change`, does not rewrite saved role mapping. OpenAI Codex websocket state is closed before model switch to ensure clean transport.

---

## 11. Config File Locations & Precedence Summary

### 11.1 Config file locations

| File | Location | Purpose |
|------|----------|---------|
| `config.yml` | `~/.omp/agent/config.yml` | Global settings (task, model roles, IRC, etc.) |
| `models.yml` | `~/.omp/agent/models.yml` | Model registry, providers, equivalence |
| `agent.db` | `~/.omp/agent/agent.db` | Stored API keys, OAuth credentials |
| `.env` | `$PWD/.env`, `~/.omp/agent/.env`, `~/.omp/.env`, `~/.env` | Environment variable layering |
| Agent definitions | `<root>/agents/*.md` | Custom agent overrides (see §2.5 for all roots) |
| Skills | `<root>/skills/*/SKILL.md` | Agent skill packs |

### 11.2 Config root discovery order

Source priority (higher wins):

```
native (.omp)          priority 100
claude                 priority  80
codex / agents         priority  70
gemini                 priority  60
```

Within each source: project-level overrides user-level.

### 11.3 Settings resolution

```
defaults ← global (config.yml) ← project ← runtime overrides
```

Write path: `settings.set(...)` writes to global layer (`config.yml`) and queues background save. Project settings are read-only.

### 11.4 Config directory resolution helpers

- `getConfigDirs(subpath)` — ordered user then project entries by source priority.
- `findConfigFile(subpath)` — first existing file across ordered bases.
- `findAllNearestProjectConfigDirs(subpath)` — walks parent dirs upward, returns nearest per source base.
- `ConfigFile<T>` — schema-validated loader for `.yml`/`.yaml`/`.json`/`.jsonc`.

### 11.5 Capability dedup

Capabilities define a `key(item)`:
- Same key → first item wins (higher priority / earlier loaded).
- No key (`undefined`) → no dedup, all items retained.

| Capability | Key |
------------|-----|
| Skills | `name` |
| Tools | `name` |
| Hooks | `${type}:${tool}:${name}` |
| Extensions | `name` |
| Settings | No dedup (all items preserved, deep-merged) |

### 11.6 Directory admission rules

- Slash commands, rules, prompts, instructions, hooks, tools, extensions, settings: root directory must exist and be non-empty.
- Skills: scans ancestor `*/.omp/skills` without requiring the root `.omp` to be non-empty.
- `SYSTEM.md` / `AGENTS.md`: user-level read directly; project-level uses nearest-ancestor lookup with non-empty requirement.
