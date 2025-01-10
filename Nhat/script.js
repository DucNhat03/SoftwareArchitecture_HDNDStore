const formOpenBtn = document.querySelector("#form-open"),
  home = document.querySelector(".home"),
  formContainer = document.querySelector(".form_container"),
  formCloseBtn = document.querySelector(".form_close"),
  signupBtn = document.querySelector("#signup"),
  loginBtn = document.querySelector("#login"),
  forgotPasswordBtn = document.querySelector("#forgot-password"),
  loginFromForgotBtn = document.querySelector("#login-from-forgot"),
  loginForm = document.querySelector(".login_form"),
  signupForm = document.querySelector(".signup_form"),
  forgotPasswordForm = document.querySelector(".forgot_password_form"),
  pwShowHide = document.querySelectorAll(".pw_hide");


// Hiển thị form (chung) khi nhấn nút mở form
formOpenBtn.addEventListener("click", () => {
  home.classList.add("show");
  formContainer.classList.add("active");
  // Hiển thị form đăng nhập mặc định
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  forgotPasswordForm.style.display = "none";
});

// Đóng form
formCloseBtn.addEventListener("click", () => {
  home.classList.remove("show");
  formContainer.classList.remove("active");
});

// Hiển thị form đăng ký
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  forgotPasswordForm.style.display = "none";
});

// Hiển thị form đăng nhập
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  forgotPasswordForm.style.display = "none";
});

// Hiển thị form quên mật khẩu
forgotPasswordBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "none";
  forgotPasswordForm.style.display = "block";
});

// Quay lại form đăng nhập từ form quên mật khẩu
loginFromForgotBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  forgotPasswordForm.style.display = "none";
});

// Hiển thị/ẩn mật khẩu
pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("uil-eye-slash", "uil-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("uil-eye", "uil-eye-slash");
    }
  });
});
