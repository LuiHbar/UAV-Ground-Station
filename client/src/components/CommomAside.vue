<!--
 * @Author: urthan urhtan@qq.com
 * @Date: 2024-03-06 11:15:39
 * @LastEditors: urthan
 * @LastEditTime: 2024-04-03 16:56:19
 * @FilePath: \client\src\components\CommomAside.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-row class="tac">
    <el-col :span="12">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item
          v-for="item in menuData"
          :index="item.name"
          :key="item.name"
          @click="clickMenu(item)"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      menuData: [
        {
          path: "/basic-transcevier",
          name: "/basic-transcevier",
          icon: "el-icon-s-promotion",
          label: "基本收发",
        },
        {
          path: "/data-waveform",
          name: "/data-waveform",
          icon: "el-icon-s-data",
          label: "数据波形",
        },
        {
          path: "/flight-control",
          name: "/flight-control",
          icon: "el-icon-set-up",
          label: "飞控设置",
        },
        {
          path: "/save-file",
          name: "/save-file",
          icon: "el-icon-files",
          label: "EXCEL",
        },
        {
          path: "/show",
          name: "/show",
          icon: "el-icon-setting",
          label: "三维显示",
        },
      ],
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    clickMenu(item) {
      if (this.$route.path != item.path) {
        this.$router.push(item.path);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.el-menu {
  height: 80vh;
}
.el-col-12 {
  width: 100%;
}
</style>