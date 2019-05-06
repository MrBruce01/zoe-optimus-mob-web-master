<template>
    <div>
        <mt-cell :title="label" class="zm-radio mint-field">
            <input :placeholder="placeholder"
                   type="text"
                   :readonly="!editable"
                   style="margin-right: 14px;"
                   v-model="currentContent"
                   @click="onHandleClick"
                   class="mint-field-core"/>
            <span class="mintui mintui-back reset" @click="popupVisible=true"></span>
            <mt-popup class="zm-radio-popup"
                      position="bottom"
                      v-model="popupVisible"
                      popup-transition="popup-fade"
                      :style="{height: popupHeight}"
                      ref="pop">
                <zm-container>
                    <zm-main ref="zmRadioMain">
                        <div @click="popupVisible=false">
                            <mt-radio style="width: 100%"
                                      :title="label"
                                      align="right"
                                      v-model="currentValue"
                                      :options="dictData">
                            </mt-radio>
                        </div>
                    </zm-main>
                </zm-container>
            </mt-popup>
        </mt-cell>
        <!--<div class="zm-radio-textfield-list">
            <zm-textfield-list :fieldList="portions"></zm-textfield-list>
        </div>-->
    </div>
</template>
<script>
    import _ from 'lodash'
    import DictField from '~/components/mixins/dict-field'
    import {MessageBox} from 'mint-ui'

    export default {
        name: 'ZmRadio',
        componentName: 'ZmRadio',
        mixins: [DictField],
        props: {
            label: {
                type: String,
                default: ''
            },
            value: {
                type: [String, Number]
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
            },
            editable: {
                type: Boolean,
                default() {
                    return true;
                }
            },
            placeholder: {
                type: String,
                default() {
                    return '';
                }
            },

            content: {
                type: [String, Number]
            }
        },
        mounted() {
            document.body.appendChild(this.$refs.pop.$el)
        },
        data() {
            return {
                popupVisible: false,
                popupHeight: 'auto',
                currentValue: this.value === undefined ? '' : this.value.toString(),
                options: [],
                currentContent: this.content
            }
        },
        watch: {
            value() {
                for (let i = 0, len = this.dictData.length; i < len; i++) {
                    if (this.dictData[i].value === this.value) {
                        this.currentContent = this.dictData[i].label;
                        break;
                    }
                }
            },
            popupVisible() {
                this.options = this.dictData;
                this.currentValue = this.value.toString();
                let height = this.options.length * 48
                let maxHeight = window.innerHeight * 0.5
                if (height > maxHeight) {
                    this.popupHeight = maxHeight + 'px'
                    let scrollHeight = maxHeight * maxHeight / height
                    this.$refs.zmRadioMain.setScroll(scrollHeight, window.innerWidth)
                }
            },
            currentValue() {
                this.$emit('input', this.currentValue)
                this.$emit('change', this.currentValue)
                let content = this.content
                let label;
                console.log('currentValue-currentValue:' + this.currentValue)
                for (let item of this.dictData) {
                    if (_.isEqual(item.value, this.currentValue)) {
                        label = item.label
                        break
                    }
                }
                if (this.editable) {
                    content += label
                } else {
                    content = label
                }
                this.currentContent = content

                /*if (this.enableSegment) {
                    if (!_.isEmpty(this.classId)) {
                        let param = {
                            dictItemSegmentRltList: [
                                {
                                    projectCode: '1',
                                    deCode: this.classId,
                                    basicDictName: this.dictId,
                                    basicDictValueCode: this.currentValue
                                }]
                        }
                        this.$his5http.post('template/segment/dictItemSegmentRlt/findListByList',
                            param
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
                }*/
            }
        },

        beforeDestroy: function () {
            this.popupVisible = false;
        },

        methods: {
            onHandleClick() {
                if (!this.editable) {
                    this.popupVisible = true
                }
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
    .zm-radio-popup {
        width: 100%;
        /*height: calc(100%);*/
        /*overflow: auto;*/
    }

    .zm-radio-popup .zm-radio-selects {
        position: absolute;
        left: 0;
        margin-left: 60px;
        margin-top: 2px;
    }

    .zm-radio-popup .zm-radio-toolbar {
        border-bottom: 1px solid #eaeaea;
        border-top: 1px solid #eaeaea;
        height: 40px;
    }

    .zm-radio-popup .zm-radio-toolbar .buttons {
        display: inline-block;
        width: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        color: #26a2ff;
    }

    .zm-radio .reset {
        display: inline-block;
        transform: rotate(-90deg);
        color: #868686;
        position: absolute;
        right: 10px;
        top: 14px;
    }

    .zm-radio-textfield-list {
        margin-left: 20px;
    }
</style>
