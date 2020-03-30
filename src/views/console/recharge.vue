<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" /> 充值申请
      </div>
    </div>
    <div class="mytaskitem">
      <div class="flexlabel">
        <span class="name">任务状态</span>
        <el-radio-group class="label" v-model="state" size="medium" border>
          <el-radio-button :label="-1" class="btn-radio">全部</el-radio-button>
          <el-radio-button :label="0" class="btn-radio">待付款</el-radio-button>
          <el-radio-button :label="1" class="btn-radio">确认付款</el-radio-button>
          <el-radio-button :label="2" class="btn-radio">确认到账</el-radio-button>
          <el-radio-button :label="3" class="btn-radio">超时</el-radio-button>
          <el-radio-button :label="4" class="btn-radio">后台失败</el-radio-button>
        </el-radio-group>
      </div>
      <div>每页{{pageDate.pageSize}}条 共{{pageDate.pages}}页</div>
      <div class="item-content">
        <el-table :data="tableData" border empty-text="暂无数据" style="width: 100%" >
          <el-table-column prop="orderId" label="充值单ID"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{stateCN[scope.row.state]}}</template>
          </el-table-column>
          <el-table-column label="申请人" min-width="130">
            <template
              slot-scope="scope"
            >{{scope.row.username?scope.row.username+'('+scope.row.mobile+')':scope.row.mobile }}</template>
          </el-table-column>
          <el-table-column label="金额" sortable prop="amount" >
            <template slot-scope="scope">￥{{ Number(scope.row.amount) }}</template>
          </el-table-column>
          <el-table-column prop="bankName" label="银行名称"></el-table-column>
          <el-table-column prop="accountNo" label="银行账号"></el-table-column>
          <el-table-column prop="finishDate" label="完成时间"></el-table-column>
          <el-table-column prop="createdDate" sortable label="申请时间"></el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="$router.push({name:'chargedetail',query:{id:scope.row.id}})"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :page-count="pageDate.pages"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
export default {
  name: "Mytask",
  directives: { waves },
  data() {
    return {
      state: -1,
      pageDate: { pageSize: 0, pages: 10, pageNum: 1 },
      tableData: [],
      stateCN: {
        0: "待付款",
        1: "确认付款 ",
        2: "确认到账",
        3: "超时",
        4: "后台失败"
      }
    };
  },
  watch: {
    state: function(val) {
      this.pageDate= { pageSize: 0, pages: 1, pageNum: 1 };
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleCurrentChange(n) {
      var _this = this;
      var data = { pn: n, state: this.state };
      this.postAxios("charge/list", data).then(res => {
        this.pageDate = res.data;
        this.tableData = res.data.list;
      });
    },
    getList() {
      var _this = this;
      var data = { pn: this.pageDate.pageNum, state: this.state };
      this.postAxios("charge/list", data).then(res => {
        console.log(res);
        this.pageDate = res.data;
        this.tableData = res.data.list;
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