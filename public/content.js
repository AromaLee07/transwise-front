// 创建一个 <link> 元素
// const link = document.createElement("link");
// link.rel = "stylesheet"; // 设置为样式表
// link.type = "text/css"; // 设置类型
// link.href = chrome.runtime.getURL("transIcon.css"); // 指向您的 CSS 文件

// // 将 <link> 元素添加到 <head> 中
// document.head.appendChild(link);

// 全局变量来存储切换开关的状态
let isSelecting = false; // 标记用户是否正在选择文本

let selectedText = "";

// 监听鼠标按下事件
document.addEventListener("mousedown", function () {
  isSelecting = true; // 用户开始选择
});

// 监听鼠标释放事件
document.addEventListener("mouseup", function () {
  isSelecting = false; // 重置选择状态
  const selectedText = window.getSelection().toString(); // 获取选中的文本

  if (!selectedText) {
    // 如果没有选中的文本，发送无选中消息
    console.log("没有选中的文本");
    sendMessageToBackground({ action: "NoSelectedText" });
  }
});

// 监听鼠标移动事件
document.addEventListener("mousemove", function () {
  if (isSelecting) {
    selectedText = window.getSelection().toString();

    // 仅在有选中的文本时发送消息
    if (selectedText) {
      console.log("当前选中的文本:", selectedText);
      sendMessageToBackground({
        action: "updateSelectedText",
        text: selectedText,
      });
    }
  }
  // else {
  //   console.log("isSelecting=false,NoSelectedText")

  //   chrome.runtime.sendMessage({ action: "NoSelectedText" });
  // }
});

// 监听键盘按下事件
document.addEventListener("keyup", function (event) {
  // 检查是否按下了 Shift、Ctrl 或 Alt 键
  if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
    console.log("event.key: ", event.key);
    selectedText = window.getSelection().toString();

    if (selectedText) {
      console.log("当前选中的文本:", selectedText);
      sendMessageToBackground({
        action: "updateSelectedText",
        text: selectedText,
      });
    }
  }
  // 检查是否按下了上下左右箭头键
  // if (event.shiftKey && (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight")) {

  // 检查是否按下了上下左右箭头键
  if (
    event.shiftKey &&
    (event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight")
  ) {
    console.log("Shift + 箭头键被按下");
    // 在这里可以处理文本选择的逻辑
    event.preventDefault(); // 阻止默认行为（如滚动）
  }
});

// 监听键盘事件（例如，Shift + 鼠标选择）
// document.addEventListener("keyup", function (event) {
//   // if (event.key === "Shift") {
//   if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) {
//     isSelecting = false; // 如果用户释放 Shift 键，重置选择状态
//     const selectedText = window.getSelection().toString(); // 获取选中的文本

//     if (!selectedText) {
//       // 如果没有选中的文本，发送无选中消息
//       console.log("没有选中的文本");
//       chrome.runtime.sendMessage({ action: "NoSelectedText" });
//     }
//   }
// });

// 监听选择变化事件
document.addEventListener("selectionchange", function () {
  if (isSelecting) {
    selectedText = window.getSelection().toString();

    // 仅在有选中的文本时发送消息
    if (selectedText) {
      console.log("当前选中的文本:", selectedText);
      sendMessageToBackground({
        action: "updateSelectedText",
        text: selectedText,
      });
    }
  }
});

let iconContainer = document.querySelector(".icon-container");

if (!iconContainer) {
  // 创建图标容器的静态定义
  iconContainer = document.createElement("div");
  iconContainer.className = "icon-container"; // 设置图标容器的类名
  iconContainer.style.position = "absolute"; // 设置绝对定位
  iconContainer.style.display = "none"; // 初始隐藏图标容器
  iconContainer.style.zIndex = "2147483647";

  // 创建图标元素
  const icon = document.createElement("img");
  icon.src = chrome.runtime.getURL("icons/icons8-translate-16.png"); // 使用 chrome.runtime.getURL 获取插件内的图标路径
  icon.style.cursor = "pointer"; // 设置鼠标样式
  icon.style.width = "16px"; // 设置图标宽度
  icon.style.height = "16px"; // 设置图标高度

  // 将图标添加到图标容器
  iconContainer.appendChild(icon);

  // 将图标容器添加到文档中
  document.body.appendChild(iconContainer); // 将图标容器添加到文档中
}

let isToggleOn = false;
// console.log("from conten",localStorage.getItem("toggleSwitchState"));

chrome.storage.local.get("toggleSwitchState", (result) => {
  isToggleOn = result.toggleSwitchState === true; // 获取状态并转换为布尔值
  console.log("从 chrome.storage.local 获取的状态:", isToggleOn);

  // 根据状态执行相应的逻辑
  if (isToggleOn) {
    console.log("切换开关已打开，执行相应逻辑");
    // executeLogic();
  } else {
    console.log("切换开关已关闭，执行相应逻辑");
  }
});

// 监听来自 popup.js 的消息

chrome.storage.onChanged.addListener((changes, area) => {
  console.log("hrome.storage.onChanged");
  if (area === "local" && changes.toggleSwitchState) {
    isToggleOn = changes.toggleSwitchState.newValue === true; // 更新状态
    console.log("chrome.storage.onChanged: ", isToggleOn);
    // 根据状态执行相应的逻辑
  }
});

// 全局监听鼠标点击事件
document.addEventListener("mousedown", (event) => {
  // 直接在这里检查 isToggleOn
  if (!isToggleOn) return; // 如果开关关闭，直接返回

  // 获取用户点击的目标元素
  const target = event.target;
  // 输出当前被点击的元素
  console.log("当前被点击的元素:", target);
  // 检查目标元素是否是可编辑的
  if (
    target.isContentEditable ||
    target.matches(
      "input:not([type='hidden']):not([disabled]):not([style*='display']), " + // 选择所有未隐藏和未禁用的输入框
        "textarea:not([hidden]):not([disabled]):not([style*='display'])"
    )
  ) {
    //

    // 获取输入框的绝对位置
    const rect = target.getBoundingClientRect();

    // 获取输入框的计算样式
    const style = window.getComputedStyle(target);
    const paddingRight = parseFloat(style.paddingRight);
    const inputEndX = rect.left + rect.width - paddingRight; // 输入框的右侧位置（可输入区域）
    // const inputEndX = rect.left - paddingRight; // 输入框的右侧位置（可输入区域）

    // 更新图标容器的位置
    const marginRight = 5; // 设置右侧外边距
    iconContainer.style.left = `${
      inputEndX - 16 - marginRight + window.scrollX
    }px`;

    // 计算图标的左侧位置
    // iconContainer.style.left = `${rect.left + window.scrollX}px`; // 设置图标的左侧位置

    // 设置图标的左侧位置
    // const inputMiddleY = rect.top + window.scrollY + rect.height / 2 - 16 / 2; // 计算中间位置
    // const inputMiddleY = window.scrollY + rect.top  - 16 / 2; // 计算中间位置

    const marginBottom = 5;
    // 使用当前输入框的高度来计算图标位置
    const inputBottomY =
      rect.top + window.scrollY + rect.height / 2 - 16 / 2 - marginBottom; // 计算输入框底部位置

    // 计算图标的顶部位置，固定在输入框底部
    // const inputBottomY = rect.bottom + window.scrollY; // 使用输入框的底部位置

    iconContainer.style.top = `${inputBottomY}px`; // 设置图标的顶部位置
    // iconContainer.style.top = `${inputBottomY}px`; // 设置图标的顶部位置

    console.log("rect.top: ", rect.top);

    console.log("rect.left: ", rect.left);

    console.log("window.scrollY: ", window.scrollY);

    console.log("window.scrollX: ", window.scrollX);

    // 显示图标
    iconContainer.style.display = "block"; // 显示图标
    isInputFocused = true; // 设置标志为 true

    console.log("target.value: ", target.value); // 获取输入框的值

    // 处理失去焦点事件，隐藏图标
    target.addEventListener("blur", () => {
      iconContainer.style.display = "none"; // 隐藏图标容器
      isInputFocused = false; // 重置标志
    });
    // 全局点击事件，隐藏图标容器
    document.addEventListener("click", (event) => {
      if (!target) {
        iconContainer.style.display = "none"; // 隐藏图标容器
      }
    });

    // 点击图标时发送消息到背景脚本
    iconContainer.addEventListener("click", () => {
      console.log("点击了icon1111111");
      chrome.runtime.sendMessage(
        {
          action: "triggerApiRequest",
          inputValue: target.value, // 发送输入框的值
        },
        (response) => {
          if (response.success) {
            console.log("从背景脚本接收到的数据:", response.data);
            target.value = response.data; // 将返回的数据设置到输入框中
          } else {
            console.error("请求失败:", response.error);
          }
        }
      );
    });
  }
});

// const inputs = document.querySelectorAll(
//   "input:not([type='hidden']):not([disabled]):not([style*='display']), " + // 选择所有未隐藏和未禁用的输入框
//     "textarea:not([hidden]):not([disabled]):not([style*='display']), " + // 选择所有未隐藏和未禁用的文本区域
//     "textbox:not([hidden]):not([disabled]):not([style*='display'])"
// );
// const inputs = document.querySelectorAll(
//     "input:not([type='hidden']):not([disabled]):not([style*='display']), " + // 选择所有未隐藏和未禁用的输入框
//     "textarea:not([hidden]):not([disabled]):not([style*='display']), " + // 选择所有未隐藏和未禁用的文本区域
//     "[contenteditable='true']:not([hidden]):not([disabled]):not([style*='display']), " + // 选择所有可编辑的元素
//     "[role='textbox']:not([hidden]):not([disabled]):not([style*='display']), " + // 选择所有具有 role="textbox" 的元素
//     "[role='combobox']:not([hidden]):not([disabled]):not([style*='display'])" // 选择所有具有 role="combobox" 的元素
//   );

//   const editableElements = document.querySelectorAll(
//     "input:not([type='hidden']):not([disabled]):not([style*='display']), " + // 所有未隐藏和未禁用的输入框
//     "textarea:not([hidden]):not([disabled]):not([style*='display']), " + // 所有未隐藏和未禁用的文本区域
//     "[contenteditable='true']:not([hidden]):not([disabled]):not([style*='display']), " + // 所有可编辑的元素
//     "[role='textbox']:not([hidden]):not([disabled]):not([style*='display']), " + // 所有具有 role='textbox' 的元素
//     "[role='combobox']:not([hidden]):not([disabled]):not([style*='display']), " + // 所有具有 role='combobox' 的元素
//     "[role='gridcell']:not([hidden]):not([disabled]):not([style*='display']), " + // 所有具有 role='gridcell' 的元素
//     "[role='listbox']:not([hidden]):not([disabled]):not([style*='display']), " + // 所有具有 role='listbox' 的元素
//     "[role='searchbox']:not([hidden]):not([disabled]):not([style*='display'])" // 所有具有 role='searchbox' 的元素
//   );

// 为每个可见的输入框添加图标
// inputs.forEach((input) => {
//   console.log("input is: ", input);
//   let isInputFocused = false; // 标志变量

// 处理失去焦点事件，隐藏图标
// input.addEventListener("blur", () => {
//   iconContainer.style.display = "none"; // 隐藏图标容器
//   isInputFocused = false; // 重置标志
// });
// 全局点击事件，隐藏图标容器
// document.addEventListener("click", (event) => {
//   const isInput =
//     event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA";
//   if (!isInput) {
//     iconContainer.style.display = "none"; // 隐藏图标容器
//   }
// });
// });

// 监听来自 popup.js 的消息
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.toggleState !== undefined) {
//     // 更新全局变量
//     isToggleOn = request.toggleState;

//     // 处理切换开关的状态
//     if (isToggleOn) {
//       console.log("切换开关已打开，执行相应逻辑");
//       executeLogic();
//       // 在这里添加打开状态时的逻辑，例如显示图标
//     } else {
//       console.log("切换开关已关闭，执行相应逻辑");
//       // 在这里添加关闭状态时的逻辑，例如隐藏图标
//     }
//   }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "clearSelection") {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges(); // 清除选中范围
      }
    }
  }
});

// 添加错误处理函数
function sendMessageToBackground(message) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          console.log('扩展通信错误：', chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    } catch (error) {
      console.log('发送消息时出错：', error);
      reject(error);
    }
  });
}

// 初始化扩展
async function initializeExtension() {
  try {
    // 测试与background script的连接
    await sendMessageToBackground({ action: "ping" });
    console.log('扩展初始化成功');
  } catch (error) {
    console.log('扩展初始化失败，请刷新页面：', error);
  }
}

// 当页面加载完成时初始化扩展
document.addEventListener('DOMContentLoaded', initializeExtension);
