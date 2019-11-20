<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">用户详情 / <span>用户ID : {{userInfo.id}}</span></div>
    </div>
    <div class="mytaskitem">
      <el-row class="row">
        <el-col :span="8">
          <el-tag class="name">ID</el-tag>
          <span>{{userInfo.id}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">联系电话</el-tag>
          <span border>{{userInfo.mobile}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">账号状态</el-tag>
          <span>{{stateCN[userInfo.state]}}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <el-tag class="name">上级ID</el-tag>
          <span>{{userInfo.fatherId}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">级别</el-tag>
          <span border>{{userInfo.level}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">下级用户</el-tag>
          <span>{{userInfo.childCnt}}</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">
          <el-tag class="name">保证金余额</el-tag>
          <span>￥ {{(userInfo.amount-userInfo.frozenAmount).toFixed(2)}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">红利余额</el-tag>
          <span border>￥ {{Number(userInfo.award-userInfo.frozenAward).toFixed(2)}}</span>
        </el-col>
      </el-row>
      <el-row class="row">
         <el-col :span="8">
          <el-tag class="name">冻结保证金额</el-tag>
          <span border>￥ {{userInfo.frozenAmount}}</span>
        </el-col>
         <el-col :span="8">
          <el-tag class="name">冻结红利金额</el-tag>
          <span>￥ {{userInfo.frozenAward}}</span>
        </el-col>
      </el-row>
      <div v-if='withdrawInfo'>
        <el-row class="row">
          <el-col :span="8">
            <el-tag class="name">提现银行</el-tag>
            <span>{{withdrawInfo.bankName}}</span>
          </el-col>
          <el-col :span="8">
            <el-tag class="name">提现账号</el-tag>
            <span border>{{withdrawInfo.accountNo}}</span>
          </el-col>
          <el-col :span="8">
            <el-tag class="name">开户名</el-tag>
            <span>{{withdrawInfo.realname}}</span>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="8">
            <el-tag class="name">开户地</el-tag>
            <span>{{withdrawInfo.bankAddr}}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row :gutter="3"	>
        <el-button type="primary" @click="handleClick('close')" style="margin:10px;">禁用账号</el-button>
        <el-button type="primary" @click="handleClick('open')" style="margin:10px;">启用账号</el-button>
        <el-button type="primary" @click="handleClick2('changefid')" style="margin:10px;">修改上级</el-button>
        <el-button type="primary" @click="handleClick2('addamount')" style="margin:10px;">修改资金</el-button>
        <el-button type="primary" @click="handleClick2('addaward')" style="margin:10px;">添加红利</el-button>
        <el-button type="primary" @click="handleClick3('skfs')" style="margin:10px;">查看收款方式</el-button>
        <el-button type="primary" @click="handleClick3('czjl')" style="margin:10px;">查看充值记录</el-button>
        <el-button type="primary" @click="handleClick3('txjl')" style="margin:10px;">查看提现记录</el-button>
        <el-button type="primary" @click="handleClick3('hljl')" style="margin:10px;">查看红利记录</el-button>
        <el-button type="primary" @click="handleClick3('jdjl')" style="margin:10px;">查看接单记录</el-button>
    </el-row>
    <el-dialog title="修改用户信息" :visible.sync="dialogVisible">
      <el-form :model="formData">
        <el-form-item label="修改上级ID" :label-width="formLabelWidth" v-if="type=='changefid'">
          <el-input v-model="formData.fid" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="修改资金" :label-width="formLabelWidth" v-if="type=='addamount'">
          <el-input v-model="formData.amount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="添加红利" :label-width="formLabelWidth" v-if="type=='addaward'">
          <el-input v-model="formData.award" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClick()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改用户信息" :visible.sync="dialogVisible2" width='80%'>
      <el-table :data="skfs" border>
        <el-table-column property="channel" label="渠道"></el-table-column>
        <el-table-column property="accountNo" label="卡号/账号"></el-table-column>
        <el-table-column property="realname" label="开户名/姓名"></el-table-column>
        <el-table-column property="bankName" label="银行"></el-table-column>
        <el-table-column property="bankAddr" label="开户地"></el-table-column>
        <el-table-column property="address" label="二维码">
          <template slot-scope="scope">
            <a href="javascript:;" v-if="scope.row.qrcode" @click="watchqrcode(scope.row.qrcode)" style="color:#409EFF;text-decoration:underline;">查看</a>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column  label="状态">
          <template slot-scope="scope">{{stateCN[scope.row.active] }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible3" title="查看二维码" width="60%" center>
      <img :src="'http://static.jesport.com/zft'+qrcode" alt="加载失败" style="width:100%;display:block;margin:0 auto;" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Mytask',
  data() {
    return {
      memberid:0,
      userInfo:{},
      withdrawInfo:{},
      formLabelWidth:'120px',
      dialogVisible:false,
      dialogVisible2:false,
      dialogVisible3:false,
      stateCN:{0:'禁用', 1:'正常', 2:'已接单', 3:'超时' ,4:'关闭', 5:'完成'},
      type:'',
      formData:{
        amount:'',
        award:'',
        fid:''
      },
      skfs:[],
      qrcode:''
    }
  },
  
  created(){
    var id=this.$route.query.id;
    this.memberid=id;
    this.getList();
  },
  methods: {
    watchqrcode(code){
      this.qrcode=code;
      this.dialogVisible3=true;
    },
    handleClick3(type){
      var api=''
      if(type='skfs'){
        api='user/payee/list'
      }
      var data={id:this.memberid}
      this.postAxios(api,data).then(res=>{
        if(res.code!=0){
          this.$message(res.message);
          return false;
        }
        if(type=='skfs'){
          this.skfs=res.data;
          this.dialogVisible2=true;
        }
      })
    },
    handleClick2(type){
      this.type=type;
      this.dialogVisible=true;
    },
    handleClick(type){
      var data={
        id:this.memberid,
        amount:(type!='close'&&type!='open')?this.formData.amount:this.userInfo.amount,
        award:(type!='close'&&type!='open')?this.formData.award:this.userInfo.award,
        type:type?type:this.type,
        fid:(type!='close'&&type!='open')?this.formData.fid:this.userInfo.fid
      }
      var _this=this;
      this.postAxios2('user/handler',{},data).then(res=>{
        if(res.code==0){
          var str='操作成功'
          this.closedialog();
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
    closedialog(){
      var formData={ amount:'', fid:'' };
      this.formData=formData;
      this.dialogVisible=false;
    },
    getList(){
      var data={id:this.memberid}
      this.postAxios('user/info',data).then(res=>{
        this.userInfo=res.data.userInfo;
        this.withdrawInfo=res.data.withdrawInfo;
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
        width: 100px;
      }
    }
    .btn-group{
      button, html [type="button"]{
        margin: 10px auto
      }
    }
    
  }
</style>