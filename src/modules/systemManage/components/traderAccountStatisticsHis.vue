<template>
  <div class="heightP100">
    <el-row :gutter="10">
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">用户：</span>
        <el-select v-model="usrId" class="width145" clearable
                   remote
                   filterable
                   :remote-method="remoteMethod"
                   :loading="loading"
                   @change="getTableData()"
                   @focus="select"
                   placeholder="用户信息">
          <el-option
            v-for="(item,index) in options"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
    </el-row>
    <el-row class="marginT10">
      <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow"
                class="label6-hover">
        <el-table-column fixed label="日期" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            <span class="title-head">{{scope.row.transDate === '' ? '--': scope.row.transDate}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="用户标识" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            <span class="title-head">{{scope.row.user === '' ? '--': scope.row.user}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="账户标识" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            <span class="title-head">{{scope.row.account === '' ? '--': scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="净利" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.netProfit > 0" class="red">
              {{scope.row.netProfit === '' ? '--': scope.row.netProfit|formatMoney}}
            </div>
            <div v-if="scope.row.netProfit == 0">
              {{scope.row.netProfit === '' ? '--': scope.row.netProfit|formatMoney}}
            </div>
            <div v-if="scope.row.netProfit < 0" class="green">
              {{scope.row.netProfit === '' ? '--': scope.row.netProfit|formatMoney}}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed label="毛利" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.grossProfit > 0" class="red">
              {{scope.row.grossProfit === '' ? '--': scope.row.grossProfit|formatMoney}}
            </div>
            <div v-if="scope.row.grossProfit == 0">
              {{scope.row.grossProfit === '' ? '--': scope.row.grossProfit|formatMoney}}
            </div>
            <div v-if="scope.row.grossProfit < 0" class="green">
              {{scope.row.grossProfit === '' ? '--': scope.row.grossProfit|formatMoney}}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed label="手续费" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.fee === '' ? '--': scope.row.fee |formatMoney}}
          </template>
        </el-table-column>

        <el-table-column label="碎股及隔夜仓市值" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.holdAmount > 0" class="red">
              {{scope.row.holdAmount === '' ? '--': scope.row.holdAmount|formatMoney}}
            </div>
            <div v-if="scope.row.holdAmount == 0">
              {{scope.row.holdAmount === '' ? '--': scope.row.holdAmount|formatMoney}}
            </div>
            <div v-if="scope.row.holdAmount < 0" class="green">
              {{scope.row.holdAmount === '' ? '--': scope.row.holdAmount|formatMoney}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="隔夜仓数量" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.nightNum > 0" class="red">
              {{scope.row.nightNum === '' ? '--': scope.row.nightNum}}
            </div>
            <div v-if="scope.row.nightNum == 0">
              {{scope.row.nightNum === '' ? '--': scope.row.nightNum}}
            </div>
            <div v-if="scope.row.nightNum < 0" class="green">
              {{scope.row.nightNum === '' ? '--': scope.row.nightNum}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="隔夜仓描述" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.nightRemark === '' ? '--': scope.row.nightRemark}}
          </template>
        </el-table-column>
        <el-table-column label="碎股数量" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.brokenNum > 0" class="red">
              {{scope.row.brokenNum === '' ? '--': scope.row.brokenNum}}
            </div>
            <div v-if="scope.row.brokenNum == 0">
              {{scope.row.brokenNum === '' ? '--': scope.row.brokenNum}}
            </div>
            <div v-if="scope.row.brokenNum < 0" class="green">
              {{scope.row.brokenNum === '' ? '--': scope.row.brokenNum}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="碎股描述" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.brokenRemark === '' ? '--': scope.row.brokenRemark}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
      </el-pagination>
    </el-row>
    <div class="clear"></div>
  </div>
</template>

<script>
  import API from '../api.js';
  import axios from 'axios';

  export default {
    data() {
      return {
        //--------授权用户信息------
        list: [],
        usrId: '',
        options: [],
        // -----------
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
        value6: '',  //时间筛选
      }
    },
    methods: {
      // 授权用户信息
      remoteMethod(queryString) {
        if (queryString != '') {
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey: queryString
            };
            API.userSelect(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              ;
              this.options = arr.map(item => {
                return {value: item.usrId, label: item.usrAlias};
              });
            })
          }, 300);
        }
      },
      select() {
        var states = [];
        var data = {};
        API.userSelect(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          }
          ;
          this.options = states.map(item => {
            return {value: item.usrId, label: item.usrAlias};
          });
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
        this.usrId = '';
        this.value6 = '';
        this.getTableData();
      },
      getTableData() {
        var data = {
          pageSize: this.pageConfig.pageSize,
          pageNumber: this.pageConfig.pageNumber,
          usrId: this.usrId,
          dateBegin: this.value6[0],
          dateEnd: this.value6[1],
        };
        this.bTableLoading = true;
        API.traderAccountStatisticsHis(data).then(res => {
          this.bTableLoading = false;
          this.aTableData = res.data.data.list;
          this.pageConfig.pageSize = res.data.data.pageSize;
          this.pageConfig.totalRow = res.data.data.totalRow;
          this.pageConfig.totalPage = res.data.data.totalPage;
        })
      },
      exportExcelData() {
        axios.get("/api/heart/saas/march/statistics/trader/countHisExcel?usrId=" + this.usrId + "&dateBegin=" + this.value6[0] + "&dateEnd=" + this.value6[1], {responseType: 'blob'}).then(response => {
          this.download(response);
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
        aLink.download = '历史收益.xls';
        aLink.href = url;
        //aLink.setAttribute("数据模版", "数据模版.xls");
        document.body.appendChild(aLink)
        aLink.click();
      }

    },
    created() {
      document.title = '用户历史盈亏';
      this.getTableData();
    }
    ,
  }
</script>

<style scoped>
  .red {
    color: #ed263e;
    font-weight: bold;
  }

  .green {
    color: #5faa2f;
    font-weight: bold;
  }
</style>
