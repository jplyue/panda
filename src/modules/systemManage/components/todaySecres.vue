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
                <span class="fontSize13">资源日期：</span>
                <el-date-picker value-format="yyyy-MM-dd" clearable class="width130" v-model="dateBegin" :editable="false" type="date" align="right" placeholder="开始日期" @change="dateChanged('dateBegin', $event)"  size="small">
                </el-date-picker>
            </div>
            <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
            <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
        </el-row>
        <el-table v-loading="bTableLoading" :data="aTableData" border stripe ref="filterTable" @row-click="selectedRow" class="label6-hover">
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
            <el-table-column fixed label="用户标识" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.usrAlias === '' ? '--': scope.row.usrAlias}}
                </template>
            </el-table-column>
            <el-table-column label="资源日期" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.applyDate === '' ? '--': scope.row.applyDate}}
                </template>
            </el-table-column>
            <el-table-column label="申请数量" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.askVolume === '' ? '--': scope.row.askVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="普通买入(申请)" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.askStandBuy === '' ? '--': scope.row.askStandBuy|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="融资买入(申请)" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.askMarginBuy === '' ? '--': scope.row.askMarginBuy|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="普通卖出(申请)" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.askStandSale === '' ? '--': scope.row.askStandSale|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="融券卖出(申请)" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.askMarginSale === '' ? '--': scope.row.askMarginSale|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="描述" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.description === '' ? '--': scope.row.description}}
                </template>
            </el-table-column>
            <el-table-column label="来源" align="center" prop="from"
                min-width="100px" 
                :resizable="false"
                :filters="[{ text: '用户申请', value: '1' }, { text: '后台分配', value: '2' }]"
                :filter-method="filterFrom"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <div v-if="scope.row.from == 1">
                        {{scope.row.from === '' ? '--': '用户申请'}}
                    </div>
                    <div v-if="scope.row.from == 2">
                        {{scope.row.from === '' ? '--': '后台分配'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="方向" align="center" prop="direct"
                min-width="100px" 
                :resizable="false"
                :filters="[{ text: '追加资源', value: '1' }, { text: '减少资源', value: '2' },{ text: '覆盖资源', value: '4' }]"
                :filter-method="filterDirect"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <div v-if="scope.row.direct == 1">
                        {{scope.row.direct === '' ? '--': '追加资源'}}
                    </div>
                    <div v-if="scope.row.direct == 2">
                        {{scope.row.direct === '' ? '--': '减少资源'}}
                    </div>
                    <div v-if="scope.row.direct == 4">
                        {{scope.row.direct === '' ? '--': '覆盖资源'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="申请时间" align="center" min-width="160px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.createTime === '' ? '--': scope.row.createTime|ellipsis(19)}}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status"
                min-width="100px" 
                :resizable="false"
                :filters="[{ text: '待确认', value: '1' }, { text: '成功', value: '2' },{ text: '失败', value: '3' }]"
                :filter-method="filterStatus"
                filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tooltip placement="top" effect="light">
                        <div slot="content">{{scope.row.statusMsg}}</div>
                        <div v-if="scope.row.status == 1">
                            <span class="wait">{{scope.row.status === '' ? '--': '待确认'}}</span>
                        </div>
                    </el-tooltip>
                    <el-tooltip placement="top" effect="light">
                        <div slot="content">{{scope.row.statusMsg}}</div>
                        <div v-if="scope.row.status == 2">
                            <span class="success">{{scope.row.status === '' ? '--': '成功'}}</span>
                        </div>
                    </el-tooltip>
                    <el-tooltip placement="top" effect="light">
                        <div slot="content">{{scope.row.statusMsg}}</div>
                        <div v-if="scope.row.status == 4">
                            <span class="fail">{{scope.row.status === '' ? '--': '失败'}}</span>
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
        </el-pagination>
    </div>
</template>

<script>
import API from '../api.js';
import utils from '@/lib/utils.js'
export default {
    data() {
        return {
            loading: false,
            usrId:'',                //用户id
            option1:[],              // 用户列表
            accountId:'',             //账户信息
            options2:[],               //账户列表
            stockCode:'',             //股票信息
            stocOptions:[],          //股票选择器
            dateBegin:'',             //资源日期
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
    watch:{
        dateBegin: function (newValue, oldValue) {   //净值周期改变
            if (oldValue != '' && typeof newValue === 'string' && newValue != oldValue) {
                this.getTableData();
            }
        },
    },
    methods:{
        // 来源筛选
        filterFrom(value, row) {
            return row.from == value;
        },
        // 方向筛选
        filterDirect(value, row){
            return row.direct == value;
        },
        // 状态筛选
        filterStatus(value, row){
            return row.status == value;
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
        // 股票代码模糊搜索
        querySearchAsync2(queryString){
            if (queryString != '') {
                setTimeout(() => {
                    this.loading = false;
                    let list = [];
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
        resetFunc(){ //重置按钮
            this.usrId = '';
            this.accountId = '';
            this.stockCode = '';
            this.dateBegin = '';
            this.$refs.filterTable.clearFilter('from');
            this.$refs.filterTable.clearFilter('direct');
            this.$refs.filterTable.clearFilter('status');
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                usrId:this.usrId,
                accountId:this.accountId,
                stockCode:this.stockCode,
                applyDate:this.dateBegin,
            };
            this.bTableLoading = true;
            API.todaySecres(data).then(res => {
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
    .width145{
        margin-right: 10px;
    }
</style>
