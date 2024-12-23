// content.js
// 외부 CSS 파일 추가
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css';
document.head.appendChild(link);

// CSS 스타일 추가
const style = document.createElement('style');
style.textContent = `
  html, body, div, h1, h2, h3, h4, h5, h6, ul, ol, li, a, b, p, input, button, textarea, small {
    font-family: 'Pretendard' !important;
  }
`;
document.head.appendChild(style);
