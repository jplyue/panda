<template>
    <div>
        <div v-if="dlgShow">
            <my-upload field="img"
                langType="zh"
                :langExt="langExt"
                @crop-success="cropSuccess"
                v-model="dlgShow"
                :width="width"
                :height="height"
                :noCircle="true"
                :noSquare="false"
                :noRotate="false"
            >
            </my-upload>
        </div>
        <slot></slot>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import myUpload from 'vue-image-crop-upload'
import API from './api.js'
export default {
    components:{
        myUpload:myUpload,
    },
    props:{
        isshow: {
            type: Boolean,
            default: false,
        },
        value:{       //图片保存路径
            type: String,
            default: '',
        },
        width:{        //图片截取后的宽度
            type:Number,
            default:300,
        },
        height:{       //图片截取后的高度
            type: Number,
            default: 200,
        },
        pattern:{       //图片保存目录
            type: String,
            default: '/saas/team/zirong/upload',
        },
    },
    data(){
        return{
            dlgShow:false,
            imgDataUrl:'',
            langExt:{
                hint: '点击，或拖动图片至此处',
                loading: '正在上传……',
                noSupported: '浏览器不支持该功能，请使用IE10以上或其他现在浏览器！',
                success: '上传成功',
                fail: '图片上传失败',
                preview: '预览',
                btn: {
                    off: '取消',
                    close: '关闭',
                    back: '上一步',
                    save: '保存'
                },
                error: {
                    onlyImg: '仅限图片格式',
                    outOfSize: '单文件大小不能超过 ',
                    lowestPx: '图片最低像素为（宽*高）：'
                }
            }
        }
    },
    methods: {
        cropSuccess(imgDataUrl, field){   //图片截取完成事件
            var $Blob= this.getBlobBydataURI(imgDataUrl,'image/png');
            var fileform = new FormData();
            fileform.append("upf", $Blob);
            fileform.append("pattern", this.pattern);
            API.uploadImage(fileform).then((res) => {
                if(res.data.code =='OK'){
                    this.imgDataUrl = res.data.data;
                    this.$emit('recFunction', res.data.data);   //回调事件
                    this.$emit('update:value', res.data.data);
                }
            });
		},
        getBlobBydataURI(dataURI,type) {    //把base64流转换成 blob 对象
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for(var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type:type });
        }
    },
    watch: {
        dlgShow: function (newValue, oldValue) {
            this.$emit('update:isshow', newValue)
        },
        isshow: function (newValue, oldValue) {
            this.dlgShow = newValue;
        },
    },
    mounted() {
    },
}
</script>
