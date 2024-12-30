// const serverUrl = "http://localhost:5000";
const serverUrl = "https://transwise.onrender.com";

// 当扩展图标被点击时注入内容脚本
chrome.action.onClicked.addListener(async (tab) => {
  // 然后执行打开弹窗的逻辑
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: openPopup,
  });
});

function openPopup() {
  const popupUrl = chrome.runtime.getURL("popup.html");
  const existingIframe = document.getElementById("TranslateX");

  if (existingIframe) {
    existingIframe.style.display =
      existingIframe.style.display === "none" ? "block" : "none";
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.id = "TranslateX";
  iframe.src = popupUrl;
  iframe.style.position = "fixed";
  iframe.style.width = "400px";
  iframe.style.height = "100vh";
  iframe.style.top = "0";
  iframe.style.right = "0";
  iframe.style.zIndex = "10000";
  iframe.style.border = "none";
  // iframe.style.backgroundColor = "#fff4e8";
  iframe.style.background = "transparent"; 
  iframe.style.transition = "background 0.5s ease"; // 添加过渡效果

  // 初始时隐藏iframe
  iframe.style.display = "none";

  document.body.appendChild(iframe);

  // 使用setTimeout或Promise来延迟显示iframe，确保页面布局已完成
  setTimeout(() => {
    iframe.style.display = "block"; // 立即显示
  }, 50); // 0毫秒延迟，页面重绘后立即执行

  // 在 iframe 加载完成后，初始化 Vue 实例
  //   iframe.onload = () => {
  //     const iframeWindow = iframe.contentWindow;
  //     const app = iframeWindow.createApp(App); // 假设 App 是你的 Vue 组件

  //     // 如果已经有实例挂载，先卸载它
  //     if (!appInstance) {
  //       appInstance = app.mount(iframeWindow.document.body); // 挂载到 iframe 的 body
  //     }
  // };
}

// background.js
let selectedText = "";

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateSelectedText") {
    selectedText = request.text; // 存储选中的文本

    // 如果选中的文本不为空，则向弹出窗口发送消息
    if (selectedText) {
      chrome.runtime.sendMessage({
        action: "textSelected",
        text: selectedText,
      });
    } else {
      chrome.runtime.sendMessage({ action: "textNotSelected" });
    }
  } else if (request.action === "NoSelectedText") {
    chrome.runtime.sendMessage({ action: "textNotSelected" });
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "clearSelection") {
    // 直接转发消息给内容脚本
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "clearSelection" });
      }
    });
  }
});



// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "triggerApiRequest") {
    const inputValue = request.inputValue; // 获取输入框的值
    console.log("from backgroud: ", inputValue);

    // 调用后端 API
    fetch(serverUrl + "/api/profession_ability/input-trans", {
      method: "POST", // 或 'GET'，根据需要
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputValue: inputValue }), // 发送输入框的值
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("成功:", data);
        // 可以选择发送响应回内容脚本
        sendResponse({ success: true, data: data });
      })
      .catch((error) => {
        console.error("错误:", error);
        sendResponse({ success: false, error: error });
      });

    // 返回 true 以指示将使用 sendResponse 异步响应
    return true;
  }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("from backgroud.js: showLoginModal")
  if (request.action === "showLoginModal") {
    const modalTitle = encodeURIComponent(request.modalTitle);
    const url = chrome.runtime.getURL(`login.html?title=${modalTitle}`);
    
    chrome.windows.getCurrent((currentWindow) => {
      const screenWidth = currentWindow.width;
      const screenHeight = currentWindow.height;

      const width = 600;
      const height = 600;
      
      const left = Math.round((screenWidth - width) / 2);
      const top = Math.round((screenHeight - height) / 2);

      chrome.windows.create({
        url: url,
        type: 'popup',
        width: width,
        height: height,
        left: left,
        top: top
      }, (newWindow) => {
        chrome.windows.onRemoved.addListener(function listener(windowId) {
          if (windowId === newWindow.id) {
            chrome.windows.onRemoved.removeListener(listener);
            // Here you would check the login status and send the appropriate response
            const loginSuccess = true; // Simulate login success
            sendResponse({ success: loginSuccess });
          }
        });
      });
    });

    // Return true to indicate we will send a response asynchronously
    return true;
  }

  if (request.action === "RegisterSuccess") {
    chrome.storage.sync.set({ userData: request.userData }, () => {
      sendResponse({ success: true });
      // 通知前台脚本
      chrome.runtime.sendMessage({ action: 'updateUI', userData: request.userData });
      console.log("RegisterSuccess in backgroud.js is: ", request.userData)
    });

    return true; // Return true to indicate we will send a response asynchronously
  }

  if (request.action === "loginStatus") {
    console.log("from loginStatus: ", request)
    chrome.storage.sync.set({ userData: request.userData }, () => {
      sendResponse({ success: true });
          
    // 通知前台脚本
    chrome.runtime.sendMessage({ action: 'updateUI', userData: request.userData });
    console.log("loginStatus in backgroud.js is: ", request.userData)});

    // chrome.storage.local.set({ userData: request.userData }, () => {
    //   sendResponse({ success: true });
    //   // 通知前台脚本
    //   chrome.runtime.sendMessage({ action: 'updateUI', userData: request.userData });
    //   console.log("backgroud.js is: ", request.userData)
    // });

    return true; // Return true to indicate we will send a response asynchronously
  }
  if (request.action === "loginFail") {
    chrome.runtime.sendMessage({ action: 'notLogin' });
    console.log("login Failed")

  }
});
