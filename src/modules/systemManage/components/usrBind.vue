<template>
    <div class="heightP100">
        <div>
            <el-row :gutter="10">
                <div :gutter="10" class="marginL10 floatL">
                    <span class="fontSize13">用户：</span>
                    <el-select v-model="oChooseDlgData.usrId" 
                    remote clearable class="width145"
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
                    <el-select v-model="oChooseDlgData.accountId" clearable
                    remote class="width180"
                    filterable
                    @focus="c2"
                    @change="getTableData()"
                    :remote-method="remoteMethods2"
                    :loading="loading" 
                    placeholder="账户信息">
                        <el-option
                            v-for="(item,index) in option2"
                            :key="index"
                            :label = "item.label" 
                            :value = "item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
                <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
                <el-button type="primary" icon="plus" class="floatR marginT5 marginR5" @click="showAddDlg" size="small">添加</el-button>
            </el-row>
            <el-row class="marginT10">
                <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow" class="label6-hover">
                    <el-table-column label="用户标识" align="center" min-width="120px" :resizable="false">
                        <template slot-scope="scope">
                            <span class="title-head">{{scope.row.usrAlias === '' ? '--': scope.row.usrAlias}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="账户标识" align="center" min-width="120px" :resizable="false">
                        <template slot-scope="scope">
                            {{scope.row.accountAlias === '' ? '--': scope.row.accountAlias}}
                        </template>
                    </el-table-column>
                    <el-table-column label="允许申请" align="center" min-width="100px" :resizable="false">
                        <template slot-scope="scope">
                            <div v-if="scope.row.canAskActive == true">
                                {{scope.row.canAskActive === '' ? '--': '允许'}}
                            </div>
                            <div v-if="scope.row.canAskActive == false">
                                {{scope.row.canAskActive === '' ? '--': '禁用'}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="定制计费" align="center" width="110px" :resizable="false">
                        <template slot-scope="scope">
                            <div class="label-div">
                                <span class="label-span" v-if="scope.row.containFee == true">
                                    {{scope.row.containFee === '' ? '--': scope.row.feeDescription}}
                                </span>
                                <span class="label-span fail" v-if="scope.row.containFee == false">
                                    {{scope.row.containFee === '' ? '--': '未定制'}}
                                </span>
                                <div class="label-button">
                                    <el-button size="small" class="colorG" type="text" @click="containFeeSet(scope.row)">设置</el-button>
                                </div>
                            </div>
                            <!-- <span v-if="scope.row.containFee == true">{{scope.row.containFee === '' ? '--': '已定制'}}</span>
                            <span v-if="scope.row.containFee == false">{{scope.row.containFee === '' ? '--': '未定制'}}</span>                             -->
                        </template>
                    </el-table-column>
                    <el-table-column label="描述" align="center" min-width="120px" :resizable="false">
                        <template slot-scope="scope">
                            {{scope.row.description === '' ? '--': scope.row.description}}
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
                    <el-table-column label="操作" align="center" min-width="130px" :resizable="false">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="modifyBindStatus(scope.row)">状态</el-button>
                            <el-button size="small" type="text" :disabled ="!scope.row.canAskHang" @click="modifyBindAccount(scope.row)">修改</el-button>
                            <el-button size="small" type="text" @click="deleteBindAccount(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
                </el-pagination>
            </el-row>
        </div>
        <el-dialog title="账户授权-用户绑定-创建" :visible.sync="bShowAddDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oAddDlgData" :rules="oAddDlgRules" ref="addDlgForm" :inline="true" class="demo-form-inline">
                <el-form-item label="授权用户：" prop="usrId" >
                    <el-select v-model="oAddDlgData.usrId" 
                    remote clearable
                    filterable
                    @focus="c1"
                    :remote-method="remoteMethods1"
                    :loading="loading" 
                    placeholder="请输入用户信息">
                        <el-option
                            v-for="(item,index) in option1"
                            :key="index"
                            :label = "item.label" 
                            :value = "item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易账户：" prop="accountId"> 
                    <el-select v-model="oAddDlgData.accountId" clearable
                    remote 
                    filterable
                    @focus="c2"
                    :remote-method="remoteMethods2"
                    :loading="loading" 
                    placeholder="请输入交易账户信息">
                        <el-option
                            v-for="(item,index) in option2"
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
                <el-button @click="bShowAddDlg = false">取 消</el-button>
                <el-button type="primary" @click="addAccount">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="用户绑定-修改状态" :visible.sync="oShowStatusDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oStatusDlgData" :inline="true">
                <el-form-item label="状态：">
                    <el-select v-model="oStatusDlgData.status">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="禁用" :value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="oShowStatusDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyStatus">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="用户绑定-修改" :visible.sync="canAskAccountDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
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
        <el-dialog title="用户绑定-定制计费" :visible.sync="ShowContainFeeDlg" :modal="true" custom-class="width495" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="updateContainFee" :inline="true" :rules="containFeeRules" ref="ContainFeeDlgForm">
                <el-form-item label="计费列表：" prop="feeId">
                    <el-select v-model="updateContainFee.feeId" 
                    remote clearable class="width240"
                    filterable
                    @focus="containTT"
                    :remote-method="containFeeList"
                    :loading="loading" 
                    placeholder="计费信息">
                        <el-option
                            v-for="(item,index) in cList"
                            :key="index"
                            :label = "item.label" 
                            :value = "item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="ShowContainFeeDlg = false">取 消</el-button>
                <el-button type="primary" @click="updateContainFeeList">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import API from '../api.js';
import validate from '@/lib/validate.js';
export default {
    data() {
        return {
            oChooseDlgData:{
                usrId:'',
                accountId:'',
            },
            option1:[],
            option2:[],
            aTableData: [],          //表格数据
            bTableLoading: false,    //表格数据是否在加载中
            oCurrRowData: {},        //当前行
            pageConfig: {           //分页数据
                pageNumber: 1,      //当前页
                pageSize: 10,       //每页数量
                totalPage: 0,       //总页数
                totalRow: 0         //总条数
            },
            bShowAddDlg:false,
            oAddDlgData:{ //创建账户数据
                usrId:'',
                accountId:'',
                canAsk:false,
                description:"",
            },
            oAddDlgRules:{ //弹框验证规则
                usrId:[{ required: true, message: '不能为空', trigger: 'blur' }],
                accountId:[{ required: true, message: '不能为空', trigger: 'blur' }],
                canAsk:[{ required: true, message: '不能为空', trigger: 'blur' }],
            },
            // 用户授权列表-选择器
            restaurants: [],
            timeout:  null,
            zTableData:[], //用户授权列表
            loading: false,
            options:[],//用户授权列表
            options2:[], //账户列表
            zTableData2:[],//账户列表
            // ------状态
            oShowStatusDlg:false,
            oStatusDlgData:{
                usrId:'',
                accountId:'',
                status:'',
            },
            // -------修改数据---
            canAskAccountDlg:false,
            oCanAskDlgData:{
                usrId:'',
                accountId:'',
                feeId:'',
                canAsk:'',
                description:'',
            },
            oCanAskRules:{
                canAsk:[{ required: true, message: '不能为空', trigger: 'blur' }],
                description:[{ required: true, message: '不能为空', trigger: 'blur' }]
            },
            // 定制计费
            ShowContainFeeDlg:false,
            updateContainFee:{
                usrId:'',
                feeId:'',
                accountId:"",
            },
            zContainFeeData:[],
            cList:[],
            containFeeRules:{
                feeId:[{ required: true, message: '不能为空', trigger: 'blur' }]
            }
        }
    },
    methods:{
        // ----------------条件筛选----------
        // 用户信息筛选
        remoteMethods1(query) {
            if (query != '') {
                setTimeout(() => {
                    this.loading = true;
                    var data = {
                        findkey:query
                    };
                    API.userSelect(data).then(res => {
                        this.loading = false;
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
        // 账户信息筛选
        remoteMethods2(query){
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
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
                        this.option2 = arr.map(item => {
                            return { value: item.id, label: item.alias };
                        })
                    })
                }, 300);
            }
        },
        c2 () {
            var data = {};
            this.loading = true;
            API.accountSelect(data).then(res => {
                this.loading = false;
                var arr = [];
                for (var i in res.data.data) {
                    arr.push(res.data.data[i]); 
                }
                this.option2 = arr.map(item => {
                    return { value: item.id, label: item.alias };
                })
            })
        },
        // // ------------定制计费---------
        // 计费参数
        containFeeSet(row){
            this.ShowContainFeeDlg = true;
            this.$refs.ContainFeeDlgForm ? this.$refs.ContainFeeDlgForm.resetFields() : '';
            this.updateContainFee.usrId = row.usrId;
            this.updateContainFee.accountId = row.accountId;
        },
        containFeeList(query) {
            if (query !== '') {
                setTimeout(() => {
                    this.loading = true;
                    var data = {
                        findkey:query
                    };
                    API.chargeListSelect(data).then(res => {
                        this.loading = false;
                        let arr = [];
                        for(let i in res.data.data){
                            arr.push(res.data.data[i])
                        };
                        this.cList = arr.map(item => {
                            return { value:item.id,label:item.description}
                        })
                    })
                }, 300);
            }
        },
        containTT () {
            var data = {};
            this.loading = true;
            API.chargeListSelect(data).then(res => {
                this.loading = false;
                var arr = [];
                for (var i in res.data.data) {
                    arr.push(res.data.data[i]); 
                }
                this.cList = arr.map(item => {
                    return { value:item.id,label:item.description};
                })
            })
        },
        updateContainFeeList(){
            this.$refs.ContainFeeDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    feeId:this.updateContainFee.feeId,
                    usrId:this.updateContainFee.usrId,
                    accountId:this.updateContainFee.accountId,
                }
                API.usrContainFee(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.ShowContainFeeDlg = false;
                        this.$notify({
                            message: '设置成功',
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
        // -----------状态弹框-----------
        modifyBindStatus(row){
            this.oShowStatusDlg = true;
            this.oStatusDlgData.usrId  = row.usrId;
            this.oStatusDlgData.accountId = row.accountId;
            this.oStatusDlgData.status = row.status;
        },
        // ---------修改状态--------------
        modifyStatus(){
            var data = {
                usrId:this.oStatusDlgData.usrId,
                accountId:this.oStatusDlgData.accountId,
                status:this.oStatusDlgData.status,
            }
            API.updateBindStatus(data).then(res => {
                if (res.data.code === 'OK') {
                    this.oShowStatusDlg = false;
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
        // ------------修改数据弹框------------
        modifyBindAccount(row){
            this.canAskAccountDlg = true;
            this.oCanAskDlgData.usrId = row.usrId;
            this.oCanAskDlgData.accountId = row.accountId;
            this.oCanAskDlgData.feeId = row.feeId;
            this.oCanAskDlgData.canAsk = row.canAskActive;
            this.oCanAskDlgData.description = row.description;
            // this.$refs.canAskForm ? this.$refs.canAskForm.resetFields() : '';
        },
        // ---------修改数据-------
        modifyCanAsk(){
            this.$refs.canAskForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    usrId:this.oCanAskDlgData.usrId,
                    accountId:this.oCanAskDlgData.accountId,
                    feeId:this.oCanAskDlgData.feeId,
                    canAsk:this.oCanAskDlgData.canAsk,
                    description:this.oCanAskDlgData.description,
                }
                API.updateBindCanAsk(data).then(res => {
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
        // -----------删除---------------
        deleteBindAccount(row){
            this.$confirm('确认删除账户： ' + row.usrAlias, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.deleteAct(row);
            }).catch(() => {});
        },
        deleteAct(row){
            var data = {
                usrId:row.usrId,
                accountId:row.accountId,
            };
            API.deleteBindingAccount(data).then(res => {
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
            }).catch(err => {
                console.log(err)
            })
        },
        //------------创建------------------
        showAddDlg(){
            this.bShowAddDlg = true;
            this.$refs.addDlgForm ? this.$refs.addDlgForm.resetFields() : '';
        },
        addAccount(){ //创建账户绑定
        this.$refs.addDlgForm.validate((valid) => {
            if (!valid) {
                return false;
            }
            var data = {
                usrId:this.oAddDlgData.usrId,
                accountId:this.oAddDlgData.accountId,
                canAsk:this.oAddDlgData.canAsk,
                description:this.oAddDlgData.description,
            };
            API.accountBindingCreate(data).then(res => {
                if (res.data.code === 'OK') {
                    this.bShowAddDlg = false;
                    this.$notify({
                        message: '创建成功',
                        type: 'success'
                    });
                    this.getTableData();
                    // this.oAddDlgData = {}
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
            this.oChooseDlgData.usrId = '',
            this.oChooseDlgData.accountId = '',
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                findkey:this.szFindValue,
                usrId:this.oChooseDlgData.usrId,
                accountId:this.oChooseDlgData.accountId,
            };
            this.bTableLoading = true;
            API.accountBinding(data).then(res => {
                this.bTableLoading = false;
                this.aTableData = res.data.data.list;
                this.pageConfig.pageSize = res.data.data.pageSize;
                this.pageConfig.totalRow = res.data.data.totalRow;
                this.pageConfig.totalPage = res.data.data.totalPage;
            })
        },
    },
    created(){
        document.title = '账户绑定';
        this.getTableData(); //获取表格数据
    },
}
</script>

<style scoped>
   .el_form_input {
        width: 240px!important;
    }
    .el-button.el-button--text.el-button--small{
        padding: 0px!important;
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
