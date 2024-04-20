/*
 * @Author: urthan urhtan@qq.com
 * @Date: 2024-03-10 20:13:23
 * @LastEditors: urthan
 * @LastEditTime: 2024-03-31 14:54:42
 * @FilePath: \server\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { WebSocketServer } from "ws";
import { CreateSocket } from "./socket.js";
// 声明一个空的socket对象
let socket = {};
const server = new WebSocketServer({
  port: 3000,
});
const init = () => {
  bindEvent();
};
function bindEvent() {
  server.on("open", handleOpen);
  server.on("error", handleError);
  server.on("close", handleClose);
  server.on("connection", handleConnection);
  // 服务器启动成功的回调函数
  server.on("listening", () => {
    console.log("listening");
  });
}
function handleOpen() {
  console.log("BE:websocket open");
}
function handleError() {
  console.log("BE:websocket error");
}
function handleClose() {
  // socket连断断开，如果串口没有关闭则自动关闭
  if (socket?.port) {
    socket.closeSerialPort();
  }
  console.log("BE:websocket close");
}

// 处理连接事件的回调函数，回调函数参数是客户端对象
function handleConnection(client) {
  //接收客户端发来消息
  client.on("message", handleMessage);
  // 发送数据给客户端
  client.send(data);
  // 关闭客户端
  // client.close();
}

// 处理客户端发来消息的回调函数,此函数由handleConnection函数里的client对象调用,this是客户端对象
function handleMessage(msg) {
  //  进行行相应处理
}
// 初始化
init();
