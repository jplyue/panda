<template>
    <div :id="ids" class="widthp100"></div>
</template>
<style scoped>
    .widthp100{
        width: 100%;
    }
</style>

<script>
import axios from 'axios';
import Editor from 'wangeditor'
export default {
    props: {
        value: {
            type: String,
            default: ''
        },
    },
    computed: {
        teamCode() {      // 角色
            return this.$parent.$parent.$parent.$parent.$parent.$store.state.oCurrUser.teamCode;
        },
    },
    data() {
        var ids = 'editor' + new Date().getTime() + Math.floor(Math.random() * 1000);
        return {
            ids: ids,
            content: this.value ? this.value : '',
            editor: {},
            iInterval : 0,
        }
    },
    watch: {
        value: function (newValue) {
            if (this.content != newValue) {
                this.setContent(newValue);
            }
        }
    },
    methods: {
        // /*选择上传图片切换*/
        // onFileChange(e) {
        //     var self = this;
        //     var fileInput = e.target;
        //     if (fileInput.files.length == 0) {
        //         return;
        //     }
        //     this.editor.focus();
        //     if (fileInput.files[0].size > 1024 * 1024 * 100) {
        //         this.$notify({
        //             message: '图片不能大于512KB',
        //             type: 'warning'
        //         });
        //     }
        //     var data = new FormData();
        //     data.append('picture', fileInput.files[0]);
        //     axios.post('/api/heart/team/attach/picture/upload', data).then((res) => {
        //         if (res.data.code === 'OK') {
        //             self.editor.insertEmbed(self.editor.getSelection().index, 'image', '/api' + res.data.data);
        //         } else {
        //             this.$notify({
        //                 message: res.data.msgView,
        //                 type: 'warning'
        //             });
        //         }
        //     })
        // },
        // /*点击上传图片按钮*/
        // imgClick() {
        //     /*内存创建input file*/
        //     var input = document.createElement('input');
        //     input.type = 'file';
        //     input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
        //     input.onchange = this.onFileChange;
        //     input.click();
        // },
        setContent (html) {
            this.editor.txt.html(html);
        },
        addPicture(files, insert){     //添加图片
            var fileform = new FormData();
            fileform.append("upf", files[0]);
            fileform.append("pattern", '/saas/team/'+ this.teamCode +'/upload/bg/editor');
            axios.post('/staticapi/up/do', fileform).then((res) => {
                if(res.data.code =='OK'){
                    insert(res.data.data)
                }
            });
        },

    },
    mounted() {
        var editor = new Editor('#' + this.ids);
        this.editor = editor;
        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            // 'quote',  // 引用
            // 'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            // 'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ];
        // 关闭粘贴样式的过滤
        // editor.customConfig.pasteFilterStyle = false;               //粘贴后清除样式
        editor.customConfig.uploadImgMaxSize = 20 * 1024 * 1024;    //上传图片大小
        editor.customConfig.zIndex = 100;
        this.iInterval = setInterval(()=>{
            editor.change(true)
        }, 500);
        editor.customConfig.onchange = (html) => {
            this.content = html;
            this.$emit('update:value', html);
        }
        editor.customConfig.customUploadImg = this.addPicture;
        editor.create();
        this.setContent(this.content);
    },
    beforeDestroy() {
        if (this.iInterval) {
            clearInterval(this.iInterval);
        }
    }
}
</script>

