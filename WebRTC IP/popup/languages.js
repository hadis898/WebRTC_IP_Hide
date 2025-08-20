// 多语言配置
const LANGUAGES = {
  zh: {
    // 头部
    title: 'WebRTC IP保护',
    
    // 状态文本
    status: {
      enabled: {
        text: 'IP 保护已开启',
        desc: '您的真实IP地址已隐藏'
      },
      disabled: {
        text: 'IP 保护已关闭',
        desc: '您的真实IP地址已泄露'
      }
    },
    
    // 控制标签
    controlLabel: 'WebRTC 保护开关',
    
    // 操作按钮
    actions: {
      checkIPLeak: '检测IP泄露'
    },
    
    // 语言切换
    language: '语言',
    zh: '中文',
    en: 'English',
    
    // 错误消息
    errors: {
      checkStatus: '检查保护状态时发生错误',
      changeSettings: '更改保护设置时发生错误'
    }
  },
  
  en: {
    // Header
    title: 'WebRTC IP Protection',
    
    // Status text
    status: {
      enabled: {
        text: 'IP Protection Enabled',
        desc: 'Your real IP address is hidden'
      },
      disabled: {
        text: 'IP Protection Disabled',
        desc: 'Your real IP address is exposed'
      }
    },
    
    // Control label
    controlLabel: 'WebRTC Protection Toggle',
    
    // Action buttons
    actions: {
      checkIPLeak: 'Check IP Leak'
    },
    
    // Language switch
    language: 'Language',
    zh: '中文',
    en: 'English',
    
    // Error messages
    errors: {
      checkStatus: 'Error occurred while checking protection status',
      changeSettings: 'Error occurred while changing protection settings'
    }
  }
};

// 获取当前语言
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'zh';
}

// 设置语言
function setLanguage(lang) {
  localStorage.setItem('language', lang);
  updateUILanguage();
}

// 获取翻译文本
function getText(key) {
  const currentLang = getCurrentLanguage();
  const keys = key.split('.');
  let value = LANGUAGES[currentLang];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return key; // 如果找不到翻译，返回键名
    }
  }
  
  return value;
}

// 更新界面语言
function updateUILanguage() {
  // 更新标题
  const titleElement = document.querySelector('.header h1');
  if (titleElement) {
    titleElement.textContent = getText('title');
  }
  
  // 更新状态文本
  const statusText = document.getElementById('status-text');
  const statusDesc = document.getElementById('status-desc');
  if (statusText && statusDesc) {
    const isProtected = document.getElementById('protectionToggle')?.checked || false;
    const status = isProtected ? 'enabled' : 'disabled';
    statusText.textContent = getText(`status.${status}.text`);
    statusDesc.textContent = getText(`status.${status}.desc`);
  }
  
  // 更新控制标签
  const controlLabel = document.querySelector('.control-label');
  if (controlLabel) {
    controlLabel.textContent = getText('controlLabel');
  }
  
  // 更新操作按钮
  const checkIPLeakBtn = document.querySelector('.action-btn span');
  if (checkIPLeakBtn) {
    checkIPLeakBtn.textContent = getText('actions.checkIPLeak');
  }
  
  // 更新语言切换器标签
  const languageLabel = document.querySelector('.language-label');
  if (languageLabel) {
    languageLabel.textContent = getText('language');
  }
  
  // 更新语言选项
  const zhOption = document.querySelector('.language-option[data-lang="zh"]');
  const enOption = document.querySelector('.language-option[data-lang="en"]');
  if (zhOption) zhOption.textContent = getText('zh');
  if (enOption) enOption.textContent = getText('en');
  
  // 更新当前语言指示器
  const currentLang = getCurrentLanguage();
  const currentLangIndicator = document.querySelector('.current-language');
  if (currentLangIndicator) {
    currentLangIndicator.textContent = currentLang === 'zh' ? '中文' : 'English';
  }
} 