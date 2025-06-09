<template>
  <el-menu
    :default-active="activeIndex2"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    @select="handleSelect"
  >
    <!-- <el-menu-item index="1" style="width: 200px">AI</el-menu-item> -->
    <el-menu-item index="3" style="width: 200px">常保格</el-menu-item>
    <el-menu-item index="4" style="width: 200px">文件</el-menu-item>
    <el-menu-item index="5" style="width: 200px">文件转换</el-menu-item>
  </el-menu>

  <component :is="currentComponent" />
</template>

<script lang="ts" setup>
import { ref, shallowRef, onMounted } from "vue";
import { useRouter } from "vue-router";
import ElementVue from "./Element.vue";
import FileVue from "./File.vue";
import MyIntroduced from "./MyIntroduced.vue";
import FileConvert from "./FileConvert.vue";

const activeIndex2 = ref("4");
const router = useRouter();
const currentComponent = shallowRef(null);

const handleSelect = (key: string, keyPath: string[]) => {
  if (key === "1") {
    currentComponent.value = MyIntroduced;
  }
  if (key === "3") {
    currentComponent.value = ElementVue;
  }
  if (key === "4") {
    currentComponent.value = FileVue;
  }
  if (key === "5") {
    currentComponent.value = FileConvert;
  }
  console.log(key, keyPath);
};

onMounted(() => {
  handleSelect(activeIndex2.value, []);
});
</script>