# document-suite — Examples

| Bundle | Files | Scope |
|--------|-------|-------|
| `sample-prd.md` | 1 file | Product requirements for a fictional mobile banking feature — demonstrates PRD template with filled tokens and KPI tables. |
| `sample-bundle/` | multi-file | Full IEEE/IIBA document bundle (BRD + SRS + HLD) with `_manifest.json`, diagrams, and bilingual VI/EN headings — demonstrates the multi-file build pipeline via `build_doc.js`. |
| `sample-charter/` | multi-file | Project Charter example using the PMBOK-aligned `01_charter.md` template — demonstrates dual-logo cover, approval table, and single-doc generation. |

## Adding new examples

1. Create a subfolder named after the project: `examples/my-project/`
2. Include: `{name}.md` (main doc), optionally `_manifest.json` and `diagrams/`
3. Add a row to this README table
4. Ensure all `{{TOKEN}}` placeholders are replaced with realistic (not Lorem Ipsum) content
