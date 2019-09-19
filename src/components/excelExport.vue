<template>
  <div class="zy-toChannel zy-excelExport">
    <el-dialog :title="dlgTitle" :visible.sync="isCloed" custom-class="width1132 " :close-on-press-escape="false" :close-on-click-modal="false">
        <div class="h500" v-loading="exportLoading">
            <div style="position: relative;">     
                <el-upload
                    class="upload-demo" align="center" 
                    name="excel"
                    :data="prodData"
                    :action="API.import"
                    :show-file-list="false"
                    ref="upload"
                    :on-change="addFile"
                    > 
                    <el-button size="small" type="primary" >选择文件</el-button> 
                </el-upload>
                <p class="message-tip" v-if="!isExportOk"><i class="el-icon-information marginR5"></i>{{message}}</p>
            </div>
            <div v-if="tableData.length>0"  class=" marginT20 el-table el-table--fit el-table--striped  el-table--enable-row-transition">
                <div class="flex-box excel-export-conter width1096 position-re">
                    <div id="scrollTead" class="el-table__body-wrapper width811 flex-item over-hidden">
                        <table cellspacing="0" cellpadding="1" border="0" class="el-table__body el-table__header" style="width: 100%">
                            <thead>
                                <tr>
                                    <th colspan="1" rowspan="1" class="is-center is-leaf" :style="{width:60+'px'}">
                                        <div class="cell">序号</div>
                                    </th> 
                                    <th colspan="1" rowspan="1" class="is-center is-leaf" :key="index" v-for="(data, index) in tableColumn" :style="{width:data.setWidth+'px'}">
                                        <div class="cell">{{data.name}}</div>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div class="el-table__body-wrapper width200 border-shadow">
                        <table cellspacing="0" cellpadding="1" border="0" class="el-table__body el-table__header" style="width: 100%">
                            <thead>
                                <tr>
                                    <th colspan="1" rowspan="1" class="is-center is-leaf" :style="{width:60+'px'}">
                                        <div class="cell">校验</div>
                                    </th> 
                                    <th colspan="1" rowspan="1" class="is-center is-leaf" :style="{width:60+'px'}">
                                        <div class="cell">导入</div>
                                    </th>
                                    <th colspan="1" rowspan="1" class="is-center is-leaf" :style="{width:60+'px'}">
                                        <div class="cell">操作</div>
                                    </th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
                <div id="scrolldIV" class="h450 marginTb33">
                    <div class="flex-box excel-export-conter width1096 ">
                        <div id="scrollTbody" class="el-table__body-wrapper width811 flex-item">
                            <table cellspacing="0" cellpadding="1" border="0" class="el-table__body el-table__header" style="width: 100%">
                                <thead>
                                    <tr>
                                        <th colspan="1" rowspan="1" class="is-center is-leaf" :style="{width:60+'px'}">
                                            <div class="cell">序号</div>
                                        </th> 
                                        <th colspan="1" rowspan="1" class="is-center is-leaf" :key="index" v-for="(data, index) in tableColumn" :style="{width:data.setWidth+'px'}">
                                            <div class="cell">{{data.name}}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="el-table__row height33"  :key="index" v-for="(data, index) in tableData" >
                                        <td class="is-center">
                                            <div class="cell ellipsis" :class="{'error-tr':typeList[index] == '添加失败','sucess-tr hangdle-disabled':typeList[index] == '添加成功','opacity30':overlookList[index]}">{{data.number+1}}</div>
                                        </td>
                                        <td class="is-center" :key="item.code" v-for="item in tableColumn">
                                            <div class="cell ellipsis" :class="{'error-tr':typeList[index] == '添加失败','sucess-tr hangdle-disabled':typeList[index] == '添加成功','opacity30':overlookList[index]}">
                                                <span v-if="!item.isEdit">{{data[item.code]}}</span>
                                                <el-input v-if="item.isEdit" class="widthM100"  type="text" v-model="data[item.code]" size="small"></el-input>
                                            </div>
                                        </td>    
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="el-table__body-wrapper width200 border-shadow">
                            <table cellspacing="0" cellpadding="1" border="0" class="el-table__body el-table__header" style="width: 100%">
                                <thead>
                                    <tr>    
                                        <th colspan="1" rowspan="1" class="is-center is-leaf" :style="{width:60+'px'}">
                                            <div class="cell">校验</div>
                                        </th> 
                                        <th colspan="1" rowspan="1" class="is-center is-leaf" :style="{width:60+'px'}">
                                            <div class="cell">导入</div>
                                        </th>
                                        <th colspan="1" rowspan="1" class="is-center is-leaf" :style="{width:60+'px'}">
                                            <div class="cell">操作</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="el-table__row height33" :key="index" v-for="(data, index) in tableData" >
                                        <td class="is-center" style="padding:9px 0 10px;" >
                                            <div class="cell ellipsis">
                                                <el-tooltip placement="right" effect="light">
                                                    <div slot="content">{{analyzeType[index].describe}}</div>
                                                    <span class="colorRe4"><i v-if="analyzeType[index].verify==false" class="fa fa-times-circle fontSize18"></i></span>
                                                </el-tooltip>
                                                <span v-if="verifyType[index] == '校验合格'" class="sucess-span"><i class="fa fa-check-square-o fontSize18"></i></span>
                                                <span v-else-if="verifyType[index] == '校验中'">
                                                    <img src="/static/themes/theme1/image/loding2.gif"  style="width:20px;height:20px" />
                                                </span>
                                                <el-tooltip placement="right" effect="light" v-else>
                                                    <div slot="content">{{verifyType[index]}}</div>
                                                    <span class="colorRe4"><i v-if="verifyType[index]!=''" class="fa fa-times-circle fontSize18"></i></span>
                                                </el-tooltip>
                                            </div>
                                        </td>
                                        <td class="is-center" style="padding:9px 0 10px;">
                                            <div class="cell ellipsis">
                                                <span v-if="typeList[index] == '添加成功'" class="sucess-span"><i class="fa fa-check-square-o fontSize18"></i></span>
                                                <span v-else-if="typeList[index] == '添加中'">
                                                    <img src="/static/themes/theme1/image/loding2.gif"  style="width:20px;height:20px" />
                                                </span>
                                                <span v-else-if="typeList[index] == '添加失败'" class="error-span"><i class="fa fa-times-circle fontSize18"></i></span>
                                                
                                                <el-tooltip placement="right" effect="light" v-else>
                                                    <div slot="content">{{typeList[index]}}</div>
                                                    <span class="colorRe4"><i v-if="typeList[index]!=''" class="fa fa-times-circle fontSize18"></i></span>
                                                </el-tooltip>
                                            </div>
                                        </td>  
                                        <td class="is-center" style="padding:9px 0 10px;">
                                            <div class="cell ellipsis recover">
                                                <el-button v-if="!overlookList[index]" size="small" type="text" @click="changeOverlook(true,index)">忽略</el-button>
                                                <el-button v-if="overlookList[index]"  size="small" type="text" class="recoverButton" @click="changeOverlook(false,index)">恢复</el-button>
                                            </div>
                                        </td>                             
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="tableData.length<=0" >
                <div class="export-hint">
                    <p>导入提示：</p>
                    <div>
                        <div v-for="messg in exportHint" :key="messg">{{messg}}</div>
                        <!--1.单次最多导入1000条数据</br>
                        2.证件号，手机号，电子邮箱至少提供一个</br>
                        3.客户类型未提供时默认为机构类型</br>
                        4.如果提供证件号请选择证件类型，否则可能导致导入数据不准确</br>
                        5.客户类型为自然人，证件类型为身份证时，会根据身份证号自动解析生日与性别-->
                        
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer height35" v-if="tableData.length>0">
            <!--<el-button @click="isCloed = false">取 消</el-button>-->
            <div class="bg-remark floatL" v-if="dlgTips">
                <span class="caption floatL">重要提示：</span>
                <span class="floatL">{{dlgTips}}</span>
            </div>
            <el-button class="floatR marginL10" type="primary" size="small" :title="VerifyDescrip"  @click="upsertList" :disabled="issubmit || isAdd || isVerify">启动导入</el-button>
            <el-button class="floatR" type="primary" size="small" @click="verifyData" :disabled="isVerify || issubmit">开始校验</el-button>
            <div class="result-message floatR">
                <span class="floatL">表中共&nbsp; <span>{{tableData.length}}</span> &nbsp;条数据，
                校验合格&nbsp;<span class="colorG">{{verifyNum}}</span>&nbsp;条，
                校验不合格&nbsp;<span class="colorR">{{VerifyBelowNum}}</span>&nbsp;条，
                成功导入&nbsp; <span class="colorG">{{exportSucess}}</span> &nbsp;条！</span>
            </div>
        </div>
    </el-dialog>
  </div>
</template>
<style scoped>
    .marginTb33{
        margin-top: -33px!important;
    }
    .width1096{
        width:1096px;
    }
    .position-re{
        position:relative;
        z-index:999;
    }
    .over-hidden{
        overflow: hidden!important;
    }
    .setStyle{
        width:30%;
        margin:0 auto;
    }
    .h500{
        overflow-y:auto;
        max-height:530px
    }
    .h450{
        overflow-y:auto;
        max-height:360px
    }
    .widthM100{
        min-width:100px;
    }
    .bg-remark{
        background-color: rgba(18, 206, 102, 0.1);
        border-color: rgba(18, 206, 102, 0.2);
        color: #080;
        border: 1px solid transparent;
        border-radius: 4px;
        line-height: 30px;
        padding: 0px 12px;
        min-width: 260px;
        font-size:12px;
        overflow: hidden;
    }
    .caption{
        color: #666;
    }
    .colorG{
        color: #080;
    }
    .text-left{
        text-align: left;
    }
    .height33 {
        height: 33px !important;
    }
    .height35 {
        height: 35px !important;
    }
    .width811{
        width:914px!important;
        overflow:auto;
    }
    .width100{
        width:101px!important;
    }
    .width200{
        width:181px!important;
    }
    .flex-item{
        flex:1;
    }
    .hangdle-disabled{
        pointer-events: none;
        /*cursor: default;*/
        /*opacity: 0.5;*/
    }
    .opacity30{
        opacity:0.3!important;
    }
    .border-shadow{
        border-left:1px solid #d3d4d6;
        box-shadow: -1px 0 8px #d3d4d6;
    }
    .download{
        position: absolute;
        left: 610px;
        top: 6px;
    }
    .message-tip{
        display: inline;
        position: absolute;
        left: 670px;
        top: 6px;
        color: #f7ba2a;
        font-size: 12px;
    }
    .result-message{
        color: #1f2c3c!important;
        font-size: 12px;
        line-height: 30px;
        background-color: rgba(243, 243, 243, 1);
        border-radius: 4px 4px 4px 4px;
        border: solid 1px rgba(216, 229, 242, 1);
        padding: 0 18px 0 11px;
    }
    .export-hint{
        display: flex;
        background-color: rgba(231, 250, 239, 1);
        border-radius: 4px 4px 4px 4px;
        width: 600px;
        margin-left: 259px;
        margin-top: 16px;
        padding: 22px 20px 25px 34px;
        line-height: 24px;
    }
    .export-hint p{
        width:60px;
        margin-right:13px;
        color:#666;
        font-size: 12px;
    }
    .export-hint div{
        width:473px;
        color:#278a00;
        font-size: 12px;
    }
</style>
<script>
// import API from './api.js'
import utils from '@/lib/utils.js'
import { Compact } from 'vue-color'
export default {
    components: {
        'compact-picker': Compact
    },
    props:{
        isshow: {   //显示弹窗控制
            type: Boolean,
            default: false
        },
        dlgTitle: {   //显示标题
            type: String,
            default: ''
        },
        dlgTips: {   //重要提示
            type: String,
            default: ''
        },
        exportHint:{   //导入提示提示
            type: Array,
            default: function(){return []}
        },
        API: {  //显示接口
            type: Object,
            default: function(){return {}}
        },
        tableColumn: {  //表格字段
            type: Array,
            default: function(){return []}
        },
        productUser:{   //产品Id
            type: String,
            default: ''
        },
        orgzId:{   //机构Id
            type: String,
            default: ''
        },
        isRepetition:{   //是否做重复校验
            type: Boolean,
            default: false
        },
        rectFunction:{
            type: Function,
            default: function(){return []}
        },
        prodProp:{   //机构Id
            type: String,
            default: ''
        },
        
    },
    computed:{
        isAdd() {      // 能否启动导入
            var isOver=true, //是否全部忽略
                isTrue=false;//是否有校验不通过且没忽略的或者导入过了且没忽略的
            this.sucessData.forEach((item,index)=>{
                if((!item.verify && !this.overlookList[index]) || (this.typeList[index]=='添加成功' && !this.overlookList[index])){
                    isTrue=true;
                }
            });
            this.overlookList.forEach((item)=>{
                if(!item){
                    isOver = false;
                }
            });
            return isTrue || isOver;
        },
        exportSucess(){  //成功导入数
            var num = 0;
            this.typeList.forEach((item)=>{
                if(item=='添加成功'){
                    num++;
                }
            });
            return num;
        },
        verifyNum(){  //校验合格数
            var num = 0;
            this.verifyType.forEach((item)=>{
                if(item=='校验合格'){
                    num++;
                }
            });
            return num;
        },
        VerifyBelowNum(){ //校验不合格数
            var num=0;
            this.verifyType.forEach((item)=>{
                if(item!='校验合格' && item!=""){
                    num++;
                }
            });
            return num;
        },
    },
    data(){
        return{
            isCloed:false,          //弹窗是否显示
            exportLoading:false,  //excel解析中
            isExportOk:true,      //导入文件是否能解析
            message:'',           //导入文件不能解析提示
            tableData:[],         //excel解析数据
            sucessData:[],        //excel解析合格的数据
            typeList:[],          //导入状态
            verifyType:[],          //校验状态
            analyzeType:[],         //解析状态
            issubmit:false,       //提交中
            isVerify:false,         //校验中
            isDisabled:false,
            prodData:{ffundId:this.productUser,orgzId:this.orgzId,dealType:this.prodProp},
            overlookList:[],     //忽略、恢复控制
            VerifyDescrip:'',  //启动添加提示
        }
    },
    methods: {
        addFile(file,fileList){  //导入
            this.exportLoading=true;
            fileList.length > 1 ? fileList.splice(0, 1) : '';
            if (file.response) {
                this.$refs.upload.clearFiles();
                if (file.response.code === 'OK') {
                    this.isExportOk=true;
                    this.tableData=file.response.data;
                    this.typeList=[];
                    this.verifyType=[];
                    this.analyzeType=[];
                    this.sucessData=[];
                    this.overlookList=[];
                    this.tableData.forEach((item,index)=>{
                        item.number=index;
                        this.typeList.push('');
                        this.verifyType.push('');
                        this.sucessData.push('');
                        this.overlookList.push(false);
                        var obj={
                            verify:true,
                            describe:'',
                        }
                        if(!item.verify){
                            obj.verify=item.verify;
                            obj.describe=item.describe;
                        }
                        this.analyzeType.push(obj)
                    });
                    this.exportLoading=false;
                    this.$nextTick(function () {
                        var Tbody = document.getElementById('scrollTbody');
                        // console.log(Tbody);
                        Tbody.addEventListener("scroll", ()=>{
                            var el = document.getElementById('scrollTbody');
                            var tead = document.getElementById('scrollTead');
                            tead.scrollLeft= el.scrollLeft;
                            // console.log(tead.scrollLeft);
                        });
                        // div.scrollTop = (selectIndex-10)*33;
                    });
                } else {
                    // this.$notify({
                    //     type: 'warning',
                    //     message: file.response.msgView,
                    // });
                    this.tableData=[];
                    this.message= file.response.msgView;
                    this.isExportOk=false;
                    this.exportLoading=false;
                }
            }
        },
        upsertList(){         //开始导入
            var self = this;
            this.issubmit = true;
            var arr1 = JSON.parse(JSON.stringify(self.sucessData)),arr=[];
            arr1.forEach((item,index)=>{
                if(item.verify && !self.overlookList[index] && self.typeList[index]!='添加成功'){
                    arr.push(item);
                }
            });
            if(arr.length>0){
                addMapp(arr);
            }else{
                this.issubmit = false;
            }
            function addMapp(ar){   
                if(!self.isCloed){
                    return false;
                }
                let selectIndex = ar[0].number;
                self.typeList.splice(selectIndex,1,'添加中');
                self.API.addAdviser(ar[0]).then((res)=>{
                    if (res.data.code == 'OK') {
                        self.typeList.splice(selectIndex,1,'添加成功');
                        ar.shift();
                        if(ar.length>=1){
                            setTimeout(()=>{
                                addMapp(ar);
                                if(selectIndex>10){
                                    var div = document.getElementById('scrolldIV');
                                    div.scrollTop = (selectIndex-10)*33;
                                }else{
                                    var div = document.getElementById('scrolldIV');
                                    div.scrollTop = 0;
                                }
                            },100);
                        }else{
                            self.issubmit = false;
                            var div = document.getElementById('scrolldIV');
                            div.scrollTop = 0;
                            self.$message({
                                showClose: true,
                                message: '表中共'+self.tableData.length+'条数据，校验合格'+self.verifyNum+'条，成功导入'+self.exportSucess+'条！',
                                type: 'success'
                            });
                        }
                    } else {
                        self.typeList.splice(selectIndex,1,res.data.msgView);
                        ar.shift();
                        if(ar.length>=1){
                            setTimeout(()=>{
                                addMapp(ar);
                                if(selectIndex>10){
                                    var div = document.getElementById('scrolldIV');
                                    div.scrollTop = (selectIndex-10)*33;
                                }else{
                                    var div = document.getElementById('scrolldIV');
                                    div.scrollTop = 0;
                                }
                            },100);
                        }else{
                            self.issubmit = false;
                            var div = document.getElementById('scrolldIV');
                            div.scrollTop = 0;
                            self.$message({
                                showClose: true,
                                message: '表中共'+self.tableData.length+'条数据，校验合格'+self.verifyNum+'条，成功导入'+self.exportSucess+'条！',
                                type: 'success'
                            });
                        }
                    }
                })
            }   
        },
        allertAccount(){ //删除用户
            this.$confirm('请选择校验用户！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                
            }).catch(() => {
            });
        },
        verifyData(){         //开始批量校验
            var numTrue=true;
            this.overlookList.forEach((v,k)=>{
                if(v==false){
                    numTrue=false;
                }
            })
            if(numTrue){
                this.allertAccount();
                return;
            }

            var self = this;
            this.isVerify = true;
            var arr = JSON.parse(JSON.stringify(this.tableData));
            self.analyzeType.forEach(item=>{
                item.verify=true;
            })
            if(this.isRepetition){
                var fileform = new FormData();
                fileform.append("allData", JSON.stringify(this.tableData));
                self.API.verifyAll(fileform).then((res)=>{            //整体校验（重复性、格式等）
                    if(res.data.code == 'OK'){
                        var isTrue = true, arr3=[],num=0;
                        res.data.data.forEach((item)=>{
                            if(!item.verify){
                                isTrue=false;
                                num++;
                            }
                            arr3.push(item.describe);
                        });
                        if(isTrue){
                            // this.sucessData =[];
                            var arr2=[];
                            arr.forEach((item,index)=>{
                                if(!item.lose && self.typeList[index]!='添加成功'){
                                    arr2.push(item);
                                }
                            });
                            if(arr2.length>0){
                                verifyItem(arr2);
                            }else{
                                this.isVerify = false;
                            }
                        }else{
                            this.tableData=res.data.data;
                            this.sucessData =res.data.data;
                            this.verifyType=arr3;
                            this.isVerify = false;
                            this.$notify({
                                type: 'warning',
                                message: '有'+num+'条数据格式出错或者有重复！',
                            });
                        }
                    }
                });
            }else{
                var arr2=[];
                arr.forEach((item,index)=>{
                    if(!item.lose && self.typeList[index]!='添加成功'){
                        arr2.push(item);
                    }
                });
                if(arr2.length>0){
                    verifyItem(arr2);
                }else{
                    this.isVerify = false;
                }
            }
            if(this.issubmit || this.isAdd){ //判断是否显示提示
                this.VerifyDescrip="请修复或忽略校验不合格数据";
            }else{
                this.VerifyDescrip="";
            }
            function verifyItem(ar){   //单条校验（数据库插入校验）
                if(!self.isCloed){
                    return false;
                }
                let selectIndex = ar[0].number;
                self.verifyType.splice(selectIndex,1,'校验中');
                self.API.verifyData(ar[0]).then((res)=>{
                    if (res.data.code == 'OK') {
                        if(res.data.data[0].verify){
                            self.verifyType.splice(selectIndex,1,'校验合格');
                            ar[0].verify = true;
                            self.sucessData.splice(selectIndex,1,ar[0]);
                        }else{
                            self.verifyType.splice(selectIndex,1,res.data.data[0].describe);
                            ar[0].verify = false;
                            self.sucessData.splice(selectIndex,1,ar[0]);
                        }
                        ar.shift();
                        if(ar.length>=1){
                            setTimeout(()=>{
                                verifyItem(ar);
                                if(selectIndex>10){
                                    var div = document.getElementById('scrolldIV');
                                    div.scrollTop = (selectIndex-10)*33;
                                }else{
                                    var div = document.getElementById('scrolldIV');
                                    div.scrollTop = 0;
                                }
                            },100);
                        }else{
                            self.isVerify = false;
                            var div = document.getElementById('scrolldIV');
                            div.scrollTop = 0;
                        }
                    } else {
                        self.verifyType.splice(selectIndex,1,'校验失败');
                        ar[0].verify = false;
                        self.sucessData.splice(selectIndex,1,ar[0]);
                        ar.shift();
                        if(ar.length>=1){
                            setTimeout(()=>{
                                verifyItem(ar);
                                if(selectIndex>10){
                                    var div = document.getElementById('scrolldIV');
                                    div.scrollTop = (selectIndex-10)*33;
                                }else{
                                    var div = document.getElementById('scrolldIV');
                                    div.scrollTop = 0;
                                }
                            },100);
                            
                        }else{
                            self.isVerify = false;
                            var div = document.getElementById('scrolldIV');
                            div.scrollTop = 0;
                        }
                    }
                })
            }   
        },
        changeOverlook(value,index){    //忽略、恢复
            this.overlookList.splice(index,1,value);
            this.tableData[index].lose = value;
            if(this.issubmit || this.isAdd){ //判断是否显示提示
                this.VerifyDescrip="请修复或忽略校验不合格数据";
            }else{       
                this.VerifyDescrip="";
            }
        },

    },
    watch: {
        isCloed: function (newValue, oldValue) {
            this.$emit('update:isshow', newValue)
        },
        isshow: function (newValue, oldValue) {
            if(newValue){
                this.isCloed = newValue;
                this.tableData=[];        //excel解析数据
                this.sucessData=[];        //校验合格的数据
                this.typeList=[];          //导入状态
                this.verifyType=[];          //校验状态
                this.issubmit=false;       //提交中
                this.isVerify=false;         //校验中
            }else{
                this.rectFunction();
            }
        },
    },
}
</script>