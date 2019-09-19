<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>日内配置</el-breadcrumb-item>
            <el-breadcrumb-item>用户授权</el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row :gutter="10" class="marginT10">
                <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
                    <el-tab-pane label="授权列表" name="grantList" > 
                        <grant-list v-if="'grantList' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="计费模板" name="chargeList" > 
                        <charge-list v-if="'chargeList' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="访问控制" name="accessControl" > 
                        <access-control v-if="'accessControl' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="交易会话" name="tradeSession" > 
                        <trade-session v-if="'tradeSession' === szCurrTab"/>
                    </el-tab-pane>
                    
                </el-tabs>
            </el-row>
        </div>
    </div>
</template>

<script>
import accountGrantList from './accountGrantList.vue';
import chargeList from './chargeList.vue';
import tradeSession from './tradeSession.vue';
import accessControl from './accessControl.vue';
export default {
    components:{
        'grantList':accountGrantList,
        'chargeList':chargeList,
        tradeSession,
        accessControl,
    },
    data() {
        return {
            szCurrTab: '',      //当前tab页
            tabName:{
                grantList:'授权列表',
                chargeList:'计费模板',
                tradeSession:"交易会话",
                accessControl:'访问控制',
            },
        }
    },
    methods:{
       changeTab(tab) {
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/accredit/page/' + tab.name)
        },
    },
    created(){
       document.title = '授权列表';
       this.szCurrTab = this.$route.params.tab;
    },
}
</script>

