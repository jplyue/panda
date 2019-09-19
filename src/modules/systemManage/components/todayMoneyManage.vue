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
                <span class="fontSize13">交易日期：</span>
                <el-date-picker value-format="yyyy-MM-dd" clearable class="width130" v-model="dateBegin" :editable="false" type="date" align="right" placeholder="开始日期" @change="dateChanged('dateBegin', $event)"  size="small">
                </el-date-picker>
            </div>
            <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
            <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
        </el-row>
        <el-table v-loading="bTableLoading" :data="aTableData" border stripe fit @row-click="selectedRow" class="label6-hover">
            <el-table-column label="账户标识" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    <span class="title-head">{{scope.row.accountAlias === '' ? '--': scope.row.accountAlias}}</span>
                </template>
            </el-table-column>
            <el-table-column label="币种" align="center" width="100px" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="scope.row.currery == 142">
                        {{scope.row.currery === '' ? '--': '人民币'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="交易日期" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.openDate === '' ? '--': scope.row.openDate}}
                </template>
            </el-table-column>
            <el-table-column label="账户余额" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.balance === '' ? '--': scope.row.balance|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="账户可用" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.avail === '' ? '--': scope.row.avail|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="账户冻结" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.frozen === '' ? '--': scope.row.frozen|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="资产净值" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.assetNav === '' ? '--': scope.row.assetNav|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="资产市值" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.assetMarket === '' ? '--': scope.row.assetMarket|formatMoney}}
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
import utils from '@/lib/utils.js'
export default {
    data() {
        return {
            accountId:'', //交易账户
            options2:[], //账户列表
            loading: false,
            aTableData:[],             //表格数据
            bTableLoading: false,    //表格数据是否在加载中
            oCurrRowData: {},        //当前行
            pageConfig: {           //分页数据
                pageNumber: 1,      //当前页
                pageSize: 10,       //每页数量
                totalPage: 0,       //总页数
                totalRow: 0         //总条数
            },
            //----------条件-时间--------------
            dateBegin: '',  //时间筛选--开始时间
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
        dateChanged(name, date) {           //日期改变时修改日期值
            if (date && date.indexOf(' - ') !== -1) {
                utils.setValByName(this, name, date.split(' - '));
            } else {
                utils.setValByName(this, name, date);
            }
            this.getTableData()
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
            this.accountId = '';
            this.dateBegin = '';
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                accountId:this.accountId,
                openDate:this.dateBegin,
            };
            this.bTableLoading = true;
            API.todayMoneyManage(data).then(res => {
                this.bTableLoading = false;
                this.aTableData = res.data.data.list;
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

<style>

</style>
