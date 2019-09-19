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
                <el-select v-model="findkey"  clearable class="width180"
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
                        :label = "item.label" 
                        :value = "item.value">
                    </el-option>
                </el-select>
            </div>
            <div :gutter="10" class="marginL10 floatL">
                <span class="fontSize13">持仓日期：</span>
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
        <el-table v-loading="bTableLoading" :data="aTableData2" border stripe @row-click="selectedRow" class="label6-hover">
            <el-table-column fixed label="账户经纪商" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.accountBrokerCode === '' ? '--': scope.row.accountBrokerCode}}
                </template>
            </el-table-column>
            <el-table-column fixed label="账户选项" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="scope.row.accountSelect == 1">
                        {{scope.row.accountSelect === '' ? '--': '普通账户'}}
                    </div>
                    <div v-if="scope.row.accountSelect == 2">
                        {{scope.row.accountSelect === '' ? '--': '信用账户'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column fixed label="账户标识" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    <span class="title-head">{{scope.row.accountAlias === '' ? '--': scope.row.accountAlias}}</span>
                </template>
            </el-table-column>
            <el-table-column label="账户名称" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.accountName === '' ? '--': scope.row.accountName}}
                </template>
            </el-table-column>
            <el-table-column label="市场代码" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.exchangeCode === '' ? '--': scope.row.exchangeCode}}
                </template>
            </el-table-column>
            <el-table-column label="股票代码" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.stockCode === '' ? '--': scope.row.stockCode}}
                </template>
            </el-table-column>
            <el-table-column label="股票名称" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.stockName === '' ? '--': scope.row.stockName}}
                </template>
            </el-table-column>
            <el-table-column label="昨仓数量" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.yestlVolume === '' ? '--': scope.row.yestlVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="今仓数量" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.openlVolume === '' ? '--': scope.row.openlVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="可用数量" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.availVolume === '' ? '--': scope.row.availVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="成本价" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.costPrice === '' ? '--': scope.row.costPrice|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="最新价" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.lastPrice === '' ? '--': scope.row.lastPrice|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="持仓日期" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.openDate === '' ? '--': scope.row.openDate}}
                </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" min-width="140px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
        </el-pagination>
    </div>
</template>

<script>
import API from '../api.js'
export default {
    data() {
        return {
            findkey: '',            //股票信息
            stocOptions:[], //股票选择器
            accountId:'', //交易账户
            options2:[], //账户列表
            loading: false,
            aTableData2:[],             //表格数据
            bTableLoading: false,    //表格数据是否在加载中
            oCurrRowData: {},        //当前行
            pageConfig: {           //分页数据
                pageNumber: 1,      //当前页
                pageSize: 10,       //每页数量
                totalPage: 0,       //总页数
                totalRow: 0         //总条数
            },
            value6:'',
        }
    },
    methods:{
        // 股票代码模糊搜索
        querySearchAsync(queryString){
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
            this.value6 = '';
            this.findkey='';
            this.accountId = '';
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                findkey:this.findkey.split(' ')[0],
                accountId:this.accountId,
                stockCode:this.szFindValue,
                dateBegin:this.value6[0],
                dateEnd:this.value6[1],
            };
            this.bTableLoading = true;
            API.historyPosition(data).then(res => {
                this.bTableLoading = false;
                this.aTableData2 = res.data.data.list;
                this.pageConfig.pageSize = res.data.data.pageSize;
                this.pageConfig.totalRow = res.data.data.totalRow;
                this.pageConfig.totalPage = res.data.data.totalPage;
            }).catch(err => {
                console.log(err)
            });
        }
    },
    created(){
        this.getTableData();
    },
}
</script>

<style scoped>
    .el-select{
        margin-right: 10px!important;
    }
   
</style>
