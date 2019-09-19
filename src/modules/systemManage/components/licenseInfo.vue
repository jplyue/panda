<template>
    <div class="zy-panel">
        <el-button class="floatR" type="primary" size="small" @click="bShowUpdate">修改</el-button>
        <div class="zy-member zy-panel marginT30">
            <el-form label-width="85px" :model="oLicenseData" ref="addDlgForm" :inline="false" label-position="left" class="marginT20">
                <div class="flex-box">
                    <div class="marginL80 marginR50 width200">
                        <el-row>
                            <div>
                                <el-form-item label="LOGO" prop="description" class="marginB0">
                                    <img v-if="logoImgPath" :src="'/staticapi'+ logoImgPath" class="avatar">
                                    <img v-else src="/static/themes/theme1/image/defaultInstitution.png" class="avatar">
                                </el-form-item>     
                            </div>
                            <div class="marginT20">
                                <el-form-item label="图标" prop="description" class="marginB0">
                                    <img v-if="iconImgPath" :src="'/staticapi'+ iconImgPath" class="avatar">
                                    <img v-else src="/static/themes/theme1/image/defaultInstitution.png" class="avatar">
                                </el-form-item>
                            </div>
                        </el-row>
                    </div>
                    <div class="width750">
                        <div class="flex-box">
                            <div class="width360">
                                <el-form-item label="名称" prop="name" class="">
                                    <span>{{oLicenseData.name}}</span>
                                </el-form-item>
                                <el-form-item label="场景" prop="" class="">
                                    <span>{{oLicenseData.scene.name}}</span>
                                </el-form-item>
                                <el-form-item label="版本" prop="" class="">
                                    <span>{{oLicenseData.value | getNameById(licenseValueList,'valueMask','name')}}</span>
                                </el-form-item> 
                            </div>
                            <div class="width360">
                                <el-form-item label="颜色" prop="" class="">
                                    <template v-if="oLicenseData.color==''">--</template>
                                    <div v-else class="zy-color" :style="{'background-color':oLicenseData.color}">&nbsp;</div>
                                </el-form-item>
                                <el-form-item label="状态" prop="" class="">
                                    <span v-html="formatMaskStatus(oLicenseData.status,licenseStatus) || '--'"></span>
                                </el-form-item>
                                <el-form-item label="授权bin模版" prop="" class="">
                                    <span>{{oLicenseData.binWrap}}</span>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="">
                            <el-form-item label="描述" prop="" class="">
                                    <span>{{oLicenseData.description}}</span>
                            </el-form-item>
                        </div>
                        <div class="createTime">
                            <el-form-item label="修改时间" prop="" class="floatR marginL50">
                                <span>{{oLicenseData.updateTime}}</span>
                            </el-form-item> 
                            <el-form-item label="创建时间" prop="" class="floatR">
                                <span>{{oLicenseData.createTime}}</span>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
        <el-dialog title="网站配置-版本许可证-修改" :visible.sync="bShowAddLicense" :modal="true" custom-class="width700" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oLicenseDetail" :rules="oAddDlgRules" ref="addLicense" :inline="true">
                <el-form-item label="名称：" prop="name" class="">
                    <el-input type="text" v-model="oLicenseDetail.name" size="small" class="width200"></el-input>
                </el-form-item> 
                <el-form-item label="授权模版：" prop="binWrap" class="">
                    <el-input type="text" v-model="oLicenseDetail.binWrap" size="small" class="width200"></el-input>
                </el-form-item>
                <el-form-item label="颜色：" prop="color" class="floatL">
                    <compact-picker v-model="oLicenseDetail.color"/>
                </el-form-item>
                <el-form-item label="" prop="iconImg" class="floatL marginL60">
                    <div class="ImgUrl">
                        <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :auto-upload="false"
                            list-type="picture-card"
                            :on-change="addIconPicturehd"
                            >
                            <img v-if="iconImg" :src="'/staticapi'+ iconImg" class="img-avatar">
                            <span v-else class="title-head">图标</span>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="" prop="logoImg" class="floatL marginL28">
                    <div class="ImgUrl">
                        <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :auto-upload="false"
                            list-type="picture-card"
                            :on-change="addLogoPicturehd"
                            >
                            <img v-if="logoImg" :src="'/staticapi'+ logoImg" class="img-avatar">
                            <span v-else class="title-head">LOGO</span>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="描述：" prop="description" class="marginB0">
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 3}" v-model="oLicenseDetail.description" class="width515"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowAddLicense = false">取 消</el-button>
                <el-button type="primary" @click="addLicenseData()">确 定</el-button>
            </span>
        </el-dialog> 
    </div>
</template>
<style scoped>
    .zy-color{
        width:15px;
        height: 15px;
        margin-top: 13px;
    }
    .avatar{
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .img-avatar{
        width: 80px;
        height: 80px;
    }
    .createTime{
        margin-right: -390px;
        overflow:hidden;
        margin-bottom:-20px;
    }
</style>
<script>
import API from '../api.js'
import validate from '@/lib/validate.js'
import utils from '@/lib/utils.js'
import { Compact } from 'vue-color'
export default {
    components: {
        'compact-picker': Compact
    },
    props:{
        memberId: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            oLicenseData:{
                scene:''
            }, //详情
            oLicenseDetail:{ //弹窗
                name:'',
                scene:'',
                value:'',
                binWrap:'',
                description:'',
                iconUrl:'',
                logoUrl:'',
                color: { hex: '#AAA' }, //默认#AAA为无颜色
            },
            iconImg:'',
            logoImg:'',
            bShowAddLicense:false, //显示弹窗
            logoImgPath:'', //logo 
            iconImgPath:'', //icon 
            licenseValueList:[],  //版本类型 
            licenseStatus:[],  //状态列表
            oAddDlgRules: {            //添加弹窗校验规则
                name:[
                    { required: true, message: '不能为空', trigger: 'change, blur' },
                ], 
            },
        }
    },
    methods: {
        formatMaskStatus(mask,aMask) {  //格式化状态
            return utils.getDictStatus(mask, aMask, 'valueMask');
        },
        addIconPicturehd(file, fileList){  //添加理财顾问个人头像
            var fileform = new FormData();
            fileform.append("upf", file.raw);
            fileform.append("pattern", '/heart/saas/march/deamon/upload/bg/license/icon');
            var self = this;
            API.uploadImage(fileform).then((res) => {
                if(res.data.code =='OK'){
                    this.oLicenseDetail.iconUrl = res.data.data;
                    this.iconImg = res.data.data;
                }
            });
        },
        addLogoPicturehd(file, fileList){  //添加理财顾问个人头像
            var fileform = new FormData();
            fileform.append("upf", file.raw);
            fileform.append("pattern", '/heart/saas/march/deamon/upload/bg/license/logo');
            var self = this;
            API.uploadImage(fileform).then((res) => {
                if(res.data.code =='OK'){
                    this.oLicenseDetail.logoUrl = res.data.data;
                    this.logoImg = res.data.data;
                }
            });
        },
        bShowUpdate(){ //修改
            this.bShowAddLicense=true;
            this.oLicenseDetail.name=this.oLicenseData.name;
            this.oLicenseDetail.binWrap=this.oLicenseData.binWrap;
            this.oLicenseDetail.iconUrl=this.oLicenseData.iconUrl;
            this.oLicenseDetail.logoUrl=this.oLicenseData.logoUrl;
            this.oLicenseDetail.description=this.oLicenseData.description;
            this.oLicenseDetail.color.hex = this.oLicenseData.color + '' || '#AAA';
            this.iconImg=this.oLicenseData.iconUrl;
            this.logoImg=this.oLicenseData.logoUrl;
        },
        addLicenseData(){
            this.$refs.addLicense.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data={
                    licenseId:this.oLicenseData.id,
                    name:this.oLicenseDetail.name,
                    binWrap:this.oLicenseDetail.binWrap,
                    iconUrl:this.iconImg,
                    logoUrl:this.logoImg,
                    color: this.oLicenseDetail.color.hex === '#AAA' ? '' : this.oLicenseDetail.color.hex,
                    description:this.oLicenseDetail.description,
                }
                API.updateLicenseData(data).then((res)=>{
                    if (res.data.code === 'OK') {
                        this.bShowAddLicense = false;
                        this.$notify({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getLicenseDetail();
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                })
            })
        },
        getLicenseDetail() {
            var data = {
                licenseId: this.memberId
            }
            API.getLicenseDetail(data).then((res) => {
                if (res.data.code == 'OK') {
                    this.oLicenseData = res.data.data;
                    this.logoImgPath=res.data.data.logoUrl;
                    this.iconImgPath=res.data.data.iconUrl;
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            })
        },
        getLicenseValueList(){ //获取版本类型列表
            var data = {
                url: '/saas/site/value',
            };
            API.getDict(data).then((res) => {
                if(res.data.code=='OK'){
                    res.data.data.forEach((v,k) =>{
                        v.name = v.name +'';
                        v.valueMask = v.valueMask+'';
                    })
                    this.licenseValueList = res.data.data;
                    this.getLicenseDetail();
                }
            })
        },
        getLicenseStatus(){ //获取状态列表
            var data = {
                url: '/global/usr/status',
            };
            API.getDict(data).then((res) => {
                if(res.data.code=='OK'){
                    res.data.data.forEach((v,k) =>{
                        v.name = v.name +'';
                        v.valueMask = v.valueMask+'';
                    })
                    this.licenseStatus = res.data.data;
                    this.getLicenseDetail();
                }
            })
        },
    },
    created() {
         this.getLicenseValueList();
         this.getLicenseStatus();
    }
}
</script>
