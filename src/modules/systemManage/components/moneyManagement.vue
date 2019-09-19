<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>交易管理</el-breadcrumb-item>
            <el-breadcrumb-item>资金管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row :gutter="10" class="marginT10">
                <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
                    <el-tab-pane label="当前资金" name="todayMoneyManage" > 
                        <today-money v-if="'todayMoneyManage' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="历史资金" name="historyMoneyManage" > 
                        <history-money v-if="'historyMoneyManage' === szCurrTab"/>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </div>
    </div>
</template>

<script>
import todayMoneyManage from './todayMoneyManage.vue';
import historyMoneyManage from './historyMoneyManage.vue';
export default {
    components:{
        'todayMoney': todayMoneyManage,
        'historyMoney': historyMoneyManage
    },
    data() {
        return {
            szCurrTab: '',      //当前tab页
            tabName:{
                todayMoneyManage:'当前资金',
                historyMoneyManage:'历史资金'
            },
        }
    },
    methods:{
       changeTab(tab) {
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/money/page/' + tab.name)
        },
    },
    created() {
        document.title = '资金管理';
        this.szCurrTab = this.$route.params.tab;
    }
}
</script>

<style>

</style>
