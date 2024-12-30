// require('dotenv').config(); // 加载环境变量
// console.log("APP_SERVER_URL:", process.env.APP_SERVER_URL); // 检查是否能正确访问



// const serverUrl = "http://localhost:5000";
const serverUrl = "https://transwise.onrender.com";


console.log("serverUrl is :", serverUrl);

// 切换到注册
// document.addEventListener("DOMContentLoaded", () => {
try {
  document
    .getElementById("toggle-to-register")
    .addEventListener("click", async (e) => {
      document.getElementById("toggle-to-register").id = "toggle-to-login";
      e.preventDefault();
      document.getElementById("register-text").innerHTML =
        'Already have an account?  <a href="#" id="toggle-to-login">Login</a>';
      document.getElementById("button-text").textContent =
        "Sign up with Google";

      document.getElementById("email-button-text").textContent =
        "Sign up with Email";
      // test

      // 更新谷歌登录事件处理程序
      await updateGoogleLoginHandler("login-google");

      // 处理电子邮件注册点击事件
      document
        .getElementById("login-password")
        .addEventListener("click", async (e) => {
          e.preventDefault();
          document.getElementById("login-options").classList.add("hidden");
          document
            .getElementById("email-login-form")
            .classList.remove("hidden");
          //test

          emailRegister();
          // document.getElementById("register-text-password").innerHTML =
          //   '已经有账号？<a href="#" id="toggle-to-login-email">登录</a>';
          // document.getElementById("email-submit-button").textContent = "注册";
          // document.getElementById("button-text1").textContent = "使用谷歌注册";

          // document
          //   .getElementById("login-google1")
          //   .removeEventListener("click", handleGoogleLogin);
          // document
          //   .getElementById("login-google1")
          //   .addEventListener("click", handleGoogleRegister);

          // document
          //   .getElementById("toggle-to-login-email")
          //   .addEventListener("click", (e) => {
          //     e.preventDefault();
          //     location.reload(); // 刷新页面，回到原来的状态
          //   });
        });

      document
        .getElementById("toggle-to-login")
        .addEventListener("click", async (e) => {
          e.preventDefault();
          location.reload(); // 刷新页面，回到原来的状态
        });
    });

  // 切换到使用电子邮件登录
  // document.getElementById("login-password").addEventListener("click", () => {
  //   console.log("切换到使用电子邮件登录")
  //   document.getElementById("login-options").classList.add("hidden");
  //   document.getElementById("email-login-form").classList.remove("hidden");
  // });
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("login-password").addEventListener("click", () => {
      // console.log("切换到使用电子邮件登录");
      document.getElementById("login-options").classList.add("hidden");
      document.getElementById("email-login-form").classList.remove("hidden");
    });
  });
} catch (error) {
  // console.log("An error occurred while adding event listener:", error);
}
// });

// 切换到电子邮件注册
// document.addEventListener("DOMContentLoaded", () => {
try {
  document
    .getElementById("toggle-to-register-email")
    .addEventListener("click", async (e) => {
      document.getElementById("toggle-to-register-email").id =
        "toggle-to-login-email";
      e.preventDefault();

      emailRegister();
      // document.getElementById("register-text-password").innerHTML =
      //   '已经有账号？<a href="#" id="toggle-to-login-email">登录</a>';
      // document.getElementById("email-submit-button").textContent = "注册";
      // document.getElementById("button-text1").textContent = "使用谷歌注册";

      // document
      //   .getElementById("login-google1")
      //   .removeEventListener("click", handleGoogleLogin);
      // document
      //   .getElementById("login-google1")
      //   .addEventListener("click", handleGoogleRegister);

      // document
      //   .getElementById("toggle-to-login-email")
      //   .addEventListener("click", (e) => {
      //     e.preventDefault();
      //     location.reload(); // 刷新页面，回到原来的状态
      //   });
    });

  // document
  //   .getElementById("login-google")
  //   .addEventListener("click", handleGoogleLogin);
  document
    .getElementById("login-google")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      // console.log("3333333333");
      const spinner = document.getElementById("spinner");
      // console.log("spinner is xxxxx : ", spinner);
      // const googleRegisterButton =
      //   document.getElementById("login-google") ||
      //   document.getElementById("login-google1") ||
      //   "";
      const googleRegisterButton = document.getElementById("login-google");
      // console.log("禁用按钮1spinner is : ", spinner);
      // console.log("禁用按钮1googleRegisterButton is : ", googleRegisterButton);
      // console.log("禁用按钮1", googleRegisterButton, spinner);

      // 显示 spinner
      await toggleSpinner(spinner, googleRegisterButton, true);
      googleRegisterButton.classList.add("button-loading"); // 添加加载状态类

      handleGoogleLogin(event); // 将事件对象传递给 handleGoogleLogin
    });

  document
    .getElementById("login-google1")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      // console.log("222222222222222");
      const spinner = document.getElementById("spinner-google1");
      // console.log("spinner is xxxxx : ", spinner);
      // const googleRegisterButton =
      //   document.getElementById("login-google") ||
      //   document.getElementById("login-google1") ||
      //   "";
      // const googleRegisterButton = document.getElementById("login-google1");
      const googleRegisterButton = document.getElementById("login-google1");
      // console.log("禁用按钮1spinner is : ", spinner);
      // console.log("禁用按钮1googleRegisterButton is : ", googleRegisterButton);
      // console.log("禁用按钮1", googleRegisterButton, spinner);

      // 显示 spinner
      await toggleSpinner(spinner, googleRegisterButton, true);

      // 等待几秒钟（例如 5 秒）
      // new Promise((resolve) => setTimeout(resolve, 15000)); // 等待 5 秒

      handleGoogleLogin(event); // 将事件对象传递给 handleGoogleLogin
    });

  // 邮件登录和注册表单提交事件处理
  document
    .getElementById("email-login")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const isRegister =
        document.getElementById("email-submit-button").textContent ===
        "Sign up";

      // console.log("ppppppp,isRegister:",isRegister)
      const loginButton = document.getElementById("email-submit-button");
      // const spinner = document.getElementById("spinner-login");
      const spinner = document.getElementById("spinner");
      // 显示 spinner
      await toggleSpinner(spinner, loginButton, true);

      if (isRegister) {
        // 这里添加邮件注册逻辑
        await passwordRegister();
      } else {
        // console.log("执行邮件登录逻辑");
        // 这里添加邮件登录逻辑
        await passwordLogin();
      }
    });
} catch (error) {
  console.log("An error occurred while adding event listener:", error);
}
// });

// 更新事件处理程序
async function updateGoogleLoginHandler(googleButton) {
  // const googleLoginButton = document.getElementById("login-google");
  const googleLoginButton = document.getElementById(googleButton);

  // 移除旧的事件处理程序
  googleLoginButton.removeEventListener("click", handleGoogleLogin);

  // 添加新的异步事件处理程序
  // .addEventListener("click", handleGoogleLogin);
  googleLoginButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const spinner = document.getElementById("spinner-google1");
    // const googleRegisterButton =
    //   document.getElementById("login-google") ||
    //   document.getElementById("login-google1") ||
    //   "";
    const googleRegisterButton = document.getElementById("login-google1");

    // 显示 spinner
    await toggleSpinner(spinner, googleRegisterButton, true);
    // googleRegisterButton.classList.add("button-loading"); // 添加加载状态类

    handleGoogleLogin(event); // 将事件对象传递给 handleGoogleLogin
  });
}

async function emailRegister() {
  // e.preventDefault();
  document.getElementById("register-text-password").innerHTML =
    'Already have an account?  <a href="#" id="toggle-to-login-email">Login</a>';
  document.getElementById("email-submit-button").textContent = "Sign up";
  document.getElementById("button-text1").textContent = "Sign up with Google";

  // console.log("执行邮件注册逻辑");

  // 调用函数以初始化邮箱校验
  validateEmailInput();
  // validateEmailInput();

  document
    .getElementById("login-google1")
    .removeEventListener("click", handleGoogleLogin);
  document
    .getElementById("login-google1")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      // console.log("00000000000");
      const testButton = document.getElementById("login-google1");
      const spinner = document.getElementById("spinner");
      await toggleSpinner(spinner, testButton, true);
      // testButton.classList.add("button-loading"); // 添加加载状态类
      handleGoogleLogin(event);
    });

  // updateGoogleLoginHandler("login-google1");

  document
    .getElementById("toggle-to-login-email")
    .addEventListener("click", (e) => {
      e.preventDefault();
      location.reload(); // 刷新页面，回到原来的状态
    });
}

// 邮箱校验函数
function validateEmailInput() {
  const emailInput = document.querySelector('input[name="email"]');
  const passwordInput = document.querySelector('input[name="password"]'); // 假设有一个密码输入框
  const errorMessage = document.getElementById("email-error-message");
  const registerButton = document.getElementById("email-submit-button"); // 假设注册按钮的 ID 是 register-button

  // 监听邮箱输入事件
  emailInput.addEventListener("input", () => {
    const email = emailInput.value;
    validateEmail(email);
  });

  // 监听密码输入事件
  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    validatePassword(password);
  });

  function validateEmail(email) {
    if (!isValidEmail(email)) {
      errorMessage.textContent = "Please enter a valid email address"; // 显示错误信息
      errorMessage.style.color = "red"; // 设置错误信息颜色
      registerButton.disabled = true; // 禁用注册按钮
    } else {
      errorMessage.textContent = ""; // 清空错误信息
      checkFormValidity(); // 检查表单有效性
    }
  }

  function validatePassword(password) {
    if (password.length < 8) {
      errorMessage.textContent = "Password must be at least 8 characters long"; // 显示错误信息
      errorMessage.style.color = "red"; // 设置错误信息颜色
      registerButton.disabled = true; // 禁用注册按钮
    } else {
      errorMessage.textContent = ""; // 清空错误信息
      checkFormValidity(); // 检查表单有效性
    }
  }

  function checkFormValidity() {
    // 检查是否有错误信息，如果没有则启用注册按钮
    if (errorMessage.textContent === "") {
      registerButton.disabled = false; // 启用注册按钮
    }
  }
}

// 绑定事件
// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementById("terms-link")
//     .addEventListener("click", function (event) {
//       event.preventDefault(); // 防止默认行为
//       // window.open("termsService.html", "_blank"); // 打开新标签页
//       // 访问后端 public 目录下的文件
//       fetch(serverUrl + '/termsService.html') // 替换为实际文件路径
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.text();
//         })
//         .then(data => {
//           // 在新窗口中打开文件内容
//           const newWindow = window.open();
//           newWindow.document.write(data);
//           newWindow.document.close();
//         })
//         .catch(error => {
//           console.error('There was a problem with the fetch operation:', error);
//         });
//     });

//   document
//     .getElementById("privacy-link")
//     .addEventListener("click", function (event) {
//       event.preventDefault(); // 防止默认行为
//       // window.open("privacyPolicy.html", "_blank"); // 打开新标签页
//       fetch(serverUrl + '/privacyPolicy.html') // 替换为实际文件路径
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.text();
//         })
//         .then(data => {
//           // 在新窗口中打开文件内容
//           const newWindow = window.open();
//           newWindow.document.write(data);
//           newWindow.document.close();
//         })
//         .catch(error => {
//           console.error('There was a problem with the fetch operation:', error);
//         });
//     });
// });

function checkEmailExists(email) {
  const existingEmails = ["test@example.com"]; // Example of existing emails
  return existingEmails.includes(email);
}

async function passwordLogin() {
  // 获取输入框元素
  const email = document.querySelector('input[name="email"]').value;

  const password = document.querySelector('input[name="password"]').value;
  try {
    // const response = await fetch("http://localhost:3000/user/login", {
    const response = await fetch(serverUrl + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // 确保发送 Cookie
    });
    // console.log("response is is :", response);

    if (response.ok) {
      alert("Login successful!");
      // 处理登录成功后的逻辑，例如页面跳转
      const result = await response.json();
      // console.log("result is: ", result.userData, result.success);

      chrome.runtime.sendMessage(
        { action: "loginStatus", userData: result.userData },
        (response) => {
          if (response && response.success) {
            window.close(); // 关闭当前注册页面
          } else {
            alert("Failed to communicate with background script.");
          }
        }
      );
    } else if (response.status === 401) {
      // 处理密码不匹配的情况
      const errorData = await response.json();
      alert("Passwords do not match: " + errorData.message);
      chrome.runtime.sendMessage({action: "loginFail"})
    } else if (response.status === 404) {
      // 处理用户名不存在的情况
      const errorData = await response.json();
      alert("Username does not exist: " + errorData.message);
      chrome.runtime.sendMessage({action: "loginFail"})
    } else {
      // console.log(response);

      const errorData = await response.json();

      alert(errorData.message);
      chrome.runtime.sendMessage({action: "loginFail"})
    }
  } catch (error) {
    // console.error("登录失败:", error);
    alert("An error occurred during login", error);
    chrome.runtime.sendMessage({action: "loginFail"})
  } finally {
    const loginButton = document.getElementById("email-submit-button");
    const spinner = document.getElementById("spinner-login");
    toggleSpinner(spinner, loginButton, false);
  }
}

// 邮箱校验函数
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 简单的邮箱正则表达式
  return emailPattern.test(email);
}

async function passwordRegister() {
  // const email = document.getElementById("email").value;
  // const password = document.getElementById("password").value;
  const email = document.querySelector('input[name="email"]').value;

  const password = document.querySelector('input[name="password"]').value;

  try {
    // 发送POST请求到register接口
    // const response = await fetch("http://localhost:3000/user/register", {
    const response = await fetch(serverUrl + "/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username: email.split("@")[0],
      }), // 假设用户名是邮箱的本地部分
    });

    if (response.ok) {
      const result = await response.json();
      // console.log(result);
      // console.log("result is : ", result.userData);
      // 在此处显示登录表单或其他操作
      // showLoginForm("Login with Password", contentContainer);
      // 向 background.js 发送消息，告知注册成功
      chrome.runtime.sendMessage(
        { action: "RegisterSuccess", userData: result.userData },
        (response) => {
          if (response && response.success) {
            // 在注册成功后显示提示
            alert(`username ${result.userData.email} registrated successful`);
            window.close(); // 关闭当前注册页面
          } else {
            alert("Failed to communicate with background script.");
          }
        }
      );
    } else if (response.status === 400) {
      // 处理密码不匹配的情况
      const errorData = await response.json();
      alert("RegisterFailed: " + errorData.message);
    } else {
      const error = await response.text();
      console.error("Error:", error);
      // 在此处处理错误，例如显示错误消息
      alert("Registration failed: " + error);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred: " + error.message);
  } finally {
    const loginButton = document.getElementById("email-submit-button");
    const spinner = document.getElementById("spinner");
    toggleSpinner(spinner, loginButton, false);
  }
}

// 通用方法来控制 spinner 和按钮状态
async function toggleSpinner(spinner, button, isLoading) {
  if (isLoading) {
    spinner.style.display = "inline-block"; // 显示 spinner
    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&",document.getElementById('button-text1'))
    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&111111",document.getElementById('button-text1'))
    // button.classList.add("button-loading"); // 添加加载状态类

    button.disabled = true; // 禁用按钮
    // buttton.textContent = ""
    // document.getElementById("button-text").textContent = "";
    button.classList.add("button-loading"); // 添加加载状态类

    // console.log("禁用按钮", button, spinner);
  } else {
    spinner.style.display = "none"; // 隐藏 spinner
    button.disabled = false; // 启用按钮
  }
}

async function handleGoogleLogin(event) {
  event.preventDefault();
  try {
    // 等待几秒钟（例如 5 秒）
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    // 直接重定向到 Google 登录页面
    // window.location.href = "http://localhost:3000/auth/google";
    window.location.href = serverUrl + "/auth/google";
    console.log("触发了auth google");
  } catch (error) {
    console.error("error occured while Google login:", error);
  } finally {
    // 隐藏 spinner
    // toggleSpinner(spinner, googleRegisterButton, false);
  }
}

async function handleGoogleLogin2(event) {
  event.preventDefault();
  const response = await gapi.auth2.getAuthInstance().signIn();
  const idToken = response.getAuthResponse().id_token; // 获取 ID Token

  try {
    const res = await fetch("/api/google-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();
    if (data.success) {
      // 登录成功，存储用户数据
      localStorage.setItem("userData", JSON.stringify(data.userData));
      // 重定向到主页面
      window.location.href = "login.html";
    } else {
      console.error(data.message);
      alert(data.message); // 显示错误消息
    }
  } catch (error) {
    console.error("登录请求失败:", error);
  }
}

function handleGoogleRegister() {
  // console.log("handlegoogleddddd");
  // 获取扩展 ID
  // window.location.href = "http://localhost:3000/auth/google";
  window.location.href = serverUrl + "/auth/google";
  // console.log("触发了auth google");
}

function handleLoadingSpinner() {
  // console.log("handleloadingSpinner");
  const buttonText = document.getElementById("button-text1");
  const loadingSpinner = document.getElementById(spinner);
  const buttonContent = document.getElementById("button-content1");
  // 切换按钮内容到加载状态
  buttonText.textContent = "Logging in";
  loadingSpinner.style.display = "inline-block";
  // buttonContent.style.display = "none";

  // 隐藏图标，但保留文本显示
  const googleIcon = document.querySelector("#button-content1 .google-icon");
  googleIcon.style.display = "none"; // 仅隐藏图标，保留文本
}

function handleAuthCallback() {
  // console.log("触发了auth/google/callback");
  const params = new URLSearchParams(window.location.search);
  // console.log("window.location.search is: ", window.location.search);
  // console.log("params is: ", params);
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
  } else {
    chrome.runtime.sendMessage({
      action: "loginFail"
    });
    console.log("999999")
    // 处理授权码，例如通过 API 请求用户信息
    // console.log("Authorization code received:", authCode);
    // 可以进一步调用后端来交换访问令牌和获取用户信息
  }
  // else {
  //   // console.log("No relevant data in URL, not an OAuth callback.");
  // }
}

// 在页面加载时处理回调
// 检查是否是 OAuth 回调并处理
if (
  window.location.search.includes("code=") ||
  window.location.search.includes("user=")
) {
  // console.log("触发callback中。。。。");
  handleAuthCallback();
}else{
  chrome.runtime.sendMessage({
    action: "loginFail"
  });
  console.log("7777777")
}

document.addEventListener("DOMContentLoaded", () => {
  // 检查是否有用户数据
  const extensionId = chrome.runtime.id;
  // console.log("extensionId: ",extensionId)
  // 讲extensionId存储在 localStorage 中
  // localStorage.setItem('extensionId', extensionId);
  // document.cookie = `extensionId=${extensionId}; path=/`;
  // 发送到后端
  fetch(serverUrl + "/api/get-cookie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ extensionId }),
  });
});
