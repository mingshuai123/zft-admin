<template>
    <el-dialog center :title="auditTitle" ref="submitForm" :model="submitForm" :visible.sync="dialogFormVisible" :before-close='closeAuditdialog' >
        <div style="margin:0 50px;">
            <el-alert class="info" type="success" show-icon :closable="false" center v-if="type==2">即将通过资料审核。检查无误后请点击确认。<br/> 确认后场所资料将由系统进行分析。</el-alert>
            <el-alert class="info" type="error" show-icon :closable="false" center v-if="type==3">拒绝通过 资料审核。请填写原因。</el-alert>
            <el-alert class="info" type="warning" show-icon :closable="false" center v-if='type==4'>无法处理资料审核。请填写原因。</el-alert>
            <el-alert class="info" type="success" show-icon :closable="false" center v-if='type==13'>初评通过，请填写分数后确认。确认后交由负责人进行确认。</el-alert>
            <el-alert class="info" type="error" show-icon :closable="false" center v-if='type==14||type==104'>由于检查项目或者得分问题，没有达到要求。请填写原因后确认。</el-alert>
            <el-alert class="info" type="warning" show-icon :closable="false" center v-if='type==15'>由于各种原因无法进行评审。交由星评委负责人进行下一步处理。</el-alert>
            <el-alert class="info" type="success" show-icon :closable="false" center v-if='type==17'>星评员已经完成初评，请确认结果。</el-alert>
            <el-alert class="info" type="success" show-icon :closable="false" center v-if='type==100'>将任务分配给一个星评员进行评审。确认后，由该星评员进行线下复评。</el-alert>
            <el-alert class="info" type="error" show-icon :closable="false" center v-if='type==101'>由于资料问题、联系人问题等。拒绝对该场所进行初评。</el-alert>
            <el-alert class="info" type="warning" show-icon :closable="false" center v-if='type==102'>基于对该场所的了解，推荐一个星级进行评审。</el-alert>
            <el-alert class="info" type="success" show-icon :closable="false" center v-if='type==103'>复评通过，请填写分数后确认。确认后交由负责人进行确认。</el-alert>
            <el-alert class="info" type="warning" show-icon :closable="false" center v-if='type==105'>由于各种原因无法进行评审。交由星评委负责人进行下一步处理。</el-alert>
            <el-alert class="info" type="success" show-icon :closable="false" center v-if='type==107'>星评员已经完成复评，请确认结果。确认后将交由系统进行分析。</el-alert>
            <el-alert class="info" type="error" show-icon :closable="false" center v-if='type==108'>初评结果有误，将打回星评员重新评审。</el-alert>
            <el-alert class="info" type="warning" show-icon :closable="false" center v-if='type==109'>由于各种原因，无法进行确认。将交由系统重新分析。</el-alert>
            <el-alert class="info" type="success" show-icon :closable="false" center v-if='type==1000'>通过该场所的星级评审，该场所将获得相应星级。</el-alert>
            <el-alert class="info" type="error" show-icon :closable="false" center v-if='type==1001'>该场所的星级将不通过。请填写原因。</el-alert>
            <el-alert class="info" type="error" show-icon :closable="false" center v-if='type==1003'>确认重新审核？</el-alert>
        </div>
        <div style="margin:0 50px;">
            <el-alert class="info" type="success" show-icon :closable="false" center v-if="type==5">通过分析，请分配星评委。确认后，场所将交给该星评委进行“初审/复审”。</el-alert>
            <el-alert class="info" type="error" show-icon :closable="false" center v-else-if="type==6">拒绝通过 资料审核。请填写原因。</el-alert>
        </div>
        <dir v-if='type==13||type==17||type==103||type==1000'>
            <p v-if='stat&&statInfo.grade_pass'>已经提交分数：{{statInfo.grade_score}}分，达到{{statInfo.netbar_star}}星标准</p>
            <p v-if='stat&&!statInfo.grade_pass'>已经提交分数：{{statInfo.grade_score}}分，未达到{{statInfo.netbar_star}}星标准</p>
            <p v-if='!stat'>未完成评分，请点击进行 <router-link :to="{path:'/myTask/statDetail',query: { netbarid: netbar_id }}"><span style='color:#409EFF;'>填写</span></router-link></p>
        </dir>
        <dir v-if='type==14||type==104||type==1001'>
            <p v-if='stat'>得分高于要求，请重更新 <router-link :to="{path:'/myTask/statDetail',query: { netbarid: netbar_id }}"><span style='color:#409EFF;'>填写分数</span></router-link></p>
            <p v-if='stat&&statInfo.grade_pass'>已经提交分数：{{statInfo.grade_score}}分，达到{{statInfo.netbar_star}}星标准</p>
            <p v-if='stat&&!statInfo.grade_pass'>已经提交分数：{{statInfo.grade_score}}分，未达到{{statInfo.netbar_star}}星标准</p>
        </dir>
        <el-form ref="submitForm" :model="submitForm"  label-position="top" label-width="100px" style="margin:0 50px;">
            <el-form-item label="选择星评委：" v-if='type==5'>
                <el-select v-model="org" placeholder="请选择">
                    <el-option v-for="(item,index) in org_list" :key="index" :label="item.name" :value="item.org_id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择星评员：" v-if='type==10||type==16||type==106||type==100||type==108'>
                <el-select v-model="judgeid" placeholder="请选择">
                    <el-option v-for="(item,index) in judge_list" :key="index" :label="item.name" :value="item.member_id"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择推荐星级" v-if='type==12'>
                <el-select v-model="star_num" placeholder="请选择">
                    <el-option v-for="(item,index) in 5" :key="index" :label="item" :value="item"> </el-option>
                </el-select>
            </el-form-item>
            
            <el-form-item label="原因（业主可见）：" v-if="type!=2&&type!=5&&type!=10&&type!=16&&type!=106&&type!=13&&type!=17&&type!=100&&type!=103&&type!=107&&type!=1000">
                <el-input type="textarea" v-model="submitForm.reason" :rows="7"></el-input>
            </el-form-item>
            <el-form-item label="备注（业主不可见）：" >
                <el-input type="textarea" v-model="submitForm.memo" :rows="7"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer left">
            <el-button @click="closeAuditdialog">取消</el-button>
            <el-button type="primary" @click="auditSubmit()">确认</el-button>
        </div>
    </el-dialog>
</template>
<script>

export default {
  name: 'Audit',
  props:['dialogFormVisible','type','auditTitle','netbar_id','star'],
  data() {
    return {
        star_num:'',
        submitForm:{
            reason:'',
            memo:''
        },
        org:0,
        org_list:[],
        judgeid:0,
        judge_list:[],
        permission:true,
        stat:false,
        statInfo:{},
    }
  },
  watch:{
        star:function(val){
            this.star_num=val;
        },
        type:function(newval,val){
            console.log(newval)
            if(newval==5){
                this.getorgList();
            }
            if(newval==10 ||newval==16||newval==106||newval==100||newval==108){
                this.getjudgeList();
            }
            if(newval==13|| newval==14 || newval==17|| newval==103|| newval==104||newval==107||newval==1000||newval==1001){
                this.getinspect();
            }
        }
  },
  created(){},
  mounted(){},
  methods: {
    closeAuditdialog() {
        this.$refs.submitForm.resetFields();
        this.$emit("closeAuditdialog");
    },
    auditSubmit(){
        if(!this.permission){
            this.$message.error('无操作权限');
            return false;
        }
        console.log(this.type)
        if(this.type>1 && this.type<5){
            var url='judge/assessor/handler',data={
                type: this.type,
                memo: this.submitForm.memo,
                reason: this.submitForm.reason,
                netbar_id: this.netbar_id,
            }
            this.postAxios(url,data).then(res=>{
                if(res.code==0){
                    this.$message({
                        duration:1000,
                        type:'success',
                        message:'操作成功!',
                        onClose:function(){
                            location.reload()
                        }
                    })
                }else{
                    this.$message.error(res.msg);
                    this.closeAuditdialog();
                }
            })
        }
        if((this.type>4 && this.type<7)||(this.type>999&&this.type<1007)){
            var url='judge/admin/handler',data={
                type: this.type,
                memo: this.submitForm.memo,
                reason: this.submitForm.reason,
                netbar_id: this.netbar_id,
                org_id:this.org,
            };
            this.postAxios(url,data).then(res=>{
                if(res.code==0){
                    this.$message({
                        duration:1000,
                        type:'success',
                        message:'操作成功!',
                        onClose:function(){
                            location.reload()
                        }
                    })
                }else{
                    this.$message.error(res.msg);
                    this.closeAuditdialog();
                }
            })
        }
        if((this.type>9 && this.type<13) || (this.type>99 && this.type<103)||this.type==16||this.type==106){
            var url='judge/staradmin/handler',data={
                type: this.type,
                memo: this.submitForm.memo,
                reason: this.submitForm.reason,
                netbar_id: this.netbar_id,
                judge_id:this.judgeid,
                star_num:(this.type==10||this.type==100)?0:this.star_num
            };
            this.postAxios(url,data).then(res=>{
                if(res.code==0){
                    this.$message({
                        duration:1000,
                        type:'success',
                        message:'操作成功!',
                        onClose:function(){
                            location.reload()
                        }
                    })
                }else{
                    this.$message.error(res.msg);
                    this.closeAuditdialog();
                }
            })
        }
        if((this.type>12 && this.type<16)||(this.type>102 && this.type<106)){
            var url='judge/judger/handler',data={
                type: this.type,
                memo: this.submitForm.memo,
                reason: this.submitForm.reason,
                netbar_id: this.netbar_id,
                judge_id:this.$store.state.user.member_id,
            };
            this.postAxios(url,data).then(res=>{
                if(res.code==0){
                    this.$message({
                        duration:1000,
                        type:'success',
                        message:'操作成功!',
                        onClose:function(){
                            location.reload()
                        }
                    })
                }else{
                    this.$message.error(res.msg);
                    this.closeAuditdialog();
                }
            })
        }
        if((this.type>16&&this.type<20)||(this.type>106 && this.type<110)){
            var url='judge/staradmin/handler',data={
                type: this.type,
                memo: this.submitForm.memo,
                reason: this.submitForm.reason,
                netbar_id: this.netbar_id,
                judge_id:this.judgeid,
            };
            this.postAxios(url,data).then(res=>{
                if(res.code==0){
                    this.$message({
                        duration:1000,
                        type:'success',
                        message:'操作成功!',
                        onClose:function(){
                            location.reload()
                        }
                    })
                }else{
                    this.$message.error(res.msg);
                    this.closeAuditdialog();
                }
            })
        }
        if(this.type==10000){
            var url='judge/admin/handler',data={
               type: this.type,
                memo: this.submitForm.memo,
                reason: this.submitForm.reason,
                netbar_id: this.netbar_id,
                org_id:this.org,
            };
            this.postAxios(url,data).then(res=>{
                if(res.code==0){
                    this.$message({
                        duration:1000,
                        type:'success',
                        message:'操作成功!',
                        onClose:function(){
                            location.reload()
                        }
                    })
                }else{
                    this.$message.error(res.msg);
                    this.closeAuditdialog();
                }
            })
        }
    },
    getinspect(){
        this.postAxios('judge/inspect/item/stat',{netbar_id:this.netbar_id}).then(res=>{
            if(res.code==0){
                console.log(res.data.necess_stat)
                var isSub=~~(res.data.env_stat&&res.data.mgr_stat&&res.data.service_stat&&res.data.necess_stat);
                if(isSub){
                    this.statInfo=res.data;
                    this.stat=true
                }else{
                    this.permission=false;
                }
            }else{
                this.closeAuditdialog();
                this.$message.error(res.msg);
            }
        })
    },
    getorgList(){
        this.postAxios('org/list',{netbar_id:this.netbar_id,rank:0}).then(res=>{
            if(res.code==0){
                var list=res.org_list;
                list.forEach(item => {
                    if(item.choose){
                        this.org=item.org_id;
                    }
                });
                this.org_list=list;
            }else if(res.code==10006){
                this.permission=false;
                this.$message.error(res.msg);
            }else{
                this.$message.error(res.msg);
            }
        })
    },
    getjudgeList(){
        this.postAxios('judge/list').then(res=>{
            if(res.code==0){
                let list=res.judge_list
                let id=this.$store.state.user.member_id;
                list.forEach(item=>{
                    item.member_id==id?this.judgeid=item.member_id:'';
                })
                this.judge_list=list;
            }else if(res.code==10006){
                this.permission=false;
                this.$message.error(res.msg);
            }else{
                this.$message.error(res.msg);
            }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .info{
    border:1px solid #DCDFE6;
    padding:10px;
    text-align:center;
  }
</style>
