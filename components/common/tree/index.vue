<template>
    <div class='tree-box weui-cells'
         v-if="computedList && computedList.length > 0"
         style="margin-top: 0px;overflow-y: auto;"
         :style="{height:(height?height + 'px':'100%')}">
        <div @click="toggle" v-if="options.root" class="tree-item weui-cell vux-1px-t">
            <i class="iconfont"
               :class="{'icon-minus': open, 'icon-add': !open}"
               style="font-size: 22px;line-height: 22px;margin: 0 6px;color: gray;"></i>
            {{ options.rootText }}
        </div>
        <ul v-show="open">
            <tree-item :item='l'
                       v-for="l in computedList"
                       :key="l.id"
                       :checkItem="checkItem"
                       :options="options"></tree-item>
        </ul>
    </div>
</template>

<script>
    import TreeItem from './tree-item'

    export default {
        name: 'tree',
        props: {
            list: {
                type: Array,
                required: false
            },
            options: {
                type: Object,
                default: () => {
                    return {
                        root: false,
                        rootText: '',
                        expantion: false
                    }
                }
            },
            value: {
                type: Array,
                default: () => {
                    return []
                },
                required: true
            },
            beforeCheckItem: {
                type: Function,
                default: function () {
                    return function () {
                        return true
                    }
                }
            },
            height: Number
        },
        data() {
            return {
                open: false,
                currentValue: [],
                // currentList: this.list
            }
        },
        methods: {
            toggle() {
                this.open = !this.open
            },
            checkItem: function (nv, ov, item, vm) {
                if (nv && nv.length !== 0) {
                    let r = this.beforeCheckItem.call(this, nv, ov, item, vm)
                    if (r) {
                        if (this.currentValue.indexOf(nv[0]) === -1) {
                            this.currentValue.push(nv[0])
                        }
                    }
                } else if (ov && ov.length !== 0) {
                    if (this.currentValue.indexOf(ov[0]) !== -1) {
                        this.currentValue.splice(this.currentValue.indexOf(ov[0]), 1)
                    }
                }
                this.$emit('input', this.currentValue)
            }
        },
        components: {
            TreeItem
        },
        created: function () {
            if (!this.options.root) {
                this.open = true
            }
            // this.initTree()
        },
        computed: {
            computedList() {
                let listArr = analyzeTreeList(this.list, this.currentValue)
                return listArr
            }
        },
        watch: {
            value: {
                handler: function (nv, ov) {
                    if (JSON.stringify(nv) !== JSON.stringify(this.currentValue)) {
                        this.currentValue = nv
                    }
                },
                immediate: true
            }
        }
    }

    function analyzeTreeList(list, val) {
        let temp = []
        if (list && list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                if (val.indexOf(list[i].id) !== -1) {
                    list[i].checked = true
                }
                else {
                    list[i].checked = false
                }
                list[i].children = analyzeTreeList(list[i].children, val)
            }
            return list
        }
        return []
    }
</script>

<style lang="less">
    .tree-box {
        height: 100%;
        overflow: hidden;
    / / min-height: 400 px;

    .ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    /
    /
    .tree-item {
    / /
    }

    }

</style>