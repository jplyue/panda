<template>
  <div class="heightP100">
    <el-breadcrumb separator="/" class="zy-div-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/main/homepage' }">
        <i class="fa fa-home"></i> 首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>日内配置</el-breadcrumb-item>
      <el-breadcrumb-item>用户券池</el-breadcrumb-item>
      <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="zy-div-container">
      <el-row class="marginT10">
        <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
          <el-tab-pane label="当前资源" name="tusrPool">
            <today v-if="'tusrPool' === szCurrTab"/>
          </el-tab-pane>
          <el-tab-pane label="历史资源" name="husrPool">
            <history v-if="'husrPool' === szCurrTab"/>
          </el-tab-pane>
          <el-tab-pane label="报单申请" name="applyList">
            <apply-list v-if="'applyList' === szCurrTab"/>
          </el-tab-pane>
        </el-tabs>
      </el-row>

      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
  import todayUsrPool from './todayUsrPool.vue';
  import historyUsrPool from './historyUsrPool.vue';
  import applyList from './applyList.vue';

  export default {
    components: {
      'today': todayUsrPool,
      'history': historyUsrPool,
      'applyList': applyList
    },
    data() {
      return {
        szCurrTab: '',      //当前tab页
        tabName: {
          tusrPool: '当前资源',
          husrPool: '历史资源',
          applyList: '报单申请'
        },
      }
    },
    methods: {
      changeTab(tab) {
        this.szCurrTab = tab.name;
        this.$router.push('/main/system/usrpool/page/' + tab.name)
      },
    },
    created() {
      document.title = '用户券池';
      this.szCurrTab = this.$route.params.tab;
    }
  }
</script>
