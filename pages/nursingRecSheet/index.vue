<template>
    <div id="app">
        <!-- 列表使用 -->
        <mt-cell v-for="(item,index) in formList" :title="item.assessName" :key="index"
                 :to="{path:'nursingRecSheet/record',query:{title: item.assessName, tempId: item.assessCode}}"
                 is-link>
        </mt-cell>
        <mt-cell title="体征录入"
                 :to="{path:'nursingRecSheet/signEntry',query:{a:1, title: '体征录入'}}"
                 is-link>
        </mt-cell>
        <mt-cell title="批量体征录入"
                 :to="{path:'nursingRecSheet/batchSignEntry',query:{a:1, title: '批量体征录入'}}"
                 is-link>
        </mt-cell>
        <mt-cell title="护理记录"
                 :to="{path:'nursingRecSheet/nursingRecord',query:{a:1, title: '护理记录'}}"
                 is-link>
        </mt-cell>
    </div>
</template>

<style></style>

<script>
    import {Toast} from 'mint-ui'
    import {mapMutations} from 'vuex'

    export default {
        data() {
            return {
                formList: []
            }
        },

        mounted() {
            this.getFormList();
        },
        computed: {},
        methods: {
            ...mapMutations([
                'setTempList'
            ]),
            getFormList() {
                var vm = this;
                this.$http.post('mobile/emr/assessmentsheet/getAssessList', {
                    deptCode: '1010320',
                    operator: '12917'
                }).then(res => {
                    if (res.status === 200) {
                        //vm.setTempList(res.data);
                        vm.formList = res.data;
                    }
                }).catch(error => {
                    Toast({
                        message: '获取科室表单列表失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            }
        }
    }
</script>