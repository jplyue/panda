<template>
    <div class="zy-panel">
        <div class="zy-member">
            <el-form label-width="85px" :model="oDeployData" ref="addDlgForm" :inline="false" label-position="left" class="marginT20">
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
                                <el-form-item label="站点域名" prop="name" class="">
                                    <span>{{oDeployData.domainUrl}}</span>
                                </el-form-item>
                                <el-form-item label="场景" prop="name" class="">
                                    <span>{{oDeployData.scene.name}}</span>
                                </el-form-item>
                                <el-form-item label="站点属性" prop="name" class="">
                                    <span> {{oDeployData.siteProp || '--' | getNameById(deviceList, 'valueMask', 'name')}}</span>
                                </el-form-item>
                                <el-form-item label="站点功能" prop="name" class="">
                                    <span>{{oDeployData.siteFeature || '--' | getNameById(functionList, 'valueMask', 'name')}}</span>
                                </el-form-item>
                                <el-form-item label="状态" prop="name" class="">
                                    <span><span v-html="formatMaskStatus(oDeployData.status,deployStatus) || '--'"></span></span>
                                </el-form-item>
                                <el-form-item label="目标主机" prop="name" class="">
                                    <span>{{oDeployData.rendHost}}</span>
                                </el-form-item>
                                <el-form-item label="主机端口" prop="name" class="">
                                    <span>{{oDeployData.rendHostPort}}</span>
                                </el-form-item>          
                            </div>
                            <div class="width360">
                                <el-form-item label="模版" prop="name" class="">
                                    <span>{{oDeployData.rendTemplate}}</span>
                                </el-form-item>
                                <el-form-item label="风格" prop="name" class="">
                                    <span>{{oDeployData.rendStyle}}</span>
                                </el-form-item>
                                <el-form-item label="版本名称" prop="name" class="">
                                    <span>{{oDeployData.viewVersionName}}</span>
                                </el-form-item>
                                <el-form-item label="版本级别" prop="name" class="">
                                    <span>{{oDeployData.viewVersionLevel}}</span>
                                </el-form-item>
                                <el-form-item label="版本号" prop="name" class="">
                                    <span>{{oDeployData.viewVersionVno}}</span>
                                </el-form-item>
                                <el-form-item label="版权信息" prop="name" class="">
                                    <span>{{oDeployData.viewCopyright}}</span>
                                </el-form-item>
                                <el-form-item label="访问建议" prop="name" class="">
                                    <span>{{oDeployData.viewSuggest}}</span>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="">
                            <el-form-item label="简介" prop="" class="">
                                    <span>{{oDeployData.viewProfile}}</span>
                            </el-form-item>
                        </div>
                        <div class="createTime">
                            <el-form-item label="修改时间" prop="" class="floatR marginL50">
                                <span>{{oDeployData.updateTime}}</span>
                            </el-form-item> 
                            <el-form-item label="创建时间" prop="" class="floatR">
                                <span>{{oDeployData.createTime}}</span>
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>
<style scoped>
    .avatar{
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
    .createTime{
        margin-right: -390px;
    }
</style>
<script>
import API from '../api.js'
import validate from '@/lib/validate.js'
import utils from '@/lib/utils.js'

export default {
    
    props:{
        memberId: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            oDeployData: {
                scene:''
            },
            logoImgPath:'',
            iconImgPath:'',
            VersionList:[], //场景列表
            deviceList:[], //登陆设备
            functionList:[], //站点功能
            deployStatus:[], //状态列表
        }
    },
    methods: {
        formatMaskStatus(mask,aMask) {  //格式化状态
            return utils.getDictStatus(mask, aMask, 'valueMask');
        },
        getDeployDetail() {
            var data = {
                siteId: this.memberId
            }
            API.getDeployDetail(data).then((res) => {
                if (res.data.code == 'OK') {
                    this.oDeployData = res.data.data;
                    this.logoImgPath=res.data.data.viewLogoUrl
                    this.iconImgPath=res.data.data.viewIconUrl
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            })
        },
        getVersionList(){ //版本场景
            var data={
            }
            API.getVersionList(data).then((res)=>{
                if(res.data.code=="OK"){
                    this.VersionList=res.data.data
                    this.getDeployDetail();
                }
            })
        },
        getDeviceList(){ //登陆设备
            var data={
                url:'/global/usr/session/loginpoint'
            }
            API.getDict(data).then((res)=>{
                if(res.data.code=="OK"){
                    res.data.data.forEach((v,k) =>{
                        v.name = v.name +'';
                        v.valueMask = v.valueMask+'';
                    })
                    this.deviceList=res.data.data
                }
            })
        },
        getFunctionList(){ //功能
            var data={
                url:'/saas/site/function '
            }
            API.getDict(data).then((res)=>{
                if(res.data.code=="OK"){
                    res.data.data.forEach((v,k) =>{
                        v.name = v.name +'';
                        v.valueMask = v.valueMask+'';
                    })
                    this.functionList=res.data.data
                }
            })
        },
        getReleaseStatus(){ //获取状态列表
            var data = {
                url: '/saas/site/sitestatus',
            };
            API.getDict(data).then((res) => {
                if(res.data.code=='OK'){
                    res.data.data.forEach((v,k) =>{
                        v.name = v.name +'';
                        v.valueMask = v.valueMask+'';
                    })
                    this.deployStatus = res.data.data;
                    this.getTableData();
                }
            })
        },
    },
    created() {
         this.getVersionList();
         this.getDeviceList();
         this.getFunctionList();
         this.getReleaseStatus();
    }
}
</script>
