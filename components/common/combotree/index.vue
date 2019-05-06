<template>
    <div>
        <cell @click.native="_onClickCell"
              :disabled="readonly"
              is-link>
            <slot name="title" slot="title">{{ title }}</slot>
            <span>{{ showText }}</span>
        </cell>
        <div v-transfer-dom>
            <mt-popup v-model="showPopup"
                      class="combotree"
                      height="100%">
                <!--<mt-picker :slots="slots" @change="onValuesChange" style="width: 7.5rem;" showToolbar>                                        
                    <div class="picker-toolbar-title">                                                
                        <div class="usi-btn-cancel" @click="popupVisible = !popupVisible">取消</div>                                                
                        <div class="">请选择</div>                                                
                        <div class="usi-btn-sure" @click="popupVisible = !popupVisible">确定</div>                                            
                    </div>                                    
                </mt-picker>-->
                <tree :list="treeList"
                      :height="height"
                      v-model="currentValue"></tree>
            </mt-popup>
        </div>
    </div>
</template>
<script>
    import Tree from '~/components/common/tree'
    import {Popup, Picker} from 'mint-ui'
    import JsHelper from '~/utils/JsHelper'

    export default {
        props: {
            value: String,
            url: {
                type: String,
                required: true
            },
            max: Number,
            title: String,
            readonly: {
                type: Boolean,
                default: false
            }
        },
        components: {
            Tree,
            Popup,
            Picker
        },
        data() {
            return {
                currentValue: [],
                treeList: [],
                showPopup: false,
                showText: '',
                height: 610
            }
        },
        methods: {
            _getShowText(key) { // 获取解析后的文本值
                if (key && this.treeList && this.treeList.length > 0) {
                    let t = []
                    let arr = key.split(',')
                    for (let i = 0; i < arr.length; i++) {
                        let x = _getShowText(arr[i], this.treeList)
                        if (x) {
                            t.push(x)
                        }
                    }
                    return t.join(',')
                }
                else {
                    return key
                }
            },
            _onClickRight() {
                this.showText = this._getShowText(this.currentValue.join(','))
                this.$emit('input', this.currentValue.join(','))
                this.$emit('change', this.currentValue.join(','))
                this.showPopup = false
            },
            _onClickCell() {
                if (this.readonly) {
                    return
                }
                if (this.currentValue.join(',') !== this.value) {
                    if (this.value) {
                        this.currentValue = this.value.split(',')
                    }
                    else {
                        this.currentValue = []
                    }
                }
                this.showPopup = true
            },
            getText() {  //外部调用方法获取文本信息
                return this.showText
            }
        },
        mounted() {
            if (process.browser) {
                this.height = document.documentElement.clientHeight - 55
            }
            if (this.url) {
                this.$his5http.get(this.url).then(res => {
                    let d = JsHelper.strToJson(res)
                    this.treeList = d
                    if (this.value) {
                        this.currentValue = this.value.split(',')
                        this.showText = this._getShowText(this.value)
                    }
                })
            }
        },
        beforeUpdate() {
            if (this.isRadio) {
                const length = this.currentValue.length
                if (length > 1) {
                    this.currentValue = [this.currentValue[length - 1]]
                }
            }
        },
        computed: {
            selectTotal() {
                return this.currentValue.length
            },
            isRadio() {
                if (typeof this.max === 'undefined' || this.max === 1) {
                    return true
                } else {
                    return false
                }
            }
        },
        watch: {
            value(newVal) {
                if (newVal !== this.currentValue.join(',')) {
                    if (newVal) {
                        this.currentValue = newVal.split(',')
                        this.showText = _getShowText(newVal)
                    }
                    else {
                        this.currentValue = []
                        this.showText = ''
                    }
                }
            }
        }
    }

    function _getShowText(key, list) {
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id == key) {
                    return list[i].text
                }
                else if (list[i].children && list[i].children.length > 0) {
                    let t = _getShowText(key, list[i].children)
                    if (t) {
                        return t
                    }
                }
            }
        }

        return ''
    }
</script>
