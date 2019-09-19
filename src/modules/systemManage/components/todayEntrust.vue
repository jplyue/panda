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
                <el-input v-model="triggerUsrAlias" placeholder="报单用户" ref="triggerUsrAlias" class="width145 " icon="search" @keyup.enter.native="getTableData" @click="getTableData()" size="small">
                </el-input>
            </div>
            <div :gutter="10" class="marginL10 floatL">
                <el-input v-model="orderkey" placeholder="委托编号/报单流水" ref="orderkey" class="width200 " icon="search" @keyup.enter.native="getTableData" @click="getTableData()" size="small">
                </el-input>
            </div>
            <div :gutter="10" class="marginL10 floatL">
                <span class="fontSize13">委托日期：</span>
                <el-date-picker value-format="yyyy-MM-dd" clearable class="width130" v-model="dateBegin"  :editable="false" type="date" align="right" placeholder="开始日期" @change="dateChanged('dateBegin', $event)"  size="small">
                </el-date-picker>
            </div>
            <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
            <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
        </el-row>
        <el-table v-loading="bTableLoading" :data="aTableData" border stripe  @row-click="selectedRow" ref="filterTable" @filter-change="filterTag" class="label6-hover">
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
            <el-table-column label="委托类型" align="center" min-width="100px" prop="select" :resizable="false"
                :filters="this.oSelect"
                :filter-multiple='false'
                column-key="select">
                <template slot-scope="scope">
                    <div v-if="scope.row.ordeSelect == 0">
                        {{scope.row.ordeSelect === '' ? '--': '未设置'}}
                    </div>
                    <div v-if="scope.row.ordeSelect == 1">
                        {{scope.row.ordeSelect === '' ? '--': '普通买入'}}
                    </div>
                    <div v-if="scope.row.ordeSelect == 2">
                        {{scope.row.ordeSelect === '' ? '--': '普通卖出'}}
                    </div>
                    <div v-if="scope.row.ordeSelect == 3">
                        {{scope.row.ordeSelect === '' ? '--': '融资买入'}}
                    </div>
                    <div v-if="scope.row.ordeSelect == 4">
                        {{scope.row.ordeSelect === '' ? '--': '融券卖出'}}
                    </div>
                    <div v-if="scope.row.ordeSelect == 5">
                        {{scope.row.ordeSelect === '' ? '--': '买券还券'}}
                    </div>
                    <div v-if="scope.row.ordeSelect == 6">
                        {{scope.row.ordeSelect === '' ? '--': '卖券还款'}}
                    </div>
                    <div v-if="scope.row.ordeSelect == 7">
                        {{scope.row.ordeSelect === '' ? '--': '现券换券'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="委托日期" min-width="100px" align="center" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.orderDate === '' ? '--': scope.row.orderDate}}
                </template>
            </el-table-column>
            <el-table-column label="委托时间" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.orderTime === '' ? '--': scope.row.orderTime}}
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
            <el-table-column label="委托数量" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.orderVolume === '' ? '--': scope.row.orderVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="委托价格" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.orderPrice === '' ? '--': scope.row.orderPrice|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="成交数量" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.dealVolume === '' ? '--': scope.row.dealVolume|formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="成交价格" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="scope.row.dealVolume != 0">
                        {{scope.row.dealAmount === '' ? '--': (scope.row.dealAmount/scope.row.dealVolume)|formatMoney}}
                    </div>
                    <div v-if="scope.row.dealVolume == 0">
                        {{scope.row.dealAmount === '' ? '--': 0}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="撤单数量" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.cancelVolume === '' ? '--': scope.row.cancelVolume|formatMoney}}
                </template>
            </el-table-column>
            
            <el-table-column label="报单场景" align="center" min-width="100px" prop="triggerScene" :resizable="false"
            :filter-multiple='false'
            :filters="this.oTrigScene"
            column-key="triggerScene">
                <template slot-scope="scope">
                    <div v-if="scope.row.triggerScene == 2">
                        {{scope.row.triggerScene === '' ? '--': '股票日内'}}
                    </div>
                    <div v-if="scope.row.triggerScene == 4">
                        {{scope.row.triggerScene === '' ? '--': '股票策略'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="报单用户" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.triggerUstAlias === '' ? '--': scope.row.triggerUstAlias}}
                </template>
            </el-table-column>
            <el-table-column label="报单流水" align="center" min-width="350px" :resizable="false" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div class="title-head">
                        {{scope.row.triggerActionSn === '' ? '--': scope.row.triggerActionSn}}
                        <span class="copy"><i class="fa fa-files-o zy-copy" title="复制" @click="copyTriggerActionSn(scope.row)"></i></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" min-width="160px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="委托状态" align="center" prop="status"
                min-width="120px" 
                :resizable="false"
                :filter-multiple='false'
                :filters="this.oStatus"
                column-key="status"
                >
                <template slot-scope="scope">
                    <div v-if="scope.row.status == 10" class="fail">
                        {{scope.row.status === '' ? '--': '废单'}}
                    </div>
                    <div v-if="scope.row.status == 1" class="wait">
                        {{scope.row.status === '' ? '--': '未报'}}
                    </div>
                    <div v-if="scope.row.status == 2" class="wait">
                        {{scope.row.status === '' ? '--': '正报'}}
                    </div>
                    <div v-if="scope.row.status == 3" class="wait">
                        {{scope.row.status === '' ? '--': '已报'}}
                    </div>
                    <div v-if="scope.row.status == 4" class="wait">
                        {{scope.row.status === '' ? '--': '已报待撤'}}
                    </div>
                    <div v-if="scope.row.status == 5" class="wait">
                        {{scope.row.status === '' ? '--': '部成'}}
                    </div>
                    <div v-if="scope.row.status == 6" class="wait">
                        {{scope.row.status === '' ? '--': '部成待撤'}}
                    </div>
                    <div v-if="scope.row.status == 7" class="success">
                        {{scope.row.status === '' ? '--': '部成已撤'}}
                    </div>
                    <div v-if="scope.row.status == 8" class="success">
                        {{scope.row.status === '' ? '--': '已成'}}
                    </div>
                    <div v-if="scope.row.status == 9" class="fail">
                        {{scope.row.status === '' ? '--': '已撤'}}
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
            orderkey:'',//委托单号
            triggerUsrAlias:'', //报单用户
            triggerScene:[], //报单场景
            oTrigScene:[
                {text:'股票策略',value:'4'},
                {text:'股票日内',value:'2'},
            ],

            select:[],
            oSelect:[ //属性
                {text:'普通买入',value:'1'},
                {text:'普通卖出',value:'2'},
                {text:'融资买入',value:'3'},
                {text:'融券卖出',value:'4'},
                {text:'买券还券',value:'5'},
                {text:'卖券还款',value:'6'},
                {text:'现券换券',value:'7'},
            ],
            status:'',
            oStatus:[
                {text:'未报',value:'1'},
                {text:'正报',value:'2'},
                {text:'已报',value:'3'},
                {text:'已报待撤',value:'4'},
                {text:'部成',value:'5'},
                {text:'部成待撤',value:'6'},
                {text:'部成已撤',value:'7'},
                {text:'已成',value:'8'},
                {text:'已撤',value:'9'},
                {text:'废单',value:'10'},
            ],
            findkey: '',            //股票信息
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
        copyOrderNo(data) {
            if (utils.copyToClipboard(data.orderNo)) {
                this.$notify({
                    message: '已复制到剪切板',
                    type: 'success'
                });
            }
        },
        copyTriggerActionSn(data){
            if (utils.copyToClipboard(data.triggerActionSn)) {
                this.$notify({
                    message: '已复制到剪切板',
                    type: 'success'
                });
            }
        },
        // 委托类型/状态筛选
        filterTag(value) {
            if (value.select) {
                this.select = value.select;
            }
            if (value.status) {
                this.status = value.status
            }
            if (value.triggerScene) {
                this.triggerScene = value.triggerScene
            }
            this.getTableData()
        },
         dateChanged(name, date) {           //日期改变时修改日期值
            if (date && date.indexOf(' - ') !== -1) {
                utils.setValByName(this, name, date.split(' - '));
            } else {
                utils.setValByName(this, name, date);
            }
            this.getTableData();
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
            this.orderkey = '';
            this.triggerUsrAlias = '';
            this.findkey='';
            this.accountId = '';
            this.triggerScene = [];
            this.$refs.filterTable.clearFilter('triggerScene');
            this.select = [];
            this.$refs.filterTable.clearFilter('select');
            this.status = '';            
            this.$refs.filterTable.clearFilter('status');
            this.dateBegin = '';
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                stockCode:this.findkey.split(' ')[0],
                accountId:this.accountId,
                dateBegin:this.dateBegin,
                triggerScene:this.triggerScene+'',
                select:this.select+'',
                status:this.status+'',
                orderkey:this.orderkey,
                triggerUsrAlias:this.triggerUsrAlias,
            };
            this.bTableLoading = true;
            API.todayEntrust(data).then(res => {
                this.bTableLoading = false;
                this.aTableData = res.data.data.list;
                this.pageConfig.pageSize = res.data.data.pageSize;
                this.pageConfig.totalRow = res.data.data.totalRow;
                this.pageConfig.totalPage = res.data.data.totalPage;
            }).catch(err => {
                console.log(err)
            });
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
    .copy{
        opacity: 0;
    }
    .title-head:hover .copy{
        cursor: pointer;
        opacity: 1;
    }
</style>
