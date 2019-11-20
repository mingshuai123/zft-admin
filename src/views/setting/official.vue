<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" /> 充值设置
      </div>
    </div>
    <div class="mytaskitem">
      <div class="flexlabel">
        <el-button type="primary" @click="dialogVisible=true">新增</el-button>
      </div>
      <div class="item-content">
        <el-table :data="tableData" border empty-text="暂无数据" style="width: 100%">
          <el-table-column prop="bankName" label="收款银行"></el-table-column>
          <el-table-column prop="realname" label="开户人"></el-table-column>
          <el-table-column prop="bankAddr" label="开户地"></el-table-column>
          <el-table-column prop="accountNo" label="银行账号"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{type[scope.row.state]}}</template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                @click="handleClick(2,scope.row)"
                v-if="scope.row.state==1"
              >停用</el-button>
              <el-button type="primary" size="mini" @click="handleClick(1,scope.row)" v-else>启用</el-button>
              <el-button type="danger" size="mini" @click="handleClick(3,scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="添加账户" :visible.sync="dialogVisible">
      <el-form :model="formData">
        <el-form-item label="收款银行" :label-width="formLabelWidth">
          <el-input v-model="formData.bankName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户人" :label-width="formLabelWidth">
          <el-input v-model="formData.realname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开户地" :label-width="formLabelWidth">
          <el-input v-model="formData.bankAddr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" :label-width="formLabelWidth">
          <el-input v-model="formData.accountNo" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
export default {
  name: "Mytask",
  directives: { waves },
  data() {
    return {
      formData:{
        bankName: "",
        bankAddr: "",
        accountNo: "",
        realname: "",
        state: null,
        id: null,
      },
      formLabelWidth: '80px',
      dialogVisible:false,
      state: -1,
      tableData: [],
      stateCN: {
        0: "停用",
        1: "正常 ",
        2: "删除",
        3: "超时",
        4: "后台失败"
      },
      type:{ 1:'启用' ,2:'停用' ,3:'删除'}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleClick(type,row){
      var data=JSON.parse(JSON.stringify(row)) , _this=this;
      data.state=type;
      this.$confirm('是否'+this.type[data.state]+''+row.realname+'的账号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.postAxios2('admin/official/bank/handler',data).then(res=>{
            if(res.code==0){
              _this.getList();
              this.$message({
                type: 'success',
                message: '操作成功!',
                duration:2000,
                showClose:true,
              });
            }
            
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
    },
    handleCurrentChange(n) {
      var _this = this;
      var data = { pn: n, state: this.state };
      this.postAxios("withdraw/list", data).then(res => {
        this.pageDate = res.data;
        this.tableData = res.data.list;
      });
    },
    handleAdd(){
      
    },
    submitAdd(){
      var _this=this;
      var data=this.formData;
      this.postAxios2('admin/official/bank/handler',data).then(res => {
        if(res.code==0){
          this.dialogVisible=false;
          this.$message({
            type: 'success',
            message: '添加成功!',
            duration:2000,
            showClose:true,
            onClose:function(){
              _this.getList();
            }
          });
        }
      });
    },
    getList() {
      var _this = this;
      this.postAxios2("admin/official/bank/info").then(res => {
        this.tableData = res.data;
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
    }
    .filter-item {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 10px;
    }
    .flexlabel {
      display: flex;
      margin-bottom: 20px;
      .name {
        width: 100px;
        text-align: right;
        line-height: 46px;
      }
      .label {
        flex: 1;
      }
      .btn-radio {
        margin: 5px;
        border-radius: 3px;
        overflow: hidden;
        border-left: 1px solid #dcdfe6;
        &:first-child {
          border-left: none;
        }
      }
    }
    .searchbox {
      width: 70%;
      margin: 10px 0 0 105px;
    }
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>