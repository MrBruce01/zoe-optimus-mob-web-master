<template>
    <div>
        <mt-button type="primary" @click.native="add(123)" slot="right">&nbsp;&nbsp;&nbsp;新增</mt-button>
        <mt-button type="primary" @click.native="save" slot="right">&nbsp;&nbsp;&nbsp;保存</mt-button>
        <mt-button type="primary" @click.native="callAndroid" slot="right">&nbsp;&nbsp;&nbsp;通知原生APP</mt-button>
    </div>
</template>
<script>
  import {Toast} from 'mint-ui'

  export default {
    layout: 'default',
    mounted () {
      let sel = this
      window.demo_save = function () {
        alert('22')
        sel.demo_save()
      }
      window.demo_add = function (val) {
        alert('0000')
        sel.demo_add(val)
      }
    },
    methods: {
      demo_add (value) {
        Toast({
          message: '传入参数: ' + value,
          iconClass: 'icon icon-error',
          duration: 2000
        })
      },
      demo_save () {
        alert('333')
        Toast({
          message: '传入参数22222 ',
          iconClass: 'icon icon-error',
          duration: 2000
        })
      },
      callAndroid () {
        try {
          window.__zoeMobileClient.hello('js调用了android中的hello方法')
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