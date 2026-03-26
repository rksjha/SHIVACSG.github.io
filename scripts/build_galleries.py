#!/usr/bin/env python3
"""
=============================================================
  Shiva Consultancy Group — Auto Gallery Builder
  Version: 2.0
=============================================================
  Run manually:  python3 scripts/build_galleries.py
  Runs auto:     On every GitHub push via GitHub Actions

  What it does:
  - Scans each content folder for files
  - Auto-generates a beautiful HTML gallery page (index.html)
  - Handles PDFs, images, videos, Word, Excel, PPT files
  - Adds social sharing buttons to every item
  - Skips hidden files, README.md, and existing index.html
=============================================================
"""

import os
import html
from pathlib import Path
from datetime import datetime
from urllib.parse import quote

# ---- Configuration ----
REPO_ROOT  = Path(__file__).parent.parent
SITE_URL   = "https://rksjha.github.io/SHIVACSG.github.io"
SITE_NAME  = "Shiva Consultancy Group"

SECTIONS = [
    {
        "folder":      "products",
        "title":       "Products",
        "description": "Browse SCG's complete product range.",
        "icon":        "&#128230;",
        "hint":        "Drop product brochures (PDF), images, or spec sheets here.",
    },
    {
        "folder":      "services",
        "title":       "Services",
        "description": "Our professional consultancy and advisory services.",
        "icon":        "&#128188;",
        "hint":        "Drop service brochures, proposal templates, or case studies here.",
    },
    {
        "folder":      "advertorials",
        "title":       "Advertorials",
        "description": "Industry articles, promotional materials, and publications.",
        "icon":        "&#128240;",
        "hint":        "Drop advertorial PDFs, images, or articles here.",
    },
    {
        "folder":      "small-apps",
        "title":       "Small Apps",
        "description": "Handy tools and mini-applications.",
        "icon":        "&#9889;",
        "hint":        "Drop HTML app files here. Each .html file becomes a launchable app card.",
    },
    {
        "folder":      "media/images",
        "title":       "Image Gallery",
        "description": "Photo library for social media and client sharing.",
        "icon":        "&#128247;",
        "hint":        "Drop JPG, PNG, GIF, or WebP images here.",
    },
    {
        "folder":      "media/videos",
        "title":       "Videos",
        "description": "Video library for presentations and social sharing.",
        "icon":        "&#127909;",
        "hint":        "Drop MP4, MOV, or AVI video files here.",
    },
    {
        "folder":      "media/pdfs",
        "title":       "PDF Library",
        "description": "Downloadable documents and reports.",
        "icon":        "&#128196;",
        "hint":        "Drop PDF files here.",
    },
    {
        "folder":      "Product and service profile",
        "title":       "Agri &amp; Infrastructure Profiles",
        "description": "Agriculture infrastructure, subsidy schemes, cold chain, and food processing projects.",
        "icon":        "&#127807;",
        "hint":        "Drop agriculture and infrastructure PDFs here.",
    },
]

SKIP_FILES = {
    "index.html", "readme.md", ".ds_store", ".gitkeep", "thumbs.db",
    "build_galleries.py",
}

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"}
VIDEO_EXTS = {".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"}
PDF_EXTS   = {".pdf"}
DOC_EXTS   = {".doc", ".docx"}
XLS_EXTS   = {".xls", ".xlsx"}
PPT_EXTS   = {".ppt", ".pptx"}
HTML_EXTS  = {".html", ".htm"}


def file_icon(ext):
    e = ext.lower()
    if e in PDF_EXTS:   return "&#128196;", "PDF",   "#e74c3c"
    if e in IMAGE_EXTS: return "&#128247;", "Image", "#27ae60"
    if e in VIDEO_EXTS: return "&#127916;", "Video", "#8e44ad"
    if e in DOC_EXTS:   return "&#128221;", "Word",  "#2980b9"
    if e in XLS_EXTS:   return "&#128202;", "Excel", "#27ae60"
    if e in PPT_EXTS:   return "&#128101;", "PPT",   "#e67e22"
    if e in HTML_EXTS:  return "&#9889;",   "App",   "#0d2b5e"
    return "&#128196;", "File", "#7f8c8d"


def file_size_str(path):
    try:
        b = path.stat().st_size
        if b < 1024:        return f"{b} B"
        if b < 1024**2:     return f"{b/1024:.1f} KB"
        return              f"{b/1024**2:.1f} MB"
    except Exception:
        return ""


def nav_html(active_folder=""):
    nav_items = [
        ("../index.html",             "Home"),
        ("../products/index.html",    "Products"),
        ("../services/index.html",    "Services"),
        ("../advertorials/index.html","Advertorials"),
        ("../small-apps/index.html",  "Small Apps"),
        ("../media/index.html",       "Media"),
    ]
    # adjust relative depth for nested paths like media/images
    depth = active_folder.count("/")
    prefix = "../" * depth

    links = ""
    for href, label in nav_items:
        adjusted = prefix + href.lstrip("../") if depth else href
        links += f'<a href="{adjusted}">{label}</a>\n        '
    return links


def card_html(file_path, folder_path, section_folder, section_url):
    name      = file_path.name
    ext       = file_path.suffix
    icon, type_label, badge_color = file_icon(ext)
    size      = file_size_str(file_path)
    rel_path  = quote(name)
    file_url  = f"{section_url}/{rel_path}"
    clean_name = html.escape(file_path.stem.replace("-", " ").replace("_", " "))

    # Thumbnail row
    if ext.lower() in IMAGE_EXTS:
        thumb = f'<img src="{rel_path}" alt="{html.escape(name)}" loading="lazy">'
    else:
        thumb = f'<div style="font-size:52px; line-height:140px;">{icon}</div>'

    # Action buttons
    view_label = "&#9654; Play" if ext.lower() in VIDEO_EXTS else \
                 "&#128065; Open" if ext.lower() in HTML_EXTS else \
                 "&#128065; View"

    return f"""
      <div class="file-card" data-name="{html.escape(name.lower())}">
        <div class="file-card-thumb">
          {thumb}
          <div class="file-card-type-badge" style="background:{badge_color};">{type_label}</div>
        </div>
        <div class="file-card-body">
          <div class="file-card-name">{clean_name}</div>
          <div class="file-card-meta">{html.escape(ext.upper().lstrip("."))} &nbsp;{size}</div>
        </div>
        <div class="file-card-actions">
          <a class="btn-sm btn-view" href="{rel_path}" target="_blank">{view_label}</a>
          <button class="btn-sm btn-share" onclick="shareFile('{html.escape(clean_name, quote=True)}','{file_url}')">&#8679; Share</button>
        </div>
      </div>"""


def media_index_html():
    """Generate the media hub landing page."""
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Media Library | Shiva Consultancy Group</title>
  <meta property="og:title" content="SCG Media Library">
  <meta property="og:description" content="Images, videos and PDFs from Shiva Consultancy Group">
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<header class="site-header">
  <div class="nav-container">
    <a href="../index.html" class="nav-brand">
      <div class="nav-brand-icon">S</div>
      <div class="nav-brand-text">
        <div class="company">Shiva Consultancy Group</div>
        <div class="tagline">Professional Business Solutions</div>
      </div>
    </a>
    <nav><div class="nav-links" id="navLinks">
      <a href="../index.html">Home</a>
      <a href="../products/index.html">Products</a>
      <a href="../services/index.html">Services</a>
      <a href="../advertorials/index.html">Advertorials</a>
      <a href="../small-apps/index.html">Small Apps</a>
      <a href="index.html" class="active">Media</a>
    </div></nav>
    <button class="nav-toggle" id="navToggle"><span></span><span></span><span></span></button>
  </div>
</header>

<div class="page-header">
  <div class="page-header-inner">
    <div class="breadcrumb"><a href="../index.html">Home</a><span>/</span> Media Library</div>
    <h1>&#127916; Media Library</h1>
    <p>Images, videos, PDFs, and downloadable resources</p>
  </div>
</div>

<div class="main-content">
  <div class="sections-grid" style="padding:0; margin:0;">
    <a href="images/index.html" class="section-card">
      <div class="section-card-icon">&#128247;</div>
      <h3>Images</h3>
      <p>Photo library for social media sharing and presentations.</p>
      <div class="section-card-arrow">View Gallery &#8594;</div>
    </a>
    <a href="videos/index.html" class="section-card">
      <div class="section-card-icon">&#127909;</div>
      <h3>Videos</h3>
      <p>Video content for promotions, presentations, and social sharing.</p>
      <div class="section-card-arrow">View Videos &#8594;</div>
    </a>
    <a href="pdfs/index.html" class="section-card">
      <div class="section-card-icon">&#128196;</div>
      <h3>PDF Documents</h3>
      <p>Downloadable documents, reports, brochures, and publications.</p>
      <div class="section-card-arrow">View PDFs &#8594;</div>
    </a>
  </div>
</div>

<footer class="site-footer">
  <div class="footer-bottom">&copy; 2024 Shiva Consultancy Group &nbsp;|&nbsp; Managed by Rakesh Jha</div>
</footer>
<script src="../assets/js/main.js"></script>
</body>
</html>"""


def generate_gallery(section):
    folder      = section["folder"]
    title       = section["title"]
    description = section["description"]
    icon        = section["icon"]
    hint        = section["hint"]
    folder_path = REPO_ROOT / folder

    if not folder_path.exists():
        folder_path.mkdir(parents=True, exist_ok=True)

    # Depth for relative asset paths
    depth       = folder.count("/") + 1
    asset_prefix = "../" * depth
    section_url  = f"{SITE_URL}/{quote(folder)}"

    # Collect files
    files = sorted(
        [f for f in folder_path.iterdir()
         if f.is_file() and f.name.lower() not in SKIP_FILES and not f.name.startswith(".")],
        key=lambda f: f.name.lower()
    )

    # Nav links (adjust depth)
    nav_links_html = ""
    pages = [
        (f"{asset_prefix}index.html",                          "Home"),
        (f"{asset_prefix}products/index.html",                 "Products"),
        (f"{asset_prefix}services/index.html",                 "Services"),
        (f"{asset_prefix}advertorials/index.html",             "Advertorials"),
        (f"{asset_prefix}small-apps/index.html",               "Small Apps"),
        (f"{asset_prefix}media/index.html",                    "Media"),
    ]
    for href, label in pages:
        active = 'class="active"' if folder.split("/")[0] in href else ""
        nav_links_html += f'      <a href="{href}" {active}>{label}</a>\n'

    # Breadcrumb
    parts = folder.split("/")
    breadcrumb = f'<a href="{asset_prefix}index.html">Home</a>'
    for i, p in enumerate(parts):
        breadcrumb += f'<span>/</span>'
        if i < len(parts) - 1:
            rel = "../" * (len(parts) - 1 - i)
            breadcrumb += f'<a href="{rel}index.html">{p.replace("-"," ").title()}</a>'
        else:
            breadcrumb += f'<span>{html.escape(title)}</span>'

    # Cards
    cards = "".join(card_html(f, folder_path, folder, section_url) for f in files)

    # Empty state
    if not files:
        gallery_body = f"""
    <div class="empty-state">
      <div class="empty-state-icon">{icon}</div>
      <h3>No files yet</h3>
      <p>{hint}</p>
      <code>GitHub &rarr; {folder}/</code>
    </div>"""
    else:
        gallery_body = f"""
    <div class="gallery-toolbar">
      <span class="gallery-count"><span id="fileCount">{len(files)} item{"s" if len(files)!=1 else ""}</span></span>
      <input class="search-box" id="gallerySearch" type="search" placeholder="Search files...">
    </div>
    <div class="file-grid">
      {cards}
    </div>"""

    # Share bar
    share_bar = f"""
  <div class="share-bar" style="margin-top:40px;">
    <span class="share-bar-label">Share this page:</span>
    <div class="share-buttons">
      <button class="share-btn share-whatsapp" onclick="shareWhatsApp('{html.escape(title)} — {SITE_NAME}','{section_url}/')">&#128172; WhatsApp</button>
      <button class="share-btn share-linkedin" onclick="shareLinkedIn('{section_url}/')">&#128279; LinkedIn</button>
      <button class="share-btn share-twitter"  onclick="shareTwitter('{html.escape(title)}','{section_url}/')">&#128038; Twitter</button>
      <button class="share-btn share-copy" id="copyLinkBtn" onclick="copyLink('{section_url}/')">&#128279; Copy Link</button>
    </div>
  </div>"""

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)} | Shiva Consultancy Group</title>
  <meta name="description" content="{html.escape(description)}">
  <meta property="og:title"       content="{html.escape(title)} | SCG">
  <meta property="og:description" content="{html.escape(description)}">
  <meta property="og:url"         content="{section_url}/">
  <link rel="stylesheet" href="{asset_prefix}assets/css/style.css">
</head>
<body>

<header class="site-header">
  <div class="nav-container">
    <a href="{asset_prefix}index.html" class="nav-brand">
      <div class="nav-brand-icon">S</div>
      <div class="nav-brand-text">
        <div class="company">Shiva Consultancy Group</div>
        <div class="tagline">Professional Business Solutions</div>
      </div>
    </a>
    <nav>
      <div class="nav-links" id="navLinks">
{nav_links_html}
      </div>
    </nav>
    <button class="nav-toggle" id="navToggle"><span></span><span></span><span></span></button>
  </div>
</header>

<div class="page-header">
  <div class="page-header-inner">
    <div class="breadcrumb">{breadcrumb}</div>
    <h1>{icon} {html.escape(title)}</h1>
    <p>{html.escape(description)}</p>
  </div>
</div>

<div class="main-content">
  <div class="upload-hint">
    <div class="upload-hint-icon">&#128161;</div>
    <div>
      <h4>How to add files</h4>
      <p>{hint} &mdash; Push to GitHub and the gallery updates automatically.</p>
    </div>
  </div>
{gallery_body}
{share_bar}
</div>

<footer class="site-footer">
  <div class="footer-bottom">&copy; 2024 Shiva Consultancy Group &nbsp;|&nbsp; Managed by Rakesh Jha</div>
</footer>
<script src="{asset_prefix}assets/js/main.js"></script>
</body>
</html>"""

    out_path = folder_path / "index.html"
    out_path.write_text(page, encoding="utf-8")
    print(f"  [OK] Generated: {folder}/index.html  ({len(files)} files)")


def generate_media_index():
    media_path = REPO_ROOT / "media"
    media_path.mkdir(exist_ok=True)
    (media_path / "index.html").write_text(media_index_html(), encoding="utf-8")
    print("  [OK] Generated: media/index.html")


if __name__ == "__main__":
    print(f"\nSCG Gallery Builder — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 50)
    generate_media_index()
    for section in SECTIONS:
        generate_gallery(section)
    print("=" * 50)
    print("Done! All gallery pages rebuilt.\n")
