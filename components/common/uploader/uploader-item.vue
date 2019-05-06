<template>
  <li class="weui-uploader__file" @click="onClickFile()" >
    <i v-if="!readonly" class="iconfont icon-close-o" @click.stop="onClickDel()"></i>
    <div class="uploader_img" 
    :style="{'background-image': imgUrl}"
    :class="{
      'weui-uploader__file_status': currentOptions.status === 'success'? false : true
    }">
      <div v-if="currentOptions.status !== 'success'">
        <i class="weui-icon-warn" v-if="currentOptions.status==='error'"></i>
        <span v-else-if="currentOptions.status === 'uploading'">上传中</span>
      </div>
    </div>
    <div class="desc">
      <div class="uploader_name">{{ attachName }}</div>
      <div class="uploader_size">{{ formatSize(currentOptions.AttachSize) }}</div>
    </div>
  </li>
</template>
<script>
import config from '~/config'

export default {
  props: {
    options: {
      type: Object,
      required: true,
      default() {
        return {
          AttachId: '',
          AttachName: '',
          AttachSize: '',
          AttachUrl: '',
          FileId: '',
          FileName: '',
          chunk: false,
          status: 'success'
        }
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentOptions: this.options
    }
  },
  methods: {
    onClickDel () {
      this.$emit('on-click-del', this.currentOptions)
    },
    onClickFile () {
      this.$emit('on-click-file', this.currentOptions)
    },
    formatSize (size, pointLength, units ) {
      var unit;
      size = parseInt(size)
      units = units || ['K', 'M', 'G', 'TB' ];
      while ( (unit = units.shift()) && size > 1024 ) {
          size = size / 1024;
      }
      return (unit === 'B' ? size : size.toFixed( pointLength || 2 )) +
              unit;
    }
  },
  computed: {
    attachName () {
      let n = decodeURIComponent(this.currentOptions.AttachName)
      if(n) {
        if(!this.readonly && n.length > 10){
          n = n.substring(0,4) + '...' + n.substring(n.length-5)
        }
        else if(this.readonly && n.length > 25) {
          n = n.substring(0, 19) + '...' + n.substring(n.length-5)
        }
      }
      return n
    },
    imgUrl () {
      let arr = this.currentOptions.AttachName?this.currentOptions.AttachName.split('.') : []
      let ext = ''
      let url = ''
      if(arr.length > 1 ) {
        ext = arr[arr.length-1].toLowerCase()
        if(ext ==='doc' || ext === 'docx') {
          url = '/img/uploader/word@2x.png'
        }
        else if (ext ==='xls' || ext === 'xlsx') {
          url = '/img/uploader/excel@2x.png'
        }
        else if (ext ==='ppt' || ext === 'pptx') {
          url = '/img/uploader/ppt@2x.png'
        }
        else if (ext === 'zip' || ext === 'rar') {
          url = '/img/uploader/zip@2x.png'
        }
        else if (['png','jpg','jpeg','gif','bmp','ico'].find(item => item == ext)) {
          if(url.startsWith('http')){
            url = this.currentOptions.AttachUrl
          }
          else if(this.currentOptions.AttachUrl && this.currentOptions.AttachUrl != '/') {
            url = '/api' + this.currentOptions.AttachUrl
          }
          else {
            url = '/img/uploader/file@2x.png'
          }
        }
        else {
          url = '/img/uploader/file@2x.png'
        }
      }
      else {
        url = '/img/uploader/file@2x.png'
      }
      return 'url(' + url + ')'
    }
  },
  watch: {
    options (newVal) {
      if(JSON.stringify(newVal) !== JSON.stringify(this.currentOptions)) {
        this.currentOptions = newVal
      }
    }
  }
}
</script>

