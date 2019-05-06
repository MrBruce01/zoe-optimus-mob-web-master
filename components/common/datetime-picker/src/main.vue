<template>
    <div>
        <mt-cell :title="label" class="mint-field">
            <input :placeholder="placeholder"
                   type="text"
                   readonly
                   style="margin-right: 14px;"
                   :value="strValue"
                   @click.native="onHandleClick"
                   class="mint-field-core"/>
            <!--<span class="mintui mintui-back reset" @click="popupVisible=true"></span>-->
            <span class="mintui mintui-back reset" @click="onHandleClick"></span>
            <mt-datetime-picker
                    :value="dateValue"
                    ref="zDtPicker"
                    :type="type"
                    :year-format="yearFormat"
                    :month-format="monthFormat"
                    :date-format="dateFormat"
                    :hour-format="hourFormat"
                    :minute-format="minuteFormat"
                    @confirm="handleChange">
            </mt-datetime-picker>
        </mt-cell>
    </div>
</template>
<script>
    import _ from 'lodash'
    import dateFormat from '~/utils/dateFormat'

    export default {
        name: 'ZmDatetimePicker',
        componentName: 'ZmDatetimePicker',
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            label: String,
            placeholder: {
                type: String,
                default: '请输入日期'
            },
            type: {
                type: String,
                default: 'datetime'
            },
            value: {
                type: [Date, String],
                default() {
                    return new Date()
                }
            },
            content: {
                type: [Date, String],
                default: new Date()
            },
            format: {
                type: String,
                default: 'yyyy-MM-dd hh:mm:ss'
            },
            yearFormat: {
                type: String,
                default: '{value}'
            },
            monthFormat: {
                type: String,
                default: '{value}'
            },
            dateFormat: {
                type: String,
                default: '{value}'
            },
            hourFormat: {
                type: String,
                default: '{value}'
            },
            minuteFormat: {
                type: String,
                default: '{value}'
            },
            dirty: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            strValue() {
                let value = this.value
                if (_.isNumber(value)) {
                    return dateFormat(this.format, new Date(value))
                } else if (_.isDate(value)) {
                    return dateFormat(this.format, value)
                } else {
                    return value
                }
            },
            dateValue() {
                let value = this.value
                if (_.isNumber(value)) {
                    return new Date(value)
                } else {
                    return value
                }
            }
        },
        mounted() {
            document.body.appendChild(this.$refs.zDtPicker.$el)
        },
        methods: {
            onHandleClick() {
                if (!this.readonly)
                    this.$refs.zDtPicker.open()
            },
            handleChange(val) {
                this.$emit('update:dirty', true)
                this.$emit('change', val)
            }
        },
        watch: {
            strValue(val) {
                this.$emit('update:content', val)
            }
        }
    }
</script>

<style>
    .reset {
        display: inline-block;
        transform: rotate(-90deg);
        color: #868686;
        position: absolute;
        right: 10px;
        top: 14px;
    }
</style>
