const checkbox = document.getElementById("toggleCheckbox");
const label = document.getElementById("toggleLabel");
const domainLabel = document.getElementById("domainLabel");
const offDomainList = document.getElementById("offDomainList");
const resetBtn = document.getElementById("resetBtn");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (!tabs.length || !tabs[0].url.startsWith("http")) {
    domainLabel.textContent = "유효하지 않은 페이지";
    label.textContent = "이 페이지에서는 사용 불가";
    checkbox.disabled = true;
    return;
  }

  const url = new URL(tabs[0].url);
  const domain = url.hostname;

  domainLabel.textContent = domain;

  chrome.storage.local.get(domain, (data) => {
    const enabled = data[domain] ?? true;
    checkbox.checked = enabled;
    label.textContent = `상태: ${enabled ? "켜짐" : "꺼짐"}`;
  });

  checkbox.addEventListener("change", () => {
    const enabled = checkbox.checked;
    chrome.storage.local.set({ [domain]: enabled }, () => {
      label.textContent = `상태: ${enabled ? "켜짐" : "꺼짐"}`;
      chrome.tabs.reload(tabs[0].id);
    });
  });
});

// 꺼진 도메인 목록 표시
chrome.storage.local.get(null, (allData) => {
  const disabledDomains = Object.entries(allData)
    .filter(([_, enabled]) => enabled === false)
    .map(([domain]) => domain);

  offDomainList.innerHTML = disabledDomains.length
    ? disabledDomains.map(domain => `<li>${domain}</li>`).join("")
    : "<li>없음</li>";
});

// 초기화 버튼
resetBtn.addEventListener("click", () => {
  if (confirm("모든 설정을 초기화할까요?")) {
    chrome.storage.local.clear(() => {
      offDomainList.innerHTML = "<li>없음</li>";
      alert("모든 설정이 초기화되었습니다.");
    });
  }
});


const addDomainInput = document.getElementById("addDomainInput");
const addDomainBtn = document.getElementById("addDomainBtn");

// 도메인 목록 다시 렌더링
function renderDisabledDomains() {
  chrome.storage.local.get(null, (allData) => {
    const disabledDomains = Object.entries(allData)
      .filter(([_, enabled]) => enabled === false)
      .map(([domain]) => domain);

    if (disabledDomains.length === 0) {
      offDomainList.innerHTML = "<li>없음</li>";
      return;
    }

    offDomainList.innerHTML = disabledDomains.map(domain => `
      <li>
        ${domain}
        <button data-domain="${domain}" class="delete-btn" style="margin-left: 6px;">❌</button>
      </li>
    `).join("");

    // 삭제 버튼 이벤트 바인딩
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const domainToDelete = e.target.dataset.domain;
        chrome.storage.local.remove(domainToDelete, () => {
          renderDisabledDomains();
        });
      });
    });
  });
}

renderDisabledDomains();

// ➕ 도메인 수동 추가
addDomainBtn.addEventListener("click", () => {
  const domain = addDomainInput.value.trim().toLowerCase();
  if (!domain || !domain.includes(".")) {
    alert("올바른 도메인 형식이 아닙니다.");
    return;
  }

  chrome.storage.local.set({ [domain]: false }, () => {
    addDomainInput.value = "";
    renderDisabledDomains();
  });
});

// 🗑 초기화
resetBtn.addEventListener("click", () => {
  if (confirm("모든 설정을 초기화할까요?")) {
    chrome.storage.local.clear(() => {
      renderDisabledDomains();
      alert("모든 설정이 초기화되었습니다.");
    });
  }
});
