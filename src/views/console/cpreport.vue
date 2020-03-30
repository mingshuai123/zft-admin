<template>
  <div class="mytask-container">
    <!-- <div class="page-title">
      <div class="left">商户概况</div>
    </div>-->
    <div class="mytaskitem">
      <div class="item-title">
        <span class="name">
          <i class="el-icon-menu" />商户概况
        </span>
      </div>
      <div class="mytaskitem">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="选择日期">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="date"
              style="width: 100%;"
              value-format="yyyy-MM-dd"
              align="right"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div>每页30条 共10页</div> -->
      <div class="item-content">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="cpName" label="商户名"></el-table-column>
          <el-table-column prop="cpId" label="商户ID"></el-table-column>
          <el-table-column label="流水合计" width="180">
            <template slot-scope="scope">￥{{ Number(scope.row.amount) }}</template>
          </el-table-column>
          <el-table-column label="收到订单">
            <template slot-scope="scope">{{scope.row.totalOrderCnt}}个</template>
          </el-table-column>
          <el-table-column label="完成订单">
            <template slot-scope="scope">{{scope.row.finishOrderCnt}}个</template>
          </el-table-column>
          <el-table-column label="分成获利">
            <template slot-scope="scope">￥{{ Number(scope.row.cpCommission) }}</template>
          </el-table-column>
          <el-table-column label="应结算金额">
            <template
              slot-scope="scope"
            >￥{{ Number(scope.row.amount)- Number(scope.row.cpCommission)}}</template>
          </el-table-column>
          <el-table-column label="微信分成比例">
            <template slot-scope="scope">{{ (Number(scope.row.wxRatio)*100).toFixed(2)+'%' }}</template>
          </el-table-column>
          <el-table-column label="支付宝分成比例">
            <template slot-scope="scope">{{ (Number(scope.row.alipayRatio)*100).toFixed(2)+'%' }}</template>
          </el-table-column>
          <el-table-column label="云闪付分成比例">
            <template slot-scope="scope">{{ (Number(scope.row.unionpayRatio)*100).toFixed(2)+'%' }}</template>
          </el-table-column>
          <el-table-column label="银行卡分成比例">
            <template slot-scope="scope">{{ (Number(scope.row.bankRatio)*100).toFixed(2)+'%' }}</template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100PX" v-if="roleId==1">
            <template slot-scope="scope">
              <el-button size="mini" @click="detail(scope.row.cpId)" type="primary">每日报表</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoleId } from "@/utils/auth";
export default {
  name: "Mytask",
  data() {
    return {
      roleId: "",
      tableData: [],
      date: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  watch: {
    date: function() {
      this.getReport();
    }
  },
  created() {
    this.roleId = getRoleId();
    this.date = this.getNowFormatDate();
  },
  methods: {
    detail(id) {
      this.$router.push({ name: "cpdayreport", query: { id: id } });
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    getReport() {
      var data = {
        date: this.date
      };
      this.postAxios("cp/report", data).then(res => {
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
      display: flex;
      flex-wrap: wrap;
      padding: 0 10px;
      .item {
        width: 20%;
        margin: 20px;
        el-card {
          padding: 20px;
          width: 100%;
        }
      }
    }
    .mytaskitem {
      padding: 20px;
      // border: 1px solid #e6e6e6;
      background: #fff;
      border-radius: 5px;
      margin-bottom: 20px;
      .item-title {
        line-height: 30px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        color: cornflowerblue;
        font-size: 14px;
        .name {
          font-weight: bold;
          color: #333333;
          font-size: 18px;
        }
      }
      .item-content {
        padding: 0 10px;
        .tables {
          display: flex;
          .item {
            flex: 1;
            table {
              border-collapse: collapse;
              td {
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