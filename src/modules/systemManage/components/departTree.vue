<template>
    <div>
        <div class="tem">
            <div class="tem-p" @click="handleoCurrRowData(list)">
                <div class="tem-common tem-div1" :style="{'padding-left':(list.depth-0.6)*30+'px'}" v-on:click="toggleClick"> <i v-if="list.childCnt!=0" class="el-icon-arrow-down"></i> <span :class="{'childCnt':list.childCnt==0}">{{list.raw.name}}</span></div>
                <div class="tem-common"><span>{{list.raw.priority === '' ? '' : list.raw.priority}}</span></div>
                <div class="tem-common" style="width:220px"><span>{{list.raw.description === '' ? '' : list.raw.description}}</span></div>
                <div class="tem-common" style="width:220px"><span>{{list.raw.officeAddress === '' ? '' : list.raw.officeAddress}}</span></div>
                <div class="tem-common adusr" style="width:140px">
                    <span v-if="list.adusrName ==''"><span class="adusrSpan" @click="bindData('binding',list)">绑定</span></span>
                    <span v-if="list.adusrName !=''"><span class="adusrSpan" @click="bindData('untie',list)">解绑</span></span>
                    <span v-else>
                        <span class="adusr-text">--</span>
                    </span>
                    <span class="adusrName">
                        {{list.adusrName}}
                    </span> 
                </div>
                <div class="tem-common">
                    <span>{{list.raw.status == '1' ? '正常' : ''}}</span>
                    <span>{{list.raw.status == '2' ? '冻结' : ''}}</span>
                    <span>{{list.raw.status == '4' ? '删除' : ''}}</span>
                </div>
                <div class="tem-common" style="width:121px;margin-right:-1px;">
                    <el-dropdown trigger="click" @command="handleCommand">
                        <span class="el-dropdown-link el-button--text" >
                            操作
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="addTree">添加</el-dropdown-item>
                            <el-dropdown-item command="updateTree">修改</el-dropdown-item>
                            <el-dropdown-item command="deleteTree">删除</el-dropdown-item>
                            <el-dropdown-item command="departsTree">部门位置</el-dropdown-item>
                            <el-dropdown-item command="statusTree">修改状态</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="tem-c">
                <depart-tree :class="{'clearDisplay':isShow}" v-for="itemc in list.children" :list="itemc" :key="itemc.id" @rectFunction="returnFunction" @bindDatas="bindFunction"></depart-tree>
            </div>
        </div>
    </div>      
</template>
<style scoped>
    .adusrSpan{
        cursor: pointer;
    }
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

</style>

<script>
import validate from '@/lib/validate.js'
import utils from '@/lib/utils.js'
import departTree from './departTree.vue'
export default {
    name:'departTree',
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
            this.$emit('rectFunction', data) 
        },
        returnFunction(data){
            this.$emit('rectFunction', data)
        },  

        handleoCurrRowData(item){
            this.oCurrRowData=item;
        },

        bindData(str,item){
            var data={
                command:str,
                item:item
            }
            this.$emit('bindDatas', data) 
        },
        bindFunction(data){
            this.$emit('bindDatas', data)
        }


    },
    watch: {
        
    },
    created() {
        
    }
}
</script>
