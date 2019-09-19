<template>
    <el-cascader :options="chinaArea" v-model="selectedOptions" :props="props" size="small">
    </el-cascader>
</template>
<script>
import chinaArea from '../../static/lib/china-area-element.json'
export default {
    // props: {
    //     value: {
    //         type: Array,
    //         default: []
    //     }
    // },
    data() {
        return {
            chinaArea: chinaArea,
            selectedOptions: [],
            props: {
                value: 'name',
                label: 'name',
                children: 'children'
            },
        };
    },
    watch: {
        selectedOptions: function (newValue, oldValue) {
            this.$emit('update:value', newValue)
        },
        value: function (newValue, oldValue) {
            this.selectedOptions = newValue;
        },
    }
}
</script>
