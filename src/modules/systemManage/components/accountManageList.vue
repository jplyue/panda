<template>
    <div>
        <el-row :gutter="10" >
            <div class="floatL">
                <el-input v-model="szFindValue" placeholder="关键词" ref="keyword" class="width200" icon="search" @keyup.enter.native="getTableData" @click="getTableData()" size="small">
                </el-input>
            </div>
            <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
            <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
            <el-button type="primary" icon="plus" class="floatR marginT5 marginR5" @click="showAddDlg" size="small">添加</el-button>
        </el-row>
        <el-row class="marginT10">
            <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow" class="label6-hover">
                <el-table-column fixed label="经纪商代码" align="center" min-width="180px" :resizable="false" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.brokerCode === '' ? '--': scope.row.brokerCode}}
                    </template>
                </el-table-column>
                <el-table-column fixed label="账户标识" align="center" min-width="140px" :resizable="false" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.alias === '' ? '--': scope.row.alias}}
                    </template>
                </el-table-column>
                <el-table-column fixed label="账户名称" align="center" min-width="120px" :resizable="false" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.accountName === '' ? '--': scope.row.accountName}}
                    </template>
                </el-table-column>
                <el-table-column label="账户选项" align="center" min-width="100px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.accountSelect == 1">
                            {{scope.row.accountSelect === '' ? '--': '普通账户'}}
                        </div>
                        <div v-if="scope.row.accountSelect == 2">
                            {{scope.row.accountSelect === '' ? '--': '信用账户'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="账户分类" align="center" min-width="100px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.accountCategory == 1">
                            {{scope.row.accountCategory === '' ? '--': '股票账户'}}
                        </div>
                        <div v-if="scope.row.accountCategory == 2">
                            {{scope.row.accountCategory === '' ? '--': '期货账户'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="账户ID" min-width="280px" align="center" :resizable="false" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="title-head">{{scope.row.id === '' ? '--': scope.row.id}}</span>
                    </template>
                </el-table-column>


                <el-table-column label="账户描述" min-width="180px" align="center" :resizable="false" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.accountDescription === '' ? '--': scope.row.accountDescription}}
                    </template>
                </el-table-column>
                <el-table-column label="经纪商营业部" align="center" min-width="140px" :resizable="false" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.brokerDepartSale === '' ? '--': scope.row.brokerDepartSale}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="110px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 2">
                            <span class="fail">{{scope.row.status === '' ? '--': '禁用'}}</span>
                        </div>
                        <div v-if="scope.row.status == 1">
                            <span class="success">{{scope.row.status === '' ? '--': '正常'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="计费参数" align="center" width="120px" :resizable="false">
                    <template slot-scope="scope">
                        <div class="label-div">
                            <span class="label-span" v-if="scope.row.containCharger == true">
                                <span class="primy">{{scope.row.containCharger === '' ? '--': '已设置'}}</span>
                            </span>
                            <span class="label-span" v-if="scope.row.containCharger == false">
                                <span class="wait">{{scope.row.containCharger === '' ? '--': '未设置'}}</span>
                            </span>
                            <div class="label-button">
                                <el-button size="small" class="colorG" type="text" @click="containChargerSet(scope.row)">设置</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="融券参数" align="center" width="120px" :resizable="false">
                    <template slot-scope="scope">
                        <div class="label-div">
                            <span class="label-span" v-if="scope.row.containMarginer == true">
                                <span class="primy">{{scope.row.containMarginer === '' ? '--': '已设置'}}</span>
                            </span>
                            <span class="label-span" v-if="scope.row.containMarginer == false">
                                <span class="wait">{{scope.row.containMarginer === '' ? '--': '未设置'}}</span>
                            </span>
                            <div class="label-button">
                                <el-button size="small" class="colorG" type="text" @click="containMarginerSet(scope.row)">设置</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" min-width="140px" align="center" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.updateTime === '' ? '--': scope.row.updateTime | ellipsis(19)}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="140px" :resizable="false">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="updateAct(scope.row)">修改</el-button>
                        <el-button size="small" type="text" @click="deleteAct(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
            </el-pagination>
        </el-row>
        <div class="clear"></div>
        <el-dialog title="账号管理-添加用户" :visible.sync="bShowAddDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oAddDlgData" :rules="oAddDlgRules" ref="addDlgForm" :inline="true" class="demo-form-inline">
                <el-form-item label="账户名称：" prop="accountName" >
                    <el-input type="text" v-model="oAddDlgData.accountName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="账户标识：" prop="alias" >
                    <el-input type="text" v-model="oAddDlgData.alias" size="small"></el-input>
                </el-form-item>
                <el-form-item label="账户分类：" prop="accountCategory" >
                    <el-select v-model="oAddDlgData.accountCategory" placeholder="请选择账户">
                        <el-option
                            v-for="(item,index) in options1"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户选项：" prop="accountSelect" >
                    <el-select v-model="oAddDlgData.accountSelect" placeholder="请选择账户">
                        <el-option
                            v-for="(item,value) in options2"
                            :key="value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="经纪商代码：" prop="brokerCode" >
                    <el-input type="text" v-model="oAddDlgData.brokerCode" size="small"></el-input>
                </el-form-item>
                <el-form-item label="账户描述：" prop="accountDescription" >
                    <el-input type="text" v-model="oAddDlgData.accountDescription" size="small"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer">
                <el-button @click="bShowAddDlg = false">取 消</el-button>
                <el-button type="primary" @click="addAccount()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="账号管理-修改基本信息" :visible.sync="ShowAccountDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="120px" :model="oAccountDlgData" :inline="true" :rules="oAccountRules" ref="updateDlgForm">
                <el-form-item label="账户标识：" prop="alias">
                    <el-input type="text" v-model="oAccountDlgData.alias" size="small"></el-input>
                </el-form-item>
                <el-form-item label="经纪商营业部：" prop="brokerDepartSale">
                    <el-input type="text" v-model="oAccountDlgData.brokerDepartSale" size="small"></el-input>
                </el-form-item>
                <el-form-item label="账户描述：" prop="accountDescription" >
                    <el-input type="text" v-model="oAccountDlgData.accountDescription" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="ShowAccountDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyOnlyAccount">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="账号管理-计费参数" :visible.sync="bShowCharge" :modal="true" custom-class="width495" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="180px" :model="oChargeDlgData" :inline="true" :rules="chargeRulesForm" :inline-message="true" ref="chargeDlgForm" class="chargerForm">
                <el-form-item label="说明:" prop="description">
                    <el-input type="text" v-model="oChargeDlgData.description" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金买入(普通)：:" prop="brokerageStandBuyRate">
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageStandBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金卖出(普通)：:" prop="brokerageStandSaleRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageStandSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金每笔最低(普通)元:" prop="brokerageStandLowest">
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageStandLowest" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金买入(信用)：:" prop="brokerageMarginBuyRate">
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageMarginBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金卖出(信用)：:" prop="brokerageMarginSaleRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageMarginSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金每笔最低(信用)元:" prop="brokerageMarginLowest">
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageMarginLowest" size="small"></el-input>
                </el-form-item>
                <el-form-item label="印花税：" prop="saleStampsRate">
                    <el-input type="text" v-model.number="oChargeDlgData.saleStampsRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="过户费(买入)：:" prop="transferFeeBuyRate">
                    <el-input type="text" v-model.number="oChargeDlgData.transferFeeBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="过户费(卖出)：:" prop="transferFeeSaleRate">
                    <el-input type="text" v-model.number="oChargeDlgData.transferFeeSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(买入)：" prop="suffixCostBuyRate">
                    <el-input type="text" v-model.number="oChargeDlgData.suffixCostBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(卖出)：" prop="suffixCostSaleRate">
                    <el-input type="text" v-model.number="oChargeDlgData.suffixCostSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(每笔最低)：" prop="suffixCostLowest">
                    <el-input type="text" v-model.number="oChargeDlgData.suffixCostLowest" size="small"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer">
                <el-button @click="bShowCharge = false">取 消</el-button>
                <el-button type="primary" @click="modifyCharge">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="账号管理-融资融券" :visible.sync="bShowMargin" :modal="true" custom-class="width594" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="190px" :model="oMarginDlgData" :inline="true" :rules="marginRulesForm" :inline-message="true" ref="marginDlgForm" class="chargerForm">
                <el-form-item label="说明：" prop="description">
                    <el-input type="text" v-model="oMarginDlgData.description" size="small"></el-input>
                </el-form-item>
                <el-form-item label="融资买入(融资保证金比例)：" prop="marginBuyRate">
                    <el-input type="number" :step="0.1" :min="0" :max="1" v-model.number="oMarginDlgData.marginBuyRate" size="small"></el-input>&emsp;(0-1数值表示)
                </el-form-item>
                <el-form-item label="融券卖出(融券保证金比例)：" prop="marginSaleRate">
                    <el-input type="number" :step="0.1" :min="0" :max="1" v-model.number="oMarginDlgData.marginSaleRate" size="small"></el-input>&emsp;(0-1数值表示)
                </el-form-item>
                <el-form-item label="融资买入(融资利息)：" prop="marginBuyInterestRate">
                    <el-input type="text" v-model.number="oMarginDlgData.marginBuyInterestRate" size="small"></el-input>&emsp;%
                </el-form-item>
                <el-form-item label="融券卖出(融券利息)：" prop="marginSaleInterestRate">
                    <el-input type="text" v-model.number="oMarginDlgData.marginSaleInterestRate" size="small"></el-input>&emsp;%
                </el-form-item>
                 <el-form-item label="普通买入(融资保证金比例)：" prop="standBuyRate">
                    <el-input type="number" :step="0.1" :min="0" :max="1" v-model.number="oMarginDlgData.standBuyRate" size="small"></el-input>&emsp;(0-1数值表示)
                </el-form-item>
                <el-form-item label="普通卖出(融券保证金比例)：" prop="standSaleRate">
                    <el-input type="number" :step="0.1" :min="0" :max="1" v-model.number="oMarginDlgData.standSaleRate" size="small"></el-input>&emsp;(0-1数值表示)
                </el-form-item>
                <el-form-item label="普通买入(融资利息)：" prop="standBuyInterestRate">
                    <el-input type="text" v-model.number="oMarginDlgData.standBuyInterestRate" size="small"></el-input>&emsp;%
                </el-form-item>
                <el-form-item label="普通卖出(融券利息)：" prop="standSaleInterestRate">
                    <el-input type="text" v-model.number="oMarginDlgData.standSaleInterestRate" size="small"></el-input>&emsp;%
                </el-form-item>

            </el-form>
            <span slot="footer">
                <el-button @click="bShowMargin = false">取 消</el-button>
                <el-button type="primary" @click="modifyMargin">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import API from '../api.js'
import validate from '@/lib/validate.js'
import utils from '@/lib/utils.js'
export default {
    data() {
        var newReg2 = (rule, value, callback) => {
            if (value < 0) {
                callback(new Error("不能为负数"));
            } else if (value>1) {
                callback(new Error("0-1数值表示"));
            } else {
                callback();  //必须要有回调，要不然表单无法提交
            }
        };
        return {
            options1:[{value:1,label:'股票账户'},{value:2,label:'期货账户'}],
            options2:[{value:1,label:'普通账户'},{value:2,label:'信用账户'}],
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
            bShowAddDlg: false,         //显示添加窗口
            //---------添加账户-----------
            oAddDlgData:{
                alias:'', //账户标识
                accountCategory:'', //账户分类
                accountSelect:'',//账户选项
                brokerCode:'',//经纪商-代码
                accountName:'',//账户名称
                accountDescription:'',//账户描述
            },
            oAddDlgRules: {            //添加弹窗校验规则
                alias:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                accountCategory:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                accountSelect:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                brokerCode:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                accountName:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                accountDescription:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ]
            },
            ShowAccountDlg:false, //修改账户
            oAccountDlgData:{
                accountId:'',
                alias:'',
                brokerDepartSale:'',
                accountDescription:''
            },
            oAccountRules:{
                alias:[{ required: true, message: '不能为空', trigger: 'blur' }],
                brokerDepartSale:[{ required: true, message: '不能为空', trigger: 'blur' }],
                accountDescription:[{ required: true, message: '不能为空', trigger: 'blur' }],
            },
            bShowCharge:false, //计费参数
            oChargeDlgData:{
                accountId:'',
                brokerageStandBuyRate:'',
                brokerageStandSaleRate:'',
                brokerageStandLowest:'',
                brokerageMarginBuyRate:'',
                brokerageMarginSaleRate:'',
                brokerageMarginLowest:'',
                saleStampsRate:'',
                transferFeeBuyRate:'',
                transferFeeSaleRate:'',
                suffixCostBuyRate:'',
                suffixCostSaleRate:'',
                suffixCostLowest:'',
                description:'',
            },
            chargeRulesForm:{
                brokerageStandBuyRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageStandSaleRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageStandLowest:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageMarginBuyRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageMarginSaleRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageMarginLowest:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                saleStampsRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                transferFeeBuyRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                transferFeeSaleRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                suffixCostBuyRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                suffixCostSaleRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                suffixCostLowest:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                description:[{ required: true, message: '不能为空',trigger:'blur' }]
            },
            bShowMargin:false, //融资融券
            oMarginDlgData:{
                accountId:'',
                description:'',
                marginBuyRate:'',
                marginSaleRate:'',
                marginBuyInterestRate:'',
                marginSaleInterestRate:'',
                standBuyRate:'',
                standSaleRate:'',
                standBuyInterestRate:'',
                standSaleInterestRate:'',
            },
            marginRulesForm:{
                marginBuyRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:newReg2}],
                marginSaleRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:newReg2}],
                marginBuyInterestRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                marginSaleInterestRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                standBuyRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:newReg2}],
                standSaleRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:newReg2}],
                standBuyInterestRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                standSaleInterestRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                description:[{ required: true, message: '不能为空' }]
            },
        }
    },
    methods:{
        // ------------修改基本信息---------------
        updateAct(row){
            this.ShowAccountDlg = true;
            this.$refs.updateDlgForm ? this.$refs.updateDlgForm.resetFields() : '';
            this.oAccountDlgData.accountId = row.id;
            this.oAccountDlgData.alias = row.alias;
            this.oAccountDlgData.brokerDepartSale = row.brokerDepartSale;
            this.oAccountDlgData.accountDescription = row.accountDescription;
        },
        // 修改基本信息
        modifyOnlyAccount(){
            this.$refs.updateDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    accountId:this.oAccountDlgData.accountId,
                    alias:this.oAccountDlgData.alias,
                    brokerDepartSale:this.oAccountDlgData.brokerDepartSale,
                    accountDescription:this.oAccountDlgData.accountDescription,
                };
                API.accountUpdate(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.ShowAccountDlg = false;
                        this.$notify({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getTableData();
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        },
        // -------------修改计费参数弹框----------
        containChargerSet(row){
            this.bShowCharge = true;
            this.oChargeDlgData.accountId = row.id;
            this.$refs.chargeDlgForm ? this.$refs.chargeDlgForm.resetFields() : '';
            this.getChargeData();
        },
        // ----------修改计费参数单项查询--------------
        getChargeData(){
            var data = {
                accountId:this.oChargeDlgData.accountId
            }
            API.getChargeData(data).then(res => {
                this.oChargeDlgData={
                    brokerageStandBuyRate:Number((res.data.data.brokerageStandBuyRate*10000).toFixed(3)),
                    brokerageStandSaleRate:Number((res.data.data.brokerageStandSaleRate*10000).toFixed(3)),
                    brokerageStandLowest:res.data.data.brokerageStandLowest,
                    brokerageMarginBuyRate:Number((res.data.data.brokerageMarginBuyRate*10000).toFixed(3)),
                    brokerageMarginSaleRate:Number((res.data.data.brokerageMarginSaleRate*10000).toFixed(3)),
                    brokerageMarginLowest:res.data.data.brokerageMarginLowest,
                    saleStampsRate:Number((res.data.data.saleStampsRate*10000).toFixed(3)),
                    transferFeeBuyRate:Number((res.data.data.transferFeeBuyRate*10000).toFixed(3)),
                    transferFeeSaleRate:Number((res.data.data.transferFeeSaleRate*10000).toFixed(3)),
                    suffixCostBuyRate:Number((res.data.data.suffixCostBuyRate*10000).toFixed(3)),
                    suffixCostSaleRate:Number((res.data.data.suffixCostSaleRate*10000).toFixed(3)),
                    suffixCostLowest:Number((res.data.data.suffixCostLowest*10000).toFixed(3)),
                    description:res.data.data.description,
                }
            })
        },
        // 修改计费参数
        modifyCharge(){
            this.$refs.chargeDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    accountId:this.oCurrRowData.id,
                    brokerageStandBuyRate:this.oChargeDlgData.brokerageStandBuyRate/10000,
                    brokerageStandSaleRate:this.oChargeDlgData.brokerageStandSaleRate/10000,
                    brokerageStandLowest:this.oChargeDlgData.brokerageStandLowest,
                    brokerageMarginBuyRate:this.oChargeDlgData.brokerageMarginBuyRate/10000,
                    brokerageMarginSaleRate:this.oChargeDlgData.brokerageMarginSaleRate/10000,
                    brokerageMarginLowest:this.oChargeDlgData.brokerageMarginLowest,
                    saleStampsRate:this.oChargeDlgData.saleStampsRate/10000,
                    transferFeeBuyRate:this.oChargeDlgData.transferFeeBuyRate/10000,
                    transferFeeSaleRate:this.oChargeDlgData.transferFeeSaleRate/10000,
                    suffixCostBuyRate:this.oChargeDlgData.suffixCostBuyRate/10000,
                    suffixCostSaleRate:this.oChargeDlgData.suffixCostSaleRate/10000,
                    suffixCostLowest:this.oChargeDlgData.suffixCostLowest/10000,
                    description:this.oChargeDlgData.description,
                };
                API.updateChargeData(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.bShowCharge = false;
                        this.$notify({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getTableData();
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        },
        // ------------修改融券参数弹框-----------
        containMarginerSet(row){
            this.bShowMargin = true;
            this.oMarginDlgData.accountId = row.id;
            this.$refs.marginDlgForm ? this.$refs.marginDlgForm.resetFields() : '';
            this.getMarginData();
        },
        getMarginData(){
            var data = {
                accountId:this.oMarginDlgData.accountId
            }
            API.getMarginData(data).then(res => {
                this.oMarginDlgData = {
                    description:res.data.data.description,
                    marginBuyRate:res.data.data.marginBuyRate,
                    marginSaleRate:res.data.data.marginSaleRate,
                    marginBuyInterestRate:res.data.data.marginBuyInterestRate*100,
                    marginSaleInterestRate:res.data.data.marginSaleInterestRate*100,
                    standBuyRate:res.data.data.standBuyRate,
                    standSaleRate:res.data.data.standSaleRate,
                    standBuyInterestRate:res.data.data.standBuyInterestRate*100,
                    standSaleInterestRate:res.data.data.standSaleInterestRate*100,
                }
            })
        },
        // 融资融券
        modifyMargin(){
            this.$refs.marginDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    accountId:this.oCurrRowData.id,
                    marginBuyRate:this.oMarginDlgData.marginBuyRate,
                    marginSaleRate:this.oMarginDlgData.marginSaleRate,
                    marginBuyInterestRate:this.oMarginDlgData.marginBuyInterestRate,
                    marginSaleInterestRate:this.oMarginDlgData.marginSaleInterestRate,
                    standBuyRate:this.oMarginDlgData.standBuyRate,
                    standSaleRate:this.oMarginDlgData.standSaleRate,
                    standBuyInterestRate:this.oMarginDlgData.standBuyInterestRate,
                    standSaleInterestRate:this.oMarginDlgData.standSaleInterestRate,
                    description:this.oMarginDlgData.description,
                };
                API.updateMarginData(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.bShowMargin = false;
                        this.$notify({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getTableData();
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        },
        //------------------添加账户-------------
        addAccount(){ //添加账户
        this.$refs.addDlgForm.validate((valid) => {
            if (!valid) {
                return false;
            }
            var data = {
                alias:this.oAddDlgData.alias,
                category:this.oAddDlgData.accountCategory,
                select:this.oAddDlgData.accountSelect,
                brokerCode:this.oAddDlgData.brokerCode,
                accountName:this.oAddDlgData.accountName,
                accountDescription:this.oAddDlgData.accountDescription
            };
            API.addAccount(data).then(res => {
                if (res.data.code === 'OK') {
                    this.bShowAddDlg = false;
                    this.$notify({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.getTableData();
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            })
        })
        },
        deleteAct(row){ //删除账号
            this.$confirm('确认删除账户： ' + row.accountName, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.deleteUser(row);
            }).catch(() => {
            });
        },
        deleteUser(row){
            var data = {
                accountId:row.id
            }
            API.deleteAccount(data).then(res => {
                if (res.data.code === 'OK') {
                    this.$notify({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getTableData();
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            })
        },
        showAddDlg() {              //显示添加弹窗
            this.bShowAddDlg = true;
            this.$refs.addDlgForm ? this.$refs.addDlgForm.resetFields() : '';
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
            this.szFindValue='';
            this.getTableData();
        },
        getTableData() { //获取表格数据
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                findkey: this.szFindValue,
            };
            this.bTableLoading = true;
            API.accountManagement(data).then(res =>{
                this.bTableLoading = false;
                this.aTableData = res.data.data.list;
                this.pageConfig.pageSize = res.data.data.pageSize;
                this.pageConfig.totalRow = res.data.data.totalRow;
                this.pageConfig.totalPage = res.data.data.totalPage;
            }).catch(err =>{
                console.log(err)
            })
        },


    },
    created() {
        this.$nextTick(function () {
            this.$refs.keyword.$el.querySelector('[icon=search]').focus();
        });
        document.title = '账户管理';
        this.getTableData();
    }
}
</script>

<style scoped>
    .chargerForm .el-form-item {
        margin-bottom: 0px;
        display: inline-block;
    }
    .chargerForm .el-form-item__content .el-input {
        width: 180px;
    }
    .demo-form-inline{
        text-align: center;
    }
    .el-table .cell {
        padding: 0 5px;
    }
    .el_form_input {
        width: 240px;
    }
    .label6-hover .label-div{
        height: 24px;
    }
    .label6-hover .label-div .label-button{
        display: none;
    }
    .label6-hover .label-div:hover .label-span{
        display: none;
    }
    .label6-hover .label-div:hover .label-button{
        display: block;
        cursor: pointer;
    }
</style>
