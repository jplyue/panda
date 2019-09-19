<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>交易管理</el-breadcrumb-item>
            <el-breadcrumb-item>账户管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row :gutter="10" class="marginT10">
                <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
                    <el-tab-pane label="账户列表" name="accountLists" > 
                        <account-list v-if="'accountLists' === szCurrTab"/>
                    </el-tab-pane>
                    <el-tab-pane label="账户连接" name="accountContact" > 
                        <account-contact v-if="'accountContact' === szCurrTab"/>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </div>
    </div>
</template>

<script>
import accountManageList from './accountManageList.vue';
import accountContact from './accountContact.vue';
export default {
    components:{
        'accountList':accountManageList,
        accountContact,
    },
    data() {
        return {
            szCurrTab: '',      //当前tab页
            tabName:{
                accountLists:'账户列表',
                accountContact:'账户连接'
            },
        }
    },
    methods:{
       changeTab(tab) {
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/account/page/' + tab.name)
        },
    },
    created() {
        document.title = '账户列表';
        this.szCurrTab = this.$route.params.tab;
    }
}
</script>


