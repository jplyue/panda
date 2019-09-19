<template>
    <div>
        <el-row>
            <el-input v-model="szFindValue" placeholder="关键词" ref="keyword" class="width200 marginL10 floatL" icon="search" @keyup.enter.native="getTableData" @click="getTableData()" size="small">
            </el-input>
            <div :gutter="10" class="marginL10 floatL">
                <span class="fontSize13">状态：</span>
                <el-select v-model="status" placeholder="状态" @change="getTableData" clearable class="width145" size="small">
                    <el-option
                        v-for="item in Ostatus"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
            <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
            <el-button type="primary" icon="plus" class="floatR marginT5 marginR5" @click="codeAddDlg" size="small">添加</el-button>
        </el-row>
        <el-row class="marginT10">
            <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow" class="label6-hover">
                <el-table-column label="账户标识" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        <span class="title-head">{{scope.row.accountAlias === '' ? '--': scope.row.accountAlias}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="允许申请" align="center" min-width="100px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.canAsk == true">
                            {{scope.row.canAsk === '' ? '--': '允许'}}
                        </div>
                        <div v-if="scope.row.canAsk == false">
                            {{scope.row.canAsk === '' ? '--': '不允许'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="描述" align="center" min-width="120px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.description === '' ? '--': scope.row.description}}
                    </template>
                </el-table-column>
                <el-table-column label="计费参数" align="center" width="110px" :resizable="false">
                    <template slot-scope="scope">
                        <div class="label-div">
                            <span class="label-span" v-if="scope.row.containFee == true">
                                <span class="primy">{{scope.row.containFee === '' ? '--': '已设置'}}</span>
                            </span>
                            <span class="label-span" v-if="scope.row.containFee == false">
                                <span class="wait">{{scope.row.containFee === '' ? '--': '未设置'}}</span>
                            </span>
                            <div class="label-button">
                                <el-button size="small" class="colorG" type="text" @click="containFeeSet(scope.row)">设置</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="融券参数" align="center" width="110px" :resizable="false">
                    <template slot-scope="scope">
                        <div class="label-div">
                            <span class="label-span" v-if="scope.row.containMargin == true">
                                <span class="primy">{{scope.row.containMargin === '' ? '--': '已设置'}}</span>
                            </span>
                            <span class="label-span" v-if="scope.row.containMargin == false">
                                <span class="wait">{{scope.row.containMargin === '' ? '--': '未设置'}}</span>
                            </span>
                            <div class="label-button">
                                <el-button size="small" class="colorG" type="text" @click="containMarginSet(scope.row)">设置</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="100px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1">
                            <span class="success">{{scope.row.status === '' ? '--': '正常'}}</span>
                        </div>
                        <div v-if="scope.row.status == 2">
                            <span class="fail">{{scope.row.status === '' ? '--': '禁用'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.createTime === '' ? '--': scope.row.createTime|ellipsis(19)}}
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" align="center" min-width="130px" :resizable="false">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="updateStatus(scope.row)">状态</el-button>
                        <el-button size="small" type="text" @click="updateAccount(scope.row)">修改</el-button>
                        <el-button size="small" type="text" @click="deleteAccount(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
            </el-pagination>
        </el-row>
        <el-dialog title="账户绑定-创建账户" :visible.sync="bCodeAddDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oAddDlgData" :rules="oAddDlgRules" ref="addDlgForm" :inline="true" class="demo-form-inline">
                <el-form-item label="账户：" prop="accountId">
                    <el-select v-model="oAddDlgData.accountId" clearable
                    remote
                    filterable
                    @focus="tt2"
                    :remote-method="remoteAccount"
                    :loading="loading"
                    placeholder="请输入账户信息">
                        <el-option
                            v-for="(item,index) in accounts"
                            :key="index"
                            :label = "item.label"
                            :value = "item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="允许申请：" v-model="oAddDlgData.canAsk" prop="canAsk">
                    <el-radio v-model="oAddDlgData.canAsk" :label="true">允许</el-radio>
                    <el-radio v-model="oAddDlgData.canAsk" :label="false">禁用</el-radio>
                </el-form-item>
                <el-form-item label="描述：" prop="description" >
                    <el-input type="textarea" :autosize="{ minRows: 4}" class="el_form_input" v-model="oAddDlgData.description" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bCodeAddDlg = false">取 消</el-button>
                <el-button type="primary" @click="addAccount">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="股票账户-修改状态" :visible.sync="ShowAccountDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oAccountDlgData" :inline="true">
                <el-form-item label="状态：">
                    <el-select v-model="oAccountDlgData.status">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="禁用" :value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="ShowAccountDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyStatus">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="股票账户-修改" :visible.sync="canAskAccountDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oCanAskDlgData" ref="canAskForm" :rules="oCanAskRules" :inline="true">
                <el-form-item label="允许申请：" prop="canAsk">
                    <el-radio v-model="oCanAskDlgData.canAsk" :label="true">允许</el-radio>
                    <el-radio v-model="oCanAskDlgData.canAsk" :label="false">禁用</el-radio>
                </el-form-item>
                <el-form-item label="描述：" prop="description" >
                    <el-input type="textarea" :autosize="{ minRows: 4}" class="el_form_input" v-model="oCanAskDlgData.description" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="canAskAccountDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyCanAsk">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="计费参数-修改" :visible.sync="bContainFeeDlg" :modal="true" custom-class="width495" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="180px" :model="oContainFeeDlgData" :rules="oContainFeeRules" :inline-message="true" ref="containFeeForm" :inline="true" class="chargerForm">
                <el-form-item label="佣金买入(普通)：" prop="brokerageStandBuyRate" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.brokerageStandBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金卖出(普通)：" prop="brokerageStandSaleRate" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.brokerageStandSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金每笔最低(普通)元：" prop="brokerageStandLowest" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.brokerageStandLowest" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金买入(信用)：" prop="brokerageMarginBuyRate" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.brokerageMarginBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金卖出(信用)：" prop="brokerageMarginSaleRate" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.brokerageMarginSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金每笔最低(信用)元：" prop="brokerageMarginLowest" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.brokerageMarginLowest" size="small"></el-input>
                </el-form-item>
                <el-form-item label="印花税(卖出)：" prop="saleStampsRate" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.saleStampsRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="过户费(买入)：" prop="transferFeeBuyRate" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.transferFeeBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="过户费(卖出)：" prop="transferFeeSaleRate" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.transferFeeSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(买入)：" prop="suffixCostBuyRate" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.suffixCostBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(卖出)：" prop="suffixCostSaleRate" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.suffixCostSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(每笔最低)：" prop="suffixCostLowest" >
                    <el-input type="text" v-model.number="oContainFeeDlgData.suffixCostLowest" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bContainFeeDlg = false">取 消</el-button>
                <el-button type="primary" @click="mContainFeeList">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="融券参数-修改" :visible.sync="bContainMarginDlg" :modal="true" custom-class="width594" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="190px" :model="oContainMarginDlgData" :rules="oContainMarginRules" :inline-message="true" ref="containMarginForm" :inline="true" class="chargerForm">
                <el-form-item label="融资买入(融资保证金比例)：" prop="marginBuyRate">
                    <el-input type="number" :step="0.1" :min="0" :max="1" v-model.number="oContainMarginDlgData.marginBuyRate" size="small"></el-input>&emsp;(0-1数值表示)
                </el-form-item>
                <el-form-item label="融券卖出(融券保证金比例)：" prop="marginSaleRate">
                    <el-input type="number" :step="0.1" :min="0" :max="1" v-model.number="oContainMarginDlgData.marginSaleRate" size="small"></el-input>&emsp;(0-1数值表示)
                </el-form-item>
                <el-form-item label="融资买入(融资利息)：" prop="marginBuyInterestRate">
                    <el-input type="text" v-model.number="oContainMarginDlgData.marginBuyInterestRate" size="small"></el-input>&emsp;%
                </el-form-item>
                <el-form-item label="融券卖出(融券利息)：" prop="marginSaleInterestRate">
                    <el-input type="text" v-model.number="oContainMarginDlgData.marginSaleInterestRate" size="small"></el-input>&emsp;%
                </el-form-item>
                 <el-form-item label="普通买入(融资保证金比例)：" prop="standBuyRate">
                    <el-input type="number" :step="0.1" :min="0" :max="1" v-model.number="oContainMarginDlgData.standBuyRate" size="small"></el-input>&emsp;(0-1数值表示)
                </el-form-item>
                <el-form-item label="普通卖出(融券保证金比例)：" prop="standSaleRate">
                    <el-input type="number" :step="0.1" :min="0" :max="1" v-model.number="oContainMarginDlgData.standSaleRate" size="small"></el-input>&emsp;(0-1数值表示)
                </el-form-item>
                <el-form-item label="普通买入(融资利息)：" prop="standBuyInterestRate">
                    <el-input type="text" v-model.number="oContainMarginDlgData.standBuyInterestRate" size="small"></el-input>&emsp;%
                </el-form-item>
                <el-form-item label="普通卖出(融券利息)：" prop="standSaleInterestRate">
                    <el-input type="text" v-model.number="oContainMarginDlgData.standSaleInterestRate" size="small"></el-input>&emsp;%
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bContainMarginDlg = false">取 消</el-button>
                <el-button type="primary" @click="mContainMarginList">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import API from '../api.js';
import utils from '@/lib/utils.js';
import validate from '@/lib/validate.js';
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
            status:'',
            Ostatus:[
                {name:'正常',value:'1'},
                {name:'禁用',value:'2'},
            ],
            szFindValue:"",        //关键字
            aTableData: [],          //表格数据
            bTableLoading: false,    //表格数据是否在加载中
            oCurrRowData: {},        //当前行
            pageConfig: {           //分页数据
                pageNumber: 1,      //当前页
                pageSize: 10,       //每页数量
                totalPage: 0,       //总页数
                totalRow: 0         //总条数
            },
            // ----添加---
            bCodeAddDlg:false,
            oAddDlgData:{
                accountId:'',
                canAsk:false,
                description:"",
            },
            oAddDlgRules:{
                accountId:[{ required: true, message: '不能为空', trigger: 'blur' }],
                canAsk:[{ required: true, message: '不能为空', trigger: 'blur' }],
                description:[{ required: true, message: '不能为空', trigger: 'blur' }]
            },
            // 账户选择器
            loading: false,
            accounts:[], //账户列表
            // -------状态----
            ShowAccountDlg:false,
            oAccountDlgData:{
                accountId:"",
                status:"",
            },
            // ------修改
            canAskAccountDlg:false,
            oCanAskDlgData:{
                teamId:'',
                accountId:"",
                canAsk:'',
                description:"",
            },
            oCanAskRules:{
                canAsk:[{ required: true, message: '不能为空', trigger: 'blur'}],
                description:[{ required: true, message: '不能为空', trigger: 'blur' }]
            },
            // 计费参数修改
            bContainFeeDlg:false,
            oContainFeeDlgData:{
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
            },
            oContainFeeRules:{
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
            },
            // ---------融券参数修改------
            bContainMarginDlg:false,
            oContainMarginDlgData:{
                accountId:'',
                marginBuyRate:'',
                marginSaleRate:'',
                marginBuyInterestRate:'',
                marginSaleInterestRate:'',
                standBuyRate:'',
                standSaleRate:'',
                standBuyInterestRate:'',
                standSaleInterestRate:'',
            },
            oContainMarginRules:{
                marginBuyRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:newReg2}],
                marginSaleRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:newReg2}],
                marginBuyInterestRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                marginSaleInterestRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                standBuyRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:newReg2}],
                standSaleRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:newReg2}],
                standBuyInterestRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                standSaleInterestRate:[{ required: true, message: '不能为空' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
            },
        }
    },
    methods:{
        // ----------计费参数修改弹框-------------
        containFeeSet(row){
            this.bContainFeeDlg = true;
            this.oContainFeeDlgData.accountId  = row.accountId;
            this.$refs.containFeeForm ? this.$refs.containFeeForm.resetFields() : '';
            this.containFeeItem();
        },
        //-----------计费参数单项查询-----
        containFeeItem(){
            var data = {
                accountId:this.oContainFeeDlgData.accountId,
            }
            API.containFeeItem(data).then(res => {
                this.oContainFeeDlgData = {
                    brokerageStandBuyRate:res.data.data.brokerageStandBuyRate,
                    brokerageStandSaleRate:res.data.data.brokerageStandSaleRate,
                    brokerageStandLowest:res.data.data.brokerageStandLowest,
                    brokerageMarginBuyRate:res.data.data.brokerageMarginBuyRate,
                    brokerageMarginSaleRate:res.data.data.brokerageMarginSaleRate,
                    brokerageMarginLowest:res.data.data.brokerageMarginLowest,
                    saleStampsRate:res.data.data.saleStampsRate,
                    transferFeeBuyRate:res.data.data.transferFeeBuyRate,
                    transferFeeSaleRate:res.data.data.transferFeeSaleRate,
                    suffixCostBuyRate:res.data.data.suffixCostBuyRate,
                    suffixCostSaleRate:res.data.data.suffixCostSaleRate,
                    suffixCostLowest:res.data.data.suffixCostLowest,
                }
            }).catch(err => {})
        },
        // ------计费参数修改------------
        mContainFeeList(){
             this.$refs.containFeeForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    accountId:this.oCurrRowData.accountId,
                    brokerageStandBuyRate:this.oContainFeeDlgData.brokerageStandBuyRate,
                    brokerageStandSaleRate:this.oContainFeeDlgData.brokerageStandSaleRate,
                    brokerageStandLowest:this.oContainFeeDlgData.brokerageStandLowest,
                    brokerageMarginBuyRate:this.oContainFeeDlgData.brokerageMarginBuyRate,
                    brokerageMarginSaleRate:this.oContainFeeDlgData.brokerageMarginSaleRate,
                    brokerageMarginLowest:this.oContainFeeDlgData.brokerageMarginLowest,
                    saleStampsRate:this.oContainFeeDlgData.saleStampsRate,
                    transferFeeBuyRate:this.oContainFeeDlgData.transferFeeBuyRate,
                    transferFeeSaleRate:this.oContainFeeDlgData.transferFeeSaleRate,
                    suffixCostBuyRate:this.oContainFeeDlgData.suffixCostBuyRate,
                    suffixCostSaleRate:this.oContainFeeDlgData.suffixCostSaleRate,
                    suffixCostLowest:this.oContainFeeDlgData.suffixCostLowest,
                }
                API.updateContainFee(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.bContainFeeDlg = false;
                        this.$notify({
                            message: '修改成功',
                            type: 'success'
                        });
                        setTimeout(() => {
                            this.getTableData();
                        }, 300);
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                }).catch(err => {})
             })
        },
        // --------------融券参数弹框-------
        containMarginSet(row){
            this.bContainMarginDlg = true;
            this.oContainMarginDlgData.accountId  = row.accountId;
            this.$refs.containMarginForm ? this.$refs.containMarginForm.resetFields() : '';
            this.containMarginItem();
        },
        // ---------融券参数单项查询----------
        containMarginItem(){
            var data = {
                accountId:this.oContainMarginDlgData.accountId,
            }
            API.containMarginItem(data).then(res => {
                this.oContainMarginDlgData = {
                    marginBuyRate:res.data.data.marginBuyRate,
                    marginSaleRate:res.data.data.marginSaleRate,
                    marginBuyInterestRate:res.data.data.marginBuyInterestRate,
                    marginSaleInterestRate:res.data.data.marginSaleInterestRate,
                    standBuyRate:res.data.data.standBuyRate,
                    standSaleRate:res.data.data.standSaleRate,
                    standBuyInterestRate:res.data.data.standBuyInterestRate,
                    standSaleInterestRate:res.data.data.standSaleInterestRate,
                }
            }).catch(err => {})
        },
        mContainMarginList(){
            this.$refs.containMarginForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    accountId:this.oCurrRowData.accountId,
                    marginBuyRate:this.oContainMarginDlgData.marginBuyRate,
                    marginSaleRate:this.oContainMarginDlgData.marginSaleRate,
                    marginBuyInterestRate:this.oContainMarginDlgData.marginBuyInterestRate,
                    marginSaleInterestRate:this.oContainMarginDlgData.marginSaleInterestRate,
                    standBuyRate:this.oContainMarginDlgData.standBuyRate,
                    standSaleRate:this.oContainMarginDlgData.standSaleRate,
                    standBuyInterestRate:this.oContainMarginDlgData.standBuyInterestRate,
                    standSaleInterestRate:this.oContainMarginDlgData.standSaleInterestRate,
                }
                API.updateContainMargin(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.bContainMarginDlg = false;
                        this.$notify({
                            message: '修改成功',
                            type: 'success'
                        });
                        setTimeout(() => {
                            this.getTableData();
                        }, 300);
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                }).catch(err => {})
            })
        },
        // ----------删除-----------
        deleteAccount(row){
            this.$confirm('确认删除用户： '+ row.accountAlias,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.removeAccount(row);
            }).catch(() =>{})
        },
        removeAccount(row){
            var data = {
                accountId:row.accountId
            };
            API.deleteCodeccount(data).then(res =>{
                if(res.data.code == 'OK'){
                    this.$notify({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getTableData();
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // ----------修改----------
        updateAccount(row){
            this.canAskAccountDlg = true;
            this.oCanAskDlgData.accountId = row.accountId;
            this.oCanAskDlgData.teamId = row.teamId;
            this.oCanAskDlgData.canAsk = row.canAsk;
            this.oCanAskDlgData.description = row.description;
            // this.$refs.canAskForm ? this.$refs.canAskForm.resetFields() : '';
        },
        modifyCanAsk(){
            this.$refs.canAskForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    teamId:this.oCanAskDlgData.teamId,
                    accountId:this.oCanAskDlgData.accountId,
                    canAsk:this.oCanAskDlgData.canAsk,
                    description:this.oCanAskDlgData.description,
                }
                API.updateCanAsk(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.canAskAccountDlg = false;
                        this.$notify({
                            message: '修改成功',
                            type: 'success'
                        });
                        setTimeout(() => {
                            this.getTableData();
                        }, 300);
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }

                }).catch(err => {})
            })
        },
        // ------------状态----------
        updateStatus(row){
            this.ShowAccountDlg = true;
            this.oAccountDlgData.status = row.status;
            this.oAccountDlgData.accountId = row.accountId;
        },
        modifyStatus(){
            var data = {
                status:this.oAccountDlgData.status,
                accountId:this.oAccountDlgData.accountId,
            }
            API.modifyAccountStatus(data).then(res => {
                if (res.data.code === 'OK') {
                    this.ShowAccountDlg = false;
                    this.$notify({
                        message: '修改成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        this.getTableData();
                    }, 300);
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            }).catch(err => {})
        },
        // 账户信息选择器
        remoteAccount(query){
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
                        this.accounts = arr.map(item => {
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
                this.accounts = arr.map(item => {
                    return { value: item.id, label: item.alias };
                })
            })
        },
        // -----------添加--------------
        codeAddDlg(){
            this.bCodeAddDlg = true;
            this.$refs.addDlgForm ? this.$refs.addDlgForm.resetFields() : '';
        },
        addAccount(){
            this.$refs.addDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    accountId:this.oAddDlgData.accountId,
                    canAsk:this.oAddDlgData.canAsk,
                    description:this.oAddDlgData.description
                }
                API.codeAccountCreat(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.bCodeAddDlg = false;
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
                }).catch(err =>{})
            })
        },

        //------------查询--------------------
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
            this.oChooseDlgData.accountId = '',
            this.status = '';
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                findkey:this.szFindValue,
                status:this.status,
            };
            this.bTableLoading = true;
            API.codeAccount(data).then(res => {
                this.bTableLoading = false;
                this.aTableData = res.data.data.list;
                this.pageConfig.pageSize = res.data.data.pageSize;
                this.pageConfig.totalRow = res.data.data.totalRow;
                this.pageConfig.totalPage = res.data.data.totalPage;
            })
        },
    },
    created(){
        this.$nextTick(function () {
            this.$refs.keyword.$el.querySelector('[icon=search]').focus();
        });
        document.title = '股票账户';
        this.getTableData(); //获取表格数据
    },
}
</script>

<style scoped>
    .chargerForm .el-form-item {
        margin-bottom: 0px;
        /* display: inline-block; */
    }
    .chargerForm .el-form-item__content .el-input {
        width: 180px;
    }
    .el-button.el-button--text.el-button--small{
        padding: 0px!important;
    }
    .el_form_input {
        width: 240px!important;
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
