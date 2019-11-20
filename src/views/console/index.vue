<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">当前状态</div>
    </div>
    <!-- <el-alert style="margin-bottom:10px;" title="测试提示" type="error"></el-alert> -->
    <div class="mytaskitem">
      <!-- <div class="item-title"><span class="name"><i class="el-icon-menu" />我的任务</span></div> -->
      <div class="rowcenter item-content">
        <div class="item" @click="taskClick(0)">
          <el-card
            shadow="hover"
            :body-style="{background:'#409EFF',color:'#fff',fontSize:'14px',cursor: 'pointer'}"
          >
            <div style="font-size:24px">{{pageData.pendingCnt}}</div>
            <div>
              <br />待处理订单
            </div>
          </el-card>
        </div>
        <div class="item" @click="taskClick(2)">
          <el-card
            shadow="hover"
            :body-style="{background:'#E6A23C',color:'#fff',fontSize:'14px',cursor: 'pointer'}"
          >
            <div style="font-size:24px">{{pageData.receOrderCnt}}</div>
            <div>
              <br />已接单
            </div>
          </el-card>
        </div>
        <div class="item" @click="taskClick(3)">
          <el-card
            shadow="hover"
            :body-style="{background:'#F56C6C',color:'#fff',fontSize:'14px',cursor: 'pointer'}"
          >
            <div style="font-size:24px">{{pageData.withdrawCnt}}</div>
            <div>
              <br />待提现
            </div>
          </el-card>
        </div>
        <div class="item" @click="taskClick(4)">
          <el-card
            shadow="hover"
            :body-style="{background:'#67C23A',color:'#fff',fontSize:'14px',cursor: 'pointer'}"
          >
            <div style="font-size:24px">{{pageData.chargeCnt}}</div>
            <div>
              <br />待确认充值
            </div>
          </el-card>
        </div>
        <!-- <div class="item" @click='taskClick(5)'>
          <el-card shadow="hover" :body-style="{background:'#67C23A',color:'#fff',fontSize:'14px',cursor: 'pointer'}">
            <div style="font-size:24px">{{pageData.orderUserCnt}}</div>
            <div><br/>正在接单用户</div>
          </el-card>
        </div>-->
      </div>
    </div>
    <div class="mytaskitem">
      <div class="item-title">
        <span class="name">
          <i class="el-icon-menu" />今日概况
        </span>
        <!-- <el-button type="primary" size='small' round @click='taskClick(1)'>查看全部</el-button> -->
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
    <!-- <div class="mytaskitem">
      <div class="item-title">
        <span class="name"><i class="el-icon-menu" />24小时概况</span>
      </div>
      <el-row class="row" style="margin-bottom:10px;">
        <el-col :span="8">
          <label class="name">流水合计</label>
          <span>￥{{pageData.totalAmount24}}</span>
        </el-col>
         <el-col :span="8">
          <label class="name">充值金额</label>
          <span>￥{{pageData.chargeAmount24}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">红利合计</label>
          <span border>￥{{pageData.awardAmount24}}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <label class="name">完成/收到订单</label>
          <span>{{pageData.finishOrderCnt24}}个/{{pageData.receOrderCnt24}}个({{((pageData.finishOrderCnt24/pageData.receOrderCnt24)*100).toFixed(2)+'%'}})</span>
        </el-col>
         <el-col :span="8">
          <label class="name">提现金额</label>
          <span>￥{{pageData.withdrawAmount24}}</span>
        </el-col>
        <el-col :span="8">
          <label class="name">接单用户</label>
          <span border>{{pageData.orderUserCnt24}}人</span>
        </el-col>
      </el-row>
    </div>-->
  </div>
</template>

<script>
export default {
  name: "Mytask",
  data() {
    return {
      pageData: {}
    };
  },
  created() {
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
      this.postAxios("admin/pending").then(res => {
        this.pageData = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>