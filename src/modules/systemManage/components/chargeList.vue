<template>
    <div>
        <el-row :gutter="10">
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
                <el-table-column fixed="left" label="模板说明" align="center" width="160px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.description === '' ? '--': scope.row.description}}
                    </template>
                </el-table-column>
                <el-table-column label="佣金买入(普通)" min-width="150px" align="center" :resizable="false">
                    <template slot-scope="scope">
                        <span class="title-head">{{scope.row.brokerageStandBuyRate === '' ? '--': scope.row.brokerageStandBuyRate*10000|fixedFloat(1)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="佣金卖出(普通)" align="center" min-width="150px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.brokerageStandSaleRate === '' ? '--': scope.row.brokerageStandSaleRate*10000|fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="佣金每笔最低(普通)" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.brokerageStandLowest === '' ? '--': scope.row.brokerageStandLowest |fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="佣金买入(信用)" align="center" min-width="150px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.brokerageMarginBuyRate === '' ? '--': scope.row.brokerageMarginBuyRate*10000|fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="佣金卖出(信用)" align="center" min-width="150px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.brokerageMarginSaleRate === '' ? '--': (scope.row.brokerageMarginSaleRate*10000).toFixed(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="佣金每笔最低(信用)" align="center" width="160px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.brokerageMarginLowest === '' ? '--': scope.row.brokerageMarginLowest|fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="印花税(卖出)" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.saleStampsRate === '' ? '--': scope.row.saleStampsRate*10000|fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="过户费(买入)" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.transferFeeBuyRate === '' ? '--': scope.row.transferFeeBuyRate*10000|fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="过户费(卖出)" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.transferFeeSaleRate === '' ? '--': scope.row.transferFeeSaleRate*10000|fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="附加费(买入)" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.suffixCostBuyRate === '' ? '--': scope.row.suffixCostBuyRate*10000|fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="附加费(卖出)" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.suffixCostSaleRate === '' ? '--': scope.row.suffixCostSaleRate*10000|fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="附加费(每笔最低)" align="center" width="160px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.suffixCostLowest === '' ? '--': scope.row.suffixCostLowest*10000|fixedFloat(1)}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" min-width="150px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.createTime === '' ? '--': scope.row.createTime|ellipsis(19)}}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center" min-width="150px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="140px" :resizable="false">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="modifyCharge(scope.row)">修改</el-button>
                        <el-button size="small" type="text" @click="deleteAct(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
            </el-pagination>
        </el-row>
        <el-dialog title="计费模板-修改" :visible.sync="bShowChargeDlg" :modal="true" custom-class="width495" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="180px" :model="oChargeDlgData" :rules="oChargeDlgRules" ref="chargeDlgForm" :inline-message="true" :inline="true" class="chargerForm">
                <el-form-item label="说明：" prop="description" >
                    <el-input type="text" class="el_form_input" v-model="oChargeDlgData.description" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金买入(普通)：" prop="brokerageStandBuyRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageStandBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金卖出(普通)：" prop="brokerageStandSaleRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageStandSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金每笔最低(普通)：元" prop="brokerageStandLowest" >
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageStandLowest" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金买入(信用)：" prop="brokerageMarginBuyRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageMarginBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金卖出(信用)：" prop="brokerageMarginSaleRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageMarginSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金每笔最低(信用)：元" prop="brokerageMarginLowest" >
                    <el-input type="text" v-model.number="oChargeDlgData.brokerageMarginLowest" size="small"></el-input>
                </el-form-item>
                <el-form-item label="印花税(卖出)：" prop="saleStampsRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.saleStampsRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="过户费(买入)：" prop="transferFeeBuyRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.transferFeeBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="过户费(卖出)：" prop="transferFeeSaleRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.transferFeeSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(买入)：" prop="suffixCostBuyRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.suffixCostBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(卖出)：" prop="suffixCostSaleRate" >
                    <el-input type="text" v-model.number="oChargeDlgData.suffixCostSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(每笔最低)：" prop="suffixCostLowest" >
                    <el-input type="text" v-model.number="oChargeDlgData.suffixCostLowest" size="small"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer">
                <el-button @click="bShowChargeDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyChargeList">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="计费模板-添加" :visible.sync="bAddChargeDlg" :modal="true" custom-class="width495" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="180px" :model="oChargeAddData"  ref="chargeAddForm" :rules="oChargeRules" :inline-message="true" :inline="true" class="chargerForm">
                <el-form-item label="说明：" prop="description" >
                    <el-input type="text" class="el_form_input" v-model="oChargeAddData.description" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金买入(普通)：" prop="brokerageStandBuyRate" >
                    <el-input type="text" v-model.number="oChargeAddData.brokerageStandBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金卖出(普通)：" prop="brokerageStandSaleRate" >
                    <el-input type="text" v-model.number="oChargeAddData.brokerageStandSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金每笔最低(普通)：元" prop="brokerageStandLowest" >
                    <el-input type="text" v-model.number="oChargeAddData.brokerageStandLowest" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金买入(信用)：" prop="brokerageMarginBuyRate" >
                    <el-input type="text" v-model.number="oChargeAddData.brokerageMarginBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金卖出(信用)：" prop="brokerageMarginSaleRate" >
                    <el-input type="text" v-model.number="oChargeAddData.brokerageMarginSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="佣金每笔最低(信用)：元" prop="brokerageMarginLowest" >
                    <el-input type="text" v-model.number="oChargeAddData.brokerageMarginLowest" size="small"></el-input>
                </el-form-item>
                <el-form-item label="印花税(卖出)：" prop="saleStampsRate" >
                    <el-input type="text" v-model.number="oChargeAddData.saleStampsRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="过户费(买入)：" prop="transferFeeBuyRate" >
                    <el-input type="text" v-model.number="oChargeAddData.transferFeeBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="过户费(卖出)：" prop="transferFeeSaleRate" >
                    <el-input type="text" v-model.number="oChargeAddData.transferFeeSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(买入)：" prop="suffixCostBuyRate" >
                    <el-input type="text" v-model.number="oChargeAddData.suffixCostBuyRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(卖出)：" prop="suffixCostSaleRate" >
                    <el-input type="text" v-model.number="oChargeAddData.suffixCostSaleRate" size="small"></el-input>
                </el-form-item>
                <el-form-item label="附加费(每笔最低)：" prop="suffixCostLowest" >
                    <el-input type="text" v-model.number="oChargeAddData.suffixCostLowest" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bAddChargeDlg = false">取 消</el-button>
                <el-button type="primary" @click="addChargeList">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import API from '../api.js';
import utils from '@/lib/utils.js';
import validate from '@/lib/validate.js';
export default {
    data(){
        return {
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
            bAddChargeDlg:false,//添加
            oChargeAddData:{
                description:"",
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
            oChargeRules:{
                description:[{ required: true, message: '不能为空' ,trigger:'blur'}],
                brokerageStandBuyRate:[{ required: true, message: '不能为空' ,trigger:'blur'},{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageStandSaleRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageStandLowest:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageMarginBuyRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageMarginSaleRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageMarginLowest:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                saleStampsRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                transferFeeBuyRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                transferFeeSaleRate:[{ required: true, message: '不能为空' ,trigger:'blur'},{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                suffixCostBuyRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                suffixCostSaleRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                suffixCostLowest:[{ required: true, message: '不能为空' ,trigger:'blur'},{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
            },
            bShowChargeDlg:false, //修改
            oChargeDlgData:{
                featFeeId:'',
                description:"",
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
            oChargeDlgRules:{
                description:[{ required: true, message: '不能为空' ,trigger:'blur'}],
                brokerageStandBuyRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageStandSaleRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageStandLowest:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageMarginBuyRate:[{ required: true, message: '不能为空' ,trigger:'blur'},{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageMarginSaleRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                brokerageMarginLowest:[{ required: true, message: '不能为空' ,trigger:'blur'},{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                saleStampsRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                transferFeeBuyRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                transferFeeSaleRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                suffixCostBuyRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                suffixCostSaleRate:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
                suffixCostLowest:[{ required: true, message: '不能为空',trigger:'blur' },{type:'number',message:'只能为数字'},{validator:validate.isNotNegativeNumber}],
            }
        }
    },
    methods:{
        // ------------添加----------------
        showAddDlg(){
            this.bAddChargeDlg = true;
            this.$refs.chargeAddForm ? this.$refs.chargeAddForm.resetFields() : '';
        },
        addChargeList(){
            this.$refs.chargeAddForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    description:this.oChargeAddData.description,
                    brokerageStandBuyRate:this.oChargeAddData.brokerageStandBuyRate/10000,
                    brokerageStandSaleRate:this.oChargeAddData.brokerageStandSaleRate/10000,
                    brokerageStandLowest:this.oChargeAddData.brokerageStandLowest,
                    brokerageMarginBuyRate:this.oChargeAddData.brokerageMarginBuyRate/10000,
                    brokerageMarginSaleRate:this.oChargeAddData.brokerageMarginSaleRate/10000,
                    brokerageMarginLowest:this.oChargeAddData.brokerageMarginLowest,
                    saleStampsRate:this.oChargeAddData.saleStampsRate/10000,
                    transferFeeBuyRate:this.oChargeAddData.transferFeeBuyRate/10000,
                    transferFeeSaleRate:this.oChargeAddData.transferFeeSaleRate/10000,
                    suffixCostBuyRate:this.oChargeAddData.suffixCostBuyRate/10000,
                    suffixCostSaleRate:this.oChargeAddData.suffixCostSaleRate/10000,
                    suffixCostLowest:this.oChargeAddData.suffixCostLowest/10000,
                }
                API.updateCharge(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.$notify({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.bAddChargeDlg = false;
                        this.getTableData();
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                }).catch(err => {})
            })
        },
        // -------------修改----------------
        modifyCharge(row){
            this.bShowChargeDlg = true;
            this.$refs.chargeDlgForm ? this.$refs.chargeDlgForm.resetFields() : '';
            this.oChargeDlgData.featFeeId = row.id;
            this.oChargeDlgData.description=row.description;
            this.oChargeDlgData.brokerageStandBuyRate=accMul(row.brokerageStandBuyRate,10000);
            this.oChargeDlgData.brokerageStandSaleRate=accMul(row.brokerageStandSaleRate,10000);
            this.oChargeDlgData.brokerageStandLowest=row.brokerageStandLowest;
            this.oChargeDlgData.brokerageMarginBuyRate=accMul(row.brokerageMarginBuyRate,10000);
            this.oChargeDlgData.brokerageMarginSaleRate=accMul(row.brokerageMarginSaleRate,10000);
            this.oChargeDlgData.brokerageMarginLowest=row.brokerageMarginLowest;
            this.oChargeDlgData.saleStampsRate=accMul(row.saleStampsRate,10000);
            this.oChargeDlgData.transferFeeBuyRate=accMul(row.transferFeeBuyRate,10000);
            this.oChargeDlgData.transferFeeSaleRate=accMul(row.transferFeeSaleRate,10000);
            this.oChargeDlgData.suffixCostBuyRate=accMul(row.suffixCostBuyRate,10000);
            this.oChargeDlgData.suffixCostSaleRate=accMul(row.suffixCostSaleRate,10000);
            this.oChargeDlgData.suffixCostLowest=accMul(row.suffixCostLowest,10000);
        },
        modifyChargeList(){
            this.$refs.chargeDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    featFeeId:this.oChargeDlgData.featFeeId,
                    description:this.oChargeDlgData.description,
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
                }
                API.updateCharge(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.$notify({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.bShowChargeDlg = false;
                        this.getTableData();
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                }).catch(err => {})
            })
        },
        // -----------删除--------------------
        deleteAct(row){
            this.$confirm('确认删除： ' , '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.deleteChargeList(row);
            }).catch(() => {
            });
        },
        deleteChargeList(row){
            var data = {
                featFeeId:row.id,
            }
            API.deleteChargeList(data).then(res => {
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
            }).catch(err => {})
        },
        // -------------查询-------------------
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
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
            };
            this.bTableLoading = true;
            API.chargeSelect(data).then(res => {
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
        document.title = '计费模板';
        this.getTableData();
    }
}
</script>

<style scoped>
    .el_form_input {
        width: 180px;
    }
    .chargerForm .el-form-item {
        margin-bottom: 0px;
        display: inline-block;
    }
    .chargerForm .el-form-item__content .el-input {
        width: 180px;
    }
</style>
