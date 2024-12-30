// chrome.runtime.onInstalled.addListener(() => {
//   console.log("Extension installed");
// });

// 监听扩展图标的点击事件
// chrome.action.onClicked.addListener((tab) => {
//     if (chrome.sidePanel) {
//         chrome.sidePanel.open(); // 打开侧边栏
//     } else {
//         console.error("chrome.sidePanel is not available.");
//     }
// });
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ tabId: tab.id });
  });

// background.js

   // background.js

  

// function openTranslateX() {
//   const popupUrl = chrome.runtime.getURL("popup.html");

//   const existingIframe = document.getElementById("TranslationX");
//   if (existingIframe) {
//     existingIframe.style.display =
//       existingIframe.style.display === "none" ? "block" : "none";
//     return;
//   }

//   const iframe = document.createElement("iframe");
//   iframe.id = "TranslationX";
//   //   iframe.src = chrome.runtime.getURL("popup.html"); // 确保指向你的 HTML 文件
//   //   console.log("iframe.src: ", iframe.src); // 打印 iframe 的 src
//   iframe.src = popupUrl;

//   iframe.style.position = "fixed";
//   iframe.style.width = "20vw"; // 占据视窗宽度的 20%
//   iframe.style.height = "100vh"; // 占据视窗高度的 100%
//   iframe.style.top = "0";
//   iframe.style.right = "0"; // 靠右侧显示
//   iframe.style.zIndex = "10000";
//   iframe.style.border = "none";
//   iframe.style.background = "transparent"; // 设置为透明背景

//   // 初始时隐藏iframe
//   iframe.style.display = "none";

//   document.body.appendChild(iframe);

//   // 使用setTimeout或Promise来延迟显示iframe，确保页面布局已完成
//   setTimeout(() => {
//     iframe.style.display = "block"; // 立即显示
//   }, 50); // 0毫秒延迟，页面重绘后立即执行
// }
