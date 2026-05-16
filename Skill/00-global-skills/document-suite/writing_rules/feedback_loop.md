# Feedback Loop — Self-Improve Skill từ User Feedback

Khi user đưa feedback (phàn nàn, sửa chữa, yêu cầu cải tiến), đây là quy trình **BẮT BUỘC** để skill không gặp lại lỗi cũ.

**Không chỉ sửa output — sửa SKILL.**

---

## Nguyên tắc

User feedback là **vàng**. Mỗi feedback = 1 lỗ hổng trong skill. Nếu chỉ sửa output 1 lần mà không cập nhật skill, lần sau sẽ gặp lại.

**Quy tắc vàng:** Nếu user phải nói 2 lần → skill có bug. Fix skill, not just output.

---

## Quy trình 4 bước

### Bước 1 — NHẬN DIỆN loại feedback

Phân loại trước khi xử lý:

| Loại | Dấu hiệu | Xử lý |
|---|---|---|
| **Bug output** | "Sai rồi", "chỗ này không đúng" | Sửa output + log vào feedback_log |
| **Thiếu tính năng** | "Sao không có TOC?", "Thiếu dump version" | Thêm vào scripts/templates + bump version |
| **Style/Tone** | "Nghe như robot", "viết khô quá" | Thêm writing_rules/*.md + update SKILL.md |
| **Framing sai** | "Không phải thế, tôi là PO chứ không phải vendor" | Sửa templates + thêm metadata fields |
| **Improve upgrade** | "Nếu không đáp ứng thì cải thiện skill dựa trên feedback" | Áp dụng quy trình này |

### Bước 2 — GHI LẠI vào feedback_log

Tạo/cập nhật file `feedback_log.md` trong skill folder:

```markdown
## YYYY-MM-DD — [Tên project]

**Feedback:** "<copy nguyên văn user feedback>"
**Loại:** bug | missing feature | style | framing | other
**Root cause:** <tại sao skill gặp bug này>
**Fix:** <file nào đã sửa, version mới nào>
**Test:** <cách verify không lặp lại>
```

Feedback_log này là **SOURCE OF TRUTH** cho lịch sử skill.

### Bước 3 — UPGRADE skill (không chỉ fix output)

Cụ thể cho từng loại:

**Style/Tone issues** → Thêm file `writing_rules/<tên>.md`:
- Ví dụ: user phàn nàn tiếng Việt robot → tạo `vietnamese_natural.md`
- Cập nhật `SKILL.md` reference file mới này trong Writing Quality Gate
- Thêm example Before/After để AI học pattern

**Missing features** → Code change:
- Sửa `scripts/generate_docx.js` hoặc `build_doc.js`
- Test trên 1 project → verify output đúng
- Document trong `CHANGELOG.md`

**Framing/Template issues** → Templates:
- Sửa `templates/<doctype>/*.md`
- Thêm metadata fields mới (Sponsor, Author, End users)
- Update `examples/` để reference metadata đúng

**Recurring issues** → Add validator:
- Viết validator vào `validators/` check pattern xấu
- Integrate vào Phase 5 VERIFY của build_doc.js
- Fail build nếu phát hiện lỗi

### Bước 4 — BUMP VERSION + CHANGELOG

**BẮT BUỘC:** Mỗi khi upgrade skill do feedback → bump version.

SemVer:
- **Major (X.0.0)** — Breaking change (template metadata mới, contract change)
- **Minor (X.Y.0)** — Feature mới (TOC, new writing rules, new validator)
- **Patch (X.Y.Z)** — Bug fix nhỏ (color tweak, typo)

Update 3 chỗ:
1. `SKILL.md` — `version: X.Y.Z` field trong frontmatter
2. `CHANGELOG.md` — Entry mới với feedback context
3. Git commit (nếu có) — message format `feat(skill): ... (fix feedback: <1-line>)`

---

## Template cho CHANGELOG entry

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Changed (from feedback)
- **<Feedback 1>**: `<file>` — <mô tả fix>
- **<Feedback 2>**: `<file>` — <mô tả fix>

### Added
- `writing_rules/<new>.md` — <lý do>
- TOC support in `generate_docx.js` — Word auto-updates on open

### Source
- Feedback from: <project>, <date>
- See `feedback_log.md` for full context
```

---

## Checklist trước khi báo "done"

Khi user nói "improve skill dựa trên feedback":

- [ ] Đã phân loại feedback (bug/feature/style/framing)?
- [ ] Đã ghi vào `feedback_log.md`?
- [ ] Đã sửa ở TẦNG SKILL (không chỉ output)?
- [ ] Đã bump version trong SKILL.md?
- [ ] Đã update CHANGELOG.md?
- [ ] Đã rebuild output để verify fix áp dụng đúng?
- [ ] Đã confirm với user: "đã dump version mới là standard"?

**Nếu bất kỳ ô nào chưa check → chưa done.**
