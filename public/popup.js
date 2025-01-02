// 服务器url
// const serverUrl = "http://localhost:5000";
const serverUrl = "https://transwise.onrender.com";
// 定义模型名称与图标路径的映射
const modelIcons = {
  "chatgpt": "icons/Chatgpt.png", // 替换为实际路径
  "google": "icons/translate_google.png", // 替换为实际路径
  "microsoft": "icons/translate_bing.png", // 替换为实际路径
  模型4: "icons/claude-star-100x100.png",
  模型5: "icons/gpt.png",
  // 添加其他模型及其对应的图标路径
};

// 定义模型名称和结果框的映射
const modelResult = {
  "chatgpt": "result-container-gpt", // 替换为实际路径
  "google": "result-container-google", // 替换为实际路径
  "microsoft": "result-container-microsoft", // 替换为实际路径
  模型4: "result-container-4",
  模型5: "result-container-5",
  // 添加其他模型及其对应的图标路径
};

const sourceLang = document.getElementById("source-language").value;
const targetLang = document.getElementById("target-language").value;

const triggerLimitMessage = document.getElementById("trigger-limit-message");

document.addEventListener("DOMContentLoaded", function () {
  const translateButton1 = document.getElementById("translate-button");
  const buttonText = translateButton1.querySelector(".button-text");
  const loadingIcon = document.querySelector(".loading-icon");

  translateButton1.addEventListener("click", async function () {
    // const translateButton = document.getElementById("translate-button");

    const sourceLang = document.getElementById("source-dropdown-button").textContent;

    

    const targetLang = document.getElementById("target-dropdown-button").textContent.trim('');
    
    const textInput = document.getElementById("text-input");
    textInputValue = textInput.value;
    
    let data = "";

    // 这里可以添加翻译逻辑
    // 例如调用翻译 API

    translateButton1.classList.add("loading"); // 增大按钮
    loadingIcon.style.display = "flex";
    translateButton1.disabled = true;

    // 获取选中的模型
    const selectedModels = Array.from(
      document.querySelectorAll(".model-checkbox:checked")
    ).map((checkbox) => checkbox.getAttribute("data-model"));

    
    

    try {
      // 先检查配额
      const quotaResponse = await fetch(
        serverUrl + "/api/profession_ability/check-quota",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 确保发送 Cookie
        }
      );

      if (!quotaResponse.ok) {
        throw new Error("Failed to check quota");
      }

      const quotaData = await quotaResponse.json();

      
      
      
      

      // if (!quotaData.data.canTranslate || quotaData.data.remaining < quotaData.data.dailyLimit) {
      if (!quotaData.data.canTranslate) {

        

        // 检查是否已存在error popup
        let errorPopup = document.querySelector('.error-popup');

        // 如果不存在，才创建新的
        if (!errorPopup) {
          errorPopup = document.createElement('div');
          errorPopup.className = 'error-popup';
          document.body.appendChild(errorPopup);
        }

        const messageText = document.createElement('div');
        // messageText.textContent = '已经超过最大次数10次, 请次日再使用';
        messageText.textContent = 'Max 10 uses per day. Please try again tomorrow.';

        // 清空现有内容并添加新消息
        errorPopup.innerHTML = '';
        errorPopup.appendChild(messageText);

        // 显示popup
        errorPopup.style.display = 'block';
        translateButton1.disabled = true;

        throw new Error("Insufficient translation quota");
      }



      let sourceLangCode = getLanguageValueFromText(sourceLang)
      let targetLangCode = getLanguageValueFromText(targetLang)

      if (!sourceLangCode) {
        
        sourceLangCode = 'en';
      }
      if (!targetLangCode) {
        
        const browserLang = navigator.language.split('-')[0];
        targetLangCode = browserLang;
      }

      
      

      // 如果源语言和目标语言相同，直接复制输入内容
      if (sourceLangCode === targetLangCode) {
        
        // const outputContainer = document.getElementById("output-container");
        // const inputText = document.getElementById("input-text").value;
        // outputContainer.value = inputText;

        data = {
          chatgpt: textInputValue,
          google: textInputValue,
          microsoft: textInputValue
        };
        

      } else {

        // 构建请求体
        const requestBody = {
          sourceLangCode,
          targetLangCode,
          textInputValue,
          selectedModels, // 选中的模型数组
        };

        try {

          const response = await fetch(
            serverUrl + "/api/profession_ability/translate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
              credentials: "include", // 确保发送 Cookie
            }
          );

          // console.log("response is: ",response)
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          data = await response.json(); // 确保使用 await 等待解析
          
        } catch (error) {
          console.error(error);
          alert(error.message);
        } finally {
          translateButton1.classList.remove("loading");
          buttonText.style.display = "inline"; // 恢复文本显示
          loadingIcon.style.display = "none"; // 隐藏加载图标
          translateButton1.disabled = false;
          
        }

      }

    } catch (error) {
      console.error(error);
      // alert(error.message);
    } finally {
      translateButton.classList.remove("loading");
      buttonText.style.display = "inline"; // 恢复文本显示
      loadingIcon.style.display = "none"; // 隐藏加载图标
      translateButton1.disabled = false;
      // 
    }

    const copyButtonResult = document.getElementById("copy-button-r");

    // 清空所有结果容器
    document.querySelectorAll(".result-container").forEach((container) => {
      container.innerText = ""; // 清空内容
      copyButtonResult.disabled = true;
    });

    // 将译文放入对应的 result-container
    for (const [model, translation] of Object.entries(data)) {
      const resultContainer = document.getElementById(modelResult[model]);
      const toolsResultContainer = document.getElementById("tools-" + modelResult[model]
      );


      
      // console.log("renshengbenlai: ", result)
      const modelItems = document.querySelectorAll(".model-item[data-model]");
      const item = Array.from(modelItems).find((item) => item.getAttribute("data-model") === model);

      const arrowImg = item.querySelector(".arrow");

      if (resultContainer) {
        resultContainer.innerText = translation; // 设置内容
        // resultContainer.classList.remove("hidden"); // 显示结果容器
        
        // arrowImg.src = 'icons/down-arrow.png';
        arrowImg.src = "icons/down-arrow1.png"; // 展开时显示向下箭头
        resultContainer.classList.remove("hidden");
        
        toolsResultContainer.classList.remove("hidden");
        toolsResultContainer.removeAttribute("hidden");
        const copyButtonResult = toolsResultContainer.querySelector(".copy-button-r");
        copyButtonResult.disabled = resultContainer.textContent.trim("") === "";
        // 获取元素的HTML代码

        if (!copyButtonResult.disabled) {
          // 复制内容到剪贴板
          copyButtonResult.addEventListener("click", async function () {
            try {
              // 创建一个临时的文本区域
              const textArea = document.createElement("textarea");
              textArea.value = resultContainer.textContent;
              document.body.appendChild(textArea);
              textArea.select();

              // 尝试使用 execCommand 复制
              const successful = document.execCommand("copy");
              document.body.removeChild(textArea);

              const copyIcon = copyButtonResult.querySelector(".copy-icon-r");
              const copiedIcon = copyButtonResult.querySelector(".copied-icon-r");

              if (successful) {
                copyIcon.hidden = true;
                copiedIcon.hidden = false;
                copyButtonResult.classList.add("copied");

                // 恢复到原始状态
                setTimeout(() => {
                  copyButtonResult.classList.remove("copied");
                  copiedIcon.hidden = true;
                  copyIcon.hidden = false;
                }, 2000);
              }
            } catch {
              
            }
          });
        }

        // resultContainer.display.style = 'block'
        // 确保 <details> 被展开
        const detailsElement = item.closest("details");
        if (detailsElement) {
          detailsElement.open = true; // 展开 <details> 元素
        }

        
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // console.log(
  //   "chrome.localStorage.getItem('jwt') is:  ",
  //   chrome.localStorage.getItem("jwt")
  // );
  getLoginStatus();

  const loginOverlay = document.getElementById("login-overlay");
  const userInterface = document.getElementById("user-interface");
  const googleLoginButton = document.getElementById("google-login-button");
  const translateButton = document.getElementById("translate-button");
  const translationResult = document.getElementById("translation-result");

  // 获取浏览器的首选语言
  const browserLanguage = navigator.language || navigator.userLanguage;

  // 通常语言代码的形式为 "en-US"，您可能需要获取主要语言部分
  const primaryLanguage = browserLanguage.split("-")[0];
   // 输出可能是 "en", "zh", 等

  // 模拟用户登录
  googleLoginButton.addEventListener("click", function () {
    // 这里可以添加 Google 登录逻辑
    // 登录成功后
    loginOverlay.classList.remove("hidden");
    
    
    userInterface.classList.remove("hidden");
  });

  const logoutPopup = document.getElementById("logout-popup");
  const userInfo = document.getElementById("user-info");

  // 当鼠标悬停在头像上时显示面板
  userInfo.addEventListener("mouseover", function () {
    logoutPopup.style.display = "block";
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", async function () {
      const response = await fetch(serverUrl + "/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 确保发送 Cookie
      });

      if (response.ok) {
        
        logoutClearInfo();
        window.location.href = "/popup.html"; // 重定向到登录页面
      } else {
        throw new Error("Network response was not ok");
      }
    });
  });

  // 当鼠标离开头像时隐藏面板
  userInfo.addEventListener("mouseout", function () {
    logoutPopup.style.display = "none";
  });
});

document.addEventListener("DOMContentLoaded", function () {
  
  let modelItems = document.querySelectorAll(".model-item[data-model]");
  let resultContainers = {
    "chatgpt": document.getElementById("result-container-gpt"),
    "google": document.getElementById("result-container-google"),
    "microsoft": document.getElementById("result-container-microsoft"),
  };

  

  // 默认显示的模型项
  const defaultModels = Array.from(modelItems).slice(0, 3);

  // 设置默认选中的复选框
  defaultModels.forEach((item) => {
    const modelName = item.getAttribute("data-model");
    
    const checkbox = document.querySelector(
      `#model-dropdown .model-checkbox[data-model="${modelName}"]`
    );
    if (checkbox) {
      checkbox.checked = true; // 设置复选框为选中状态
      // 触发复选框的 change 事件，以更新界面
      checkbox.dispatchEvent(new Event("change"));
    }
  });

  // 点击翻译服务按钮，显示下拉列表
  document.getElementById("addModel").addEventListener("click", function () {
    
    const dropdown = document.getElementById("model-dropdown");
    // 如果下拉列表是隐藏的，则显示它，否则隐藏
    if (dropdown.classList.contains("hidden")) {
      dropdown.classList.remove("hidden"); // 显示下拉列表
      
    } else {
      dropdown.classList.add("hidden"); // 隐藏下拉列表
      
    }
    // dropdown.classList.toggle("hidden");
  });

  // 点击模型，显示翻译结果框
  document.querySelectorAll(".model-item").forEach((item) => {
    
    item.addEventListener("click", function () {
      

      const arrowImg = item.querySelector(".arrow");

      const modelName = this.getAttribute("data-model");
      //   const resultContainer = document.getElementById(
      //     `result-container-${modelName}`
      //   );

      
      const resultContainer = document.getElementById(modelResult[modelName]);

      const toolsResultContainer = document.getElementById(
        "tools-" + modelResult[modelName]
      );

      const copyButtonResult =
        toolsResultContainer.querySelector(".copy-button-r");
      

      // 切换显示状态
      if (resultContainer) {
        
        // resultContainer.classList.toggle("hidden"); // 切换 hidden 类
        if (resultContainer.classList.contains("hidden")) {
          arrowImg.src = "icons/down-arrow1.png"; // 展开时显示向下箭头
          resultContainer.classList.remove("hidden");
          toolsResultContainer.removeAttribute("hidden");
          copyButtonResult.disabled =
            resultContainer.textContent.trim("") === "";
          console.log(
            "resultContainer.textContent: ",
            resultContainer.textContent,
            "11111"
          );
          const resultTextValue = resultContainer.textContent;

          if (!copyButtonResult.disabled) {
            // 复制内容到剪贴板
            copyButtonResult.addEventListener("click", async function () {
              try {
                // 创建一个临时的文本区域
                const textArea = document.createElement("textarea");
                textArea.value = resultContainer.textContent;
                document.body.appendChild(textArea);
                textArea.select();

                // 尝试使用 execCommand 复制
                const successful = document.execCommand("copy");
                document.body.removeChild(textArea);

                const copyIcon = copyButton.querySelector(".copy-icon-r");
                const copiedIcon = copyButton.querySelector(".copied-icon-r");
                const copyMessage = document.getElementById("copyMessage");
                if (successful) {
                  // 

                  // // 显示对勾和复制消息
                  // // 隐藏复制图标，显示已复制图标
                  copyIcon.hidden = true;
                  copiedIcon.hidden = false;
                  // copyMessage.style.display = "block"; // 设置消息内容

                  // // 1秒后隐藏消息和恢复按钮
                  // setTimeout(function () {
                  //   copyIcon.hidden = false;
                  //   copiedIcon.hidden = true;
                  //   copyMessage.style.display = "none";
                  // }, 3000);
                  copyButtonResult.classList.add("copied");

                  // 恢复到原始状态
                  setTimeout(() => {
                    copyButtonResult.classList.remove("copied");
                    copiedIcon.hidden = true;
                    copyIcon.hidden = false;
                  }, 2000); // 2秒后恢复到"复制"
                } else {
                  
                }
              } catch (err) {
                console.error("无法复制", err);
              }
            });
          }
          
        } else {
          arrowImg.src = "icons/right-arrow1.png"; // 展开时显示向下箭头
          resultContainer.classList.add("hidden");
          toolsResultContainer.add(".hidden");
        }
      }
    });
  });

  // 选择dropdown-item 就是选中复选框
  document
    .querySelectorAll("#model-dropdown .model-dropdown-item")
    .forEach((item) => {
      const checkbox = item.querySelector(".model-checkbox");
      item.addEventListener("click", function (e) {
        // 判断是否点击的是复选框本身，避免重复切换状态
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change")); // 手动触发 change 事件
        }
      });
    });

  // 点击下拉列表中的复选框
  document
    .querySelectorAll("#model-dropdown .model-checkbox")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", async function () {
         // 输出复选框状态

        const modelName = this.getAttribute("data-model");
        const modelGroup = document.createElement("details");
        modelGroup.className = "model-group"; // 创建新的 model-group

        if (this.checked) {
          // 添加模型项到模型选择中
          const modelItem = document.querySelector(
            `.model-item[data-model="${modelName}"]`
          );

          if (!modelItem) {
            
            // 添加容器的模型图标

            const newModelItem = document.createElement("summary");
            newModelItem.className = "model-item";
            newModelItem.setAttribute("data-model", modelName);
            newModelItem.innerText = modelName;

            // 添加到 model-group 中
            modelGroup.appendChild(newModelItem);

            // 新建对应的resultContainer
            const newResultContainer = document.createElement("div");
            newResultContainer.id = modelResult[modelName]; // 设置 ID
            newResultContainer.className = "result-container hidden"; // 设置类名
            // newResultContainer.innerText = `翻译结果来自: ${modelName}`; // 设置内容
            newResultContainer.innerText = ''; // 设置内容


            

            // 添加对应的结果框
            modelGroup.appendChild(newResultContainer); // 添加到 model-group

            // 新建对应的resultContainer的tools
            const newResultContainerTools = document.createElement("div");
            newResultContainerTools.id = "tools-" + modelResult[modelName]; // 设置 ID
            newResultContainerTools.className = "tools-result-container hidden"; // 设置类名

            // 新增copy button
            const newButton = document.createElement("button");
            newButton.id = "copy-button-r"; // 设置按钮类型为 button
            newButton.className = "copy-button-r"; // 设置按钮的类名

            const newCopyIcon = document.createElement("img");
            newCopyIcon.src = "icons/copy2.png";
            newCopyIcon.className = "copy-icon-r";

            newButton.appendChild(newCopyIcon);
            newResultContainerTools.appendChild(newButton);
            modelGroup.appendChild(newResultContainerTools);

            // 将新创建的结果框添加到 resultContainers 对象中
            resultContainers[modelName] = newResultContainer;

            

            // 添加到模型选择中
            document.querySelector(".model-selection").appendChild(modelGroup);

            if (textInput.value.trim("") != "") {
              console.log(
                "textinput's value is: ",
                textInput.value.trim(""),
                " 000"
              );
            }

            // 更新 modelItems 集合
            modelItems = document.querySelectorAll(".model-item[data-model]"); // 重新选择所有模型项

            

            // 添加模型图标

            addSelectedModelIcon(modelName); // 添加图标

            addSelectedModelIconR(modelName);

            addExpandIcon(modelName);

            textInputValue = textInput.value;

            if (textInput.value.trim("") != "") {
              // const selectedModels = [];
              // selectedModels.push(modelName);

              // const sourceLang = document.getElementById("source-dropdown-button").textContent.trim('');
              // const targetLang = document.getElementById("target-dropdown-button").textContent.trim('');

              // let sourceLangCode = getLanguageValueFromText(sourceLang)
              // let targetLangCode = getLanguageValueFromText(targetLang)

              // 
              // 

              // if (!sourceLangCode) {
              //   
              //   sourceLangCode = 'en';
              // }
              // if (!targetLangCode) {
              //   
              //   const browserLang = navigator.language.split('-')[0];
              //   targetLangCode = browserLang;
              // }

              // 
              // 

              // const requestBody = {
              //   sourceLangCode,
              //   targetLangCode,
              //   textInputValue,
              //   selectedModels, // 选中的模型数组
              // };

              // const response = await fetch(
              //   serverUrl + "/api/profession_ability/translate",
              //   {
              //     method: "POST",
              //     headers: {
              //       "Content-Type": "application/json",
              //     },
              //     body: JSON.stringify(requestBody),
              //     // credentials: "include", // 确保发送 Cookie
              //   }
              // );

              // 

              // if (!response.ok) {
              //   throw new Error("Network response was not ok");
              // }

              // const data = await response.json(); // 确保使用 await 等待解析
              // 

              // const translation = data[modelName];
              const translation = '';

              newResultContainer.innerText = translation;

              const arrowImg = newModelItem.querySelector(".arrow");

              arrowImg.src = "icons/down-arrow1.png"; // 展开时显示向下箭头

              newResultContainer.classList.remove("hidden");

              

              newResultContainerTools.classList.remove("hidden");
              newResultContainerTools.removeAttribute("hidden");

              const copyButtonResult =
                newResultContainerTools.querySelector(".copy-button-r");
              copyButtonResult.disabled =
                newResultContainerTools.textContent.trim("") === "";

              const resultTextValue = newResultContainerTools.textContent;

              if (!copyButtonResult.disabled) {
                // 复制内容到剪贴板
                copyButtonResult.addEventListener("click", async function () {
                  try {
                    // 创建一个临时的文本区域
                    const textArea = document.createElement("textarea");
                    textArea.value = newResultContainer.textContent;
                    document.body.appendChild(textArea);
                    textArea.select();

                    // 尝试使用 execCommand 复制
                    const successful = document.execCommand("copy");
                    document.body.removeChild(textArea);

                    const copyIcon = copyButton.querySelector(".copy-icon-r");
                    const copiedIcon = copyButton.querySelector(".copied-icon-r");
                    const copyMessage = document.getElementById("copyMessage");
                    if (successful) {
                      // 

                      // // 显示对勾和复制消息
                      // // 隐藏复制图标，显示已复制图标
                      copyIcon.hidden = true;
                      copiedIcon.hidden = false;
                      // copyMessage.style.display = "block"; // 设置消息内容

                      // // 1秒后隐藏消息和恢复按钮
                      // setTimeout(function () {
                      //   copyIcon.hidden = false;
                      //   copiedIcon.hidden = true;
                      //   copyMessage.style.display = "none";
                      // }, 3000);
                      copyButtonResult.classList.add("copied");

                      // 恢复到原始状态
                      setTimeout(() => {
                        copyButtonResult.classList.remove("copied");
                        copiedIcon.hidden = true;
                        copyIcon.hidden = false;
                      }, 2000); // 2秒后恢复到"复制"
                    } else {
                      
                    }
                  } catch (err) {
                    console.error("无法复制", err);
                  }
                });
              }

              const detailsElement = newModelItem.closest("details");
              if (detailsElement) {
                detailsElement.open = true; // 展开 <details> 元素
              }
            }

            // 为新模型项添加点击事件
            newModelItem.addEventListener("click", function () {
              const resultContainer = resultContainers[modelName];
              const arrowImg = newModelItem.querySelector(".arrow");
              resultContainer.classList.toggle("hidden"); // 切换显示状态
              newResultContainerTools.classList.toggle("hidden"); // 切换显示状态
              if (arrowImg) {
                if (arrowImg.src.includes("down-arrow1.png")) {
                  arrowImg.src = "icons/right-arrow1.png"; // 折叠时显示向右箭头
                } else {
                  arrowImg.src = "icons/down-arrow1.png"; // 展开时显示向下箭头
                }
              }
            });
          }
        } else {
          // 检查是否至少选中一个模型
          if (!checkAtLeastOneSelected()) {
            this.checked = true; // 如果没有选中，恢复选中状态
            alert("至少需要选中一个模型！");
          } else {
            // 移除模型项
            const modelItem = document.querySelector(
              `.model-item[data-model="${modelName}"]`
            );
            
            if (modelItem) {
              const modelGroup = modelItem.parentElement; // 获取 model-group

              

              modelGroup.remove();
              //   resultContainers[modelName].classList.add("hidden"); // 隐藏对应的结果框
              // 隐藏对应的结果框
              const resultContainer = document.getElementById(
                `result-container-${modelName}`
              );

              if (resultContainer) {
                resultContainer.classList.add("hidden");
                
                arrowImg.src = "icons/right-arrow1.png";
              }
              //   removeSelectedModelIcon(selectedModel); // 移除图标
              removeSelectedModelIcon(modelName);
            }
          }
        }

        textInputValue = textInput.value;


        if (textInput.value.trim("") != "") {
          const selectedModels = Array.from(
            document.querySelectorAll(".model-checkbox:checked")
          ).map((checkbox) => checkbox.getAttribute("data-model"));
          

          const sourceLang = document.getElementById("source-dropdown-button").textContent.trim('');
          const targetLang = document.getElementById("target-dropdown-button").textContent.trim('');

          let sourceLangCode = getLanguageValueFromText(sourceLang)
          let targetLangCode = getLanguageValueFromText(targetLang)

          
          

          if (!sourceLangCode) {
            
            sourceLangCode = 'en';
          }
          if (!targetLangCode) {
            
            const browserLang = navigator.language.split('-')[0];
            targetLangCode = browserLang;
          }

          
          

          const requestBody = {
            sourceLangCode,
            targetLangCode,
            textInputValue,
            selectedModels, // 选中的模型数组
          };

          const response = await fetch(
            serverUrl + "/api/profession_ability/translate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
              // credentials: "include", // 确保发送 Cookie
            }
          );

          

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json(); // 确保使用 await 等待解析
          

          for (const [model, translation] of Object.entries(data)) {
            const resultContainer = document.getElementById(modelResult[model]);
            resultContainer.innerText = data[modelName];

          }

          const translation = data[modelName];

          // newResultContainer.innerText = translation;

          // const arrowImg = newModelItem.querySelector(".arrow");

          // arrowImg.src = "icons/down-arrow1.png"; // 展开时显示向下箭头

          // newResultContainer.classList.remove("hidden");

          // 

          // newResultContainerTools.classList.remove("hidden");
          // newResultContainerTools.removeAttribute("hidden");

          // const copyButtonResult =
          // newResultContainerTools.querySelector(".copy-button-r");
          // copyButtonResult.disabled =
          // newResultContainerTools.textContent.trim("") === "";

          // const resultTextValue = newResultContainerTools.textContent;

          if (!copyButtonResult.disabled) {
            // 复制内容到剪贴板
            copyButtonResult.addEventListener("click", async function () {
              try {
                // 创建一个临时的文本区域
                const textArea = document.createElement("textarea");
                textArea.value = newResultContainer.textContent;
                document.body.appendChild(textArea);
                textArea.select();

                // 尝试使用 execCommand 复制
                const successful = document.execCommand("copy");
                document.body.removeChild(textArea);

                const copyIcon = copyButton.querySelector(".copy-icon-r");
                const copiedIcon = copyButton.querySelector(".copied-icon-r");
                const copyMessage = document.getElementById("copyMessage");
                if (successful) {
                  // 

                  // // 显示对勾和复制消息
                  // // 隐藏复制图标，显示已复制图标
                  copyIcon.hidden = true;
                  copiedIcon.hidden = false;
                  // copyMessage.style.display = "block"; // 设置消息内容

                  // // 1秒后隐藏消息和恢复按钮
                  // setTimeout(function () {
                  //   copyIcon.hidden = false;
                  //   copiedIcon.hidden = true;
                  //   copyMessage.style.display = "none";
                  // }, 3000);
                  copyButtonResult.classList.add("copied");

                  // 恢复到原始状态
                  setTimeout(() => {
                    copyButtonResult.classList.remove("copied");
                    copiedIcon.hidden = true;
                    copyIcon.hidden = false;
                  }, 2000); // 2秒后恢复到"复制"
                } else {
                  
                }
              } catch (err) {
                console.error("无法复制", err);
              }
            });
          }

          // const detailsElement = newModelItem.closest("details");
          // if (detailsElement) {
          //   detailsElement.open = true; // 展开 <details> 元素
          // }
        }





      });
    });

  // 初始化默认模型项
  defaultModels.forEach((model) => {
    const modelName = model.getAttribute("data-model");
    const checkbox = document.querySelector(
      `#model-dropdown .model-checkbox[data-model="${modelName}"]`
    );
    if (checkbox) {
      checkbox.checked = true; // 设置复选框为选中状态
      addSelectedModelIcon(modelName); // 添加图标
    }
  });

  // 检查是否至少选中一个模型
  function checkAtLeastOneSelected() {
    const checkboxes = document.querySelectorAll(
      "#model-dropdown .model-checkbox"
    );
    return Array.from(checkboxes).some((checkbox) => checkbox.checked);
  }

  function addSelectedModelIconR(modelName) {
    const modelIconR = document.createElement("div");

    // 结果容器标题-创建图标的 img 元素
    const iconR = document.createElement("img");
    iconR.src = modelIcons[modelName]; // 根据 modelName 获取对应的图标路径
    iconR.alt = "Icon";
    iconR.className = "model-icon-r"; // 添加样式类（可选

    modelIconR.appendChild(iconR);

    const modelItem = Array.from(modelItems).find(
      (item) => item.getAttribute("data-model") === modelName
    );
    modelItem.appendChild(iconR);
  }

  function addExpandIcon(modelName) {
    const modelIcon = document.createElement("div");

    // 结果容器标题-创建图标的 img 元素
    const icon = document.createElement("img");
    icon.src = "icons/right-arrow1.png"; // 根据 modelName 获取对应的图标路径
    icon.alt = "Expand/Collapse";
    icon.className = "arrow"; // 添加样式类（可选

    modelIcon.appendChild(icon);

    const modelItem = Array.from(modelItems).find(
      (item) => item.getAttribute("data-model") === modelName
    );
    modelItem.appendChild(icon);
  }

  // 添加已选择模型的图标
  function addSelectedModelIcon(modelName) {
    const selectedModelsContainer = document.getElementById("selected-models");
    const modelIcon = document.createElement("div");
    modelIcon.className = "selected-model";
    // modelIcon.innerText = modelName;x`

    // 创建图标的 img 元素
    const icon = document.createElement("img");
    icon.src = modelIcons[modelName]; // 根据 modelName 获取对应的图标路径
    icon.alt = modelName; // ���置 alt 属性
    icon.className = "model-icon"; // 添加样式类（可选）
    icon.style.maxWidth = "15px"; // 设置最大宽度
    icon.style.maxHeight = "15px"; // 设置最大高度
    icon.style.width = "auto"; // 自动宽度
    icon.style.height = "auto"; // 自动高度

    modelIcon.appendChild(icon); // 将图标添加到模型图标容器中

    // 添加关闭按钮
    const closeButton = document.createElement("span");
    closeButton.className = "close-button";

    const iconClosed = document.createElement("img");
    iconClosed.src = "icons/close2.png"; // 根据 modelName 获取对应的图标路径
    iconClosed.alt = modelName; // 设置 alt 属性
    iconClosed.className = "model-closed"; // 添加样式类（可选）
    iconClosed.style.width = "15px"; // 设置图标宽度
    iconClosed.style.height = "15px"; // 设置图标高度

    // 将关闭图标添加到关闭按钮中
    closeButton.appendChild(iconClosed);
    // modelIcon.appendChild(closeButton); // 将关闭按钮添加到模型图标容器中
    modelIcon.appendChild(iconClosed);

    // closeButton.innerText = "x"; // 关闭按钮的图标
    iconClosed.addEventListener("click", function () {
      
      // 确保至少保留一个模型
      // 检查当前已选择的模型数量
      const remainingModels = selectedModelsContainer.children.length;

      // 确保至少保留一个模型
      if (remainingModels <= 1) {
        alert("至少需要保留一个模型！");
        return; // 阻止删除操作
      } else {
        // 确保至少保留一个模型

        // 点击关闭按钮时，移除模型图标和相关项
        const checkbox = document.querySelector(
          `#model-dropdown .model-checkbox[data-model="${modelName}"]`
        );
        if (checkbox) {
          checkbox.checked = false; // 取消复选框选中状态
        }
        
        
        const modelItem = Array.from(modelItems).find(
          (item) => item.getAttribute("data-model") === modelName
        );
        
        if (modelItem) {
          
          
          const modelGroup = modelItem.parentElement;
          modelGroup.remove();
          // modelItem.remove(); // 从模型选择中移除
        }
        removeSelectedModelIcon(modelName);
        // resultContainers[modelName].classList.add("hidden"); // 隐藏对应的结果框
        // const modelGroup = modelItem.parentElement; // 获取 model-group

        // console.log("modelGroup isxxxxxx:  ",modelGroup)

        // modelGroup.remove();
      }
    });

    modelIcon.appendChild(iconClosed);
    selectedModelsContainer.appendChild(modelIcon);
  }

  // 移除已选择模型的图标
  function removeSelectedModelIcon(modelName) {
    
    const selectedModelsContainer = document.getElementById("selected-models");
    const modelIcon = Array.from(selectedModelsContainer.children).find(
      (icon) => {
        const img = icon.querySelector("img"); // 获取图标的 img 元素
        return img && img.alt === modelName; // 比较 alt 属性
      }
    );
    if (modelIcon) {
      selectedModelsContainer.removeChild(modelIcon);
    }
  }
});

const textInput = document.getElementById("text-input");
const translateButton = document.getElementById("translate-button");
const charLimitMessage = document.getElementById("char-limit-message");

// 初始状态：禁用翻译按钮
translateButton.disabled = true;

// 监听 textarea 的输入事件
textInput.addEventListener("input", function (e) {
  const textLength = textInput.value.length;

  

  if (textLength > 2000) {
    // 隐藏翻译按钮，显示超限提示
    translateButton.style.display = "none";
    charLimitMessage.style.display = "inline";
  } else {
    // 恢复翻译按钮，隐藏超限提示
    translateButton.style.display = "inline";
    charLimitMessage.style.display = "none";
  }

  // 检查 textarea 是否有内容
  if (textInput.value.trim() !== "") {
    translateButton.disabled = false; // 启用翻译按钮
    copyButton.disabled = textInput.value === "";
    clearButton.style.display = "block";
    // updateCopyButtonState();
  } else {
    translateButton.disabled = true; // 禁用翻译按钮
    copyButton.disabled = textInput.value === "";
    clearButton.style.display = "none";
    // updateCopyButtonState();
  }
  // 监听语言变化
  
  detectAndUpdateLanguage(textInput.value)

  // 
});

const pasteButton = document.getElementById("paste-button");
const copyButton = document.getElementById("copy-button");
// const soundButton = document.getElementById("sound-button");
const clearButton = document.getElementById("clear-button");
// const copiedButton = document.getElementById("clear-button");
// const textInput = document.getElementById("text-input");

let selectedText = ""; // 用于存储选中的文本

// 监听来自背景脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "textSelected") {
    // 如果接收到选中的文本，显示复制按钮
    // 如果有选择的文本，显示粘贴按钮
    pasteButton.style.display = "block";
    copyButton.style.display = "none";
    // soundButton.style.display = "none";
    clearButton.style.display = "none";
     // 输出状态
    
    selectedText = request.text; // 存储选中的文本
    

    // 监听粘贴按钮的点击事件
    pasteButton.addEventListener("click", function () {
      textInput.value = ""; // Clear existing content
      textInput.value += selectedText; // Append selected text to textarea
      // Manually trigger the input event to enable the translate button
      textInput.dispatchEvent(new Event("input"));
      pasteButton.style.display = "none";
      copyButton.style.display = "block";
      // soundButton.style.display = "block";
      clearButton.style.display = "block";
    });
  } else if (request.action === "textNotSelected") {
    
    pasteButton.style.display = "none";
    copyButton.style.display = "block";

    // soundButton.style.display = "block";
    clearButton.style.display = "block";
    
  }
});

// 复制内容到剪贴板
copyButton.addEventListener("click", async function () {
  try {
    // 创建一个临时的文本区域
    const textArea = document.createElement("textarea");
    textArea.value = textInput.value;
    document.body.appendChild(textArea);
    textArea.select();

    // 尝试使用 execCommand 复制
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    const copyIcon = copyButton.querySelector(".copy-icon");
    const copiedIcon = copyButton.querySelector(".copied-icon");
    const copyMessage = document.getElementById("copyMessage");
    if (successful) {
      // 

      // // 显示对勾和复制消息
      // // 隐藏复制图标，显示已复制图标
      copyIcon.hidden = true;
      copiedIcon.hidden = false;
      // copyMessage.style.display = "block"; // 设置消息内容

      // // 1秒后隐藏消息和恢复按钮
      // setTimeout(function () {
      //   copyIcon.hidden = false;
      //   copiedIcon.hidden = true;
      //   copyMessage.style.display = "none";
      // }, 3000);
      copyButton.classList.add("copied");

      // 恢复到原始状态
      setTimeout(() => {
        copyButton.classList.remove("copied");
        copiedIcon.hidden = true;
        copyIcon.hidden = false;
      }, 2000); // 2秒后恢复到"复制"
    } else {
      
    }
  } catch (err) {
    console.error("无法复制", err);
  }
});

clearButton.addEventListener("click", function () {
  // 当按钮被点击时，将其隐藏
  clearButton.style.display = "none";
});

function updateCopyButtonState() {
  copyButton.disabled = textInput.value === "";
}

document.addEventListener("DOMContentLoaded", function () {
  updateCopyButtonState();
});

// 清除文本输入框的内容
clearButton.addEventListener("click", function () {
  textInput.value = ""; // 清空输入框
   // 可选：在控制台输出清除信息
});

const toggleSwitch = document.getElementById("toggle-translate");
// 从 localStorage 获取切换开关的状态
// const isChecked = localStorage.getItem("toggleSwitchState") === "true";
// toggleSwitch.checked = isChecked; // 设置切换开关的初始状态
// 从 chrome.storage 获取初始状态
chrome.storage.local.get("toggleSwitchState", (result) => {
  toggleSwitch.checked = result.toggleSwitchState === true;
});

// 监听切换开关的变化
toggleSwitch.addEventListener("change", () => {
  // 保存切换开关的状态到 localStorage
  //   localStorage.setItem("toggleSwitchState", toggleSwitch.checked);
  // 保存切换开关的状态到 chrome.storage
  chrome.storage.local.set({ toggleSwitchState: toggleSwitch.checked }, () => {
    
  });

  // 发送消息到 content.js
  chrome.runtime.sendMessage({ toggleState: toggleSwitch.checked });

  // 如果切换开关打开，处理输入框的点击事件
  if (toggleSwitch.checked) {
    
  } else {
    // 如果切换开关关闭，隐藏图标
    
    //   iconContainer.style.display = "none"; // 隐藏图标容器
  }
});

function updateButtonVisibility(selectedText) {
  
  // const selectedText = window.getSelection().toString();
  const pasteButton = document.getElementById("paste-button");
  const copyButton = document.getElementById("copy-button");
  // const soundButton = document.getElementById("sound-button");
  const clearButton = document.getElementById("clear-button");

  if (selectedText) {
    // 如果有选择的文本，显示粘贴按钮
    pasteButton.style.display = "block";
    copyButton.style.display = "none";
    // soundButton.style.display = "none";
    clearButton.style.display = "none";
     // 输出状态
  } else {
    // 如果没有选择的文本，显示其他按钮
    pasteButton.style.display = "none";
    copyButton.style.display = "block";
    // soundButton.style.display = "block";
    clearButton.style.display = "block";
     // 输出状态
  }
}

// 点击登录按钮
document
  .getElementById("google-login-button")
  .addEventListener("click", async function () {
    
    document.getElementById("login-overlay").classList.remove("hidden");

    chrome.runtime.sendMessage(
      { action: "showLoginModal", modalTitle: "Login Modal" },
      (response) => {
        if (response && response.success) {
          document.getElementById("login-overlay").classList.remove("hidden");

          // this.isLoading = false;
        } else {
          // this.isLoading = false;
          alert("Login failed. Please try again.");
          
          document.getElementById("login-overlay").classList.remove("hidden");
        }
      }
    );
  });

async function handleGoogleLogin(event) {
  event.preventDefault();
  try {
    // 等待几秒钟（例如 5 秒）
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    // 直接重定向到 Google 登录页面
    // window.location.href = "http://localhost:3000/auth/google";
    window.location.href = serverUrl + "/auth/google";
    
  } catch (error) {
    console.error("error occured while Google login:", error);
  } finally {
    // 隐藏 spinner
    // toggleSpinner(spinner, googleRegisterButton, false);
  }
}

function handleAuthCallback() {
  // 
  const params = new URLSearchParams(window.location.search);
  // 
  // 
  const userDataString = params.get("user");
  const authCode = params.get("code");

  // 检查是否有用户信息或授权码
  if (userDataString) {
    const userData = JSON.parse(userDataString);

    chrome.runtime.sendMessage({
      action: "loginStatus",
      success: true,
      userData: userData,
    });
    window.close();

    // alert("Google login successful!");
  } else if (authCode) {
    // 处理授权码，例如通过 API 请求用户信息
    // 
    // 可以进一步调用后端来交换访问令牌和获取用户信息
  }
  // else {
  //   // 
  // }
}

// 在页面加载时处理回调
// 检查是否是 OAuth 回调并处理
if (
  window.location.search.includes("code=") ||
  window.location.search.includes("user=")
) {
  // 
  handleAuthCallback();
}

let isLoggedIn = false;

let userName = "";
let userAvatarUrl = "";
let userEmail = "";

let userInfo = "";

// content.js
document.addEventListener("DOMContentLoaded", function () {
  

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "notLogin") {
      document.getElementById("login-overlay").classList.remove("hidden");
      
    }
  });
});

function logoutClearInfo() {
  chrome.storage.local.remove("isLoggedIn");
  chrome.storage.local.remove("user");
}

function storeUserInfo(userInfo) {
  chrome.storage.local.set({ user: userInfo }, function () {
    
  });
  chrome.storage.local.get("user", function (result) {
    
  });
}

function storeLoginStatus(isLoggedIn) {
  chrome.storage.local.set({ isLoggedIn: isLoggedIn }, function () {
    
  });
}

function updatLoginInfo(userId, userEmail, userAvatarUrl) { }

async function getLoginStatus() {
  const loadingOverlay = document.getElementById('loading-overlay');
  loadingOverlay.style.display = 'flex';

  try {
    const response = await fetch(serverUrl + '/api/user-info', {
      credentials: 'include'
    });
    const data = await response.json();

    if (data.loggedIn) {
      document.getElementById('user-avatar').src = data.user.avatarUrl;
      document.getElementById('login-overlay').classList.add('hidden');
    } else {
      document.getElementById('login-overlay').classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('login-overlay').classList.remove('hidden');
  } finally {
    loadingOverlay.style.display = 'none';
  }


  // fetch(serverUrl + "/api/user-info", {
  //   method: "GET",
  //   credentials: "include", // 允许发送 cookie
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     if (data.loggedIn) {
  //       // 用户已登录，更新 UI
  //       // updateUI(data.user);
  //       
  //       
  //       
  //       document.getElementById("user-avatar").src = data.user.avatarUrl;

  //       document.getElementById("login-overlay").classList.add("hidden");
  //       // getUserInfo();
  //     } else {
  //       // 用户未登录，显示登录按钮等
  //       // showLoginUI();
  //       
  //       document.getElementById("login-overlay").classList.remove("hidden");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });
}

function getUserInfo() {
  chrome.storage.local.get("user", function (result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      if (result.user) {
        
        // 更新UI
        document.getElementById("user-avatar").src = result.user.profileImage;
        // document.getElementById("username").textContent = result.user.name;
      } else {
        document.getElementById("login-overlay").classList.remove("hidden");
        
      }
    }
  });
}

//监听登录成功，则更新UI
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "updateUI") {
    
    // 仅在用户数据存在时更新登录状态
    if (request.userData) {
      isLoggedIn = true;
      // 
      userName = request.userData.username || request.userData.name || "";
      userAvatarUrl = request.userData.picture || "";
      // 设置头像的src属性
      document.getElementById("user-avatar").src = userAvatarUrl;
      document.getElementById("login-overlay").classList.add("hidden");

      userInfo = {
        name: userName,
        email: userEmail,
        profileImage: userAvatarUrl,
      };

      storeUserInfo(userInfo);
      storeLoginStatus(isLoggedIn);
      // this.setUserSession(request.userData);
    } else {
      document.getElementById("login-overlay").classList.remove("hidden");
      
    }
    //     this.loadUserSession(); // 加载用户会话
    // this.loadPromptsData(); // 组件创建时加载数据
    // console.log("ddfdfdfdfdfdfdfdwerwerwerwerwer")
  }

  if (request.action === "notLogin") {
    
    document.getElementById("login-overlay").classList.remove("hidden");
  }
});

function isChinese(text) {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text);
}

function detectLanguageWithFranc(text) {
  const detectedLanguage = franc.franc(text);
  if (detectedLanguage === "und") {
    // 如果 franc 不能识别，尝试用正则表达式判断是否为中文
    if (isChinese(text)) {
      return "cmn";
    }
  }
  return detectedLanguage;
}

const iso639_3_to_1 = {
  afr: "af", // Afrikaans
  ara: "ar", // Arabic
  bul: "bg", // Bulgarian
  ben: "bn", // Bengali
  cat: "ca", // Catalan
  ces: "cs", // Czech
  dan: "da", // Danish
  deu: "de", // German
  ell: "el", // Greek
  eng: "en", // English
  spa: "es", // Spanish
  est: "et", // Estonian
  fas: "fa", // Persian
  fin: "fi", // Finnish
  fra: "fr", // French
  heb: "he", // Hebrew
  hin: "hi", // Hindi
  hrv: "hr", // Croatian
  hun: "hu", // Hungarian
  hye: "hy", // Armenian
  ind: "id", // Indonesian
  isl: "is", // Icelandic
  ita: "it", // Italian
  jpn: "ja", // Japanese
  kat: "ka", // Georgian
  kor: "ko", // Korean
  lit: "lt", // Lithuanian
  lav: "lv", // Latvian
  mkd: "mk", // Macedonian
  mon: "mn", // Mongolian
  msa: "ms", // Malay
  nld: "nl", // Dutch
  nor: "no", // Norwegian
  pol: "pl", // Polish
  por: "pt", // Portuguese
  ron: "ro", // Romanian
  rus: "ru", // Russian
  slk: "sk", // Slovak
  slv: "sl", // Slovenian
  srp: "sr", // Serbian
  swe: "sv", // Swedish
  tha: "th", // Thai
  tur: "tr", // Turkish
  ukr: "uk", // Ukrainian
  vie: "vi", // Vietnamese
  cmn: "zh", // Chinese
  wol: "wo", // Wolof
  tpi: "tpi", // Tok Pisin
};

// 全局变量，保存语言数据
let languagesData = [];

// 创建对勾图标元素，并隐藏（初始状态）
const checkmarkIcon = document.createElement("span");
checkmarkIcon.classList.add("checkmark-icon");
checkmarkIcon.textContent = " ✔";

// checkmarkIcon.style.display = "none";

// 语言检测并更新下拉列表的函数
async function detectAndUpdateLanguage(text) {
  // 获取输入的文本
  // const text = document.getElementById('input-text').value.trim();

  // 如果输入为空，直接返回
  // if (text.length === 0) {
  //   alert("请输入一些文字进行检测");
  //   return;
  // }

  // 将 ISO 639-3 代码转换为 ISO 639-1 代码
  let languageCode = "";

  // 使用 franc 检测语言
  const detectedLanguage = detectLanguageWithFranc(text);

  languageCode = iso639_3_to_1[detectedLanguage];
  
  


  let language1 = languageCode;



  console.log("languagesData is: ", languagesData)



  if (!languageCode) {
    language1 = "auto"; // 如果未识别出语言，则设置为自动检测
  }


  if (detectedLanguage == "und") {
    language1 = "auto"; // 如果未识别出语言，则设置为自动检测
    
  }

  


  // language = languagesData.find((lang) => lang.value === languageCode);

  let language = languagesData.find((lang) => lang.value === language1);


  





  if (!language) {
    language = languagesData.find((lang) => lang.value === "auto");; // 如果未识别出语言，则设置为自动检测
    console.log("language is auto")
  } else {
    
    // 找到具有 data-value="auto" 的元素
    const autoElement = document.querySelector('li[data-value="auto"]');

    // 确保找到目标元素并更改第一个 span 的文本内容
    if (autoElement) {
      const spanElement = autoElement.querySelector("span");
      if (spanElement) {
        spanElement.textContent = `${language.english} (${language.chinese}) (自动检测)`;
      }
    }
  }

  
  // 找到具有 data-value="auto" 的元素
  // const selectedElement = document.querySelector('li[data-value=`${language.value}`]');

  // 找到具有 data-value 等于 language.value 的元素
  // const languageOptions = document.querySelectorAll(".select-options li");
  const languageOptions = document.querySelectorAll(
    "#source-language-options li"
  );
  languageOptions.forEach((option) => {
    if (option.dataset.value === language.value) {
      // option.appendChild(checkmarkIcon);
      option.classList.add("selected");
      
    } else {
      // 否则移除对勾
      const checkmarkIcon = option.querySelector(".checkmark-icon");
      if (option.classList.contains("selected")) {
        // option.removeChild(checkmarkIcon);
        option.classList.remove("selected");
      }
    }
  });


  // 设置目标语言，如果源语言不为英语，则目标语言为英语,否则为浏览器默认语言

  const targetLanguageOptions = document.querySelectorAll(
    "#target-language-options li"
  );
  const targetSelectElement = document.getElementById("target-dropdown-button");

  

  const browserLang = navigator.language.split('-')[0];
  
  const targetAutoElement = document.querySelector('#target-dropdown-panel li[data-value="auto"]');


  if (language.value !== "en") {
    
    targetLanguageOptions.forEach((option) => {
      if (option.dataset.value === "en") {
        // option.appendChild(checkmarkIcon);
        option.classList.add("selected");

        targetSelectElement.querySelector(".button-label").textContent = 'English (英语)';

        // targetSelectElement.textContent = 'English (英语)';


        // const autoElement = document.querySelector('li[data-value="auto"]');


        // 确保找到目标元素并更改第一个 span 的文本内容
        if (targetAutoElement) {
          const spanElement = targetAutoElement.querySelector("span");
          if (spanElement) {
            spanElement.textContent = 'English (英语) (自动检测)';
          }
        }



      } else {
        // 否则移除对勾
        const checkmarkIcon = option.querySelector(".checkmark-icon");
        if (option.classList.contains("selected")) {
          // option.removeChild(checkmarkIcon);
          option.classList.remove("selected");
        }
      }
    });
  } else { // 如果源语言为英语，则目标语言为浏览器默认语言
    // 
    // 获取浏览器语言的前两个字符（语言代码部分）


    targetLanguageOptions.forEach((option) => {
      if (option.dataset.value === browserLang) {
        // option.appendChild(checkmarkIcon);
        
        option.classList.add("selected");

        // 找到对应的语言数据来显示正确的文本
        const targetLang = languagesData.find(lang => lang.value === browserLang);
        if (targetLang) {
          // targetSelectElement.textContent = `${targetLang.english} (${targetLang.chinese})`;

          targetSelectElement.querySelector(".button-label").textContent = `${targetLang.english} (${targetLang.chinese})`;

        }



        // 确保找到目标元素并更改第一个 span 的文本内容
        if (targetAutoElement) {
          const spanElement = targetAutoElement.querySelector("span");
          if (spanElement) {
            spanElement.textContent = `${targetLang.english} (${targetLang.chinese}) (自动检测)`;

          }
        }

      } else {
        // 否则移除对勾
        const checkmarkIcon = option.querySelector(".checkmark-icon");
        if (option.classList.contains("selected")) {
          // option.removeChild(checkmarkIcon);
          option.classList.remove("selected");
        }
      }
    });

  }

  // 创建对勾图标元素，并隐藏（初始状态）
  // const checkmarkIcon = document.createElement("span");
  // checkmarkIcon.classList.add("checkmark-icon");
  // checkmarkIcon.textContent = " ✔";
  // checkmarkIcon.style.display = "none";

  // selectedElement.appendChild(checkmarkIcon);


  // 设置 select 的值为检测到的语言
  const selectElement = document.getElementById("source-dropdown-button");
  // selectElement.textContent = `${language.english} (${language.chinese})`;
  // selectElement.appendChild(createDropdownIcon()); // 重新添加下拉箭头

  // const buttonElement = selectElement.querySelector(".select-button");
  // 
  selectElement.querySelector(".button-label").textContent = `${language.english} (${language.chinese})`;
  selectElement.appendChild(createDropdownIcon()); // 重新添加下拉箭头



  // const targetSelectElement = document.getElementById("target-dropdown-button");
  targetSelectElement.appendChild(createDropdownIcon()); // 重新添加下拉箭头

  // 输出检测结果
  
  
}

// 从按钮文本获取语言的value
function getLanguageValueFromText(buttonText) {
  // 检查buttonText是否为空
  if (!buttonText) {
    
    return null;
  }

  // 移除可能存在的 "(自动检测)" 文本
  const cleanText = buttonText.replace(/\s*\(自动检测\)\s*$/, '').trim();

  // 在languagesData中查找匹配的语言
  const language = languagesData.find(lang =>
    `${lang.english} (${lang.chinese})` === cleanText
  );

  if (!language) {
    
  }

  return language ? language.value : null;
}

// 读取语言数据并填充下拉列表
async function loadLanguages() {
  try {
    const response = await fetch("languages.json");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    languagesData = await response.json();
    document.querySelectorAll(".language-select").forEach((select) => {
      populateLanguageOptions(languagesData, select);
    });
    // populateLanguageOptions(languagesData);
    setDefaultCheckmark(); // 设置默认对勾
  } catch (error) {
    console.error("Error fetching the language list:", error);
  }
}

// 设置默认对勾在自动检测选项上
// function setDefaultCheckmark() {
//   const defaultOption = document.querySelector(
//     "#language-options li[data-value='auto']"
//   );
//   if (defaultOption) {
//     // 创建并显示对勾图标
//     // const checkmarkIcon = document.createElement("span");
//     // checkmarkIcon.classList.add("checkmark-icon");
//     // checkmarkIcon.textContent = " ✔";
//     defaultOption.appendChild(checkmarkIcon);
//   }
// }

function setDefaultCheckmark() {
  const defaultOptions = document.querySelectorAll(
    "#source-language-options li[data-value='auto'], #target-language-options li[data-value='auto']"
  );
  defaultOptions.forEach((option) => {
    // const checkmarkIcon = document.createElement("span");
    // checkmarkIcon.classList.add("checkmark-icon");
    // checkmarkIcon.textContent = " ✔";
    // option.appendChild(checkmarkIcon);
    if (option) {
      // 创建并显示对勾图标
      const checkmarkIcon = document.createElement("span");
      checkmarkIcon.classList.add("checkmark-icon");
      checkmarkIcon.textContent = " ✔";
      // option.appendChild(checkmarkIcon);
      option.classList.add("selected");
    }
  });
}

function populateLanguageOptions(languagesData, container) {
  const languageOptionsElement = container.querySelector(".select-options");
  languageOptionsElement.innerHTML = ""; // 清空以前的选项，避免重复

  // 获取缓存的选择列表，如果有的话
  const cachedLanguages =
    JSON.parse(localStorage.getItem("cachedLanguages")) || [];
  
  cachedLanguages.slice(0, 10).forEach((cachedLanguage) => {
    if (cachedLanguage !== "auto") {
      const cachedLanguageData = languagesData.find(
        (lang) => lang.value === cachedLanguage
      );
      if (cachedLanguageData) {
        addLanguageOption(cachedLanguageData, languageOptionsElement, true); // 添加缓存的语言选项到最前面
      }
    }
  });

  // 确保 "自动检测" 选项始终在最前面
  const autoDetectOption = languagesData.find((lang) => lang.value === "auto");
  if (autoDetectOption) {
    addLanguageOption(autoDetectOption, languageOptionsElement, false);
  }

  languagesData.forEach((language) => {
    // 如果语言已经在缓存中显示或是自动检测，则跳过
    if (cachedLanguages.includes(language.value) || language.value === "auto")
      return;
    addLanguageOption(language, languageOptionsElement);
  });
}

function addLanguageOption(language, container, isCached = false) {
  // const languageOptionsElement = document.getElementById("language-options");
  const option = document.createElement("li");
  option.dataset.value = language.value;

  // 创建语言文本节点
  const languageText = document.createElement("span");
  languageText.textContent = `${language.english} (${language.chinese})`;
  option.appendChild(languageText);

  // 添加点击事件监听器
  option.addEventListener("click", () => {
    selectLanguage(
      language.value,
      `${language.english} (${language.chinese})`,
      container.closest(".language-select")
    );
  });

  // 如果是自动检测，始终插入到最前面
  if (language.value === "auto") {
    // languageOptionsElement.insertAdjacentElement("afterbegin", option);
    container.prepend(option);
  }
  // else if (isCached) {
  //   // languageOptionsElement.insertAdjacentElement("afterbegin", option);
  //   languageOptionsElement.prepend(option);
  // }
  else {
    container.appendChild(option);
  }
}

// 点击按钮显示或隐藏下拉菜单
// document.getElementById("dropdown-button").addEventListener("click", (e) => {
//   e.stopPropagation(); // 阻止事件冒泡，防止全局点击事件影响下拉按钮
//   const panelElement = document.getElementById("dropdown-panel");
//   panelElement.classList.toggle("hidden");
//   document.getElementById("search-box").focus(); // 点击下拉按钮时，聚焦到搜索框
// });

// 点击下拉框，显示或者隐藏
// document.querySelectorAll(".select-button").forEach((button) => {
//   button.addEventListener("click", (e) => {
//     e.stopPropagation();
//     const panelElement = button.nextElementSibling;
//     panelElement.classList.toggle("hidden");
//     panelElement.querySelector(".search-box").focus();
//   });
// });
document.querySelectorAll(".select-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const panelElement = button.nextElementSibling;
    const isHidden = panelElement.classList.contains("hidden");

    // Hide all dropdown panels before toggling the current one
    document.querySelectorAll(".select-panel").forEach((panel) => {
      panel.classList.add("hidden");
    });

    // Toggle the current dropdown panel
    if (isHidden) {
      panelElement.classList.remove("hidden");
      panelElement.querySelector(".search-box").focus();
    }
  });
});

const modelDropdown = document.getElementById("model-dropdown");
const addModelButton = document.getElementById("addModel");

// 点击下拉列表之外的任意地方，下拉列表消失
document.addEventListener("click", (e) => {
  // 这是语言下拉列表
  document.querySelectorAll(".select-panel").forEach((panel) => {
    if (
      !panel.contains(e.target) &&
      !panel.previousElementSibling.contains(e.target)
    ) {
      if (!panel.classList.contains("hidden")) {
        panel.classList.add("hidden");
      }
    }
  });

  // 非添加model下拉列表外的其他区域，隐藏
  if (
    !modelDropdown.contains(e.target) &&
    !modelDropdown.previousElementSibling.contains(e.target)
  ) {
    if (!modelDropdown.classList.contains("hidden")) {
      modelDropdown.classList.add("hidden");
    }
  }
});

// Add event listener to handle focus loss for the entire window
window.addEventListener("blur", () => {
  document.querySelectorAll(".select-panel").forEach((panel) => {
    if (!panel.classList.contains("hidden")) {
      panel.classList.add("hidden");
    }
  });

  if (!modelDropdown.classList.contains("hidden")) {
    modelDropdown.classList.add("hidden");
  }
});
// const backgroundPage = chrome.extension.getBackgroundPage();

// document.addEventListener("click", (e) => {
//   document.querySelectorAll(".select-panel").forEach((panel) => {
//     if (
//       !panel.contains(e.target) &&
//       !panel.previousElementSibling.contains(e.target)
//     ) {
//       if (!panel.classList.contains("hidden")) {
//         panel.classList.add("hidden");
//       }
//     }
//   });

//   // 隐藏下拉列表，如果用户点击了背景页面
//   if (!document.body.contains(e.target)) {
//     document.querySelectorAll(".select-panel").forEach((panel) => {
//       if (!panel.classList.contains("hidden")) {
//         panel.classList.add("hidden");
//       }
//     });
//   }

//   if (backgroundPage && !document.contains(e.target)) {
//     document.querySelectorAll(".select-panel").forEach((panel) => {
//       if (!panel.classList.contains("hidden")) {
//         panel.classList.add("hidden");
//       }
//     });
//   }
// });

// 点击其他地方时隐藏下拉菜单
// document.addEventListener("click", (e) => {
//   const panelElement = document.getElementById("dropdown-panel");
//   const searchBox = document.getElementById("search-box");
//   if (!panelElement.contains(e.target) && !searchBox.contains(e.target)) {
//     if (!panelElement.classList.contains("hidden")) {
//       panelElement.classList.add("hidden");
//     }
//   }
// });

// 选择语言后更新按钮的文本
function selectLanguage(value, text, container) {
  // const buttonElement = document.getElementById("dropdown-button");
  // const buttonElement = container.previousElementSibling;
  // console.log("container in selectLang: ", container)
  // container.querySelector(".button-label").textContent = text;

  // buttonElement.textContent = text;
  // buttonElement.appendChild(createDropdownIcon()); // 重新添加下拉箭头
  // container.classList.add("hidden");

  // document.getElementById("dropdown-panel").classList.add("hidden");

  const buttonElement = container.querySelector(".select-button");
  
  buttonElement.querySelector(".button-label").textContent = text;
  // buttonElement.appendChild(createDropdownIcon());
  container.querySelector(".select-panel").classList.add("hidden");

  // 更新下拉列表中所有选项的对勾状态
  // const languageOptions = document.querySelectorAll("#language-options li");
  const languageOptions = container.querySelectorAll(".select-options li");
  languageOptions.forEach((option) => {
    const checkmarkIcon = option.querySelector(".checkmark-icon");
    if (option.dataset.value === value) {
      if (!option.classList.contains("selected")) {
        const newCheckmarkIcon = document.createElement("span");
        newCheckmarkIcon.classList.add("checkmark-icon");
        newCheckmarkIcon.textContent = " ✔";
        // option.appendChild(newCheckmarkIcon);
        
        option.classList.add("selected");
      }
    } else if (option.classList.contains("selected")) {
      // option.removeChild(checkmarkIcon);
      option.classList.remove("selected");
    }
  });

  // 将选择缓存到本地存储
  let cachedLanguages =
    JSON.parse(localStorage.getItem("cachedLanguages")) || [];
  cachedLanguages = cachedLanguages.filter((lang) => lang !== value); // 移除已存在的相同语言
  cachedLanguages.unshift(value); // 将最新选择的语言添加到最前面
  localStorage.setItem(
    "cachedLanguages",
    JSON.stringify(cachedLanguages.slice(0, 10))
  ); // 只保留最近的10个选择

  
}

// 创建下拉箭头元素
// function createDropdownIcon() {
//   const icon = document.createElement("span");
//   icon.classList.add("dropdown-icon");
//   icon.innerHTML = "&#x203A;";
//   return icon;
// }

function createDropdownIcon() {
  const icon = document.createElement("span");
  icon.classList.add("dropdown-icon");
  // icon.innerHTML = "&#d";
  return icon;
}




/// 搜索框输入事件监听器
document.querySelectorAll(".search-box").forEach((searchBox) => {
  // 创建一个函数来重置所有选项的显示状态
  const resetAllOptions = (selectPanel) => {
    if (!selectPanel) return;
    const optionsContainer = selectPanel.querySelector('.options-container');
    if (!optionsContainer) return;
    const allOptions = optionsContainer.querySelectorAll("li");
    allOptions.forEach(option => {
      option.style.display = '';
    });
  };

  searchBox.addEventListener("input", (e) => {
    const searchValue = e.target.value.toLowerCase();
    const selectPanel = searchBox.closest('.select-panel');
    if (!selectPanel) {
      console.warn('No select panel found');
      return;
    }

    const optionsContainer = selectPanel.querySelector('.options-container');
    if (!optionsContainer) {
      console.warn('No options container found');
      return;
    }

    const languageOptions = optionsContainer.querySelectorAll("li");
    if (languageOptions.length === 0) {
      console.warn('No language options found');
      return;
    }

    languageOptions.forEach(option => {
      const languageText = option.textContent.toLowerCase();
      if (searchValue === '') {
        option.style.display = '';
      } else {
        const shouldDisplay = languageText.includes(searchValue);
        option.style.display = shouldDisplay ? '' : 'none';

        // 如果选项是可见的，确保它有点击事件处理器
        if (shouldDisplay) {
          // 移除旧的事件监听器（如果有的话）
          option.removeEventListener('click', optionClickHandler);
          // 添加新的事件监听器
          option.addEventListener('click', optionClickHandler);
        }
      }
    });
  });

  // 定义选项的点击事件处理函数
  const optionClickHandler = () => {
    
    resetSearchBox(searchBox);
    resetAllOptions(searchBox.closest('.select-panel'));
  };

  // 保留Enter键选择功能
  searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchValue = e.target.value.toLowerCase();
      const selectPanel = searchBox.closest('.select-panel');
      if (!selectPanel) return;

      const optionsContainer = selectPanel.querySelector('.options-container');
      if (!optionsContainer) return;

      const visibleOptions = optionsContainer.querySelectorAll("li:not([style*='display: none'])");
      if (visibleOptions.length > 0) {
        visibleOptions[0].click();
        
        resetSearchBox(searchBox);
        resetAllOptions(selectPanel);
      }
    }
  });

  // 为每个选项添加点击事件监听器
  const selectPanel = searchBox.closest('.select-panel');
  if (selectPanel) {
    const optionsContainer = selectPanel.querySelector('.options-container');
    if (optionsContainer) {
      const options = optionsContainer.querySelectorAll("li");
      options.forEach(option => {
        option.addEventListener('click', () => {
          
          resetSearchBox(searchBox);  // 添加这行：在点击时重置搜索框
          resetAllOptions(selectPanel);
        });
      });
    }
  }


});



// 释放搜索框的搜索条件
const resetSearchBox = (searchBox) => {
  
  if (!searchBox) return;

  // 清空搜索框
  searchBox.value = '';

  // 获取包含选项的面板
  const selectPanel = searchBox.closest('.select-panel');
  if (!selectPanel) return;

  // 获取选项容器
  const optionsContainer = selectPanel.querySelector('.options-container');
  if (!optionsContainer) return;

  // 重置所有选项的显示状态和高亮
  const options = optionsContainer.querySelectorAll("li");
  options.forEach((option) => {
    option.style.display = '';
    option.classList.remove("highlight");
  });

  searchBox.blur(); // 添加这行：移除搜索框的焦点

};
// 页面加载完成后加载语言选项
document.addEventListener("DOMContentLoaded", loadLanguages);

document.addEventListener("click", () => {
  // 通知背景页面清除选中文本
  chrome.runtime.sendMessage({ action: "clearSelection" });
  pasteButton.style.display = "none";
  copyButton.style.display = "block";
  if (textInput.value != "") {
    clearButton.style.display = "block";
  }
  copyButton.disabled = textInput.value === "";
});

// 添加交换语言功能
document.getElementById('swap-icon').addEventListener('click', function() {
  // 获取源语言和目标语言的下拉面板
  const sourcePanel = document.getElementById('source-dropdown-panel');
  const targetPanel = document.getElementById('target-dropdown-panel');
  
  // 获取当前选中的语言元素
  const sourceSelected = sourcePanel.querySelector('.selected');
  const targetSelected = targetPanel.querySelector('.selected');
  
  if (!sourceSelected || !targetSelected) return;
  
  // 获取当前选中的语言值
  const sourceValue = sourceSelected.getAttribute('data-value');
  const targetValue = targetSelected.getAttribute('data-value');
  
  // 如果源语言是auto，不执行交换
  if (sourceValue === 'auto') return;
  
  // 获取按钮显示元素
  const sourceButton = document.getElementById('source-dropdown-button');
  const targetButton = document.getElementById('target-dropdown-button');
  
  // 交换显示文本
  const sourceLabel = sourceButton.querySelector('.button-label');
  const targetLabel = targetButton.querySelector('.button-label');
  const tempText = sourceLabel.textContent;
  sourceLabel.textContent = targetLabel.textContent;
  targetLabel.textContent = tempText;
  
  // 更新选中状态
  sourcePanel.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
  targetPanel.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
  
  sourcePanel.querySelector(`li[data-value="${targetValue}"]`).classList.add('selected');
  targetPanel.querySelector(`li[data-value="${sourceValue}"]`).classList.add('selected');
  
  // 如果有输入文本，自动重新翻译
  const textInput = document.getElementById('text-input');
  if (textInput.value.trim()) {
    document.getElementById('translate-button').click();
  }
});
