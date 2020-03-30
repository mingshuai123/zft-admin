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
          <el-radio-button :label="6" class="btn-radio">已查看</el-radio-button>
          <el-radio-button :label="7" class="btn-radio">已支付</el-radio-button>
          <el-radio-button :label="8" class="btn-radio">确认完成</el-radio-button>
          <el-radio-button :label="9" class="btn-radio">金额不符</el-radio-button>
          <el-radio-button :label="10" class="btn-radio">未收到款</el-radio-button>
          <el-radio-button :label="11" class="btn-radio">确认关闭</el-radio-button>
          <el-radio-button :label="100" class="btn-radio">问题订单</el-radio-button>
          <el-radio-button :label="101" class="btn-radio">待处理订单</el-radio-button>
        </el-radio-group>
      </div>
      <div class="pageinfo">每页{{pageDate.pageSize}}条 共{{pageDate.pages}}页</div>
      <div class="item-content">
        <el-table
          :data="tableData"
          border
          empty-text="暂无数据"
          style="width: 100%"
          size="small"
          :header-row-style="options"
        >
          <el-table-column prop="orderId" label="订单ID" width="180"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{stateCN[scope.row.state]}}</template>
          </el-table-column>
          <el-table-column prop="createdDate" label="生成时间" width="135"></el-table-column>
          <el-table-column label="金额">
            <template slot-scope="scope">￥{{ Number(scope.row.amount) }}</template>
          </el-table-column>
          <el-table-column label="提交金额">
            <template slot-scope="scope">￥{{ Number(scope.row.confirmAmount) }}</template>
          </el-table-column>
          <el-table-column label="收款方式">
            <template slot-scope="scope">{{ typeCN[scope.row.payType]}}</template>
          </el-table-column>
          <el-table-column label="收款账号">
            <template
              slot-scope="scope"
            >{{ (scope.row.state==0||scope.row.orderPayeeAccount==null)?'':(scope.row.payType=='wx'?scope.row.orderPayeeAccount.realname:scope.row.orderPayeeAccount.accountNo)}}</template>
          </el-table-column>
          <el-table-column label="附言" width="180">
            <template slot-scope="scope">{{ scope.row.memo}}</template>
          </el-table-column>
          <el-table-column prop="cpOrderId" label="订单来源ID" width="90"></el-table-column>
          <el-table-column label="接单员" width="130">
            <template
              slot-scope="scope"
            >{{scope.row.username}}{{scope.row.mobile?'('+scope.row.mobile+')':'' }}</template>
          </el-table-column>
          <el-table-column label="红利">
            <template slot-scope="scope">￥{{ Number(scope.row.awardAmount)}}</template>
          </el-table-column>
          <el-table-column label="商户提成">
            <template
              slot-scope="scope"
            >￥{{ (Number(scope.row.cpRatio)*Number(scope.row.amount)).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="cpName" label="商户"></el-table-column>
          <el-table-column prop="userGetDate" label="接单时间" width="135"></el-table-column>
          <el-table-column prop="finishDate" label="完成时间" width="135"></el-table-column>
          <el-table-column label="操作" fixed="right" width="260">
            <template slot-scope="scope">
              <div style="display:flex;margin:5px auto;">
                <el-button
                  class="button"
                  type="primary"
                  size="mini"
                  @click="openskfs(scope.row)"
                >收款方式</el-button>
                <el-button
                  class="button"
                  type="primary"
                  size="mini"
                  @click="watchqrcode(scope.row)"
                >收款凭证</el-button>
                <!-- <el-button
                  class="button"
                  type="primary"
                  size="mini"
                  @click="stopOrder(scope.row)"
                >关闭订单</el-button>-->
                <el-button
                  class="button"
                  type="primary"
                  size="mini"
                  @click="finishdialog(scope.row)"
                >完成该单</el-button>
              </div>
              <div style="display:flex;margin:5px auto;">
                <el-button
                  class="button"
                  type="primary"
                  size="mini"
                  style="width:75px;"
                  @click="repairclick(scope.row)"
                >补 单</el-button>
                <el-button
                  class="button"
                  type="primary"
                  size="mini"
                  @click="backclick(scope.row)"
                >退 单</el-button>
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
    <!-- 收款方式 -->
    <el-dialog title="查看收款方式" :visible.sync="dialogVisible4" width="60%">
      <div class="item">收款方式:{{skfs.payType}}</div>
      <div
        class="item"
      >收款人:{{skfs.orderPayeeAccount?(skfs.orderPayeeAccount.channel=='wx'?skfs.orderPayeeAccount.realname:skfs.orderPayeeAccount.accountNo):'--'}}</div>
      <img
        :src="skfs.orderPayeeAccount?'https://res.zhifutongzhushou.com/'+skfs.orderPayeeAccount.qrcode:''"
        alt
        style="display:block;margin:10px auto;width:200px"
      />
    </el-dialog>
    <!-- 查看收款凭证 -->
    <el-dialog title="查看收款凭证" :visible.sync="dialogVisible" width="50%" center>
      <!-- <div>收款方式:{{qrcodeTitle}}</div> -->
      <!-- <div>收款人:{{qrcodeinfo.accountNo}}</div> -->
      <img :src="qrcode" alt style="display:block;margin:10px auto;width:300px" />
    </el-dialog>
    <!-- 退单 -->
    <el-dialog title="退单" :visible.sync="dialogVisible2" width="30%" center>
      <div class="item">是否关闭订单？关闭后，订单将失败。</div>
      <div>订单金额：￥{{nowitem.amount}}</div>
      <div>退还保证金：￥{{nowitem.confirmAmount}}</div>
      <div>扣除红利：￥{{nowitem.awardAmount}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitback">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 补单 -->
    <el-dialog title="补单" :visible.sync="dialogVisible3" width="40%" center>
      <div class="item" v-if="nowitem.state!=5&&nowitem.state!=8">是否补单？本订单将成功完成。</div>
      <div v-if="nowitem.state!=5&&nowitem.state!=8">扣除冻结保证金：￥{{nowitem.amount}}</div>
      <div v-if="nowitem.state!=5&&nowitem.state!=8">发放红利：￥{{nowitem.awardAmount}}</div>
      <el-form :inline="true">
        <el-form-item label="补单金额">
          <el-input v-model="postData.amount" type="number" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div>请输入需要补充的金额（可以为负值，补单订单将立即成功完成）。</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitrepair">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 完成 -->
    <el-dialog title="完成订单" :visible.sync="dialogVisible5" width="40%" center>
      <div class="item">是否完成订单？订单将成功完成。</div>
      <div>订单金额: ￥{{nowitem.amount}}</div>
      <div>用户保证金: ￥{{nowitem.amount}}</div>
      <div>发放红利：￥{{nowitem.awardAmount}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="finish">确 定</el-button>
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
      dialogVisible4: false,
      dialogVisible5: false,
      skfs: [],
      qrcodeTitle: "",
      qrcodeinfo: {},
      qrcode: null,
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
        //6: "已查看",
        7: "已支付",
        8: "确认完成",
        9: "金额不符",
        10: "未收到款",
        11: "确认关闭",
        100: "问题订单",
        101: "待处理"
      },
      postData: {
        id: 0,
        amount: null
      },
      nowitem: {},
      options: { height: "50px" }
    };
  },
  watch: {
    state: function(val) {
      this.pageDate = { pageSize: 0, pages: 1, pageNum: 1 };
      this.getList();
    }
  },
  created() {
    if (sessionStorage.getItem("state")) {
      this.state = Number(sessionStorage.getItem("state"));
      sessionStorage.removeItem("state");
    }
    this.getList();
  },
  methods: {
    finishdialog(info) {
      this.nowitem = info;
      this.dialogVisible5 = true;
    },
    finish() {
      var _this = this;
      var info = this.nowitem;
      var data = { id: info.id };
      this.postAxios("order/finish", data).then(res => {
        var str = res.code == 0 ? "success" : "error";
        this.$message({
          type: str,
          duration: 2000,
          message: res.message,
          onClose: function() {
            _this.dialogVisible5 = false;
            _this.getList();
          }
        });
      });
    },
    openskfs(info) {
      if (info.state == 0) {
        this.$message.error("未接单");
      } else {
        this.skfs = info;
        this.dialogVisible4 = true;
      }
    },
    stopOrder(info) {
      var _this = this;
      this.$confirm("关闭该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var data = {
            id: info.id,
            uid: info.uid,
            type: "stop",
            memo: ""
          };
          this.postAxios2("order/handler", {}, data).then(res => {
            if (res.code == 0) {
              _this.$message({
                duration: 2000,
                type: "success",
                message: "操作成功",
                onClose: function() {
                  _this.getList();
                }
              });
            } else {
              this.$message.error(res.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    watchqrcode(info) {
      this.qrcodeinfo = info;
      this.qrcode = "https://res.zhifutongzhushou.com" + info.certImg;
      // this.qrcodeTitle = this.typeCN[info.channel];
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
      var _this = this;
      this.postAxios("order/back", data).then(res => {
        this.$message({
          type: "error",
          duration: 2000,
          message: res.message,
          onClose: function() {
            _this.dialogVisible2 = false;
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
            _this.postData.amount = null;
            _this.dialogVisible3 = false;
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
      this.dialogVisible = false;
      this.dialogVisible2 = false;
      this.dialogVisible3 = false;
      this.dialogVisible4 = false;
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
.button {
  width: 75px;
  margin: 3px;
}
.item {
  line-height: 40px;
  font-size: 16px;
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
}
</style>