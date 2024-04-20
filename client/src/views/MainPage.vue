<template>
  <div>
    <el-container>
      <el-header id="head">
        <span>无人机上位机</span>
        <div class="com">
          <span>COM：</span>
          <el-select v-model="pathVal" placeholder="端口选择">
            <el-option
              v-for="item in pathArr"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button :type="linklabel" @click="LinkCom(pathVal)">
            {{ linkState ? "关闭连接" : "打开连接" }}
          </el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="125px">
          <CommonAside />
        </el-aside>
        <el-main>
          <keep-alive include="data-waveform">
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
      <!-- <el-footer>Footer</el-footer> -->
    </el-container>
  </div>
</template>
<script>
import CommonAside from "../components/CommomAside";
export default {
  data() {
    return {
      pathArr: [], // 串口号
      pathVal: "",
      baudRate: 500000,
      linkState: false,
    };
  },
  computed: {
    linklabel: {
      get() {
        if (this.linkState) {
          return "success";
        } else {
          return "primary";
        }
      },
    },
  },

  components: {
    CommonAside,
    // TelescopicBox,
  },

  methods: {
    LinkCom(value) {
      if (value) {
        this.linkState = !this.linkState;
        this.$ws.send({
          code: this.linkState ? 1 : 0,
          data: {
            path: this.pathVal,
            baudRate: this.baudRate,
          },
        });
      }
    },
    getData(e) {
      // console.log("收到服务器响应的消息");
      const msg = JSON.parse(e.data);
      if (msg.code === 0) {
        this.pathArr = msg.data;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$ws) {
        this.$ws.send({ code: 0 });
      }

      this.$ws.openMessageListen(this.getData);
    });
  },
  beforeDestroy() {
    this.$ws.closeMessageListen(this.getData);
  },
};
</script>
<style lang="less" scoped>
.el-header,
.el-footer {
  background-color: #bab9ac;
  color: #fff;
  text-align: center;
  line-height: 60px;
  height: 2vh;
}

.el-aside {
  /* background-color: #d3dce6; */
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  /* background-color: #e9eef3; */
  color: #333;
  text-align: center;
  line-height: 160px;
}
.el-col-12 {
  width: 100%;
}
#head {
  display: flex;
  justify-content: space-between;
}
</style>