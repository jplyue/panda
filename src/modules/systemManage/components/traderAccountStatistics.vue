<template>
  <div class="heightP100">
    <el-breadcrumb separator="/" class="zy-div-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/main/homepage' }">
        <i class="fa fa-home"></i> 首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>日内收益</el-breadcrumb-item>
      <el-breadcrumb-item>结算收益</el-breadcrumb-item>
      <el-breadcrumb-item>{{tabName[szCurrTab]}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="zy-div-container">
      <el-row class="marginT10">
        <el-tabs type="border-card" :active-name="szCurrTab" @tab-click="changeTab">
          <el-tab-pane label="当日收益" name="traderAccountStatisticsDay">
            <today v-if="'traderAccountStatisticsDay' === szCurrTab"/>
          </el-tab-pane>
          <el-tab-pane label="历史收益" name="traderAccountStatisticsHis">
            <history v-if="'traderAccountStatisticsHis' === szCurrTab"/>
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
  import traderAccountStatisticsDay from './traderAccountStatisticsDay.vue'
  import traderAccountStatisticsHis from './traderAccountStatisticsHis.vue'

  export default {
    components: {
      'today': traderAccountStatisticsDay,
      'history': traderAccountStatisticsHis,
    },
    data() {
      return {
        szCurrTab: '',      //当前tab页
        tabName: {
          traderAccountStatisticsDay: '当日收益',
          traderAccountStatisticsHis: '历史收益',
        },
      }
    },
    methods: {
      changeTab(tab) {
        this.szCurrTab = tab.name;
        this.$router.push('/main/system/statistics/traderAccount/' + tab.name)
      },
    },
    created() {
      document.title = '结算收益';
      this.szCurrTab = this.$route.params.tab;
    },
  }
</script>

