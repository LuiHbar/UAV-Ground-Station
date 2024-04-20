<template>
  <div>
    <el-divider content-position="left">
      <el-tag type="info">PID设置</el-tag>
    </el-divider>
    <div class="PID">
      <el-table :data="tableData1" class="table" size="mini">
        <el-table-column>
          <template slot-scope="scope">
            {{ scope.row.text }}
          </template>
        </el-table-column>
        <el-table-column label="P" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.P"
              controls-position="right"
              @change="handleChange"
              size="mini"
            >
            </el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="I" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.I"
              controls-position="right"
              @change="handleChange"
              size="mini"
            >
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="D" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.D"
              controls-position="right"
              @change="handleChange"
              size="mini"
            >
            </el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData2" class="table" size="mini">
        <el-table-column>
          <template slot-scope="scope">
            {{ scope.row.text }}
          </template>
        </el-table-column>
        <el-table-column label="P" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.P"
              controls-position="right"
              @change="handleChange"
              size="mini"
            >
            </el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="I" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.I"
              controls-position="right"
              @change="handleChange"
              size="mini"
            >
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="D" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.D"
              controls-position="right"
              @change="handleChange"
              size="mini"
            >
            </el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData3" class="table" size="mini">
        <el-table-column>
          <template slot-scope="scope">
            {{ scope.row.text }}
          </template>
        </el-table-column>
        <el-table-column label="P" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.P"
              controls-position="right"
              @change="handleChange"
              size="mini"
            >
            </el-input-number>
          </template>
        </el-table-column>

        <el-table-column label="I" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.I"
              controls-position="right"
              @change="handleChange"
              size="mini"
            >
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="D" align="center">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.D"
              controls-position="right"
              @change="handleChange"
              size="mini"
            >
            </el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="PIDset">
      <el-button type="primary" icon="el-icon-upload2" @click="readPID"
        >读取PID</el-button
      >
      <el-button type="success" icon="el-icon-download" @click="writePID"
        >写入PID</el-button
      >
      <el-button icon="el-icon-refresh" @click="resetPID">恢复默认</el-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.PID {
  display: flex;
}
/deep/.is-leaf {
  height: 20px;
}
</style>
<script>
export default {
  data() {
    return {
      tableData1: [
        { index: 1, text: "ROL", P: 0, I: 0, D: 0 },
        { index: 2, text: "PIT", P: 0, I: 0, D: 0 },
        { index: 3, text: "YAW", P: 0, I: 0, D: 0 },
        { index: 4, text: "自稳ROL", P: 0, I: 0, D: 0 },
        { index: 5, text: "自稳PIT", P: 0, I: 0, D: 0 },
        { index: 6, text: "自稳YAW", P: 0, I: 0, D: 0 },
      ],
      tableData2: [
        { index: 7, text: "高度速率", P: 0, I: 0, D: 0 },
        { index: 8, text: "高度保持", P: 0, I: 0, D: 0 },
        { index: 9, text: "位置速率", P: 0, I: 0, D: 0 },
        { index: 10, text: "位置保持", P: 0, I: 0, D: 0 },
        { index: 11, text: "PID11", P: 0, I: 0, D: 0 },
        { index: 12, text: "PID12", P: 0, I: 0, D: 0 },
      ],
      tableData3: [
        { index: 13, text: "PID13", P: 0, I: 0, D: 0 },
        { index: 14, text: "PID14", P: 0, I: 0, D: 0 },
        { index: 15, text: "PID15", P: 0, I: 0, D: 0 },
        { index: 16, text: "PID16", P: 0, I: 0, D: 0 },
        { index: 17, text: "PID17", P: 0, I: 0, D: 0 },
        { index: 18, text: "PID18", P: 0, I: 0, D: 0 },
      ],
    };
  },
  methods: {
    handleChange(value) {
      // console.log(value);
    },
    readPID() {
      this.$ws.send({ code: 23 });
    },
    writePID() {
      let PID = {};
      this.tableData1.forEach((item) => {
        let { P, I, D } = item;
        PID[item.index] = {
          P,
          I,
          D,
        };
      });
      this.tableData2.forEach((item) => {
        let { P, I, D } = item;
        PID[item.index] = {
          P,
          I,
          D,
        };
      });
      this.tableData3.forEach((item) => {
        let { P, I, D } = item;
        PID[item.index] = {
          P,
          I,
          D,
        };
      });
      let msg = { data: PID, code: 22 };
      this.$ws.send(msg);
      console.log("写入成功");
    },
    resetPID() {
      this.tableData1.forEach((e) => {
        e.P = 0;
        e.I = 0;
        e.D = 0;
      });
      this.tableData2.forEach((e) => {
        e.P = 0;
        e.I = 0;
        e.D = 0;
      });
      this.tableData3.forEach((e) => {
        e.P = 0;
        e.I = 0;
        e.D = 0;
      });
    },
    PIDListener(e) {
      let keys = [];
      const msg = JSON.parse(e.data);
      if (msg.code === 32) {
        keys = Object.keys(msg.data.PID);
        switch (msg.data.frame) {
          case "PID1":
          case "PID2":
            {
              keys.forEach((key) => {
                this.tableData1.forEach((item) => {
                  if (item.index == key) {
                    item.P = msg.data.PID[key].P;
                    item.I = msg.data.PID[key].I;
                    item.D = msg.data.PID[key].D;
                  }
                });
              });
            }
            break;
          case "PID3":
          case "PID4":
            {
              keys.forEach((key) => {
                this.tableData2.forEach((item) => {
                  if (item.index == key) {
                    item.P = msg.data.PID[key].P;
                    item.I = msg.data.PID[key].I;
                    item.D = msg.data.PID[key].D;
                  }
                });
              });
            }
            break;
          case "PID5":
          case "PID6":
            {
              keys.forEach((key) => {
                this.tableData1.forEach((item) => {
                  if (item.index == key) {
                    item.P = msg.data.PID[key].P;
                    item.I = msg.data.PID[key].I;
                    item.D = msg.data.PID[key].D;
                  }
                });
              });
            }
            break;
        }
        this.$message({
          message: "读取" + msg.data.frame + "成功",
          type: "success",
        });
      }
      if (msg.code === 41) {
        let message = msg.data;
        this.$message({
          message,
          type: "success",
        });
      }
    },
  },
  mounted() {
    this.$ws.openMessageListen(this.PIDListener);
  },
  beforeDestroy() {
    this.$ws.closeMessageListen(this.PIDListener);
  },
};
</script>