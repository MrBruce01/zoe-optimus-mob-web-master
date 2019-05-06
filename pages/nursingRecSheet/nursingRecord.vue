<template>    
    <div>
        <mt-cell v-for="(item,index) in formList" :title="item.assessName" :key="index"
                 :to="{path:'nursingRecSheet/nursingRecordDetail',query:{title: item.assessName, tempId: item.assessCode, deptCode: '1010320'}}"
                 is-link>
        </mt-cell>
    </div>
</template>

<style></style>

<script>
    import {Toast} from 'mint-ui'
    import x2js from 'x2js'

    export default {
        data() {
            return {
                formList: []
            }
        },

        mounted() {
            this.getFormList();
        },

        methods:{
            getFormList() {
                var vm = this;
                this.$http.post('mobile/emr/emr/getDeptNurseTempList', {
                    deptId: '1010320'
                }).then(res => {
                    if (res.status === 200) {
                        let x2 = new x2js(), x = x2.xml2js(res.data)
                        //vm.setTempList(res.data);
                        for(let i = 0; i < x.root.temp.length; i++){
                            this.formList.push({assessName: x.root.temp[i].__text, assessCode: x.root.temp[i]._id});
                        }
                    }
                }).catch(error => {
                    Toast({
                        message: '获取科室护理记录列表失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            }
        }
    }

</script>