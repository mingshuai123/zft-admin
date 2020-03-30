<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" /> 商户列表
      </div>
    </div>
    <div class="mytaskitem">
      <div class="flexlabel" style="justify-content:space-between;align-items:center">
        <el-button type="primary" @click="addClick">新增商户</el-button>
        <div>
          <span>包含已停用</span>
          <el-switch v-model="include" active-value="1" inactive-value="0" @change="setorderSwitch"></el-switch>
        </div>
      </div>
      <div class="item-content">
        <el-table :data="tableData" border empty-text="暂无数据" style="width: 100%">
          <el-table-column prop="name" label="商户名"></el-table-column>
          <el-table-column prop="loginName" label="登录名"></el-table-column>
          <el-table-column prop="id" label="商户ID"></el-table-column>
          <el-table-column prop="apiKey" label="KEY"></el-table-column>
          <el-table-column prop="wxRatio" label="微信分成比例">
            <template slot-scope="scope">{{ Number(scope.row.wxRatio*100).toFixed(2)}}%</template>
          </el-table-column>
          <el-table-column prop="alipayRatio" label="支付宝分成比例">
            <template slot-scope="scope">{{ Number(scope.row.alipayRatio*100).toFixed(2)}}%</template>
          </el-table-column>
          <el-table-column prop="bankRatio" label="银行卡分成比例">
            <template slot-scope="scope">{{ Number(scope.row.bankRatio*100).toFixed(2)}}%</template>
          </el-table-column>
          <el-table-column prop="unionpayRatio" label="云闪付分成比例">
            <template slot-scope="scope">{{ Number(scope.row.unionpayRatio*100).toFixed(2)}}%</template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{type[scope.row.state]}}</template>
          </el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">{{scope.row.type==1?'普通':'高级'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                @click="handleClick(0,scope.row)"
                v-if="scope.row.state=='1'"
              >停用</el-button>
              <el-button type="primary" size="mini" @click="handleClick(1,scope.row)" v-else>启用</el-button>
              <el-button type="danger" size="mini" @click="handleClick(4,scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 添加/修改 商户弹窗 -->
    <el-dialog :title="handleType=='add'?'添加商户':'修改商户信息--'+formData.name" :visible.sync="dialogVisible">
      <el-form :model="formData" style="width:500px">
        <el-form-item label="商户名称" :label-width="formLabelWidth" v-if="handleType=='add'">
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分成比例" :label-width="formLabelWidth">
          <div class="dialogitem">
            <label>微信分成比例</label>
            <el-input
              v-model="formData.wxRatio"
              autocomplete="off"
              style="width:200px"
              type="number"
            >
              <template slot="append">%</template>
            </el-input>
          </div>
          <div class="dialogitem">
            <label>支付宝分成比例</label>
            <el-input
              v-model="formData.alipayRatio"
              autocomplete="off"
              style="width:200px"
              type="number"
            >
              <template slot="append">%</template>
            </el-input>
          </div>
          <div class="dialogitem">
            <label>银行卡分成比例</label>
            <el-input
              v-model="formData.bankRatio"
              autocomplete="off"
              style="width:200px"
              type="number"
            >
              <template slot="append">%</template>
            </el-input>
          </div>
          <div class="dialogitem">
            <label>云闪付分成比例</label>
            <el-input
              v-model="formData.unionpayRatio"
              autocomplete="off"
              style="width:200px"
              type="number"
            >
              <template slot="append">%</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth" v-if="handleType=='add'">
          <el-switch v-model="formData.state" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="添加类型" :label-width="formLabelWidth" v-if="handleType=='add'">
          <el-radio-group v-model="formData.type" size="medium">
            <el-radio :label="1" border>普通商户</el-radio>
            <el-radio :label="2" border>高级商户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth"  >
          <el-input v-model="formData.username" autocomplete="off" :disabled="handleType!='add'"></el-input>
        </el-form-item>
        <el-form-item :label="handleType=='add'?'密码':'修改密码'" :label-width="formLabelWidth">
          <el-input v-model="formData.pwd" autocomplete="off"></el-input>
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
      formData: {
        name: "",
        alipayRatio: "",
        bankRatio: "",
        wxRatio: "",
        unionpayRatio: "",
        state: "",
        username: "",
        pwd: "",
        type: 1
      },
      include: "1",
      formLabelWidth: "150px",
      dialogVisible: false,
      state: -1,
      tableData: [],
      type: { 0: "停用", 1: "启用", 2: "停用", 3: "删除", 4: "修改" },
      nowItem: {},
      handleType: "add"
    };
  },
  created() {
    this.getList();
  },
  methods: {
    addClick(){
      this.handleType='add';
      this.formData={
        name: "",
        alipayRatio: "",
        bankRatio: "",
        wxRatio: "",
        unionpayRatio: "",
        state: 1,
        username: "",
        pwd: "",
        type: 1
      }
      this.dialogVisible=true;
    },
    setorderSwitch() {
      this.getList();
    },
    handleClick(type, row) {
      if (type == "4") {
        this.handleType = "updata";
        let data = JSON.parse(JSON.stringify(row));
        data.alipayRatio = (data.alipayRatio * 100).toFixed(2);
        data.wxRatio = (data.wxRatio * 100).toFixed(2);
        data.bankRatio = (data.bankRatio * 100).toFixed(2);
        data.unionpayRatio = (data.unionpayRatio * 100).toFixed(2);
        data.username=data.loginName
        this.formData = data;
        this.dialogVisible = true;
        return false;
      }
      var _this = this;
      var data = {
        id: row.id,
        state: type
      };
      this.$confirm(
        "是否" + this.type[data.state] + " " + row.name + " 的账号",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      )
        .then(() => {
          this.postAxios("cp/state/handler", data).then(res => {
            if (res.code == 0) {
              _this.getList();
              this.$message({
                type: "success",
                message: "操作成功!",
                duration: 2000,
                showClose: true,
                onClose: function() {
                  location.reload();
                }
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    submitAdd() {
      var _this = this;
      var data = this.formData;
      // data.alipayRatio = Number(data.alipayRatio / 100).toFixed(4);
      // data.wxRatio = Number(data.wxRatio / 100).toFixed(4);
      // data.bankRatio = Number(data.bankRatio / 100).toFixed(4);
      // data.unionpayRatio = Number(data.unionpayRatio / 100).toFixed(4);
      var api = "cp/add";
      if (this.handleType == "add") {
      } else {
        api = "cp/update";
        // data.pwd = null;
      }
      console.log(data)
      this.postAxios2(api, data).then(res => {
        if (res.code == 0) {
          this.dialogVisible = false;
          this.$message({
            type: "success",
            message: "添加成功!",
            duration: 2000,
            showClose: true,
            onClose: function() {
              _this.getList();
            }
          });
        }
      });
    },
    getList() {
      var _this = this;
      this.formData = {
        name: "",
        alipayRatio: "",
        bankRatio: "",
        wxRatio: "",
        unionpayRatio: "",
        state: "",
        username: "",
        pwd: "",
        type: 1
      };
      this.postAxios2("cp/list", { include: Number(this.include) }).then(
        res => {
          this.tableData = res.data;
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.mytask {
  &-container {
    margin: 30px;
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
    .dialogitem {
      margin: 10px 0;
      label {
        margin-right: 10px;
        font-weight: normal;
        display: inline-block;
        width: 100px;
        text-align: right;
      }
    }
  }
}
</style>