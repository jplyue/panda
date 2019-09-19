<template>
  <div>
    <el-row :gutter="10">
      <div class="floatL">
        <el-input v-model="szFindValue" placeholder="关键词" ref="keyword" class="width200" icon="search"
                  @keyup.enter.native="getTableData" @click="getTableData()" size="small">
        </el-input>
      </div>
      <el-button class="marginL10" @click="resetFunc" size="mini">重置</el-button>
      <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
      <el-button type="primary" icon="plus" class="floatR marginT5 marginR5" @click="showAddDlg" size="small">添加
      </el-button>
    </el-row>
    <el-row class="marginT10">
      <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow"
                class="label6-hover">
        <el-table-column label="用户ID" width="300px" align="center" :resizable="false">
          <template slot-scope="scope">
            <span class="title-head">{{scope.row.usrId === '' ? '--': scope.row.usrId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户标识" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.usrAlias === '' ? '--': scope.row.usrAlias}}
          </template>
        </el-table-column>

        <el-table-column label="爆仓线" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.stopLossLineAmount === '' ? '--': scope.row.stopLossLineAmount}}
          </template>
        </el-table-column>

        <el-table-column label="持仓市值限额" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.exposureTotal === '' ? '--': scope.row.exposureTotal}}
          </template>
        </el-table-column>

        <el-table-column label="授权描述" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.usrDescription === '' ? '--': scope.row.usrDescription}}
          </template>
        </el-table-column>
        <el-table-column label="能力参数" prop="tag" column-key="tag" align="center" width="210px" :resizable="false">
          <template slot-scope="scope">
            <div class="label-div">
                            <span class="label-span" v-if="scope.row.feature == 1 ">
                                <span class="waits">{{scope.row.feature === '' ? '--': '管理员'}}</span>
                            </span>
              <span class="label-span" v-if="scope.row.feature == 2 ">
                                <span class="waits">{{scope.row.feature === '' ? '--': '风控员'}}</span>
                            </span>
              <span class="label-span" v-if="scope.row.feature == 3 ">
                                <span class="waits">{{scope.row.feature === '' ? '--': '管理员'}}</span>
                                <span class="waits">{{scope.row.feature === '' ? '--': '风控员'}}</span>
                            </span>
              <span class="label-span" v-if="scope.row.feature == 4 ">
                                <span class="waits">{{scope.row.feature === '' ? '--': '交易员'}}</span>
                            </span>
              <span class="label-span" v-if="scope.row.feature == 5 ">
                                <span class="waits">{{scope.row.feature === '' ? '--': '管理员'}}</span>
                                <span class="waits">{{scope.row.feature === '' ? '--': '交易员'}}</span>
                            </span>
              <span class="label-span" v-if="scope.row.feature == 6 ">
                                <span class="waits">{{scope.row.feature === '' ? '--': '风控员'}}</span>
                                <span class="waits">{{scope.row.feature === '' ? '--': '交易员'}}</span>
                            </span>
              <span class="label-span" v-if="scope.row.feature == 7 ">
                                <span class="waits">{{scope.row.feature === '' ? '--': '管理员'}}</span>
                                <span class="waits">{{scope.row.feature === '' ? '--': '风控员'}}</span>
                                <span class="waits">{{scope.row.feature === '' ? '--': '交易员'}}</span>
                            </span>
              <div class="label-button">
                <el-button size="small" class="colorG" type="text" @click="showTag(scope.row)">设置</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交易密码" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.usrTdpwdEnable == true">
              {{scope.row.usrTdpwdEnable === '' ? '--': '启用'}}
            </div>
            <div v-if="scope.row.usrTdpwdEnable == false">
              {{scope.row.usrTdpwdEnable === '' ? '--': '禁用'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="计费参数" align="center" width="110px" :resizable="false">
          <template slot-scope="scope">
            <div class="label-div">
                            <span class="label-span" v-if="scope.row.containFee == true">
                                {{scope.row.containFee === '' ? '--': scope.row.feeDescription}}
                            </span>
              <span class="label-span" v-if="scope.row.containFee == false">
                                <span class="wait">{{scope.row.containFee === '' ? '--': '未设置'}}</span>
                            </span>
              <div class="label-button">
                <el-button size="small" class="colorG" type="text" @click="chargeSet(scope.row)">设置</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="100px" :resizable="false">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 2">
              <span class="fail">{{scope.row.status === '' ? '--': '禁用'}}</span>
            </div>
            <div v-if="scope.row.status == 1">
              <span class="success">{{scope.row.status === '' ? '--': '正常'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.createTime === '' ? '--': scope.row.createTime|ellipsis(19)}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="200px" :resizable="false">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="modifyAccount(scope.row)">修改</el-button>
            <el-dropdown size="small" trigger="click" @command="handleCommand">
                            <span class="el-dropdown-link el-button--text">
                                操作
                                <i class="el-icon-caret-bottom el-icon--right"></i>
                            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="updateStatus">修改状态</el-dropdown-item>
                <el-dropdown-item command="resetPassword">重置密码</el-dropdown-item>
                <!-- <el-dropdown-item command="feature">能力参数</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <el-button size="small" type="text" @click="deleteAct(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
      </el-pagination>
    </el-row>
    <div class="clear"></div>

    <el-dialog title="用户授权-添加用户" :visible.sync="bShowAddDlg" :modal="true" custom-class="width450"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :model="oAddDlgData" :rules="oAddDlgRules" ref="addDlgForm" :inline="true"
               class="demo-form-inline">
        <el-form-item label="用户名称：" prop="name">
          <el-select v-model="oAddDlgData.name" clearable
                     remote
                     filterable
                     :remote-method="remoteMethod"
                     :loading="loading"
                     @focus="select"
                     placeholder="请输入用户名称">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户标识：" prop="usrAlias">
          <el-input type="text" v-model="oAddDlgData.usrAlias" size="small"></el-input>
        </el-form-item>

        <el-form-item label="爆仓线：" prop="stopLossLineAmount">
          <el-input type="text" v-model.number="oAddDlgData.stopLossLineAmount" size="small"></el-input>
        </el-form-item>

        <el-form-item label="持仓市值限额：" prop="exposureTotal">
          <el-input type="text" v-model.number="oAddDlgData.exposureTotal" size="small"></el-input>
        </el-form-item>

        <el-form-item label="账户描述：" prop="usrDescription">
          <el-input type="textarea" :autosize="{ minRows: 4}" class="el_form_input" v-model="oAddDlgData.usrDescription"
                    size="small"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer">
                <el-button @click="bShowAddDlg = false">取 消</el-button>
                <el-button type="primary" @click="addAccount">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="用户授权-修改用户" :visible.sync="ShowAddDlg" :modal="true" custom-class="width450"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :model="updateAccount" :rules="AddDlgRules" ref="addDlgForm" :inline="true"
               class="demo-form-inline">
        <el-form-item label="用户标识：" prop="usrAlias">
          <el-input type="text" v-model="updateAccount.usrAlias" size="small"></el-input>
        </el-form-item>

        <el-form-item label="爆仓线：" prop="stopLossLineAmount">
          <el-input type="text" v-model.number="updateAccount.stopLossLineAmount" size="small"></el-input>
        </el-form-item>

        <el-form-item label="持仓市值限额：" prop="exposureTotal">
          <el-input type="text" v-model.number="updateAccount.exposureTotal" size="small"></el-input>
        </el-form-item>

        <el-form-item label="用户描述：" prop="usrDescription">
          <el-input type="textarea" :autosize="{ minRows: 4}" class="el_form_input"
                    v-model="updateAccount.usrDescription" size="small"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer">
                <el-button @click="ShowAddDlg = false">取 消</el-button>
                <el-button type="primary" @click="updateAct">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="用户授权-修改状态" :visible.sync="ShowStatusDlg" :modal="true" custom-class="width450"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :model="oStatusDlgData" :inline="true">
        <el-form-item label="状态：">
          <el-radio v-model="oStatusDlgData.status" label="1">正常</el-radio>
          <el-radio v-model="oStatusDlgData.status" label="2">禁用</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="ShowStatusDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyUserStatus">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="用户授权-重置密码" :visible.sync="pShowStatusDlg" :modal="true" custom-class="width450"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :model="oPasswordDlgData" ref="oPasswordDlgForm" :rules="oPasswordRule"
               :inline="true">
        <el-form-item label="重置密码：" prop="password">
          <el-input type="text" v-model="oPasswordDlgData.password"></el-input>
        </el-form-item>
        <el-form-item label="交易密码：" label-width="120px">
          <el-radio v-model="oPasswordDlgData.usrTdpwdEnable" label="true">启用</el-radio>
          <el-radio v-model="oPasswordDlgData.usrTdpwdEnable" label="false">禁用</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="pShowStatusDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyUserPassword">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="用户授权-修改能力" :visible.sync="ShowFeatureDlg" :modal="true" custom-class="width495"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :inline="true" ref="featureDlgForm">
        <el-form-item label="修改能力：">
          <el-checkbox-group v-model="feature" size="small">
            <el-checkbox-button class="but-margin" :label="item.value" :key="$index" v-for="(item,$index) in abilities">
              {{item.name}}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="ShowFeatureDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyFeature">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="用户授权-修改计费" :visible.sync="ShowChargeDlg" :modal="true" custom-class="width495"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :model="updateCharge" :inline="true" :rules="chargeRules" ref="chargeDlgForm">
        <el-form-item label="计费列表：" prop="feeId">
          <el-select v-model="updateCharge.feeId"
                     remote clearable
                     filterable
                     @focus="tt"
                     :remote-method="chargeList"
                     :loading="loading"
                     placeholder="计费信息">
            <el-option
              v-for="(item,index) in cList"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="ShowChargeDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyChargeList">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import API from '../api.js';

  export default {
    data() {
      return {
        loading: false,
        options: [],
        szFindValue: '',            //关键词
        aTableData: [],          //表格数据
        bTableLoading: false,    //表格数据是否在加载中
        oCurrRowData: {},        //当前行
        pageConfig: {           //分页数据
          pageNumber: 1,      //当前页
          pageSize: 10,       //每页数量
          totalPage: 0,       //总页数
          totalRow: 0         //总条数
        },
        bShowAddDlg: false,         //显示添加窗口
        ShowAddDlg: false,
        oAddDlgData: {        //添加账户
          usrId: '',   //用户Id
          usrAlias: '', //用户标识
          stopLossLineAmount: '',//爆仓线
          exposureTotal: '', //持仓市值限额
          usrDescription: '',//用户描述
        },
        oAddDlgRules: { //添加弹窗校验规则
          name: [{required: true, message: '不能为空'}],
          usrAlias: [{required: true, message: '不能为空', trigger: 'blur'}],
        },
        ShowStatusDlg: false,//状态
        oStatusDlgData: {   //用户名
          status: '',
        },
        pShowStatusDlg: false,//密码
        oPasswordDlgData: {   //用户名
          password: '',
          usrTdpwdEnable: '',
        },
        oPasswordRule: {
          password: [{required: true, message: '不能为空且'}]
        },
        updateAccount: { //修改
          usrId: '',
          usrAlias: '',
          stopLossLineAmount: '',//爆仓线
          exposureTotal: '', //持仓市值限额
          usrDescription: '',
        },
        AddDlgRules: {
          usrAlias: [{required: true, message: '不能为空', trigger: 'blur'}],
        },
        ShowFeatureDlg: false, //能力参数
        feature: [],
        abilities: [
          {name: '管理员', value: "1"},
          {name: '风控员', value: "2"},
          {name: '交易员', value: "4"},
        ],
        // 修改计费参数
        ShowChargeDlg: false,
        updateCharge: {
          feeId: '',
          usrId: '',
        },
        cList: [],
        chargeRules: {
          feeId: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    methods: {
      //-------------删除用户-----------------------
      deleteAct(row) {
        this.$confirm('确认删除用户： ' + row.usrAlias, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.deleteAccount(row);
        }).catch(() => {
        })
      },
      deleteAccount(row) {
        var data = {
          usrId: row.usrId
        };
        API.deleteUser(data).then(res => {
          if (res.data.code == 'OK') {
            this.$notify({
              message: '删除成功',
              type: 'success'
            });
            this.getTableData();
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // ------------修改用户---------------------
      modifyAccount(row) {
        this.ShowAddDlg = true;
        this.updateAccount.usrId = row.usrId;
        this.updateAccount.usrAlias = row.usrAlias;
        this.updateAccount.stopLossLineAmount = row.stopLossLineAmount;
        this.updateAccount.exposureTotal = row.exposureTotal;
        this.updateAccount.usrDescription = row.usrDescription;
      },
      updateAct() {
        var data = {
          usrId: this.updateAccount.usrId,
          usrAlias: this.updateAccount.usrAlias,
          stopLossLineAmount: this.updateAccount.stopLossLineAmount,
          exposureTotal: this.updateAccount.exposureTotal,
          usrDescription: this.updateAccount.usrDescription,
        };
        API.updateAcnt(data).then(res => {
          if (res.data.code === 'OK') {
            this.ShowAddDlg = false;
            this.$notify({
              message: '修改成功',
              type: 'success'
            });
            this.getTableData();
          } else {
            this.$notify({
              message: res.data.msgView,
              type: 'warning'
            });
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //----------------修改用户状态/密码---------------
      handleCommand(command) {
        switch (command) {
          case 'updateStatus':
            this.ShowStatusDlg = true;
            this.oStatusDlgData.status = this.oCurrRowData.status + '';
            break;
          case 'resetPassword':
            this.pShowStatusDlg = true;
            this.$refs.oPasswordDlgForm ? this.$refs.oPasswordDlgForm.resetFields() : '';
            this.oPasswordDlgData.password = this.oPasswordDlgData.password + '';
            this.oPasswordDlgData.usrTdpwdEnable = this.oCurrRowData.usrTdpwdEnable + '';
            break;
        }
      },
      // 修改状态
      modifyUserStatus() {
        var data = {
          usrId: this.oCurrRowData.usrId,
          status: this.oStatusDlgData.status,
        };
        API.updateUserStatus(data).then(res => {
          if (res.data.code === 'OK') {
            this.ShowStatusDlg = false;
            this.$notify({
              message: '修改成功',
              type: 'success'
            });
            this.getTableData();
          } else {
            this.$notify({
              message: res.data.msgView,
              type: 'warning'
            });
          }
        }).catch(err => {
          console.log(err)
        })
      },
      //重置密码
      modifyUserPassword() {
        var data = {
          usrId: this.oCurrRowData.usrId,
          tdpwdEnable: this.oPasswordDlgData.usrTdpwdEnable,
          tdpwd: this.oPasswordDlgData.password,
        };
        API.resetPassword(data).then(res => {
          if (res.data.code === 'OK') {
            this.pShowStatusDlg = false;
            this.$notify({
              message: '修改成功',
              type: 'success'
            });
            this.getTableData();
          } else {
            this.$notify({
              message: res.data.msgView,
              type: 'warning'
            });
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 能力参数
      showTag(row) {
        this.ShowFeatureDlg = true;
        this.feature = [];
        this.feature.push(row.feature + "")
        if (row.feature == '3') {
          this.feature = ['2', '1']
        }
        if (row.feature == '5') {
          this.feature = ['4', '1']
        }
        if (row.feature == '6') {
          this.feature = ['4', '2']
        }
        if (row.feature == '7') {
          this.feature = ['4', '2', '1']
        }
      },

      // 修改能力参数
      modifyFeature() {
        let tag = 0;
        this.feature.forEach((v, k) => {
          tag += (v - 0);
        })
        var data = {
          usrId: this.oCurrRowData.usrId,
          feature: tag,
        }
        API.modifyFeature(data).then(res => {
          if (res.data.code === 'OK') {
            this.ShowFeatureDlg = false;
            this.$notify({
              message: '修改成功',
              type: 'success'
            });
            this.getTableData();
          } else {
            this.$notify({
              message: res.data.msgView,
              type: 'warning'
            });
          }
        }).catch(err => {
          console.log(err)
        })
      },
      // 计费参数
      chargeSet(row) {
        this.ShowChargeDlg = true;
        this.$refs.chargeDlgForm ? this.$refs.chargeDlgForm.resetFields() : '';
        this.updateCharge.usrId = row.usrId;
      },
      chargeList(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey: query
            };
            API.chargeListSelect(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              ;
              this.cList = arr.map(item => {
                return {value: item.id, label: item.description};
              });
            })
          }, 300);
        }
      },
      tt() {
        var states = [];
        var data = {};
        API.chargeListSelect(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          }
          ;
          this.cList = states.map(item => {
            return {value: item.id, label: item.description};
          });
        })
      },
      modifyChargeList() {
        this.$refs.chargeDlgForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          var data = {
            feeId: this.updateCharge.feeId,
            usrId: this.updateCharge.usrId,
          }
          API.modifyChargeItem(data).then(res => {
            if (res.data.code === 'OK') {
              this.ShowChargeDlg = false;
              this.$notify({
                message: '设置成功',
                type: 'success'
              });
              this.getTableData();
            } else {
              this.$notify({
                message: res.data.msgView,
                type: 'warning'
              });
            }
          })
        })
      },
      showAddDlg() {              //显示添加弹窗
        this.bShowAddDlg = true;
        this.$refs.addDlgForm ? this.$refs.addDlgForm.resetFields() : '';
      },
      // ------------//添加用户---------------------
      addAccount() { //添加用户
        var data = {
          usrId: this.oAddDlgData.name,
          usrAlias: this.oAddDlgData.usrAlias,
          stopLossLineAmount: this.oAddDlgData.stopLossLineAmount,
          exposureTotal: this.oAddDlgData.exposureTotal,
          usrDescription: this.oAddDlgData.usrDescription
        };
        API.accountCreate(data).then(res => {
          if (res.data.code === 'OK') {
            this.bShowAddDlg = false;
            this.$notify({
              message: '添加成功',
              type: 'success'
            });
            this.getTableData();
          } else {
            this.$notify({
              message: res.data.msgView,
              type: 'warning'
            });
          }
        }).catch(err => {
          console.log(err);
        })
      },
      remoteMethod(queryString) {
        if (queryString != '') {
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey: queryString
            };
            API.accountCreateSearch(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              ;
              this.options = arr.map(item => {
                return {value: item.id, label: item.name};
              });
            })
          }, 300);
        }
      },
      select() {
        var states = [];
        var data = {};
        API.accountCreateSearch(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          }
          ;
          this.options = states.map(item => {
            return {value: item.id, label: item.name};
          });
        })
      },
      handleSizeChange(size) {    //每页大小改变
        this.pageConfig.pageNumber = 0;
        this.pageConfig.pageSize = size;
        this.getTableData();
      },
      handleCurrentChange(page) {     //当前页改变
        this.pageConfig.pageNumber = page;
        this.getTableData();
      },
      selectedRow(row) {           //选中行
        this.oCurrRowData = row;
      },
      resetFunc() { //重置按钮
        this.szFindValue = '';
        this.getTableData();
      },
      getTableData() {
        var data = {
          pageSize: this.pageConfig.pageSize,
          pageNumber: this.pageConfig.pageNumber,
          findkey: this.szFindValue,
        };
        this.bTableLoading = true;
        API.accountAccredit(data).then(res => {
          this.bTableLoading = false;
          this.aTableData = res.data.data.list;
          this.pageConfig.pageSize = res.data.data.pageSize;
          this.pageConfig.totalRow = res.data.data.totalRow;
          this.pageConfig.totalPage = res.data.data.totalPage;
        })
      },
    },
    created() {
      this.$nextTick(function () {
        this.$refs.keyword.$el.querySelector('[icon=search]').focus();
      });
      document.title = '用户授权';
      this.getTableData();

    },

  }
</script>

<style scoped>
  .waits {
    display: inline-block;
    width: 60px;
    color: #fff;
    border-radius: 10px;
    line-height: 25px;
    background-color: #5bc0de;
  }

  .but-margin {
    margin-right: 10px;
  }

  .el_form_input {
    width: 240px !important;
  }

  .zy-div {
    height: 40px;
    line-height: 40px;
    margin: 0 0 10px 0;
    border-bottom: 1px solid #d2d2d2;
    font-size: 16px;
    color: #454545;
    margin-bottom: 15px;
  }

  .zy-div .title {
    display: inline-block;
    height: 36px;
    line-height: 50px;
    width: 140px;
    text-align: center;
    text-align: left;
    padding-left: 10px;
  }

  .label6-hover .label-div {
    height: 24px;
  }

  .label6-hover .label-div .label-button {
    display: none;
  }

  .label6-hover .label-div:hover .label-span {
    display: none;
  }

  .label6-hover .label-div:hover .label-button {
    display: block;
    cursor: pointer;
  }

  .img-head {
    width: 30px;
    height: 30px;
    border-radius: 25px;
    position: relative;
    top: 5px;
  }

  .ImgUrl {
    position: absolute;
    top: -45px;
    left: 260px;
    width: 80px;
    height: 80px;
  }

  .ImgUrl .avatar-uploader {
    width: 80px;
    height: 80px;
  }

  .avatar-uploader .avatar {
    width: 100%;
    height: 100%;
  }

  .adviser-div .adviser-set {
    display: none;
  }

  .adviser-div:hover .adviser-name {
    display: none;
  }

  .adviser-div:hover .adviser-set {
    display: block;
    cursor: pointer;
  }

  .demo-form-inline {
    text-align: center;
  }
</style>
