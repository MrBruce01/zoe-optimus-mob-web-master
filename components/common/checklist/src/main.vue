<template>
    <div>
        <mt-cell :title="label" class="zm-checklist mint-field">
            <input :placeholder="placeholder"
                   type="text"
                   :readonly="!editable"
                   v-model="currentContent"
                   @click="onHandleClick"
                   class="mint-field-core">
            <span class="mintui mintui-back reset" @click="popupVisible=true"></span>
            <mt-popup class="zm-checklist-popup"
                      position="bottom"
                      v-model="popupVisible"
                      popup-transition="popup-fade"
                      :style="{height: popupHeight}"
                      ref="pop">
                <zm-container>
                    <zm-main ref="zmChecklistMain">
                        <mt-checklist style="width: 100%;"
                                      :title="label"
                                      align="right"
                                      v-model="currentValue"
                                      :options="options">
                        </mt-checklist>
                    </zm-main>
                    <!--<zm-footer height="40px">-->
                    <!--<div class="zm-checklist-toolbar">-->
                    <!--<span class="buttons">取&nbsp;消</span>-->
                    <!--<span class="buttons">确&nbsp;认</span>-->
                    <!--</div>-->
                    <!--</zm-footer>-->
                </zm-container>
            </mt-popup>
        </mt-cell>
        <!--<div class="zm-checklist-textfield-list">
            <zm-textfield-list :fieldList="portions"></zm-textfield-list>
        </div>-->
    </div>
</template>
<script>
    import _ from 'lodash'
    import DictField from '~/components/mixins/dict-field'

    export default {
        name: 'ZmChecklist',
        componentName: 'ZmChecklist',
        mixins: [DictField],
        props: {
            label: String,
            value: {
                type: Array,
                default() {
                    return []
                }
            },
            separator: {
                type: String,
                default: '，'
            },
            portions: {
                type: Array,
                default() {
                    return []
                }
            },
            enableSegment: {
                type: Boolean,
                default: false
            },

            dictData: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        mounted() {
            document.body.appendChild(this.$refs.pop.$el)
        },
        data() {
            return {
                options: [],
                popupVisible: false,
                popupHeight: 'auto',
                currentValue: this.value
            }
        },
        watch: {
            popupVisible() {
                this.options = this.dictData;
                /*this.options = this.dictItems
                this.currentValue = this.value
                let height = this.options.length * 48
                let maxHeight = window.innerHeight * 0.5
                if (height > maxHeight) {
                  this.popupHeight = maxHeight + 'px'
                  let scrollHeight = maxHeight * maxHeight / height
                  this.$refs.zmChecklistMain.setScroll(scrollHeight, window.innerWidth)
                }*/
            },
            currentValue() {
                this.$emit('input', this.currentValue)
                let content = this.content
                let checkedLabels = []
                for (let item of this.currentValue) {
                    let label = this.getOptionLabel(item)
                    checkedLabels.push(label)
                }

                let newContent = checkedLabels.join(this.separator)
                if (this.editable) {
                    content += newContent
                } else {
                    content = newContent
                }
                this.currentContent = content

                if (this.enableSegment) {
                    if (!_.isEmpty(this.classId)) {
                        let param = {}
                        param.dictItemSegmentRltList = []
                        this.currentValue.forEach(value => {
                            let item = {
                                projectCode: '1',
                                deCode: this.classId,
                                basicDictName: this.dictId,
                                basicDictValueCode: value
                            }
                            param.dictItemSegmentRltList.push(item)
                        })
                        this.$his5http.post('template/segment/dictItemSegmentRlt/findListByList', param
                        ).then((res) => {
                            let extendSegment = []
                            if (res.data.length !== 0) {
                                res.data.forEach(data => {
                                    let segment = JSON.parse(data.segmentJsonContent)
                                    segment.forEach(textField => {
                                        if (_.isObject(textField)) {
                                            textField.value = textField.code
                                            textField.type = textField.textFieldType
                                            if (textField.hasOwnProperty('portions')) {
                                                this.addFldType(textField.portions)
                                            }
                                        }
                                        extendSegment.push(textField)
                                    })
                                })
                            }
                            this.$emit('update:portions', extendSegment)
                        })
                    }
                }
            }
        },
        methods: {
            onHandleClick() {
                if (!this.editable) {
                    this.popupVisible = true
                }
            },
            getOptionLabel(value) {
                for (let item of this.options) {
                    if (_.isEqual(item.value, value)) {
                        return item.label
                    }
                }
                return ''
            },
            addFldType(portions) {
                for (let portion of portions) {
                    if (_.isObject(portion)) {
                        portion.type = portion.textFieldType
                        if (portion.hasOwnProperty('portions')) {
                            this.addFldType(portion.portions)
                        }
                    }
                }
            }
        }

    }
</script>

<style>
    .zm-checklist-popup {
        width: 100%;
        /*height: calc(100%);*/
        /*overflow: auto;*/
    }

    .zm-checklist-popup .zm-checklist-selects {
        position: absolute;
        left: 0;
        margin-left: 60px;
        margin-top: 2px;
    }

    .zm-checklist-popup .zm-checklist-toolbar {
        border-bottom: 1px solid #eaeaea;
        border-top: 1px solid #eaeaea;
        height: 40px;
    }

    .zm-checklist-popup .zm-checklist-toolbar .buttons {
        display: inline-block;
        width: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        color: #26a2ff;
    }

    .zm-checklist .reset {
        display: inline-block;
        transform: rotate(-90deg);
        color: #868686;
        position: absolute;
        right: 10px;
        top: 14px;
    }

    .zm-checklist-textfield-list {
        margin-left: 20px;
    }
</style>
