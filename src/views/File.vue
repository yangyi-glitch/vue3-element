<template>
  <div class="upload-container">
    <el-upload
        class="upload-demo"
        drag
        action="/api/file/upload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        multiple
        :show-file-list="false"
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">拖拽文件到此处或 <em>点击上传</em></div>
    </el-upload>

    <!-- 新增一个容器，用于左右布局 -->
    <div class="main-content" style="display: flex; flex-direction: row; gap: 20px;">
      <!-- 视频播放器 -->
      <div class="video-section" style="width: 70%;">
        <video controls class="fixed-video">
          <source :src="videoUrl" type="video/mp4">
        </video>
      </div>

      <!-- 文件列表 -->
      <div class="file-list" style="width: 30%;">
        <div class="flex items-center mb-4">
          <div class="flex-1"></div>
          <el-input
              v-model="searchList.fileName"
              placeholder="文件名"
              style="width: 200px; margin-right: 10px"
          />
          <el-input
              v-model="searchList.fileType"
              placeholder="文件类型"
              style="width: 200px; margin-right: 10px"
          />
          <el-button
              :icon="Search"
              round
              @click="getList()"
              style="margin-left: 900px"
          >搜索
          </el-button
          >
          <el-button
              :icon="Search"
              round
              @click="reset()"
              style="margin-left: 10px"
          >重置
          </el-button
          >
        </div>
        <h3>文件列表</h3>
        <el-table :data="fileList" style="width: 100%" height="470">
          <el-table-column prop="fileName" label="文件名"/>
          <el-table-column prop="fileUrl" label="文件地址"/>
          <el-table-column prop="fileType" label="文件类型"/>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleDownload(scope.row)"
              >
                下载
              </el-button>

              <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handlePreview(scope.row)"
              >
                预览
              </el-button>

              <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页 -->
    <div class="example-pagination-block">
      <el-pagination
          @current-change="handlePageChange"
          layout="prev, pager, next"
          :total="total"
          :default-page-size="searchList.pageSize"
      />
    </div>

    <!-- 走马灯展示 -->
    <div class="carousel-container" v-if="imageFiles.length > 0">
      <el-carousel :interval="4000" type="card" height="500px">
        <el-carousel-item v-for="file in imageFiles" :key="file.id">
          <img :src="file.previewUrl" class="carousel-image"/>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {UploadFilled, Loading, Search} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {
  listService,
  downloadService,
  previewService,
  deletService,
} from "../api/file.js";
import {ref, computed} from "vue";

// 文件列表数据
const fileList = ref([]);
const videoUrl = ref('http://192.168.1.103:9000/localhost-file/mp4/33b65444-38d6-4ffb-b655-b2a065b8982e-tomcat-2.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20250608%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250608T040231Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=428dbdad7403a4c98f1d729edb602d47d781ac6b3de45dcf2185e8e4ba1dac6e');
// const videoUrl = ref('http://127.0.0.1:9000/localhost-file/mp4/8f3a9398-fb05-48ae-a1f1-5e22cc537f16-%E5%93%88%E5%93%88%E5%95%8A%E5%93%88.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20250607%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250607T153804Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=fa5ff3636b3c58308de111aa8ba1ed56fdb6a8993deb8b888ffa592dff902d41');
// const imageIdList = ref([81, 82, 83, 84, 85]);
const imageIdList = ref([91, 92, 93, 96]);
const imageFiles = ref([]);
const searchList = ref({
  fileName: undefined,
  fileType: undefined,
  pageNo: 1,
  pageSize: 10,
});

const total = ref(0);

// 判断是否为图片文件
const isImageFile = (fileType: string) => {
  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
  return imageTypes.includes(fileType.toLowerCase());
};

// 更新图片文件列表
const updateImageFiles = async () => {
  const imageList = [];
  for (const id of imageIdList.value) {
    try {
      const consult = await previewService(id);
      imageList.push({
        previewUrl: consult.data,
      });
    } catch (error) {
      console.error("Failed to get preview URL for image:", error);
    }
  }
  imageFiles.value = imageList;
  console.log("imageFiles.value", imageFiles.value);
};

const handlePageChange = async function (newPage) {
  searchList.value.pageNo = newPage;
  getList();
};

const getList = async function () {
  const consult = await listService(searchList.value);
  console.log(consult);
  fileList.value = consult.data;
  total.value = consult.total;
  // 更新图片文件列表
  await updateImageFiles();
};

getList();

// 处理文件下载
const handleDownload = async function (file) {
  try {
    // 获取文件预览URL（这个URL也可以用于下载）
    const consult = await previewService(file.id);
    const fileUrl = consult.data;

    // 创建一个临时的a标签来触发下载
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = file.fileName; // 设置下载文件名
    link.click();
    window.URL.revokeObjectURL(link.href); // 释放URL对象

    ElMessage({
      message: "开始下载文件：" + file.fileName,
      type: "success",
    });
  } catch (error) {
    ElMessage({
      message: "下载失败",
      type: "error",
    });
  }
};

// 处理文件预览
const handlePreview = async function (file) {
  console.log(file)
  if (file.fileType !== 'txt' && file.fileType !== 'pdf' && file.fileType !== 'doc' && file.fileType !== 'docx' && file.fileType !== 'mp4') {
    errorTips("该文件类型暂不支持预览~")
  }
  try {
    console.log(file);
    let consult = await previewService(file.id);
    console.log(consult);

    const response = await fetch(consult.data);
    const blob = await response.blob();
    let urlPreview = window.URL.createObjectURL(blob);
    if (file.fileType === 'txt') {
      const textBlob = new Blob([blob], {type: 'text/plain;charset=utf-8'});
      urlPreview = window.URL.createObjectURL(textBlob);
    }
    if (file.fileType === 'mp4') {
      videoUrl.value = consult.data;
      console.log("videoUrl.value", videoUrl.value)
    } else {
      const previewWindow = window.open();
      if (previewWindow) {
        previewWindow.location.href = urlPreview;
      }
    }

  } catch (error) {
    errorTips("预览失败")
  }
  return
};

// 处理文件删除
const handleDelete = async (file: any) => {
  ElMessage({
    message: "删除文件：" + file.fileName,
    type: "success",
  });
  // TODO: 实现文件删除逻辑
  await deletService(file.id);
  getList();
};

const handleSuccess = (response, uploadFile) => {
  ElMessage({
    message: "文件上传成功",
    type: "success",
  });
  // 上传成功后刷新文件列表
  // TODO: 调用获取文件列表的接口
  getList();
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

const reset = async function () {
  searchList.value.fileName = undefined;
  searchList.value.fileType = undefined;
  getList();
};

const errorTips = async function (error) {
  ElMessage({
    message: error,
    type: "error",
  });
};
</script>

<script lang="ts">
export default {
  name: "FileVue",
};
</script>

<style scoped>
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}

.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}

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

.file-list {
  margin-top: 20px;
}

.preview-container {
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #909399;
}

.loading .el-icon {
  font-size: 24px;
}

.carousel-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

:deep(.el-carousel__item) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

:deep(.el-carousel__item img) {
  max-width: 100%;
  max-height: 100%;
}

.main-content {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.video-section {
  width: 30%;
}

.video-section video {
  width: 100%;
  height: auto;
}

.file-list {
  width: 70%;
}

.fixed-video {
  width: 1200px !important;
  height: 650px !important;
  object-fit: cover; /* 视频内容自适应容器 */
}
</style>

