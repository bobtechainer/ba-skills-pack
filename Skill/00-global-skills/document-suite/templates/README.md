# banking-docs / templates — 16 document skeletons

Pre-built markdown templates cho mọi loại banking project doc chuẩn. Copy file tương ứng vào project folder của bạn, fill `{{facts.*}}` placeholders + `<!-- FILL -->` comments, rồi build bằng:

```bash
node ../scripts/build_doc.js <your-doc-folder> --brand <vendor> --client <client> [--compliance]
```

## Index — 16 templates

| # | File | Standard | Type | Lines | Sample? |
|---|---|---|---|---:|:---:|
| 01 | [01_charter.md](01_charter.md) | PMBOK 7th | Project Charter | 195 | Skeleton |
| 02 | [02_sow.md](02_sow.md) | PMBOK | Statement of Work | ~150 | Skeleton |
| 03 | [03_proposal.md](03_proposal.md) | APMP/Shipley | Business Proposal | 282 | Skeleton |
| 04 | [04_brd.md](04_brd.md) | IIBA BABOK v3 | Business Requirements | ~180 | Skeleton |
| 05 | [05_srs.md](05_srs.md) | IEEE 830 | Software Requirements Spec | ~200 | Skeleton |
| 06 | [06_use_cases.md](06_use_cases.md) | UML 2.5 + Cockburn + Gherkin | Use Cases | 282 | Skeleton |
| 07 | [07_hld.md](07_hld.md) | TOGAF + Kruchten 4+1 | High Level Design | ~200 | Skeleton |
| 08 | [08_lld.md](08_lld.md) | ISO/IEC/IEEE 42010 | Low Level Design | 306 | Skeleton |
| 09 | [09_dbd.md](09_dbd.md) | ER + ISO 11179 | Database Design | 252 | Skeleton |
| 10 | [10_api_spec.md](10_api_spec.md) | OpenAPI 3.0 + RFC 9457 | API Specification | 434 | Skeleton |
| 11 | [11_security_plan.md](11_security_plan.md) | STRIDE + OWASP + TT 09/2020 | Security Plan | ~250 | Skeleton |
| 12 | [12_test_plan.md](12_test_plan.md) | IEEE 829 | Master Test Plan | 295 | Skeleton |
| 13 | [13_uat_plan.md](13_uat_plan.md) | IEEE 829 + ISTQB | UAT Plan | 304 | Skeleton |
| 14 | [14_deployment_plan.md](14_deployment_plan.md) | ITIL | Deployment/Release Plan | 293 | Skeleton |
| 15 | [15_runbook.md](15_runbook.md) | ITIL/SRE | Runbook | 316 | Skeleton |
| 16 | [16_sla.md](16_sla.md) | ITIL | Service Level Agreement | 340 | Skeleton |
| — | **Total** | | | ~3,500 | All skeleton |

## Workflow khi dùng 1 template

```
1. Copy    → cp templates/04_brd.md my-project/docs/02_analysis/01_brd/04_brd.md
2. Fill    → edit {{facts.*}} + <!-- FILL --> comments
3. Review  → (optional) self-review bilingual consistency
4. Build   → node scripts/build_doc.js my-project/docs/02_analysis/01_brd \
                  --brand <vendor> --client <client> [--compliance]
5. Verify  → open generated .docx in Word, check TOC + diacritics
```

## Brand + Client customization

- **Brand** = vendor identity — config at [`_shared/brands/<slug>.json`](../../_shared/brands/)
- **Client** = client identity — config at [`brand-context/clients/<slug>/`](../../brand-context/clients/)
- **Compliance** = VN banking regulation — rules ở [`compliance-engine/rules/*.yml`](../../compliance-engine/rules/)

Skill sẽ nạp cả 3 loại config khi build; template bản thân generic, không hardcode vendor/client.

## Naming convention

Template filename = `<NN>_<slug>.md` với NN = 01-16 thứ tự chuẩn SDLC (initiation → spec → design → test → deploy → ops). Output filename sẽ tự sinh theo pattern `{DocCode}_{ProjectShort}_{Version}_{Date}.docx` — xem `scripts/build_doc.js` hàm `deriveOutputFilename`.

## Maintenance

- Sửa template phải đảm bảo bilingual H1/H2 + `{{facts.*}}` placeholder + `<!-- PAGE_BREAK -->` giữa section.
- Thêm template mới: copy `01_charter.md` làm base, đánh số tiếp theo (17_xxx.md), update bảng README này + update [SKILL.md](../SKILL.md) Index.
- Test sau khi sửa: `node ../scripts/build_doc.js ../examples/sample-charter/` — phải build OK.
