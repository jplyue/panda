<template>
  <div>
    <el-row :gutter="10" class="marginB10">
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">账户：</span>
        <el-select v-model="accountId" clearable class="width145"
                   remote
                   filterable
                   @focus="tt2"
                   @change="getTableData()"
                   :remote-method="remoteMethod2"
                   :loading="loading"
                   placeholder="账户信息">
          <el-option
            v-for="(item,index) in options2"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">股票：</span>
        <el-select v-model="stockCode" clearable class="width180"
                   remote
                   filterable
                   :remote-method="querySearchAsync2"
                   :loading="loading"
                   @focus="query"
                   @change="getTableData()"
                   placeholder="股票信息">
          <el-option
            v-for="(item,index) in stocOptions"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">券源日期：</span>
        <el-date-picker value-format="yyyy-MM-dd" clearable class="width130" v-model="dateBegin" :editable="false"
                        type="date" align="right" placeholder="开始日期" @change="dateChanged('dateBegin', $event)"
                        size="small">
        </el-date-picker>
      </div>
      <el-button class="marginL10" @click="resetFunc" size="mini">重置</el-button>
      <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
      <el-button type="info" class="marginL10 marginT5" size="small" @click="queryStockPool">分券</el-button>
      <el-button type="primary" class="floatR marginR0 marginT5" size="small" @click="importInfor">导入</el-button>
      <el-button type="primary" class="floatR marginR0 marginT5" size="small" @click="exportPoolExcel">导出</el-button>
    </el-row>
    <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow" class="label6-hover">

      <el-table-column fixed label="账户标识" align="center" min-width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.accountAlias === '' ? '--': scope.row.accountAlias}}
        </template>
      </el-table-column>
      <el-table-column fixed label="股票代码" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          <span class="title-head">{{scope.row.stockCode === '' ? '--': scope.row.stockCode}}</span>
        </template>
      </el-table-column>

      <el-table-column fixed label="股票名称" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.stockName === '' ? '--': scope.row.stockName}}
        </template>
      </el-table-column>
      <el-table-column label="券源日期" align="center" min-width="100px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.applyDate === '' ? '--': scope.row.applyDate}}
        </template>
      </el-table-column>
      <el-table-column label="昨仓数量" align="center" min-width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.yestVolume === '' ? '--': scope.row.yestVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="券源市值" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.secresMktValue === '' ? '--': scope.row.secresMktValue|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="券源总数" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.secresVolume === '' ? '--': scope.row.secresVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="分配股数" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.allocedVolume === '' ? '--': scope.row.allocedVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="剩余股数" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.idleVolume === '' ? '--': (scope.row.idleVolume|formatMoney)}}
        </template>
      </el-table-column>
      <el-table-column label="分配比率" align="center" min-width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.allocedRate === '' ? '--': scope.row.allocedRate|percentageFormat(2)}}
        </template>
      </el-table-column>
      <el-table-column label="使用股数" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.usedVolume === '' ? '--': scope.row.usedVolume}}
        </template>
      </el-table-column>
      <el-table-column label="使用比率" align="center" min-width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.usedRate === '' ? '--': scope.row.usedRate|percentageFormat(2)}}
        </template>
      </el-table-column>
      <el-table-column label="分配用户数" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.allocedUsrCnt === '' ? '--': scope.row.allocedUsrCnt}}
        </template>
      </el-table-column>
      <el-table-column label="可用股数" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.idleVolume === '' ? '--': scope.row.idleVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="普通买入(总数)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.standBuyVolume === '' ? '--': scope.row.standBuyVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="普通卖出(总数)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.standSaleVolume === '' ? '--': scope.row.standSaleVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="融资买入(总数)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.marginBuyVolume === '' ? '--': scope.row.marginBuyVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="融券卖出(总数)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.marginSaleVolume === '' ? '--': scope.row.marginSaleVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="普通买入(分配)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.allocedStandBuyVolume === '' ? '--': scope.row.allocedStandBuyVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="普通卖出(分配)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.allocedStandSaleVolume === '' ? '--': scope.row.allocedStandSaleVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="融资买入(分配)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.allocedMarginBuyVolume === '' ? '--': scope.row.allocedMarginBuyVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="融券卖出(分配)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.allocedMarginSaleVolume === '' ? '--': scope.row.allocedMarginSaleVolume|formatMoney}}
        </template>
      </el-table-column>

      <el-table-column label="普通买入(可用)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.idleStandBuyVolume === '' ? '--': scope.row.idleStandBuyVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="普通卖出(可用)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.idleStandSaleVolume === '' ? '--': scope.row.idleStandSaleVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="融资买入(可用)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.idleMarginBuyVolume === '' ? '--': scope.row.idleMarginBuyVolume|formatMoney}}
        </template>
      </el-table-column>
      <el-table-column label="融券卖出(可用)" align="center" width="120px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.idleMarginSaleVolume === '' ? '--': scope.row.idleMarginSaleVolume|formatMoney}}
        </template>
      </el-table-column>

      <el-table-column label="最新消息" align="center" min-width="140px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.latMessage === '' ? '--': scope.row.latMessage}}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" min-width="140px" :resizable="false">
        <template slot-scope="scope">
          {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="状态" align="center" width="110px" :resizable="false">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 1">
            <span class="success">{{scope.row.status === '' ? '--': '正常'}}</span>
          </div>
          <div v-if="scope.row.status == 2">
            <span class="fail">{{scope.row.status === '' ? '--': '禁用'}}</span>
          </div>
          <div v-if="scope.row.status == 3">
            <span class="fail">{{scope.row.status === '' ? '--': '分配失败'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" min-width="130px" :resizable="false">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="updateStatusPool(scope.row)">{{scope.row.status == 1 ? '禁用' :
            '启用'}}
          </el-button>
          <el-button size="small" type="text" :disabled="scope.row.status == 1 ? false : true "
                     @click="updateDataPool(scope.row)">修改
          </el-button>
          <el-button size="small" type="text" :disabled="scope.row.status == 1 ? false : true "
                     @click="allotPool(scope.row)">分配
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
    </el-pagination>
    <el-dialog title="公共券池-修改数据" :visible.sync="ShowDataPool" :modal="true" custom-class="width450"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="140px" :model="oTodayDataPool" ref="oDataDlgForm" :rules="rulesData" :inline="true"
               class="chargerForm">
        <el-form-item label="账户标识：" class="fontSize">
          {{oTodayDataPool.accountAlias}}
        </el-form-item>
        <el-form-item label="股票信息：" class="fontSize">
          {{oTodayDataPool.stockCode}}--{{oTodayDataPool.stockName}}
        </el-form-item>
        <el-form-item label="资源日期：" class="fontSize">
          {{oTodayDataPool.applyDate}}
        </el-form-item>
        <el-form-item label="昨仓数量：" class="fontSize">
          {{oTodayDataPool.yestVolume}}
        </el-form-item>
        <el-form-item label="资源数量(当前)：" class="fontSize">
          {{oTodayDataPool.secresVolume}}
        </el-form-item>
        <el-form-item label="资源数量(拟分配)：" prop="planSecresVolume">
          <el-input-number v-model.number="oTodayDataPool.planSecresVolume" :min="0"
                           :max="this.oTodayDataPool.yestVolume" :step="100"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="ShowDataPool = false">取 消</el-button>
                <el-button type="primary" @click="modifyDataPool">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="公共券池-修改状态" :visible.sync="ShowPoolDlg" :modal="true" custom-class="width450"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :model="oAccountDlgData" :inline="true" class="chargerForm">
        <el-form-item label=" ">
          <span class="fontSzie16">股票信息：{{oAccountDlgData.stockCode}}{{oAccountDlgData.stockName}}</span>
        </el-form-item>
        <el-form-item label=" ">
          确认要{{oAccountDlgData.status == 1 ? '禁用' : '启用'}}此条数据吗？
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="ShowPoolDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyStatusPool">确 认</el-button>
            </span>
    </el-dialog>
    <el-dialog title="公共券池-可分配股数" :visible.sync="ShowAllotDlg" :modal="true" custom-class="width450"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :model="oAllotDlgData" ref="oAllotDlgForm" :rules="rules" :inline="true">
        <el-form-item label="股票信息：" class="fontSize">
          <span class="">{{oAllotDlgData.stockCode}}--{{oAllotDlgData.stockName}}</span>
        </el-form-item>
        <br>
        <el-form-item label="总数量：" class="fontSize">
          <span class="">{{oAllotDlgData.secresVolume|formatMoney}}</span>
        </el-form-item>
        <el-form-item label="可用数量：" class="fontSize">
          <span class="">{{oAllotDlgData.idleVolume|formatMoney}}</span>
        </el-form-item>
        <el-form-item label="分配数量：" prop="allocVolume">
          <el-input-number v-model.number="oAllotDlgData.allocVolume" :min="100" :max="this.oAllotDlgData.idleVolume"
                           :step="100"></el-input-number>
        </el-form-item>
        <el-form-item label="用户信息：" prop="usrId">
          <!-- <el-autocomplete
              v-model="oAllotDlgData.usrAlias"
              :fetch-suggestions="querySearchAsync"
              @select="handleSelect"
              placeholder="请输入用户信息"
          >
          </el-autocomplete> -->
          <el-select v-model="oAllotDlgData.usrId" clearable
                     remote
                     filterable
                     :remote-method="querySearchAsync"
                     :loading="loading"
                     @focus="handleSelect"
                     @change="getTableData()"
                     placeholder="请输入用户信息">
            <el-option
              v-for="(item,index) in usrOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配描述：" prop="description">
          <el-input type="textarea" :autosize="{ minRows: 3}" class="el_form_input"
                    v-model="oAllotDlgData.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="ShowAllotDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyAllot">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="导入文件" :visible.sync="isExportShow" :modal="true" custom-class="width880"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="120px" :inline="true">
        <el-upload
          class="upload-demo" align="center"
          ref="upload"
          name="upfile"
          :multiple="false"
          :show-file-list='true'
          list-type='text'
          accept='.xls,.xlsx'
          :action="UploadUrl()"
          :auto-upload="false"
          :on-change="addFileChange"
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
        <el-button size="small" type="text" class="download" @click='downloadExcel'>下载模版</el-button>
      </el-form>
      <div class="bg-remark">
        <span class="caption">重要提示：</span><br>
        <span>导入功能正在进一步升级当中......<br>
                如需导入个股设置股票，请先下载导入模板，在原有模板基础上进行修改，然后进行导入。<br>
                否则可能会出现导入失败。尽情谅解!
                </span>
      </div>
      <span slot="footer">
                <el-button @click="isExportShow = false">取 消</el-button>
                <el-button type="primary" @click="addFile">导 入</el-button>
            </span>
    </el-dialog>

    <el-dialog title="公共券池-批量分券" :visible.sync="ShowPoolDlg" :modal="true" custom-class="width1132"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="100px" :inline="true" class="chargerForm" v-for="(stock,sidx) in stockData">
        <el-form-item label="">
          <span class="fontSize" ref="stockWrapper">{{stock.stockCode}}--{{stock.allowBuyVolume}}</span>
          <el-form-item label="" v-for="(trader,tidx) in (stock.traderBeans)">
            <el-checkbox-group>
              <el-checkbox-button class="but-margin">{{trader.traderName}}</el-checkbox-button>
              <el-input type="text" size="small" number
                        style="width: 80px" ref="traderWrapper"
                        @change="setValue(sidx,tidx,$event)"></el-input>
            </el-checkbox-group>
          </el-form-item>
        </el-form-item>
      </el-form>
      <span slot="footer">
                <el-button @click="ShowPoolDlg = false">取 消</el-button>
                <el-button type="primary" @click="allocStocks">确 认</el-button>
      </span>
    </el-dialog>

    <!-- <excel-export :isshow.sync='isExportShow' :export-hint="userInfoTile" :table-column='tableColumn' :API='oPrefAPI' dlg-title="基本信息导入" :is-repetition="true" dlg-tips="登录默认密码为888888"></excel-export> -->
  </div>
</template>

<script>
  import API from '../api.js';
  import utils from '@/lib/utils.js'
  import axios from 'axios';
  // import excelExport from '@/components/excelExport.vue'
  export default {
    // components:{
    //     excelExport,
    // },
    data() {
      var newReg1 = (rule, value, callback) => {
        if (value < 0) {
          callback(new Error("不能为负数"));
        } else if (value % 100 !== 0) {
          callback(new Error("只能是100的整数倍"))
        } else if (value > this.oAllotDlgData.idleVolume) {
          callback(new Error('不可大于可用数量'))
        } else {
          callback();  //必须要有回调，要不然表单无法提交
        }
      };
      var newReg2 = (rule, value, callback) => {
        if (value < 0) {
          callback(new Error("不能为负数"));
        } else if (value % 100 !== 0) {
          callback(new Error("只能是100的整数倍"))
        } else if (value > this.oTodayDataPool.yestVolume) {
          callback(new Error('不可大于可用数量'))
        } else {
          callback();  //必须要有回调，要不然表单无法提交
        }
      };
      return {
        checked: false,
        selectIds: [],
        traderNum: 0,
        stockData: [],
        traderVolume: [],
        // ----------------导入----------
        isExportShow: false,//excel导入弹窗
        userInfoTile: ['1.单次最多导入1000条数据', '2.客户类型为必填项', '3.证件号，手机号，电子邮箱至少提供一个', '4.如果提供证件号请选择正确证件类型，否则可能导致导入数据不准确', '5.客户类型为自然人，证件类型为身份证时，会根据身份证号自动解析生日与性别'],
        tableColumn: [                 //excel导入字段
          {name: '账户标识', code: 'accountAlias', isEdit: false, setWidth: 150},
          {name: '股票代码', code: 'stockCode', isEdit: false, setWidth: 150},
          {name: '股票名称', code: 'stockName', isEdit: true, setWidth: 200},
          {name: '券源日期', code: 'applyDate', isEdit: false, setWidth: 200},
          {name: '普通买入(总数)', code: 'standBuyVolume', isEdit: true, setWidth: 150},
          {name: '普通卖出(总数)', code: 'standSaleVolume', isEdit: true, setWidth: 150},

          {name: '融资买入(总数)', code: 'marginBuyVolume', isEdit: false, setWidth: 150},
          {name: '融券卖出(总数)', code: 'marginSaleVolume', isEdit: false, setWidth: 150},
          {name: '普通买入(分配)', code: 'allocedStandBuyVolume', isEdit: true, setWidth: 200},
          {name: '普通卖出(分配)', code: 'allocedStandSaleVolume', isEdit: false, setWidth: 200},
          {name: '融资买入(分配)', code: 'allocedMarginBuyVolume', isEdit: true, setWidth: 150},
          {name: '融券卖出(分配)', code: 'allocedMarginSaleVolume', isEdit: true, setWidth: 150},

          {name: '普通买入(可用)', code: 'idleStandBuyVolume', isEdit: false, setWidth: 150},
          {name: '普通卖出(可用)', code: 'idleStandSaleVolume', isEdit: false, setWidth: 150},
          {name: '融资买入(可用)', code: 'idleMarginBuyVolume', isEdit: true, setWidth: 200},
          {name: '融券卖出(可用)', code: 'idleMarginSaleVolume', isEdit: false, setWidth: 200},
          {name: '券源市值', code: 'secresMktValue', isEdit: true, setWidth: 150},
          {name: '最新消息', code: 'latMessage', isEdit: true, setWidth: 150},
        ],
        oPrefAPI: {             //导入
          // import: '/api/heart/saas/march/services/prsday/secres/excel/analysis?',              //导入用户信息
        },
        // --------------------------
        teamId: '',
        stockCode: '',  //股票信息
        stocOptions: [], //股票选择器
        accountId: '', //交易账户
        options2: [], //账户列表
        loading: false,
        status: '',                 //状态
        aTableData: [],          //表格数据
        bTableLoading: false,    //表格数据是否在加载中
        oCurrRowData: {},        //当前行
        pageConfig: {           //分页数据
          pageNumber: 1,      //当前页
          pageSize: 10,       //每页数量
          totalPage: 0,       //总页数
          totalRow: 0         //总条数
        },
        // --------修改---------
        ShowDataPool: false,
        usrOptions: [], //用户信息选择器
        oTodayDataPool: {
          accountId: '',//账户ID
          accountAlias: '', // 账户标识
          stockCode: '', //股票代码
          stockName: '',//股票名称
          applyDate: '',//资源日期
          yestVolume: '',//昨仓数量
          secresVolume: '',//资源数量(当前)
          planSecresVolume: '', //资源数量(拟分配)
        },
        rulesData: {
          planSecresVolume: [{required: true, message: '不能为空且只能是100的整数倍'}, {
            type: 'number',
            message: '只能为数字'
          }, {validator: newReg2}]
        },
        // --------状态---------
        ShowPoolDlg: false,
        oAccountDlgData: {
          status: '',
          secresId: '',
          stockCode: '',
          stockName: '',
        },
        // --------分配-----------
        ShowAllotDlg: false,
        oAllotDlgData: {
          usrId: '', //用户ID
          secresId: '', // 资源ID
          usrId: '', //用户标识
          secresVolume: '',//总量
          idleVolume: '',//可用数量
          allocVolume: '', //分配数量
          description: '',//分配描述
          stockCode: '',// 股票代码,
          stockName: '',//股票名称
        },
        rules: {
          usrId: [{required: true, message: '用户名称不能为空'}],
          allocVolume: [{required: true, message: '不能为空且只能是100的整数倍'}, {
            type: 'number',
            message: '只能为数字'
          }, {validator: newReg1}]
        },
        //----------条件-时间--------------
        dateBegin: '',  //时间筛选--开始时间
      }
    },
    watch: {
      dateBegin: function (newValue, oldValue) {   //净值周期改变
        if (oldValue != '' && typeof newValue === 'string' && newValue != oldValue) {
          this.getTableData();
        }
      },
      isExportShow: function (n) {
        if (!n) {
          setTimeout(() => {
            this.getTableData();
          }, 200);
        }
      },
      inputChange: function (newValue, oldValue) {
        alert(oldValue);
        alert(newValue);
      }
    },

    methods: {
      queryStockPool() {
        this.ShowPoolDlg = true;
        API.queryStockPool().then(res => {
          this.stockData = res.data.data;
          this.traderNum = this.stockData[0].traderNum
        })
      },

      // ----导出-----
      exportPoolExcel() {
        this.bTableLoading = false;
        axios.get("/api/heart/saas/march/services/prsday/secres/exportPublicPool?accountId=" + this.accountId + "&teamId=" + this.teamId + "&stockCode=" + this.stockCode + "&dateBegin=" + this.dateBegin, {responseType: 'blob'}).then(response => {
          this.download(response);
          this.bTableLoading = true;
        }).catch(error => {
          console.log(error);
        })
      },

      download(data) {
        if (!data) {
          return
        }
        var blob = new Blob([data.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
        var url = window.URL.createObjectURL(blob);
        var aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.download = '公共券池分配.xls';
        aLink.href = url;
        //aLink.setAttribute("数据模版", "数据模版.xls");
        document.body.appendChild(aLink)
        aLink.click();
      },


      // -------------下载模板-------------------
      downloadExcel() {//点击下载模版
        utils.downloadFile('/api/heart/saas/march/services/prsday/secres/excel/template/allow');
      },
      // ------------------导入-----------------
      importInfor() {
        this.isExportShow = true;
      },
      UploadUrl() {
        return '/api/heart/saas/march/services/prsday/secres/allow/import'
      },
      addFileChange(file, fileList) {  //文件列表改变或上传时触发
        fileList.length > 1 ? fileList.splice(0, 1) : '';
        if (file.response) {
          if (file.response.code === 'OK') {
            this.isExportShow = false;
            this.$refs.upload.clearFiles();
            this.$notify({
              type: 'success',
              message: file.response.msgView,
            });
            this.getTableData();
          } else {
            this.$notify({
              type: 'warning',
              message: file.response.msgView,
            });
          }
        }
      },
      addFile() {
        this.$refs.upload.submit();
      },
      dateChanged(name, date) {           //日期改变时修改日期值
        if (date && date.indexOf(' - ') !== -1) {
          utils.setValByName(this, name, date.split(' - '));
        } else {
          utils.setValByName(this, name, date);
        }
        this.getTableData()
      },
      // 股票代码模糊搜索
      querySearchAsync2(queryString) {
        if (queryString != '') {
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey: queryString
            };
            API.stockCodeSelect(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              ;
              this.stocOptions = arr.map(item => {
                return {value: item.stockCode, label: item.stockCode + ' ' + item.stockName};
              });
            })
          }, 300);
        }
      },
      query() {
        var states = [];
        var data = {};
        API.stockCodeSelect(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          }
          ;
          this.stocOptions = states.map(item => {
            return {value: item.stockCode, label: item.stockCode + ' ' + item.stockName};
          });
        })
      },
      // 账户信息查询
      remoteMethod2(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey: query
            };
            this.loading = true;
            API.accountSelect(data).then(res => {
              this.loading = false;
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              this.options2 = arr.map(item => {
                return {value: item.id, label: item.alias};
              })
            })
          }, 300);
        }
      },
      tt2() {
        var data = {};
        this.loading = true;
        API.accountSelect(data).then(res => {
          this.loading = false;
          var arr = [];
          for (var i in res.data.data) {
            arr.push(res.data.data[i]);
          }
          this.options2 = arr.map(item => {
            return {value: item.id, label: item.alias};
          })
        })
      },
      // -------------修改-------------
      updateDataPool(row) {
        this.ShowDataPool = true;
        this.$refs.oDataDlgForm ? this.$refs.oDataDlgForm.resetFields() : '';
        this.oTodayDataPool.accountId = row.accountId;
        this.oTodayDataPool.accountAlias = row.accountAlias;
        this.oTodayDataPool.stockCode = row.stockCode;
        this.oTodayDataPool.stockName = row.stockName;
        this.oTodayDataPool.applyDate = row.applyDate;
        this.oTodayDataPool.yestVolume = row.yestVolume;
        this.oTodayDataPool.secresVolume = row.secresVolume;
      },
      modifyDataPool() {
        this.$refs.oDataDlgForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          var data = {
            accountId: this.oTodayDataPool.accountId,
            stockCode: this.oTodayDataPool.stockCode,
            applyDate: this.oTodayDataPool.applyDate,
            planSecresVolume: this.oTodayDataPool.planSecresVolume,
          }
          API.modifyDataPool(data).then(res => {
            if (res.data.success == true) {
              this.ShowDataPool = false;
              this.$notify({
                message: '修改成功',
                type: 'success'
              });
              setTimeout(() => {
                this.getTableData();
              }, 200);
            } else {
              this.$notify({
                message: res.data.msgView,
                type: 'warning'
              });
            }
          }).catch(err => {
          })
        })
      },
      // --------------分配-----------
      allotPool(row) {
        this.ShowAllotDlg = true;
        this.$refs.oAllotDlgForm ? this.$refs.oAllotDlgForm.resetFields() : '';
        this.oAllotDlgData.secresVolume = row.secresVolume;
        this.oAllotDlgData.secresId = row.id;
        this.oAllotDlgData.idleVolume = row.idleVolume;
        this.oAllotDlgData.stockCode = row.stockCode;
        this.oAllotDlgData.stockName = row.stockName;
      },
      modifyAllot() {
        this.$refs.oAllotDlgForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          var data = {
            usrId: this.oAllotDlgData.usrId,
            secresId: this.oAllotDlgData.secresId,
            allocVolume: this.oAllotDlgData.allocVolume,
            description: this.oAllotDlgData.description,
          };
          API.allotVolumn(data).then(res => {
            if (res.data.success == true) {
              this.ShowAllotDlg = false;
              this.$notify({
                message: '分配成功',
                type: 'success'
              });
              setTimeout(() => {
                this.getTableData();
              }, 200);
            } else {
              this.$notify({
                message: res.data.msgView,
                type: 'warning'
              });
            }
          }).catch(err => {
            console.log(err)
          })
        })
      },
      // 用户模糊搜索
      querySearchAsync(queryString) {
        if (queryString != '') {
          setTimeout(() => {
            this.loading = false;
            let list = [];
            var data = {
              findkey: queryString
            };
            API.userSelect(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              ;
              this.usrOptions = arr.map(item => {
                return {value: item.usrId, label: item.usrAlias};
              });
            })
          }, 300);
        }
      },
      handleSelect() {
        var states = [];
        var data = {};
        API.userSelect(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          }
          ;
          this.usrOptions = states.map(item => {
            return {value: item.usrId, label: item.usrAlias};
          });
        })
      },
      // --------------状态----------------
      updateStatusPool(row) {
        this.ShowPoolDlg = true;
        this.oAccountDlgData.secresId = row.id;
        this.oAccountDlgData.status = row.status;
        this.oAccountDlgData.stockCode = row.stockCode;
        this.oAccountDlgData.stockName = row.stockName
      },
      modifyStatusPool() {
        var data = {
          secresId: this.oAccountDlgData.secresId,
          status: this.oAccountDlgData.status == 1 ? 2 : 1,
        };
        API.poolStatus(data).then(res => {
          if (res.data.code === 'OK') {
            this.ShowPoolDlg = false;
            this.$notify({
              message: '修改成功',
              type: 'success'
            });
            setTimeout(() => {
              this.getTableData();
            }, 200);
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
      // ----------------查询---------
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
        this.stockCode = '';
        this.accountId = '';
        this.dateBegin = '';
        this.getTableData();
      },
      getTableData() {
        var data = {
          pageSize: this.pageConfig.pageSize,
          pageNumber: this.pageConfig.pageNumber,
          stockCode: this.stockCode.split(' ')[0],
          accountId: this.accountId,
          dateBegin: this.dateBegin,
        };
        this.bTableLoading = true;
        API.publicPool(data).then(res => {
          this.bTableLoading = false;
          this.aTableData = res.data.data.list;
          this.pageConfig.pageSize = res.data.data.pageSize;
          this.pageConfig.totalRow = res.data.data.totalRow;
          this.pageConfig.totalPage = res.data.data.totalPage;
        })
      },
      allocStocks() {
        var data = {
          stockData: JSON.stringify(this.stockData)
        };
        API.allocStockBatch(data).then(res => {
          if (res.data == 'success') {
            this.ShowDataPool = false;
            this.$notify({
              message: '分配成功',
              type: 'success'
            });
            setTimeout(() => {
              this.getTableData();
            }, 200);
          }
          else if (res == 'error') {
            this.$notify({
              message: '分配失败',
              type: 'warning'
            });
          }
          else {
            this.$notify({
              message: res.data,
              type: 'warning'
            });
          }
        })
      },

      setValue(sidx, tidx, e) {
        this.stockData[sidx].traderBeans[tidx].traderVolume = e;
      },
    },
    created() {
      this.getTableData();
    },
  }
</script>

<style scoped>
  .chargerForm .el-form-item {
    margin-bottom: 0px;
  }

  .el_form_input {
    width: 240px;
  }

  .el-button.el-button--text.el-button--small {
    padding: 0px !important;
  }

  .el-input-number {
    width: 240px !important;
    line-height: 30px;
  }

  .fontSize {
    font-size: 16px;
    font-weight: bold;
  }

  .fontSmallSize {
    font-size: 5px;
    font-weight: bold;
  }

  .width145 {
    margin-right: 10px;
  }

  .bg-remark {
    background-color: rgba(18, 206, 102, 0.1);
    border-color: rgba(18, 206, 102, 0.2);
    color: #080;
    border: 1px solid transparent;
    border-radius: 4px;
    line-height: 30px;
    padding: 0px 20px;
    width: 500px;
    font-size: 12px;
    margin: 30px auto 0;
  }

  .caption {
    color: #666;
  }

  .download {
    position: absolute;
    left: 490px;
    top: 70px;
  }

  .textAlign {
    text-align: center;
  }
</style>
