<template>
  <div>
    <div class="setup">
      <el-button :type="setup.type" @click="changeSave" :disabled="disabled">{{
        setup.label
      }}</el-button>
      <!-- <el-button type="primary" @click="exportCsv">导出excel</el-button> -->
    </div>

    <div class="dataSelect">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>
      <div style="margin: 15px 0"></div>
      <el-checkbox-group
        v-model="checkedData"
        @change="handleCheckedDataChange"
      >
        <el-checkbox v-for="item in options" :label="item" :key="item">
          {{ item }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
  
  <script>
import { mkConfig, generateCsv, download } from "export-to-csv";
export default {
  data() {
    return {
      data: [],
      checkedData: [],
      checkAll: false,
      options: [
        "Angle_ROL",
        "Angle_PIT",
        "Angle_YAW",
        "ACC_X",
        "ACC_Y",
        "ACC_Z",
        "GYR_X",
        "GYR_Y",
        "GYR_Z",
      ],
      isIndeterminate: false,
      setup: {
        isSaved: false,
        type: "primary",
        label: "开始写入",
      },
      disabled: false,
    };
  },
  methods: {
    changeSave() {
      this.setup.isSaved = !this.setup.isSaved;
      this.setup.type = this.setup.isSaved ? "success" : "primary";
      this.setup.label = this.setup.isSaved ? "停止写入" : "开始写入";
      if (!this.setup.isSaved) {
        this.exportCsv();
      } else {
        this.data = [];
      }
    },
    exportCsv() {
      let time = new Date();
      // csv配置
      const csvConfig = mkConfig({
        useKeysAsHeaders: true,
        filename:
          "Data(" +
          time.getFullYear() +
          "." +
          time.getMonth() +
          "." +
          time.getDate() +
          "-" +
          time.getHours() +
          "." +
          time.getMinutes() +
          "." +
          time.getSeconds() +
          ")",
      });
      let data = [];
      for (let i = 0; i < this.data.length; i++) {
        // this.data[i]
        let obj = {};
        for (const key in this.data[i]) {
          if (this.checkedData.includes(key)) {
            obj[key] = this.data[i][key];
          }
        }
        data.push(obj);
      }
      // 生成csv文件
      const csv = generateCsv(csvConfig)(data);
      //下载
      download(csvConfig)(csv);
    },
    handleCheckAllChange(val) {
      this.checkedData = val ? this.options : [];
      this.isIndeterminate = false;
    },
    handleCheckedDataChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.options.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.options.length;
    },
    getData(e) {
      if (!this.setup.isSaved) return;
      let msg = JSON.parse(e.data);
      if (msg.code === 31) {
        // console.log(msg.data);
        let {
          ACC_X,
          ACC_Y,
          ACC_Z,
          GYRO_X,
          GYRO_Y,
          GYRO_Z,
          MAG_X,
          MAG_Y,
          MAG_Z,
          ROL,
          PIT,
          YAW,
          // ALT_USE,
          // ALT_BAR,
          // ALT_CSB,
        } = msg.data;

        this.data.push({
          Angle_ROL: ROL,
          Angle_PIT: PIT,
          Angle_YAW: YAW,
          ACC_X,
          ACC_Y,
          ACC_Z,
          GYRO_X,
          GYRO_Y,
          GYRO_Z,
          MAG_X,
          MAG_Y,
          MAG_Z,
        });
        // console.log(this.data);
      }
    },
  },
  mounted() {
    this.$ws.openMessageListen(this.getData);
  },
  beforeDestroy() {
    this.$ws.closeMessageListen(this.getData);
  },
};
</script>
  
<style scoped lang="scss">
</style>
  