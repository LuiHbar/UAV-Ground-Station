<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.$ws.openListener(() => {
      console.log("websocket open");
      this.$ws.state = WebSocket.OPEN;
    });
    this.$ws.errorListener(() => {
      console.log("websocket error");
    });
    this.$ws.closeListener(() => {
      console.log("websocket close");
      this.$ws.state = WebSocket.CLOSED;
    });
    this.$ws.openMessageListen((e) => {
      const data = JSON.parse(e.data);
      // code 为0，则不打印
      if (data.code && data.code !== 11 && data.code !== 31) console.log(data);
      // console.log(JSON.parse(e.data));
    });
  },
  beforeDestroy() {
    // 销毁页面前关闭socket连接
    this.$ws.close();
  },
};
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
}
</style>
