<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        订单详情 /
        <span>订单 : {{orderInfo.orderId}}</span>
      </div>
    </div>
    <div class="mytaskitem">
      <el-row class="row">
        <el-col :span="8">
          <!-- <label class="name">ID</label> -->
          <label class="name">ID:</label>
          <span>{{orderInfo.orderId}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">生成时间:</label>
          <span border>{{orderInfo.createdDate}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">金额:</label>
          <span>{{orderInfo.amount}}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <label class="name">红利:</label>
          <span>{{orderInfo.awardAmount}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">接单时间:</label>
          <span border>{{orderInfo.userGetDate?orderInfo.userGetDate:"--"}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">接单员:</label>
          <span>{{orderInfo.mobile}}{{orderInfo.username?'('+orderInfo.username+')':'' }}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <label class="name">状态:</label>
          <span>{{stateCN[orderInfo.state]}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">完成时间:</label>
          <span border>{{orderInfo.finishDate}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">接单次数:</label>
          <span>{{orderInfo.allocTimes}}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <label class="name">来源:</label>
          <span>{{orderInfo.cpName}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">来源订单ID:</label>
          <span border>{{orderInfo.cpOrderId}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">超时时间:</label>
          <span>{{orderInfo.timeoutDate}}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <label class="name">收款方式:</label>
          <span>{{orderInfo.orderPayeeAccount?typeCN[orderInfo.orderPayeeAccount.channel]:'未选择'}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">收款账号:</label>
          <span border>{{orderInfo.orderPayeeAccount?orderInfo.orderPayeeAccount.accountNo:''}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">附言:</label>
          <span>{{orderInfo.memo}}</span>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-button type="primary" @click="dialogVisible = true">更改接单员</el-button>
      <el-button type="primary" @click="handleClick('stop')">停止该单</el-button>
    </div>
    <el-dialog title="更改接单员" :visible.sync="dialogVisible">
      <el-form :model="formData">
        <el-form-item label="接单员ID" :label-width="formLabelWidth">
          <el-input v-model="formData.uid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="留言" :label-width="formLabelWidth">
          <el-input v-model="formData.memo" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClick('changeuid')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Mytask",
  data() {
    return {
      orderid: 0,
      orderInfo: { orderId: 0 },
      formLabelWidth: "120px",
      dialogVisible: false,
      typeCN: {
        0:'未选择',
        bank: "银行卡",
        alipay: "支付宝",
        wx: "微信",
        unionpay: "云闪付"
      },
      stateCN: {
        0: "未分配",
        1: "已分配",
        2: "已接单",
        3: "超时",
        4: "关闭",
        5: "完成"
      },
      formData: {
        uid: "",
        memo: ""
      }
    };
  },

  created() {
    var id = this.$route.query.id;
    this.orderid = id;
    this.getList();
  },
  methods: {
    handleClick(type) {
      var data = {
        id: this.orderid,
        uid: type == "stop" ? this.orderInfo.uid : this.formData.uid,
        type: type,
        memo: this.formData.memo
      };
      var _this = this;
      this.postAxios2("order/handler", {}, data).then(res => {
        if (res.code == 0) {
          if (type == "stop") {
            var str = "操作成功";
          } else {
            var str = "更改接单员成功";
          }
          this.$message({
            duration: 2000,
            type: "success",
            message: str,
            onClose: function() {
              _this.getList();
            }
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getList() {
      var data = { id: this.orderid };
      this.postAxios("order/info", data).then(res => {
        this.orderInfo = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.mytaskitem {
  .row {
    margin: 10px auto;
    .name {
      color: #409EFF;
      text-align: right;
      width: 90px;
    }
  }
}
</style>