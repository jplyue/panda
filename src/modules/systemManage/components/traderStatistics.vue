<template>
  <div class="heightP100">
    <el-breadcrumb separator="/" class="zy-div-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/main/homepage' }">
        <i class="fa fa-home"></i> 首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>日内收益</el-breadcrumb-item>
      <el-breadcrumb-item>用户收益</el-breadcrumb-item>
      <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="zy-div-container">
      <el-row class="marginT10">
        <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
          <el-tab-pane label="当日收益" name="traderStatisticsDay">
            <today v-if="'traderStatisticsDay' === szCurrTab"/>
          </el-tab-pane>
          <el-tab-pane label="历史收益" name="traderStatisticsHis">
            <history v-if="'traderStatisticsHis' === szCurrTab"/>
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
  import traderStatisticsDay from './traderStatisticsDay.vue'
  import traderStatisticsHis from './traderStatisticsHis.vue'

  export default {
    components: {
      'today': traderStatisticsDay,
      'history': traderStatisticsHis,
    },
    data() {
      return {
        szCurrTab: '',      //当前tab页
        tabName: {
          traderStatisticsDay: '当日收益',
          traderStatisticsHis: '历史收益',
        },
      }
    },
    methods: {
      changeTab(tab) {
        this.szCurrTab = tab.name;
        this.$router.push('/main/system/statistics/trader/' + tab.name)
      },
    },
    created() {
      document.title = '账户收益';
      this.szCurrTab = this.$route.params.tab;
    },
  }
</script>

