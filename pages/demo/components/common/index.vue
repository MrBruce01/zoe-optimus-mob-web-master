<template>
    <zm-container class="scss-test">
        <zm-header height="41px">
            <mt-header title="组件使用实例">
                <router-link to="/" slot="left">
                    <mt-button icon="back">返回</mt-button>
                </router-link>
                <mt-button icon="more" slot="right"></mt-button>
            </mt-header>
        </zm-header>
        <zm-header height="50px" class="scss-test-1">
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">通用组件</mt-tab-item>
                <mt-tab-item id="2">其它组件1</mt-tab-item>
            </mt-navbar>
        </zm-header>
        <zm-main ref="containerMain">
            <!-- tab-container -->
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <zm-datetime-picker label="日期："
                                        format="yyyy-MM-dd hh:mm:ss"
                                        placeholder="请输入入院时间"
                                        :content.sync="data.dateContent"
                                        v-model="data.date"></zm-datetime-picker>
                    <zm-radio label="单选："
                              :editable="false"
                              :dict-data="dictData"
                              :content.sync="data.radioContent"
                              v-model="data.radio"></zm-radio>
                    <zm-radio label="单选可编辑："
                              :editable="true"
                              :dict-data="dictData"
                              :content.sync="data.radioContent2"
                              v-model="data.radio2"></zm-radio>
                    <zm-checklist label="多选可："
                                  :editable="false"
                                  :dict-data="dictData"
                                  :content.sync="data.checkListContent"
                                  v-model="data.checkList"></zm-checklist>
                    <zm-checklist label="多选可编辑："
                                  :editable="true"
                                  :dict-data="dictData"
                                  :content.sync="data.checkListContent2"
                                  v-model="data.checkList2"></zm-checklist>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <mt-cell title="测试"></mt-cell>
                    <zm-keyboard label="体温键盘：" v-model="keyboardValue"></zm-keyboard>
                </mt-tab-container-item>
            </mt-tab-container>
        </zm-main>
        <zm-footer>
            <mt-button type="primary" @click.native="handleSaveClick">保&nbsp;&nbsp;存</mt-button>
        </zm-footer>
    </zm-container>
</template>
<script>
    import {Toast} from 'mint-ui'
    import ZmKeyboard from '../../../../components/common/keyboard/src/main'

    export default {
        components: {ZmKeyboard},
        asyncData() {
            let dictData = []
            for (let i of Array(20).fill(0).map((v, i) => i)) {
                dictData.push({
                    label: '选项' + i,
                    value: 'code' + i
                })
            }
            return {dictData: dictData}
        },
        head() {
            return {
                title: '通用组件演示'
            }
        },
        data() {
            return {
                selected: '1',
                value: [],
                data: {
                    name: '范小林',
                    sex: '男',
                    age: '35岁',
                    career: '工程师',
                    nation: '汉族',
                    diagnosis: '',
                    checkList: ['code1'],
                    checkListContent: '选项1',
                    radio: 'code1',
                    radioContent: '选项1',
                    checkList2: ['code1'],
                    checkListContent2: '选项1',
                    radio2: 'code1',
                    radioContent2: '选项1',
                    date: '2017-12-05 09:20:12',
                    dateContent: '2017-12-05 09:20:12'
                },
                keyboardValue: ''
            }
        },
        watch: {
            selected() {
                this.$refs.containerMain.hideScroll()
            },
            keyboardValue(value) {
                alert('监听改变:' + value)
            }
        },
        methods: {
            handleSaveClick() {
                window.console.log(this.data)
                Toast({
                    message: '保存操作',
                    iconClass: 'icon icon-success',
                    duration: 1000
                })
            }
        }
    }
</script>
<style lang="scss">
    .scss-test {

    .scss-test-1 {
        background-color: white;
    }

    }

    .background-color {

    .mint-field-core {
        background-color: #dbe1ec;
    }

    }
</style>
