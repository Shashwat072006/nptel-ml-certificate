document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const quickCopyBtn = document.getElementById('quickCopyBtn');
  const downloadCertBtn = document.getElementById('downloadCertBtn');
  const printCertBtn = document.getElementById('printCertBtn');
  const openQrModalBtn = document.getElementById('openQrModalBtn');
  const shareBtn = document.getElementById('shareBtn');
  const qrModal = document.getElementById('qrModal');
  const closeQrModalBtn = document.getElementById('closeQrModalBtn');
  const copyModalUrlBtn = document.getElementById('copyModalUrlBtn');
  const toast = document.getElementById('toast');

  // View toggles
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const authenticView = document.getElementById('authenticView');
  const digitalView = document.getElementById('digitalView');

  // Zoom controls
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomResetBtn = document.getElementById('zoomResetBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const zoomLevelText = document.getElementById('zoomLevelText');
  const certificateViewport = document.getElementById('certificateViewport');
  const certificateWrapper = document.getElementById('certificateWrapper');

  const pageUrl = window.location.href.split('#')[0];
  let currentZoom = 1;

  // Toast Helper
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Copy URL Functionality
  function copyUrlToClipboard() {
    navigator.clipboard.writeText(pageUrl).then(() => {
      showToast('Verification URL copied to clipboard!');
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = pageUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('Verification URL copied to clipboard!');
    });
  }

  if (quickCopyBtn) {
    quickCopyBtn.addEventListener('click', copyUrlToClipboard);
  }

  if (copyModalUrlBtn) {
    copyModalUrlBtn.addEventListener('click', copyUrlToClipboard);
  }

  // Download Certificate
  if (downloadCertBtn) {
    downloadCertBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = 'assets/certificate_hd.png';
      link.download = 'NPTEL_Certificate_Shashwat_Singh_ML_Elite.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Downloading high-resolution certificate...');
    });
  }

  // Print Certificate
  if (printCertBtn) {
    printCertBtn.addEventListener('click', () => {
      // Ensure authentic view is visible for print
      authenticView.classList.remove('hidden');
      digitalView.classList.add('hidden');
      toggleBtns.forEach(b => b.classList.remove('active'));
      document.querySelector('.toggle-btn[data-view="authentic"]')?.classList.add('active');
      window.print();
    });
  }

  // Share functionality
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Verified NPTEL Certificate - Shashwat Singh',
            text: 'View Shashwat Singh\'s verified NPTEL Elite Certification in Introduction to Machine Learning from IIT Madras.',
            url: pageUrl
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyUrlToClipboard();
          }
        }
      } else {
        copyUrlToClipboard();
      }
    });
  }

  // View Switcher (Authentic vs Digital)
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;

      if (view === 'authentic') {
        authenticView.classList.remove('hidden');
        digitalView.classList.add('hidden');
      } else {
        authenticView.classList.add('hidden');
        digitalView.classList.remove('hidden');
      }
      resetZoom();
    });
  });

  // Zoom Logic
  function updateZoom(newZoom) {
    currentZoom = Math.min(Math.max(newZoom, 0.5), 2.5);
    certificateViewport.style.transform = `scale(${currentZoom})`;
    zoomLevelText.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  function resetZoom() {
    currentZoom = 1;
    certificateViewport.style.transform = 'scale(1)';
    zoomLevelText.textContent = '100%';
  }

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => updateZoom(currentZoom + 0.15));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => updateZoom(currentZoom - 0.15));
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);

  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        certificateWrapper.requestFullscreen?.().catch(err => {
          showToast('Fullscreen not supported');
        });
      } else {
        document.exitFullscreen?.();
      }
    });
  }

  // QR Modal
  if (openQrModalBtn) {
    openQrModalBtn.addEventListener('click', () => {
      qrModal.classList.add('show');
    });
  }

  if (closeQrModalBtn) {
    closeQrModalBtn.addEventListener('click', () => {
      qrModal.classList.remove('show');
    });
  }

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        qrModal.classList.remove('show');
      }
    });
  }

  // Keyboard escape listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal?.classList.contains('show')) {
      qrModal.classList.remove('show');
    }
  });
});
