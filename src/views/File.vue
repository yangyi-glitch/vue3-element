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
      <div class="video-section">
        <video ref="videoRef" controls class="fixed-video">
          <source :src="videoUrl" type="video/mp4">
        </video>
      </div>

      <!-- 文件列表 -->
      <div class="file-list">
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
          >搜索
          </el-button
          >
          <el-button
              :icon="Search"
              round
              @click="reset()"
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

        <!-- 分页 -->
        <div class="example-pagination-block">
          <el-pagination
              @current-change="handlePageChange"
              layout="prev, pager, next"
              :total="total"
              :default-page-size="searchList.pageSize"
          />
        </div>

      </div>
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
import {UploadFilled, Search} from "@element-plus/icons-vue";
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
//使video重新加载
const videoRef = ref()
const videoUrl = ref('');
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
  if (file.fileType !== 'txt' && file.fileType !== 'pdf' && file.fileType !== 'doc' && file.fileType !== 'docx' && file.fileType !== 'mp4' && file.fileType !== 'MP4') {
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
    if (file.fileType === 'mp4' || file.fileType === 'MP4') {
      videoUrl.value = consult.data;
      console.log("videoUrl.value", videoUrl.value)
      videoRef.value.load();
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

.main-content {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.video-section {
  width: 60%;
}

.file-list {
  margin-top: 20px;
  width: 40%;
}

.fixed-video {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 80vh; /* 控制最大高度为视口高度的80%，防止溢出 */
}
</style>

