<template>
  <div class="heightP100 main-container">
    <div class="header">
      <div class="head-left">
        <button class="btn-expand" @click="expandMenu($event)">
          <i class="fa fa-bars"></i>
        </button>
        <img src="/static/themes/theme1/image/icon.png" alt="" width="25" height="25" class="relativeTop5"/>&nbsp;
        业务配置平台
      </div>
      <div class="floatR">
        <a class="admnBg relativeTop10" href="javascript:void(0)">
          <i class="fa fa-bell"></i>
          <span class="prompt">0</span>
        </a>
        <april-dropdown>
          <button type="button" class="btn admnBg" datas-toggle="dropdown">
            <i class="fa fa-user fa-fw"></i> 你好，{{userName}}
            <span class="caretBom"></span>
          </button>
          <ul class="dropdown-menu">
            <li class=" bor-top">
              <router-link to="/main/homepage" class="paddingL0 down-li" tag="div">
                <i class="fa fa-home"></i> 团队主页
              </router-link>
            </li>
            <li class=" bor-top">
              <div @click="showModifyDlg" class="down-li">
                <i class="fa fa-pencil-square-o"></i> 修改密码
              </div>
            </li>
            <li @click="logout" class=" bor-top ">
              <div class="down-li">
                <i class="fa fa-sign-out"></i> 退出
              </div>
            </li>
          </ul>
        </april-dropdown>
      </div>
    </div>
    <div class="content">
      <div class="content-left" @mouseout="outMenu($event)">
        <el-menu :default-active="defaultActiveMenu" class="heightP100 zy-menu" background-color="#324157"
                 text-color="#bfcbd9"
                 active-text-color="#20a0ff"
                 theme="dark"
                 @select="selectMenu"
                 @open="openMenu"
                 @close="closeMenu"
                 :default-openeds="defaultOpenMenu"
        >
          <el-menu-item index="-1" class="homePage">
            <router-link to="/main/homepage" tag="div">
              <div class="div-menu-li ">
                <i class="fa fa-home fontSzie18"></i>
                <span class="collapse-menu-text">&nbsp;首页</span>
              </div>
            </router-link>
          </el-menu-item>
          <el-submenu v-for="(data, $index) in aMenu" :index="$index+''" :key="$index">
            <!-- v-if="!data.uri || oUserRight[data.uri]" -->
            <template slot="title">
              <router-link :to="data.router" tag="div">
                <div @mouseenter="enterMenu(data, $event)" class="div-menu-li">
                  <i :class="data.icon"></i>
                  <span class="collapse-menu-text">&nbsp;{{data.name}}</span>
                </div>
              </router-link>
            </template>
            <el-menu-item v-for="(item, index) in data.children" :index="''+$index+index" :key="''+$index+index">
              <router-link :to="item.router" tag="div" class="router-submenu">
                <i :class="item.icon"></i>
                <span class="collapse-submenu-text">&nbsp;{{item.name}}</span>
              </router-link>
            </el-menu-item>
          </el-submenu>
          <div class="marginT60">&nbsp;</div>
        </el-menu>
      </div>
      <div class="content-main">
        <div class="div-router">
          <transition name="move" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
    <div class="footer">
      <span class="marginL10 floatL"> {{year1}}年{{month1}}月{{date1}}日 {{time}} {{day1}}</span>
      <span class="center">Copyright &copy; 2016.Company saas 【版本号】saas</span>
      <span class="marginR10 floatR">在线人数：{{peoplenum}}</span>
    </div>
    <el-dialog title="修改密码" :visible.sync="bShowModifyDlg" size="tiny" :modal="true" custom-class="width450"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="oModifyDlgData" :rules="oModifyDlgRules" ref="modifyDlgForm" label-width="120px">
        <el-form-item label="旧密码：" prop="oldPwd">
          <el-input type="password" v-model="oModifyDlgData.oldPwd" class="width240"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPwd">
          <el-input type="password" v-model="oModifyDlgData.newPwd" class="width240"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPwd" class="marginB0">
          <el-input type="password" v-model="oModifyDlgData.checkPwd" class="width240"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="bShowModifyDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyPwd">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<style lang='scss' scoped>

</style>
<script>
  import API from './api.js'
  import validate from '@/lib/validate.js'
  import AprilDropdown from '@/components/Dropdown.vue'

  export default {
    components: {
      AprilDropdown,
    },
    data() {
      return {
        bCollapseMenu: false,       //是否折叠菜单
        bShowThemes: false,         //显示所有主题
        szCurrTheme: 'theme1',      //默认主题
        oCurrMenu: '',           	//折叠模式下当前展开的菜单
        bShowModifyDlg: false,      //显示密码对话框                                                     //修改密码弹窗
        oModifyDlgData: {           //密码对话框数据
          oldPwd: '',
          newPwd: '',
          checkPwd: ''
        },
        oModifyDlgRules: {          //密码对话框校验
          oldPwd: [
            {required: true, message: '不能为空', trigger: 'change, blur'}
          ],
          newPwd: [
            {required: true, message: '不能为空', trigger: 'change, blur'},
            {validator: validate.validatePassword, trigger: 'change, blur'},
            {
              validator: (rule, value, callback) => {
                validate.validateOldPassword(rule, value, callback, this.oModifyDlgData.oldPwd)
              },
              trigger: 'change, blur'
            }
          ],
          checkPwd: [
            {required: true, message: '不能为空', trigger: 'change, blur'},
            {
              validator: (rule, value, callback) => {
                validate.validate2Password(rule, value, callback, this.oModifyDlgData.newPwd)
              },
              trigger: 'change, blur'
            }
          ],
        },
        userName: '',
        day1: '',
        year1: '',
        month1: '',
        date1: '',
        time: '',
        peoplenum: '',
        aThemeList: [{          //主题列表
          name: '主题1',
          theme: 'theme1',
        }, {
          name: '主题2',
          theme: 'theme2'
        }, {
          name: '主题3',
          theme: 'theme3'
        }],
        oOpenMenu: {},          //当前展开的菜单
        defaultOpenMenu: [],    //默认展开的菜单
        defaultActiveMenu: '-1',   //默认选中的菜单
        aMenu: [
          {  //安全管理
            icon: 'fa fa-television fa-fw',
            name: '安全管理',
            router: '',
            children: [
              {
                icon: '',
                name: '用户管理',
                router: '/main/system/user/page',
              },
            ]
          },
          {
            //交易管理
            icon: 'fa fa-signal fa-fw',
            name: '交易管理',
            router: '',
            children: [
              {
                icon: '',
                name: '账户管理',
                router: '/main/system/account/page/accountLists',
              },
              {
                icon: '',
                name: '资金管理',
                router: '/main/system/money/page/todayMoneyManage',
              },
              {
                icon: '',
                name: '持仓管理',
                router: '/main/system/position/page/todayPosition',
              },
              {
                icon: '',
                name: '委托管理',
                router: '/main/system/order/page/todayOrder',
              },
              {
                icon: '',
                name: '成交管理',
                router: '/main/system/deal/page/todayDeal',
              }
            ]
          },
          {
            icon: "fa fa-database fa-fw",
            name: '日内配置',
            router: '',
            children: [
              {
                icon: '',
                name: '用户授权',
                router: '/main/system/accredit/page/grantList',
              },
              {
                icon: '',
                name: '账户授权',
                router: '/main/system/bind/page/codeAccount',
              },
              {
                icon: '',
                name: '公共券池',
                router: '/main/system/pool/page/todayPool',
              },
              {
                icon: '',
                name: '用户券池',
                router: '/main/system/usrpool/page/tusrPool',
              }
            ]
          },
          {
            icon: 'fa fa-line-chart fa-fw',
            name: '日内结算',
            router: "",
            children: [
              {
                icon: '',
                name: "个股持仓",
                router: "/main/system/trade/position/page/tradeToday"
              },
              {
                icon: '',
                name: '用户结算',
                router: '/main/system/trade/used/page/tradeToday',
              },
              {
                icon: '',
                name: '账户收益',
                router: '/main/system/statistics/account/accountStatisticsDay',
              },
              {
                icon: '',
                name: '用户收益',
                router: '/main/system/statistics/trader/traderStatisticsDay',
              },
              {
                icon: '',
                name: '结算收益',
                router: '/main/system/statistics/traderAccount/traderAccountStatisticsDay',
              },
            ]
          },
        ]


      }
    },
    methods: {
      gettime() {             //获取实时时间
        var weekday = new Array(7)
        weekday[0] = "星期日";
        weekday[1] = "星期一";
        weekday[2] = "星期二";
        weekday[3] = "星期三";
        weekday[4] = "星期四";
        weekday[5] = "星期五";
        weekday[6] = "星期六";

        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        var d = today.getDate();
        var mo = today.getMonth();
        var ye = today.getFullYear();
        var da = today.getDay();
        if (h < 10) {
          h = "0" + h;
        }
        if (m < 10) {
          m = "0" + m;
        }
        if (s < 10) {
          s = "0" + s;
        }
        this.time = h + ":" + m + ":" + s;
        this.date1 = d;
        this.month1 = mo + 1;
        this.year1 = ye;
        this.day1 = weekday[da];
      },
      showModifyDlg() {       //显示密码修改对话框
        this.bShowModifyDlg = true;
        this.$refs.modifyDlgForm ? this.$refs.modifyDlgForm.resetFields() : '';
      },
      modifyPwd() {           //修改密码                                                              //修改密码
        this.$refs.modifyDlgForm.validate((valid) => {
          if (valid) {
            var data = {
              oldPwd: this.oModifyDlgData.oldPwd,
              newPwd: this.oModifyDlgData.newPwd
            };
            API.updateAdminPwd(data).then((res) => {
              if (res.data.code == 'OK') {
                this.bShowModifyDlg = false;
                this.$notify({
                  message: '修改成功',
                  type: 'success'
                });
              } else {
                this.$notify({
                  message: res.data.msgView,
                  type: 'warning'
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      switchTheme(theme) {    //切换主题
        if (this.szCurrTheme === theme) {
          return;
        }
        localStorage.setItem('userTheme', theme);
        this.$router.go(0);
      },
      logout() {              //退出
        API.doLogout().then((res) => {
          this.$router.push('/login')
        })
      },
      expandMenu(evt) {          //展开或折叠菜单
        evt.target.classList.toggle('rotate90');
        this.bCollapseMenu = !this.bCollapseMenu;
        document.querySelectorAll('.main-container .el-submenu .el-menu').forEach((v) => {
          v.style.display = 'none';
        });
        document.querySelector('.main-container .content').classList.toggle('collapse');
        if (this.bCollapseMenu) {   //折叠菜单
          document.querySelectorAll('.main-container .el-submenu .el-menu .el-menu-item').forEach((v) => {
            v.style.padding = '0 5px';
          });
        } else {                    //展开菜单
          document.querySelectorAll('.main-container .el-submenu .el-menu .el-menu-item').forEach((v) => {
            v.style.padding = '0 40px';
          });
        }
      },
      enterMenu(data, evt) {  //鼠标移入一级菜单
        if (this.bCollapseMenu && this.oCurrMenu !== evt.target) {
          this.oCurrMenu = evt.target;
          document.querySelectorAll('.main-container .el-submenu .el-menu').forEach((v) => {
            v.style.display = 'none';
          });
          var node = evt.target.parentNode.parentNode.nextElementSibling;
          node.style.display = 'block';
        }
      },
      outMenu(evt) {          //鼠标移出菜单树
        if (this.bCollapseMenu && !evt.relatedTarget.className.match(/fa|div-menu-li|el-menu-item|collapse-submenu-text|router-submenu/g)) {
          this.oCurrMenu = null;
          document.querySelectorAll('.main-container .el-submenu .el-menu').forEach((v) => {
            v.style.display = 'none';
          });
        }
      },
      selectMenu(index) {
        localStorage.setItem('selectMenu', index);
      },
      openMenu(index) {
        this.oOpenMenu[index] = index;
        localStorage.setItem('openMenu', JSON.stringify(this.oOpenMenu));
      },
      closeMenu(index) {
        delete this.oOpenMenu[index];
        localStorage.setItem('openMenu', JSON.stringify(this.oOpenMenu));
      },
    },
    created() {
      var oOpenMenu = localStorage.getItem('openMenu')
      var defaultActiveMenu = localStorage.getItem('selectMenu')
      if (oOpenMenu) {
        this.oOpenMenu = JSON.parse(oOpenMenu);
        this.defaultOpenMenu = Object.keys(this.oOpenMenu);
      }
      if (defaultActiveMenu) {
        this.defaultActiveMenu = '' + defaultActiveMenu;
      }
      var theme = localStorage.getItem('userTheme');
      this.szCurrTheme = theme ? theme : 'theme1';
      API.getLoginProfile().then((res) => {
        this.userName = res.data.data.login.name;
        this.$store.dispatch('SETUSERINFO', {
          userInfo: res.data.data,
          userName: this.userName,
          userId: res.data.data.login.usrId,
        });
      })
      //在线人数
      var data = {
        status: 1,
      }
      API.getSessionState(data).then((res) => {
        this.peoplenum = res.data.data.list.length;
      });
      setInterval(() => {
        this.gettime()
      }, 1000);
    }
  }
</script>


