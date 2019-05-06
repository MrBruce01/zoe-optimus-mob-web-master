<template>
  <li class="vux-1px-t">
    <div @click="toggle" class="tree-item weui-cells_checkbox weui-cell" >
      <span v-for="i in indent" :key="i" class="tree-indent"></span>
      <label class="weui-check_label">
        <div class="weui-cell__hd">
          <input type="checkbox"
            class="weui-check"
            :name="'orgpick-check'"
            :value="item.id"
            v-model="currentValue" />
          <i class="weui-icon-checked vux-checklist-icon-checked"></i>
        </div>
      </label>
      <i class="iconfont" v-if="isFolder" 
      :class="{'icon-minus': open, 'icon-add': !open}" 
      style="font-size: 22px;line-height: 22px;margin: 0 6px;color: gray;"></i>
      <div class="weui-cell__bd">
        <p v-html="item.text"></p>
      </div>
    </div>
    <ul v-show="open" v-if="isFolder">
      <tree-item
        ref="tree-item"
        v-for="d in item.children"
        :key="d.id"
        :item="d"
        :indent="indent+1"
        :checkItem="checkItem"
        :options="options"
        >
      </tree-item>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'tree-item',
  props: {
    item: Object,
    indent: {
      type: Number,
      default: 0
    },
    checkItem: Function,
    options: {
      type:Object,
      default: function () {
        return {
          expantion: false
        }
      }
    }
  },
  data () {
    return {
      open: this.options.expantion? true: (this.indent===0?true:false),
      currentValue: this.item.checked ? [this.item.id]:[]
    }
  },
  computed: {
    isFolder: function() {
      return this.item.children && this.item.children.length
    }
  },
  methods: {
    toggle () {
      if(this.isFolder){
        this.open = !this.open
      }
    }
  },
  watch: {
    currentValue (nv,ov) {
      let vm = this
      this.checkItem(nv, ov, this.item, vm);
    },
    item: {
      handler: function (nv, ov) {
        if(nv.checked) {
          if (JSON.stringify([nv.id]) !== JSON.stringify(this.currentValue)) {
            this.currentValue = [nv.id]
          }
        }
        else {
          if (JSON.stringify([]) !== JSON.stringify(this.currentValue)) {
            this.currentValue = []
          }
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style>
.tree-indent {
  display: inline-block;
  width: 16px;
  height: 18px;
  vertical-align: top;
  overflow: hidden;
}
[class^="weui-icon-"], [class*=" weui-icon-"]{
  display: inline-block;
  vertical-align: middle;
  font: normal normal normal 14px/1 "weui";
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}
.weui-cells_checkbox .weui-icon-checked:before {
  content: '\EA01';
  color: #C9C9C9;
  font-size: 23px;
  display: block;
}

.weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before{
  color: #2e95ff;
  content: "\EA06";
}

.weui-check{
    position: absolute;
    left: -9999em;
}
.weui-cells_checkbox > label > * {
  pointer-events: none;
}
.vux-checklist-disabled .vux-checklist-icon-checked:before {
  opacity: 0.5;
}
.vux-checklist-label-left {
  flex-direction: row-reverse;
}
</style>


