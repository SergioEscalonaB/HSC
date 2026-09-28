/**
 * H.S.C. SERVICIOS, SUMINISTROS E INGENIERÍA S.A.S.
 * Canva-Style Photo Replacement Guide & Blueprint Assistant
 */

document.addEventListener('DOMContentLoaded', () => {
  initPhotoGuide();
});

function initPhotoGuide() {
  const guideToggles = document.querySelectorAll('.btn-guide-toggle, .floating-guide-btn');
  const drawer = document.getElementById('guide-drawer');
  const drawerClose = document.getElementById('close-guide-drawer');
  const toast = document.getElementById('copy-toast');

  // Toggle blueprint mode on body
  guideToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If clicking floating button, also open drawer
      if (btn.classList.contains('floating-guide-btn')) {
        openDrawer();
      } else {
        document.body.classList.toggle('photo-guide-active');
        const isActive = document.body.classList.contains('photo-guide-active');
        btn.classList.toggle('active', isActive);
        showToast(isActive ? '🎯 Modo Guía Activado: Las rutas de fotos ahora son visibles' : 'Modo Guía Desactivado');
      }
    });
  });

  // Open & close drawer
  function openDrawer() {
    if (drawer) drawer.classList.add('open');
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  // Toast notification helper
  function showToast(message) {
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Click on blueprint badges to copy path
  document.querySelectorAll('.photo-slot').forEach(slot => {
    const badge = slot.querySelector('.blueprint-badge');
    if (badge) {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const path = slot.getAttribute('data-path') || slot.querySelector('img')?.getAttribute('src');
        if (path) {
          copyToClipboard(path);
          showToast(`📋 Ruta copiada: ${path}`);
        }
      });
    }
  });

  // Copy buttons inside drawer
  document.querySelectorAll('.guide-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const path = btn.getAttribute('data-copy');
      if (path) {
        copyToClipboard(path);
        showToast(`📋 Copiado: ${path}`);
      }
    });
  });

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }
}
