# DEPRECATED — use `document-suite` instead

This skill has been merged into **`document-suite`** (2026-04-12).

## What to do

- New work → invoke `document-suite` with `mode=editor`
- Old agent manifests that reference `docx` → still work; please migrate
  during the 2026-Q3 sweep

## Why

`docs-pro`, `docx`, and `doc-coauthoring` had overlapping responsibilities.
Consolidating into one suite with mode-switching eliminates the ambiguity.

See [../document-suite/MIGRATION.md](../document-suite/MIGRATION.md).

## Removal timeline

- 2026-Q3 — folder becomes read-only
- 2026-Q4 — folder removed

## Notable change

Tracked-changes author default changed from `"Techainer"` to `"Techainer"` in
`document-suite/mode=editor`.
