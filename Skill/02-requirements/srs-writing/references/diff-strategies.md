---
description: >-
  Chiến lược diff cho từng loại trigger trong /srs-writing.
metadata:
  tags: [diff, strategy, urd, figma, comment]
---

# Diff Strategies

## Strategy per Trigger

### A. URD Diff

1. Nhận URD cũ (từ SRS hoặc người dùng) + URD mới
2. So sánh section-by-section:
   - Field thêm/xóa/đổi tên
   - Logic thay đổi (điều kiện, quy tắc nghiệp vụ)
   - Luồng xử lý thay đổi (step thêm/xóa/reorder)
   - Điều kiện phân quyền thay đổi
3. Output: danh sách thay đổi + severity (major/minor)

### B. Figma Diff

1. So sánh mô tả MH trong SRS với Figma mới:
   - Element thêm/xóa trên mockup
   - Layout thay đổi (vị trí, grouping)
   - Trạng thái MH mới (popup, error state)
2. Không diff pixel — diff semantic (element + behavior)

### C. Comment Parsing

1. Parse comment từ khách hàng/stakeholder:
   - Xác định field/section được nhắc đến
   - Phân loại: sửa logic / sửa text / thêm / xóa
   - Detect mâu thuẫn với URD hiện tại
2. Map comment → section trong SRS

### D. Self-Check Scan

1. Quét toàn bộ SRS:
   - Field name consistency (cùng tên = cùng rule?)
   - Validation rule coverage (mọi input field có validate?)
   - API endpoint consistency (endpoint giống = logic giống?)
   - Cross-reference integrity (link đến section tồn tại?)
