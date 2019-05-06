<template>
    <div>
        <mt-cell :title="label" class="zm-radio mint-field" :style="{width: width}">
            <input :placeholder="placeholder"
                   type="text"
                   :readonly="!editable"
                   style="margin-right: 14px;"
                   v-model="currentContent"
                   @click="onHandleClick"
                   class="mint-field-core"/>
            <span class="mintui mintui-back reset" @click="popupVisible=true"></span>
            <mt-popup class="zm-keyboard-popup"
                      position="bottom"
                      v-model="popupVisible"
                      popup-transition="popup-fade"
                      :style="{height: popupHeight}"
                      ref="pop">
                <zm-container>
                    <zm-main ref="zmKeyboardMain">
                        <div>
                            <div class="content">{{entryContent}}</div>
                            <div class="parent">
                                <div class="leftChild">
                                    <div>
                                        <mt-button @click.native="onBtnClick(key_37d)">{{key_37d}}</mt-button>
                                        <mt-button @click.native="onBtnClick(key_38d)">{{key_38d}}</mt-button>
                                        <mt-button @click.native="onBtnClick(key_39d)">{{key_39d}}</mt-button>
                                    </div>
                                    <div>
                                        <mt-button @click.native="onBtnClick(key_1)">{{key_1}}</mt-button>
                                        <mt-button @click.native="onBtnClick(key_2)">{{key_2}}</mt-button>
                                        <mt-button @click.native="onBtnClick(key_3)">{{key_3}}</mt-button>
                                    </div>
                                    <div>
                                        <mt-button @click.native="onBtnClick(key_4)">{{key_4}}</mt-button>
                                        <mt-button @click.native="onBtnClick(key_5)">{{key_5}}</mt-button>
                                        <mt-button @click.native="onBtnClick(key_6)">{{key_6}}</mt-button>
                                    </div>
                                    <div>
                                        <mt-button @click.native="onBtnClick(key_7)">{{key_7}}</mt-button>
                                        <mt-button @click.native="onBtnClick(key_8)">{{key_8}}</mt-button>
                                        <mt-button @click.native="onBtnClick(key_9)">{{key_9}}</mt-button>
                                    </div>
                                    <div>
                                        <mt-button @click.native="onBtnClick(key_0)">{{key_0}}</mt-button>
                                        <mt-button @click.native="onBtnClick(key_d)">{{key_d}}</mt-button>
                                    </div>
                                </div>
                                <div class="rigthChild">
                                    <mt-button class="btn1" @click.native="onDel"
                                               @touchstart.native="onLongTouchStartDel"
                                               @touchend.native="onLongTouchEndDel" ref="delBtn">删除
                                    </mt-button>
                                    <mt-button class="btn2" @click.native="onSure">确定</mt-button>
                                </div>
                            </div>
                        </div>
                    </zm-main>
                </zm-container>
            </mt-popup>
        </mt-cell>
    </div>
</template>

<script>
    import DictField from '~/components/mixins/dict-field'

    export default {
        name: 'ZmKeyboard',
        componentName: 'ZmKeyboard',
        mixins: [DictField],
        props: {
            label: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: '80%'
            },
            value: {
                type: [Number, String]
            }
        },
        data() {
            return {
                options: [],
                popupVisible: false,
                popupHeight: 'auto',
                currentContent: this.value,
                entryContent: '',
                key_37d: '37.',
                key_38d: '38.',
                key_39d: '39.',
                key_1: '1',
                key_2: '2',
                key_3: '3',
                key_4: '4',
                key_5: '5',
                key_6: '6',
                key_7: '7',
                key_8: '8',
                key_9: '9',
                key_0: '0',
                key_d: '.',
                Loop: 0
            }
        },
        watch: {
            popupVisible() {
            }
        },
        methods: {
            onHandleClick() {
                if (!this.editable) {
                    this.popupVisible = true
                    this.entryContent = this.currentContent
                }
            },
            onBtnClick(obj) {
                this.entryContent = this.entryContent + obj
            },
            onSure() {
                this.popupVisible = false
                this.currentContent = this.entryContent
                this.$emit('input', this.currentContent)// 特定input事件映射于v-model的值
            },
            onDel() {
                if (this.entryContent != null && this.entryContent.length > 0) {
                    this.entryContent = this.entryContent.substr(0, this.entryContent.length - 1)
                }
            },
            onLongTouchStartDel() {
                let sef = this
                clearInterval(this.Loop)
                this.Loop = setInterval(function () {
                    sef.onDel()
                }, 300)
            },
            onLongTouchEndDel() {
                clearInterval(this.Loop)
            }
        }
    }
</script>

<style scoped>
    .parent {
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-direction: row;
    }

    .leftChild {
        flex: 1;
        justify-content: space-around;
    }

    .leftChild div {
        display: flex;
    }

    .leftChild .mint-button {
        flex: 1;
    }

    .rigthChild {
        display: flex;
        flex-direction: column;
    }

    .rigthChild button {
    }

    .rigthChild .btn1 {
        align-content: flex-start;
    }

    .rigthChild .btn2 {
        flex: 1;
    }

    .content {
        display: flex;
        height: 30px;
        padding-left: 20px;
        padding-top: 10px;
    }

    .zm-keyboard-popup {
        width: 100%;
    }
</style>