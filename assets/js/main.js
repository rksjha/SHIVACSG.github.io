/* ============================================================
   Shiva Consultancy Group — Main JavaScript
   ============================================================ */

// ---------- Mobile Navigation Toggle ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
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
    if (path.includes(a.getAttribute('href').replace('./', ''))) {
      a.classList.add('active');
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
    if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => btn.textContent = '🔗 Copy Link', 2000); }
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

// ---------- Init on load ----------
document.addEventListener('DOMContentLoaded', () => {
  initSearch('gallerySearch', '.file-card');
  updateCount();
});
