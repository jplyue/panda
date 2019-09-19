<template>
  <div class="heightP100">
    <el-row :gutter="10" >

      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">用户：</span>
        <el-select v-model="usrId" class="width145"  clearable
                   remote
                   filterable
                   :remote-method="remoteMethod"
                   :loading="loading"
                   @focus="select"
                   placeholder="用户信息">
          <el-option
            v-for="(item,index) in usrOptions"
            :key="index"
            :label = "item.label"
            :value = "item.value">
          </el-option>
        </el-select>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">账户：</span>
        <el-select v-model="accountId" clearable class="width145"
                   remote
                   filterable
                   @focus="tt2"
                   :remote-method="remoteMethod2"
                   :loading="loading"
                   placeholder="账户信息">
          <el-option
            v-for="(item,index) in options2"
            :key="index"
            :label = "item.label"
            :value = "item.value">
          </el-option>
        </el-select>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">股票：</span>
        <el-select v-model="findkey"  clearable class="width180"
                   remote
                   filterable
                   :remote-method="querySearchAsync"
                   :loading="loading"
                   @focus="query"
                   placeholder="股票信息">
          <el-option
            v-for="(item,index) in stocOptions"
            :key="index"
            :label = "item.label"
            :value = "item.value">
          </el-option>
        </el-select>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <el-checkbox-group v-model="openDirect" size="small">
          <el-checkbox-button v-for="item in openDirects" :label="item.value" :key="item.value">{{item.name}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">持仓日期：</span>
        <el-date-picker value-format="yyyy-MM-dd" clearable class="width130" v-model="openDate" :editable="false" type="date" align="right" placeholder="开始日期" @change="dateChanged('openDate', $event)"  size="small">
        </el-date-picker>
      </div>
      <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
      <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
    </el-row>
    <el-row class="marginT10">
      <el-table v-loading="bTableLoading" :data="aTableData" border stripe  @row-click="selectedRow" class="label6-hover">
        <el-table-column fixed label="账户标识" width="120px" align="center" :resizable="false">
          <template slot-scope="scope">
            <span class="title-head">{{scope.row.accountAlias === '' ? '--': scope.row.accountAlias}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="用户标识" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.triggerUsrAlias === '' ? '--': scope.row.triggerUsrAlias}}
          </template>
        </el-table-column>
        <el-table-column fixed label="持仓日期" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.openDate === '' ? '--': scope.row.openDate}}
          </template>
        </el-table-column>
        <el-table-column label="股票代码" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.stockCode === '' ? '--': scope.row.stockCode}}
          </template>
        </el-table-column>
        <el-table-column label="股票名称" align="center" min-width="80px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.stockName === '' ? '--': scope.row.stockName}}
          </template>
        </el-table-column>
        <el-table-column label="开仓价格" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.openFirstPrice === '' ? '--': scope.row.openFirstPrice|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="持仓数量" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.openVolume === '' ? '--': scope.row.openVolume}}
          </template>
        </el-table-column>
        <el-table-column label="持仓金额" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.openAmount === '' ? '--': scope.row.openAmount|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="持仓均价" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.openAvgPrice === '' ? '--': scope.row.openAvgPrice|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="持仓市值" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.openMarketValue === '' ? '--': scope.row.openMarketValue|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="持仓盈亏" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.openProfitFeat > 0" class="red">
              {{scope.row.openProfitFeat === '' ? '--': scope.row.openProfitFeat|formatMoney}}
            </div>
            <div v-if="scope.row.openProfitFeat == 0">
              {{scope.row.openProfitFeat === '' ? '--': scope.row.openProfitFeat|formatMoney}}
            </div>
            <div v-if="scope.row.openProfitFeat < 0" class="green">
              {{scope.row.openProfitFeat === '' ? '--': scope.row.openProfitFeat|formatMoney}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="平仓数量" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.closeVolume === '' ? '--': scope.row.closeVolume}}
          </template>
        </el-table-column>
        <el-table-column label="平仓次数" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.hedgeCount === '' ? '--': scope.row.hedgeCount}}
          </template>
        </el-table-column>
        <el-table-column label="平仓胜率" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.hedgeProfitWincntRateFeat === '' ? '--': scope.row.hedgeProfitWincntRateFeat|percentageFormat(2)}}
          </template>
        </el-table-column>
        <el-table-column label="平多盈亏" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.hedgeLongProfitFeat === '' ? '--': scope.row.hedgeLongProfitFeat|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="平空盈亏" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.hedgeShortProfitFeat === '' ? '--': scope.row.hedgeShortProfitFeat|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="平仓盈亏" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.closeProfitFeat > 0" class="red">
              {{scope.row.closeProfitFeat === '' ? '--': scope.row.closeProfitFeat|formatMoney}}
            </div>
            <div v-if="scope.row.closeProfitFeat == 0">
              {{scope.row.closeProfitFeat === '' ? '--': scope.row.closeProfitFeat|formatMoney}}
            </div>
            <div v-if="scope.row.closeProfitFeat < 0" class="green">
              {{scope.row.closeProfitFeat === '' ? '--': scope.row.closeProfitFeat|formatMoney}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="汇总盈亏" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.profitFeat > 0" class="red">
              {{scope.row.profitFeat === '' ? '--': scope.row.profitFeat|formatMoney}}
            </div>
            <div v-if="scope.row.profitFeat == 0 ">
              {{scope.row.profitFeat === '' ? '--': scope.row.profitFeat|formatMoney}}
            </div>
            <div v-if="scope.row.profitFeat < 0" class="green">
              {{scope.row.profitFeat === '' ? '--': scope.row.profitFeat|formatMoney}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手续费" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.sumChargeFeat === '' ? '--': scope.row.sumChargeFeat|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" min-width="160px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="持仓方向" align="center" width="80px"  :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.openDirect == 1">
              {{scope.row.openDirect === '' ? '--': '已平'}}
            </div>
            <div v-if="scope.row.openDirect == 2">
              {{scope.row.openDirect === '' ? '--': '多头'}}
            </div>
            <div v-if="scope.row.openDirect == 4">
              {{scope.row.openDirect === '' ? '--': '空头'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="60px" :resizable="false">
          <template slot-scope="scope">
            <el-button size="small" type="text" :disabled="(scope.row.openDirect == 1 || !scope.row.canClose) ? true : false" @click="closeBill(scope.row)">平仓</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
      </el-pagination>
    </el-row>
    <el-dialog title="风控平仓" :visible.sync="controlClose" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :inline="true" :rules="controlRules" :model="closeData" ref="controlCloseForm">
        <el-form-item label="账户信息：">
          <el-input disabled v-model="closeData.account"></el-input>
        </el-form-item>
        <el-form-item label="用户信息：">
          <el-input disabled v-model="closeData.usr"></el-input>
        </el-form-item>
        <el-form-item label="股票代码：">
          <el-input disabled v-model="closeData.stockCode"></el-input>
        </el-form-item>
        <el-form-item label="委托类型：">
          <el-input disabled v-model="closeData.orderType"></el-input>
        </el-form-item>
        <el-form-item label="可平数量：">
          <el-input disabled v-model="closeData.volume"></el-input>
        </el-form-item>
        <el-form-item label="报单价格：" prop="holdPrice">
          <el-input v-model="closeData.holdPrice" class="width120"></el-input>
          <el-tooltip placement="top" effect="light">
            <div slot="content">{{highestPrice}}</div>
            <el-button type="primary" size="mini" @click="highLimit">涨停价</el-button>
          </el-tooltip>
          <el-tooltip placement="top" effect="light">
            <div slot="content">{{closePrice}}</div>
            <el-button type="primary" size="mini" @click="fallStop">跌停价</el-button>
          </el-tooltip>
          <el-tooltip placement="top" effect="light">
            <div slot="content">{{openPrice}}</div>
            <el-button type="success" size="mini" @click="nowPrice">现价</el-button>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button size="small" @click="controlClose = false">取 消</el-button>
                <el-button size="small" type="primary" @click="closeAccount">报单</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../api.js';
  import utils from '@/lib/utils.js';
  import validate from '@/lib/validate.js';
  export default {
    data() {
      return {
        //--------授权用户信息------
        usrId:'',
        usrOptions:[],
        // -----------
        findkey: '',  //股票信息
        stocOptions:[], //股票选择器

        accountId:'', //交易账户
        options2:[], //账户列表
        loading: false,
        aTableData: [],          //表格数据
        bTableLoading: false,    //表格数据是否在加载中
        oCurrRowData: {},        //当前行
        pageConfig: {           //分页数据
          pageNumber: 1,      //当前页
          pageSize: 10,       //每页数量
          totalPage: 0,       //总页数
          totalRow: 0         //总条数
        },
        //----------条件-时间--------------
        openDate: '',  //时间筛选--开始时间
        // ---------持仓方向筛选
        openDirect:[],
        openDirects: [
          {name:'已平',value:"1"},
          {name:'多头',value:"2"},
          {name:'空头',value:"4"},
        ],
        // 平仓
        controlClose:false,
        closeData:{
          account:'',
          usr:'',
          stockMes:'',
          orderType:'',
          volume:'',
          holdPrice:'',
        },
        controlRules:{
          holdPrice:[{ required: true, message: '不能为空', trigger: 'change'},{validator:validate.isNumberPrice,trigger:'change'}],
        },
        highestPrice:'',// 涨停价
        closePrice:'',//跌停价
        openPrice:'',//现价
        reload:false,//标记当前页是否需要为1
      }
    },
    watch:{
      usrId(newVal,oldVal){
        if(newVal != oldVal){
          this.reload = true;
          this.pageConfig.pageNumber = 1;
          this.getTableData();
        }
      },
      accountId(newVal,oldVal){
        if(newVal != oldVal){
          this.reload = true;
          this.pageConfig.pageNumber = 1;
          this.getTableData();
        }
      },
      stockCode(newVal,oldVal){
        if(newVal != oldVal){
          this.reload = true;
          this.pageConfig.pageNumber = 1;
          this.getTableData();
        }
      },
      openDirect(newVal,oldVal){
        if(newVal != oldVal){
          this.reload = true;
          this.pageConfig.pageNumber = 1;
          this.getTableData();
        }
      },
      openDate: function (newValue, oldValue) {   //净值周期改变
        if (oldValue != '' && typeof newValue === 'string' && newValue != oldValue) {
          this.reload = true;
          this.pageConfig.pageNumber = 1;
          this.getTableData();
        }
      },
    },
    methods:{
      //日期改变时修改日期值
      dateChanged(name, date) {
        if (date && date.indexOf(' - ') !== -1) {
          utils.setValByName(this, name, date.split(' - '));
        } else {
          utils.setValByName(this, name, date);
        }
        this.getTableData()
      },
      // 股票代码模糊搜索
      querySearchAsync(queryString, callback){
        if (queryString != '') {
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey:queryString
            };
            API.stockCodeSelect(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              };
              this.stocOptions = arr.map(item => {
                return { value:item.stockCode, label: item.stockCode +  ' '  +item.stockName };
              });
            })
          }, 300);
        }
      },
      query(){
        var states = [];
        var data = { };
        API.stockCodeSelect(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          };
          this.stocOptions = states.map(item => {
            return {value:item.stockCode, label: item.stockCode +  ' '  +item.stockName};
          });
        })
      },
      // 授权用户信息
      remoteMethod(queryString) {
        if (queryString != '') {
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey:queryString
            };
            API.userSelect(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              };
              this.usrOptions = arr.map(item => {
                return { value:item.usrId, label: item.usrAlias};
              });
            })
          }, 300);
        }
      },
      select(){
        var states = [];
        var data = { };
        API.userSelect(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          };
          this.usrOptions = states.map(item => {
            return {value:item.usrId, label: item.usrAlias};
          });
        })
      },
      // // 账户信息查询
      remoteMethod2(query){
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey:query
            };
            this.loading = true;
            API.accountSelect(data).then(res => {
              this.loading = false;
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              this.options2 = arr.map(item => {
                return { value: item.id, label: item.alias };
              })
            })
          }, 300);
        }
      },
      tt2 () {
        var data = {};
        this.loading = true;
        API.accountSelect(data).then(res => {
          this.loading = false;
          var arr = [];
          for (var i in res.data.data) {
            arr.push(res.data.data[i]);
          }
          this.options2 = arr.map(item => {
            return { value: item.id, label: item.alias };
          })
        })
      },
      // --------------平仓-----------
      closeBill(row){
        this.controlClose = true;
        this.$refs.controlCloseForm ? this.$refs.controlCloseForm.resetFields() : '';
        this.closeData = {
          account : row.accountAlias,
          usr : row.triggerUsrAlias,
          stockCode: row.stockCode,
          orderType: row.openDirect == 2 ? '卖出' : '买入',
          volume: row.openVolume,
        }
        this.nowPrice();
      },
      closeAccount(){
        this.$refs.controlCloseForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          var data = {
            usresId:this.oCurrRowData.allocId,
            closePrice:this.closeData.holdPrice,
          }
          API.closeAccount(data).then(res => {
            if (res.data.success) {
              this.controlClose = false;
              this.$notify({
                message: res.data.msgView,
                type: 'success'
              });
              this.getTableData();
            }else{
              this.$notify({
                message: res.data.msgView,
                type: 'warning'
              });
            }
          })
        })
      },
      // 涨停价
      highLimit(){
        var data = {
          stockCode:this.closeData.stockCode
        }
        API.highLimit(data).then(res=>{
          if (res.data.success) {
            this.$set(this.closeData,'holdPrice', res.data.data.highestPrice);
          }
        })
      },
      // 跌停价
      fallStop(){
        var data = {
          stockCode:this.closeData.stockCode
        }
        API.highLimit(data).then(res=>{
          if (res.data.success) {
            this.$set(this.closeData,'holdPrice',res.data.data.closePrice)
          }
        })
      },
      // 现价
      nowPrice(){
        var data = {
          stockCode:this.closeData.stockCode
        }
        API.highLimit(data).then(res=>{
          if (res.data.success) {
            // 涨停价
            this.highestPrice = res.data.data.highestPrice;
            // 跌停价
            this.closePrice = res.data.data.closePrice;
            // 现价
            this.openPrice = res.data.data.openPrice;
            this.$set(this.closeData,'holdPrice',res.data.data.openPrice);
          }
        })
      },
      // -------------查询---------------------
      handleSizeChange(size) {    //每页大小改变
        this.pageConfig.pageNumber = 0;
        this.pageConfig.pageSize = size;
        this.getTableData();
      },
      handleCurrentChange(page) {     //当前页改变
        this.pageConfig.pageNumber = page;
        this.getTableData();
      },
      selectedRow(row) {           //选中行
        this.oCurrRowData = row;
      },
      resetFunc(){ //重置按钮
        this.findkey='';
        this.accountId = '';
        this.usrId = '';
        this.openDate = '';
        this.openDirect = [];
        this.getTableData();
      },
      getTableData(){
        let tag = 0;
        this.openDirect.forEach((v,k)=>{
          tag += (v-0);
        })
        var data = {
          pageSize: this.pageConfig.pageSize,
          pageNumber: this.pageConfig.pageNumber,
          findkey:this.findkey.split(' ')[0],
          accountId:this.accountId,
          usrId:this.usrId,
          openDate:this.openDate,
          direct:tag
        };
        if (this.reload) {
          data.pageNumber = 1;
        }
        this.bTableLoading = true;
        API.tradeToday(data).then(res => {
          this.bTableLoading = false;
          this.reload = false;
          this.aTableData = res.data.data.list;
          this.pageConfig.pageSize = res.data.data.pageSize;
          this.pageConfig.totalRow = res.data.data.totalRow;
          this.pageConfig.totalPage = res.data.data.totalPage;
        })
      },
    },
    created(){
      document.title = '交易持仓';
      this.getTableData();
    },
  }
</script>

<style scoped>
  .red{
    color: #ed263e;
    font-weight: bold;
  }
  .green{
    color: #5faa2f;
    font-weight: bold;
  }
  .el-form-item {
    margin-bottom: 5px;
  }
</style>
