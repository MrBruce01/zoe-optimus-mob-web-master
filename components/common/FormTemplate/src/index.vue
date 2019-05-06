<template>
    <div v-for="(item, index) in currentFormData" :key="index" class="form-cell-b">
        <mt-field
                v-if="item.type==='text'|| item.type==='number' || item.type==='email' || item.type==='url' || item.type ==='tel'|| item.type ==='date'|| item.type ==='password'"
                :label="item.title"
                :ref="item.name"
                v-model="item.value"
                v-show="_isTrue(item.show, true)"
                :placeholder="item.placeholder"
                :readonly="_isTrue(item.readonly, false) || readonly"
                :type="item.type"
                @on-change="(val)=>{_change(val, item)}">
        </mt-field>
        <zm-datetime-picker
                v-if="item.type==='datetime'"
                :label="item.title"
                :ref="item.name"
                v-model="item.value"
                v-show="_isTrue(item.show, true)"
                :readonly="_isTrue(item.readonly, false) || readonly"
                :type="item.type"
                @on-change="(val)=>{_change(val, item)}">

        </zm-datetime-picker>
        <mt-field v-else-if="item.type === 'textarea'"
                  :label="item.title"
                  :ref="item.name"
                  v-model="item.value"
                  v-show="_isTrue(item.show, true)"
                  :placeholder="item.placeholder"
                  :rows="3"
                  :readonly="_isTrue(item.readonly, false) || readonly"
                  type="textarea">
        </mt-field>
        <zm-radio v-else-if="item.type === 'radio'"
                  :title="item.title"
                  :ref="item.name"
                  v-model="item.value"
                  v-show="_isTrue(item.show, true)"
                  :options="_isArray(item.data, [])"
                  :readonly="_isTrue(item.readonly, false) || readonly"
                  @on-change="(val)=>{_change(val, item)}">
        </zm-radio>
        <zm-checklist v-else-if="item.type === 'checklist'"
                      :title="item.title"
                      :ref="item.name"
                      v-model="item.value"
                      v-show="_isTrue(item.show, true)"
                      :options="_isArray(item.data, [])"
                      :readonly="_isTrue(item.readonly, false) || readonly"
                      @on-change="(val)=>{_change(val, item)}">
        </zm-checklist>


        <form-dict v-else-if="item.type==='dict'"
                  :title="item.title"
                  :ref="item.name"
                  v-model="item.value"
                  v-show="_isTrue(item.show, true)"
                  :dictName="item.dictName"
                  :url="item.url"
                  :valueField="item.valueField"
                  :textField="item.textField"
                  :max="_isNum(item.max, 1)"
                  :height="_isNum(item.height, undefined)"
                  :text.sync="item.text"
                  :readonly="_isTrue(item.readonly, false) || readonly"
                  :data="_isArray(item.data, [])"
                  @on-change="(val)=>{_change(val, item)}"></form-dict>
        <editor v-else-if="item.type==='editor'"
                :title="item.title"
                :ref="item.name"
                :id="item.name"
                v-model="item.value"
                v-show="_isTrue(item.show, true)"
                :disabled="_isTrue(item.readonly, false) || readonly"
                :contentHeight="item.contentHeight">
        </editor>
        <uploader v-else-if="item.type==='uploader'"
                  :title="item.title"
                  :ref="item.name"
                  v-model="item.value"
                  v-show="_isTrue(item.show, true)"
                  :readonly="_isTrue(item.readonly, false) || readonly"
                  :moduleName="item.moduleName">
        </uploader>
        <combotree v-else-if="item.type==='combotree'"
                   :title="item.title"
                   :ref="item.name"
                   v-model="item.value"
                   v-show="_isTrue(item.show, true)"
                   :readonly="_isTrue(item.readonly, false) || readonly"
                   :url="'/api' + item.url"
                   @on-change="(val)=>{_change(val, item)}">
        </combotree>
        <!--<advice-input v-else-if="item.type ==='adviceinput'"
                      :title="item.title"
                      :ref="item.name"
                      v-model="item.value"
                      v-show="_isTrue(item.show, true)"
                      :readonly="_isTrue(item.readonly, false) || readonly"></advice-input>-->

        <!--<number-spinner v-else-if="item.type==='number'"
                        :title="item.title"
                        :ref="item.name"
                        v-model="item.value"
                        v-show="_isTrue(item.show, true)"
                        :min="_isNum(item.min, 0)"
                        :max="_isNum(item.max, undefined)"
                        :step="_isNum(item.step, 1)"
                        :readonly="_isTrue(item.readonly, false) || readonly"
                        :precision="_isNum(item.precision, 0)"
                        :fillable="_isTrue(item.editable, true)"
                        @on-change="(val)=>{_change(val, item)}"></number-spinner>
        <datetime v-else-if="item.type==='date'"
                  :title="item.title"
                  :ref="item.name"
                  v-model="item.value"
                  v-show="_isTrue(item.show, true)"
                  :format="item.format?item.format:undefined"
                  :placeholder="item.placeholder"
                  :min-year="_isNum(item.minYear, 1949)"
                  :max-year="_isNum(item.maxYear, undefined)"
                  :required="_isTrue(item.required, false)"
                  :readonly="_isTrue(item.readonly, false) || readonly"
                  :clear-text="_isTrue(item.showClear, true)?'清除':''"
                  @on-clear="_clearDate(item)"
                  @on-change="(val)=>{_change(val, item)}"></datetime>
        <orgpicker v-else-if="item.type==='orgpicker'"
                   :title="item.title"
                   :ref="item.name"
                   v-model="item.value"
                   v-show="_isTrue(item.show, true)"
                   :mode="item.mode?item.mode:'a'"
                   :isEmployeNo="_isTrue(item.isEmployeNo, false)"
                   :required="_isTrue(item.required, false)"
                   :readonly="_isTrue(item.readonly, false) || readonly"
                   :min="_isNum(item.min, 0)"
                   :max="_isNum(item.max, undefined)"
                   @on-change="(val)=>{_change(val, item)}"></orgpicker>
        <editor v-else-if="item.type==='editor'"
                :title="item.title"
                :ref="item.name"
                :id="item.name"
                v-model="item.value"
                v-show="_isTrue(item.show, true)"
                :disabled="_isTrue(item.readonly, false) || readonly"
                :contentHeight="item.contentHeight"
        ></editor>
        <uploader v-else-if="item.type==='uploader'"
                  :title="item.title"
                  :ref="item.name"
                  v-model="item.value"
                  v-show="_isTrue(item.show, true)"
                  :readonly="_isTrue(item.readonly, false) || readonly"
                  :moduleName="item.moduleName"
        ></uploader>
        <advice v-else-if="item.type==='advice'"
                :title="item.title"
                :ref="item.name"
                v-model="item.value"
                v-show="_isTrue(item.show, true) && !_isTrue(item.readonly, false) && !readonly"
                :readonly="_isTrue(item.readonly, false) || readonly"
        ></advice>
        <combotree v-else-if="item.type==='combotree'"
                   :title="item.title"
                   :ref="item.name"
                   v-model="item.value"
                   v-show="_isTrue(item.show, true)"
                   :readonly="_isTrue(item.readonly, false) || readonly"
                   :url="'/api' + item.url"
                   @on-change="(val)=>{_change(val, item)}"></combotree>
        <advice-input v-else-if="item.type ==='adviceinput'"
                      :title="item.title"
                      :ref="item.name"
                      v-model="item.value"
                      v-show="_isTrue(item.show, true)"
                      :readonly="_isTrue(item.readonly, false) || readonly"></advice-input>-->
    </div>
</template>

<script>
    import JsHelper from '~/utils/JsHelper'
    import {Field} from 'mint-ui'
    import ZmRadio from '~/components/common/radio/src/main'
    import ZmChecklist from '~/components/common/checklist/src/main'
    import ZmDatetimePicker from '~/components/common/datetime-picker/src/main'

    import Editor from '~/components/common/editor'
    import Combotree from '~/components/common/combotree'
    import Uploader from '~/components/common/uploader'
    import FormDict from '~/components/common/combotree'
    import {isTrue, isNum, isArray} from './utils.js'

    export default {
        components: {
            Field,
            ZmRadio,
            ZmChecklist,
            ZmDatetimePicker,

            Editor,
            Combotree,
            Uploader,
            FormDict,
            isTrue,
            isNum,
            isArray
        },
        name: "",
        currentFormData: [],
        props: {
            formData: {
                type: Array,   // 传入类型
                required: true  // 必填
            },
            formId: String,
            readonly: {
                type: Boolean,
                default: false
            },
            taskId: String
        },
        data() {
            return {
                currentFormData: this.formData
            }
        },
        mounted() {
            if (this.formId) {
                this._getFormInfo(this.formId)
            }
        },
        method: {
            _isTrue(val, def){
                isTrue(val,def);
            },
            _isArray(val, def){
              isArray(val,def);
            },
            _getFormInfo(formId) {
                let vm = this
                this.$his5http.get('/api/FormEditor/FormEditor/GetFormTemplateMobile', {
                    formId: formId
                }).then(res => {
                    if (res) {
                        let data = JsHelper.strToJson(res)
                        // 当为新建时绑定值
                        let fd = vm.isNew == '1' ? vm._bindCurrentUserInfo(JsHelper.strToJson(data.FormData)) : JsHelper.strToJson(data.FormData)
                        vm.currentFormData = fd;
                        let dd = eval("(" + unescape(data.FormJsCode) + ")")
                        if (dd && typeof(dd) == 'object' && dd.length > 0) {
                            for (let f in dd) {
                                try {
                                    let fn = eval("0,(" + unescape(dd[f].JsCode) + ")")
                                    vm.scriptStr.push({
                                        name: dd[f].Name,
                                        fn: fn
                                    })
                                } catch (ex) {
                                }
                            }
                        }
                        vm.$emit('on-render-complete')
                    }
                    else {
                        vm.$emit('on-render-complete')
                    }
                })
            },
            _bindCurrentUserInfo(data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].currentuserinfo) {
                        let t = data[i].currentuserinfo.substr(data[i].currentuserinfo.indexOf('_') + 1)
                        if (t) {
                            if (t === 'CurrentDate') { // 当前日期
                                data[i].value = new Date().format('yyyy-MM-dd')
                            }
                            else if (t === 'CurrentYear') {  // 当前年份
                                data[i].value = new Date().getFullYear()
                            }
                            else if (t === 'CurrentYearMonth') { //当前年月
                                data[i].value = new Date().format('yyyy-MM')
                            }
                            else if (t === 'CurrentDateTime') { // 当前日期时间
                                data[i].value = new Date().format('yyyy-MM-dd hh:mm')
                            }
                            else if (t === 'CurrentTime') {
                                data[i].value = new Date().format('hh:mm')
                            }
                            else {
                                data[i].value = this.currentUserInfo[t]
                            }
                        }
                    }
                    else if (data[i].defaultValue) {
                        data[i].value = data[i].defaultValue
                    }
                }
                return data
            }
        }
    }
</script>

<style scoped>

</style>