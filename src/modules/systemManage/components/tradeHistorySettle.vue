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
                @change="getTableData()"
                @focus="select"
                placeholder="用户信息">
                    <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label = "item.label"
                        :value = "item.value">
                    </el-option>
                </el-select>
            </div>
            <div :gutter="10" class="marginL10 floatL">
                <span class="fontSize13">交易日期：</span>
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
                <el-table-column fixed label="用户标识" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        <span class="title-head">{{scope.row.usrAlias === '' ? '--': scope.row.usrAlias}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed label="交易日期" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.openDate === '' ? '--': scope.row.openDate}}
                    </template>
                </el-table-column>
                <el-table-column fixed label="手续费" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.sumChargeFeat === '' ? '--': scope.row.sumChargeFeat|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column fixed label="成交总额" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.sumAmount === '' ? '--': scope.row.sumAmount|formatMoney}}
                    </template>
                </el-table-column>

                <el-table-column label="持仓多头资源" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.openLongRescnt === '' ? '--': scope.row.openLongRescnt}}
                    </template>
                </el-table-column>
                <el-table-column label="持仓空头资源" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.openShortRescnt === '' ? '--': scope.row.openShortRescnt}}
                    </template>
                </el-table-column>
                <el-table-column label="持仓资源" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.openRescnt === '' ? '--': scope.row.openRescnt}}
                    </template>
                </el-table-column>
                <el-table-column label="持仓多头市值" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.openLongMktval === '' ? '--': scope.row.openLongMktval|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="持仓空头市值" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.openShortMktval === '' ? '--': scope.row.openShortMktval|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="持仓市值" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.openMktval === '' ? '--': scope.row.openMktval|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="持仓多头盈亏" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.openLongProfitFeat > 0" class="red">
                            {{scope.row.openLongProfitFeat === '' ? '--': scope.row.openLongProfitFeat|formatMoney}}
                        </div>
                        <div v-if="scope.row.openLongProfitFeat == 0">
                            {{scope.row.openLongProfitFeat === '' ? '--': scope.row.openLongProfitFeat|formatMoney}}
                        </div>
                        <div v-if="scope.row.openLongProfitFeat < 0" class="green">
                            {{scope.row.openLongProfitFeat === '' ? '--': scope.row.openLongProfitFeat|formatMoney}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="持仓空头盈亏" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.openShortProfitFeat > 0" class="red">
                            {{scope.row.openShortProfitFeat === '' ? '--': scope.row.openShortProfitFeat|formatMoney}}
                        </div>
                        <div v-if="scope.row.openShortProfitFeat == 0">
                            {{scope.row.openShortProfitFeat === '' ? '--': scope.row.openShortProfitFeat|formatMoney}}
                        </div>
                        <div v-if="scope.row.openShortProfitFeat < 0" class="green">
                            {{scope.row.openShortProfitFeat === '' ? '--': scope.row.openShortProfitFeat|formatMoney}}
                        </div>
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
                <el-table-column label="平仓金额" align="center" min-width="100px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.closeAmount === '' ? '--': scope.row.closeAmount|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="平仓次数" align="center" min-width="100px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.hedgeCount === '' ? '--': scope.row.hedgeCount}}
                    </template>
                </el-table-column>
                <el-table-column label="平仓胜率" align="center" min-width="100px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.hedgeProfitWincntRateFeat === '' ? '--': scope.row.hedgeProfitWincntRateFeat|percentageFormat(2)}}
                    </template>
                </el-table-column>
                <el-table-column label="平多盈亏" align="center" min-width="100px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.hedgeLongProfitFeat === '' ? '--': scope.row.hedgeLongProfitFeat|formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="平空盈亏" align="center" min-width="100px" :resizable="false">
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
                        <div v-if="scope.row.profitFeat == 0">
                            {{scope.row.profitFeat === '' ? '--': scope.row.profitFeat|formatMoney}}
                        </div>
                        <div v-if="scope.row.profitFeat < 0" class="green">
                            {{scope.row.profitFeat === '' ? '--': scope.row.profitFeat|formatMoney}}
                        </div>
                    </template>
                </el-table-column>

              <el-table-column label="爆仓线" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                  {{scope.row.stopLossLineAmount === '' ? '--': scope.row.stopLossLineAmount|formatMoney}}
                </template>
              </el-table-column>

              <el-table-column label="是否爆仓" align="center" min-width="100px" :resizable="false">
                <template slot-scope="scope">
                  <div v-if="scope.row.profitFeat < -scope.row.stopLossLineAmount" class="red">
                    是
                  </div>
                </template>
              </el-table-column>

                <el-table-column label="更新时间" align="center" min-width="160px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" align="center" width="200px" :resizable="false">

                </el-table-column> -->
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
            </el-pagination>
        </el-row>
        <div class="clear"></div>
    </div>
</template>

<script>
import API from '../api.js';
import utils from '@/lib/utils.js';
export default {
    data() {
        return {
            //--------授权用户信息------
            list: [],
            usrId:'',
            options:[],
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
    methods:{
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
                        this.options = arr.map(item => {
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
                this.options = states.map(item => {
                    return {value:item.usrId, label: item.usrAlias};
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
        resetFunc(){ //重置按钮
            this.usrId = '';
            this.value6 = '';
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                usrId:this.usrId,
                dateBegin:this.value6[0],
                dateEnd:this.value6[1],
            };
            this.bTableLoading = true;
            API.usedHistorySettle(data).then(res => {
                this.bTableLoading = false;
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
</style>
