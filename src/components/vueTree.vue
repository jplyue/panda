<template>
    <div>
        <div class="tem">
            <div class="tem-p" @click="handleoCurrRowData(list)">
                <div class="tem-common tem-div1" :style="{'padding-left':(list.depth-0.6)*30+'px'}" v-on:click="toggleClick"> <i v-if="list.childCnt!=0" class="el-icon-arrow-down"></i> <span :class="{'childCnt':list.childCnt==0}">{{list.raw.name}}</span></div>
                <div class="tem-common"><span>{{list.raw.priority === '' ? '' : list.raw.priority}}</span></div>
                <div class="tem-common" style="width:200px"><span>{{list.raw.description === '' ? '' : list.raw.description}}</span></div>
                <div class="tem-common">
                    <span>{{list.raw.prop == '1' ? '目录' : ''}}</span>
                    <span>{{list.raw.prop == '2' ? '菜单' : ''}}</span>
                    <span>{{list.raw.prop == '4' ? '操作' : ''}}</span>
                </div>
                <div class="tem-common" style="width:250px"><span>{{list.raw.actionUrl === '' ? '' : list.raw.actionUrl}}</span></div>
                <div class="tem-common" style="width:250px"><span>{{list.raw.expression === '' ? '' : list.raw.expression}}</span></div>
                <div class="tem-common">
                    <span>{{list.raw.status == '' ? '' : ''}}</span>
                    <span>{{list.raw.status == '1' ? '显示' : ''}}</span>
                    <span>{{list.raw.status == '2' ? '隐藏' : ''}}</span>
                </div>
                <div class="tem-common">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link el-button--text" >
                            操作
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="addTree">添加</el-dropdown-item>
                            <el-dropdown-item command="updateTree">修改</el-dropdown-item>
                            <el-dropdown-item command="deleteTree">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="tem-c">
                <vue-tree :class="{'clearDisplay':isShow}" v-for="itemc in list.children" :list="itemc" :key="itemc.id" @rectFunction="returnFunction"></vue-tree>
            </div>
        </div>
    </div>      
</template>
<style scoped>
    .childCnt{
        padding-left: 16px;
    }
    .clearDisplay{
        display: none;
    }
    .tem-p{
        clear: both;
        border-bottom: 1px solid #dfe6ec;
        height: 30px;
        line-height: 30px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .tem-p:hover{
        background-color:rgb(245, 247, 250);
    }
    .tem-p .tem-common{
        float: left;
        width:100px;
        box-sizing: border-box;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space:nowrap;
        overflow: hidden;
        text-align: center;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        height: 100%;
        border-right: 1px solid #dfe6ec;
    }
    .tem-p .tem-div1{
        cursor: pointer;
        padding-left: 5px;
    }
    .tem-p>div:first-of-type{
        width: 298px;
        text-align: left;
    }
    .lastChild{
        background: #f8f8f8;
    }
    .isred{
        color: red;
    }
    .isgreen{
        color: green;
    }


</style>

<script>
import API from './api.js'
import validate from '@/lib/validate.js'
import utils from '@/lib/utils.js'
export default {
    name:'vueTree',
    props:{
        list: {  //编辑数据
            type: Object,
            default: function(){return {}}
        },
    },
    data(){
        return{
            isShow:false,
            oCurrRowData:{}, //当前行数据
        }
    },
    methods: {
        toggleClick(event){  //展开折叠操作
            event.stopPropagation();//阻止冒泡
            var _this = event.currentTarget
            this.isShow=!this.isShow
            if(_this.parentNode.firstChild.firstChild.className=='el-icon-arrow-right'){
                _this.parentNode.firstChild.firstChild.className='el-icon-arrow-down'
            }else{
                _this.parentNode.firstChild.firstChild.className='el-icon-arrow-right'
            }
        },
        handleCommand(command) {    //处理每个用户的操作
            var data={
                command:command,
                item:this.oCurrRowData
            }           
            switch (command) {
                case 'addTree':
                    this.$emit('rectFunction', data)
                    break;
                case 'updateTree':
                    this.$emit('rectFunction', data)
                    break;
                case 'deleteTree':
                    this.$emit('rectFunction', data)
            }
        },
        returnFunction(data){
            this.$emit('rectFunction', data)
        },
        handleoCurrRowData(item){
            this.oCurrRowData=item;
        },
    },
    watch: {
        
    },
    created() {
        
    }
}
</script>
