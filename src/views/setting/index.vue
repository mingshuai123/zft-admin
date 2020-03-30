<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">平台设置</div>
    </div>
    <div class="mytaskitem">
      <el-form ref="form" :model="pageData" label-width="150px">
        <el-form-item label="派单开关">
          <el-switch
            v-model="pageData.orderSwitch"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="setorderSwitch"
          ></el-switch>
        </el-form-item>
        <!-- <el-form-item label="代理邀请码" :inline="true">
          <el-col :span="6">
            <el-input v-model="pageData.inviteCode"></el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-button type="primary" @click="setinvite">重新生成</el-button>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item label="接单过期时间">
          <el-col :span="6">
            <el-input v-model="pageData.orderTimeoutMinutes"></el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-button type="primary" @click="settimeout">设置时间</el-button>
          </el-col>
        </el-form-item> -->
        <el-form-item label="定时开关">
          <el-switch
            v-model="pageData.csState"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="csStateSwitch"
          ></el-switch>
        </el-form-item>
        <el-form-item label="接单时间定时">
          <el-time-picker v-model="pageData.csStartTime" placeholder="选择时间范围"></el-time-picker>至
          <el-time-picker v-model="pageData.csEndTime" placeholder="选择时间范围"></el-time-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="page-title">
      <div class="left">充值设置</div>
    </div>
    <div class="mytaskitem">
      <el-form ref="form" :model="pageData" label-width="150px">
         <el-form-item label="充值开关">
          <el-switch
            v-model="pageData.chargeMainState"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="chargemain"
          ></el-switch>
        </el-form-item>
        <el-form-item label="定时开关">
          <el-switch
            v-model="pageData.chargeState"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="csStateSwitch2"
          ></el-switch>
        </el-form-item>
        <el-form-item label="接单时间定时">
          <el-time-picker v-model="pageData.chargeStartTime" placeholder="选择时间范围"></el-time-picker>至
          <el-time-picker v-model="pageData.chargeEndTime" placeholder="选择时间范围"></el-time-picker>
        </el-form-item>
      </el-form>
    </div>
     <div class="page-title">
      <div class="left">接单设置</div>
    </div>
    <div class="mytaskitem">
      <el-form ref="form" :model="pageData" label-width="150px">
        <el-form-item label="接单过期时间">
          <el-col :span="6">
            <el-input v-model="pageData.orderTimeoutMinutes">
              <template slot="append">分钟</template>
            </el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-button type="primary" @click="settimeout">设置时间</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mytask",
  data() {
    return {
      pageData: {
        orderSwitch: 0,
        inviteCode: "",
        orderTimeoutMinutes: 0,
        chargeMainState:0,
        csState: 0,
        csStartTime: "",
        csEndTime: "",
        chargeState: 0,
        chargeStartTime: "",
        chargeEndTime: ""
      }
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.postAxios("admin/setting/info").then(res => {
        var data = {};
        var ress = res.data;
        data = ress;
        data.orderSwitch = Boolean(ress.orderSwitch);
        data.chargeMainState = Boolean(ress.chargeMainState);
        data.csState = String(ress.csState);
        data.chargeState = String(ress.chargeState);
        data.csStartTime = new Date(
          2019,
          12,
          4,
          ress.csStartTime[0],
          ress.csStartTime[1]
        );
        data.csEndTime = new Date(
          2019,
          12,
          4,
          ress.csEndTime[0],
          ress.csEndTime[1]
        );
        data.chargeStartTime = new Date(
          2019,
          12,
          4,
          ress.chargeStartTime[0],
          ress.chargeStartTime[1]
        );
        data.chargeEndTime = new Date(
          2019,
          12,
          4,
          ress.chargeEndTime[0],
          ress.chargeEndTime[1]
        );
        this.pageData = data;
      });
    },
    chargemain(){
      var _this = this;
      var data = { type: "chargemain", value: this.pageData.chargeMainState };
      this.postAxios("admin/setting/handler", data).then(res => {
        if (res.code == 0) {
          _this.$message({
            duration: 2000,
            type: "success",
            message: "设置成功",
            onClose: function() {
              _this.getInfo();
            }
          });
        }
      });
    },
    setorderSwitch() {
      var _this = this;
      var data = { type: "switch", value: this.pageData.orderSwitch };
      this.postAxios("admin/setting/handler", data).then(res => {
        if (res.code == 0) {
          _this.$message({
            duration: 2000,
            type: "success",
            message: "设置成功",
            onClose: function() {
              _this.getInfo();
            }
          });
        }
      });
    },
    csStateSwitch() {
      var _this = this;
      var data = {
        type: "cs",
        value: this.pageData.csState,
        start: this.getdate(this.pageData.csStartTime),
        end: this.getdate(this.pageData.csEndTime)
      };
      console.log(data);
      // return false;
      // var url="admin/setting/handler?type=cs&value="+this.pageData.csState+"&start="+this.getdate(this.pageData.csStartTime)+"&end="+this.getdate(this.pageData.csEndTime)
      this.postAxios("admin/setting/handler", data).then(res => {
        // this.postAxios2(url,{},{} ).then(res => {
        if (res.code == 0) {
          _this.$message({
            duration: 2000,
            type: "success",
            message: "设置成功",
            onClose: function() {
              _this.getInfo();
            }
          });
        }
      });
    },
    csStateSwitch2() {
      var _this = this;
      var data = {
        type: "charge",
        value: this.pageData.chargeState,
        start: this.getdate(this.pageData.chargeStartTime),
        end: this.getdate(this.pageData.chargeEndTime)
      };
      console.log(data);
      // return false;
      // var url="admin/setting/handler?type=cs&value="+this.pageData.csState+"&start="+this.getdate(this.pageData.csStartTime)+"&end="+this.getdate(this.pageData.csEndTime)
      this.postAxios("admin/setting/handler", data).then(res => {
        // this.postAxios2(url,{},{} ).then(res => {
        if (res.code == 0) {
          _this.$message({
            duration: 2000,
            type: "success",
            message: "设置成功",
            onClose: function() {
              _this.getInfo();
            }
          });
        }
      });
    },
    getdate(d) {
      var h = new Date(d).getHours();
      var m = new Date(d).getMinutes();
      var date = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
      return date;
    },
    setinvite() {
      var _this = this;
      var data = { type: "invite", value: this.pageData.inviteCode };
      this.postAxios("admin/setting/handler", data).then(res => {
        if (res.code == 0) {
          _this.$message({
            duration: 2000,
            type: "success",
            message: "设置成功",
            onClose: function() {
              _this.getInfo();
            }
          });
        }
      });
    },
    settimeout() {
      var _this = this;
      var data = { type: "timeout", value: this.pageData.orderTimeoutMinutes };
      this.postAxios("admin/setting/handler", data).then(res => {
        if (res.code == 0) {
          _this.$message({
            duration: 2000,
            type: "success",
            message: "设置成功",
            onClose: function() {
              _this.getInfo();
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mytask {
  &-container {
    margin: 30px;
    .page-title {
      margin-bottom: 30px;
      font-weight: bolder;
    }
    .rowcenter {
      text-align: center;
      display: flex;
      flex-wrap: wrap;
      padding: 0 10px;
      .item {
        width: 20%;
        margin: 20px;
        el-card {
          padding: 20px;
          width: 100%;
        }
      }
    }
    .mytaskitem {
      padding: 20px;
      // border: 1px solid #e6e6e6;
      background: #fff;
      border-radius: 5px;
      margin-bottom: 20px;
      .item-title {
        line-height: 30px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        color: cornflowerblue;
        font-size: 14px;
        .name {
          font-weight: bold;
          color: #333333;
          font-size: 18px;
        }
      }
      .item-content {
        padding: 0 10px;
        .tables {
          display: flex;
          .item {
            flex: 1;
            table {
              border-collapse: collapse;
              td {
                padding: 10px;
                border: 1px solid #333;
              }
              td:nth-of-type(2) {
                width: 200px;
              }
            }
          }
        }
      }
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>