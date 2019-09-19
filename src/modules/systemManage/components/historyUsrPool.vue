<template>
    <div>
        <el-row :gutter="10">
            
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
        <el-row class="marginT10">
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
                <el-table-column fixed label="用户标识" align="center" min-width="100px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.usrAlias === '' ? '--': scope.row.usrAlias}}
                    </template>
                </el-table-column>
                <el-table-column label="分配日期" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.applyDate === '' ? '--': scope.row.applyDate}}
                    </template>
                </el-table-column>
                <el-table-column label="分配市值" align="center"  min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.secresMktValue === '' ? '--': scope.row.secresMktValue|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="分配股数" align="center"  min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.secresVolume === '' ? '--': scope.row.secresVolume|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="已用股数" align="center"  min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.used.usedVolume === '' ? '--': scope.row.used.usedVolume|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="已用比率" align="center"  min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.usedRate === '' ? '--': (scope.row.usedRate*100).toFixed(2)}}%
                    </template>
                </el-table-column>
                <el-table-column label="成交股数" align="center"  min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.used.dealVolume === '' ? '--': scope.row.used.dealVolume|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="成交比率" align="center"  min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.dealRate === '' ? '--': (scope.row.dealRate*100).toFixed(2)}}%
                    </template>
                </el-table-column>
                <el-table-column label="普通买入(分配)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.standBuyVolume === '' ? '--': scope.row.standBuyVolume|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="普通卖出(分配)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.standSaleVolume === '' ? '--': scope.row.standSaleVolume|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="融资买入(分配)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.marginBuyVolume === '' ? '--': scope.row.marginBuyVolume|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="融券卖出(分配)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.marginSaleVolume === '' ? '--': scope.row.marginSaleVolume|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="普通买入(使用)" align="center" min-width="120px" :resizable="false"> 
                    <template slot-scope="scope">
                        {{scope.row.used.dealVolumeStandBuy === '' ? '--': scope.row.used.dealVolumeStandBuy|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="普通卖出(使用)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.used.dealVolumeStandSale === '' ? '--': scope.row.used.dealVolumeStandSale|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="融资买入(使用)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.used.dealVolumeMarginBuy === '' ? '--': scope.row.used.dealVolumeMarginBuy|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="融券卖出(使用)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.used.dealVolumeMarginSale === '' ? '--': scope.row.used.dealVolumeMarginSale|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="普通买入(可用)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.used.volumeStandBuy === '' ? '--': scope.row.used.volumeStandBuy|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="普通卖出(可用)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.used.volumeStandSale === '' ? '--': scope.row.used.volumeStandSale|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="融资买入(可用)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.used.volumeMarginBuy === '' ? '--': scope.row.used.volumeMarginBuy|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="融券卖出(可用)" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.used.volumeMarginSale === '' ? '--': scope.row.used.volumeMarginSale|formatMoney}}
                    </template>
                </el-table-column>
                
                <el-table-column label="更新时间" align="center" min-width="150px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="140px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1">
                            <span class="success">{{scope.row.status === '' ? '--': '授权正常'}}</span>
                        </div>
                        <div v-if="scope.row.status == 2">
                            <span class="fail">{{scope.row.status === '' ? '--': '授权禁用'}}</span>
                        </div>
                        <div v-if="scope.row.status == 4">
                            <span class="fail">{{scope.row.status === '' ? '--': '资源禁用'}}</span>
                        </div>
                        <div v-if="scope.row.status == 8">
                            <span class="fail">{{scope.row.status === '' ? '--': '资源过期'}}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
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
            stockCode: '',            //股票信息
            stocOptions:[],          //股票筛选器
            accountId:'', //交易账户
            options2:[], //账户列表
            loading: false,
            usrId:'',            //用户信息
            option1:[],         // 用户列表
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
            value6:'',//时间筛选
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
        // 用户信息查询
        remoteMethods1(query) {
            if (query != '') {
                setTimeout(() => {
                    this.loading = false;
                    var data = {
                        findkey:query
                    };
                    API.userSelect(data).then(res => {
                        var arr = [];
                        for (var i in res.data.data) {
                            arr.push(res.data.data[i]); 
                        };
                        this.option1 = arr.map(item => {
                            return { value:item.usrId, label: item.usrAlias};
                        });
                    })
                }, 300);
            }
        },
        c1() {
            var states = [];
            var data = { };
            API.userSelect(data).then(res => {
                for (var i in res.data.data) {
                    states.push(res.data.data[i]); 
                };
                this.option1 = states.map(item => {
                    return {value:item.usrId, label: item.usrAlias};
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
            this.stockCode='';
            this.usrId = '';
            this.accountId = '';
            this.value6 = '';
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                usrId:this.usrId,
                stockCode:this.stockCode.split(' ')[0],
                accountId:this.accountId,
                dateBegin:this.value6[0],
                dateEnd:this.value6[1],
            };
            this.bTableLoading = true;
            API.historyUserPool(data).then(res => {
                this.bTableLoading = false;
                this.aTableData = res.data.data.list;
                this.pageConfig.pageSize = res.data.data.pageSize;
                this.pageConfig.totalRow = res.data.data.totalRow;
                this.pageConfig.totalPage = res.data.data.totalPage;
            })
        },
    },
    created(){
        document.title = '用户券池';
        this.getTableData();
    },
}
</script>

<style scoped>
    
</style>

