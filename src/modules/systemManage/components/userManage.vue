<template>
    <div class="heightP100">
        <el-breadcrumb separator="/" class="zy-div-breadcrumb">
            <el-breadcrumb-item :to="{ path: '/main/homepage' }">
                <i class="fa fa-home"></i> 首页</el-breadcrumb-item>
            <el-breadcrumb-item>安全管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="zy-div-container">
            <el-row :gutter="10" class="marginT10">
                <div class="floatL">
                    <el-input v-model="szFindValue" placeholder="关键词" ref="keyword" class="width200" icon="search" @keyup.enter.native="getTableData" @click="getTableData()" size="small">
                    </el-input>
                </div>
                <div class="floatL marginL20">
                    <el-select class="width120" v-model="departIds" placeholder="部门" size="small">
                        <el-option v-for="item in allSection" :key="item.id" :label="item.raw.name" :value="item.id">
                        </el-option>
                    </el-select>
                </div> 
                <div class="floatL marginL20">
                    <el-select class="width120" v-model="postCodeSearch" placeholder="岗位" size="small">
                        <el-option v-for="item in userPostList" :key="item.id" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </div> 
                <div class="floatL marginL20">
                    <el-select class="width120" v-model="roleCodeSearch" placeholder="角色" size="small">
                        <el-option v-for="item in userRoleList" :key="item.id" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </div>
                <div class="floatL marginL20">
                    <el-select class="width120" v-model="selectStatus" placeholder="状态" size="small">
                        <el-option v-for="item in oCap.accountStatus" :key="item.valueMask" :label="item.name" :value="item.valueMask">
                        </el-option>
                    </el-select>
                </div>

                <el-button  class="marginL10" @click="resetFunc" size="mini">重置</el-button>
                <el-button type="info" class="marginL10 marginT5" size="small" @click="getTableData">查询</el-button>
                <el-button type="primary" icon="plus" class="floatR marginT5 marginR5" @click="showAddDlg" size="small">添加</el-button>
            </el-row>
            <el-row class="marginT10">
                <el-table v-loading="bTableLoading" :data="aTableData" stripe @row-click="selectedRow" class="label6-hover">
                    <el-table-column label="用户名" align="left" width="200px">
                        <template slot-scope="scope">
                            <router-link :to="{path:'/main/system/user/detail/basic/' + scope.row.usrId}" target="_blank">
                                <img v-if="scope.row.hdImgUrl" :src="'/staticapi'+ scope.row.hdImgUrl" class="img-head">
                                <span v-else>
                                    <img v-if="scope.row.realSex==''" src="/static/themes/theme1/image/defaultPortrait.png" class="img-head"> 
                                    <img v-if="scope.row.realSex==2" src="/static/themes/theme1/image/defaultPortraitMan.png" class="img-head"> 
                                    <img v-if="scope.row.realSex==4" src="/static/themes/theme1/image/defaultPortraitWoman.png" class="img-head"> 
                                </span>
                                <span class="title-head">{{scope.row.name}}</span>
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="真实姓名" align="center">
                        <template slot-scope="scope">
                            {{scope.row.realName === '' ? '--': scope.row.realName}}
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号码" align="center">
                        <template slot-scope="scope">
                            {{scope.row.mobile === '' ? '--': scope.row.mobile}}
                        </template>
                    </el-table-column>
                    <el-table-column label="性别" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.realSex==2">男</span>
                            <span v-if="scope.row.realSex==4">女</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="部门" align="center">
                        <template slot-scope="scope">
                            <div class="adviser-div">
                                <span class="adviser-name">{{scope.row.departName || '--' }}</span>
                                <span class="adviser-set colorG" v-if="scope.row.departName" @click="deleteDepart(scope.row)">
                                    解绑
                                </span>
                                <span class="adviser-set colorG" v-else @click="addDepart(scope.row)">  
                                    绑定
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="岗位" align="center">
                        <template slot-scope="scope">
                            <div class="adviser-div">
                                <div class="label-div">
                                <span class="adviser-name" v-html="formatMaskCatagory(item,userPostList)" v-for="(item,$index) in  aSelectedPostCode[scope.$index]" :key="$index"></span>                                    
                                <div class="label-button">
                                    <span class="colorG"  @click="showTag(scope.row)">设置</span>
                                </div>
                            </div> 
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="角色" align="center">
                        <template slot-scope="scope">
                            <div class="adviser-div">
                                <div class="label-div">
                                <span class="adviser-name" v-html="formatMaskCatagory(item,userRoleList)" v-for="(item,$index) in  aSelectedRoleList[scope.$index]" :key="$index"></span>                                    
                                <div class="label-button">
                                    <span class="colorG"  @click="showRole(scope.row)">设置</span>
                                </div>
                            </div> 
                            </div>
                        </template>
                    </el-table-column>
                    
                    <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <span v-html="formatMaskStatus(scope.row.status,oCap.accountStatus) || '--'"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200px">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="updateAccount(scope.row)">修改</el-button>
                            <el-dropdown trigger="click" @command="handleCommand">
                                <span class="el-dropdown-link el-button--text">
                                    操作
                                    <i class="el-icon-caret-bottom el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="password">重置密码</el-dropdown-item>
                                    <el-dropdown-item command="updateStatus">修改状态</el-dropdown-item>
                                    <el-dropdown-item command="updatenickName">修改昵称</el-dropdown-item>
                                    <el-dropdown-item command="updateName">修改用户名</el-dropdown-item>
                                    <el-dropdown-item command="email">修改邮箱</el-dropdown-item>
                                    <el-dropdown-item command="mobile">修改手机号</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-button size="small" type="text" @click="deleteAccount(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNumber" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.totalRow" class="floatR">
                </el-pagination>
            </el-row>
            <div class="clear"></div>
        </div>
        <el-dialog title="系统管理-账户管理-添加用户" :visible.sync="bShowAddDlg" :modal="true" custom-class="width780" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oAddDlgData" :rules="oAddDlgRules" ref="addDlgForm" :inline="true">
                <div class="zy-div marginTB10">
                    <div class="title">基本信息</div>
                </div>
                <el-form-item label="性别：" prop="realSex" class="">
                    <el-radio-group v-model="oAddDlgData.realSex" class="">
                        <el-radio :label="2">男</el-radio>
                        <el-radio :label="4" class="marginL50">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用户名：" prop="name" class="marginL145">
                    <el-input type="text" v-model="oAddDlgData.name" size="small"></el-input>
                </el-form-item> 
                <br>
                <el-form-item label="" prop="hdImgUrl" class="floatL">
                    <div class="ImgUrl">
                        <el-upload
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :auto-upload="false"
                            list-type="picture-card"
                            :on-change="addPicturehd"
                            >
                            <img v-if="hdImgPath" :src="'/staticapi'+ hdImgPath" class="avatar">
                            <span v-else class="title-heads">添加头像</span>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="昵称：" prop="nickName" class="floatL marginLB10">
                    <el-input type="text" v-model="oAddDlgData.nickName" size="small" class="width120" placeholder="昵称"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名：" prop="realName" class="marginL155">
                    <el-input type="text" v-model="oAddDlgData.realName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="" prop="idttType" class="pbulish-content">
                    <el-input placeholder="" v-model="oAddDlgData.idttNo" size="small" class="width330 marginL10">
                        <el-select v-model="oAddDlgData.idttType" placeholder="请选择" size="small" class="width90" slot="prepend">
                            <el-option
                            v-for="item in oCap.idttTypes"
                            :key="item.valueMask"
                            :label="item.name"
                            :value="item.valueMask">
                            </el-option>
                        </el-select>
                    </el-input>
                </el-form-item>   
                <el-form-item label="手机号：" prop="mobile" class="marginL30">
                    <el-input type="text" v-model="oAddDlgData.mobile" size="small"></el-input>
                </el-form-item> 
                <div class="zy-div">
                    <div class="title">关联</div>
                </div>
                <el-form-item label="部门：" prop="">
                    <el-select class="" v-model="oAddDlgData.departIds" placeholder="" size="small">
                        <el-option v-for="item in allSection" :key="item.id" :label="item.raw.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="岗位：" prop="postCode" class="marginL30">
                        <el-select
                            v-model="oAddDlgData.postCode"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            size="small"
                            placeholder="">
                                <el-option
                                    v-for="item in userPostList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="角色：" prop="roleCode">
                    <el-select
                        v-model="oAddDlgData.roleCode"
                        multiple
                        filterable
                        allow-create
                        size="small"
                        default-first-option
                        placeholder="">
                            <el-option
                                v-for="item in userRoleList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowAddDlg = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </span>
        </el-dialog> 
        <el-dialog title="系统管理-账户管理-重置密码" :visible.sync="bShowPwdDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oPwdDlgData" :rules="oPwdDlgRules" ref="pwdDlgForm" :inline="true">
                <el-form-item label="新密码：" prop="loginPwd">
                    <el-input type="password" v-model="oPwdDlgData.loginPwd" size="small"></el-input>
                </el-form-item>
                <el-form-item label="确认密码：" prop="checkLoginPwd" class="marginB0">
                    <el-input type="password" v-model="oPwdDlgData.checkLoginPwd" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowPwdDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyUserPwd()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="系统管理-账户管理-修改邮箱" :visible.sync="bShowEmailDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oEmailDlgData" :rules="oEmailDlgRules" ref="emailDlgForm" :inline="true">
                <el-form-item label="邮箱：" prop="email">
                    <el-input type="text" v-model="oEmailDlgData.email" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowEmailDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyUserEmail()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="系统管理-账户管理-修改手机号" :visible.sync="bShowMobileDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oMobileDlgData" ref="mobileDlgForm" :inline="true">
                <el-form-item label="手机号：" prop="mobile">
                    <el-input type="text" v-model="oMobileDlgData.mobile" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowMobileDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyUserMobile()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="系统管理-账户管理-修改用户名" :visible.sync="bShowNameDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oNameDlgData" ref="NameDlgForm" :inline="true">
                <el-form-item label="新用户名：" prop="name">
                    <el-input type="text" v-model="oNameDlgData.name" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowNameDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyUserName()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="系统管理-账户管理-修改昵称" :visible.sync="bShowNickNameDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oNickNameDlg" ref="nickNameDlgForm" :inline="true">
                <el-form-item label="昵称：" prop="nickName">
                    <el-input type="text" v-model="oNickNameDlg.nickName" size="small"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowNickNameDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyUsernickName()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="系统管理-账户管理-修改状态" :visible.sync="bShowStatusDlg" :modal="true" custom-class="width450" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oNickNameDlg" :inline="true">
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="oStatusDlgData.status" placeholder="请选择" size="small">
                        <el-option v-for="item in oCap.accountStatus" :key="item.valueMask" :label="item.name" :value="item.valueMask">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowStatusDlg = false">取 消</el-button>
                <el-button type="primary" @click="modifyUserStatus()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="系统管理-账户管理-修改用户" :visible.sync="bShowAccount" :modal="true" custom-class="width780" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="100px" :model="oAddDlgData" :rules="oAddDlgRules" ref="updateDlgForm" :inline="true">
                <el-form-item label="真实姓名：" prop="realName">
                    <el-input type="text" v-model="oAddDlgData.realName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="性别：" prop="realSex">
                    <el-radio-group v-model="oAddDlgData.realSex" class="" :disabled="oAddDlgData.idttType=='1'">
                        <el-radio :label="2">男</el-radio>
                        <el-radio :label="4" class="marginL50">女</el-radio>
                    </el-radio-group>
                </el-form-item>          
                <el-form-item label="" prop="idttType" class="pbulish-content">
                    <el-input placeholder="" v-model="oAddDlgData.idttNo" size="small" class="width330 marginL10">
                        <el-select v-model="oAddDlgData.idttType" placeholder="请选择" size="small" class="width90" slot="prepend">
                            <el-option
                            v-for="item in oCap.idttTypes"
                            :key="item.valueMask"
                            :label="item.name"
                            :value="item.valueMask">
                            </el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                
            </el-form>
            <span slot="footer">
                <el-button @click="bShowAccount = false">取 消</el-button>
                <el-button type="primary" @click="updateUser()">确 定</el-button>
            </span>
        </el-dialog> 
        <el-dialog title="系统管理-用户管理-绑定部门" :visible.sync="bShowSection" :modal="true" custom-class="width400" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form label-width="80px"  ref="sectionForm" :inline="false">
                <el-form-item label="部门：" prop="name" class="marginB0">
                    <el-select 
                    v-model="departId" 
                    placeholder="选择部门"
                    filterable
                    remote 
                    size="small"
                    class="width145" @focus="getAllDepart()"
                    :remote-method="getAllDepart"
                    >
                        <el-option
                        v-for="item in allSection"
                        :key="item.id"
                        :label="item.raw.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="bShowSection = false">取 消</el-button>
                <el-button type="primary" @click="setSection">确 定</el-button>
            </span>
        </el-dialog>
        <edit-tag :isshow.sync='bShowTag' :set-api="setApi" parent-url='/global/usr/tag' :select-data="oBasicData.tag" :add-id="this.oBasicData.id" :title="oBasicData.name" :my-api="myApi" :rect-function="returnFunction"></edit-tag>

    </div>
</template>
<style scoped>
    .zy-div {
        height: 40px;
        line-height: 40px;
        margin: 0 0 10px 0;
        border-bottom: 1px solid #d2d2d2;
        font-size: 16px;
        color:#454545;
        margin-bottom:15px;
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
    .label6-hover .label-div{
        height: 24px;
    }
    .label6-hover .label-div .label-button{
        display: none;
    }
    .label6-hover .label-div:hover .label-span{
        display: none;
    }
    .label6-hover .label-div:hover .label-button{
        display: block;
        cursor: pointer;
    }
    .title-heads{
        position: relative;
        top: -5px;
    }
    .img-head {
        width: 30px;
        height: 30px;
        border-radius: 25px;
        position: relative;
        top: 5px;
    }
    .ImgUrl{
        position: absolute;
        top: -45px;
        left: 260px;
        width: 80px;
        height: 80px;
    }
    .ImgUrl .avatar-uploader{
        width: 80px;
        height: 80px;
    }
    .avatar-uploader .avatar{
        width: 100%;
        height: 100%;
    }
    .adviser-div .adviser-set{
        display: none;
    }
    .adviser-div:hover .adviser-name{
        display: none;
    }
    .adviser-div:hover .adviser-set{
        display: block;
        cursor: pointer;
    }
</style>

<script>
import API from '../api.js'
import validate from '@/lib/validate.js'
import utils from '@/lib/utils.js'
import editTag from '@/components/editTag.vue'
export default {
    components:{
        editTag,
    },
    data() {
        return {
            myApi:{setUserTag:API.addPostCode},        //设置标签
            setApi:{getUserTag:API.getPostList},    //获取标签
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
            oCap: {                 //能力
                idttTypes:[],  //证件类型
                
                accountStatus:[]  //账号状态

                
            },
            bShowAddDlg: false,         //显示添加窗口
            oAddDlgData: {             //添加弹窗数据
                name: '',//账户名
                nickName: '',//昵称
                realName:"", //真实姓名
                idttType:'1',  //证件类型
                idttNo:'',  //证件号
                realSex:'', //性别
                hdImgUrl:'',//头像
                departIds:'', //部门
                postCode:[], //岗位
                roleCode:[], //角色
                mobile:'', //手机号
            },
            hdImgPath:'',//头像路径
            oAddDlgRules: {            //添加弹窗校验规则
                realName:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                idttNo:[
                    { required: true, message: '不能为空', trigger: 'blur' },
                ],
                loginPwd: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: validate.validatePassword, trigger: 'blur' }
                ],
                checkLoginPwd: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            validate.validate2Password(rule, value, callback, this.oAddDlgData.loginPwd)
                        },
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    { validator: validate.validatePhoneNumber, trigger: 'blur' },
                ],
            },
            bShowPwdDlg: false,
            oPwdDlgData: {
                loginPwd: '',
                checkLoginPwd: ''
            },
            oPwdDlgRules: {
                loginPwd: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: validate.validatePassword, trigger: 'blur' }
                ],
                checkLoginPwd: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            validate.validate2Password(rule, value, callback, this.oPwdDlgData.loginPwd)
                        },
                        trigger: 'blur'
                    }
                ],
            },

            aRoleList: [],
            bShowRoleDlg: false,
            oRoleDlgData: {
                roleIds: [],
            },

            bShowEmailDlg: false,  //邮箱
            oEmailDlgData: {   //邮箱
                email: '',
            },
            oEmailDlgRules: {
                email: [
                    { validator: validate.validateEmail, trigger: 'blur' }
                ],
            },

            bShowMobileDlg: false,  //手机号
            oMobileDlgData: {
                mobile: '',
            },

            oModifyDlgData: {             //修改弹窗数据
                departId: '',
                positionId: '',
                name: '',
                nickName: ''
            },
            oModifyDlgRules: {            //修改弹窗校验规则
                name: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                ]
            },
            bShowNameDlg:false,
            oNameDlgData: {   //用户名
                name: '',
            },
            bShowNickNameDlg:false,
            oNickNameDlg: {  //昵称
                nickName:''
            },

            bShowStatusDlg:false,  //状态
            oStatusDlgData: {   //用户名
                status: '1',
            },
            bShowAccount:false, //修改用户信息
            bShowSection:false,  //显示
            allSection:[], //所有部门
            departId:'', //部门id
            selectStatus:'', //用户状态

            userPostList:[],  //部门列表
            PosiCode:[],  //显示code
            aSelectedPostCode:[],  //所有数组,
            bShowTag:false,  //显示弹窗
            oBasicData:{   //显示内容
                tag:[],  //标签
                id:"",
                name:''
            },
            userRoleList:[],  //角色列表
            aSelectedRoleList:[], //所有角色数组
            departIds:'', //部门搜索
            postCodeSearch:'',  //岗位搜索
            roleCodeSearch:'', //角色搜索
        }
    },
    watch:{
        selectStatus(newVal,oldVal){
            if(newVal != oldVal){
                this.getTableData();
            }
        },
        departIds(newVal,oldVal){
            if(newVal != oldVal){
                this.getTableData();
            }
        },
        postCodeSearch(newVal,oldVal){
            if(newVal != oldVal){
                this.getTableData();
            }
        },
        roleCodeSearch(newVal,oldVal){
            if(newVal != oldVal){
                this.getTableData();
            }
        }
    },
    methods: {
        formatMaskCatagory(mask,aMask) {  //格式化状态
            return utils.getDictLabel(mask, aMask, 'code');
        },
        formatMaskStatus(mask,aMask) {  //格式化状态
            return utils.getDictStatus(mask, aMask, 'valueMask');
        },
        addPicturehd(file, fileList){  //添加理财顾问个人头像
            var fileform = new FormData();
            fileform.append("upf", file.raw);
            fileform.append("pattern", '/heart/saas/march/security/upload/bg/usr/head');
            var self = this;
            API.uploadImage(fileform).then((res) => {
                if(res.data.code =='OK'){
                    this.oAddDlgData.hdImgUrl = res.data.data;
                    this.hdImgPath = res.data.data;
                }
            });
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
        updateAccount(row){  //显示修改
            this.bShowAccount=true;
            this.oAddDlgData.realSex=row.realSex;
            this.oAddDlgData.realName=row.realName;
            this.oAddDlgData.idttType=row.idttType+'';
            this.oAddDlgData.idttNo=row.idttNo;
        },
        updateUser(){  //修改用户
            this.$refs.updateDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data={
                    usrId:this.oCurrRowData.usrId,
                    realName: this.oAddDlgData.realName,
                    idttType: this.oAddDlgData.idttType,
                    idttNo: this.oAddDlgData.idttNo,
                    realSex: this.oAddDlgData.realSex
                }
                API.updateUser(data).then((res)=>{
                    if (res.data.code === 'OK') {
                        this.bShowAccount = false;
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
                })
            })
            
        },
        showAddDlg() {              //显示添加弹窗
            this.bShowAddDlg = true;
            this.$refs.addDlgForm ? this.$refs.addDlgForm.resetFields() : '';
            this.oAddDlgData.nickName='';
            this.oAddDlgData.realName='';
            this.oAddDlgData.name='';
            this.oAddDlgData.idttNo='';
            this.oAddDlgData.realSex='';
            this.oAddDlgData.hdImgUrl='';
        },
        addUser() {                 //添加用户
            this.$refs.addDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var postCodeNum=0;
                var roleCodeNum=0;
                this.oAddDlgData.postCode.forEach((v,k)=>{
                  postCodeNum+=(v-0);  
                })
                this.oAddDlgData.roleCode.forEach((v,k)=>{
                    roleCodeNum+=(v-0);
                })

                var data = {
                    name: this.oAddDlgData.name,
                    nickName: this.oAddDlgData.nickName,
                    realName: this.oAddDlgData.realName,
                    idttType: this.oAddDlgData.idttType,
                    idttNo: this.oAddDlgData.idttNo,
                    realSex: this.oAddDlgData.realSex,
                    hdImgUrl:this.hdImgPath,
                    departId:this.oAddDlgData.departIds,
                    postCode:postCodeNum,
                    roleCode:roleCodeNum,
                    mobile:this.oAddDlgData.mobile
                }
                API.addUser(data).then((res) => {
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
                })
            });
        },
        handleCommand(command) {    //处理每个用户的操作
            switch (command) {
                case 'password':
                    this.bShowPwdDlg = true;
                    this.$refs.pwdDlgForm ? this.$refs.pwdDlgForm.resetFields() : '';
                    break;
                case 'updateStatus':
                    this.bShowStatusDlg=true;
                    this.oStatusDlgData.status=this.oCurrRowData.status+'';
                    break;
                case 'updatenickName':
                    this.bShowNickNameDlg = true;
                    this.$refs.nickNameDlgForm ? this.$refs.nickNameDlgForm.resetFields() : '';
                    this.oNickNameDlg.nickName = this.oCurrRowData.nickName;
                    break;
                case 'updateName':
                    this.bShowNameDlg = true;
                    this.$refs.NameDlgForm ? this.$refs.NameDlgForm.resetFields() : '';
                    this.oNameDlgData.name = this.oCurrRowData.name;
                    break;
                case 'email':
                    this.bShowEmailDlg = true;
                    this.$refs.emailDlgForm ? this.$refs.emailDlgForm.resetFields() : '';
                    this.oEmailDlgData.email = this.oCurrRowData.email;
                    break;
                case 'mobile':
                    this.bShowMobileDlg = true;
                    this.$refs.mobileDlgForm ? this.$refs.mobileDlgForm.resetFields() : '';
                    this.oMobileDlgData.mobile = this.oCurrRowData.mobile;
                    break;
            }
        },
        modifyUserStatus(){  //修改用户状态
            var data = {
                usrId: this.oCurrRowData.usrId,
                status:this.oStatusDlgData.status
            }
            API.modifyUserStatus(data).then((res)=>{
                if (res.data.code === 'OK') {
                    this.bShowStatusDlg = false;
                    this.$notify({
                        message: '修改状态成功',
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
        },
        deleteAccount(row){ //删除用户
            this.$confirm('确认删除用户： ' + row.name, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.deleteUser(row);
            }).catch(() => {
            });
        },
        deleteUser(row) {          //删除
            var data = {
                usrId: row.usrId,
            };
            API.deleteUserSe(data).then((res) => {
                if (res.data.code === 'OK') {
                    this.$notify({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getTableData();
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            });
        },
        modifyUserPwd() {          //重置密码
            this.$refs.pwdDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    usrId: this.oCurrRowData.usrId,
                    logpwd: this.oPwdDlgData.loginPwd
                };
                API.modifyUserPwd(data).then((res) => {
                    if (res.data.code === 'OK') {
                        this.bShowPwdDlg = false;
                        this.$notify({
                            message: '修改密码成功',
                            type: 'success'
                        });
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                });
            });
        },
        modifyUserEmail() {          //修改email
            this.$refs.emailDlgForm.validate((valid) => {
                if (!valid) {
                    return false;
                }
                var data = {
                    usrId: this.oCurrRowData.usrId,
                    email: this.oEmailDlgData.email
                };
                API.modifyUserEmail(data).then((res) => {
                    if (res.data.code === 'OK') {
                        this.bShowEmailDlg = false;
                        this.$notify({
                            message: '修改邮箱成功',
                            type: 'success'
                        });
                    } else {
                        this.$notify({
                            message: res.data.msgView,
                            type: 'warning'
                        });
                    }
                });
            });
        },
        modifyUserMobile() {          //修改手机号
            var data = {
                usrId: this.oCurrRowData.usrId,
                mobile: this.oMobileDlgData.mobile
            };
            API.modifyUserMobile(data).then((res) => {
                if (res.data.code === 'OK') {
                    this.bShowMobileDlg = false;
                    this.$notify({
                        message: '修改手机号成功',
                        type: 'success'
                    });
                    this.getTableData();
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            });
        },
        modifyUserName(){  //用户名
            var data = {
                usrId: this.oCurrRowData.usrId,
                name: this.oNameDlgData.name
            };
            API.modifyUserName(data).then((res) => {
                if (res.data.code === 'OK') {
                    this.bShowNameDlg = false;
                    this.$notify({
                        message: '修改用户名成功',
                        type: 'success'
                    });
                    this.getTableData();
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            });
        },
        modifyUsernickName(){  //昵称
            var data = {
                usrId: this.oCurrRowData.usrId,
                nickName: this.oNickNameDlg.nickName
            };
            API.modifyUsernickName(data).then((res) => {
                if (res.data.code === 'OK') {
                    this.bShowNickNameDlg = false;
                    this.$notify({
                        message: '修改昵称成功',
                        type: 'success'
                    });
                    this.getTableData();
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            });
        },
        resetFunc(){ //重置按钮
            this.szFindValue='';
            this.selectStatus='';
            this.departIds='';
            this.postCodeSearch='';
            this.roleCodeSearch='';
            this.getTableData();
        },
        returnFunction(){  //设置标签后回调
            this.getPostList();
            this.getRoleList();
            this.getTableData();
        },
        getTableData() {  //获取表格数据
            var data = {
                pageSize: this.pageConfig.pageSize,
                pageNumber: this.pageConfig.pageNumber,
                pageKey: this.szFindValue,
                status:this.selectStatus,
                departIds:this.departIds,
                postCode:this.postCodeSearch,
                roleCode:this.roleCodeSearch,
            };
            this.bTableLoading = true;
            API.getUserList(data).then((res) => {
                this.bTableLoading = false;
                this.aTableData = res.data.data.list;
                this.pageConfig.pageSize = res.data.data.pageSize;
                this.pageConfig.totalRow = res.data.data.totalRow;
                this.pageConfig.totalPage = res.data.data.totalPage;
                if (Array.isArray(this.aTableData)) {
                    this.aTableData.forEach((v, k) => {
                        this.aSelectedPostCode[k] = [];
                        this.userPostList.forEach((m, n) => {
                            if (v.joinPostCode & m.code) {
                                this.aSelectedPostCode[k].push(m.code);
                            }
                        });
                    });
                }
                if (Array.isArray(this.aTableData)) {
                    this.aTableData.forEach((v, k) => {
                        this.aSelectedRoleList[k] = [];
                        this.userRoleList.forEach((m, n) => {
                            if (v.joinRoleCode & m.code) {
                                this.aSelectedRoleList[k].push(m.code);
                            }
                        });
                    });
                }  
            });
        },
        addDepart(){
            this.bShowSection=true;
            this.departId="";
        },
        deleteDepart(row){
            this.$confirm('确认解绑部门： ' + row.name, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                this.departId='';
                this.setSection('departId');
            }).catch(() => {
            });
        },
        getAllDepart(){  //获取所有部门
            var data={
            }
            API.getAllDepart(data).then((res)=>{
                if(res.data.code=="OK"){
                    this.allSection=res.data.data;
                }
            })
        },
        setSection(departId){
            var data={
                usrId:this.oCurrRowData.usrId,
                departId:this.departId
            }
            API.contactSection(data).then((res)=>{
                if(res.data.code=="OK"){
                    if (res.data.code === 'OK') {
                    this.bShowSection = false;
                    this.$notify({
                        message: departId == 'departId' ? '解除成功':'绑定成功',
                        type: 'success'
                    });
                    this.getTableData();
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
                }
            })
        },
        getAllStatus(){
            var data = {
                url: '/global/usr/status',
            };
            API.getDict(data).then((res) => {
                if(res.data.code=='OK'){
                    res.data.data.forEach((v,k) =>{
                        v.name = v.name +'';
                        v.valueMask = v.valueMask+'';
                    })
                    this.oCap.accountStatus = res.data.data;
                }
            })
        },
        showTag(row){ //显示设置弹窗
            this.myApi={setUserTag:API.addPostCode},        //设置标签
            this.setApi={getUserTag:API.getPostList},    //获取标签
            this.bShowTag=true;
            var ar = utils.getItemsByAND(this.userPostList,row.joinPostCode,'code');
            var ar1=[];
            ar.forEach((item)=>{
                ar1.push(item.code);
            })
            this.oBasicData.tag=ar1;
            this.oBasicData.id=row.usrId;
            this.oBasicData.name=row.name;
        },
        showRole(row){
            this.myApi={setUserTag:API.addRoleCode}
            this.setApi={getUserTag:API.getRoleList}
            this.bShowTag=true;
            var ar = utils.getItemsByAND(this.userRoleList,row.joinRoleCode,'code');
            var ar1=[];
            ar.forEach((item)=>{
                ar1.push(item.code);
            })
            this.oBasicData.tag=ar1;
            this.oBasicData.id=row.usrId;
            this.oBasicData.name=row.name;
        },
        getPostList(){ //获取岗位列表
            var data={
            }
            API.getPostList(data).then((res)=>{
                if(res.data.code=="OK"){
                    this.userPostList=res.data.data;
                    this.getTableData();
                }
            })
        },
        getRoleList(){  //获取角色列表
            var data={
            }
            API.getRoleList(data).then((res)=>{
                if(res.data.code=="OK"){
                    this.userRoleList=res.data.data;
                    this.getTableData();
                }
            })
        },
        getidttTypesList(){ //获取证件类型
            var data={
                url:'/global/usr/certifitype'
            }
            API.getDict(data).then((res) => {
                if(res.data.code=='OK'){
                    res.data.data.forEach((v,k) =>{
                        v.name = v.name +'';
                        v.valueMask = v.valueMask+'';
                    })
                    this.oCap.idttTypes = res.data.data;
                }
            })

        },
    },
    created() {
        this.$nextTick(function () {
            this.$refs.keyword.$el.querySelector('[icon=search]').focus();
        });
        document.title = '用户管理';
        this.getAllDepart();
        this.getAllStatus();
        this.getPostList();
        this.getRoleList();
        this.getidttTypesList();
    }
}
</script>


