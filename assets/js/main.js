/* ============================================================
   Shiva Consultancy Group — Main JavaScript
   ============================================================ */

// ---------- Config ----------
const SITE_ROOT = 'https://rksjha.github.io/SHIVACSG.github.io';
const GITHUB_REPO = 'rksjha/SHIVACSG.github.io';

// ---------- Utility ----------
function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return bytes + ' B';
}

function folderForFile(name) {
  const n = (name || '').toLowerCase();
  if (/\.(jpg|jpeg|png|gif|webp)$/.test(n)) return 'images';
  if (/\.(mp4|mov|webm)$/.test(n)) return 'videos';
  if (n.endsWith('.pdf')) return 'pdfs';
  return '';
}

function cleanTitle(fileName) {
  return fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
}

// ---------- Mobile Navigation Toggle / Footer fix ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
      }
    });
  }

  // Highlight active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (path.includes(href.replace('./', ''))) {
      a.classList.add('active');
    }
  });

  // Convert placeholder footer links (#) into real links (from profile)
  document.querySelectorAll('.site-footer a').forEach(a => {
    const t = (a.textContent || '').toLowerCase();
    if (t.includes('whatsapp')) {
      a.href = 'https://wa.me/919979021275';
      a.target = '_blank';
      a.rel = 'noopener';
      return;
    }
    if (t.includes('linkedin')) {
      a.href = 'https://www.linkedin.com/in/rksjha';
      a.target = '_blank';
      a.rel = 'noopener';
      return;
    }
    if (t.includes('agriculture infrastructure')) {
      a.href = 'https://rksjha.github.io/SHIVACSG.github.io/Product%20and%20service%20profile/index.html';
      return;
    }
    if (t.includes('government schemes')) {
      a.href = 'https://rksjha.github.io/SHIVACSG.github.io/services/index.html';
      return;
    }
    if (t.includes('food processing')) {
      a.href = 'https://rksjha.github.io/SHIVACSG.github.io/Product%20and%20service%20profile/index.html';
      return;
    }
    if (t.includes('business development')) {
      a.href = 'https://rksjha.github.io/SHIVACSG.github.io/services/index.html';
      return;
    }
    if (t.includes('ipo')) {
      a.href = 'https://rksjha.github.io/SHIVACSG.github.io/advertorials/index.html';
      return;
    }
    if (t.includes('institutional')) {
      a.href = 'https://rksjha.github.io/SHIVACSG.github.io/services/index.html';
      return;
    }
  });
});

// ---------- Live Search Filter for Gallery ----------
function initSearch(inputId, cardSelector) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll(cardSelector).forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
    updateCount();
  });
}

function updateCount() {
  const counter = document.getElementById('fileCount');
  if (!counter) return;
  const visible = document.querySelectorAll('.file-card:not([style*="none"])').length;
  counter.textContent = visible + ' item' + (visible !== 1 ? 's' : '');
}

// ---------- Social Sharing ----------
function shareWhatsApp(title, url) {
  const msg = encodeURIComponent(`${title}\n${url}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}
function shareLinkedIn(url) {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
}
function shareTwitter(title, url) {
  const text = encodeURIComponent(`${title} — ${url}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}
function copyLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('copyLinkBtn');
    if (btn) {
      btn.textContent = '✓ Copied!';
      setTimeout(() => (btn.textContent = '🔗 Copy Link'), 2000);
    }
  });
}

// ---------- Share individual file ----------
function shareFile(title, url) {
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => fallbackShare(title, url));
  } else {
    fallbackShare(title, url);
  }
}
function fallbackShare(title, url) {
  const text = `${title}\n${url}`;
  navigator.clipboard.writeText(text).then(() => alert('Link copied to clipboard!'));
}

// ---------- Media gallery helpers ----------
function fixRecentMediaCards() {
  document.querySelectorAll('.file-card').forEach(card => {
    const view = card.querySelector('.btn-view');
    if (!view) return;
    const fileName = view.getAttribute('href') || '';

    // If already points into a folder, leave it alone
    if (fileName.includes('/')) return;

    const folder = folderForFile(fileName);
    if (!folder) return;

    const titleEl = card.querySelector('.file-card-name');
    const title = (titleEl?.textContent || cleanTitle(fileName)).trim();
    const publicUrl = `${SITE_ROOT}/media/${folder}/${fileName}`;

    // Fix view/play href (relative from /media/)
    view.href = `${folder}/${fileName}`;

    // Fix thumbnail sources
    const img = card.querySelector('img');
    if (img) img.src = `${folder}/${fileName}`;
    const video = card.querySelector('video');
    if (video) video.src = `${folder}/${fileName}`;

    // Fix share handler
    const shareBtn = card.querySelector('.btn-share');
    if (shareBtn) shareBtn.onclick = () => shareFile(title, publicUrl);
  });
}

async function loadMediaFolderIfPresent() {
  const path = window.location.pathname;
  const match = path.match(/\/media\/(images|videos|pdfs)\//);
  const folder = match ? match[1] : '';
  if (!folder) return;

  const meta = {
    images: { label: 'Image', color: '#27ae60', viewLabel: '👁 View', exts: ['jpg', 'jpeg', 'png', 'gif', 'webp'] },
    videos: { label: 'Video', color: '#8e44ad', viewLabel: '▶ Play', exts: ['mp4', 'mov', 'webm'] },
    pdfs: { label: 'PDF', color: '#2980b9', viewLabel: '⬇ Download', exts: ['pdf'] }
  };

  const m = meta[folder];
  if (!m) return;

  let res;
  try {
    res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/media/${folder}`);
  } catch {
    return;
  }
  if (!res.ok) return;

  let files = [];
  try {
    files = await res.json();
  } catch {
    return;
  }

  const items = files.filter(f => {
    if (f.type !== 'file') return false;
    if (!f.name) return false;
    const n = f.name.toLowerCase();
    if (n === '.gitkeep' || n === 'index.html') return false;
    return m.exts.some(ext => n.endsWith(`.${ext}`));
  });

  if (!items.length) return;

  const main = document.querySelector('.main-content');
  if (!main) return;

  // Remove any "no files yet" state
  main.querySelector('.empty-state')?.remove();

  // Ensure toolbar exists
  let toolbar = main.querySelector('.gallery-toolbar');
  if (!toolbar) {
    toolbar = document.createElement('div');
    toolbar.className = 'gallery-toolbar';
    toolbar.innerHTML = `
      <span class="gallery-count"><span id="fileCount"></span></span>
      <input class="search-box" id="gallerySearch" type="search" placeholder="Search...">
    `;
    main.appendChild(toolbar);
  }

  // Ensure grid exists
  let grid = main.querySelector('.file-grid');
  if (!grid) {
    grid = document.createElement('div');
    grid.className = 'file-grid';
    main.appendChild(grid);
  } else {
    grid.innerHTML = '';
  }

  for (const item of items) {
    const fileName = item.name;
    const title = cleanTitle(fileName);
    const publicUrl = `${SITE_ROOT}/media/${folder}/${fileName}`;
    const ext = fileName.split('.').pop().toUpperCase();

    const card = document.createElement('div');
    card.className = 'file-card';
    card.dataset.name = fileName.toLowerCase();

    const thumb = document.createElement('div');
    thumb.className = 'file-card-thumb';

    if (folder === 'images') {
      const img = document.createElement('img');
      img.src = fileName;
      img.alt = fileName;
      img.loading = 'lazy';
      thumb.appendChild(img);
    }
    if (folder === 'videos') {
      const video = document.createElement('video');
      video.src = fileName;
      video.preload = 'metadata';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.muted = true;
      thumb.appendChild(video);
    }

    const badge = document.createElement('div');
    badge.className = 'file-card-type-badge';
    badge.style.background = m.color;
    badge.textContent = m.label;
    thumb.appendChild(badge);

    const body = document.createElement('div');
    body.className = 'file-card-body';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'file-card-name';
    nameDiv.textContent = title;
    body.appendChild(nameDiv);

    const metaDiv = document.createElement('div');
    metaDiv.className = 'file-card-meta';
    metaDiv.innerHTML = `${ext} &nbsp;${formatBytes(item.size || 0)}`;
    body.appendChild(metaDiv);

    const actions = document.createElement('div');
    actions.className = 'file-card-actions';

    const view = document.createElement('a');
    view.className = 'btn-sm btn-view';
    view.href = fileName;
    view.target = '_blank';
    view.textContent = m.viewLabel;
    actions.appendChild(view);

    const shareBtn = document.createElement('button');
    shareBtn.className = 'btn-sm btn-share';
    shareBtn.textContent = '⇧ Share';
    shareBtn.onclick = () => shareFile(title, publicUrl);
    actions.appendChild(shareBtn);

    card.appendChild(thumb);
    card.appendChild(body);
    card.appendChild(actions);
    grid.appendChild(card);
  }
}

// ---------- Init on load ----------
document.addEventListener('DOMContentLoaded', async () => {
  fixRecentMediaCards();
  await loadMediaFolderIfPresent();
  initSearch('gallerySearch', '.file-card');
  updateCount();
});
