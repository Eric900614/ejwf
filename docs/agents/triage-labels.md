# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Canonical role    | Label in our tracker | Meaning                                  |
| ----------------- | -------------------- | ---------------------------------------- |
| `needs-triage`    | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`      | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent` | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human` | `ready-for-human`    | Requires human implementation            |
| `wontfix`         | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

## Workflow Signals

These labels are not canonical triage roles. They are extra workflow signals used by the cockpit domain model and ADRs.

| Signal        | Label in our tracker | Meaning                                                                 |
| ------------- | -------------------- | ----------------------------------------------------------------------- |
| `needs-smoke` | `needs-smoke`        | Requires maintainer smoke acceptance after the dev-review loop finishes |

Absence of `needs-smoke` only means "machine-acceptable" after smoke-or-not triage has explicitly been completed for that card.

Edit the right-hand column to match whatever vocabulary you actually use. These labels are created on first use; to pre-create them: `gh label create <name>`.
