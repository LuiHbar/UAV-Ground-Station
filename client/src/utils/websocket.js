const ws_URL = "ws:localhost:3000";
class CreatSocket {
  constructor(url = ws_URL) {
    this.url = url;
    this.socket = new WebSocket(url);
    this.listeners = [];
    this.state = this.socket.readyState;
  }
  // 监听websocket打开
  openListener(callback) {
    this.socket.onopen = callback;
  }
  closeListener(callback) {
    this.socket.addEventListener("close", callback);
  }
  errorListener(callback) {
    this.socket.onerror = callback;
  }
  // 监听服务端发来消息
  openMessageListen(callback) {
    this.listeners.push(callback);
    // this.listeners.forEach((listener) => {
    //   this.socket.addEventListener("message", listener);
    // });
    this.socket.addEventListener("message", callback);
  }
  closeMessageListen(callback) {
    this.listeners.forEach((fn, index, listeners) => {
      if (fn === callback) {
        this.socket.removeEventListener("message", fn);
        listeners.splice(index, 1);
        return;
      }
    });
  }
  send(msg) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(msg));
    } else {
      console.log("websocket不是连接状态");
    }
  }
  close() {
    this.socket.close();
  }
  reset(url) {
    this.socket = new WebSocket(url);
  }
}
export default CreatSocket;
