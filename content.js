const url = new URL(window.location.href);
const domain = url.hostname;

chrome.storage.local.get(domain, (data) => {
  const enabled = data[domain] ?? true;

  if (enabled) {
    // Pretendard 적용 코드
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.textContent = `
      html, body, div, h1, h2, h3, h4, h5, h6, ul, ol, li, a, b, p, input, button, textarea, small {
        font-family: 'Pretendard' !important;
      }
    `;
    document.head.appendChild(style);
  }
});
