<template>
    <div>
        <mt-button type="primary" slot="right">&nbsp;&nbsp;&nbsp;新增</mt-button>
        <mt-button type="primary" slot="right">&nbsp;&nbsp;&nbsp;保存</mt-button>
        <mt-button type="primary" @click.native="callAndroid" slot="right">&nbsp;&nbsp;&nbsp;通知原生APP</mt-button>
        <div>传入参数: {{param}}</div>
    </div>
</template>
<script>
  import {Toast} from 'mint-ui'

  export default {
    layout: 'default',
    data () {
      return {
        param: '',
        param2: []
      }
    },
    mounted () {
      this.$registerMobileEvent('initWeb', this.initWeb)
    },
    methods: {
      initWeb (param) {
        // this.param = JSON.stringify(param)
        // Toast({
        //   message: '传入参数: ' + JSON.stringify(param),
        //   iconClass: 'icon icon-error',
        //   duration: 2000
        // })
        this.param2 = JSON.parse(JSON.stringify(param))
        Toast({
          message: '传入参数sex: ' + this.param2.sex + '|age:' + this.param2.age + '|name:' + this.param2.name,
          iconClass: 'icon icon-error',
          duration: 4000
        })
      },
      callAndroid () {
        try {
          let data = {
            id: '001',
            name: 'test',
            data: 'js调用了android中的方法'
          }
          this.$execMobileEvent('save', data)
        } catch (error) {
          Toast({
            message: '请在安卓webview下点击该功能: ' + error,
            iconClass: 'icon icon-error',
            duration: 2000
          })
        }
      }
    }
  }
</script>