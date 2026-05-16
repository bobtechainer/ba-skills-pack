# document-suite — Migration Guide

`document-suite` replaces three former skills. All three remain in place as
deprecated pointers; new work should use `document-suite`.

## Quick map

| Former invocation                    | New invocation                              |
|--------------------------------------|---------------------------------------------|
| "use docs-pro to write a PRD"        | `document-suite mode=generator type=prd`    |
| "use docs-pro for the proposal"      | `document-suite mode=generator type=proposal` |
| "use docx to edit this contract"     | `document-suite mode=editor`                |
| "use docx to add tracked changes"    | `document-suite mode=editor`                |
| "use doc-coauthoring for the spec"   | `document-suite mode=collab`                |

## What moved where

### From `docs-pro`

- Templates → `document-suite/templates/` (re-exports of the originals)
- `references/writing-standards.md` → `document-suite/references/writing-standards.md`
- `references/anti-slop-rules.md` → `document-suite/references/anti-slop-rules.md`
- `scripts/generate_docx.js` → referenced from `document-suite` via `{baseDir}`
- `scripts/generate_pdf.js` → same

The 4-phase pipeline (GATHER → PROPOSE → GENERATE → EXPORT) is preserved verbatim
as `mode=generator`.

### From `docx`

- Low-level XML patterns → `mode=editor` section of `SKILL.md`
- `scripts/office/unpack.py`, `pack.py`, `validate.py` → still in the old `docx`
  folder; referenced from `document-suite` via `{baseDir}`
- Tracked-changes author changed from `"Techainer"` to `"Techainer"` as the default
- `LICENSE.txt` stays in the old `docx` folder

### From `doc-coauthoring`

- The 3-stage workflow (Context Gathering → Refinement → Reader Testing) is
  preserved verbatim as `mode=collab`
- No scripts or templates to move

## What changed

1. **Unified frontmatter.** All three former skills had different frontmatter
   shapes. `document-suite` uses the Techainer 3D taxonomy (`role_affinity`,
   `domain`, `lifecycle_stage`, `maturity`, `tier`, `languages`).

2. **Mode is mandatory.** In the old world, you picked a skill. Now you pick a
   mode. Picking the wrong mode is a programmer error — declare it up front.

3. **Tracked-changes author.** Old default was `"Techainer"`. New default is
   `"Techainer"`.

4. **Reader testing is promoted.** Previously only `doc-coauthoring` emphasized
   dispatching a fresh reader agent. Now `mode=collab` makes it a mandatory
   completion step.

5. **Templates are the single source of truth.** Templates live in
   `document-suite/templates/` (re-exported from `docs-pro/templates/`). Do not
   edit the old `docs-pro/templates/` folder — edits will be overwritten on the
   next sync.

## Transition timeline

| Date       | Status                                                     |
|------------|-----------------------------------------------------------|
| 2026-04-12 | `document-suite` released as Tier 1. Old skills marked deprecated. |
| 2026-Q3    | Old skill folders become read-only (no edits accepted).    |
| 2026-Q4    | Old skill folders removed. All agent manifests must reference `document-suite`. |

Agents that still reference `docs-pro`, `docx`, or `doc-coauthoring` should be
updated during the 2026-Q3 agent-manifest sweep.

## Opening a bug against the old skills

If you find a bug in `docs-pro`, `docx`, or `doc-coauthoring`, file it against
`document-suite`. The old folders are no longer accepting patches.
