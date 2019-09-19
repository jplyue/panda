<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>交易管理</el-breadcrumb-item>
            <el-breadcrumb-item>成交管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row class="marginT10">
                <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
                    <el-tab-pane label="当日成交" name="todayDeal">
                        <today v-if="'todayDeal' === szCurrTab"/>                            
                    </el-tab-pane>
                    <el-tab-pane label="历史成交" name="historyDeal">
                        <history v-if="'historyDeal' === szCurrTab"/>                                                    
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import todayTransaction from './todayTransaction.vue'
import historyTransaction from './historyTransaction.vue'
export default {
    components:{
        'today':todayTransaction,
        'history':historyTransaction
    },
    data() {
        return {
            szCurrTab: '',      //当前tab页
            tabName:{
                todayDeal:'当日成交',
                historyDeal:'历史成交',
            },
        }
    },
    methods:{
        changeTab(tab) {
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/deal/page/' + tab.name)
        },
    },
    created(){
        document.title = '成交管理';
        this.szCurrTab = this.$route.params.tab;
    }
}
</script>


