/*
 * @Author: urthan
 * @Date: 2024-03-13 22:21:10
 * @LastEditors: urthan
 * @LastEditTime: 2024-03-31 15:14:02
 * @FilePath: \server\socket.js
 * @Description:
 *
 */
import { createMessage } from "./utils/createMessage.js";
import { CreateSerialPort } from "./serial-port.js";
import { parseData, getAckBuffer, getPIDBuffer } from "./protocol.js";
import { throttle } from "./utils/throttle.js";

class CreateSocket {
  constructor(client) {
    this.client = client;
    this.port = null;
    this.cmd = {
      isSendBuffer: false,
      isSendStatus: false,
      isSendSenser: true,
      // isReadPID: false,
    };
    this.ackFlag = [];
    this.timer = null;
  }
  async sendSerialPortPath() {
    let paths = await CreateSerialPort.getPortPath();
    this.client.send(createMessage(paths, 0));
  }
  /**
   * @description:打开串口
   * @param {String} path
   * @param {Number} baudRate
   * @return {void}
   */
  async openSerialPort({ path, baudRate }) {
    let paths = await CreateSerialPort.getPortPath();
    if (paths.includes(path)) {
      // 打开串口，并且监听串口数据
      this.port = new CreateSerialPort({ path, baudRate });
      let receiveData = receiveDataPre(this);
      // 节流
      this.port.read(throttle(receiveData, 10));
      //定时器轮询检测是否收到需要重发
      setInterval(() => {
        if (this.port === null) return;
        if (this.ackFlag.length) {
          this.ackFlag.forEach((ack, index) => {
            // 设置重发次数为3
            if (ack.reSendCount < 3) {
              let now = Date.now();
              if (now - ack.lastSendTime > 1000) {
                this.port.write(ack.buffer);
                ack.reSendCount++;
                ack.lastSendTime = Date.now();
              }
            } else {
              console.log(ack.buffer, "没有收到返回校验,已重发3次");
              this.ackFlag.splice(index, 1);
            }
          });
        }
      }, 500);
    } else {
      console.error("串口号错误，无法打开");
    }
  }
  writeBuffer(arr) {
    let buf = Buffer.from(arr);
    this.port.write(buf);
  }
  openSendBuffer() {
    this.cmd.isSendBuffer = true;
  }
  closeSendBuffer() {
    this.cmd.isSendBuffer = false;
  }
  /**
   * @description: 关闭串口
   * @return {*}
   */
  closeSerialPort() {
    if (this.port?.state === "open") this.port.close();
    this.port = null;
  }
  /**
   * @description: 发送姿态信息
   * @return {*}
   */
  openSendStatus() {
    this.cmd.isSendStatus = true;
    this.cmd.isSendSenser = true;
  }
  closeSendStatus() {
    this.cmd.isSendStatus = false;
    this.cmd.isSendSenser = false;
  }

  /**
   * @description: 读取PID
   * @return {*}
   */
  readPID() {
    if (this.port !== null && this.port.state === "open") {
      let ack = getAckBuffer(0x01);
      // console.log('帧头'+FRAME_HEAD,'校验和'+CHECK_SUM);
      this.ackFlag.forEach((val, index) => {
        if (
          val.FRAME_HEAD === ack.FRAME_HEAD &&
          val.CHECK_SUM === ack.CHECK_SUM
        ) {
          return;
        }
      });
      this.port.write(ack.buffer);
      this.ackFlag.push(ack);
    }
  }
  /**
   * @description: 写入PID
   * @return {*}
   */
  writePID(data) {
    if (this.port?.state === "open") {
      let PID = {};
      this.ackFlag.forEach((val, index) => {
        if (val.FRAME_HEAD >= 0x10 && val.FRAME_HEAD < 0x15) {
          return;
        }
      });
      for (let idx = 0; idx < 6; idx++) {
        PID[idx * 3 + 1] = data[idx * 3 + 1];
        PID[idx * 3 + 2] = data[idx * 3 + 2];
        PID[idx * 3 + 3] = data[idx * 3 + 3];
        let PIDbufObj = getPIDBuffer(PID, idx);
        setTimeout(() => {
          console.log("发送", PIDbufObj.buffer);
          this.port.write(PIDbufObj.buffer);
          this.ackFlag.push(PIDbufObj);
        }, 300);
      }
    }
  }
  /**
   * @description: 接收预处理函数
   * @return {Function}
   */
}
function receiveDataPre(socket) {
  // 闭包函数，用于储存状态机的状态，及已接收到的Buffer数据
  let RxBuffer = [];
  let dataLength = 0;
  let state = 0;
  return function (buf) {
    let arr = [];
    // console.log(buf);
    for (let i = 0; i < buf.length; i++) {
      if (state === 0 && buf[i] === 0xaa) {
        state = 1;
        RxBuffer.push(buf[i]);
      } else if (state === 1 && buf[i] === 0xaa) {
        state = 2;
        RxBuffer.push(buf[i]);
      } else if (state === 2 && buf[i] < 0xfb) {
        state = 3;
        RxBuffer.push(buf[i]);
      } else if (state === 3 && buf[i] > 0) {
        state = 4;
        RxBuffer.push(buf[i]);
        dataLength = buf[i];
      } else if (state === 4 && dataLength > 0) {
        dataLength--;
        RxBuffer.push(buf[i]);
        if (dataLength === 0) {
          state = 5;
        }
      } else if (state === 5) {
        RxBuffer.push(buf[i]);
        // 分割线
        let unParsedData = [...RxBuffer];
        // console.log(RxBuffer);
        // 调用(协议)数据解析函数
        let parsedData = parseData(RxBuffer);
        console.log(Buffer.from(unParsedData), "Rx");
        // console.log(parsedData);

        // 解析后数据处理
        handleParsedData(parsedData, socket);
        //分割线
        state = 0;
        RxBuffer = [];
      } else {
        state = 0;
        RxBuffer = [];
      }
      arr.push(buf[i]);
    }
    if (socket.cmd.isSendBuffer) {
      socket.client.send(createMessage(arr, 11));
    }
    arr = [];
  };
}
function handleParsedData(parsedData, socket) {
  if (socket.cmd?.isSendStatus) {
    if (parsedData?.frame === "STATUS") {
      socket.client.send(createMessage(parsedData, 31));
      // console.log("isSendStatus");
    }
  }
  if (socket.cmd?.isSendSenser) {
    // console.log(111, parsedData);

    if (parsedData?.frame === "SENSER") {
      socket.client.send(createMessage(parsedData, 31));
      // console.log("isSendSenser");
    }
  }
  if (parsedData?.frame === "CHECK") {
    socket.ackFlag.forEach((ack, index) => {
      if (ack.FRAME_HEAD === parsedData.FRAME_HEAD) {
        if (ack.CHECK_SUM === parsedData.CHECK_SUM) {
          // return index;
          socket.ackFlag.splice(index, 1);
          // console.log(socket.ackFlag);
          switch (ack.FRAME_HEAD) {
            case 0x10:
            case 0x11:
            case 0x12:
            case 0x13:
            case 0x14:
            case 0x15:
              socket.client.send(
                createMessage("写入PID数据帧" + (ack.FRAME_HEAD - 15), 41)
              );
          }
          return;
        }
      }
    });
  }
  if (parsedData?.frame?.includes("PID")) {
    socket.client.send(createMessage(parsedData, 32));
  }
}
export { CreateSocket };
