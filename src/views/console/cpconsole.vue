<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">当前状态</div>
    </div>
    <div class="mytaskitem">
      <div class="item-title">
        <span class="name">
          <i class="el-icon-menu" />今日概况
        </span>
      </div>
      <el-row class="row" style="margin-bottom:10px;">
        <el-col :span="8">
          <label class="name">流水合计</label>
          <span>￥{{ pageData.totalAmount }}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">充值金额</label>
          <span>￥{{ pageData.chargeAmount }}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">红利合计</label>
          <span border>￥{{ pageData.awardAmount }}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <label class="name">完成/收到订单</label>
          <span>{{ pageData.finishOrderCnt }}个/{{ pageData.receOrderCnt }}个({{ pageData.receOrderCnt==0?'0%':((pageData.finishOrderCnt/pageData.receOrderCnt)*100).toFixed(2)+'%' }})</span>
        </el-col>
        <el-col :span="8">
          <label class="name">提现金额</label>
          <span>￥{{ pageData.withdrawAmount }}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">接单用户</label>
          <span border>{{ pageData.orderUserCnt }}人</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getCpId } from "@/utils/auth";

export default {
  name: "Mytask",
  data() {
    return {
      cpid:0,
      pageData: {}
    };
  },
  created() {
    this.cpid = getCpId();
    this.getList();
  },
  methods: {
    taskClick(num) {
      if (num == 0 || num == 2) {
        sessionStorage.setItem("state", num);
        this.$router.push({ path: "/search/orderSearch" });
      } else if (num == 3) {
        sessionStorage.setItem("state", "0");
        this.$router.push({ path: "/search/withdrawSearch" });
      } else if (num == 4) {
        sessionStorage.setItem("state", "0");
        this.$router.push({ path: "/search/rechargeSearch" });
      }
    },
    getList() {
      var data={cpid:this.cpid}
      this.postAxios2("admin/pending",data).then(res => {
        this.pageData = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>