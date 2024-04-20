/*
 * @Author: urthan
 * @Date: 2024-03-10 20:41:39
 * @LastEditors: urthan
 * @LastEditTime: 2024-03-31 15:08:15
 * @FilePath: \server\serial-port.js
 * @Description:
 *
 */
import { SerialPort } from "serialport";
class CreateSerialPort {
  constructor({ path, baudRate }) {
    this.path = path;
    this.boudRate = baudRate;
    this.port = new SerialPort({ path, baudRate });
    this.state = "open";
  }
  /**
   * @description:
   * @return {String}
   */
  static async getPortPath() {
    const ports = await SerialPort.list();
    const paths = ports.map((port) => {
      return port.path;
    });
    return paths;
  }

  write(data) {
    if (this.state == "open") {
      this.port.write(data);
    }
  }
  /**
   * @description:
   * @param {Function} callback
   * @return {*}
   */
  read(callback) {
    this.port.on("data", callback);
  }
  close() {
    this.state = "close";
    this.port.close();
  }
}
export { CreateSerialPort };
