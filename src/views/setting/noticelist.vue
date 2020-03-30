<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" /> 公告/帮助
      </div>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="公告" name="1">
        <div class="mytaskitem">
          <div class="flexlabel" style="justify-content:space-between;align-items:center">
            <el-button type="primary" @click="showdialog(1)">新增公告</el-button>
            <div>
              <span>包含已停用</span>
              <el-switch
                v-model="include"
                active-value="1"
                inactive-value="0"
                @change="setorderSwitch"
              ></el-switch>
            </div>
          </div>
          <div class="item-content">
            <el-table :data="tableData" border empty-text="暂无数据" style="width: 100%">
              <el-table-column prop="title" label="标题"></el-table-column>
              <el-table-column prop="content" label="内容" width="300"></el-table-column>
              <el-table-column prop="createdDate" label="创建时间"></el-table-column>
              <el-table-column label="置顶">
                <template slot-scope="scope">{{zdtype[scope.row.top]}}</template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">{{type[scope.row.state]}}</template>
              </el-table-column>
              <el-table-column label="操作" width="280" class="buttongroup">
                <template slot-scope="scope">
                  <el-button
                    type="warning"
                    size="mini"
                    @click="handleClick(0,scope.row,'state')"
                    v-if="scope.row.state==1"
                  >停用</el-button>
                  <el-button type="primary" size="mini" @click="handleClick(1,scope.row,'state')" v-else>启用</el-button>
                  <el-button
                    type="warning"
                    size="mini"
                    @click="handleClick(0,scope.row,'top')"
                    v-if="scope.row.top==1"
                  >取消置顶</el-button>
                  <el-button type="warning" size="mini" @click="handleClick(1,scope.row,'top')" v-else>置顶</el-button>
                  <el-button type="danger" size="mini" @click="handleClick(0,scope.row,'del')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="帮助" name="2">
        <div class="mytaskitem">
          <div class="flexlabel" style="justify-content:space-between;align-items:center">
            <el-button type="primary" @click="showdialog(2)">新增帮助</el-button>
            <div>
              <span>包含已停用</span>
              <el-switch
                v-model="include"
                active-value="1"
                inactive-value="0"
                @change="setorderSwitch"
              ></el-switch>
            </div>
          </div>
          <div class="item-content">
            <el-table :data="tableData" border empty-text="暂无数据" style="width: 100%">
              <el-table-column prop="title" label="标题"></el-table-column>
              <el-table-column prop="content" label="内容" width="300"></el-table-column>
              <el-table-column prop="createdDate" label="创建时间"></el-table-column>
              <el-table-column label="置顶">
                <template slot-scope="scope">{{zdtype[scope.row.top]}}</template>
              </el-table-column>
              <el-table-column label="状态">
                <template slot-scope="scope">{{type[scope.row.state]}}</template>
              </el-table-column>
              <el-table-column label="操作" width="280" class="buttongroup">
                <template slot-scope="scope">
                  <el-button
                    type="warning"
                    size="mini"
                    @click="handleClick(0,scope.row,'state')"
                    v-if="scope.row.state==1"
                  >停用</el-button>
                  <el-button type="primary" size="mini" @click="handleClick(1,scope.row,'state')" v-else>启用</el-button>
                  <el-button
                    type="warning"
                    size="mini"
                    @click="handleClick(0,scope.row,'top')"
                    v-if="scope.row.top==1"
                  >取消置顶</el-button>
                  <el-button type="warning" size="mini" @click="handleClick(1,scope.row,'top')" v-else>置顶</el-button>
                  <el-button type="danger" size="mini" @click="handleClick(3,scope.row,'del')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加公告 -->
    <el-dialog :title="activeName==1?'添加公告':'添加帮助'" :visible.sync="dialogVisible">
      <el-form :model="formData">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="formData.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input v-model="formData.content" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch v-model="formData.state" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="是否置顶" :label-width="formLabelWidth">
          <el-switch v-model="formData.top" active-value="1" inactive-value="0"></el-switch>
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
      activeName: "1",
      formData: {
        title: "",
        content: "",
        state: "1",
        top: "1",
        type: ""
      },
      include: "1",
      formLabelWidth: "80px",
      dialogVisible: false,
      state: -1,
      tableData: [],
      type: { 0: "停用", 1: "启用", 2: "停用", 3: "删除" },
      zdtype: { 0: "未置顶", 1: "置顶" }
    };
  },
  watch:{
    activeName:function(val){
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  methods: {
    showdialog(type) {
      this.formData.type = type;
      this.dialogVisible = true;
    },
    setorderSwitch() {
      this.getList();
    },
    handleClick(type, row,action) {
      var _this = this;
      var data = {
        id: row.id,
        v: type,
        action:action
      };
      this.postAxios("notice/handler", data).then(res => {
        if (res.code == 0) {
          _this.getList();
          this.$message({
            type: "success",
            message: "操作成功!",
            duration: 2000,
            showClose: true
          });
        }
      });
    },
    submitAdd() {
      var _this = this;
      var data = this.formData;
      this.postAxios2("notice/add", data).then(res => {
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
      this.postAxios("notice/list", {
        include: Number(this.include),
        type: this.activeName
      }).then(res => {
        this.tableData = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  margin: 5px;
}
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