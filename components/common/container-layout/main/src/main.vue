<template>
    <div class="zm-main" :style="styles" @scroll="scroll" @click.stop="click">
        <slot></slot>
        <div v-show="false" style="position: absolute;width: 5px;background-color: rgba(2, 2, 2, 0.32);"
             :style="{left: left + 'px', top: top + 'px', height: height + 'px'}"></div>
    </div>
</template>

<script>
    export default {
        name: 'ZmMain',
        componentName: 'ZmMain',
        props: {
            styles: Object
        },
        data() {
            return {
                top: 0,
                left: 0,
                height: 100,
                show: false
            }
        },
        mounted() {
            this.initScroll()
        },
        methods: {
            hideScroll() {
                this.show = false
            },
            setScroll(height, width) {
                this.show = true
                this.height = height
                this.left = (width - 7)
            },
            initScroll() {
                // window.console.log('initScroll')
                // window.console.log('clientHeight:' + this.$el.clientHeight)
                // window.console.log('scrollHeight:' + this.$el.scrollHeight)
                let clientHeight = this.$el.clientHeight
                let scrollHeight = this.$el.scrollHeight
                if (scrollHeight > clientHeight) {
                    this.left = (this.$el.clientWidth - 7)
                    this.top = this.$el.scrollTop
                    let scrl = scrollHeight - clientHeight
                    if (scrl < clientHeight) {
                        this.height = clientHeight * 1 / 2
                    } else {
                        this.height = 100
                    }
                    this.show = true
                } else {
                    this.show = false
                }
            },

            //滚动事件
            scroll() {
                if (!this.show) {
                    this.initScroll()
                }
                // 滚动条位置计算
                let scrollTop = this.$el.scrollTop
                let clientHeight = this.$el.clientHeight
                let scrollHeight = this.$el.scrollHeight
                let top1 = scrollHeight - clientHeight
                let top2 = scrollHeight - this.height
                let scale = (top2 - top1) / top1
                this.top = (scrollTop + scale * scrollTop)
            },
            click() {
                if (!this.show) {
                    this.initScroll()
                }
            }
        }
    }
</script>
<style>
    .zm-main-scroll {
    }
</style>
