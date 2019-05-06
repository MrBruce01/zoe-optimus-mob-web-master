<template>
    <div>
        <div v-if="!!title" style="padding:0 15px;position: relative;display:flex;">
            <p style="height: 30px;line-height: 30px;">
                <label class="vux-label">{{ title }}</label>
            </p>
        </div>
        <vue-editor v-model="content" :id="id"
                    :useCustomImageHandler="useCustomImageHandler"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    :customModules="customModules"
                    :editorToolbar="editorToolbar"
                    :editorOptions="editorOptions"
                    @selection-change="onSelectionChange"
                    @blur="onBlur"
                    @focus="onFocus"
                    @imageAdded="onImageAdded"
                    :class="classSetting"
        ></vue-editor>
    </div>
</template>
<script>
    // import { VueEditor } from '~/components/editor/vue2-editor.js'

    export default {
        name: 'editor',
        props: {
            value: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: 'editor'
            },
            useCustomImageHandler: {
                type: Boolean,
                default: false
            },
            title: {
                type: String
            },
            placeholder: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            customModules: {
                type: Array
            },
            editorToolbar: {
                type: Array,
                default: function () {
                    return []
                }
            },
            editorOptions: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            contentHeight: {
                type: String, // 可以设置的有1,2,3
                default: ''
            }
        },
        data() {
            return {
                content: '',
                isActive: this.editorToolbar.length === 0 ? true : false
            }
        },
        components: {
            // VueEditor
        },
        computed: {
            classSetting() {
                let opt = {}
                opt.active = this.isActive
                if (this.contentHeight) {
                    if (this.contentHeight === '1') {
                        opt['height-1'] = true
                    } else if (this.contentHeight === '2') {
                        opt['height-2'] = true
                    } else if (this.contentHeight === '3') {
                        opt['height-3'] = true
                    } else if (this.contentHeight === '4') {
                        opt['height-4'] = true
                    }
                }
                return opt
            }
        },
        methods: {
            onSelectionChange(range) {
                this.$emit('select-change', range)
            },
            onBlur(quill) {
                this.$emit('on-blur', quill)
            },
            onFocus(quill) {
                this.$emit('on-focus', quill)
            },
            onImageAdded(file, Editor, cursorLocation, resetUploader) {
                this.$emit('imageAdd', file, Editor, cursorLocation, resetUploader)
            }
        },
        watch: {
            content(ov, nv) {
                if (ov !== this.value) {
                    this.$emit('input', ov)
                    this.$emit('on-change', ov)
                }
            },
            value: {
                handler: function (nv, ov) {
                    if (nv !== this.content) {
                        this.content = nv
                    }
                },
                immediate: true
            }
        }
    }
</script>
<style>
    .active .ql-toolbar {
        display: none;
    }

    .active > .ql-container {
        border: none !important;
    }

    .height-1 .ql-container > .ql-editor {
        min-height: 300px;
    }

    .height-2 .ql-container > .ql-editor {
        min-height: 350px;
    }

    .height-3 .ql-container > .ql-editor {
        min-height: 400px;
    }

    .height-4 .ql-container > .ql-editor {
        min-height: 450px;
    }
</style>
