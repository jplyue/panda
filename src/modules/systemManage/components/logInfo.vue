<template>
    <div class="zy-panel">
        <div class="zy-member">
            <el-form label-width="100px" :model="oLogData" ref="addDlgForm" :inline="false" label-position="left" class="marginT20">
                <div class="flex-box">
                    <div class="width450 marginL80 marginR20">
                        <el-form-item label="用户名" prop="name" class="">
                            <span>{{oLogData.usrName}}</span>
                        </el-form-item>   
                        <el-form-item label="功能模块" prop="" class="">
                            <span>{{oLogData.raw.funcModule}}</span>
                        </el-form-item>   
                        <el-form-item label="请求路径" prop="" class="">
                            <span>{{oLogData.raw.actionUrl}}</span>
                        </el-form-item>  
                        <el-form-item label="IP归属地址" prop="" class="">
                            <span>{{oLogData.raw.hostIpAddrss}}</span>
                        </el-form-item>                         
                        <el-form-item label="操作结果" prop="" class="">
                            <span>{{oLogData.raw.doResultMsg}}</span>
                        </el-form-item>          
                    </div>
                    <div class="width450">                                             
                        <el-form-item label="主机 ip" prop="" class="">
                            <span>{{oLogData.raw.hostIp}}</span>
                        </el-form-item>
                        <el-form-item label="功能名称" prop="" class="">
                            <span>{{oLogData.raw.funcName}}</span>
                        </el-form-item> 
                        <el-form-item label="请求方法" prop="" class="">
                            <span>{{oLogData.raw.actionMethod}}</span>
                        </el-form-item>
                        <el-form-item label="IP归属运营商" label-width="100px" prop="" class="">
                            <span>{{oLogData.raw.hostIpCarrier}}</span>
                        </el-form-item>
                        <el-form-item label="操作时间" prop="" class="">
                            <span>{{oLogData.raw.dotime}}</span>
                        </el-form-item> 
                    </div>
                </div>
                <div class="marginL80">
                    <el-form-item label="请求参数" prop="" class="">
                        <span>{{oLogData.raw.actionParas}}</span>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import API from '../api.js'
export default {
    props:{
        memberId: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            oLogData:{
                raw:''
            }, //基本信息
        }
    },
    methods: {
        getLogDetail() {
            var data = {
                dologId: this.memberId
            }
            API.getLogDetail(data).then((res) => {
                if (res.data.code == 'OK') {
                    this.oLogData = res.data.data;
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            })
        }
    },
    created() {
        this.getLogDetail();
    }
}
</script>