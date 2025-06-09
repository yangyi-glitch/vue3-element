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
</script>

<script lang="ts">
</script>

<style scoped>
/* 修改背景部分的渐变色 */
.background {
  background: linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%);
}

/* 修改表单容器的阴影和圆角 */
.login-form-container {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.login-form {
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* 修改登录按钮的样式 */
.login-button {
  background-color: #4e54c8;
}

.login-button:hover:not(:disabled) {
  background-color: #3b40a6;
}

/* 修改文字样式 */
.form-header h1 {
  color: #333;
}

.form-header p {
  color: #666;
}

/* 修改输入框的焦点状态 */
.form-group input:focus {
  border-color: #4e54c8;
  box-shadow: 0 0 0 2px rgba(78, 84, 200, 0.2);
}
</style>