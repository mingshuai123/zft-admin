<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">充值详情 / <span>充值 : {{orderInfo.orderId}}</span></div>
    </div>
    <div class="mytaskitem">
      <el-row class="row">
        <el-col :span="8">
          <el-tag class="name">订单ID</el-tag>
          <span>{{orderInfo.orderId}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">金额</el-tag>
          <span>￥ {{orderInfo.amount}}</span>
        </el-col>
        <el-col :span="8">
          <el-tag class="name">申请人</el-tag>
          <span border>{{orderInfo.mobile}}{{orderInfo.username?'('+orderInfo.username+')':'' }}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <el-tag class="name">申请时间</el-tag>
          <span>{{orderInfo.createdDate}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">完成时间</el-tag>
          <span border>{{orderInfo.finishDate}}</span>
        </el-col>
        <el-col :span="8">
          <el-tag class="name">状态</el-tag>
          <span>{{stateCN[orderInfo.state]}}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <el-tag class="name">银行</el-tag>
          <span>{{orderInfo.bankName}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">账号</el-tag>
          <span border>{{orderInfo.accountNo}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">附加码</el-tag>
          <span>{{orderInfo.code}}</span>
        </el-col>
      </el-row>
    </div>
    <div v-if="orderInfo.state<=1">
      <el-button type="primary" @click="dialogVisible = true">确认充值</el-button>
      <el-button type="primary" @click="handleClick('close')">关闭申请</el-button>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible">
      <div>确认给{{orderInfo.realname}}充值{{orderInfo.amount}}元保证金么？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClick('finish')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Mytask',
  data() {
    return {
      orderid:0,
      orderInfo:{orderId:0},
      formLabelWidth:'120px',
      dialogVisible:false,
      stateCN: {
        0: "待付款",
        1: "确认付款",
        2: "确认到账",
        3: "超时",
        4: "后台关闭",
        5: "完成"
      },
      
    }
  },
  
  created(){
    var id=this.$route.query.id;
    this.orderid=id;
    this.getList();
  },
  methods: {
    handleClick(type){
      var data={
        id:this.orderid,
        type:type,
        memo:''
      }
      var _this=this;
      this.postAxios2('charge/handler',{},data).then(res=>{
        if(res.code==0){
          this.dialogVisible=false;
          var str='操作成功'
          this.$message({
            duration:2000,
            type:'success',
            message:str,
            onClose:function() {
              _this.getList()
            }
          })
        }else{
          this.$message.error(res.message)
        }
      })
    },
    getList(){
      var data={id:this.orderid}
      this.postAxios('charge/info',data).then(res=>{
        this.orderInfo=res.data;
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .mytaskitem{
    .row{
      margin: 10px auto;
      .name{
        text-align: center;
        width: 80px;
      }
      
    }
    
  }
</style>