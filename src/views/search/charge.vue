<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" />充值查询
      </div>
    </div>
    <div class="mytaskitem">
      <!-- 筛选条件 -->
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="充值订单ID">
          <el-input v-model="searchData.orderId" placeholder="订单ID"></el-input>
        </el-form-item>
        <el-form-item label="充值时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择开始日期"
              v-model="searchData.createStartDate"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">--</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择截止日期"
              v-model="searchData.createEndDate"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="申请人ID">
          <el-input v-model="searchData.uid" placeholder="申请人ID"></el-input>
        </el-form-item>
        <el-form-item label="完成时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择开始日期"
              v-model="searchData.finishStartDate"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="1">--</el-col>
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择截止日期"
              v-model="searchData.finishEndDate"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="申请人手机号">
          <el-input v-model="searchData.mobile" placeholder="申请人手机号"></el-input>
        </el-form-item>
        <el-form-item label="充值状态">
          <el-select v-model="searchData.state" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格  -->
      <div>每页{{pageDate.pageSize}}条 共{{pageDate.pages}}页</div>
      <div class="item-content">
        <el-table :data="tableData" border empty-text="暂无数据" style="width: 100%">
          <el-table-column prop="orderId" label="充值单ID" width="210"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{stateCN[scope.row.state]}}</template>
          </el-table-column>
          <el-table-column label="申请人">
             <template slot-scope="scope">
               <span style="font-weight:bold;">{{scope.row.username}}</span>{{scope.row.mobile?'('+scope.row.mobile+')':'' }}
             </template>
          </el-table-column>
          <el-table-column label="金额" sortable prop="amount" width="180">
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
        v-if='pageDate.pages'
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
import { roleName } from "@/utils/validate";
import { getList } from "@/api/user";
import waves from "@/directive/waves"; // waves directive
export default {
  name: "Mytask",
  directives: { waves },
  data() {
    return {
      searchData: {
        orderId: null,
        uid: null,
        createStartDate: null,
        createEndDate: null,
        finishStartDate: null,
        finishEndDate: null,
        state: null,
        mobile:null
      },
      options: [
        { value: null, label: "全部" },
        { value: 0, label: "待付款" },
        { value: 1, label: "确认付款" },
        { value: 2, label: "确认到账" },
        { value: 3, label: "超时" },
        { value: 4, label: "后台关闭" },
      ],
      stateCN: {
        0: "待付款",
        1: "确认付款",
        2: "确认到账",
        3: "超时",
        4: "后台关闭",
      },
      pageDate: { pageSize: 0, pages: 10, pageNum: 1 },
      tableData: []
    };
  },
  watch: {},
  created() {
    if (sessionStorage.getItem("state")) {
      this.searchData.state = Number(sessionStorage.getItem("state"));
      sessionStorage.removeItem("state");
    }
    if (sessionStorage.getItem("userid")) {
      this.searchData.uid = Number(sessionStorage.getItem("userid"));
      sessionStorage.removeItem("userid");
    }
    this.getList();
  },
  methods: {
    handleCurrentChange(n) {
      var _this = this;
      var data = this.searchData;
      this.postAxios2("charge/search", data, { pn: n }).then(res => {
        this.pageDate = res.data;
        this.tableData = res.data.list;
      });
    },
    onSubmit() {
      this.pageDate= { pageSize: 0, pages: 1, pageNum: 1 };
      this.getList();
    },
    getList() {
      var _this = this;
      var data = this.searchData;
      this.postAxios2("charge/search", data, {
        pn: this.pageDate.pageNum
      }).then(res => {
        console.log(res);
        this.pageDate = res.data;
        this.tableData = res.data.list;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>