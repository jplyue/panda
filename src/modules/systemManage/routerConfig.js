export default [
  {
    path: '/main',
    component: r => require.ensure([], () => r(require('@/main.vue')), 'main'),
    children: [
      {
        path: 'system/user/detail/:tab/:id',
        component: r => require.ensure([], () => r(require('./components/userIndex.vue')), 'systemManage')
      },
      {  //用户管理
        path: 'system/user/page',
        component: r => require.ensure([], () => r(require('./components/userManage.vue')), 'systemManage')
      },
      // ---------------交易管理--------------
      { //账户管理
        path: 'system/account/page/:tab',
        component: r => require.ensure([], () => r(require('./components/accountManagement.vue')), 'systemManage')
      },
      { //资金管理
        path: 'system/money/page/:tab',
        component: r => require.ensure([], () => r(require('./components/moneyManagement.vue')), 'systemManage')
      },
      {  //持仓管理
        path: 'system/position/page/:tab',
        component: r => require.ensure([], () => r(require('./components/positionManagement.vue')), 'systemManage')
      },
      {  //委托管理
        path: 'system/order/page/:tab',
        component: r => require.ensure([], () => r(require('./components/entrustManagement.vue')), 'systemManage')
      },
      { //成交管理
        path: 'system/deal/page/:tab',
        component: r => require.ensure([], () => r(require('./components/transactionManagement.vue')), 'systemManage')
      },
      //----------------日内资源--------------------------
      { //用户授权
        path: 'system/accredit/page/:tab',
        component: r => require.ensure([], () => r(require('./components/accountAccredit.vue')), 'systemManage')
      },
      { //账户授权
        path: 'system/bind/page/:tab',
        component: r => require.ensure([], () => r(require('./components/accountBinding.vue')), 'systemManage')
      },
      { //公共券池
        path: 'system/pool/page/:tab',
        component: r => require.ensure([], () => r(require('./components/publicPool.vue')), 'systemManage'),
      },
      { //用户券池
        path: 'system/usrpool/page/:tab',
        component: r => require.ensure([], () => r(require('./components/userPool.vue')), 'systemManage')
      },
      // --------------日内结算--------------------------
      { //个股持仓
        path: 'system/trade/position/page/:tab',
        component: r => require.ensure([], () => r(require('./components/tradePosition.vue')), 'systemManage')
      },
      { //用户结算
        path: 'system/trade/used/page/:tab',
        component: r => require.ensure([], () => r(require('./components/tradeSettle.vue')), 'systemManage')
      },
      { //账户收益
        path: 'system/statistics/account/:tab',
        component: r => require.ensure([], () => r(require('./components/accountStatistics.vue')), 'systemManage')
      },
      { //用户收益
        path: 'system/statistics/trader/:tab',
        component: r => require.ensure([], () => r(require('./components/traderStatistics.vue')), 'systemManage')
      },
      { //结算收益
        path: 'system/statistics/traderAccount/:tab',
        component: r => require.ensure([], () => r(require('./components/traderAccountStatistics.vue')), 'systemManage')
      },
    ]
  }
];

