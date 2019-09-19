<template>
  <div>
    <el-row :gutter="10" class="marginB10">
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">用户：</span>
        <el-select v-model="usrId" class="width145"
                   remote clearable
                   filterable
                   @focus="c1"
                   @change="getTableData()"
                   :remote-method="remoteMethods1"
                   :loading="loading"
                   placeholder="用户信息">
          <el-option
            v-for="(item,index) in option1"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
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
                   :remote-method="querySearchAsync2"
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
        <span class="fontSize13">委托类型：</span>
        <el-select v-model="select" placeholder="委托类型" clearable @change="getTableData" class="width130" size="small">
          <el-option
            v-for="item in selects"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">报单状态：</span>
        <el-select v-model="status" placeholder="状态" clearable @change="getTableData" class="width130" size="small">
          <el-option
            v-for="item in oStatus"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">报单日期：</span>
        <el-date-picker value-format="yyyy-MM-dd" clearable class="width130" v-model="dateBegin" :editable="false"
                        type="date" align="right" placeholder="开始日期" @change="dateChanged('dateBegin', $event)"
                        size="small">
        </el-date-picker>
      </div>
      <el-button class="marginL10" @click="resetFunc" size="mini">重置</el-button>
      <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
    </el-row>
    <el-row>
      <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow"
                class="label6-hover">
        <el-table-column label="委托类型" align="center" min-width="120px" :resizable="false">
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
        <el-table-column label="用户标识" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.usrAlias === '' ? '--': scope.row.usrAlias}}
          </template>
        </el-table-column>
        <el-table-column label="账户标识" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.accountAlias === '' ? '--': scope.row.accountAlias}}
          </template>
        </el-table-column>
        <el-table-column label="股票代码" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            <span class="title-head">{{scope.row.stockCode === '' ? '--': scope.row.stockCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="股票名称" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.stockName === '' ? '--': scope.row.stockName}}
          </template>
        </el-table-column>
        <el-table-column label="报单日期" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.applyDate === '' ? '--': scope.row.applyDate}}
          </template>
        </el-table-column>
        <el-table-column label="报单数量" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.volumeInit === '' ? '--': scope.row.volumeInit|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="最新数量" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.volumeLatest === '' ? '--': scope.row.volumeLatest|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="在途数量" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.volumeIng === '' ? '--': scope.row.volumeIng|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="成交数量" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.volumeDeal === '' ? '--': scope.row.volumeDeal|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="撤单数量" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.volumeCancel === '' ? '--': scope.row.volumeCancel|formatMoney}}
          </template>
        </el-table-column>

        <el-table-column label="报单时间" align="center" min-width="160px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.createTime === '' ? '--': scope.row.createTime|ellipsis(19)}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" min-width="160px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
          </template>
        </el-table-column>
        <el-table-column label="报单状态" fixed="right" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            <el-tooltip placement="top" effect="light">
              <div slot="content">{{scope.row.statusMsg}}</div>
              <div v-if="scope.row.status == 1" class="wait">
                {{scope.row.status === '' ? '--': '待确认'}}
              </div>
            </el-tooltip>
            <el-tooltip placement="top" effect="light">
              <div slot="content">{{scope.row.statusMsg}}</div>
              <div v-if="scope.row.status == 2" class="success">
                {{scope.row.status === '' ? '--': '成功'}}
              </div>
            </el-tooltip>
            <el-tooltip placement="top" effect="light">
              <div slot="content">{{scope.row.statusMsg}}</div>
              <div v-if="scope.row.status == 4" class="fail">
                {{scope.row.status === '' ? '--': '失败'}}
              </div>
            </el-tooltip>
            <el-tooltip placement="top" effect="light">
              <div slot="content">{{scope.row.statusMsg}}</div>
              <div v-if="scope.row.status == 8" class="fail">
                {{scope.row.status === '' ? '--': '丢单'}}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="委托状态" fixed="right" align="center" width="100px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.orderStatus == 0">
              {{scope.row.orderStatus === '' ? '--': '废单'}}
            </div>
            <div v-if="scope.row.orderStatus == 1">
              {{scope.row.orderStatus === '' ? '--': '未报'}}
            </div>
            <div v-if="scope.row.orderStatus == 2">
              {{scope.row.orderStatus === '' ? '--': '正报'}}
            </div>
            <div v-if="scope.row.orderStatus == 3">
              {{scope.row.orderStatus === '' ? '--': '已报'}}
            </div>
            <div v-if="scope.row.orderStatus == 4">
              {{scope.row.orderStatus === '' ? '--': '已报待撤'}}
            </div>
            <div v-if="scope.row.orderStatus == 5">
              {{scope.row.orderStatus === '' ? '--': '部成'}}
            </div>
            <div v-if="scope.row.orderStatus == 6">
              {{scope.row.orderStatus === '' ? '--': '部成待撤'}}
            </div>
            <div v-if="scope.row.orderStatus == 7">
              {{scope.row.orderStatus === '' ? '--': '部成已撤'}}
            </div>
            <div v-if="scope.row.orderStatus == 8">
              {{scope.row.orderStatus === '' ? '--': '已成'}}
            </div>
            <div v-if="scope.row.orderStatus == 9">
              {{scope.row.orderStatus === '' ? '--': '已撤'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="60px" :resizable="false">
          <template slot-scope="scope">
            <el-button size="small" type="text"
                       :disabled=" (scope.row.orderStatus > 0 && scope.row.orderStatus <= 6) && scope.row.canCancel ? false : true"
                       @click="cancelBill(scope.row)">撤单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import API from '../api.js';
  import utils from '@/lib/utils.js'

  export default {
    data() {
      return {
        select: '', //委托类型
        selects: [
          {name: '普通买入', value: '1'},
          {name: '普通卖出', value: '2'},
          {name: '融资买入', value: '3'},
          {name: '融券卖出', value: '4'},
          {name: '买券还券', value: '5'},
          {name: '卖券还券', value: '6'},
          {name: '现券还券', value: '7'},
        ],
        status: '', //状态
        oStatus: [
          {name: '待确认', value: '1'},
          {name: '成功', value: '2'},
          {name: '失败', value: '4'},
          {name: '丢单', value: '8'}
        ],
        loading: false,
        usrId: '',                //用户id
        option1: [],              // 用户列表
        accountId: '',             //账户信息
        options2: [],               //账户列表
        stockCode: '',             //股票信息
        stocOptions: [],           //股票筛选器
        dateBegin: '',             //资源日期
        aTableData: [],          //表格数据
        bTableLoading: false,    //表格数据是否在加载中
        oCurrRowData: {},        //当前行
        pageConfig: {           //分页数据
          pageNumber: 1,      //当前页
          pageSize: 10,       //每页数量
          totalPage: 0,       //总页数
          totalRow: 0         //总条数
        },
      }
    },
    watch: {
      dateBegin: function (newValue, oldValue) {   //净值周期改变
        if (oldValue != '' && typeof newValue === 'string' && newValue != oldValue) {
          this.getTableData();
        }
      },
    },
    methods: {
      // 用户信息查询
      remoteMethods1(query) {
        if (query != '') {
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey: query
            };
            API.userSelect(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              ;
              this.option1 = arr.map(item => {
                return {value: item.usrId, label: item.usrAlias};
              });
            })
          }, 300);
        }
      },
      c1() {
        var states = [];
        var data = {};
        API.userSelect(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          }
          ;
          this.option1 = states.map(item => {
            return {value: item.usrId, label: item.usrAlias};
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
      // 股票代码模糊搜索
      querySearchAsync2(queryString, callback) {
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
            return {value: item.stockCode, label: item.stockCode + ' ' + item.stockName};
          });
        })
      },

      // -----------撤单---------
      cancelBill(row){
        this.$confirm('确认撤单： '+ row.accountAlias,'提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.cancelAccount(row);
        }).catch(() =>{})
      },
      cancelAccount(row){
        var data = {
          orderId:row.resId
        };
        alert(row.resId);
        API.cancelAccountItem(data).then(res =>{
          if(res.data.code == 'OK'){
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
        }).catch(err => {
          console.log(err)
        })
      },

      // ------------资源日期---------
      dateChanged(name, date) {           //日期改变时修改日期值
        if (date && date.indexOf(' - ') !== -1) {
          utils.setValByName(this, name, date.split(' - '));
        } else {
          utils.setValByName(this, name, date);
        }
        this.getTableData()
      },
      // ----------------查询---------
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
        this.select = '';
        this.status = '';
        this.usrId = '';
        this.accountId = '';
        this.stockCode = '';
        this.dateBegin = '';
        this.getTableData();
      },
      getTableData() {
        var data = {
          pageSize: this.pageConfig.pageSize,
          pageNumber: this.pageConfig.pageNumber,
          select: this.select,
          status: this.status,
          usrId: this.usrId,
          accountId: this.accountId,
          stockCode: this.stockCode.split(' ')[0],
          applyDate: this.dateBegin,
        };
        this.bTableLoading = true;
        API.applyList(data).then(res => {
          this.bTableLoading = false;
          this.aTableData = res.data.data.list;
          this.pageConfig.pageSize = res.data.data.pageSize;
          this.pageConfig.totalRow = res.data.data.totalRow;
          this.pageConfig.totalPage = res.data.data.totalPage;
        })
      },
    },
    created() {
      this.getTableData();
    },

  }
</script>

<style scoped>

</style>
