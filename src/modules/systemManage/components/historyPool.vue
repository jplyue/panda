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
                        :label = "item.label"
                        :value = "item.value">
                    </el-option>
                </el-select>
            </div>
            <div :gutter="10" class="marginL10 floatL">
                <span class="fontSize13">股票：</span>
                <el-select v-model="stockCode"  clearable class="width180"
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
                        :label = "item.label"
                        :value = "item.value">
                    </el-option>
                </el-select>
            </div>
            <div :gutter="10" class="marginL10 floatL">
                <span class="fontSize13">券源日期：</span>
                <el-date-picker value-format="yyyy-MM-dd" :clearable="false" class="width220"
                    v-model="value6"
                    type="daterange"
                    @change="getTableData()"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right" size="small">
                </el-date-picker>
            </div>
            <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
            <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
        </el-row>
        <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow" class="label6-hover">
            <el-table-column fixed label="账户标识" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.accountAlias === '' ? '--': scope.row.accountAlias}}
                </template>
            </el-table-column>
            <el-table-column fixed label="股票代码" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    <span class="title-head">{{scope.row.stockCode === '' ? '--': scope.row.stockCode}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed label="股票名称" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.stockName === '' ? '--': scope.row.stockName}}
                </template>
            </el-table-column>
            <el-table-column label="券源日期" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.applyDate === '' ? '--': scope.row.applyDate}}
                </template>
            </el-table-column>
            <el-table-column label="昨仓数量" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.yestVolume === '' ? '--': scope.row.yestVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="券源市值" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.secresMktValue === '' ? '--': scope.row.secresMktValue|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="券源总数" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.secresVolume === '' ? '--': scope.row.secresVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="分配股数" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.allocedVolume === '' ? '--': scope.row.allocedVolume|formatMoney}}
                </template>
            </el-table-column>
          <el-table-column label="剩余股数" align="center" width="120px" :resizable="false">
            <template slot-scope="scope">
              {{scope.row.idleVolume === '' ? '--': (scope.row.idleVolume|formatMoney)}}
            </template>
          </el-table-column>
            <el-table-column label="分配比率" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.allocedRate === '' ? '--': (scope.row.allocedRate*100).toFixed(2)}}%
                </template>
            </el-table-column>
            <el-table-column label="可用股数" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.idleVolume === '' ? '--': scope.row.idleVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="普通买入(总数)" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.standBuyVolume === '' ? '--': scope.row.standBuyVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="普通卖出(总数)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.standSaleVolume === '' ? '--': scope.row.standSaleVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="融资买入(总数)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.marginBuyVolume === '' ? '--': scope.row.marginBuyVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="融券卖出(总数)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.marginSaleVolume === '' ? '--': scope.row.marginSaleVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="普通买入(分配)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.allocedStandBuyVolume === '' ? '--': scope.row.allocedStandBuyVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="普通卖出(分配)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.allocedStandSaleVolume === '' ? '--': scope.row.allocedStandSaleVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="融资买入(分配)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.allocedMarginBuyVolume === '' ? '--': scope.row.allocedMarginBuyVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="融券卖出(分配)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.allocedMarginSaleVolume === '' ? '--': scope.row.allocedMarginSaleVolume|formatMoney}}
                </template>
            </el-table-column>

            <el-table-column label="普通买入(可用)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.idleStandBuyVolume === '' ? '--': scope.row.idleStandBuyVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="普通卖出(可用)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.idleStandSaleVolume === '' ? '--': scope.row.idleStandSaleVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="融资买入(可用)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.idleMarginBuyVolume === '' ? '--': scope.row.idleMarginBuyVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="融券卖出(可用)" align="center"  min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.idleMarginSaleVolume === '' ? '--': scope.row.idleMarginSaleVolume|formatMoney}}
                </template>
            </el-table-column>

            <el-table-column label="最新消息" align="center" min-width="140px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.latMessage === '' ? '--': scope.row.latMessage}}
                </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" min-width="140px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="scope.row.status == 1">
                        <span class="success">{{scope.row.status === '' ? '--': '正常'}}</span>
                    </div>
                    <div v-if="scope.row.status == 2">
                        <span class="fail">{{scope.row.status === '' ? '--': '禁用'}}</span>
                    </div>
                     <div v-if="scope.row.status == 3">
                        <span class="fail">{{scope.row.status === '' ? '--': '分配失败'}}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
        </el-pagination>
    </div>
</template>

<script>
import API from '../api.js'
import utils from '@/lib/utils.js'
export default {
    data() {
        return {
            stockCode: '',            //股票信息
            stocOptions:[], //股票代码选择器
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
            value6:'',
        }
    },
    methods:{
         // 股票代码模糊搜索
        querySearchAsync2(queryString){
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
        // 账户信息查询
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
        resetFunc(){ //重置按钮
            this.stockCode='';
            this.accountId = '';
            this.value6 = '';
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                stockCode:this.stockCode.split(' ')[0],
                accountId:this.accountId,
                dateBegin:this.value6[0],
                dateEnd:this.value6[1],
            };
            this.bTableLoading = true;
            API.historyPool(data).then(res => {
                this.bTableLoading = false;
                this.aTableData = res.data.data.list;
                this.pageConfig.pageSize = res.data.data.pageSize;
                this.pageConfig.totalRow = res.data.data.totalRow;
                this.pageConfig.totalPage = res.data.data.totalPage;
            })
        },
    },
    created(){
        this.getTableData();
    },
}
</script>

<style scoped>
    .el_form_input {
        width: 240px!important;
    }
    .width145{
        margin-right: 10px;
    }
</style>
