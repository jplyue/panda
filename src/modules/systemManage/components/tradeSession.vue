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
                <span class="fontSize13">会话日期：</span>
                <el-date-picker value-format="yyyy-MM-dd" clearable class="width130" v-model="dateBegin" :editable="false" type="date" align="right" placeholder="开始日期" @change="dateChanged('dateBegin', $event)"  size="small">
                </el-date-picker>
            </div>
            <div :gutter="10" class="marginL10 floatL">
                <el-radio-group v-model="status" @change="getTableData" size="small" class="marginL20">
                    <el-radio-button :label="item.value" :key="item.value" v-for="item in oStatus">{{item.name}}</el-radio-button>
                </el-radio-group>
            </div>
            <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
            <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
        </el-row>
        <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow" class="label6-hover">
            
            <el-table-column fixed label="用户标识" align="center" width="120px" :resizable="false">
                <template slot-scope="scope">
                    <span class="title-head">{{scope.row.usrAlias === '' ? '--': scope.row.usrAlias}}</span>
                </template>
            </el-table-column>
            <el-table-column label="服务节点" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.serviceNodeName === '' ? '--': scope.row.serviceNodeName}}
                </template>
            </el-table-column>
            <el-table-column label="大网IP" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.wanIp === '' ? '--': scope.row.wanIp}}
                </template>
            </el-table-column>
            <el-table-column label="小网IP" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.lanIp === '' ? '--': scope.row.lanIp}}
                </template>
            </el-table-column>
            <el-table-column label="物理Mac" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.macAddr === '' ? '--': scope.row.macAddr}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" min-width="150px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.createTime === '' ? '--': scope.row.createTime|ellipsis(19)}}
                </template>
            </el-table-column>
            <el-table-column label="保活时间" align="center" min-width="150px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.pingTime === '' ? '--': scope.row.pingTime|ellipsis(19)}}
                </template>
            </el-table-column>
            <el-table-column label="结束时间" align="center" min-width="150px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.closeTime === '' ? '--': scope.row.closeTime|ellipsis(19)}}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="100px" :resizable="false">
                <template slot-scope="scope">
                    <div v-if="scope.row.status == 1" class="success">
                        {{scope.row.status === '' ? '--': '在线'}}
                    </div>
                    <div v-if="scope.row.status == 2" class="primy">
                        {{scope.row.status === '' ? '--': '退出'}}
                    </div>
                    <div v-if="scope.row.status == 4" class="wait">
                        {{scope.row.status === '' ? '--': '超时'}}
                    </div>
                    <div v-if="scope.row.status == 8" class="fail">
                        {{scope.row.status === '' ? '--': '踢出'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="会话消息" align="center" min-width="120px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.statusMessage === '' ? '--': scope.row.statusMessage}}
                </template>
            </el-table-column>
            <el-table-column label="会话ID" align="center" width="280px" :resizable="false">
                <template slot-scope="scope">
                    {{scope.row.tokenId === '' ? '--': scope.row.tokenId}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="120px" :resizable="false">
                <template slot-scope="scope">
                    <el-button size="small" type="text" :disabled="scope.row.status == 1 ? false : true" @click="kickOut(scope.row)">踢出</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
        </el-pagination>
    </div>
</template>

<script>
import API from '../api.js';
import utils from '@/lib/utils.js';
export default {
    data() {
        return {
            loading: false,
            usrId:'',                //用户id
            option1:[],              // 用户列表
            dateBegin:'',             //资源日期
            status:'0', //状态
            oStatus:[
                {name:'全部',value:'0'},
                {name:'在线',value:'1'},
                {name:'退出',value:'2'},
                {name:'超时',value:'4'},
                {name:'踢出',value:'8'},
            ],
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
    methods:{
        // 时间
        dateChanged(name, date) {           //日期改变时修改日期值
            if (date && date.indexOf(' - ') !== -1) {
                utils.setValByName(this, name, date.split(' - '));
            } else {
                utils.setValByName(this, name, date);
            }
            this.getTableData()
        },
        // 用户信息查询
        remoteMethods1(queryString) {
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
        // -------------踢出------------
        kickOut(row){
            this.$confirm('确认踢出用户： '+ row.usrAlias,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.kickOutAccount(row);
            }).catch(() =>{})
        },
        kickOutAccount(row){
            var data = {
                tokenId:row.tokenId
            };
            API.kickOutItem(data).then(res =>{
                if(res.data.code == 'OK'){
                    this.$notify({
                        message: '踢出成功',
                        type: 'success'
                    });
                this.getTableData();
                }
            }).catch(err => {
                console.log(err)
            })
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
            this.status = '0';
            this.usrId = '';
            this.dateBegin = '';
            this.getTableData();
        },
        getTableData(){
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                status:this.status,
                usrId:this.usrId,
                createDate:this.dateBegin,
            };
            this.bTableLoading = true;
            API.tradeSession(data).then(res => {
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

<style>

</style>
