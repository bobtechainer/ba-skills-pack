# Confluence → Antigravity Knowledge Sync

## Mục đích

Script tự động quét Confluence → tạo bảng tra cứu để skill SRS tự gắn link tài liệu.

## Chuẩn bị (chỉ cần làm 1 lần)

### Bước 1: Tạo Confluence API Token

1. Vào: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Đặt tên: `antigravity-sync`
4. Click **Create** → **Copy** token (LƯU LẠI, chỉ hiện 1 lần!)

### Bước 2: Tạo file config

```powershell
cd "c:\Working\Techainer\BA Skills\tools\confluence_sync"
copy config.example.json config.json
```

Mở `config.json`, điền:

- `confluence_url`: URL Confluence (VD: `https://techainer.atlassian.net`)
- `email`: Email đăng nhập Confluence
- `api_token`: Token vừa tạo ở Bước 1

## Chạy đồng bộ

```powershell
cd "c:\Working\Techainer\BA Skills\tools\confluence_sync"
python sync_confluence.py
```

## Kết quả

Script tạo thư mục trong `~/.gemini/antigravity/knowledge/`:

```
confluence_ten_space/
├── metadata.json        ← Tóm tắt space
└── artifacts/
    ├── overview.md      ← Tổng quan
    ├── pages_index.md   ← Bảng tra: Tên trang → Link
    └── search_keywords.md ← Từ khóa tìm kiếm
```

## Lỗi thường gặp

| Lỗi                | Nguyên nhân          | Cách sửa                       |
| ------------------ | -------------------- | ------------------------------ |
| `401 Unauthorized` | Sai email hoặc token | Kiểm tra lại config.json       |
| `403 Forbidden`    | Không có quyền       | Hỏi admin Confluence cấp quyền |
| `Connection Error` | Sai URL              | Kiểm tra confluence_url        |

## Chạy lại để cập nhật

Khi Confluence có trang mới, chạy lại `python sync_confluence.py`. Script sẽ ghi đè dữ liệu cũ.
