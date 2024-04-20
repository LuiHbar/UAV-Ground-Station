/*
 * @Author: urthan
 * @Date: 2024-03-10 20:45:21
 * @LastEditors: urthan
 * @LastEditTime: 2024-03-31 13:59:02
 * @FilePath: \server\utils\createMessage.js
 * @Description:
 *
 */
/**
 * 创建信息
 *
 * 0  —— 关闭串口/获取串口号
 * 1  —— 连接串口
 *
 * 11 —— 发送串口数据
 *
 * 21 —— 写入串口数据
 * 22 —— 接收前端的 PID 数据写入
 * 23 —— 接受前端的 PID 数据读取请求
 *
 * 31 —— 发送姿态/传感等信息给前端
 * 32 —— 发送 PID 数据给前端
 * 
 * 41 —— 读取PID成功
 * @param {any} data
 * @param {Number} code
 */
function createMessage(data, code) {
  const result = { data, code };
  return JSON.stringify(result);
}
export { createMessage };
