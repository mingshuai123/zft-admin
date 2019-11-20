<template>
  <div class="mytask-container">
    <div class="page-title">
      <div class="left">平台设置</div>
    </div>
    <div class="mytaskitem">
      <el-form ref="form" :model="pageData" label-width="80px">
      <span class="name">微信红利</span>
        <el-row>
          <el-col :span="6">
            <el-form-item label="一级用户" :inline="true">
              <el-input v-model="pageData.wx.level1" type="number" max="100"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级用户" :inline="true">
              <el-input v-model="pageData.wx.level2"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三级用户" :inline="true">
              <el-input v-model="pageData.wx.level3"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="四级用户" :inline="true">
              <el-input v-model="pageData.wx.level4"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
          <span class="name">支付宝红利</span>
        <el-row>
          <el-col :span="6">
            <el-form-item label="一级用户" :inline="true">
              <el-input v-model="pageData.alipay.level1" type="number" max="100"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级用户" :inline="true">
              <el-input v-model="pageData.alipay.level2"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三级用户" :inline="true">
              <el-input v-model="pageData.alipay.level3"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="四级用户" :inline="true">
              <el-input v-model="pageData.alipay.level4"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
          <span class="name">云闪付红利</span>
        <el-row>
          <el-col :span="6">
            <el-form-item label="一级用户" :inline="true">
              <el-input v-model="pageData.unionpay.level1" type="number" max="100"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级用户" :inline="true">
              <el-input v-model="pageData.unionpay.level2"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三级用户" :inline="true">
              <el-input v-model="pageData.unionpay.level3"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="四级用户" :inline="true">
              <el-input v-model="pageData.unionpay.level4"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
          <span class="name">银行卡红利</span>
        <el-row>
          <el-col :span="6">
            <el-form-item label="一级用户" :inline="true">
              <el-input v-model="pageData.bank.level1" type="number" max="100"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="二级用户" :inline="true">
              <el-input v-model="pageData.bank.level2"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="三级用户" :inline="true">
              <el-input v-model="pageData.bank.level3"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="四级用户" :inline="true">
              <el-input v-model="pageData.bank.level4"><template slot="append">%</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label-width="0">
              <el-button type="primary" @click="submit" style="display:block;margin:0 auto;">确认修改</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mytask",
  data() {
    return {
      pageData: {
        wx: {},
        alipay: {},
        unionpay: {},
        bank: {}
      }
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.postAxios("admin/levelratio/info").then(res => {
        var data = res.data;
        var pageData = {
          wx: {},
          alipay: {},
          unionpay: {},
          bank: {}
        };
        data.forEach(item => {
          pageData[item.type]["level" + item.level] = parseInt(
            item.ratio * 100
          );
        });
        this.pageData = pageData;
        console.log(pageData);
      });
    },
    submit() {
      var _this = this;
      var ratios = {wx:[],alipay:[],bank:[],unionpay:[]};
      var obj = this.pageData;
      for (let key in obj) {
        for(let yy in obj[key]){
          ratios[key].push(Number(obj[key][yy]));
        }
      }
      console.log(ratios)
      // var data = { ratios: ratios.join(",") };
      this.postAxios2("admin/levelratio/handler",ratios, {}).then(res => {
        if (res.code == 0) {
          _this.$message({
            duration: 2000,
            type: "success",
            message: "设置成功",
            onClose: function() {
              _this.getInfo();
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>