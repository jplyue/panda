<template>
  <div class="edit-tag">
    <el-dialog title="设置标签" :visible.sync="isCloed" custom-class="width360 " :close-on-press-escape="false" >
        <div class="">
            <p class="edit-tag-title">
                <i class="iconfont icon-biaoqian fontSize14 marginR5"></i>{{title}}
            </p>
            <div class="edit-tag-content">
                <el-checkbox-group v-model="selectList" class="zy-div-module zy-div-module-small" fill="#dcedff">
                    <el-checkbox-button  v-for="(item,$index) in dictList" :label="item.valueMask" :key="$index" class="but-margin">
                        <template>
                            <div class="check-right">
                                <div class="check-name">{{item.name}}</div>
                            </div>
                        </template>
                    </el-checkbox-button>
                </el-checkbox-group>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isCloed = false">取消</el-button>
            <el-button @click="setDict" type="primary">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<style scoped>
    .edit-tag-title{
        padding-left: 13px;
        font-size: 14px;
        letter-spacing: 1.4px;
        color: #8b9aab;
        margin-bottom: 15px;
    }
    .edit-tag-content{
        padding-left: 32px;
    }
</style>
<script>
import API from './api.js'
export default {
    props:{
        isshow: {
            type: Boolean,
            default: false,
        },
        selectData:{   //选中列表
            type: Array,
            default: function(){return []}
        },
        addId:{   //路径
            type:String,
            default:'',
        },
        title:{   //名称
            type:String,
            default:'',
        },
        myApi:{    //添加的Api
            type: Object,
            default: function(){return {setUserTag:""}}
        },
        parentUrl:{   //路径
            type:String,
            default:'',
        },
        rectFunction:{
            type: Function,
            default: function(){return []}
        }
    },
    data(){
        return{
            isCloed:false,          //弹窗是否显示
            selectList:[],   //选中列表
            dictList:[],    //标签列表
            isTagShow:false, //编辑列表弹窗
        }
    },
    methods: {
        getDictList(){
            var data = {
                url: this.parentUrl,
            }
            API.getDict(data).then((res)=>{
                if(res.data.code=="OK"){
                    this.dictList = res.data.data;
                }
            })
        },
        setDict(){   //设置标签
            var tag = 0;
            this.selectList.forEach((v,k)=>{
                tag += (v-0);
            })   
            var data={
                tag:tag,
                usrId:this.addId,
                teamId:this.addId
            }
            this.myApi.setUserTag(data).then((res) => {
                if (res.data.code === 'OK') {
                    this.isCloed=false
                    this.$notify({
                        message: '设置成功！',
                        type: 'success'
                    });
                    this.rectFunction();
                } else {
                    this.$notify({
                        message: res.data.msgView,
                        type: 'warning'
                    });
                }
            });
        },
    },
    watch: {
        isCloed: function (newValue, oldValue) {
            this.$emit('update:isshow', newValue)
        },
        isshow: function (newValue, oldValue) {
            this.isCloed = newValue;
            if(newValue){
                this.selectList=this.selectData;
                this.getDictList();
            }
        },
        isTagShow:function(newValue, oldValue){
            if(!newValue){
                this.getDictList();
            }
        }
    },
    created() {
        // this.getDictList();
        // this.$nextTick(function () {
        //     this.getDictList();
        // });
    }

}
</script>