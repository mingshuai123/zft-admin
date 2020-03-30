<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">商户概况</div>
    </div>
    <div class="mytaskitem">
      <!-- <div class="item-title">
        <span class="name">
          <i class="el-icon-menu" />每日报表（30天）
        </span>
      </div> -->
      <!-- <div>每页30条 共10页</div> -->
      <div class="item-content">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="day" label="日期" width="180"></el-table-column>
          <el-table-column label="流水合计" width="180">
            <template slot-scope="scope">￥{{ Number(scope.row.totalAmount) }}</template>
          </el-table-column>
          <el-table-column label="完成/收到订单">
            <template slot-scope="scope">{{scope.row.finishOrderCnt}}个 / {{scope.row.receOrderCnt}}个</template>
          </el-table-column>
          <el-table-column label="订单完成率">
            <template slot-scope="scope">{{scope.row.receOrderCnt==0?0:Number(scope.row.finishOrderCnt/scope.row.receOrderCnt*100).toFixed(2)}}%</template>
          </el-table-column>
          <!-- <el-table-column label="充值金额">
            <template slot-scope="scope">￥{{ Number(scope.row.chargeAmount) }}</template>
          </el-table-column>
          <el-table-column label="提现金额">
            <template slot-scope="scope">￥{{ Number(scope.row.withdrawAmount) }}</template>
          </el-table-column> -->
          <el-table-column label="红利合计">
            <template slot-scope="scope">￥{{ Number(scope.row.awardAmount) }}</template>
          </el-table-column>
          <el-table-column label="接单用户">
            <template slot-scope="scope">{{ scope.row.userCnt }}人</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { roleName } from "@/utils/validate";
import { getList } from "@/api/user";

export default {
  name: "Mytask",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          total: "王小虎",
          nums: "100个/100个",
          money: 1000,
          money2: 1000,
          money3: 1000,
          member: 40
        },
        {
          date: "2016-05-02",
          total: "王小虎",
          nums: "100个/100个",
          money: 1000,
          money2: 1000,
          money3: 1000,
          member: 40
        },
        {
          date: "2016-05-02",
          total: "王小虎",
          nums: "100个/100个",
          money: 1000,
          money2: 1000,
          money3: 1000,
          member: 40
        }
      ]
    };
  },

  created() {
    this.getReport();
  },
  methods: {
    getReport() {
      this.postAxios("admin/report").then(res => {
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