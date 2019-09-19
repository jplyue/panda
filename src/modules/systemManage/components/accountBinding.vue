<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>日内配置</el-breadcrumb-item>
            <el-breadcrumb-item>账户授权</el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row class="marginT10">
                <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
                    <el-tab-pane label="股票账户" name="codeAccount" > 
                        <code-account v-if="'codeAccount' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="用户绑定" name="usrBind" > 
                        <usr-bind v-if="'usrBind' === szCurrTab"/>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </div>
    </div>
</template>
<script>
import codeAccount from './codeAccount.vue';
import usrBind from './usrBind.vue'
export default {
    components:{
        codeAccount,
        usrBind,
    },
    data() {
        return {
            szCurrTab: '',      //当前tab页
            tabName:{
                codeAccount:'股票账户',
                usrBind:'用户绑定',
            },
        }
    },
    methods:{
        changeTab(tab) {
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/bind/page/' + tab.name)
        },
    },
    created(){
        document.title = '账户授权';
        this.szCurrTab = this.$route.params.tab;
    },
}
</script>