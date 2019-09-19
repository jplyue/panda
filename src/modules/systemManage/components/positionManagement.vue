<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>交易管理</el-breadcrumb-item>
            <el-breadcrumb-item>持仓管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row class="marginT10">
                <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
                    <el-tab-pane label="当日持仓" name="todayPosition">
                        <today v-if="'todayPosition' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="历史持仓" name="historyPosition">
                        <history v-if="'historyPosition' === szCurrTab"/>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import todayPositionMangement from './todayPositionMangement.vue'
import historyPositionManagement from './historyPositionManagement.vue'
export default {
    components:{
        'today':todayPositionMangement,
        'history':historyPositionManagement
    },
    data() {
        return {
            szCurrTab: '',      //当前tab页
            tabName:{
                todayPosition:'当日持仓',
                historyPosition:'历史持仓',
            },
        }
    },
    methods:{
        changeTab(tab) {
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/position/page/' + tab.name)
        },
    },
    created(){
        document.title = '持仓管理';
        this.szCurrTab = this.$route.params.tab;
    }
}
</script>

