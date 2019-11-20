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
        <el-form-item label="代理邀请码" :inline="true">
          <el-col :span="6">
            <el-input v-model="pageData.inviteCode"></el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-button type="primary" @click="setinvite">重新生成</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="接单过期时间">
          <el-col :span="6">
            <el-input v-model="pageData.orderTimeoutMinutes"></el-input>
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
        orderTimeoutMinutes: 0
      }
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.postAxios("admin/setting/info").then(res => {
        var data=res.data;
        data.orderSwitch=Boolean(data.orderSwitch)
        this.pageData = data;
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