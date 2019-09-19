import axios from 'axios';

export default {
  //----------------数据字典--------------------------//
  getDict(data) {
    return axios.get('/api/heart/saas/march/daemon/dict/master/uses', {params: data});
  },
  //------------------用户管理-------------------------------//
  getUserList(data) { //获取用户列表
    return axios.get('/api/heart/saas/march/security/usr/page', {params: data});
  },
  addUser(data) { //创建用户
    return axios.get('/api/heart/saas/march/security/usr/create/real', {params: data});
  },
  updateUser(data) { //修改用户
    return axios.get('/api/heart/saas/march/security/usr/update/real', {params: data});
  },
  deleteUserSe(data) {  //删除用户
    return axios.get('/api/heart/saas/march/security/usr/delete', {params: data});
  },
  modifyUserPwd(data) { //重置密码
    return axios.get('/api/heart/saas/march/security/usr/update/logpwd', {params: data});
  },
  modifyUserName(data) { //修改用户名
    return axios.get('/api/heart/saas/march/security/usr/update/name', {params: data});
  },
  modifyUserMobile(data) { //修改手机号
    return axios.get('/api/heart/saas/march/security/usr/update/mobile', {params: data});
  },
  modifyUserEmail(data) { //修改邮箱
    return axios.get('/api/heart/saas/march/security/usr/update/email', {params: data});
  },
  modifyUsernickName(data) {  //修改昵称
    return axios.get('/api/heart/saas/march/security/usr/update/nick', {params: data});
  },
  modifyUserStatus(data) {  //修改状态
    return axios.get('/api/heart/saas/march/security/usr/status', {params: data});
  },
  getUserDetail(data) {   //获取单条详情信息
    return axios.get('/api/heart/saas/march/security/usr/item', {params: data});
  },
  contactSection(data) {  //关联部门
    return axios.get('/api/heart/saas/march/security/usr/join/depart', {params: data});
  },
  uploadImage(data) { //上传图片
    return axios.post('/staticapi/up/do', data);
  },
  UserManageImg(data) { //上传图片
    return axios.get('/api/heart/saas/march/security/usr/update/hdimg', {params: data});
  },
  getPostList(data) {  //获取岗位列表
    return axios.get('/api/heart/saas/march/security/post/list', {params: data});
  },
  addPostCode(data) { //添加岗位
    return axios.get('/api/heart/saas/march/security/usr/join/post', {params: data});
  },
  getRoleList(data) { //获取角色列表
    return axios.get('/api/heart/saas/march/security/role/list', {params: data});
  },
  addRoleCode(data) { //增加角色列表
    return axios.get('/api/heart/saas/march/security/usr/join/role', {params: data});
  },
  updateUserItem(data) { //修改详情信息
    return axios.get('/api/heart/saas/march/security/usr/update/whole', {params: data});
  },

  //------------部门管理-----------------------------------//
  addDepart(data) {  //添加部门
    return axios.get('/api/heart/saas/march/security/depart/create', {params: data});
  },
  deleteDepart(data) {  //更新部门
    return axios.get('/api/heart/saas/march/security/depart/delete', {params: data});
  },
  getAllDepart(data) {  //获取所有部门
    return axios.get('/api/heart/saas/march/security/depart/list', {params: data});
  },
  //--------------------账户管理------------------------------------
  accountManagement(data) { //查询账户
    return axios.get('/api/heart/saas/march/services/fints/account/page', {params: data});
  },
  accountUpdate(data) { //账户管理-交易账户-修改
    return axios.get('/api/heart/saas/march/services/fints/account/update', {params: data})
  },
  getChargeData(data) { //查询历史计费参数
    return axios.get('/api/heart/saas/march/services/fints/account/item/charger', {params: data})
  },
  updateChargeData(data) {//修改计费参数
    return axios.get('/api/heart/saas/march/services/fints/account/update/charger', {params: data})
  },
  getMarginData(data) { //查询历史融资融券默认值
    return axios.get('/api/heart/saas/march/services/fints/account/item/marginer', {params: data})
  },
  updateMarginData(data) { //修改融资融券
    return axios.get('/api/heart/saas/march/services/fints/account/update/marginer', {params: data})
  },
  deleteAccount(data) { //删除账户
    return axios.get('/api/heart/saas/march/services/fints/account/delete', {params: data})
  },
  addAccount(data) { //添加账户
    return axios.get('/api/heart/saas/march/services/fints/account/update/create', {params: data})
  },
  //-----------------持仓管理------------------------------------------
  todayPosition(data) { //当日持仓
    return axios.get('/api/heart/saas/march/services/fints/stock/trade/position/page', {params: data})
  },
  historyPosition(data) { //历史持仓
    return axios.get('/api/heart/saas/march/services/fints/stock/trade/day/position/page', {params: data})
  },
  stockCodeSelect(data) { //股票-下拉列表 模糊查询
    return axios.get('/api/heart/saas/march/services/fints/stock/select', {params: data})
  },
  //-------------------委托管理---------------------------------------------
  todayEntrust(data) { //当日委托
    return axios.get('/api/heart/saas/march/services/fints/stock/trade/order/page', {params: data})
  },
  historyEntrust(data) { //历史委托
    return axios.get('/api/heart/saas/march/services/fints/stock/trade/day/order/page', {params: data})
  },
  //-----------------------成交管理-----------------------------------
  todayTransaction(data) { //当日成交
    return axios.get('/api/heart/saas/march/services/fints/stock/trade/deal/page', {params: data})
  },
  historyTransaction(data) { //历史成交
    return axios.get('/api/heart/saas/march/services/fints/stock/trade/day/deal/page', {params: data})
  },
  //---------------------日内资源-------------------------------------
  accountAccredit(data) { // 用户授权-查询-分页
    return axios.get('/api/heart/saas/march/services/prsday/alloc/page', {params: data})
  },
  accountCreate(data) { // 用户授权-创建
    return axios.get('/api/heart/saas/march/services/prsday/alloc/create', {params: data})
  },
  accountCreateSearch(data) { // 用户授权-创建-远程搜索
    return axios.get('/api/heart/saas/march/security/usr/select', {params: data})
  },
  deleteUser(data) { //用户授权-删除用户
    return axios.get('/api/heart/saas/march/services/prsday/alloc/delete', {params: data})
  },
  updateUserStatus(data) { //用户授权-修改状态
    return axios.get('/api/heart/saas/march/services/prsday/alloc/update/status', {params: data})
  },
  resetPassword(data) {// 用户授权-更新-交易密码
    return axios.get('/api/heart/saas/march/services/prsday/alloc/update/tdpwd', {params: data})
  },
  updateAcnt(data) { //用户授权-修改用户
    return axios.get('/api/heart/saas/march/services/prsday/alloc/update', {params: data})
  },
  modifyFeature(data) { //用户授权-修改能力
    return axios.get('/api/heart/saas/march/services/prsday/alloc/update/feature', {params: data})
  },
  chargeSelect(data) { //计费模板查询
    return axios.get('/api/heart/saas/march/services/prsday/feat/fee/page', {params: data})
  },
  updateCharge(data) { //计费模板修改
    return axios.get('/api/heart/saas/march/services/prsday/feat/fee/upsert', {params: data})
  },
  deleteChargeList(data) { //计费模板删除
    return axios.get('/api/heart/saas/march/services/prsday/feat/fee/delete', {params: data})
  },
  chargeListSelect(data) { //用户授权-授权列表-计费-选择器
    return axios.get('/api/heart/saas/march/services/prsday/feat/fee/list', {params: data})
  },
  modifyChargeItem(data) { //用户授权-授权列表-设置计费
    return axios.get('/api/heart/saas/march/services/prsday/alloc/update/fee', {params: data})
  },
  // ---------------账户授权-------------------------------
  codeAccount(data) { //账户授权-股票账户-查询
    return axios.get('/api/heart/saas/march/services/prsday/hang/account/page', {params: data})
  },
  containFeeItem(data) { //账户授权-股票账户-计费参数修改-单项查询
    return axios.get('/api/heart/saas/march/services/prsday/hang/account/item/fee', {params: data})
  },
  updateContainFee(data) { //账户授权-股票账户-计费参数修改
    return axios.get('/api/heart/saas/march/services/prsday/hang/account/update/fee', {params: data})
  },
  containMarginItem(data) { //账户授权-股票账户-融券参数修改-单项查询
    return axios.get('/api/heart/saas/march/services/prsday/hang/account/item/margin', {params: data})
  },
  updateContainMargin(data) { //账户授权-股票账户-融券参数修改
    return axios.get('/api/heart/saas/march/services/prsday/hang/account/update/margin', {params: data})
  },
  codeAccountCreat(data) { //账户授权-股票账户-创建
    return axios.get('/api/heart/saas/march/services/prsday/hang/account/create', {params: data})
  },
  modifyAccountStatus(data) { //账户授权-股票账户-状态
    return axios.get('/api/heart/saas/march/services/prsday/hang/account/status', {params: data})
  },
  updateCanAsk(data) { //账户授权-股票账户-修改
    return axios.get('/api/heart/saas/march/services/prsday/hang/account/update', {params: data})
  },
  deleteCodeccount(data) { //账户授权-股票账户-删除
    return axios.get('/api/heart/saas/march/services/prsday/hang/account/delete', {params: data})
  },
  accountBinding(data) { //日内资源-账户绑定-用户绑定-查询
    return axios.get('/api/heart/saas/march/services/prsday/feat/account/page', {params: data})
  },
  userSelect(data) { //用户授权-查询-列表-选择器
    return axios.get('/api/heart/saas/march/services/prsday/alloc/select', {params: data})
  },
  accountSelect(data) { //账户-查询-列表-选择器
    return axios.get('/api/heart/saas/march/services/fints/account/select', {params: data})
  },
  accountBindingCreate(data) { //账户授权-用户绑定-创建
    return axios.get('/api/heart/saas/march/services/prsday/feat/account/create', {params: data})
  },
  updateBindStatus(data) { //账户授权-用户绑定-状态修改
    return axios.get('/api/heart/saas/march/services/prsday/feat/account/status', {params: data})
  },
  usrContainFee(data) { //账户授权-用户绑定-定制计费
    return axios.get('/api/heart/saas/march/services/prsday/feat/account/update/fee', {params: data})
  },
  updateBindCanAsk(data) { //账户授权-用户绑定-修改数据
    return axios.get('/api/heart/saas/march/services/prsday/feat/account/update', {params: data})
  },
  deleteBindingAccount(data) {  //账户授权-用户绑定-删除
    return axios.get('/api/heart/saas/march/services/prsday/feat/account/delete', {params: data})
  },
  importInfo(data) { //日内券池--导入解析
    return axios.get('/api/heart/saas/march/services/prsday/secres/excel/analysis', {params: data})
  },
  accountContact(data) {//交易管理-账号管理-账户连接
    return axios.get('/api/heart/saas/march/services/fints/account/connect/page', {params: data})
  },
  todayMoneyManage(data) { //交易管理--当日资金管理
    return axios.get('/api/heart/saas/march/services/fints/stock/trade/fund/page', {params: data})
  },
  historyMoneyManage(data) { //交易管理--历史资金管理
    return axios.get('/api/heart/saas/march/services/fints/stock/trade/day/fund/page', {params: data})
  },
  publicPool(data) { //日内资源-当日公共券池-查询
    return axios.get('/api/heart/saas/march/services/prsday/secres/page', {params: data})
  },
  modifyDataPool(data) { //日内资源-当日公共券池-修改数据
    return axios.get('/api/heart/saas/march/services/prsday/secres/upsert', {params: data})
  },
  poolStatus(data) { //日内资源-当日公共券池-修改状态
    return axios.get('/api/heart/saas/march/services/prsday/secres/status', {params: data})
  },
  allotVolumn(data) { //日内资源-当日公共券池-股票分配
    return axios.get('/api/heart/saas/march/services/prsday/alloc/secres/ask', {params: data})
  },
  makeInherit(data) { //日内资源-当日公共券池-继承
    return axios.get('/api/heart/saas/march/services/prsday/alloc/secres/upsert/yestday', {params: data})
  },
  historyPool(data) { //日内资源-历史公共券池
    return axios.get('/api/heart/saas/march/services/prsday/secres/day/page', {params: data})
  },
  todaySecres(data) {//日内资源-资源分配
    return axios.get('/api/heart/saas/march/services/prsday/alloc/secres/ask/page', {params: data})
  },
  userPool(data) { //日内资源-当日用户券池-查询
    return axios.get('/api/heart/saas/march/services/prsday/alloc/secres/page', {params: data})
  },
  historyUserPool(data) { //日内资源-历史用户券池
    return axios.get('/api/heart/saas/march/services/prsday/alloc/day/secres/page', {params: data})
  },
  userPoolStatus(data) { // 日内资源-当日用户券池-状态
    return axios.get('/api/heart/saas/march/services/prsday/alloc/secres/status', {params: data})
  },
  userAllot(data) {//日内资源-当日用户券池-分配
    return axios.get('/api/heart/saas/march/services/prsday/alloc/secres/ask', {params: data})
  },
  todayPoolItem(data) { //日内资源 - 当日用户-分配-查询公共券池的数据
    return axios.get('/api/heart/saas/march/services/prsday/secres/item', {params: data})
  },
  applyList(data) { //日内资源- 报单申请
    return axios.get('/api/heart/saas/march/services/prsday/alloc/secres/apply/page', {params: data})
  },
  tradeSession(data) { //日内资源- 交易会话
    return axios.get('/api/heart/saas/march/services/prsday/alloc/session/page', {params: data})
  },
  kickOutItem(data) { //日内资源-交易回话-踢出
    return axios.get('/api/heart/saas/march/services/prsday/alloc/session/kick', {params: data})
  },
  accessControl(data) { //日内资源--访问控制
    return axios.get('/api/heart/saas/march/services/prsday/alloc/acl/page', {params: data})
  },
  addAccessControll(data) { //日内资源-访问控制-添加/修改
    return axios.get('/api/heart/saas/march/services/prsday/alloc/acl/upsert', {params: data})
  },
  usrListSelect(data) { //日内资源 -访问控制-用户授权列表选择器
    return axios.get('/api/heart/saas/march/services/prsday/alloc/select', {params: data})
  },
  modifyStatusItem(data) { //日内资源--状态修改
    return axios.get('/api/heart/saas/march/services/prsday/alloc/acl/status', {params: data})
  },
  deleteAccessItem(data) { //日内资源--访问控制-删除
    return axios.get('/api/heart/saas/march/services/prsday/alloc/acl/delete', {params: data})
  },
  // --------------日内交易----------------------
  tradeToday(data) { //日内交易--当日持仓交易
    return axios.get('/api/heart/saas/march/services/prsday/trade/position/page', {params: data})
  },
  tradeHistory(data) { //日内交易--历史持仓交易
    return axios.get('/api/heart/saas/march/services/prsday/trade/day/position/page', {params: data})
  },
  usedSettle(data) { //日内交易--当日结算
    return axios.get('/api/heart/saas/march/services/prsday/trade/used/page', {params: data});
  },
  usedHistorySettle(data) { //日内交易--历史结算
    return axios.get('/api/heart/saas/march/services/prsday/trade/day/used/page', {params: data})
  },
  accountStatisticsDay(data) { //日内交易--当日结算
    return axios.get('/api/heart/saas/march/statistics/account/day', {params: data});
  },

  accountStatisticsHis(data) { //日内交易--当日结算
    return axios.get('/api/heart/saas/march/statistics/account/his', {params: data});
  },

  traderStatisticsDay(data) { //日内交易--当日结算
    return axios.get('/api/heart/saas/march/statistics/trader/day', {params: data});
  },

  traderStatisticsHis(data) { //日内交易--当日结算
    return axios.get('/api/heart/saas/march/statistics/trader/his', {params: data});
  },

  traderAccountStatisticsDay(data) { //日内交易--当日结算
    return axios.get('/api/heart/saas/march/statistics/traderAccount/day', {params: data});
  },

  traderAccountStatisticsHis(data) { //日内交易--当日结算
    return axios.get('/api/heart/saas/march/statistics/traderAccount/his', {params: data});
  },

  queryStockPool() {
    return axios.get('/api/heart/saas/march/services/prsday/secres/queryStockPool');
  },

  allocStockBatch(data) {
    //return axios.post('/api/heart/saas/march/services/prsday/secres/allocStockBatch', data, {headers: {'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'}});
    return axios.post('/api/heart/saas/march/services/prsday/secres/allocStockBatch', data);
  },

  deleteBatchAlloc() {
    return axios.get('/api/heart/saas/march/services/prsday/secres/deleteBatchAlloc');
  },

  revertBatch() {
    return axios.post('/api/heart/saas/march/services/prsday/secres/revertBatch', data);
  },

  makeControlEntry(data){ //风控报单
    return axios.get('/api/heart/saas/march/services/prsday/admin/create', { params: data })
  },

  cancelAccountItem(data){ //日内资源-报单申请-撤单
    return axios.get('/api/heart/saas/march/services/prsday/admin/cancel', { params: data })
  },
}
