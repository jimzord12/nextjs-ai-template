# Low Level Design Document
## [Feature Name]

**Feature ID:** LLD-XXX
**Date:** _YYYY-MM-DD_
**HLD Reference:** _HLD document title and version_
**Status:** Draft

---

## 1. Overview

### 1.1 Purpose
_What this infrastructure feature does and why it exists. What problem it solves for the platform._

### 1.2 Scope
_What is included and excluded. Horizontal features often have wide blast radius — be explicit about boundaries._

### 1.3 Dependencies
_External packages, other infrastructure features, runtime requirements. Note version constraints where relevant._

---

## 2. Interface Design

### 2.1 Core Types
_Primary TypeScript interfaces and type signatures that define the contract for this feature._

```typescript
// Core interface — the public API surface consumers depend on
interface ExampleInterface {
  // ...
}

// Configuration shape
type ExampleConfig = {
  // ...
};

// Generic constraints if applicable
type Example<T extends Constraint> = {
  // ...
};
```

### 2.2 Type Exports
_Which types are exported as public API vs internal. Consumers should only depend on public types._

| Export | Kind | Public/Internal | Used By |
|--------|------|-----------------|---------|
| _..._ | _interface / type / enum_ | _Public / Internal_ | _Which features_ |

---

## 3. Adapter / Implementation Contract

### 3.1 Adapter Interface
_What each adapter or implementer must satisfy. This is the contract._

```typescript
interface ExampleAdapter {
  /** Lifecycle: called once at init */
  init(config: ExampleConfig): Promise<void>;

  /** Core operation */
  perform(input: Input): Promise<Output>;

  /** Lifecycle: graceful shutdown */
  teardown(): Promise<void>;
}
```

### 3.2 Public vs Internal API
_Which methods are part of the stable public API and which are internal/protected. Breaking changes to public API require migration._

| Method | Visibility | Stability | Notes |
|--------|-----------|-----------|-------|
| _..._ | _Public / Internal_ | _Stable / Unstable / Experimental_ | _..._ |

### 3.3 Lifecycle Hooks
_Init, configure, teardown ordering. What happens when, and what must be ready before what._

1. _**Init** — What runs at startup, what it validates, what it sets up._
2. _**Configure** — Runtime configuration, how it merges with defaults._
3. **Teardown** — Graceful shutdown, resource cleanup, what must not be left dangling._

---

## 4. Data Flow

### 4.1 Primary Flow
_How data moves through the system from input to output._

```
Input Source → [Validation] → [Transform/Processing] → [Adapter] → Output
                                    ↓
                              [Error Path]
```

### 4.2 Transform Pipeline
_Step-by-step description of each transformation stage. What goes in, what comes out, what can fail._

### 4.3 Error Paths
_What happens on failure at each stage. Retry logic, fallback strategies, where errors surface._

---

## 5. Integration Points

### 5.1 Dependents
_Features that depend on this infrastructure feature. What they consume from it._

| Feature | What It Uses | Coupling Level |
|---------|-------------|----------------|
| _..._ | _Which types / functions / adapters_ | _Tight / Loose_ |

### 5.2 Dependencies
_What this feature depends on. External packages, other infrastructure features._

| Dependency | Version | Purpose | Required/Optional |
|-----------|---------|---------|-------------------|
| _..._ | _..._ | _..._ | _Required / Optional_ |

### 5.3 Coupling Boundaries
_Where this feature draws the line. What consumers should never reach into. What is guaranteed stable vs what may change._

---

## 6. Configuration

### 6.1 Configuration Shape
_Type definition for the configuration object, with defaults noted._

```typescript
interface FeatureConfig {
  /** Description of this option */
  optionA: string; // default: "..."
  optionB?: number; // default: undefined
}
```

### 6.2 Configuration Sources
_Priority order: CLI flags → environment variables → config file → defaults._

| Source | Key | Default | Description |
|--------|-----|---------|-------------|
| _env var / config file / init script_ | _KEY_NAME_ | _value_ | _..._ |

### 6.3 Init Script Integration
_Questions the init script should ask when scaffolding this feature. What must be decided at setup time._

---

## 7. Error Handling

### 7.1 Error Taxonomy
_Custom error classes or error codes this feature defines. Each should be distinguishable by consumers._

```typescript
class FeatureError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
  }
}
```

### 7.2 Error Scenarios
_Table of failure modes, detection, and recovery._

| Scenario | Detection | Recovery | Surface To |
|----------|-----------|----------|------------|
| _Adapter fails to init_ | _Init throws_ | _Fallback / fail-fast_ | _Consumer / Log / Silent_ |
| _Invalid configuration_ | _Validation at init_ | _Throw with guidance_ | _Consumer_ |

### 7.3 Fallback Strategy
_What happens when the primary path fails. Graceful degradation behavior. What the consumer sees vs what gets logged._

---

## 8. Testing Strategy

### 8.1 Contract Tests
_Tests that verify the interface contract. Every adapter must pass these._

- _Given valid input, returns expected output shape_
- _Given invalid input, throws with expected error code_
- _Lifecycle methods behave correctly (init before use, teardown cleans up)_

### 8.2 Adapter Conformance Tests
_Shared test suite every adapter implementation must pass. Ensures behavioral parity across implementations._

```typescript
// Shared conformance test — import and run for each adapter
function runConformanceTests(adapter: ExampleAdapter) {
  // ...
}
```

### 8.3 Integration Tests
_Tests that verify this feature works correctly with its real dependents. Not mocks — real wiring._

- _Feature initializes correctly in the app lifecycle_
- _Dependent features can consume the public API without errors_
- _Teardown does not leave dangling state_

---

## 9. File Structure
_Exact files to create/modify with their paths. Distinguish public exports from internal implementation._

```
src/
├── features/[feature-name]/
│   ├── index.ts              # Public re-exports
│   ├── types.ts              # Public interfaces and types
│   ├── adapter.ts            # Adapter interface / base class
│   ├── config.ts             # Configuration defaults and validation
│   ├── errors.ts             # Custom error classes
│   ├── __tests__/
│   │   ├── contract.test.ts  # Interface contract tests
│   │   └── conformance.ts    # Shared conformance test suite
│   └── internal/             # Private implementation details
│       └── ...
```

---

## 10. Implementation Notes
_Edge cases, gotchas, ordering constraints, migration considerations._

- _**Ordering:** What must be implemented before what. Dependencies between parts._
- _**Edge cases:** Non-obvious behaviors that could bite implementers._
- _**Migration:** If replacing an existing system, the transition plan. What breaks, what's backwards-compatible._
- _**Performance:** Any known hot paths or allocation concerns at the infrastructure layer._
