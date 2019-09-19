<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>日内配置</el-breadcrumb-item>
            <el-breadcrumb-item>公共券池</el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row class="marginT10">
                <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
                    <el-tab-pane label="当前资源" name="todayPool" > 
                        <today v-if="'todayPool' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="历史资源" name="historyPool" > 
                        <history v-if="'historyPool' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="资源分配" name="todaySecres" > 
                        <today-secres v-if="'todaySecres' === szCurrTab"/>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
import todayPool from './todayPool.vue';
import historyPool from './historyPool.vue'
import todaySecres from './todaySecres.vue'
export default {
    components:{
        'today':todayPool,
        'history':historyPool,
        todaySecres,
    },
    data() {
        return {
            szCurrTab: '',      //当前tab页
            tabName:{
                todayPool:'当前资源',
                historyPool:'历史资源',
                todaySecres:'资源分配'
            },
        }
    },
    methods:{
        changeTab(tab) {
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/pool/page/' + tab.name)
        },
    },
    created(){
        document.title = '公共券池';
        this.szCurrTab = this.$route.params.tab;
    },
}
</script>

