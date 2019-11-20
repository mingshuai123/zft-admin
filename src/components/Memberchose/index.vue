<template>
    <el-dialog title="选择成员" :visible.sync="dialogFormVisible" :before-close='closedialog'>
      <el-form ref="dataForm"   label-position="left" label-width="70px" style="width: 450px; margin-left:50px;">
        
        <el-form-item label="成员" prop="选择成员" aria-required="选择成员">
          <el-input  v-model="memberSeach" @focus="isOnfocus?'':membershow()" :placeholder="choseMember.name?'':'请点击选择成员'"  clearable :disabled='ischose' style="position:relative"/>
          <div style='position:absolute;left:20px;top:0;width:100%' v-show='ischose'>
            <span>已选择</span>{{choseMember.name}}-{{choseMember.mobile}} <el-button icon="el-icon-close" size='mini' circle @click="delchoseItem()"></el-button>
          </div>
        </el-form-item>

        <!-- 成员列表 -->
        <div class="memlist" v-if='memlistshow'>
          <div class="list" v-for='(item,index) in memlist' :key="index" >
            <span>{{item.name?item.name:'未填写name'}}-{{item.mobile}}</span>
            <el-button size='mini' @click.native.prevent="choseItem(item)">选择</el-button>
          </div>
        </div>
        <el-form-item  class="" v-else>

        </el-form-item >

      </el-form>
      <div slot="footer" class="dialog-footer left">
        <el-button @click="closedialog">
          取消
        </el-button>
        <el-button type="primary" @click="dialogchoseMember()">
          确认
        </el-button>
      </div>
    </el-dialog>
</template>
<script>
export default {
  name: 'Memberchose',
  props:['dialogFormVisible','dialogStatus'],
  data() {
    return {
      ischose:false,
      memberSeach: '',
      memlistshow:true,
      memlist:[],
      choseMember: {},
      isOnfocus:false,
      listLoading:false,
      list:[],
      
    }
  },
  watch:{
    memberSeach:function(){
      this.getmemberList();
    }
  },
  created() {},
  methods: {
    closedialog() {
      this.$emit("closedialog", this.memberSeach);
      this.memberSeach='';
      this.ischose=false;
      this.memlistshow=true;
      this.choseMember={}
    },
    choseItem(item){
      if(item.org_name!=''){
        this.$message.error('该用户是“'+item.org_name+'”的星评员。只有解除职务以后才可以选择')
      }else{
        this.ischose=true;
        this.memlistshow=false;
        this.memberSeach='';
        this.choseMember=item;
      }
    },
    delchoseItem(){
      this.memlistshow=true;
      this.ischose=false;
      this.choseMember={};
    },
    membershow(){
      this.isOnfocus=true;
      this.getmemberList()
    },
    getmemberList(){
      let data={k:this.memberSeach}
      this.postAxios('common/judge/search',data).then((res)=>{
        window.console.log(res);
        if(res.code != 0){
          this.$message.error(res.message);
          return;
        }
        this.memlist=res.search_list
        if(res.search_list.length==0){
          this.$message.error("未查找到结果，该用户没有注册或者未填写真实姓名")
        }
      })
    },
    findmember(){
      this.getmemberList
    },
    dialogchoseMember(){
      var data=this.choseMember
      this.$emit("dialogchoseMember",data) ;
      this.memberSeach=''
      this.ischose=false;
      this.memlistshow=true;
      this.choseMember={}
    }
  }
}
</script>
<style lang="scss" scoped>
  .memlist  {
    max-height: 650px;
    overflow-y: auto;
    .list{
      display: flex;
      padding: 10px;
      justify-content: space-between;
      align-content: center;
    }
  }
  .memlist::-webkit-scrollbar{
    display: none;
  }
</style>
