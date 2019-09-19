<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>交易管理</el-breadcrumb-item>
            <el-breadcrumb-item>委托管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row class="marginT10">
                <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
                    <el-tab-pane label="当日委托" name="todayOrder">
                        <today v-if="'todayOrder' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="历史委托" name="historyOrder">
                        <history v-if="'historyOrder' === szCurrTab"/>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </div>
    </div>
</template>
<script>
import todayEntrust from './todayEntrust.vue';
import historyEntrust from './historyEntrust.vue';
export default {
    components:{
        'today':todayEntrust,
        'history':historyEntrust
    },
    data() {
        return {
            szCurrTab: '',      //当前tab页
            tabName:{
                todayOrder:'当日委托',
                historyOrder:'历史委托',
            },
        }
    },
     methods:{
        changeTab(tab) {
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/order/page/' + tab.name)
        },
     },
    created(){
        this.szCurrTab = this.$route.params.tab;
        document.title = '委托管理';
    }
}
</script>


