<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" />用户查询
      </div>
    </div>
    <div class="mytaskitem">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="用户ID">
          <el-input v-model="searchData.id" placeholder="用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="searchData.name" placeholder="用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input v-model="searchData.mobile" placeholder="用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户上级">
          <el-input v-model="searchData.fatherId" placeholder="用户上级"></el-input>
        </el-form-item>
        <el-form-item label="用户级别">
          <el-select v-model="searchData.level" placeholder="请选择">
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
      <div>每页{{pageDate.pageSize}}条 共{{pageDate.pages}}页</div>
      <div class="item-content">
        <el-table :data="tableData" border empty-text="暂无数据" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="name" label="用户名"></el-table-column>
          <el-table-column prop="level" label="级别"></el-table-column>
          <el-table-column label="下级用户">
            <template slot-scope="scope">{{ Number(scope.row.childCnt) }}人</template>
          </el-table-column>
          <el-table-column prop="fatherId" label="上级ID"></el-table-column>
          <el-table-column label="保证金余额" sortable prop="frozenAmount" width="180">
            <template slot-scope="scope">￥{{ (scope.row.amount-scope.row.frozenAmount).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="红利余额" sortable prop="awardAmount" width="180">
            <template slot-scope="scope">￥{{ (scope.row.award-scope.row.frozenAward).toFixed(2)  }}</template>
          </el-table-column>
          <el-table-column prop="mobile" label="联系电话" width="113px"></el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="$router.push({name:'memberdetail',query:{id:scope.row.id}})">详情</el-button>
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
import { roleName } from "@/utils/validate";
import { getList } from "@/api/user";
import waves from "@/directive/waves"; // waves directive
export default {
  name: "Mytask",
  directives: { waves },
  data() {
    return {
      searchData: {
        id: null,
        fatherId: null,
        level: null,
        name:null,
        mobile:null
      },
      options: [
        { value: null, label: "全部" },
        { value: 1, label: "1" },
        { value: 2, label: "2" },
        { value: 3, label: "3" },
        
      ],
      stateCN: {
        0: "未分配",
        1: "已分配",
        2: "已接单",
        3: "超时",
        4: "关闭",
        5: "完成"
      },
      pageDate: { pageSize: 0, pages: 10, pageNum: 1 },
      tableData: []
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    handleCurrentChange(n) {
      var _this = this;
      var data = this.searchData;
      this.postAxios2("user/search",data, { pn: n }).then(res => {
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
      this.postAxios2("user/search", data,{ pn: this.pageDate.pageNum }).then(
        res => {
          console.log(res);
          this.pageDate = res.data;
          this.tableData = res.data.list;
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>

</style>