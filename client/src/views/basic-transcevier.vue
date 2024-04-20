<!--
 * @Author: urthan urhtan@qq.com
 * @Date: 2024-03-06 10:06:10
 * @LastEditors: urthan urhtan@qq.com
 * @LastEditTime: 2024-03-20 14:38:46
 * @FilePath: \client\src\views\basic-transcevier.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="basic">
    <div class="flex">
      <el-input
        type="textarea"
        v-model="textarea"
        resize="horizontal"
        placeholder="接收区"
        max="70vw"
      >
      </el-input>
      <el-input
        type="textarea"
        v-model="inputarea"
        placeholder="发送区"
        resize="horizontal"
      >
      </el-input>
    </div>

    <el-row class="control">
      <el-button @click="clearOutput" type="info" plain>清空</el-button>
      <el-button @click="send" type="info" plain>发送</el-button>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      textarea: "",
      inputarea: "",
      isShow: true,
    };
  },
  methods: {
    clearOutput() {
      this.textarea = "";
    },
    send() {
      if (this.$ws.state === WebSocket.OPEN) {
        const data = this.inputarea.toString();
        this.$ws.send({ data, code: 21 });
        this.inputarea = "";
      } else {
        console.log(this.$ws.state);
        console.log("发送失败");
      }
    },
    getData(e) {
      const msg = JSON.parse(e.data);
      if (msg.code === 11) {
        // msg.data
        let buf = msg.data;
        let str = "";
        for (let i = 0; i < buf.length; i++) {
          str +=
            (buf[i] >>> 4).toString(16) + (buf[i] & 0xf).toString(16) + " ";
        }
        if (this.isShow) {
          this.textarea += str.toUpperCase();
        }
      }
    },
  },
  mounted() {
    // openMessageListen
    this.$ws.openMessageListen(this.getData);
    this.$ws.send({ code: 11 });
  },
  beforeDestroy() {
    this.$ws.send({ code: 10 });
    this.$ws.closeMessageListen(this.getData);
  },
};
</script>
<style lang="less">
.el-textarea__inner {
  height: 70vh;
}
.control {
  // height: 10vh;
  margin-top: 10px;
  display: flex;
  justify-content: left;
}
.flex {
  display: flex;
  justify-content: space-around;
}
</style>