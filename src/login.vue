<template>
    <div class="zy-div-container login-container">
        <img class="img-login" src="/static/themes/theme1/image/login-4.jpg" alt="" galleryimg="no" border="0">
        <div class="div-login">
            <div class="div-login-title">业务配置平台</div>
            <div class="div-explain">用户名： </div>
            <el-input type="text" v-model="username" placeholder="请输入用户名" @keyup.enter.native="login"></el-input>
            <div class="div-explain marginT30">密&nbsp;码： </div>
            <el-input type="password" v-model="password" placeholder="请输入密码" @keyup.enter.native="login"></el-input>
            <el-row v-if="needCod" class="marginT30">
                <el-col :span="12" class="paddingL0">
                    <el-input type="text" v-model="logCode" placeholder="图形验证码" @keyup.enter.native="login"></el-input>
                </el-col>
                <el-col :span="12" class="paddingL0">
                    <img :src="imgUrl" id="code" class="img-validate" onclick="javascript:this.src='api/captpic.jpg?tm='+Math.random();" alt="点击刷新" />
                </el-col>
            </el-row>
            <div>
                <el-button type="primary" class="widthP100 marginT30 fontSize16" @click="login" :disabled="bLanding">{{bLanding ?'登录中...' : '登 &nbsp; 录'}} </el-button>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>

<script>
import API from './api.js'
export default {
    data() {
        return {
            username: '',
            password: '',
            logCode: '',            //验证码
            needCod: false,         //是否需要验证码
            msg: '',                //提示信息
            imgUrl: '',             //验证码路径
            bLanding: false         //是否在登录中
        }
    },
    methods: {
        login() {
            if (this.username === '' || this.password === '' ) { 
                this.$notify({
                    message: '用户名或密码不能为空',
                    type: 'warning'
                });
                return;
            }
            this.bLanding = true;
            API.getRsa().then((res) => {    //获取随机码
                var modulus = res.data.data.modulus
                var exponent = res.data.data.exponent;
                var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
                var newPassword=RSAUtils.encryptedString(publicKey, this.password);
                var data = { 
                    pvdname:this.username,  //用户名
                    pvdpwd:newPassword,  //密码 
                    captpic: this.logCode, 
                }
                API.doLogin(data).then((res) => {   //登录
                    this.bLanding = false;
                    if (res.data.code === 'OK') {
                        localStorage.setItem('selectMenu', '');
                        localStorage.setItem('openMenu', '');
                        this.$router.push('/main/homepage')
                    } else {
                        this.needCod = true;
                        if (this.logCode == '' && res.data == 'CaptchaPictureAbsent') {
                            this.$notify({
                                message: '图片验证码未提供',
                                type: 'warning'
                            });
                        }else{
                            
                            this.$notify({ 
                                message: res.data.msgView,
                                type: 'warning'
                            });
                        }
                        this.imgUrl = '/api/captpic.jpg?tm=' + new Date().getTime();
                    }
                })
            })
        }
    },
    created() {
        this.imgUrl = '/captpic.jpg';
    }
}
</script>
