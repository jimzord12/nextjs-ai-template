# Typescript cli tool that automates the issue scanning and selection process.

## Conventions

- This tool is designed for the Matt Pococks skills ecosystem. It relies on specific file structures and conventions outlined in the following documents:
  - [to-issues](.agents/skills/to-issues) — for the issues creation process
  - [triage](.agents/skills/triage) — for the issue triage process
  - [setup-matt-pocock-skills](.agents/skills/setup-matt-pocock-skills) — for the initial setup of the skills ecosystem

- There will be a `features-status.json` file at the root of `.scratch/` that tracks the status of all features plus some metadata.
- There will also be a `issues-status.json` file in each feature directory (`.scratch/<feature-slug>/issues/issues-status.json`) that tracks the status of all issues in that feature plus some metadata.

> Create json schemas for both `features-status.json` and `issues-status.json` files.

## JSON Schemas

**features-status.json**

```json
{
  "type": "object",
  "properties": {
    "features": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "description": "Unique positive integer identifier for the feature, e.g. '123'"
          },
          "slug": {
            "type": "string",
            "description": "URL-friendly name for the feature, e.g. 'authentication'"
          },
          "status": {
            "type": "string",
            "enum": ["todo", "in-progress", "archived"]
          },
          "finalStatus": {
            "type": "string",
            "enum": [null, "done", "cancelled"]
          },
          "lastUpdated": { "type": "string", "format": "date-time" }
        },
        "required": ["id", "slug", "status"]
      }
    },
    "focusedFeature": {
      "type": "object",
      "properties": {
        "id": { "type": "number", "description": "The id of the currently focused feature" },
        "slug": { "type": "string", "description": "The slug of the currently focused feature" }
      },
    },
    "lastUpdated": { "type": "string", "format": "date-time" },
    "version": { "type": "string", "description": "Version of the features-status schema" }
    "nextIssueId": {
      "type": "number",
      "description": "The next issue id to assign when creating a new issue"
    },
    "nextFeatureId": {
      "type": "number",
      "description": "The next feature id to assign when creating a new feature"
    }
  },
  "required": ["features"]
}
```

**issues-status.json**

```json
{
  "type": "object",
  "properties": {
    "issues": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "number",
            "description": "Unique identifier for the issue, e.g. 123"
          },
          "title": { "type": "string", "description": "Title of the issue" },
          "status": {
            "type": "string",
            "enum": [
              "ready-for-agent",
              "ready-for-human",
              "wontfix",
              "needs-triage",
              "needs-info",
              "done"
            ],
            "description": "Current status of the issue"
          },
          "method": {
            "type": "string",
            "enum": ["tdd", "chore"],
            "description": "Implementation method for the issue"
          },
          "complexity": {
            "type": "integer",
            "minimum": 1,
            "maximum": 5,
            "description": "Complexity rating of the issue"
          },
          "blockedBy": {
            "type": ["array", "null"],
            "items": { "$ref": "#/definitions/issueReference" }
          },
          "lastUpdated": {
            "type": "string",
            "format": "date-time",
            "description": "Timestamp of the last update to this issue's status"
          }
        },
        "required": ["id", "title", "status", "method", "complexity"]
      }
    }
  },
  "required": ["issues"],
  "definitions": {
    "issueReference": {
      "type": "object",
      "properties": {
        "featureId": { "type": "number" },
        "issueId": { "type": "number" }
      },
      "required": ["featureId", "issueId"]
    }
  }
}
```

## Tool Requirements

The tool must be AI native that means its output should be designed to be optimal for agent consumption.

### Get Issue

1. **Verification phase**:

Inputs: none

1.1 Verifies the presence, syntax and structure of `features-status.json` and `issues-status.json` files. if is missing or malformed, the tool should report this and exit with an appropriate error message.
1.2 Based on the focused feature in `features-status.json`, it should also find and verify that the corresponding `issues-status.json` file exists and is well-formed. If not, it should report this and exit.

Returns: none, but exits with an error message if any verification step fails.

2. **Feature Selection phase**:

Inputs: none

2.1 Reads `.scratch/features-status.json` to identify which is the currently
focused feature. if there is no focused feature, the tool should report this and exit.

Returns: the id and slug of the focused feature, e.g. `{ id: 123, slug: 'authentication' }`

3. **Issue Scanning phase**:

Inputs: the focused feature id and slug from the previous phase.

3.1 Finds the `issues-status.json` file in the focused feature's directory by constructing the path `.scratch/<feature-slug>/issues/issues-status.json`. If the file is missing or malformed, the tool should report this and exit with an appropriate error message.
3.2 Reads the `issues-status.json` of the focused feature to identify all issues with `Status: ready-for-agent`. If there are no `ready-for-agent` issues, the tool should report this and exit.
3.3 It also filters out the blocked issues by checking if the `blockedBy` field is empty or null (i.e. it has no blockers) or not.

Returns: a list of unblocked, ready-for-agent issues with their id, title, method, complexity, and blockers (if any).

4. **Issue Selection phase**:
   4.1 Sorts the list of provided issues (from previous phase) by complexity (ascending) and id (ascending).
   4.3 Returns the first issue from the list

### List Issues

### Update Issue

Each time an issue is updated, the tool should also update the `lastUpdated` timestamp of the issue in `issues-status.json` and the `lastUpdated` timestamp of the feature in `features-status.json` to reflect the change.

#### Update Status

#### Update Blockers

### Update Feature
