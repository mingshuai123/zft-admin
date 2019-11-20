<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">近期概况</div>
    </div>
    <div class="mytaskitem">
      <div class="item-title">
        <span class="name"><i class="el-icon-menu" />今日概况</span>
        <!-- <el-button type="primary" size='small' round @click='taskClick(1)'>查看全部</el-button> -->
      </div>
      <div class="item-content">
        <div class="tables">
          <div class="item">
            <table>
              <tbody>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="item">
            <table>
              <tbody>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="mytaskitem">
      <div class="item-title">
        <span class="name"><i class="el-icon-menu" />昨日概况</span>
      </div>
      <div class="item-content">
        <div class="tables">
          <div class="item">
            <table>
              <tbody>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="item">
            <table>
              <tbody>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
                <tr>
                  <td>流水合计</td>
                  <td>￥123456.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { roleName } from '@/utils/validate'
import { getList } from '@/api/user'

export default {
  name: 'Mytask',
  data() {
    return {
      pageData :{
        pending:12,
        finish_cnt:8,
        org_cnt:9,
        new_cnt:1,
        ing_cut:22
      }
    }
  },
  
  created(){
    // this.getTask();
  },
  methods: {
    taskClick(type){
      console.log(type)
      if(type){
        this.$router.push({path:'/myTask/Mytasklist',query:{type:type}});
      }else{
        this.$router.push({path:'/myTask/Mytasklist'});
      }
    },
    handleClick(item){
      this.$router.push({path:'/myTask/taskDetail',query:{netbarid:item.netbar_id,taskid:item.task_id}})
    },
    morelist(){
      this.tableLoading=true;
      
      setTimeout(()=>{
        var list=this.tableData[0];
        this.tableData.push(list);
        this.tableLoading=false;
      },2000)
    },
    getList(scope,status){
      var data={
        page:1,
        state:status,
        scope:scope,
        search:"",
        judge_state:0,
        _comment:"state:任务状态 0:全部 1:未开始 2:待处理 3:已处理；scope:处理人 0:全部 1:个人 2:本星评委 3:下属"
      }
      this.postAxios("judge/task/list",data).then(res=>{
        if(res.code==0){
          return res
        }
      })
    },
    getTask(){
      var _this=this;
       var data={page:1,state:0,scope:2,judge_state:0,search:""},data2={page:1,state:0,scope:1,judge_state:2,search:""}
      getList(data).then(res=>{
        var newList=res.task_list;
        newList.forEach(function(item){
          item.judgeName=_this.judgeName[item.judge_state]
          _this.defineState.forEach(item2 => {
            if(item2.list.indexOf(item.state)>=0){
              item.stateName=item2.name;
            }
          });
        })
        this.newList.list=newList;
        this.newList.page=res.page;
      })
      getList(data2).then(res=>{
        var pendingList=res.task_list;
        pendingList.forEach(function(item){
          item.judgeName=_this.judgeName[item.judge_state]
          _this.defineState.forEach(item2 => {
            if(item2.list.indexOf(item.state)>=0){
              item.stateName=item2.name;
            }
          });
        })
        this.pendingList.list=pendingList;
        this.pendingList.page=res.page;
      })
      this.postAxios('judge/mytask/stat').then((res)=>{
        if(res.code==0){
          this.mytask=res.data;
        }else{
          this.$message.error(res.message);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mytask {
  &-container {
    margin: 30px;
    .page-title{
      margin-bottom: 30px;
      font-weight:bolder;
    }
    .rowcenter{
      text-align: center;
      display: flex;
      flex-wrap: wrap;
      padding: 0 10px;
      .item{
        width:20%;
        margin: 20px;
        el-card{
          padding: 20px;
          width: 100%;
        }
      }
    }
    .mytaskitem{
      padding: 20px;
      // border: 1px solid #e6e6e6;
      background: #fff;
      border-radius: 5px;
      margin-bottom: 20px;
      .item-title{
        line-height: 30px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        color: cornflowerblue;
        font-size: 14px;
        .name{
            font-weight: bold;
            color: #333333;
            font-size: 18px;
        }
      }
      .item-content{
        padding: 0 10px;
        .tables{
          display: flex;
          .item{
            flex: 1;
            table{
              border-collapse: collapse;
              td{
                padding: 10px;
                border: 1px solid #333;
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