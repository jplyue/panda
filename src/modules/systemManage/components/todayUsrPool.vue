<template>
  <div>
    <el-row :gutter="10">
      <div :gutter="10" class="marginL10 floatL">
        <span class="fontSize13">用户：</span>
        <el-select v-model="usrId" class="width145"
                   remote clearable
                   filterable
                   @focus="c1"
                   @change="getTableData()"
                   :remote-method="remoteMethods1"
                   :loading="loading"
                   placeholder="用户信息">
          <el-option
            v-for="(item,index) in option1"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
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
      <el-button type="info" class="marginL10 marginT5" size="small" @click="exportAllocExcel">导出</el-button>
      <el-button type="info" class="marginL10 marginT5" size="small" @click="allocDelete">删除</el-button>

      <el-button type="primary" class="floatR marginR0 marginT5" size="small" @click="batchRevert">还原</el-button>
      <el-button type="primary" class="floatR marginR0 marginT5" size="small" @click="importInfor">导入</el-button>
      <el-tooltip content="继承上一交易日券池分配" placement="right" effect="light">
        <el-button type="primary" class="floatR marginR0 marginT5" size="small" @click="inherit">继承</el-button>
      </el-tooltip>
    </el-row>
    <el-row class="marginT10">
      <el-table v-loading="bTableLoading" :data="aTableData" border stripe @row-click="selectedRow"
                class="label6-hover">
        <el-table-column fixed label="选择" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            <label><input type="checkbox" id="checkbox" v-bind:checked="false"
                          @click="updateIds($event,scope.teamId)">点我丫</label>
          </template>
        </el-table-column>
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
        <el-table-column fixed label="用户标识" align="center" min-width="100px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.usrAlias === '' ? '--': scope.row.usrAlias}}
          </template>
        </el-table-column>
        <el-table-column label="分配日期" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.applyDate === '' ? '--': scope.row.applyDate}}
          </template>
        </el-table-column>
        <el-table-column label="分配市值" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.secresMktValue === '' ? '--': scope.row.secresMktValue|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="分配股数" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.secresVolume === '' ? '--': scope.row.secresVolume|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="已用股数" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.usedVolume === '' ? '--': scope.row.used.usedVolume|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="已用比率" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.usedRate === '' ? '--': (scope.row.usedRate*100).toFixed(2)}}%
          </template>
        </el-table-column>
        <el-table-column label="成交股数" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.dealVolume === '' ? '--': scope.row.used.dealVolume|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="成交比率" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.dealRate === '' ? '--': (scope.row.dealRate*100).toFixed(2)}}%
          </template>
        </el-table-column>
        <el-table-column label="普通买入(分配)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.standBuyVolume === '' ? '--': scope.row.standBuyVolume|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="普通卖出(分配)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.standSaleVolume === '' ? '--': scope.row.standSaleVolume|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="融资买入(分配)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.marginBuyVolume === '' ? '--': scope.row.marginBuyVolume|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="融券卖出(分配)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.marginSaleVolume === '' ? '--': scope.row.marginSaleVolume|formatMoney}}
          </template>
        </el-table-column>

        <el-table-column label="普通买入(使用)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.dealVolumeStandBuy === '' ? '--': scope.row.used.dealVolumeStandBuy|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="普通卖出(使用)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.dealVolumeStandSale === '' ? '--': scope.row.used.dealVolumeStandSale|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="融资买入(使用)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.dealVolumeMarginBuy === '' ? '--': scope.row.used.dealVolumeMarginBuy|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="融券卖出(使用)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.dealVolumeMarginSale === '' ? '--': scope.row.used.dealVolumeMarginSale|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="普通买入(可用)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.volumeStandBuy === '' ? '--': scope.row.used.volumeStandBuy|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="普通卖出(可用)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.volumeStandSale === '' ? '--': scope.row.used.volumeStandSale|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="融资买入(可用)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.volumeMarginBuy === '' ? '--': scope.row.used.volumeMarginBuy|formatMoney}}
          </template>
        </el-table-column>
        <el-table-column label="融券卖出(可用)" align="center" min-width="120px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.used.volumeMarginSale === '' ? '--': scope.row.used.volumeMarginSale|formatMoney}}
          </template>
        </el-table-column>

        <el-table-column label="最新消息" align="center" min-width="140px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.latMessage === '' ? '--': scope.row.latMessage}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" min-width="150px" :resizable="false">
          <template slot-scope="scope">
            {{scope.row.updateTime === '' ? '--': scope.row.updateTime|ellipsis(19)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="状态" align="center" width="100px" :resizable="false">
          <template slot-scope="scope">
            <div v-show="scope.row.status == 1">
              <span class="success">{{scope.row.status === '' ? '--': '授权正常'}}</span>
            </div>
            <div v-show="scope.row.status == 2">
              <span class="fail">{{scope.row.status === '' ? '--': '授权禁用'}}</span>
            </div>
            <div v-show="scope.row.status == 4">
              <span class="fail">{{scope.row.status === '' ? '--': '资源禁用'}}</span>
            </div>
            <div v-show="scope.row.status == 8">
              <span class="fail">{{scope.row.status === '' ? '--': '资源过期'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" min-width="140px" :resizable="false">
          <template slot-scope="scope">
                    <span v-show="scope.row.status == 1">
                        <el-button size="small" type="text" :disabled="false" @click="updatePool(scope.row)">{{scope.row.status == 1 ? '禁用' : '启用'}}</el-button>
                    </span>
            <span v-show="scope.row.status == 2">
                        <el-button size="small" type="text" :disabled="false" @click="updatePool(scope.row)">{{scope.row.status == 2 ? '启用' : '禁用'}}</el-button>
                    </span>
            <span v-show="scope.row.status == 4">
                        <el-button size="small" type="text" :disabled="true" @click="updatePool(scope.row)">{{scope.row.status == 4 ? '启用' : '禁用'}}</el-button>
                    </span>
            <span v-show="scope.row.status == 8">
                        <el-button size="small" type="text" :disabled="true" @click="updatePool(scope.row)">{{scope.row.status == 8 ? '启用' : '禁用'}}</el-button>
                    </span>
            <el-button size="small" type="text" :disabled="scope.row.status == 1 ? false : true"
                       @click="allotPool(scope.row)">分配
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
      </el-pagination>
      <el-dialog title="修改状态" :visible.sync="ShowPoolDlg" :modal="true" custom-class="width450"
                 :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form label-width="100px" :model="oPoolDlgData" :inline="true" class="chargerForm">
          <el-form-item label=" ">
            <span class="fontSzie16">股票信息：{{oPoolDlgData.stockCode}}{{oPoolDlgData.stockName}}</span>
          </el-form-item>
          <el-form-item label=" ">
            确认要{{oPoolDlgData.status == 1 ? '禁用' : '启用'}}此条数据吗？
          </el-form-item>
        </el-form>
        <span slot="footer">
                    <el-button @click="ShowPoolDlg = false">取 消</el-button>
                    <el-button type="primary" @click="modifyPoolStatus">确 认</el-button>
                </span>
      </el-dialog>
      <el-dialog title="用户券池-分配" :visible.sync="ShowAllotDlg" :modal="true" custom-class="width450"
                 :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form label-width="100px" :model="oAllotDlgData" ref="oAllotDlgForm" :rules="rules" :inline="true">
          <el-form-item label="资源日期：" class="fontSize">
            <span>{{oAllotDlgData.applyDate}}</span>
          </el-form-item>
          <br>
          <el-form-item label="股票信息：" class="fontSize">
            <span class="">{{oAllotDlgData.stockCode}}--{{oAllotDlgData.stockName}}</span>
          </el-form-item>
          <br>
          <el-form-item label="券源总数：" class="fontSize">
            <span class="">{{oAllotDlgData.secresVolume|formatMoney}}</span>
          </el-form-item>
          <el-form-item label="券源可用：" class="fontSize">
            <span class="">{{oAllotDlgData.idleVolume|formatMoney}}</span>
          </el-form-item>
          <br>
          <el-form-item label="用户信息：" class="fontSize">
            <span class="">{{oAllotDlgData.usrAlias}}</span>
          </el-form-item>
          <br>
          <el-form-item label="当前分配：" class="fontSize">
            <span class="">{{oAllotDlgData.secresVolume2|formatMoney}}</span>
          </el-form-item>
          <br>
          <el-form-item label="调整数量：" prop="adjustVolume">
            <el-input-number v-model.number="oAllotDlgData.adjustVolume" :min="0"
                             :max="Number(this.oAllotDlgData.idleVolume+this.oAllotDlgData.secresVolume2)"
                             :step="100"></el-input-number>&emsp;
            <span v-if="this.direct == 1" class="red">+{{(this.oAllotDlgData.adjustVolume - this.oAllotDlgData.secresVolume2)}}</span>
            <span v-if="this.direct == 2" class="green">{{(this.oAllotDlgData.adjustVolume - this.oAllotDlgData.secresVolume2)}}</span>
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
      <el-dialog title="继承" :visible.sync="showInherit" :modal="true" custom-class="width450"
                 :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form label-width="100px" :inline="true" :model="inheritData" ref="inheritForm">
          <el-form-item label="账户信息：" prop="accountId">
            <el-select v-model="inheritData.accountId" clearable
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
          </el-form-item>
          <el-form-item label="用户信息：" prop="usrId">
            <el-select v-model="inheritData.usrId"
                       remote clearable
                       filterable
                       @focus="c1"
                       @change="getTableData()"
                       :remote-method="remoteMethods1"
                       :loading="loading"
                       placeholder="用户信息">
              <el-option
                v-for="(item,index) in option1"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="股票信息：" prop="stockCode">
            <el-select v-model="inheritData.stockCode" clearable
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
          </el-form-item>
        </el-form>
        <span slot="footer">
                <el-button size="small" @click="showInherit = false">取 消</el-button>
                <el-button size="small" type="primary" @click="makeInherit">确定</el-button>
            </span>
      </el-dialog>

      <!--
      <el-dialog title="批量删除" :visible.sync="isDeleteAlloc" :modal="true" custom-class="width450"
                 :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form label-width="100px" :inline="true" class="chargerForm">
          <el-form-item label=" ">
            确认要删除当日分券数据吗？
          </el-form-item>
        </el-form>
        <span slot="footer">
                    <el-button @click="isDeleteAlloc = false">取 消</el-button>
                    <el-button type="primary" @click="allocBatchDelete">确 认</el-button>
                </span>
      </el-dialog>-->

      <el-dialog title="风控报单" :visible.sync="showControlEntry" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form label-width="100px" :inline="true" :rules="entryRules" :model="controlEntryData" ref="controlEntryForm">
          <el-form-item label="账户信息：" prop="accountId" class="marginB10">
            <el-select v-model="controlEntryData.accountId" clearable
                       remote
                       filterable
                       @focus="tt2"
                       :remote-method="remoteMethod2"
                       :loading="loading"
                       placeholder="账户信息">
              <el-option
                v-for="(item,index) in options2"
                :key="index"
                :label = "item.label"
                :value = "item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户信息：" prop="" class="marginB10">
            <el-select v-model="controlEntryData.usrId"
                       remote clearable
                       filterable
                       @focus="c1"
                       :remote-method="remoteMethods1"
                       :loading="loading"
                       placeholder="用户信息">
              <el-option
                v-for="(item,index) in option1"
                :key="index"
                :label = "item.label"
                :value = "item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="股票信息：" prop="stockCode" class="marginB10">
            <el-select v-model="controlEntryData.stockCode"  clearable
                       remote
                       filterable
                       :remote-method="querySearchAsync2"
                       :loading="loading"
                       @focus="query"
                       @change="nowPrice()"
                       placeholder="股票信息">
              <el-option
                v-for="(item,index) in stocOptions"
                :key="index"
                :label = "item.label"
                :value = "item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="委托类型：" prop="select">
            <el-select v-model="controlEntryData.select" placeholder="委托类型" clearable class="width240" size="small">
              <el-option
                v-for="item in selects"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="持仓数量：" prop="volume">
            <el-input-number v-model="controlEntryData.volume" :min="100" :step="100"></el-input-number>
          </el-form-item>
          <el-form-item label="委托价格：" prop="entryPrice">
            <el-input v-model="controlEntryData.entryPrice" class="width120"></el-input>
            <el-button type="primary" size="mini" class="" @click="highLimit">涨停价</el-button>
            <el-button type="primary" size="mini" class="" @click="fallStop">跌停价</el-button>
            <el-button type="success" size="mini" class="" @click="nowPrice">现价</el-button>
          </el-form-item>

        </el-form>
        <span slot="footer">
                <el-button size="small" @click="showControlEntry = false">取 消</el-button>
                <el-button size="small" type="primary" @click="makeControlEntry">报单</el-button>
            </span>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import API from '../api.js';
  import utils from '@/lib/utils.js';
  import axios from 'axios';

  export default {
    data() {
      var newReg2 = (rule, value, callback) => {
        if (value < 0) {
          callback(new Error("不能为负数"));
        } else if (value % 100 !== 0) {
          callback(new Error("只能是100的整数倍"))
        } else if (value > this.oAllotDlgData.idleVolume + this.oAllotDlgData.secresVolume2) {
          callback(new Error('不可大于可用数量'))
        } else {
          callback();  //必须要有回调，要不然表单无法提交
        }
      };
      return {
        stockCode: '',            //股票信息
        stocOptions: [],           //股票信息筛选器
        accountId: '', //交易账户
        options2: [], //账户列表
        loading: false,
        usrId: '',            //用户信息
        option1: [],         // 用户列表
        aTableData: [],          //表格数据
        bTableLoading: false,    //表格数据是否在加载中
        oCurrRowData: {},        //当前行
        pageConfig: {           //分页数据
          pageNumber: 1,      //当前页
          pageSize: 10,       //每页数量
          totalPage: 0,       //总页数
          totalRow: 0         //总条数
        },
        ShowPoolDlg: false,//状态
        oPoolDlgData: {
          status: '',
          allocId: '',
          stockCode: '',
          stockName: '',
        },

        // 风控报单
        showControlEntry:false,
        controlEntryData:{
          accountId:'',
          usrId:'',
          stockCode:'',
          select:'1', //委托类型
          volume:'0',
          entryPrice:'',//价格
        },

        ShowAllotDlg: false,//分配
        oAllotDlgData: {
          usrId: '',//用户id
          secresId: "",//券源id
          resId: '',
          applyDate: "",
          usrAlias: '',
          stockCode: '',
          stockName: '',
          idleVolume: "",//券源可用
          secresVolume: '',//券源总数
          secresVolume2: '',//当前分配
          adjustVolume: '',//调整数量
          description: '',
        },
        direct: '',//调整数量提示颜色
        rules: {
          adjustVolume: [{required: true, message: '不能为空且只能是100的整数倍'}, {
            type: 'number',
            message: '只能为数字'
          }, {validator: newReg2}]
        },
        //----------条件-时间--------------
        dateBegin: '',  //时间筛选--开始时间
        // ----------------导入----------
        isExportShow: false,//excel导入弹窗
        // ---------------继承弹框---------
        showInherit: false,
        isDeleteAlloc: false,
        inheritData: {
          accountId: '',//账户id
          usrId: '',//用户id
          stockCode: '',//股票信息
        },
      }
    },
    watch: {
      dateBegin: function (newValue, oldValue) {   //净值周期改变
        if (oldValue != '' && typeof newValue === 'string' && newValue != oldValue) {
          this.getTableData();
        }
      },
      adjustVolume: function (newValue, oldValue) {
        if (newValue != oldValue && (this.oAllotDlgData.adjustVolume - this.oAllotDlgData.secresVolume2 < 0)) {
          this.direct = 2
        }
      }
    },
    computed: {
      // 调整股票数量信息
      adjustVolume() {
        if (this.oAllotDlgData.adjustVolume - this.oAllotDlgData.secresVolume2 < 0) {
          this.direct = 2
        } else {
          this.direct = 1
        }
      }
    },
    methods: {

      // ------------报单---------
      riskControlEntry(){
        this.showControlEntry = true;
        this.controlEntryData.usrId = '';
        this.$refs.controlEntryForm ? this.$refs.controlEntryForm.resetFields() : '';
      },
      //
      makeControlEntry(){
        this.$refs.controlEntryForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          var data = {
            usrId:this.controlEntryData.usrId,
            accountId:this.controlEntryData.accountId,
            select:this.controlEntryData.select,
            stockCode:this.controlEntryData.stockCode,
            price:this.controlEntryData.entryPrice,
            volume:this.controlEntryData.volume,
          }
          API.makeControlEntry(data).then(res => {
            if (res.data.success) {
              this.showControlEntry = false;
              this.$notify({
                message: res.data.msgView,
                type: 'success'
              });
              this.getTableData();
            }else{
              this.$notify({
                message: res.data.msgView,
                type: 'warning'
              });
            }
          })
        })
      },

      // -------------继承-------------------
      inherit() {
        this.showInherit = true;
        this.$refs.inheritForm ? this.$refs.inheritForm.resetFields() : '';
      },
      makeInherit() {
        if (this.inheritData.accountId == '' && this.inheritData.usrId == '' && this.inheritData.stockCode == '') {
          this.$notify({
            message: '账户信息/用户信息/股票信息必须至少提供一个',
            type: 'warning'
          });
          return false;
        }
        var data = {
          accountId: this.inheritData.accountId,
          usrId: this.inheritData.usrId,
          stockCode: this.inheritData.stockCode
        }
        API.makeInherit(data).then(res => {
          if (res.data.code === 'OK') {
            this.showInherit = false;
            this.$notify({
              message: res.data.msgView,
              type: 'success'
            });
          } else {
            this.$notify({
              message: res.data.msgView,
              type: 'warning'
            });
          }
        })
      },
      // -------------下载模板-------------------
      downloadExcel() {//点击下载模版
        utils.downloadFile('/api/heart/saas/march/services/prsday/secres/excel/template/alloc');
      },
      // ------------------导入-----------------
      importInfor() {
        this.isExportShow = true;
      },
      UploadUrl() {
        return '/api/heart/saas/march/services/prsday/secres/alloc/import'
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
      // 用户信息查询
      remoteMethods1(query) {
        if (query != '') {
          setTimeout(() => {
            this.loading = false;
            var data = {
              findkey: query
            };
            API.userSelect(data).then(res => {
              var arr = [];
              for (var i in res.data.data) {
                arr.push(res.data.data[i]);
              }
              ;
              this.option1 = arr.map(item => {
                return {value: item.usrId, label: item.usrAlias};
              });
            })
          }, 300);
        }
      },
      c1() {
        var states = [];
        var data = {};
        API.userSelect(data).then(res => {
          for (var i in res.data.data) {
            states.push(res.data.data[i]);
          }
          ;
          this.option1 = states.map(item => {
            return {value: item.usrId, label: item.usrAlias};
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
      // ---------------分配---------------
      allotPool(row) {
        this.ShowAllotDlg = true;
        this.$refs.oAllotDlgForm ? this.$refs.oAllotDlgForm.resetFields() : '';
        this.oAllotDlgData.resId = row.resId;
        this.oAllotDlgData.usrId = row.usrId;
        this.oAllotDlgData.secresId = row.resId;
        this.oAllotDlgData.usrAlias = row.usrAlias;
        this.oAllotDlgData.stockCode = row.stockCode;
        this.oAllotDlgData.stockName = row.stockName;
        this.oAllotDlgData.secresVolume2 = row.secresVolume;
        this.oAllotDlgData.adjustVolume = row.secresVolume;
        this.queryPool();
      },
      // -------------查询公共券池的信息----------
      queryPool() {
        var data = {
          secresId: this.oAllotDlgData.resId
        }
        API.todayPoolItem(data).then(res => {
          this.oAllotDlgData.secresVolume = res.data.data.secresVolume;
          this.oAllotDlgData.idleVolume = res.data.data.idleVolume;
          this.oAllotDlgData.applyDate = res.data.data.applyDate;
        }).catch(err => {
        })
      },
      // --------------分配=---------------
      modifyAllot() {
        this.$refs.oAllotDlgForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          var data = {
            usrId: this.oCurrRowData.usrId,
            secresId: this.oCurrRowData.resId,
            allocVolume: (this.oAllotDlgData.adjustVolume - this.oAllotDlgData.secresVolume2) > 0 ? (this.oAllotDlgData.adjustVolume - this.oAllotDlgData.secresVolume2) : (this.oAllotDlgData.secresVolume2 - this.oAllotDlgData.adjustVolume),
            direct: (this.oAllotDlgData.adjustVolume - this.oAllotDlgData.secresVolume2) > 0 ? 1 : 2,
            description: this.oAllotDlgData.description,
          }

          API.userAllot(data).then(res => {
            if (res.data.code === 'OK') {
              this.ShowAllotDlg = false;
              this.$notify({
                message: '分配成功',
                type: 'success'
              });
              setTimeout(() => {
                this.getTableData();
              }, 300);
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
      // --------------修改----------------
      updatePool(row) {
        this.ShowPoolDlg = true;
        this.oPoolDlgData.allocId = row.id;
        this.oPoolDlgData.status = row.status;
        this.oPoolDlgData.stockCode = row.stockCode;
        this.oPoolDlgData.stockName = row.stockName
      },
      modifyPoolStatus() {
        var data = {
          allocId: this.oPoolDlgData.allocId,
          status: this.oPoolDlgData.status == 1 ? 2 : 1,
        };
        API.userPoolStatus(data).then(res => {
          if (res.data.code === 'OK') {
            this.ShowPoolDlg = false;
            this.$notify({
              message: '修改成功',
              type: 'success'
            });
            setTimeout(() => {
              this.getTableData();
            }, 300);
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
        this.usrId = '';
        this.accountId = '';
        this.dateBegin = '';
        this.getTableData();
      },
      getTableData() {
        var data = {
          pageSize: this.pageConfig.pageSize,
          pageNumber: this.pageConfig.pageNumber,
          usrId: this.usrId,
          stockCode: this.stockCode.split(' ')[0],
          accountId: this.accountId,
          dateBegin: this.dateBegin,
        };
        this.bTableLoading = true;
        API.userPool(data).then(res => {
          this.bTableLoading = false;
          this.aTableData = res.data.data.list;
          this.pageConfig.pageSize = res.data.data.pageSize;
          this.pageConfig.totalRow = res.data.data.totalRow;
          this.pageConfig.totalPage = res.data.data.totalPage;
        })
      },

      exportAllocExcel() {
        this.bTableLoading = false;
        axios.get("/api/heart/saas/march/services/prsday/secres/exportAllocExcel?accountId=" + this.accountId + "&dateBegin=" + this.dateBegin + "&usrId=" + this.usrId + "&stockCode=" + this.stockCode, {responseType: 'blob'}).then(response => {
          this.download(response);
          this.bTableLoading = true;
        }).catch(error => {
          console.log(error);
        })
      },

      allocDelete() {
        this.isDeleteAlloc = true;
      },

      // ----批量删除批量分券----
      allocBatchDelete() {
        API.deleteBatchAlloc().then(res => {
          if (res.data == 'success') {
            this.ShowDataPool = false;
            this.$notify({
              message: '删除成功',
              type: 'success'
            });
            setTimeout(() => {
              this.getTableData();
            }, 200);
          }
          else {
            this.$notify({
              message: '删除失败',
              type: 'warning'
            });
          }
        })
      },

      updateIds(event, teamId) {
        if (event.target.checked) {
          // 如果为选中,加入selectIds
          this.selectIds.push(teamId);
        } else {
          // 否则移除
          var idx1 = this.selectIds.indexOf(teamId);
          this.selectIds.splice(idx1, 1);
        }
      },

      selectAll() {
        // 如果全选框为选中状态
        if (this.aTableData.length > 0) {
          for (var i = 0; i < this.aTableData.length; i++) {
            if (!this.aTableData[i].checked) {
              this.aTableData[i].checked = true
              this.selectIds.push(this.aTableData[i].teamId)
            } else {
              this.aTableData[i].checked = false
              var idx = this.selectIds.indexOf(this.aTableData[i].teamId);
              this.selectIds.splice(idx, 1);
            }
          }
        }
      },

      batchRevert() {
        var data = {
          checkTeamIds: JSON.stringify(this.selectIds)
        };
        API.revertBatch(data).then(res => {
          if (res.data) {
            this.$notify({
              message: '还原成功',
              type: 'success'
            });
          } else {
            this.$notify({
              message: '还原失败',
              type: 'warning'
            });
          }
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
        aLink.download = '用户券池分配.xls';
        aLink.href = url;
        //aLink.setAttribute("数据模版", "数据模版.xls");
        document.body.appendChild(aLink)
        aLink.click();
      }

    },



    created() {
      document.title = '用户券池';
      this.getTableData();
    },
  }
</script>

<style scoped>
  .success {
    display: block;
    width: 80px;
    margin: 0 auto;
    border-radius: 10px;
    background-color: #5faa2f;
    color: #fff;
  }

  .fail {
    display: block;
    width: 80px;
    margin: 0 auto;
    border-radius: 10px;
    background-color: #ed263e;
    color: #fff;
  }

  .wait {
    display: block;
    width: 80px;
    margin: 0 auto;
    border-radius: 10px;
    background-color: darkorange;
    color: #fff;
  }

  .primy {
    display: block;
    width: 80px;
    margin: 0 auto;
    border-radius: 10px;
    background-color: #A4DD00;
    color: #fff;
  }

  .red {
    color: #ed263e;
    font-weight: bold;
  }

  .green {
    color: #5faa2f;
    font-weight: bold;
  }

  .el-form-item {
    margin-bottom: 5px;
  }

  .el_form_input {
    width: 240px;
  }

  .el-input-number {
    width: 240px !important;
    line-height: 30px;
  }

  .fontSize {
    font-size: 16px;
    font-weight: bold;
  }

  .close {
    font-size: 14px;
    color: #909399;
    position: absolute;
    top: 9px;
    left: 605px;
    display: none;
    opacity: 0;
    cursor: pointer;
  }

  .close:hover {
    opacity: 1;
    transition: all .3s;
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
    left: 480px;
    top: 65px;
  }

</style>

