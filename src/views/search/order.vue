<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" />订单查询
      </div>
    </div>
    <div class="mytaskitem">
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="订单ID">
          <el-input v-model="searchData.orderId" placeholder="订单ID"></el-input>
        </el-form-item>
        <el-form-item label="申请人ID">
          <el-input v-model="searchData.uid" placeholder="请输入申请人ID"></el-input>
        </el-form-item>
        <el-form-item label="生成时间">
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
        <el-form-item label="商户ID" v-if="roleId==1">
          <el-input v-model="searchData.cpId" placeholder="商户ID"></el-input>
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
          <el-input v-model="searchData.mobile" placeholder="请输入申请人手机号"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchData.state" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-col :span="11">
            <el-input v-model="searchData.minAmount" placeholder="请输入最小值"></el-input>
          </el-col>
          <el-col class="line" :span="1">--</el-col>
          <el-col :span="11">
            <el-input v-model="searchData.maxAmount" placeholder="请输入最大值"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="pageinfo">每页{{pageDate.pageSize}}条 共{{pageDate.pages}}页</div>
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
            <template
              slot-scope="scope"
            >{{ scope.row.state==0||scope.row.orderPayeeAccount==null?'未接单':typeCN[scope.row.orderPayeeAccount.channel]}}</template>
          </el-table-column>
          <el-table-column label="收款账号">
            <template
              slot-scope="scope"
            >{{ scope.row.state==0||scope.row.orderPayeeAccount==null?'未接单':scope.row.orderPayeeAccount.accountNo}}</template>
          </el-table-column>
          <el-table-column label="附言">
            <template slot-scope="scope">{{ scope.row.memo}}</template>
          </el-table-column>
          <el-table-column prop="cpOrderId" label="订单来源ID"></el-table-column>
          <el-table-column label="接单员">
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
          <el-table-column prop="userGetDate" label="接单时间"></el-table-column>
          <el-table-column prop="finishDate" label="完成时间"></el-table-column>
          <el-table-column label="操作" fixed="right" width="260">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-around;margin:5px auto;">
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
                <el-button class="button" type="primary" size="mini" @click="finishdialog(scope.row)">完成该单</el-button>
                <!-- <el-button class="button" type="primary" size="mini">关闭订单</el-button> -->
              </div>
              <div style="display:flex;margin:5px auto;">
                <el-button
                  class="button"
                  type="primary"
                  size="mini"
                  @click="repairclick(scope.row)"
                >补单</el-button>
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
import { getRoleId } from "@/utils/auth";
export default {
  name: "Mytask",
  directives: { waves },
  data() {
    return {
      roleId: 0,
      searchData: {
        orderId: null,
        uid: null,
        createStartDate: null,
        createEndDate: null,
        finishStartDate: null,
        finishEndDate: null,
        state: null,
        minAmount: null,
        maxAmount: null,
        mobile: null,
        cpId: null
      },
      skfs: [],
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      qrcode: null,
      title: null,
      typeCN: {
        bank: "银行卡",
        alipay: "支付宝",
        wx: "微信",
        unionpay: "云闪付"
      },
      options: [
        { value: null, label: "全部" },
        { value: 0, label: "未分配" },
        { value: 1, label: "已分配" },
        { value: 2, label: "已接单" },
        { value: 3, label: "超时" },
        { value: 4, label: "关闭" },
        { value: 5, label: "完成" },
        { value: 6, label: "已查看" },
        { value: 7, label: "已支付" },
        { value: 100, label: "待处理" },
        { value: 101, label: "问题订单" }
      ],
      pageDate: { pageSize: 0, pages: 10, pageNum: 1 },
      tableData: [],
      postData: {
        id: 0,
        amount: null
      },
      nowitem: {},
      qrcodeinfo: {}
    };
  },
  watch: {},
  created() {
    this.roleId = getRoleId();
    if (sessionStorage.getItem("state")) {
      this.searchData.state = Number(sessionStorage.getItem("state"));
      sessionStorage.removeItem("state");
    }
    if (sessionStorage.getItem("cpId")) {
      this.searchData.cpId = Number(sessionStorage.getItem("cpId"));
      sessionStorage.removeItem("cpId");
    }
    if (sessionStorage.getItem("userid")) {
      this.searchData.uid = Number(sessionStorage.getItem("userid"));
      sessionStorage.removeItem("userid");
    }
    if (sessionStorage.getItem("day")) {
      this.searchData.createStartDate = sessionStorage.getItem("day");
      this.searchData.createEndDate = sessionStorage.getItem("day");
      sessionStorage.removeItem("day");
    }
    this.getList();
  },
  methods: {
    openskfs(info) {
      if (info.state == 0) {
        this.$message.error("未接单");
      } else {
        this.skfs = info;
        this.dialogVisible4 = true;
      }
    },
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
    watchqrcode(info) {
      this.qrcodeinfo = info;
      this.qrcode = "https://res.zhifutongzhushou.com" + info.certImg;
      // this.qrcodeTitle = this.typeCN[info.channel];
      this.dialogVisible = true;
    },
    qrcodeshow(info) {
      if (info.state == 0) {
        this.$message.error("未接单");
      } else {
        this.qrcodeinfo = info.orderPayeeAccount;
        this.qrcode =
          "https://res.zhifutongzhushou.com" + info.orderPayeeAccount.qrcode;
        this.title = this.typeCN[info.payType];
        this.dialogVisible = true;
      }
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
      var _this=this;
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
      var data = this.searchData;
      this.postAxios2("order/search", data, { pn: n }).then(res => {
        this.pageDate = res.data;
        this.tableData = res.data.list;
      });
    },
    onSubmit() {
      this.pageDate.pageNum = 1;
      this.pageDate = { pageSize: 0, pages: 1, pageNum: 1 };
      this.getList();
    },
    getList() {
      var _this = this;
      var data = this.searchData;
      this.postAxios2("order/search", data, { pn: this.pageDate.pageNum }).then(
        res => {
          this.pageDate = res.data;
          this.tableData = res.data.list;
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.button {
  width: 75px;
  margin: 3px;
}
.line {
  line-height: 45px;
}
</style>