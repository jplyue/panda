<template>
    <div class="zy-panel">
        <el-button class="floatR" type="primary" size="small" @click="shouUserInfo">修改</el-button>
        <div class="zy-member zy-panel marginT30">
            <el-form label-width="70px" :model="oUserData" ref="addDlgForm" :inline="false" label-position="left" class="marginT20">
                <div class="flex-box">
                    <div class="headImg marginL80 marginR20">
                        <el-row>
                            <el-col :span="12" class="text-center detail-img">
                                <img v-if="hdImgPath" :src="'/staticapi'+ hdImgPath">
                                <img v-else src="/static/themes/theme1/image/defaultPortrait.png">
                                <el-button class="marginT5" v-if="hdImgPath" type="text" @click="updateImg()">更新头像</el-button>
                                <el-button class="marginT5" v-else type="text" @click="updateImg()">上传头像</el-button>
                            </el-col>
                            <el-col :span="11" class="floatL marginL20">
                                <div class="spanName">
                                    <span class="realName">{{oUserData.realName}}</span>
                                </div>
                                <div class="spanStatus">
                                    <img class="status" src="/static/themes/theme1/image/planner-status.svg" alt="">
                                    <span class="span">状态</span>
                                    <span v-html="formatMaskStatus(oUserData.status,userStatus) || '--'"></span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="width750">
                        <div class="flex-box">
                            <div class="width360">
                                <el-form-item label="用户名" prop="name" class="">
                                    <span>{{oUserData.name}}</span>
                                </el-form-item>
                                <el-form-item label="昵称" prop="nickName" class="">
                                    <span>{{oUserData.nickName}}</span>
                                </el-form-item>
                                <el-form-item label="性别" prop="realSex" class="">
                                    <span v-if="oUserData.realSex==2">男</span>
                                    <span v-if="oUserData.realSex==4">女</span>
                                </el-form-item>
                                
                                <el-form-item label="手机" prop="mobile" class="">
                                    <span>{{oUserData.mobile}}</span>
                                </el-form-item>
                                <el-form-item label="邮箱" prop="email" class="">
                                    <span>{{oUserData.email}}</span>
                                </el-form-item>
                            </div>
                            <div class="width360">
                                <el-form-item :label="oUserData.idttType|getNameById(idttTypes,'valueMask','name')" prop="" class="">
                                    <span class=""> {{oUserData.idttNo}}</span>
                                </el-form-item>
                                <el-form-item label="部门" prop="departName" class="">
                                    <span>{{oUserData.departName}}</span>
                                </el-form-item>
                                <el-form-item label="岗位" prop="departName" class="">
                                <span v-html="formatMaskCatagory(item,userPostList)" v-for="(item,$index) in  aSelectedPostCode" :key="$index"></span>                                    
                                </el-form-item>
                                <el-form-item label="角色" prop="departName" class="">
                                    <span v-html="formatMaskCatagory(item,userRoleList)" v-for="(item,$index) in  aSelectedRoleList" :key="$index"></span>                                       
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div class="createTime">
                    <el-form-item label="修改时间" prop="" class="floatR marginL50 marginR30">
                        <span>{{oUserData.updateTime}}</span>
                    </el-form-item> 
                    <el-form-item label="创建时间" prop="" class="floatR">
                        <span>{{oUserData.createTime}}</span>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <el-dialog title="系统管理-账户管理-添加用户" :visible.sync="bShowUpdate" :modal="true" custom-class="width780" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oUpdateData" :rules="oAddDlgRules" ref="updateUserInfo" :inline="true">
                <el-form-item label="用户名：" prop="name" class="">
                    <el-input type="text" v-model="oUpdateData.name" size="small"></el-input>
                </el-form-item> 
                <el-form-item label="性别：" prop="realSex" class="marginL30">
                    <el-radio-group v-model="oUpdateData.realSex" class="" :disabled="oUpdateData.idttType=='1'">
                        <el-radio :label="2">男</el-radio>
                        <el-radio :label="4" class="marginL50">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <br>
                <el-form-item label="真实姓名：" prop="realName" class="floatL">
                    <el-input type="text" v-model="oUpdateData.realName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" prop="nickName" class="marginL30">
                    <el-input type="text" v-model="oUpdateData.nickName" size="small" class="" placeholder="昵称"></el-input>
                </el-form-item> 
                <el-form-item label="" prop="idttType" class="pbulish-content">
                    <el-input placeholder="" v-model="oUpdateData.idttNo" size="small" class="width330 marginL10">
                        <el-select v-model="oUpdateData.idttType" placeholder="请选择" size="small" class="width90" slot="prepend">
                            <el-option
                            v-for="item in idttTypes"
                            :key="item.valueMask"
                            :label="item.name"
                            :value="item.valueMask">
                            </el-option>
                        </el-select>
                    </el-input>
                </el-form-item>   
                <el-form-item label="手机号：" prop="mobile" class="marginL30">
                    <el-input type="text" v-model="oUpdateData.mobile" size="small"></el-input>
                </el-form-item> 
                <el-form-item label="邮箱：" prop="email" class="">
                    <el-input type="text" v-model="oUpdateData.email" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowUpdate = false">取 消</el-button>
                <el-button type="primary" @click="updateUser()">确 定</el-button>
            </span>
        </el-dialog> 
        <upload-img :isshow.sync='bShowImg' :value='hdImgPath' :width="200" :height="200" pattern="/heart/saas/march/security/upload/bg/perm/head" @recFunction="watchImgUpdate"></upload-img>
    </div>
</template>
<style scoped>
    .createTime{
        overflow:hidden;
        margin-bottom:-20px;
    }
    .spanStatus{
        line-height: 40px;
    }
    .spanStatus .span{
        color: #8b9aab !important;
        margin-right: 20px;
    }
    .spanStatus .status{
        position: relative;
        top: 4px;
        width: 18px;
        height:18px; 
        margin-right: 5px; 
    }
    .spanName{
        width: 220px;
        line-height: 50px; 
    }
    .realName{
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 2px;
        color: #1f2d3d;
        line-height: 30px
    }
    .headImg{
        min-width: 425px;
    }
    .ImgUrl{
        width: 100px;
        height: 100px;
        border:1px dashed #e2e2e2;
        margin:20px 0 30px 0;
    }
    .avatar-uploader .avatar{
        width: 100%;
        height: 100%;
    }
</style>

<script>
import API from '../api.js'
import validate from '@/lib/validate.js'
import utils from '@/lib/utils.js'
import uploadImg from '@/components/uploadImg.vue'
export default {
    components:{
        uploadImg,
    },
    props:{
        memberId: {
            type: String,
            default: ''
        }
    },
    data(){
       return {
           usrId:'', //用户id
           bShowImg:false,  //修改头像
           oUserData:{  //用户信息
                hdImgUrl:"",
                realName:'',
                name:'',
                nickName:'',
                realSex:'',
                idttType:'',
                idttNo:'',
                mobile:'',
                email:'',
                status:'',
                departName:'',
                updateTime:'',
                createTime:''
           },
           oUpdateData:{ //修改信息
                realName:'',
                name:'',
                nickName:'',
                realSex:'',
                idttType:'',
                idttNo:'',
                mobile:'',
                email:'',
                status:'',
                departName:'',
           },
           userStatus:[], //用户状态
           idttTypes:[], //证件类型
           userPostList:[], //岗位列表
           aSelectedPostCode:[],  //岗位数组,
           userRoleList:[], //角色列表
           aSelectedRoleList:[], //角色数组
           hdImgPath:'',
           bShowUpdate:false,  //控制修改
           oAddDlgRules: {            //添加弹窗校验规则
                realName:[
                    { required: true, message: '不能为空', trigger: 'change, blur' },
                ],
                idttNo:[
                    { required: true, message: '不能为空', trigger: 'change, blur' },
                ],
                checkLoginPwd: [
                    { required: true, message: '不能为空', trigger: 'change, blur' },
                    {
                        validator: (rule, value, callback) => {
                            validate.validate2Password(rule, value, callback, this.oAddDlgData.loginPwd)
                        },
                        trigger: 'change, blur'
                    }
                ],
                mobile: [
                    { validator: validate.validatePhoneNumber, trigger: 'blur' },
                ],
                email: [
                    { validator: validate.validateEmail, trigger: 'blur' },
                ],
            },
       } 
    },
    methods:{
        shouUserInfo(){
            this.bShowUpdate=true;
            this.oUpdateData={ //修改信息
                realName:this.oUserData.realName,
                name:this.oUserData.name,
                nickName:this.oUserData.nickName,
                realSex:this.oUserData.realSex,
                idttType:this.oUserData.idttType,
                idttNo:this.oUserData.idttNo,
                mobile:this.oUserData.mobile,
                email:this.oUserData.email,
                status:this.oUserData.status,
                departName:this.oUserData.departName
           }
        },
        updateUser(){ //更新数据
            this.$refs.updateUserInfo.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data={
                    usrId:this.usrId,
                    realName:this.oUpdateData.realName,
                    realSex:this.oUpdateData.realSex,
                    name:this.oUpdateData.name,
                    nickName:this.oUpdateData.nickName,
                    mobile:this.oUpdateData.mobile,
                    email:this.oUpdateData.email,
                    idttType:this.oUpdateData.idttType,
                    idttNo:this.oUpdateData.idttNo,
                }
                API.updateUserItem(data).then((res)=>{
                    if (res.data.code == 'OK') {
                        this.bShowUpdate = false;
                        this.$notify({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getUserDetail();
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                })
            })  
        },
        formatMaskStatus(mask,aMask) {  //格式化状态
            return utils.getDictStatus(mask, aMask, 'valueMask');
        },
        formatMaskCatagory(mask,aMask) {  //格式化状态
            return utils.getDictLabel(mask, aMask, 'code');
        },
        updateImg(){  //显示编辑头像弹窗
            this.bShowImg=true;
        },
        watchImgUpdate(item){ //获取路径
            this.hdImgPath=item;
            var data={
                usrId:this.usrId,
                hdImgUrl:this.hdImgPath
            }
            API.UserManageImg(data).then((res)=>{
                if (res.data.code === 'OK') {
                    this.$notify({
                        message: '修改头像成功',
                        type: 'success'
                    });
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            });
            this.getUserDetail();
        },
        getUserDetail() {
            var data = {
                usrId: this.memberId
            }
            API.getUserDetail(data).then((res) => {
                if (res.data.code == 'OK') {
                    this.oUserData = {
                        name:res.data.data.name,
                        nickName:res.data.data.nickName,
                        realSex:res.data.data.realSex,
                        idttType:res.data.data.idttType,
                        idttNo:res.data.data.idttNo,
                        mobile:res.data.data.mobile,
                        email:res.data.data.email,
                        status:res.data.data.status, 
                        departName:res.data.data.departName,
                        realName:res.data.data.realName,
                        createTime:res.data.data.createTime,
                        updateTime:res.data.data.updateTime
                    };
                    this.hdImgPath=res.data.data.hdImgUrl;
                    this.aSelectedPostCode = [];
                    this.userPostList.forEach((m, n) => {
                        if (res.data.data.joinPostCode & m.code) {
                            this.aSelectedPostCode.push(m.code);
                        }
                    });
                    this.aSelectedRoleList = [];
                        this.userRoleList.forEach((m, n) => {
                            if (res.data.data.joinRoleCode & m.code) {
                                this.aSelectedRoleList.push(m.code);
                            }
                        });
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            })
        },
        getuserStatus(){  //获取所有状态
            var data = {
                url: '/global/usr/status',
            };
            API.getDict(data).then((res) => {
                if(res.data.code=='OK'){
                    res.data.data.forEach((v,k) =>{
                        v.name = v.name +'';
                        v.valueMask = v.valueMask+'';
                    })
                    this.userStatus = res.data.data;
                }
            })
        },
        getPostList(){ //获取岗位列表
            var data={
            }
            API.getPostList(data).then((res)=>{
                if(res.data.code=="OK"){
                    this.userPostList=res.data.data;
                    this.getUserDetail();
                }
            })
        },
        getRoleList(){  //获取角色列表
            var data={
            }
            API.getRoleList(data).then((res)=>{
                if(res.data.code=="OK"){
                    this.userRoleList=res.data.data;
                    this.getUserDetail();
                }
            })
        },
        getidttTypesList(){ //获取证件类型
            var data={
                url:'/global/usr/certifitype'
            }
            API.getDict(data).then((res) => {
                if(res.data.code=='OK'){
                    this.idttTypes = res.data.data;
                }
            })
        },
    },
    created(){
        this.usrId=this.$route.params.id
        this.getuserStatus();
        this.getPostList();
        this.getRoleList();
        this.getidttTypesList();

    }
}
</script>
