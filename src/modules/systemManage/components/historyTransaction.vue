<template>
  <div>
    <el-row :gutter="10" class="marginB10">

      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">账户：</span>
        <el-select v-model="accountId" clearable class="width145"
                   remote
                   filterable
                   @focus="tt2"
                   @change="getTableData()"
                   :remote-method="remoteMethod2"
                   :loading="loading"
                   placeholder="账户信息">
          <el-option
            v-for="(item,index) in options2"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">股票：</span>
        <el-select v-model="stockCode" clearable class="width180"
                   remote
                   filterable
                   :remote-method="querySearchAsync"
                   :loading="loading"
                   @focus="query"
                   @change="getTableData()"
                   placeholder="股票信息">
          <el-option
            v-for="(item,index) in stocOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <el-select v-model="orderSelect" placeholder="委托类型" clearable @change="getTableData" class="width145 "
                   size="small">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <el-input v-model="triggerUsrAlias" placeholder="报单用户" ref="triggerUsrAlias" class="width145 " icon="search"
                  @keyup.enter.native="getTableData" @click="getTableData()" size="small">
        </el-input>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <el-input v-model="orderkey" placeholder="委托编号/报单流水" ref="orderkey" class="width200" icon="search"
                  @keyup.enter.native="getTableData" @click="getTableData()" size="small">
        </el-input>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">成交日期：</span>
        <el-date-picker value-format="yyyy-MM-dd" :clearable="false" class="width220"
                        v-model="value6"
                        type="daterange"
                        @change="getTableData()"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right" size="small">
        </el-date-picker>
      </div>
      <el-button class="marginL10" @click="resetFunc" size="mini">重置</el-button>
      <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
      <el-button type="info" class="marginL10 marginT5" size="small" @click="exportExcel">导出</el-button>
    </el-row>
    <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow" ref="filterTable"
              @filter-change="filterTag" class="label6-hover">
      <el-table-column fixed label="账户标识" min-width="120px" align="center" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.accountAlias === '' ? '--': scope.row.accountAlias}}
        </template>
      </el-table-column>
      <el-table-column fixed label="市场代码" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.exchangeCode === '' ? '--': scope.row.exchangeCode}}
        </template>
      </el-table-column>
      <el-table-column fixed label="股票代码" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.stockCode === '' ? '--': scope.row.stockCode}}
        </template>
      </el-table-column>
      <el-table-column fixed label="股票名称" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          <span class="title-head">{{scope.row.stockName === '' ? '--': scope.row.stockName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="委托日期" min-width="100px" align="center" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.orderDate === '' ? '--': scope.row.orderDate}}
        </template>
      </el-table-column>
      <el-table-column label="委托编号" align="center" min-width="200px" :resizable="false">
        <template slot-scope="scope">
          <div class="title-head">
            {{scope.row.orderNo === '' ? '--': scope.row.orderNo}}
            <span class="copy"><i class="fa fa-files-o zy-copy" title="复制" @click="copyOrderNo(scope.row)"></i></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="委托类型" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          <div v-if="scope.row.orderSelect == 0">
            {{scope.row.orderSelect === '' ? '--': '未设置'}}
          </div>
          <div v-if="scope.row.orderSelect == 1">
            {{scope.row.orderSelect === '' ? '--': '普通买入'}}
          </div>
          <div v-if="scope.row.orderSelect == 2">
            {{scope.row.orderSelect === '' ? '--': '普通卖出'}}
          </div>
          <div v-if="scope.row.orderSelect == 3">
            {{scope.row.orderSelect === '' ? '--': '融资买入'}}
          </div>
          <div v-if="scope.row.orderSelect == 4">
            {{scope.row.orderSelect === '' ? '--': '融券卖出'}}
          </div>
          <div v-if="scope.row.orderSelect == 5">
            {{scope.row.orderSelect === '' ? '--': '买券还券'}}
          </div>
          <div v-if="scope.row.orderSelect == 6">
            {{scope.row.orderSelect === '' ? '--': '卖券还款'}}
          </div>
          <div v-if="scope.row.orderSelect == 7">
            {{scope.row.orderSelect === '' ? '--': '现券换券'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="成交时间" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.dealTime === '' ? '--': scope.row.dealTime}}
        </template>
      </el-table-column>
      <el-table-column label="成交编号" min-width="150px" align="center" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.dealNo === '' ? '--': scope.row.dealNo}}
        </template>
      </el-table-column>
      <el-table-column label="成交数量" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.dealVolume === '' ? '--': scope.row.dealVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="成交价格" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.dealPrice === '' ? '--': scope.row.dealPrice|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="报单场景" align="center" min-width="100px" prop="tiggerScene" :resizable="false"
                       :filter-multiple='false'
                       :filters="this.oTrigScene"
                       column-key="tiggerScene">
        <template slot-scope="scope">
          <div v-if="scope.row.tiggerScene == 2">
            {{scope.row.tiggerScene === '' ? '--': '股票日内'}}
          </div>
          <div v-if="scope.row.tiggerScene == 4">
            {{scope.row.tiggerScene === '' ? '--': '股票策略'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="报单用户" align="center" min-width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.triggerUsrAlias === '' ? '--': scope.row.triggerUsrAlias}}
        </template>
      </el-table-column>
      <el-table-column label="报单流水" align="center" min-width="300px" :resizable="false" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="title-head">
            {{scope.row.triggerActionSN === '' ? '--': scope.row.triggerActionSN}}
            <span class="copy"><i class="fa fa-files-o zy-copy" title="复制" @click="copyTriggerActionSn(scope.row)"></i></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" min-width="160px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
    </el-pagination>
  </div>
</template>

<script>
  import API from '../api.js'
  import utils from '@/lib/utils.js'
  import axios from 'axios';

  export default {
    data() {
      return {
        orderkey: '',//委托单号
        triggerUsrAlias: '', //报单用户
        tiggerScene: [], //报单场景
        oTrigScene: [
          {text: '股票策略', value: '4'},
          {text: '股票日内', value: '2'},
        ],
        dateBegin: '',
        dateEnd: '',
        orderSelect: '',        //委托类型
        options2: [],
        loading: false,
        accountId: '',
        options1: [ //属性
          {name: '普通买入', value: '1'},
          {name: '普通卖出', value: '2'},
          {name: '融资买入', value: '3'},
          {name: '融券卖出', value: '4'},
          {name: '买券还券', value: '5'},
          {name: '卖券还款', value: '6'},
          {name: '现券换券', value: '7'},
        ],
        accountName: '',              //用户名
        stockCode: '',               //股票代码筛选
        stocOptions: [],           //股票筛选选择器

        szFindValue: '',            //关键词
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
        value6: '',
      }
    },
    methods: {
      copyOrderNo(data) {
        if (utils.copyToClipboard(data.orderNo)) {
          this.$notify({
            message: '已复制到剪切板',
            type: 'success'
          });
        }
      },
      copyTriggerActionSn(data) {
        if (utils.copyToClipboard(data.triggerActionSN)) {
          this.$notify({
            message: '已复制到剪切板',
            type: 'success'
          });
        }
      },
      // 委托类型/状态筛选
      filterTag(value) {
        if (value.tiggerScene) {
          this.tiggerScene = value.tiggerScene;
        }
        this.getTableData()
      },
      // 股票代码模糊搜索
      querySearchAsync(queryString) {
        if (queryString != '') {
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey: queryString
            };
            API.stockCodeSelect(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              ;
              this.stocOptions = arr.map(item => {
                return {value: item.stockCode, label: item.stockCode + ' ' + item.stockName};
              });
            })
          }, 300);
        }
      },
      query() {
        var states = [];
        var data = {};
        API.stockCodeSelect(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          }
          ;
          this.stocOptions = states.map(item => {
            return {value: item.stockCode, value: item.stockCode + ' ' + item.stockName};
          });
        })
      },
      // 账户信息查询
      remoteMethod2(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey: query
            };
            this.loading = true;
            API.accountSelect(data).then(res => {
              this.loading = false;
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              this.options2 = arr.map(item => {
                return {value: item.id, label: item.alias};
              })
            })
          }, 300);
        }
      },
      tt2() {
        var data = {};
        this.loading = true;
        API.accountSelect(data).then(res => {
          this.loading = false;
          var arr = [];
          for (var i in res.data.data) {
            arr.push(res.data.data[i]);
          }
          this.options2 = arr.map(item => {
            return {value: item.id, label: item.alias};
          })
        })
      },
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
      resetFunc() { //重置按钮
        this.triggerUsrAlias = '';
        this.orderkey = '';
        this.stockCode = '';
        this.accountId = '';
        this.tiggerScene = [],
          this.$refs.filterTable.clearFilter('tiggerScene');
        this.orderSelect = '';
        this.value6 = '';
        this.getTableData();
      },
      getTableData() {
        var data = {
          pageSize: this.pageConfig.pageSize,
          pageNumber: this.pageConfig.pageNumber,
          stockCode: this.stockCode.split(' ')[0],
          accountId: this.accountId,
          orderSelect: this.orderSelect,
          dateBegin: this.value6[0],
          dateEnd: this.value6[1],
          triggerUsrAlias: this.triggerUsrAlias,
          orderkey: this.orderkey,
          triggerScene: this.tiggerScene + '', //场景
        };
        this.bTableLoading = true;
        API.historyTransaction(data).then(res => {
          this.bTableLoading = false;
          this.aTableData = res.data.data.list;
          this.pageConfig.pageSize = res.data.data.pageSize;
          this.pageConfig.totalRow = res.data.data.totalRow;
          this.pageConfig.totalPage = res.data.data.totalPage;
        }).catch(err => {
          console.log(err)
        })
      },

      exportExcel() {
        this.bTableLoading = false;
        axios.get("/api/heart/saas/march/services/fints/stock/trade/day/deal/export?accountId=" + this.accountId + "&dateBegin=" + this.value6[0] + "&dateEnd=" + this.value6[1] + "&stockCode=" + this.stockCode + "&orderSelect=" + this.orderSelect + "&triggerUsrAlias=" + this.triggerUsrAlias + "&orderkey=" + this.orderkey, {responseType: 'blob'}).then(response => {
          this.download(response);
          this.bTableLoading = true;
        }).catch(error => {
          console.log(error);
        })
      },

      download(data) {
        if (!data) {
          return
        }
        var blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
        var url = window.URL.createObjectURL(blob);
        var aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.download = '成交记录.xls';
        aLink.href = url;
        //aLink.setAttribute("数据模版", "数据模版.xls");
        document.body.appendChild(aLink)
        aLink.click();
      }
    },
    created() {
      this.getTableData();
    },
  }
</script>

<style scoped>
  .width145 {
    margin-right: 10px;
  }

  .copy {
    opacity: 0;
  }

  .title-head:hover .copy {
    cursor: pointer;
    opacity: 1;
  }
</style>
