import axios from 'axios';

export default {
  getRsa() {  //获取随机码
    return axios.get('/api/heart/saas/march/live/common/rsa');
  },
  doLogin(data) { //登录
    return axios.get('/api/heart/saas/march/live/login/pvd', {params: data});
  },
  getLoginProfile() { //获取登录用户信息
    return axios.get('/api/heart/saas/march/live/profile');
  },
  getSessionState(data) { //获取在线人数
    return axios.get('/api/heart/saas/march/security/session/page', {params: data});
  },
  doLogout() { //退出
    return axios.get('/api/heart/saas/march/live/logout');
  },
  getProductList(data) { //添加基金列表
    return axios.get('/api/ffund/product/list', {params: data});
  },
  addProduct(data) { //添加基金
    return axios.get('/api/ffund/product/user/add', {params: data});
  },
  updateAdminPwd(data) { //修改密码
    return axios.get('/api/heart/saas/march/live/me/update/logpwd', {params: data});
  },
  highLimit(data) { //涨停价/跌停价/现价
    return axios.get('/api/heart/saas/march/services/fints/stock/md/item', {params: data})
  },
  closeAccount(data) { //风控平仓
    return axios.get('/api/heart/saas/march/services/prsday/admin/close', {params: data})
  },
}
