<template>
  <div class="login-container">
    <!-- 左侧背景 -->
    <div class="background">
      <div class="background-content">
        <h1 class="logo">SHAN</h1>
        <h2>未命名</h2>
        <p>0===={}=============></p>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-form-container">
      <div class="login-form">
        <div class="form-header">
          <h1>登录</h1>
          <p>请输入您的凭据</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">账号</label>
            <input
                type="username"
                id="username"
                v-model="form.username"
                placeholder="请输入邮箱"
            />
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <input
                type="password"
                id="password"
                v-model="form.password"
                placeholder="请输入密码"
            />
            <span class="toggle-password" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </span>
          </div>

          <div class="form-group">
            <label for="role">登录类型</label>
            <select id="role" v-model="form.role" class="form-control">
              <option value="student">学生端</option>
              <option value="teacher">教师端</option>
              <option value="admin">管理端</option>
            </select>
          </div>

          <button type="submit" class="login-button" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            <span v-else>登录</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {login} from "../api/article.js";

const router = useRouter();
const form = ref({
  username: "",
  password: "",
  role: "admin", // 默认值
  remember: false,
});
const loading = ref(false);
const showPassword = ref(false);
// 全局变量存储 token

const handleLogin = async function () {
  loading.value = true;
  console.log("登录信息:", form.value);
  const consult = await login(form.value);
  loading.value = false;
  console.log("consult", consult.data);
  // 模拟登录成功
  if (200 == consult.code) {
    ElMessage({
      message: consult.data,
      type: "success",
    });
    localStorage.setItem("token", consult.data);
    if ("admin" == form.value.role) {
      router.push("AdminIndex");
    }
    if ("teacher" == form.value.role) {
      router.push("TeaIndex");
    }
  } else if ("500" == consult.code) {
    ElMessage({
      message: consult.data,
      type: "error",
    });
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<script lang="ts">
export default {
  name: "LoginVue",
};
</script>

<style scoped>
.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
}

/* 登录容器 */
.login-container {
  display: flex;
  width: 100%;
  height: 100vh; /* 改为100%视口高度 */
  border-radius: 0; /* 移除圆角 */
  overflow: hidden;
  box-shadow: none; /* 移除阴影 */
}

/* 背景部分 */
.background {
  flex: 1;
  background: linear-gradient(135deg, #c84e64 0%, #8f94fb 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 40px;
  min-width: 50%; /* 确保始终各占一半 */
}

.background-content {
  text-align: center;
}

.logo {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.background h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  opacity: 0.9;
}

.background p {
  font-size: 1.1rem;
  max-width: 400px;
  margin: 0 auto;
  opacity: 0.8;
}

/* 登录表单部分 */
.login-form-container {
  flex: 1;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
}

.form-header p {
  font-size: 0.95rem;
  color: #666;
}

/* 表单组 */
.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #4e54c8;
  outline: none;
  box-shadow: 0 0 0 2px rgba(78, 84, 200, 0.2);
}

/* 密码显示切换 */
.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #999;
  font-size: 0.85rem;
}

.toggle-password:hover {
  color: #6a11cb;
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-me input {
  margin-right: 8px;
  width: auto;
}

.forgot-password {
  color: #6a11cb;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 12px;
  background-color: #4e54c8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.login-button:hover:not(:disabled) {
  background-color: #3b40a6;
  transform: translateY(-2px);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 加载动画 */
.loading-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 分隔线 */
.divider {
  display: flex;
  align-items: center;
  margin: 25px 0;
  position: relative;
}

.divider span {
  background-color: white;
  padding: 0 15px;
  font-size: 0.9rem;
  color: #999;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #eee;
}

/* 社交登录 */
.social-login {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.social-btn {
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.social-btn:hover {
  opacity: 0.8;
}

.social-btn.google {
  background-color: #db4437;
}

.social-btn.facebook {
  background-color: #3b5998;
}

.social-btn.twitter {
  background-color: #1da1f2;
}

/* 注册链接 */
.register-link {
  text-align: center;
  font-size: 0.95rem;
  color: #777;
}

.register-link a {
  color: #6a11cb;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 新增社交登录按钮 */
.social-login {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.social-btn {
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.social-btn:hover {
  opacity: 0.8;
}

.social-btn.google {
  background-color: #db4437;
}

.social-btn.facebook {
  background-color: #3b5998;
}

.social-btn.twitter {
  background-color: #1da1f2;
}

/* 新增底部链接 */
.footer-links {
  margin-top: 20px;
  text-align: center;
}

.footer-links a {
  color: #4e54c8;
  text-decoration: none;
  margin: 0 10px;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>
