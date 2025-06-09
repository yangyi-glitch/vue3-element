<template>
  <div class="profile-container">
    <div class="profile-header">
      <el-avatar :size="120" src="./public/adv.jpg"/>
      <h1>张三</h1>
      <p class="title">全栈开发工程师</p>
    </div>

    <div class="profile-content">
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <h3>个人信息</h3>
          </div>
        </template>
        <div class="info-list">
          <p><el-icon><User /></el-icon> 年龄：28岁</p>
          <p><el-icon><Location /></el-icon> 所在地：北京</p>
          <p><el-icon><Message /></el-icon> 邮箱：zhangsan@example.com</p>
          <p><el-icon><Phone /></el-icon> 电话：138****1234</p>
        </div>
      </el-card>

      <el-card class="about-card">
        <template #header>
          <div class="card-header">
            <h3>关于我</h3>
          </div>
        </template>
        <p>拥有5年全栈开发经验，精通Vue.js、React、Node.js等前端技术栈，以及Spring Boot、MySQL等后端技术。热爱技术创新，乐于分享，持续学习成长。</p>
      </el-card>

      <el-card class="skills-card">
        <template #header>
          <div class="card-header">
            <h3>技能专长</h3>
          </div>
        </template>
        <div class="skills-list">
          <el-tag>Vue.js</el-tag>
          <el-tag>React</el-tag>
          <el-tag>Node.js</el-tag>
          <el-tag>Spring Boot</el-tag>
          <el-tag>MySQL</el-tag>
          <el-tag>Docker</el-tag>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Location, Message, Phone } from '@element-plus/icons-vue'
</script>

<script lang="ts">
export default {
  name: "MyIntroduced",
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.profile-header h1 {
  margin: 20px 0 10px;
  font-size: 28px;
  color: #303133;
}

.profile-header .title {
  color: #606266;
  font-size: 18px;
}

.profile-content {
  display: grid;
  gap: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.info-list p {
  margin: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #606266;
  font-size: 15px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 0;
}

.el-tag {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.3s;
}

.el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.about-card p {
  line-height: 1.8;
  color: #606266;
  font-size: 15px;
  padding: 8px 0;
}

@media screen and (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }
  
  .profile-header {
    margin-bottom: 24px;
  }
  
  .profile-header h1 {
    font-size: 24px;
  }
  
  .profile-content {
    gap: 16px;
  }
  
  .info-list p {
    font-size: 14px;
  }
  
  .el-tag {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
