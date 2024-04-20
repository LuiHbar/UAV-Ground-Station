<template>
  <div>
    <div class="echar" ref="charts"></div>
    <div class="setup">
      <el-button @click="clearData">清空缓存</el-button>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "data-waveform",

  data() {
    return {
      chartInstance: null,
      count: 0, // 初始次数
      keys: [
        "ACC_X",
        "ACC_Y",
        "ACC_Z",
        "GYRO_X",
        "GYRO_Y",
        "GYRO_Z",
        "MAG_X",
        "MAG_Y",
        "MAG_Z",
        "ROL",
        "PIT",
        "YAW",
        "ALT_USE",
        "ALT_BAR",
        "ALT_CSB",
      ],

      data: {
        ACC_X: [],
        ACC_Y: [],
        ACC_Z: [],
        GYRO_X: [],
        GYRO_Y: [],
        GYRO_Z: [],
        MAG_X: [],
        MAG_Y: [],
        MAG_Z: [],
        ROL: [],
        PIT: [],
        YAW: [],
        ALT_USE: [],
        ALT_BAR: [],
        ALT_CSB: [],
      },
      startValue: 0,
      endValue: 20,
      showWidth: 50,
    };
  },
  computed: {
    option() {
      return {
        animation: false,
        tooltip: {
          trigger: "axis",
          showDelay: 0,
        },
        //图例
        legend: {
          data: this.keys,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
          tooltip: {
            show: true,
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        tooltip: {
          trigger: "axis",
          showDelay: 0,
          axisPointer: {
            type: "cross",
          },
        },
        xAxis: {
          type: "value",
          axisLine: {
            show: true,
          },
          axisTick: {
            show: true,
          },
          minInterval: 1,
          minorTick: {
            show: true,
          },
          minorSplitLine: {
            show: true,
          },
        },
        yAxis: {
          type: "value",
          // min: -100,
          // max: 100,
          minorTick: {
            show: true,
          },
          minorSplitLine: {
            show: true,
          },
        },
        minorSplitLine: {
          show: true,
        },
        series: this.keys.map((key) => {
          return {
            name: key,
            type: "line",
            data: this.data[key],
            clip: true,
          };
        }),
        dataZoom: [
          {
            show: true,
            // type: "inside",
            filterMode: "none",
            xAxisIndex: [0],
            startValue: this.startValue,
            endValue: this.endValue,
          },
          {
            show: true,
            type: "inside",
            filterMode: "none",
            yAxisIndex: [0],
            // startValue: 8000,
            // endValue: 9000,
          },
        ],
      };
    },
  },

  methods: {
    // 初始化echarts实例
    initChart() {
      this.chartInstance = echarts.init(this.$refs.charts);
      this.chartInstance.setOption(this.option);
    },
    // 获取数据
    getData(e) {
      const msg = JSON.parse(e.data);
      if (msg.code === 31) {
        this.count++;
        if (msg.data.frame === "STATUS") {
          let { ROL, PIT, YAW, ALT_USE } = msg.data;
          this.data["ROL"].push([this.count, ROL]);
          this.data["PIT"].push([this.count, PIT]);
          this.data["YAW"].push([this.count, YAW]);
          this.data["ALT_USE"].push([this.count, ALT_USE]);
          // this.data[""].push([this.data[""].length],);
        }
        if (msg.data.frame === "SENSER") {
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
          } = msg.data;
          this.data["ACC_X"].push([this.count, ACC_X]);
          this.data["ACC_Y"].push([this.count, ACC_Y]);
          this.data["ACC_Z"].push([this.count, ACC_Z]);
          this.data["GYRO_X"].push([this.count, GYRO_X]);
          this.data["GYRO_Y"].push([this.count, GYRO_Y]);
          this.data["GYRO_Z"].push([this.count, GYRO_Z]);
          this.data["MAG_X"].push([this.count, MAG_X]);
          this.data["MAG_Y"].push([this.count, MAG_Y]);
          this.data["MAG_Z"].push([this.count, MAG_Z]);
          console.log(MAG_X, MAG_Y);
        }
        if (msg.data.frame === "SENSER2") {
          const { ALT_BAR, ALT_CSB } = msg.data;
          this.data["ALT_BAR"].push([this.count, ALT_BAR]);
          this.data["ALT_CSB"].push([this.count, ALT_CSB]);
        }
      }
      if (this.count > this.showWidth) {
        this.startValue++;
        this.endValue++;
      }
      this.updateChart();
    },
    updateChart() {
      this.chartInstance.setOption(this.option);
    },
    clearData() {
      this.data = {
        ACC_X: [],
        ACC_Y: [],
        ACC_Z: [],
        GYRO_X: [],
        GYRO_Y: [],
        GYRO_Z: [],
        MAG_X: [],
        MAG_Y: [],
        MAG_Z: [],
        ROL: [],
        PIT: [],
        YAW: [],
        ALT_USE: [],
        ALT_BAR: [],
        ALT_CSB: [],
      };
      this.count = 0;
      this.updateChart();
    },
  },
  mounted() {
    this.$ws.openMessageListen(this.getData);
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    this.$ws.closeMessageListen(this.getData);
  },
};
</script>
<style sccoped>
.echar {
  width: 85vw;
  height: 80vh;
}
.setup {
  padding: 0;
  margin: 0;
  line-height: 0;
}
</style>