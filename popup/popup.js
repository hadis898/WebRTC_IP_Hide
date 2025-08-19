// 常量定义
const CONSTANTS = {
  PROTECTED_POLICY: 'disable_non_proxied_udp',
  DEFAULT_POLICY: 'default',
  ERROR_DISPLAY_TIME: 3000,
  DEBOUNCE_DELAY: 300,
  STATUS: {
    ENABLED: {
      TEXT: '保护状态：已开启',
      DESC: '您的真实IP地址已隐藏',
      ICON: '../assets/icons/safe.svg'
    },
    DISABLED: {
      TEXT: '保护状态：已关闭',
      DESC: '您的真实IP地址已泄露',
      ICON: '../assets/icons/warning.svg'
    }
  }
};

// 工具函数 - 防抖
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 检查 WebRTC 隐私保护状态
async function checkWebRTCProtection() {
  try {
    const result = await chrome.privacy.network.webRTCIPHandlingPolicy.get({});
    const isProtected = result.value === CONSTANTS.PROTECTED_POLICY;
    updateUI(isProtected);
    return isProtected;
  } catch (error) {
    handleError('检查保护状态时发生错误', error);
    return false;
  }
}

// 更新界面显示
function updateUI(isProtected) {
  const statusIcon = document.getElementById('status-icon');
  const statusText = document.getElementById('status-text');
  const statusDesc = document.getElementById('status-desc');
  const toggle = document.getElementById('protectionToggle');
  const statusCard = document.querySelector('.status-card');

  if (!statusIcon || !statusText || !statusDesc || !toggle || !statusCard) {
    console.error('UI 元素未找到');
    return;
  }

  const status = isProtected ? CONSTANTS.STATUS.ENABLED : CONSTANTS.STATUS.DISABLED;
  statusText.textContent = status.TEXT;
  statusDesc.textContent = status.DESC;
  statusIcon.src = status.ICON;
  toggle.checked = isProtected;

  // 更新状态标题文字颜色
  if (isProtected) {
    statusText.classList.remove('status-disabled');
    statusText.classList.add('status-enabled');
  } else {
    statusText.classList.remove('status-enabled');
    statusText.classList.add('status-disabled');
  }

  // 更新状态描述文字颜色
  if (isProtected) {
    statusDesc.classList.remove('leak-warning');
    statusDesc.classList.add('protection-success');
  } else {
    statusDesc.classList.remove('protection-success');
    statusDesc.classList.add('leak-warning');
  }

  // 更新状态卡片样式
  if (isProtected) {
    statusCard.classList.remove('unprotected');
    statusCard.classList.add('protected');
  } else {
    statusCard.classList.remove('protected');
    statusCard.classList.add('unprotected');
  }
}

// 错误处理
function handleError(message, error) {
  console.error(`${message}:`, error);
  showError(message);
}

// 显示错误信息
function showError(message) {
  const errorDiv = document.getElementById('error-message') || createErrorElement();
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, CONSTANTS.ERROR_DISPLAY_TIME);
}

// 创建错误信息元素
function createErrorElement() {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error-message';
  errorDiv.className = 'error-message';
  document.body.appendChild(errorDiv);
  return errorDiv;
}

// 切换 WebRTC 保护状态
const toggleProtection = debounce(async function(enable) {
  try {
    await chrome.privacy.network.webRTCIPHandlingPolicy.set({
      value: enable ? CONSTANTS.PROTECTED_POLICY : CONSTANTS.DEFAULT_POLICY
    });
    updateUI(enable);
  } catch (error) {
    handleError('更改保护设置时发生错误', error);
    const toggle = document.getElementById('protectionToggle');
    if (toggle) toggle.checked = !enable;
  }
}, CONSTANTS.DEBOUNCE_DELAY);

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  await checkWebRTCProtection();
  
  // 设置开关监听器
  const toggle = document.getElementById('protectionToggle');
  if (toggle) {
    toggle.addEventListener('change', (e) => toggleProtection(e.target.checked));
  }
}); 