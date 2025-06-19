<template>
  <div class="page-container">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="addMethod()">
        <el-icon><plus /></el-icon>新增
      </el-button>
    </div>

    <!-- 抽屉 -->
    <el-drawer v-model="addDrawer" title="新增" :with-header="true">
      <div class="form-group m-t-4">
        <el-row class="m-t-2">
          <el-col :span="8">
            <el-text class="label" size="large">书名：</el-text>
            <el-input
              v-model="article.bookName"
              placeholder="请输入书名"
              style="width: 300px"
            />
          </el-col>
        </el-row>
        <el-row class="m-t-2">
          <el-col :span="8">
            <el-text class="label" size="large">价格：</el-text>
            <el-input
              v-model="article.price"
              placeholder="请输入价格"
              style="width: 300px"
            />
          </el-col>
        </el-row>
        <el-row class="m-t-2">
          <el-col :span="8">
            <el-text class="label" size="large">作者：</el-text>
            <el-input
              v-model="article.author"
              placeholder="请输入作者"
              style="width: 300px"
            />
          </el-col>
        </el-row>
      </div>
      <div class="button-container">
        <el-button type="primary" @click="addDetail()">添加</el-button>
      </div>
    </el-drawer>

    <el-drawer v-model="detailDrawer" title="详情" :with-header="true">
      <div class="form-group m-t-4">
        <el-row class="m-t-2">
          <el-col :span="8">
            <el-text class="label" size="large">书名：</el-text>
            <el-input
              v-model="article.bookName"
              disabled
              placeholder="请输入书名"
              style="width: 300px"
            />
          </el-col>
        </el-row>
        <el-row class="m-t-2">
          <el-col :span="8">
            <el-text class="label" size="large">价格：</el-text>
            <el-input
              v-model="article.price"
              disabled
              placeholder="请输入价格"
              style="width: 300px"
            />
          </el-col>
        </el-row>
        <el-row class="m-t-2">
          <el-col :span="8">
            <el-text class="label" size="large">作者：</el-text>
            <el-input
              v-model="article.author"
              disabled
              placeholder="请输入作者"
              style="width: 300px"
            />
          </el-col>
        </el-row>
      </div>
      <!-- <el-button @click="navigateTo('Index')">返回首页</el-button> -->
    </el-drawer>

    <el-drawer v-model="updateDrawer" title="编辑" :with-header="true">
      <div class="form-group m-t-4">
        <el-row class="m-t-2">
          <el-col :span="8">
            <el-text class="label" size="large">书名：</el-text>
            <el-input
              v-model="article.bookName"
              placeholder="请输入书名"
              style="width: 300px"
            />
          </el-col>
        </el-row>
        <el-row class="m-t-2">
          <el-col :span="8">
            <el-text class="label" size="large">价格：</el-text>
            <el-input
              v-model="article.price"
              placeholder="请输入价格"
              style="width: 300px"
            />
          </el-col>
        </el-row>
        <el-row class="m-t-2">
          <el-col :span="8">
            <el-text class="label" size="large">作者：</el-text>
            <el-input
              v-model="article.author"
              placeholder="请输入作者"
              style="width: 300px"
            />
          </el-col>
        </el-row>
      </div>
      <div class="button-container">
        <el-button type="primary" @click="updateMethod()">更新</el-button>
      </div>
    </el-drawer>

    <div class="flex flex-wrap items-center mb-4">
      <el-input
        v-model="searchList.bookName"
        placeholder="书名"
        style="width: 200px; margin-right: 10px"
      />
      <el-input
        v-model="searchList.price"
        placeholder="价格"
        style="width: 200px; margin-right: 10px"
      />
      <el-input
        v-model="searchList.author"
        placeholder="作者"
        style="width: 200px; margin-right: 100px"
      />
      <el-button
        :icon="Search"
        round
        @click="getArticlePage()"
        style="margin-left: 900px"
        >搜索</el-button
      >
      <el-button :icon="Search" round @click="reset()" style="margin-left: 10px"
        >重置</el-button
      >
    </div>

    <!-- 列表 -->
    <h3>常保格vew</h3>
    <el-table :data="articles" style="width: 100%" height="470">
      <el-table-column prop="bookName" label="书名" width="200" />
      <el-table-column prop="price" label="价格" width="200" />
      <el-table-column prop="author" label="作者" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="detail(row.id)">
            详情
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="updateDetail(row.id)"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="deletById(row.id)"
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

    <!-- <el-button @click="navigateTo('Index')">返回首页</el-button> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import type { TabsPaneContext } from "element-plus";
import { ElMessage } from "element-plus";
import { Plus, Search } from "@element-plus/icons-vue";
import { articlePage, get, delet, add, update } from "../api/article.js";
import { useRouter } from "vue-router";

const router = useRouter();

const addDrawer = ref(false);
const detailDrawer = ref(false);
const updateDrawer = ref(false);

const searchList = ref({
  bookName: undefined,
  author: undefined,
  price: undefined,
  pageNo: 1,
  pageSize: 10,
});

const article = ref({
  id: "",
  author: "",
  price: "",
  bookName: "",
});

const result = ref({
  data: [],
  total: 0,
});

const total = ref(0);
const articles = ref();

const getArticlePage = async function () {
  try {
    const consult = await articlePage(searchList.value);
    if (consult && consult.data && consult.total !== undefined) {
      articles.value = consult.data;
      total.value = consult.total;
    } else {
      console.error("Invalid response from articlePage:", consult);
      ElMessage({
        message: "获取数据失败，请稍后重试",
        type: "error",
      });
    }
  } catch (error) {
    ElMessage({
      message: "网络错误，请检查您的连接",
      type: "error",
    });
  }
};

getArticlePage();

const handlePageChange = async function (newPage) {
  searchList.value.pageNo = newPage;
  getArticlePage();
};

const detail = async function (id) {
  const consult = await get(id);
  console.log("data", consult);
  assignment(consult);
  detailDrawer.value = true;
};

const updateDetail = async function (id) {
  const consult = await get(id);
  assignment(consult);
  updateDrawer.value = true;
};

const addMethod = async function () {
  empty();
  addDrawer.value = true;
};

const addDetail = async function () {
  await add(article.value);
  ElMessage({
    message: "新增成功~",
    type: "success",
  });
  addDrawer.value = false;
  getArticlePage();
};

const updateMethod = async function () {
  await update(article.value);
  getArticlePage();
  ElMessage({
    message: "更新成功~",
    type: "success",
  });
};

const deletById = async function (id) {
  await delet(id);
  getArticlePage();
  ElMessage({
    message: "删除成功~",
    type: "success",
  });
};

const assignment = async function (data) {
  article.value.author = data.data.author;
  article.value.bookName = data.data.bookName;
  article.value.price = data.data.price;
  article.value.id = data.data.id;
};
const reset = async function () {
  searchList.value.bookName = undefined;
  searchList.value.author = undefined;
  searchList.value.price = undefined;
  getArticlePage();
};

const empty = async function () {
  article.value.id = "";
  article.value.author = "";
  article.value.bookName = "";
  article.value.price = "";
};

// 添加一个跳转方法
const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};
</script>

<script lang="ts">
export default {
  name: "ElementVue",
};
</script>

<style>
.page-container {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.operation-bar .el-button {
  padding: 8px 16px;
}

.operation-bar .el-icon {
  margin-right: 4px;
}

.center-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-bottom: 24px;
}

.button-container {
  margin: 24px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

/* 标签样式 */
.label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
}

/* 网格间距 */
.m-t-4 {
  margin-top: 16px;
}

.m-t-2 {
  margin-top: 8px;
}

.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}
.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}
</style>
