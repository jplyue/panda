<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>日内结算</el-breadcrumb-item>
            <el-breadcrumb-item>个股持仓</el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row class="marginT10">
                <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
                    <el-tab-pane label="当日持仓" name="tradeToday" > 
                        <today v-if="'tradeToday' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="历史持仓" name="tradeHistory" > 
                        <history v-if="'tradeHistory' === szCurrTab"/>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
import tradeToday from './tradeTodayPosition.vue';
import tradeHistory from './tradeHistoryPosition.vue'
export default {
    components:{
        'today':tradeToday,
        'history':tradeHistory
    },
    data() {
        return {
            szCurrTab: '',      //当前tab页
            tabName:{
                tradeToday:'当日持仓',
                tradeHistory:'历史持仓',
            },
        }
    },
    methods:{
        changeTab(tab) {
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/trade/position/page/' + tab.name)
        },
    },
    created(){
        document.title = '个股持仓';
        this.szCurrTab = this.$route.params.tab;
    },
}
</script>

