<template>
    <div>
        <el-row :gutter="10" >
            <div class="floatL">
                <el-input v-model="szFindValue" placeholder="关键词" ref="keyword" class="width200" icon="search" @keyup.enter.native="getTableData" @click="getTableData()" size="small">
                </el-input>
            </div>
            <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
            <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
        </el-row>
        <el-row class="marginT10">
            <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow" class="label6-hover">
                <el-table-column label="账户标识" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        <span class="title-head">{{scope.row.alias === '' ? '--': scope.row.alias}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态码" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        <div v-if="scope.row.code == 0">
                            {{scope.row.code === '' ? '--': '未设置'}}
                        </div>
                        <div v-if="scope.row.code == 1">
                            {{scope.row.code === '' ? '--': '已连接'}}
                        </div>
                        <div v-if="scope.row.code == 2">
                            {{scope.row.code === '' ? '--': '待连接'}}
                        </div>
                        <div v-if="scope.row.code == 3">
                            {{scope.row.code === '' ? '--': '待登录'}}
                        </div>
                        <div v-if="scope.row.code == 4">
                            {{scope.row.code === '' ? '--': '连接中'}}
                        </div>
                        <div v-if="scope.row.code == 5">
                            {{scope.row.code === '' ? '--': '断开连接'}}
                        </div>
                        <div v-if="scope.row.code == 6">
                            {{scope.row.code === '' ? '--': '网关离线'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="连接描述" align="center" min-width="140px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.description === '' ? '--': scope.row.description}}
                    </template>
                </el-table-column>
                <el-table-column label="连接消息" align="center" min-width="240px" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.msg === '' ? '--': scope.row.msg}}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" min-width="140px" align="center" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.createTime === '' ? '--': scope.row.createTime|ellipsis(19)}}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" min-width="140px" align="center" :resizable="false">
                    <template slot-scope="scope">
                        {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
            </el-pagination>
        </el-row>
    </div>
</template>

<script>
import API from '../api.js'
import utils from '@/lib/utils.js'
export default {
    data() {
        return {
        szFindValue:'',   //关键字
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
        // ------------查询---------------
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
        getTableData() { //获取表格数据
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
            };
            this.bTableLoading = true;
            API.accountContact(data).then(res =>{
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
        this.getTableData()
    }
}
</script>

<style>

</style>
