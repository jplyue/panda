<template>
  <div class="heightP100">
    <el-breadcrumb separator="/" class="zy-div-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/main/homepage' }">
        <i class="fa fa-home"></i> 首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>日内收益</el-breadcrumb-item>
      <el-breadcrumb-item>账户收益</el-breadcrumb-item>
      <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="zy-div-container">
      <el-row class="marginT10">
        <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
          <el-tab-pane label="当日收益" name="accountStatisticsDay">
            <today v-if="'accountStatisticsDay' === szCurrTab"/>
          </el-tab-pane>
          <el-tab-pane label="历史收益" name="accountStatisticsHis">
            <history v-if="'accountStatisticsHis' === szCurrTab"/>
          </el-tab-pane>
          <!--
          <el-tab-pane label="区间对账" name="accountStatisticsArea">
            <history v-if="'accountStatisticsArea' === szCurrTab"/>
          </el-tab-pane>-->
        </el-tabs>
      </el-row>
      <div class="clear"></div>
    </div>
  </div>
</template>
<script>
  import accountStatisticsDay from './accountStatisticsDay.vue'
  import accountStatisticsHis from './accountStatisticsHis.vue'

  export default {
    components: {
      'today': accountStatisticsDay,
      'history': accountStatisticsHis,
    },
    data() {
      return {
        szCurrTab: '',      //当前tab页
        tabName: {
          accountStatisticsDay: '当日收益',
          accountStatisticsHis: '历史收益',
        },
      }
    },
    methods: {
      changeTab(tab) {
        this.szCurrTab = tab.name;
        this.$router.push('/main/system/statistics/account/' + tab.name)
      },
    },
    created() {
      document.title = '账户收益';
      this.szCurrTab = this.$route.params.tab;
    },
  }
</script>

