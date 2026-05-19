"""
Confluence → Antigravity Knowledge Items Sync
=============================================
Quét Confluence Cloud, tạo Knowledge Items cho Antigravity.

Cách dùng:
  1. Copy config.example.json → config.json
  2. Điền thông tin Confluence vào config.json
  3. Chạy: python sync_confluence.py

Kết quả: tạo thư mục KI trong ~/.gemini/antigravity/knowledge/confluence_<space>/
"""

import json
import io
import os
import sys
import re
import time
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import quote

# Fix Windows Unicode encoding (safe for Linux CI)
try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except (AttributeError, io.UnsupportedOperation):
    pass


# --- Auto-install requests if missing ---
try:
    import requests
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'requests'])
    import requests

# =========================================================================
# Configuration
# =========================================================================

SCRIPT_DIR = Path(__file__).parent
CONFIG_PATH = SCRIPT_DIR / "config.json"

def load_config():
    """Load config from config.json, falling back to config.example.json."""
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    example_path = SCRIPT_DIR / "config.example.json"
    if example_path.exists():
        print("=" * 60)
        print("  CHƯA CÓ CONFIG!")
        print("=" * 60)
        print()
        print("  Bước 1: Copy file config.example.json → config.json")
        print("  Bước 2: Mở config.json, điền thông tin Confluence")
        print("  Bước 3: Chạy lại script này")
        print()
        print("  Hướng dẫn tạo API Token:")
        print("  → Vào https://id.atlassian.com/manage-profile/security/api-tokens")
        print("  → Click 'Create API token'")
        print("  → Đặt tên (VD: 'antigravity-sync')")
        print("  → Copy token vào config.json")
        print()
        sys.exit(1)
    else:
        print("ERROR: Không tìm thấy config.example.json")
        sys.exit(1)


# =========================================================================
# Confluence API Client
# =========================================================================

class ConfluenceClient:
    """Simple Confluence Cloud REST API client."""
    
    def __init__(self, base_url: str, email: str, api_token: str):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.auth = (email, api_token)
        self.session.headers.update({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        })
    
    def _get(self, endpoint: str, params: dict = None) -> dict:
        """Make a GET request to Confluence API."""
        url = f"{self.base_url}{endpoint}"
        resp = self.session.get(url, params=params, timeout=30)
        if resp.status_code == 401:
            print("ERROR: Sai email hoặc API token. Kiểm tra lại config.json")
            sys.exit(1)
        if resp.status_code == 403:
            print("ERROR: Không có quyền truy cập. Kiểm tra lại quyền tài khoản.")
            sys.exit(1)
        resp.raise_for_status()
        return resp.json()
    
    def get_spaces(self, limit=250) -> list:
        """Get all spaces the user has access to."""
        spaces = []
        start = 0
        while True:
            data = self._get('/wiki/rest/api/space', params={
                'start': start,
                'limit': min(limit, 25),
                'type': 'global',
                'expand': 'description.plain',
            })
            for s in data.get('results', []):
                spaces.append({
                    'key': s['key'],
                    'name': s['name'],
                    'description': (s.get('description', {})
                                     .get('plain', {})
                                     .get('value', '')),
                    'url': f"{self.base_url}/wiki/spaces/{s['key']}",
                })
            # Pagination
            if data.get('size', 0) < 25 or len(spaces) >= limit:
                break
            start += data['size']
            time.sleep(0.2)  # Rate limiting
        return spaces
    
    def get_pages_in_space(self, space_key: str, max_pages=500) -> list:
        """Get all pages in a space with their titles and links."""
        pages = []
        start = 0
        while True:
            data = self._get('/wiki/rest/api/content', params={
                'spaceKey': space_key,
                'type': 'page',
                'start': start,
                'limit': 25,
                'expand': 'metadata.labels,ancestors,version',
            })
            for p in data.get('results', []):
                # Build full URL
                page_url = f"{self.base_url}/wiki{p['_links'].get('webui', '')}"
                
                # Get labels
                labels = []
                for lbl in (p.get('metadata', {})
                             .get('labels', {})
                             .get('results', [])):
                    labels.append(lbl.get('name', ''))
                
                # Get ancestor path (breadcrumb)
                ancestors = []
                for anc in p.get('ancestors', []):
                    ancestors.append(anc.get('title', ''))
                
                pages.append({
                    'id': p['id'],
                    'title': p['title'],
                    'url': page_url,
                    'labels': labels,
                    'ancestors': ancestors,
                    'last_modified': (p.get('version', {})
                                      .get('when', '')),
                    'version': p.get('version', {}).get('number', 1),
                })
            
            # Pagination
            if data.get('size', 0) < 25 or len(pages) >= max_pages:
                break
            start += data['size']
            time.sleep(0.2)  # Rate limiting
        
        return pages[:max_pages]


# =========================================================================
# Knowledge Item Generator
# =========================================================================

def sanitize_dirname(name: str) -> str:
    """Convert space name to safe directory name."""
    # Remove special chars, replace spaces with underscore
    clean = re.sub(r'[^\w\s-]', '', name.lower())
    clean = re.sub(r'[\s]+', '_', clean.strip())
    return f"confluence_{clean}"


def create_ki_for_space(space: dict, pages: list, output_dir: Path):
    """Create a Knowledge Item directory for a Confluence space."""
    
    ki_dir = output_dir / sanitize_dirname(space['name'])
    artifacts_dir = ki_dir / 'artifacts'
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    
    # --- metadata.json ---
    metadata = {
        "summary": (f"Confluence Space: {space['name']}. "
                    f"Chứa {len(pages)} trang tài liệu. "
                    f"{space['description'][:200] if space['description'] else ''}"
                    f" Đồng bộ lần cuối: {datetime.now().strftime('%Y-%m-%d %H:%M')}"),
        "title": f"Confluence — {space['name']}",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "source": "confluence_sync",
        "references": [space['url']],
        "tags": ["confluence", space['key'].lower()],
    }
    
    with open(ki_dir / 'metadata.json', 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    # --- artifacts/overview.md ---
    overview_lines = [
        f"# {space['name']}",
        f"",
        f"**Space Key:** `{space['key']}`",
        f"**URL:** [{space['name']}]({space['url']})",
        f"**Tổng số trang:** {len(pages)}",
        f"**Mô tả:** {space['description'] or '(không có)'}",
        f"",
        f"## Các chủ đề chính",
        f"",
    ]
    
    # Group pages by top-level ancestor
    groups = {}
    for p in pages:
        group_name = p['ancestors'][0] if p['ancestors'] else '(Root)'
        if group_name not in groups:
            groups[group_name] = []
        groups[group_name].append(p)
    
    for group_name, group_pages in sorted(groups.items()):
        overview_lines.append(f"- **{group_name}** ({len(group_pages)} trang)")
    
    with open(artifacts_dir / 'overview.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(overview_lines))
    
    # --- artifacts/pages_index.md ---
    index_lines = [
        f"# Bảng tra cứu trang — {space['name']}",
        f"",
        f"| Tên trang | Link | Thuộc mục | Labels |",
        f"|-----------|------|-----------|--------|",
    ]
    
    for p in sorted(pages, key=lambda x: x['title']):
        parent = ' > '.join(p['ancestors']) if p['ancestors'] else '(Root)'
        labels = ', '.join(p['labels']) if p['labels'] else ''
        # Escape pipe characters in title
        title = p['title'].replace('|', '\\|')
        index_lines.append(
            f"| {title} | [{title}]({p['url']}) | {parent} | {labels} |"
        )
    
    with open(artifacts_dir / 'pages_index.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(index_lines))
    
    # --- artifacts/search_keywords.md ---
    # Flat list for fast keyword searching by the SRS skill
    keyword_lines = [
        f"# Keywords — {space['name']}",
        f"",
        f"Danh sách phẳng để AI tìm nhanh khi gặp CROSS-REF:",
        f"",
    ]
    for p in pages:
        keywords = [p['title']]
        keywords.extend(p['labels'])
        keywords.extend(p['ancestors'])
        keyword_str = ' | '.join(keywords)
        keyword_lines.append(f"- **{p['title']}** → {p['url']}")
        if p['labels']:
            keyword_lines.append(f"  Tags: {', '.join(p['labels'])}")
    
    with open(artifacts_dir / 'search_keywords.md', 'w', encoding='utf-8') as f:
        f.write('\n'.join(keyword_lines))
    
    return ki_dir


# =========================================================================
# Main
# =========================================================================

def main():
    print("=" * 60)
    print("  Confluence → Antigravity Knowledge Sync")
    print("=" * 60)
    print()
    
    # Load config
    config = load_config()
    
    confluence_url = config['confluence_url']
    email = config['email']
    api_token = config['api_token']
    filter_spaces = config.get('spaces', [])
    max_pages = config.get('max_pages_per_space', 500)
    
    # Validate
    if 'YOUR' in confluence_url or 'YOUR' in api_token:
        print("ERROR: Vui lòng điền thông tin thật vào config.json")
        print("       (thay thế các giá trị YOUR_... bằng thông tin của bạn)")
        sys.exit(1)
    
    # Determine output directory
    ki_output = config.get('ki_output_dir', '')
    if ki_output:
        output_dir = Path(ki_output)
        if not output_dir.is_absolute():
            # Relative path → resolve from repo root (2 levels up from script)
            repo_root = SCRIPT_DIR.parent.parent
            output_dir = repo_root / ki_output
    else:
        # Default: ~/.gemini/antigravity/knowledge/
        home = Path.home()
        output_dir = home / '.gemini' / 'antigravity' / 'knowledge'
    
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Output: {output_dir}")
    print()
    
    # Connect
    print(f"🔗 Kết nối Confluence: {confluence_url}")
    client = ConfluenceClient(confluence_url, email, api_token)
    
    # Get spaces
    print("📋 Đang lấy danh sách spaces...")
    all_spaces = client.get_spaces()
    print(f"   Tìm thấy {len(all_spaces)} spaces")
    
    # Filter spaces if specified
    if filter_spaces:
        spaces = [s for s in all_spaces if s['key'] in filter_spaces]
        print(f"   Lọc: {len(spaces)} spaces (theo config)")
    else:
        spaces = all_spaces
        print(f"   Sync tất cả {len(spaces)} spaces")
    
    print()
    
    # Process each space
    total_pages = 0
    for i, space in enumerate(spaces, 1):
        print(f"[{i}/{len(spaces)}] 📂 {space['name']} ({space['key']})")
        
        pages = client.get_pages_in_space(space['key'], max_pages=max_pages)
        print(f"         {len(pages)} trang")
        
        ki_dir = create_ki_for_space(space, pages, output_dir)
        print(f"         ✅ Saved → {ki_dir.name}/")
        
        total_pages += len(pages)
        time.sleep(0.3)  # Rate limiting between spaces
    
    # Generate manifest.json for AI discovery
    manifest = {
        "synced_at": datetime.now(timezone.utc).isoformat(),
        "total_spaces": len(spaces),
        "total_pages": total_pages,
        "spaces": []
    }
    for space in spaces:
        dirname = sanitize_dirname(space['name'])
        manifest["spaces"].append({
            "name": space['name'],
            "key": space['key'],
            "dir": dirname,
            "pages_index": f"{dirname}/artifacts/pages_index.md",
        })
    
    with open(output_dir / 'manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    
    # Summary
    print()
    print("=" * 60)
    print(f"  ✅ HOÀN THÀNH!")
    print(f"  📊 {len(spaces)} spaces, {total_pages} trang")
    print(f"  📁 Output: {output_dir}")
    print("=" * 60)
    print()
    print("Bước tiếp theo:")
    print("  → Mở Antigravity, AI sẽ tự thấy Knowledge Items mới")
    print("  → Chạy skill SRS, các [CROSS-REF] sẽ tự gắn link Confluence")


if __name__ == '__main__':
    main()
