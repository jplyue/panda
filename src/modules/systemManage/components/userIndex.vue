<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item to="/main/system/user/page">安全管理</el-breadcrumb-item>
            <el-breadcrumb-item to="/main/system/user/page">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{oUserData.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-tabs type="card" class="marginT10" @tab-click="changeTab" :active-name="szCurrTab">
                <el-tab-pane name="basic" label="基本信息">
                    <user-info :member-id="memberId" :user-data="oUserData"></user-info>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import API from '../api.js'
import userInfo from './userInfo.vue'
export default {
    components: {
        userInfo,
    },
    data(){
        return {
            szCurrTab: '',      //当前tab页
            memberId: '',           //基金ID
            oUserData: {
               
            },
        }
    },
    methods: {
        changeTab(tab) {        //切换tab页时改变路由
            this.szCurrTab = tab.name;
            this.$router.push('/main/system/user/detail/' + tab.name + '/' + this.memberId);
        },
        getUserDetail() {
            var data = {
                usrId: this.memberId
            }
            API.getUserDetail(data).then((res) => {
                if (res.data.code == 'OK') {
                    this.oUserData = res.data.data;
                    document.title = this.oUserData.name;
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            })
        }
    },
    created() {
        this.szCurrTab = this.$route.params.tab;
        this.memberId = this.$route.params.id;
        this.getUserDetail();
    }
}
</script>
