<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">
        <i class="el-icon-bell" />订单
      </div>
    </div>
    <div class="mytaskitem">
      <!-- <el-form :inline="true" :model="searchData" class="demo-form-inline">
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
      </el-form>-->
      <div class="pageinfo">每页{{pageDate.pageSize}}条 共{{pageDate.pages}}页</div>
      <div class="item-content">
        <el-table :data="tableData" border empty-text="暂无数据" style="width: 100%" >
          <el-table-column prop="orderId" label="订单ID"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{stateCN[scope.row.state]}}</template>
          </el-table-column>
          <el-table-column prop="createdDate" label="生成时间"></el-table-column>
          <el-table-column label="金额" sortable prop="amount">
            <template slot-scope="scope">￥{{ Number(scope.row.amount) }}</template>
          </el-table-column>
          <el-table-column label="收款方式">
            <template slot-scope="scope">{{ typeCN[scope.row.payType]}}</template>
          </el-table-column>
          <el-table-column label="收款账号">
            <template
              slot-scope="scope"
            >{{ (scope.row.state==0||scope.row.orderPayeeAccoun==null)?'':(scope.row.payType=='wx'?scope.row.orderPayeeAccount.realname:scope.row.orderPayeeAccount.accountNo)}}</template>
          </el-table-column>
          <el-table-column label="附言">
            <template slot-scope="scope">{{ scope.row.memo}}</template>
          </el-table-column>
          <el-table-column prop="cpOrderId" label="订单来源ID"></el-table-column>
          <el-table-column label="接单员">
            <template
              slot-scope="scope"
            >{{scope.row.mobile}}{{scope.row.username?'('+scope.row.username+')':'' }}</template>
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
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-around;margin:10px auto;">
                <el-button
                  class="button"
                  type="primary"
                  size="mini"
                  @click="qrcodeshow(scope.row)"
                >收款方式</el-button>
                <el-button class="button" type="primary" size="mini" @click="payurl(scope.row)">支付页</el-button>

                <!-- <el-button type="primary" class="button" size="mini">关闭订单</el-button> -->
              </div>
              <!-- <div style="display:flex;justify-content:space-around;margin:10px auto;">
                <el-button type="primary" size="mini" @click="repairclick(scope.row)">补单</el-button>
                <el-button
                  class="button"
                  type="primary"
                  size="mini"
                  @click="backclick(scope.row)"
                >退单</el-button>
                <el-button class="button" type="primary" size="mini" @click="payurl(scope.row)">支付页</el-button>
              </div> -->
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
    <el-dialog title="收款方式" :visible.sync="dialogVisible" width="50%" center>
      <div>收款方式:{{title}}</div>
      <div>收款人:{{qrcodeinfo.realname?qrcodeinfo.realname:qrcodeinfo.accountNo}}</div>
      <img :src="qrcode" style="display:block;margin:20px auto;width:200px;" alt="二维码" />
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
    <el-dialog :visible.sync="dialogVisible4" width="30%" :before-close="closeloding">
      <div v-loading="dialogVisible4" element-loading-text="等待接单" style="height:300px"></div>
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
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      qrcode: null,
      title: null,
      qrcodeinfo: {},
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
        { value: 7, label: "已支付" }
      ],
      pageDate: { pageSize: 0, pages: 10, pageNum: 1 },
      tableData: [],
      postData: {
        id: 0,
        amount: null
      },
      nowitem: {},
      urldata: {},
      payUrl: "",
      timeNmae: null
    };
  },
  watch: {},
  created() {
    console.log(this.stateCN)
    this.roleId = getRoleId();
    this.searchData.cpId = JSON.parse(sessionStorage.getItem("logininfo")).cpId;
    this.getList();
  },
  methods: {
    payurl(info) {
      var data = {
        cp_id: info.cpId,
        order_id: info.orderId
      };
      this.postAxios("cp/payment/param/get", data).then(res => {
        if (res.code == 0) {
          this.payUrl = res.data;
          this.urldata = this.parseQueryString(res.data);
          this.getDetail();
        }
      });
    },
    parseQueryString(url) {
      var params = {};
      var arr = url.split("?");
      if (arr.length <= 1) {
        return params;
      }
      arr = arr[1].split("&");
      for (var i = 0, l = arr.length; i < l; i++) {
        var a = arr[i].split("=");
        params[a[0]] = a[1];
      }
      return params;
    },
    getDetail() {
      var _this = this;
      var postData = {
        cpId: _this.urldata.cpId,
        orderId: _this.urldata.orderId,
        time: _this.urldata.time,
        nonce: _this.urldata.nonce,
        sign: _this.urldata.sign
      };
      var postUrl = "https://www.zhifutongzhushou.com/api/order/cp/get";
      for (var key in postData) {
        if (postUrl.indexOf("?") < 0) {
          postUrl = postUrl + "?" + key + "=" + postData[key];
        } else {
          postUrl = postUrl + "&" + key + "=" + postData[key];
        }
      }
      this.postAxios3(postUrl, {}).then(res => {
        clearInterval(_this.timeNmae);
        this.dialogVisible4 = true;
        if (res.code == 0 && res.data.state != 0) {
          this.dialogVisible4 = false;
          // loading.close();
          window.open(this.payUrl);
        } else {
          this.timeNmae = setInterval(() => {
            _this.getDetail();
          }, 5000);
        }
      });
    },
    closeloding() {
      clearInterval(this.timeNmae);
      this.dialogVisible4 = false;
    },
    qrcodeshow(info) {
      if (info.state == 0) {
        this.payurl(info);
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
  width: 80px;
}
</style>