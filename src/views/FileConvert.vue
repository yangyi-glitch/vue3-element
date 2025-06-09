<template>
  <div class="description">文档转换===>pdf转word、word转pdf</div>
  <div class="upload-container">
    <el-upload
      class="upload-demo"
      drag
      action="/api/file/convert"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      multiple
      :show-file-list="false"
    >
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
    </el-upload>
  </div>

  <div class="m-4">
    <el-cascader v-model="value" :options="options" @change="handleChange" />
  </div>
  <div class="m-4">
    <el-cascader
      v-model="value"
      :options="options"
      :props="props"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, ElLoading } from "element-plus";
import { ref } from "vue";
import { treeListService } from "@/api/file.js";

const value = ref([]);

const options = ref([]);
const props = {
  expandTrigger: "hover" as const,
};

const handleChange = async function (value) {
  console.log(value);
};

const areaTree = async function () {
  const consult = await treeListService();
  options.value = consult.data;
};

areaTree();

const download = async function (fileUrl, fileName) {
  try {
    // 创建一个临时的a标签来触发下载
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName; // 设置下载文件名
    link.click();
    window.URL.revokeObjectURL(link.href); // 释放URL对象

    ElMessage({
      message: "开始下载文件：" + fileName,
      type: "success",
    });
  } catch (error) {
    ElMessage({
      message: "下载失败",
      type: "error",
    });
  }
};

const handleSuccess = (response, uploadFile) => {
  console.log("上传成功-response", response);
  if (response.data == null) {
    ElMessage({
      message: "小伙子你是看不懂人话嘛~~~~~",
      type: "error",
    });
    return;
  }
  const loadingInstance = ElLoading.service({
    fullscreen: true,
    text: "转换中，请稍候...",
  });

  setTimeout(() => {
    // 关闭加载动画
    loadingInstance.close();

    // 执行下载
    download(response.data.fileUrl, response.data.fileName);
  }, 3000); // 3秒延迟
};

const handleError = (error) => {
  ElMessage({
    message: "文件上传失败",
    type: "error",
  });
};

const beforeUpload = (file) => {
  return true;
};
</script>

<script lang="ts">
export default {
  name: "FileVue",
};
</script>

<style scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.upload-demo {
  width: 1000px;
  margin: 0 auto;
}

.el-upload__tip {
  color: #909399;
  font-size: 12px;
  margin-top: 7px;
}

.description {
  font-size: 16px;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
}
</style>

