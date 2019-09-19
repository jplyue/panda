<template>
    <div>
        <el-row :gutter="10" class="marginB10">
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
                <el-table-column fixed label="用户标识" width="120px" align="center" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.usrAlias === '' ? '--': scope.row.usrAlias}}
                    </template>
                </el-table-column>
                <el-table-column label="大网IP" min-width="120px" align="center" :resizable="false">
                    <template slot-scope="scope">
                        <span class="title-head">{{scope.row.wanIp === '' ? '--': scope.row.wanIp}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="小网IP" min-width="120px" align="center" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.lanIp === '' ? '--': scope.row.lanIp}}
                    </template>
                </el-table-column>
                <el-table-column label="物理Mac" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.macAddr === '' ? '--': scope.row.macAddr}}
                    </template>
                </el-table-column>
                <el-table-column label="描述" min-width="120px" align="center" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.description === '' ? '--': scope.row.description}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="100px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 1" class="success">
                            {{scope.row.status === '' ? '--': '有效'}}
                        </div>
                        <div v-if="scope.row.status == 2" class="fail">
                            {{scope.row.status === '' ? '--': '禁用'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" min-width="150px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.createTime === '' ? '--': scope.row.createTime|ellipsis(19)}}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" min-width="150px" align="center" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="130px" :resizable="false">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="modifyAccess(scope.row)">修改</el-button>
                        <el-button size="small" type="text" @click="modifyStatus(scope.row)">状态</el-button>
                        <el-button size="small" type="text" @click="deleteAccess(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
            </el-pagination>
        </el-row>
        <el-dialog title="会话控制-修改状态" :visible.sync="bShowStatusDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oAccessDlgData" :inline="true">
                <el-form-item label="状态：">
                    <el-select v-model="oAccessDlgData.status">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="禁用" :value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowStatusDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyStatusAccess">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="会话控制-修改参数" :visible.sync="bShowSetDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oSetDlgData" ref="oSetDlgForm" :rules="oSetRules" :inline="true">
                <el-form-item label="大网IP：" prop="wanIp">
                    <el-input type="text" size="small" v-model="oSetDlgData.wanIp"></el-input>
                </el-form-item>
                <el-form-item label="小网IP：" prop="lanIp">
                    <el-input type="text" size="small" v-model="oSetDlgData.lanIp"></el-input>
                </el-form-item>
                <el-form-item label="Mac地址：" prop="macAddr">
                    <el-input type="text" size="small" v-model="oSetDlgData.macAddr"></el-input>
                </el-form-item>
                <el-form-item label="分配描述：" prop="description">
                    <el-input  type="textarea" :autosize="{ minRows: 3}" class="el_form_input" v-model="oSetDlgData.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowSetDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifySetAccess">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="会话控制-添加数据" :visible.sync="bShowAddDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oAddDlgData" ref="oAddDlgForm" :rules="oAddRules" :inline="true">
                <el-form-item label="授权用户：" prop="usrId">
                    <el-select v-model="oAddDlgData.usrId" 
                    remote clearable
                    filterable
                    @focus="tt"
                    :remote-method="usrList"
                    :loading="loading" 
                    placeholder="用户信息">
                        <el-option
                            v-for="(item,index) in cList"
                            :key="index"
                            :label = "item.label" 
                            :value = "item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="大网IP：" prop="wanIp">
                    <el-input type="text" size="small" v-model="oAddDlgData.wanIp"></el-input>
                </el-form-item>
                <el-form-item label="小网IP：" prop="lanIp">
                    <el-input type="text" size="small" v-model="oAddDlgData.lanIp"></el-input>
                </el-form-item>
                <el-form-item label="Mac地址：" prop="macAddr">
                    <el-input type="text" size="small" v-model="oAddDlgData.macAddr"></el-input>
                </el-form-item>
                <el-form-item label="分配描述：" prop="description">
                    <el-input  type="textarea" :autosize="{ minRows: 3}" class="el_form_input" v-model="oAddDlgData.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowAddDlg = false">取 消</el-button>
                <el-button type="primary" @click="AddAccess">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import API from '../api.js';
import utils from '@/lib/utils.js';
export default {
    data() {
        let validIp = (rule,value,callback)=>{
            let reg = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/
            if (!reg.test(value)) {
                callback(new Error('您输入的IP地址错误，请重新输入'))
            }else{
                callback()
            }
        };
        let validMac = (rule,value,callback)=>{
            let reg = /^[A-F0-9]{2}(-[A-F0-9]{2}){5}$|^[A-F0-9]{2}(:[A-F0-9]{2}){5}$/
            if (!reg.test(value)) {
                callback(new Error('您输入的Mac地址错误，请重新输入'))
            }else{
                callback()
            }
        }
        return {
            szFindValue:'',         //关键字
            aTableData: [],          //表格数据
            bTableLoading: false,    //表格数据是否在加载中
            oCurrRowData: {},        //当前行
            pageConfig: {           //分页数据
                pageNumber: 1,      //当前页
                pageSize: 10,       //每页数量
                totalPage: 0,       //总页数
                totalRow: 0         //总条数
            },
            bShowStatusDlg:false,
            oAccessDlgData:{        //状态修改
                status:'',
                usrId:'',
            },
            bShowAddDlg:false,//添加
            oAddDlgData:{
                usrId:'',
                wanIp:"",
                lanIp:"",
                macAddr:'',
                description:'',
            },
            loading: false,
            cList:[],
            oAddRules:{
                usrId:[{ required: true, message: '不能为空', trigger: 'blur' }],
                // wanIp:[
                //     { required:true,message:'请输入IP地址',trigger:'blur' },
                //     {validator:validIp,trigger:'blur'}
                // ],
                // lanIp:[
                //     { required:true,message:'请输入IP地址',trigger:'blur' },
                //     {validator:validIp,trigger:'blur'}
                // ],
                // macAddr:[
                //     { required:true,message:'请输入Mac地址',trigger:'blur' },
                //     {validator:validMac,trigger:'blur'}
                // ],
            },
            bShowSetDlg:false, //修改参数
            oSetDlgData:{
                usrId:'',
                wanIp:'',
                lanIp:"",
                macAddr:'',
                description:'',
            },
            oSetRules:{        //验证规则
                wanIp:[{ required: true, message: '不能为空', trigger: 'blur' }],
                lanIp:[{ required: true, message: '不能为空', trigger: 'blur' }],
                macAddr:[{ required: true, message: '不能为空', trigger: 'blur' }],
                description:[{ required: true, message: '不能为空', trigger: 'blur' }],
            },
            
            
        }
    },
    methods:{
        // -------------添加----------
        showAddDlg(){
            this.bShowAddDlg = true;
            this.$refs.oAddDlgForm ? this.$refs.oAddDlgForm.resetFields() : '';
        },
        usrList(queryString) {
            if (queryString != '') {
                setTimeout(() => {
                    this.loading = false;
                    var data = {
                        findkey:queryString
                    };
                    API.usrListSelect(data).then(res => {
                        var arr = [];
                        for (var i in res.data.data) {
                            arr.push(res.data.data[i]); 
                        };
                        this.cList = arr.map(item => {
                            return { value:item.usrId, label: item.usrAlias};
                        });
                    })
                }, 300);
            }
        },
        tt () {
            var states = [];
            var data = { };
            API.usrListSelect(data).then(res => {
                for (var i in res.data.data) {
                    states.push(res.data.data[i]); 
                };
                this.cList = states.map(item => {
                    return {value:item.usrId, label: item.usrAlias};
                });
            })
        },
        AddAccess(){
            this.$refs.oAddDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    usrId:this.oAddDlgData.usrId,
                    wanIp:this.oAddDlgData.wanIp,
                    lanIp:this.oAddDlgData.lanIp,
                    macAddr:this.oAddDlgData.macAddr,
                    description:this.oCurrRowData.description,
                }
                API.addAccessControll(data).then(res => {
                    if (res.data.code === 'OK') {
                        this.$notify({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.bShowAddDlg = false;
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
        // --------------修改---------
        modifyAccess(row){
            this.bShowSetDlg = true;
            this.oSetDlgData.usrId = row.usrId;
            this.oSetDlgData.wanIp = row.wanIp;
            this.oSetDlgData.lanIp = row.lanIp;
            this.oSetDlgData.description  =row.description;
            this.oSetDlgData.macAddr = row.macAddr;
        },
        modifySetAccess(){
            this.$refs.oSetDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    usrId:this.oSetDlgData.usrId,
                    wanIp:this.oSetDlgData.wanIp,
                    lanIp:this.oSetDlgData.lanIp,
                    macAddr:this.oSetDlgData.macAddr,
                    description:this.oSetDlgData.description
                }
                API.addAccessControll(data).then(res => {
                    if (res.data.code === 'OK') {
                    this.bShowSetDlg = false;
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
        // ---------------状态-------------
        modifyStatus(row){
            this.bShowStatusDlg = true;
            this.oAccessDlgData.status = row.status;
            this.oAccessDlgData.usrId = row.usrId;
        },
        modifyStatusAccess(){
            var data = {
                usrId:this.oAccessDlgData.usrId,
                status:this.oAccessDlgData.status,
            }
            API.modifyStatusItem(data).then(res => {
                if (res.data.code === 'OK') {
                    this.bShowStatusDlg = false;
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
        // -------------删除----------------
        deleteAccess(row){
            this.$confirm('确认删除： '+row.usrAlias , '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.deleteAct(row);
            }).catch(() => {
            });
        },
        deleteAct(row){
            var data = {
                usrId:row.usrId
            }
            API.deleteAccessItem(data).then(res => {
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
            this.szFindValue = '';
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
            };
            this.bTableLoading = true;
            API.accessControl(data).then(res => {
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
    .el_form_input {
        width: 240px;
    }
    .el-button.el-button--text.el-button--small{
        padding: 0px!important;
    }
</style>
