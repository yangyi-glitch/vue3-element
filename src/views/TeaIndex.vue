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
    <el-menu-item index="3" style="width: 200px">常保格</el-menu-item>
  </el-menu>

  <component :is="currentComponent" />
</template>

<script lang="ts" setup>
import { ref, shallowRef, onMounted } from "vue";
import { useRouter } from "vue-router";
import ElementVue from "./Element.vue";

const activeIndex2 = ref("3");
const router = useRouter();
const currentComponent = shallowRef(null);

const handleSelect = (key: string, keyPath: string[]) => {
  if (key === "3") {
    currentComponent.value = ElementVue;
  }
  console.log(key, keyPath);
};

onMounted(() => {
  handleSelect(activeIndex2.value, []);
});
</script>
