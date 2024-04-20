/*
 * @Author: urthan urhtan@qq.com
 * @Date: 2024-03-17 10:49:58
 * @LastEditors: urthan
 * @LastEditTime: 2024-03-31 11:44:01
 * @FilePath: \server\protocol.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * @description:
 * Buffer 类是 JavaScript Uint8Array 类的子类,所以接收到buffer类数组元素是uint8类型
 * uint8 0~255, int8 -128~127 [-2^7,2^7-1]
 * 0000 0001:1
 * 1111 1111:-1
 * @param {Number} number
 * @return {Number}
 */
function uint8ToInt8(number) {
  if (typeof number !== "number") return;
  if (number < 2 ** 7) {
    return number;
  } else {
    return number - 2 ** 8;
  }
}

/**
 * @description: uint16 0~65535 [0,2^16-1],  int16 -32768~32767 [-2^15,2^15-1]
 * @param {Number} number
 * @return {Number}
 */
function uint16ToInt16(number) {
  if (typeof number !== "number") return;
  if (number < 2 ** 15) {
    return number;
  } else {
    return number - 2 ** 16;
  }
}
/**
 * @description:
 * @param {Number} number
 * @return {Number}
 */
function int16ToUint16(number) {
  if (typeof number !== "number") return;
  if (number >= 0) {
    return number;
  } else {
    return number + 2 ** 16;
  }
}

/**
 * @description: uint32 0~4,294,967,295 [0,2^32],   int32 -2,147,483,648~2,147,483,647 [-2^31,2^31-1]
 * @param {Number} number
 * @return {Number}
 */
function uint32ToInt32(number) {
  if (typeof number !== "number") return;
  if (number < 2 ** 31) {
    return number;
  } else {
    return number - 2 ** 32;
  }
}

// 解析从串口读取到的数据
function parseData(data) {
  // console.log("开始解析");
  if (!isCheckedSum(data)) return { err: "校验和不通过" }; //判断校验和
  if (data.shift() !== 0xaa || data.shift() !== 0xaa)
    return { err: "帧头不符合" }; //判断帧头
  data.pop(); //弹出校验位
  switch (data.shift()) {
    //飞机姿态等基本信息
    case 0x01: {
      data.shift();
      const ROL = uint16ToInt16((data.shift() << 8) + data.shift()) / 100.0; //横滚角
      const PIT = uint16ToInt16((data.shift() << 8) + data.shift()) / 100.0; //俯仰角
      const YAW = uint16ToInt16((data.shift() << 8) + data.shift()) / 100.0; //偏航角

      //高度cm
      const ALT_USE = uint32ToInt32(
        (data.shift() << 24) +
          (data.shift() << 16) +
          (data.shift() << 8) +
          data.shift()
      );
      const FLY_MODEL = data.shift();
      // u8 ARMED : 0加锁 1解锁
      const ARMED = data.shift();
      return { frame: "STATUS", ROL, PIT, YAW, ALT_USE, FLY_MODEL, ARMED };
    }
    //飞机传感器数据
    case 0x02: {
      data.shift();
      const ACC_X = uint16ToInt16((data.shift() << 8) + data.shift());
      const ACC_Y = uint16ToInt16((data.shift() << 8) + data.shift());
      const ACC_Z = uint16ToInt16((data.shift() << 8) + data.shift());
      const GYRO_X = uint16ToInt16((data.shift() << 8) + data.shift());
      const GYRO_Y = uint16ToInt16((data.shift() << 8) + data.shift());
      const GYRO_Z = uint16ToInt16((data.shift() << 8) + data.shift());
      const MAG_X = uint16ToInt16((data.shift() << 8) + data.shift());
      const MAG_Y = uint16ToInt16((data.shift() << 8) + data.shift());
      const MAG_Z = uint16ToInt16((data.shift() << 8) + data.shift());
      return {
        frame: "SENSER",
        ACC_X,
        ACC_Y,
        ACC_Z,
        GYRO_X,
        GYRO_Y,
        GYRO_Z,
        MAG_X,
        MAG_Y,
        MAG_Z,
      };
    }
    //飞机收到的控制数据
    case 0x03: {
      data.shift();
      const THR = uint16ToInt16((data.shift() << 8) + data.shift());
      const YAW = uint16ToInt16((data.shift() << 8) + data.shift());
      const ROL = uint16ToInt16((data.shift() << 8) + data.shift());
      const PIT = uint16ToInt16((data.shift() << 8) + data.shift());
      const AUX1 = uint16ToInt16((data.shift() << 8) + data.shift());
      const AUX2 = uint16ToInt16((data.shift() << 8) + data.shift());
      const AUX3 = uint16ToInt16((data.shift() << 8) + data.shift());
      const AUX4 = uint16ToInt16((data.shift() << 8) + data.shift());
      const AUX5 = uint16ToInt16((data.shift() << 8) + data.shift());
      const AUX6 = uint16ToInt16((data.shift() << 8) + data.shift());
      return {
        frame: "RCDATA",
        THR,
        YAW,
        ROL,
        PIT,
        AUX1,
        AUX2,
        AUX3,
        AUX4,
        AUX5,
        AUX6,
      };
    }
    //机载GPS 信息
    case 0x04: {
      break;
    }
    // 电压、电流信息
    case 0x05: {
      data.shift();
      const Votage = ((data.shift() << 8) + data.shift()) / 100.0;
      const Current = ((data.shift() << 8) + data.shift()) / 100.0;
      return { frame: "POWER", Votage, Current };
    }
    //SENSER2,高度相关
    case 0x07: {
      data.shift();
      // 推荐单位为cm
      const ALT_BAR = uint32ToInt32(
        (data.shift() << 24) +
          (data.shift() << 16) +
          (data.shift() << 8) +
          data.shift()
      );
      // 超声波高度cm
      const ALT_CSB = (data.shift() << 8) + data.shift();
      return { frame: "SENSER2", ALT_BAR, ALT_CSB };
    }
    //飞行模式
    case 0x0a: {
      data.shift();
      const AUX1_LOW_MODEL = uint8ToInt8(data.shift());
      const AUX1_MID_MODEL = uint8ToInt8(data.shift());
      const AUX1_HIG_MODEL = uint8ToInt8(data.shift());
      const AUX2_LOW_MODEL = uint8ToInt8(data.shift());
      const AUX2_MID_MODEL = uint8ToInt8(data.shift());
      const AUX2_HIG_MODEL = uint8ToInt8(data.shift());
      const AUX3_LOW_MODEL = uint8ToInt8(data.shift());
      const AUX3_MID_MODEL = uint8ToInt8(data.shift());
      const AUX3_HIG_MODEL = uint8ToInt8(data.shift());
      return {
        frame: "FLY_MODEL",
        AUX1_LOW_MODEL,
        AUX1_MID_MODEL,
        AUX1_HIG_MODEL,
        AUX2_LOW_MODEL,
        AUX2_MID_MODEL,
        AUX2_HIG_MODEL,
        AUX3_LOW_MODEL,
        AUX3_MID_MODEL,
        AUX3_HIG_MODEL,
      };
    }
    //PID数据帧1
    case 0x10: {
      return _parsePID(0, "PID1");
    }
    //PID数据帧2
    case 0x11: {
      return _parsePID(1, "PID2");
    }
    //PID数据帧3
    case 0x12: {
      return _parsePID(2, "PID3");
    }
    //PID数据帧4
    case 0x13: {
      return _parsePID(3, "PID4");
    }
    //PID数据帧5
    case 0x14: {
      return _parsePID(4, "PID5");
    }
    //PID数据帧6
    case 0x15: {
      return _parsePID(5, "PID6");
    }
    //CHECK
    case 0xef: {
      data.shift();
      const FRAME_HEAD = data.shift();
      const CHECK_SUM = data.shift();
      return { frame: "CHECK", FRAME_HEAD, CHECK_SUM };
    }
    default: {
      return { err: "功能字不匹配" };
    }
  }
  // 私有函数，解析PID
  function _parsePID(idx, frame) {
    data.shift();
    const PID = {};
    PID[idx * 3 + 1] = {
      P: uint16ToInt16((data.shift() << 8) + data.shift()),
      I: uint16ToInt16((data.shift() << 8) + data.shift()),
      D: uint16ToInt16((data.shift() << 8) + data.shift()),
    };
    PID[idx * 3 + 2] = {
      P: uint16ToInt16((data.shift() << 8) + data.shift()),
      I: uint16ToInt16((data.shift() << 8) + data.shift()),
      D: uint16ToInt16((data.shift() << 8) + data.shift()),
    };
    PID[idx * 3 + 3] = {
      P: uint16ToInt16((data.shift() << 8) + data.shift()),
      I: uint16ToInt16((data.shift() << 8) + data.shift()),
      D: uint16ToInt16((data.shift() << 8) + data.shift()),
    };
    return { frame, PID };
  }
}
// 计算校验和
function getCheckSum(buffer) {
  let sc = 0;
  for (let i = 0; i < buffer.length; i++) {
    sc += buffer[i];
  }
  return sc & 0xff;
}
function isCheckedSum(buffer) {
  let sc = 0;
  for (let i = 0; i < buffer.length - 1; i++) {
    sc += buffer[i];
  }
  sc &= 0xff;
  return sc === buffer[buffer.length - 1];
}

/**
 * @description:
 * "命令集合2(十六进制0x)
 * 01：读取PID请求（返回AAAA 10\11\12\13\14\15数据帧）
 * 02：读取飞行模式设置请求（返回AAAA 0A数据帧）
 * 21：读取飞控内航点数量（返回AAAA 20数据帧）
 * 30：读取无线定位模块设置
 * 40：读取数传模块设置
 * 50：读取光流模块设置
 * A0：读取下位机版本信息（返回AAAA 00数据帧）
 * A1：恢复默认参数"
 * @param {number} cmd2
 * @return {*}
 */
function getAckBuffer(cmd2) {
  const buf = [];
  buf.push(0xaa, 0xaf, 0x02, 1, cmd2);
  const sc = getCheckSum(buf);
  buf.push(sc);
  return {
    buffer: Buffer.from(buf),
    FRAME_HEAD: 0x02,
    CHECK_SUM: sc,
    reSendCount: 0,
    lastSendTime: Date.now(),
  };
}

function getPIDBuffer(PID, idx) {
  const buf = [];
  // 功能字，16进制
  const gnz = parseInt(`0x1${idx}`, 16);
  buf.push(0xaa, 0xaf, gnz, 18);
  let i = 1;
  while (i <= 3) {
    let byte0, byte1;
    let { P, I, D } = PID[idx * 3 + i];
    byte0 = (int16ToUint16(P) >> 8) & 0xff;
    byte1 = int16ToUint16(P) & 0xff;
    buf.push(byte0, byte1);
    byte0 = (int16ToUint16(I) >> 8) & 0xff;
    byte1 = int16ToUint16(I) & 0xff;
    buf.push(byte0, byte1);
    byte0 = (int16ToUint16(D) >> 8) & 0xff;
    byte1 = int16ToUint16(D) & 0xff;
    buf.push(byte0, byte1);
    i++;
  }
  let sc = getCheckSum(buf);
  buf.push(sc);
  return {
    buffer: Buffer.from(buf),
    FRAME_HEAD: gnz,
    CHECK_SUM: sc,
    reSendCount: 0,
    lastSendTime: Date.now(),
  };
}
export { parseData, getAckBuffer, getPIDBuffer };
