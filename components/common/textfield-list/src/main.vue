<template>
    <div>
        <template v-for="field in fieldList">
            <zm-field v-if="typeof field === 'object' && (field.textFieldType == 1 || field.textFieldType == 2)"
                      :label="field.title + ':'"
                      :placeholder="field.editPrompt"
                      :dirty.sync="field._dirty_"
                      v-model="field.content">
            </zm-field>
            <zm-checklist
                    v-if="typeof field === 'object' && (field.textFieldType == 11 || field.textFieldType == 5 || field.textFieldType == 6)"
                    :label="field.title + ':'"
                    :placeholder="field.editPrompt"
                    :props="checkListProps"
                    :editable="field.editState == 0"
                    :dict-data="field.items"
                    :dict-id="field.dictId"
                    :class-id="field.classId"
                    :content.sync="field.content"
                    :dirty.sync="field._dirty_"
                    :portions.sync="field.portions"
                    :dict-content="field.dictContent"
                    v-model="field.value"
                    :enable-segment="true"
                    @script-validate="onScriptValidate">
            </zm-checklist>
            <zm-radio
                    v-if="typeof field === 'object' && (field.textFieldType == 10 || field.textFieldType == 3 || field.textFieldType == 4)"
                    :label="field.title + ':'"
                    :placeholder="field.editPrompt"
                    :props="checkListProps"
                    :editable="field.editState == 0"
                    :dict-data="field.items"
                    :dict-id="field.dictId"
                    :class-id="field.classId"
                    :content.sync="field.content"
                    :dirty.sync="field._dirty_"
                    :portions.sync="field.portions"
                    :dict-content="field.dictContent"
                    v-model="field.value"
                    :enable-segment="true"
                    @script-validate="onScriptValidate">
            </zm-radio>
            <zm-datetime-picker v-if="typeof field === 'object' && field.textFieldType == 7"
                                :placeholder="field.editPrompt"
                                :label="field.title + ':'"
                                :format="field.formatString"
                                :content.sync="field.content"
                                :dirty.sync="field._dirty_"
                                v-model="field.value">
            </zm-datetime-picker>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'ZmTextfieldList',
        props: {
            fieldList: {
                type: Array,
                default() {
                    return []
                }
            },
            options: {
                type: Array,
                default() {
                    return []
                }
            },

            dictData: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                checkListProps: {
                    label: 'name',
                    value: 'code'
                }
            }
        },
        methods: {
            onScriptValidate(classId) {
                this.$emit('de-script-validate', classId)
            }
        }
    }
</script>