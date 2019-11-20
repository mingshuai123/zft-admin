<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" />添加订单
      </div>
    </div>
    <div class="mytaskitem">
      <el-form :model="searchData" label-width="120px">
        <el-form-item label="订单数额">
          <el-input size="medium" v-model="searchData.amount" placeholder="订单数额"></el-input>
        </el-form-item>
        <el-form-item label="支付类型">
          <el-radio-group v-model="searchData.pay" size="small">
            <el-radio v-for="item in options" :key="item.value" :label="item.value" border >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">生成订单</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 退单 -->
    <el-dialog title="确定生成订单" :visible.sync="dialogVisible" width="45%" center>
      <div class="memo">订单数额 : {{searchData.amount}}</div>
      <div class="memo">支付类型 : {{searchData.pay}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submitback">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import { getRoleId } from "@/utils/auth";
export default {
  name: "Mytask",
  directives: { waves },
  data() {
    return {
      roleId: 0,
      searchData: {
        amount: "",
        pay: "wx"
      },
      dialogVisible: false,
      options: [
        { value: 'wx', label: "微信" },
        { value: 'alipay', label: "支付宝" },
        { value: 'unionpay', label: "云闪付" },
        { value: 'bank', label: "银行卡" },
      ],
    };
  },
  watch: {},
  created() {
    this.roleId = getRoleId();
  },
  methods: {
    submitback() {
      var data=this.searchData;
      var _this=this;
      this.postAxios("order/add", data).then(res => {
        var type=res.code==0?"success":"error";
        this.$message({
          type: type,
          duration: 2000,
          message: res.message,
          onClose: function() {
            _this.dialogVisible = false;
          }
        });
      });
    },
    onSubmit() {
      this.dialogVisible=true;
    },
  }
};
</script>

<style lang="scss" scoped>
.memo{
  line-height: 35px;
}
</style>