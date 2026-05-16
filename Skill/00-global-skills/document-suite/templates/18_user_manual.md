<!--
Template: user_manual — User Manual / Hướng dẫn Sử dụng
Standard: ISO/IEC/IEEE 26512:2018 — Systems and software engineering — Requirements for acquirers and suppliers of user documentation
Skill:    document-suite
Version:  1.0.0
Usage:    Copy to docs/05_deployment/02_user_manual/, fill {{facts.*}} + TODO,
          then build with: node scripts/build_doc.js docs/05_deployment/02_user_manual --brand <vendor> --client <client>
Note:     Audience = non-technical end users. Language must be plain. No jargon.
          For technical administrators, use 15_runbook.md instead.
-->

# Hướng dẫn Sử dụng / User Manual — {{facts.project.name_vi}}

**Phiên bản / Version**: {{facts.doc.version}}
**Ngày / Date**: {{facts.doc.date}}
**Dành cho / Audience**: Người dùng cuối / End Users
**Phân loại / Classification**: {{facts.project.classification}}

> Standard: ISO/IEC/IEEE 26512:2018 — User Documentation

<!-- PAGE_BREAK -->

## 1. Giới thiệu / Introduction

### 1.1 Mục đích / Purpose

Tài liệu này hướng dẫn người dùng sử dụng hệ thống **{{facts.project.name_vi}}**.

This manual guides users through all features of **{{facts.project.name_en}}**.

### 1.2 Phạm vi / Scope

<!-- FILL: What system features does this manual cover? What is out of scope? -->

### 1.3 Đối tượng sử dụng / Target Audience

| Đối tượng / User Type | Mô tả / Description | Cần đọc / Sections |
|-----------------------|--------------------|-------------------|
| Người dùng cơ bản | | §2, §3 |
| Quản lý | | §2, §3, §4 |

### 1.4 Quy ước / Conventions

| Ký hiệu / Symbol | Ý nghĩa / Meaning |
|--------------------|-------------------|
| **[Bấm]** | Nút cần bấm |
| `code` | Giá trị nhập vào |
| > Lưu ý | Thông tin quan trọng |

---

<!-- PAGE_BREAK -->

## 2. Bắt đầu / Getting Started

### 2.1 Yêu cầu hệ thống / System Requirements

| Thành phần / Component | Yêu cầu tối thiểu / Minimum | Khuyến nghị / Recommended |
|------------------------|---------------------------|-----------------------------|
| Trình duyệt / Browser | | |
| Kết nối / Connection | | |
| Màn hình / Screen | | |

### 2.2 Đăng nhập / Login

1. Truy cập **{{facts.project.app_url}}**
2. Nhập tên đăng nhập (Username): **[email của bạn]**
3. Nhập mật khẩu (Password)
4. Bấm **[Đăng nhập]**

> Lưu ý: Nếu quên mật khẩu, bấm "Quên mật khẩu?" và làm theo hướng dẫn.

<!-- DIAGRAM: login_screen.png Màn hình Đăng nhập / Login Screen -->

---

<!-- PAGE_BREAK -->

## 3. Các tính năng chính / Core Features

### 3.1 {{facts.feature_1.name_vi}} / {{facts.feature_1.name_en}}

**Mục đích**: {{facts.feature_1.purpose}}

**Các bước thực hiện / Steps:**

1. <!-- Step 1 -->
2. <!-- Step 2 -->
3. <!-- Step 3 -->

<!-- DIAGRAM: feature_1_flow.png Luồng thực hiện tính năng 1 -->

**Kết quả mong đợi / Expected result**: <!-- What the user sees after completing the steps -->

> Lưu ý / Note: <!-- Any important caveats for this feature -->

---

### 3.2 <!-- Repeat for each major feature -->

---

<!-- PAGE_BREAK -->

## 4. Câu hỏi thường gặp / FAQ

| Câu hỏi / Question | Trả lời / Answer |
|--------------------|-----------------|
| | |
| | |

---

## 5. Xử lý sự cố cơ bản / Basic Troubleshooting

| Vấn đề / Problem | Nguyên nhân có thể / Possible Cause | Cách xử lý / Resolution |
|------------------|------------------------------------|-----------------------|
| Không đăng nhập được | Sai mật khẩu / Tài khoản bị khoá | Kiểm tra mật khẩu; liên hệ helpdesk |
| | | |

---

## 6. Liên hệ hỗ trợ / Support Contact

| Kênh / Channel | Thông tin / Details | Giờ hoạt động / Hours |
|----------------|--------------------|-----------------------|
| Hotline | {{facts.support.phone}} | 8:00–17:30 T2–T6 |
| Email | {{facts.support.email}} | |
| Helpdesk | {{facts.support.helpdesk_url}} | 24/7 |

---

## Phụ lục / Appendix

### A. Bảng thuật ngữ / Glossary

| Thuật ngữ | Vietnamese | English |
|-----------|-----------|---------|
| | | |

### B. Phím tắt / Keyboard Shortcuts

| Phím / Key | Chức năng / Action |
|------------|-------------------|
| | |

### C. Lịch sử phiên bản / Version History

| Phiên bản | Ngày | Nội dung thay đổi |
|-----------|------|------------------|
| {{facts.doc.version}} | {{facts.doc.date}} | Phát hành lần đầu |
