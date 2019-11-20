<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" /> 订单流水（30天）
      </div>
    </div>
    <div class="mytaskitem">
      <div class="flexlabel">
        <span class="name">任务状态</span>
        <el-radio-group class="label" v-model="state" size="medium" border>
          <el-radio-button :label="-1" class="btn-radio">全部</el-radio-button>
          <el-radio-button :label="0" class="btn-radio">未分配</el-radio-button>
          <el-radio-button :label="1" class="btn-radio">已分配</el-radio-button>
          <el-radio-button :label="2" class="btn-radio">已接单</el-radio-button>
          <el-radio-button :label="3" class="btn-radio">超时</el-radio-button>
          <el-radio-button :label="4" class="btn-radio">关闭</el-radio-button>
          <el-radio-button :label="5" class="btn-radio">完成</el-radio-button>
        </el-radio-group>
      </div>
      <div>每页{{pageDate.pageSize}}条 共{{pageDate.pages}}页</div>
      <div class="item-content">
        <el-table :data="tableData" border empty-text="暂无数据" style="width: 100%">
          <el-table-column prop="orderId" label="订单ID"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{stateCN[scope.row.state]}}</template>
          </el-table-column>
          <el-table-column prop="createdDate" label="生成时间"></el-table-column>
          <el-table-column label="金额" sortable prop="amount">
            <template slot-scope="scope">￥{{ Number(scope.row.amount) }}</template>
          </el-table-column>
          <el-table-column label="收款方式">
            <template slot-scope="scope">{{ typeCN[scope.row.orderPayeeAccount.channel]}}</template>
          </el-table-column>
          <el-table-column label="接单员">
            <template
              slot-scope="scope"
            >{{scope.row.mobile}}{{scope.row.username?'('+scope.row.username+')':'' }}</template>
          </el-table-column>
          <el-table-column label="红利">
            <template slot-scope="scope">￥{{ Number(scope.row.awardAmount)}}</template>
          </el-table-column>
          <el-table-column label="商户提成">
            <template slot-scope="scope">￥{{ (Number(scope.row.cpRatio)*Number(scope.row.amount)).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="cpName" label="商户"></el-table-column>
          <el-table-column prop="userGetDate" label="接单时间"></el-table-column>
          <el-table-column prop="finishDate" label="完成时间"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-around;margin:10px auto;">
                <el-button
                  type="primary"
                  size="mini"
                  @click="qrcodeshow(scope.row.orderPayeeAccount)"
                >收款方式</el-button>
                <el-button type="primary" size="mini">关闭订单</el-button>
              </div>
              <div style="display:flex;justify-content:space-around;">
                <el-button type="primary" size="mini" @click="repairclick(scope.row)">补单</el-button>
                <el-button type="primary" size="mini" @click="backclick(scope.row)">退单</el-button>
              </div>
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
    <!-- 二维码 -->
    <el-dialog title="收款方式" :visible.sync="dialogVisible" width="30%" center>
      <div>收款方式:{{title}}</div>
      <img :src="qrcode" alt style="display:block;margin:0 auto;" />
    </el-dialog>
    <!-- 退单 -->
    <el-dialog title="退单" :visible.sync="dialogVisible2" width="30%" center>
      <div>确认退单么？</div>
      <div>退单金额：￥{{nowitem.amount}}</div>
      <div>退还保证金：￥{{nowitem.amount}}</div>
      <div>扣除红利：￥{{nowitem.awardAmount}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitback">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 补单 -->
    <el-dialog title="补单" :visible.sync="dialogVisible3" width="30%" center>
      <div>确认补单么？</div>
      <div>
        <el-form :inline="true">
          <el-form-item label="补单金额">
            <el-input v-model="postData.amount" type="number"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>扣除冻结保证金：￥{{nowitem.amount}}</div>
      <div>发放红利：￥{{nowitem.awardAmount}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitrepair">确 定</el-button>
      </span>
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
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      qrcode: null,
      title: null,
      state: -1,
      pageDate: { pageSize: 0, pages: 10, pageNum: 1 },
      tableData: [],
      typeCN: {
        bank: "银行卡",
        alipay: "支付宝",
        wx: "微信",
        unionpay: "云闪付"
      },
      stateCN: {
        0: "未分配",
        1: "已分配",
        2: "已接单",
        3: "超时",
        4: "关闭",
        5: "完成",
        6: "已查看",
        7: "已支付"
      },
      postData: {
        id: 0,
        amount: null
      },
      nowitem: {}
    };
  },
  watch: {
    state: function(val) {
      console.log(val);
      this.getList();
    }
  },
  created() {
    this.getList();
  },
  methods: {
    qrcodeshow(info) {
      this.qrcode = "http://static.jesport.com/zft" + info.qrcode;
      this.title = this.typeCN[info.channel];
      this.dialogVisible = true;
    },
    repairclick(info) {
      this.nowitem = info;
      this.dialogVisible3 = true;
    },
    backclick(info) {
      this.nowitem = info;
      this.dialogVisible2 = true;
    },
    submitback() {
      var data = { id: this.nowitem.id };
      this.postAxios("order/back", data).then(res => {
        this.$message({
          type: "error",
          duration: 2000,
          message: res.message,
          onClose: function() {
            _this.dialogVisible2=false;
            _this.getList();
          }
        });
      });
    },
    submitrepair() {
      var _this = this;
      var data = { id: this.nowitem.id, amount: this.postData.amount };
      this.postAxios("order/repair", data).then(res => {
        this.$message({
          type: "error",
          duration: 2000,
          message: res.message,
          onClose: function() {
            _this.postData.amount=null;
            _this.dialogVisible3=false;
            _this.getList();
          }
        });
      });
    },
    handleCurrentChange(n) {
      var _this = this;
      var data = { pn: n, state: this.state };
      this.postAxios("order/list", data).then(res => {
        this.pageDate = res.data;
        this.tableData = res.data.list;
      });
    },
    getList() {
      var _this = this;
      var data = { pn: this.pageDate.pageNum, state: this.state };
      this.postAxios("order/list", data).then(res => {
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