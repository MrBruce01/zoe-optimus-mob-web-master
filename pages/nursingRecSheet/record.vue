<template>
    <zm-container>
        <!--<mt-header :title=title>
            <router-link to="./" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>-->
        <zm-main ref="containerMain" style="position: absolute;top: 0px;left: 0;right: 0;bottom: 50px;">
            <zm-textfield-list :fieldList="fieldList"></zm-textfield-list>
        </zm-main>
        <!--<input type="text" @focus="inputFocus()" ref="input">-->
        <zm-footer style="position: absolute;bottom: 0;width: 100%;height: 50px;background-color:#00a9fe"
                   @click.native="handleSaveClick">
            <span class="spn">保&nbsp;&nbsp;&nbsp;存</span>
            <!--<mt-button type="primary" @click.native="handleSaveClick" style="width: 100%;">保&nbsp;&nbsp;&nbsp;存</mt-button>-->
        </zm-footer>
    </zm-container>
</template>

<style>
    .spn {
        color: #fff;
        line-height: 50px;
    }
</style>

<!--<script type='text/javascript' src="~/utils/xml2json.js"></script>-->

<!--<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.js"></script>
<script type="text/javascript" src="http://www.jsons.cn/Down/jquery.xml2json.js"></script>-->
<script>
    import {Toast, Indicator, Button} from 'mint-ui'
    import _ from 'lodash'
    import MtCell from '../../node_modules/mint-ui/packages/cell/src/cell.vue'

    import x2js from 'x2js'
    import {mapGetters} from 'vuex'

    export default {
        components: {MtCell},
        layout: 'record',
        head() {
            return {
                title: this.title
            }
        },
        data() {
            return {
                title: this.$route.query.title,
                formData: [],
                formId: '',
                readState: false, // 只读控制
                taskId: '',
                isNew: 1,
                // xmlContent: this.$route.query.xmlContent,
                // tempList: this.$store.state.tempList,
                xmlContent: '',
                tempId: this.$route.query.tempId,
                nodeModelOneList: [],
                nodeModelTwoList: [],
                fieldList: [],
                tempList: [],
                tempContent: [],
                eventNo: this.$route.query.eventNo,
                patientId: this.$route.query.patientId,
                userId: this.$route.query.userId,
                userName: this.$route.query.userName
            }
        },

        computed: {
            ...mapGetters(['getTempList'])
        },

        mounted() {
            this.getEmrAssessmentRecord();
            this.getFormList();
            this.getTemplateDictList();
        },

        methods: {
            getFormList() {
                let vm = this;
                vm.$http.post('mobile/emr/assessmentsheet/getAssessList', {
                    deptCode: '1010320',
                    operator: '12917'
                }).then(res => {
                    if (res.status === 200) {
                        // this.setTempList(res.data);
                        vm.tempList = res.data;
                        for (let i = 0; i < vm.tempList.length; i++) {
                            if (vm.tempList[i].assessCode === vm.tempId) {
                                vm.xmlContent = vm.tempList[i].xml;
                                break;
                            }
                        }
                        let x2 = new x2js(), x = x2.xml2js(vm.xmlContent), textFieldType, editState, title, editPrompt,
                            content = "", value, _dirty_ = false, type, formatString, code;
                        for (var i = 0; i < x.root.items.length; i++) {
                            editPrompt = title = x.root.items[i]._name;
                            code = x.root.items[i]._code;
                            let items = [];
                            for (var j = 0; j < vm.nodeModelOneList.length; j++) {
                                if (vm.nodeModelOneList[j].id === x.root.items[i]._code) {
                                    for (var m = 0; m < vm.nodeModelTwoList.length; m++) {
                                        if (vm.nodeModelTwoList[m].dictId === vm.nodeModelOneList[j].dictId) {
                                            items.push({
                                                label: vm.nodeModelTwoList[m].value,
                                                value: vm.nodeModelTwoList[m].code
                                            })
                                        }
                                    }
                                    break;
                                }
                            }
                            if (vm.tempContent.root && vm.tempContent.root.item.length > 0) {
                                for (let k = 0; k < vm.tempContent.root.item.length; k++) {
                                    if (vm.tempContent.root.item[k]._id === x.root.items[i]._code) {
                                        content = vm.tempContent.root.item[k].__text;
                                        value = vm.tempContent.root.item[k]._code;
                                        break;
                                    }
                                }
                            }
                            switch (x.root.items[i]._ctrType) {
                                case 'text':
                                    textFieldType = 1;
                                    break;
                                case 'text_non_editable':
                                    textFieldType = 1;
                                    editState = 1;
                                    break;
                                case 'text_num':
                                    textFieldType = 1;
                                    editState = 0;
                                    break;
                                case 'Textbox':
                                    textFieldType = 1;
                                    editState = 0;
                                    break;
                                case 'combox_multi':
                                    textFieldType = 5;
                                    break;
                                case 'combox_unedit':
                                    textFieldType = 3;
                                    editState = 1;
                                    break;
                                case 'combox' || 'checkbox':
                                    textFieldType = 3;
                                    editState = 0;
                                    break;
                                case 'time_btn':
                                    textFieldType = 7;
                                    type = 'datetime';
                                    value = new Date();
                                    formatString = 'yyyy-MM-dd hh:mm:ss';
                                    content === '' ? new Date() : content;
                                    break;
                                case 'data_btn':
                                    textFieldType = 7;
                                    type = 'date';
                                    value = new Date();
                                    formatString = 'yyyy-MM-dd';
                                    content === '' ? new Date() : content;
                                    break;
                                case 'hour_btn':
                                    textFieldType = 7;
                                    type = 'time';
                                    value = new Date();
                                    formatString = 'hh:mm:ss';
                                    content === '' ? new Date() : content;
                                    break;
                            }
                            vm.fieldList.push({
                                textFieldType: textFieldType,
                                editState: editState,
                                title: title,
                                editPrompt: editPrompt,
                                content: content,
                                _dirty_: _dirty_,
                                value: value,
                                items: items,
                                type: type,
                                code: code,
                                formatString: formatString
                            });
                        }
                    }
                }).catch(error => {
                    Toast({
                        message: '获取科室表单列表失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            },

            getTemplateDictList() {
                let vm = this;
                vm.$http.post('mobile/emr/assessmentsheet/getEmrBaseDict', {
                    tempId: this.tempId
                }).then(res => {
                    if (res.status === 200) {
                        vm.nodeModelOneList = res.data.nodeModelOneList;
                        vm.nodeModelTwoList = res.data.nodeModelTwoList;
                    }
                }).catch(error => {
                    Toast({
                        message: '获取表单模版字典项失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            },

            //保存
            handleSaveClick() {
                let xmlContent = "<?xml version='1.0'?><root>";
                Indicator.open({
                    text: '正在保存...'
                })

                //获取要保存数据
                function findFld(ret, arr) {
                    for (let fld of arr) {
                        if (_.isObject(fld) && !_.isNull(fld.textFieldType)) {
                            xmlContent += "<item id='" + fld.code + "' ch_name='" + fld.title + "' type='' code='" + fld.value + "'>'" + fld.content + "'</item>";
                            /*ret.push({
                                ch_name: fld.title,
                                code: fld.value,
                                id: fld.code,
                                type: '',
                                value: fld.content
                            })*/
                        }
                    }
                    xmlContent += "</root>";
                };
                let flds = [];
                findFld(flds, this.fieldList);
                console.log(xmlContent);
                this.$http.post('mobile/emr/assessmentsheet/saveEmrAssessmentRecord', {
                    //assessmentSheetInfoStr: xmlContent
                    assessmentSheetInfoStr: '{"AssessmentSheetInfo":"' + xmlContent + '", "assesscode": "' + this.tempId + '","eventno":"' + this.eventNo + '","patientid":"' + this.patientId + '","serialNo":"","userid":"' + this.userId + '","username":"' + this.userName + '"}'
                }).then(res => {
                    Toast({
                        message: '保存成功',
                        iconClass: 'mintui mintui-success'
                    })

                    function clearDirty(arr) {
                        for (let fld of arr) {
                            if (_.isObject(fld) && !_.isNull(fld.textFieldType)) {
                                fld._dirty_ = false
                                if (_.isArray(fld.portions)) {
                                    clearDirty(fld.portions)
                                }
                            }
                        }
                    };

                    //clearDirty(this.fieldList);
                }).catch(() => {
                    Toast({
                        message: '保存失败',
                        iconClass: 'mintui mintui-error'
                    })
                }).finally(() => {
                    Indicator.close()
                })
            },

            //获取表单内容
            getEmrAssessmentRecord() {
                let vm = this, assessmentSheetInfoStr = {
                    "assesscode": this.tempId,
                    "eventno": this.eventNo,
                    "patientid": this.patientId,
                    "serialNo": "1",
                    "userid": this.userId,
                    "username": this.userName
                };
                vm.$http.post('mobile/emr/assessmentsheet/getEmrAssessmentRecord', {assessmentSheetInfoStr: assessmentSheetInfoStr}).then(res => {
                    if (res.status === 200) {
                        let x2 = new x2js(), x = x2.xml2js(res.data.replace('&lt;', '&&&&'));
                        vm.tempContent = x;
                    }
                }).catch(error => {
                    Toast({
                        message: '获取表单内容失败: ' + error,
                        iconClass: 'icon icon-error',
                        duration: 2000
                    })
                })
            },

            inputFocus() {
                setTimeout(function () {
                    // window.scrollTo(0,document.body.clientHeight+document.scrollTop);
                }, 500);
            }
        }
    }
</script>