<template>
  <div>
    <div v-if="!!title" style="padding:10px 15px;position: relative;display:flex;">
      <p>
        <label class="vux-label">{{ title }}</label>
      </p>
    </div>
    <div class="weui-uploader" style="padding:0 15px;">
      <div class="weui-uploader__bd"
        :class="{'uploader_container': !readonly, 'uploader_readonly_container': readonly, 'vux-1px-b':readonly}">
        <div class="uploader_content">
          <ul class="weui-uploader__files" >
            <uploader-item v-for="file in fileList"
            :class="{'vux-1px-t': readonly}"
            :key="file.AttachId" 
            :options="file"
            :readonly="readonly"
            @on-click-file="onClickFile"
            @on-click-del="onClickDel"
            >
            </uploader-item>
            <li class="weui-uploader__file"
            v-if="!readonly"
            v-show="!hideAdd"
            >
              <div class="weui-uploader__input-box uploader_img">
                <input class="weui-uploader__input" type="file" 
                  accept="image/*"
                  multiple @change="uploaderFile"
                  ref="uploader_file"
                  name="file" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus"
        show-cancel
        v-model="showAction"
        @on-click-menu="onClickMenu"></actionsheet>
    </div>
    <div v-transfer-dom>
      <previewer :list="imgList" ref="previewer" ></previewer>
    </div>
    <div>
      <x-dialog v-model="videoShow"
        hide-on-blur
        style="width: 100%;"
        @on-show="showVideoDia"
        @on-hide="hideVideoDia">
        <video-player class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          @ready="videoReady"
          :options="getVideoOptions"></video-player>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Actionsheet, Previewer, XDialog } from 'mint-ui'
import UploaderItem from './uploader-item'
import JsHelper from '~/utils/JsHelper'
import axios from 'axios'

export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    moduleName: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    hideAdd: {
      type: Boolean,
      default: false
    },
    title: String
  },
  data () {
    return {
      currentValue: '',
      currentModuleName: '',
      guid: '',
      AUTHID: '',
      ASPSESSID: '',
      fileList: [],
      showAction: false,
      menus: [],
      clickFileInfo: {},
      imgList:[{
        src: '/img/uploader/file@3x.png'
      }],
      videoShow: false,
      videoUrl: ''
    }
  },
  components: {
    UploaderItem,
    Actionsheet,
    Previewer,
    XDialog
  },
  computed: {
    getVideoOptions () {
      let opt = {
        playbackRates: [],
        sources: [],
        autoplay: 'play',
        poster: "", //你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true,  //全屏按钮
          volumeMenuButton: false
        }
      }
      if(this.videoUrl) {
        opt.sources.push({
          type: "video/mp4",
          src: "/api" + this.videoUrl //url地址
        })
      }
      return opt
    }
  },
  mounted() {
    this.currentValue = this.value
    this.currentModuleName = this.moduleName
    this.guid = this.getGuid()()
    this.$his5http.post('/api/Base/GetUploadifySession').then(res => {
      let d = JsHelper.strToJson(res)
      if(d.success){
        let msg = JsHelper.strToJson(d.message)
        this.AUTHID = msg.auth
        this.ASPSESSID = msg.aspsessid
      }
      else {
        this.$vux.toast.show({
          type: 'error',
          text: '上传控件获取出了些问题'
        })
      }
    })
    if(this.currentValue) {
      this.getFileList()
    }
  },
  methods: {
    getFileList () {
      this.$his5http.post('/api/AttachmentManage/GetAttachmentInfo',{
        fileId: this.currentValue,
        moduleName: this.moduleName
      }).then(res => {
        let msg = JsHelper.strToJson(res)
        if(msg.success) {
          if(msg.data && msg.data.length > 0) {
            var l = []
            for(let d in msg.data) {
              msg.data[d].status = 'success'
              if(msg.data[d].AttachId.substring(msg.data[d].AttachId.length - 2) != '-1'){
                l.push(msg.data[d])
              }
            }
            this.fileList = l
          }
        }
        else {
          this.$vux.toast.show({
            type: 'error',
            text: '获取文件列表时出现了一些意外'
          })
        }
      })
    },
    uploaderFile () {
      let me = this
      if(!this.currentValue) {
        let f = Date.now() + (Math.random() * 10).toFixed(0)
        this.currentValue = f
        this.$emit('input', f)
      }
      if(this.$refs.uploader_file.files.length > 0){
        for(let i=0; i<this.$refs.uploader_file.files.length; i++) {
          // let url = '/api/AttachmentManage/WebUploaderAtt?moduleName=' +
          //  this.currentModuleName + '&guid=' + this.guid
          let formdata = new FormData()
          let url = '/api/AttachmentManage/WebUploaderAtt?ASPSESSID=' + this.ASPSESSID +
           '&AUTHID=' + this.AUTHID + '&moduleName=' +
           this.currentModuleName + '&guid=' + this.guid
          // let file = this.$refs.uploader_file.files[i]
          formdata.append('fileId', this.currentValue)
          formdata.append('size', this.$refs.uploader_file.files[i].size)
          formdata.append('lastModifiedDate', this.$refs.uploader_file.files[i].lastModifiedDate)
          formdata.append('name', this.$refs.uploader_file.files[i].name)
          formdata.append('type', this.$refs.uploader_file.files[i].type)
          formdata.append('file', this.$refs.uploader_file.files[i])

          let optionsJson = {
            AttachId: '',
            id: Date.now() + (Math.random * 1000).toFixed(0),
            AttachName: this.$refs.uploader_file.files[i].name,
            AttachSize: this.$refs.uploader_file.files[i].size/1024,
            AttachUrl: '',
            FileId: this.currentValue,
            FileName: this.currentModuleName,
            chunk: false,
            file: this.$refs.uploader_file.files[i],
            status: 'uploading'
          }
          this.fileList.push(optionsJson)
          
          axios.post(url, formdata).then( res => {
            let fileInfo = JsHelper.strToJson(res.data)
            for(let i=0;i<me.fileList.length; i++){
              if(me.fileList[i].id ===optionsJson.id) {
                me.fileList[i].AttachId = fileInfo.AttachId
                me.fileList[i].AttachName = fileInfo.AttachName
                me.fileList[i].AttachUrl = fileInfo.AttachUrl
                me.fileList[i].AttachSize = fileInfo.AttachSize
                me.fileList[i].FileId = fileInfo.FileId
                me.fileList[i].status = 'success'
              }
            }
          }).catch(function (error) {
            for(let i=0;i<me.fileList.length; i++){
              if(me.fileList[i].id ===optionsJson.id) {
                me.fileList[i].status = 'error'
              }
            }
          })
        }
      }
    },
    onClickFile (fileInfo) {
      this.clickFileInfo = fileInfo
      let t = []
      t.push({
        label: decodeURIComponent(fileInfo.AttachName),
        type: 'info'
      })
      if(fileInfo.status =='success') {
        if(!JsHelper.isIOS()) {
          t.push({
            label: '下载',
            value: 'download'
          })
        }
        let n = decodeURIComponent(fileInfo.AttachName)
        if(n) {
          let arr = n.split('.')
          let ext = arr[arr.length-1].toLowerCase()
          let canView = ['png','jpg','jpeg','gif','bmp','ico','pdf','doc','docx', 'xls','xlsx', 'mp4']
          if(canView.find(item => item == ext)){
            t.push({
              label: '查看',
              value: 'view'
            })
          }
        }
      }
      if(!this.readonly){
        t.push({
          label: '删除',
          value: 'del',
          type: 'warn'
        })
      }
      this.menus = t
      this.showAction = true
    },
    onClickDel (fileInfo) {
      let vm = this
      if(fileInfo.status === 'error') {
        for(let i=0;i<vm.fileList.length; i++){
          if(vm.fileList[i].id ===fileInfo.id) {
            vm.fileList.splice(i,1)
            return
          }
        }
      }
      vm.$vux.confirm.show({
        title: '警告',
        content: '确定删除' + decodeURIComponent(fileInfo.AttachName) + '吗？',
        onConfirm () {
          request.post('/api/AttachmentManage/DeleteAttachment',{
            fileId: fileInfo.FileId,
            moduleName: fileInfo.FileName,
            attachId: fileInfo.AttachId
          }).then(res => {
            let msg = JsHelper.strToJson(res)
            if(msg.success) {
              for(let i=0;i<vm.fileList.length; i++){
                if(vm.fileList[i].AttachId ===fileInfo.AttachId) {
                  vm.fileList.splice(i,1)
                  vm.$vux.toast.show('删除成功!')
                  return
                }
              }
            }
            else {
              vm.$vux.toast.show(msg.message)
            }
          })
        }
      })
    },
    getGuid () {
      var counter = 0
      return function (prefix) {
        let guid = (+new Date()).toString(32),i=0
        for(;i<5;i++){
          guid += Math.floor(Math.random() * 65535).toString(32)
        }
        return (prefix || 'mb_') + guid + (counter++).toString(32)
      }
    },
    onClickMenu (key) {
      let vm = this
      let fileInfo = vm.clickFileInfo
      if(key === 'download') {
        vm.downloadFile(fileInfo)
      }
      else if(key === 'view'){
        vm.viewFile(fileInfo)
      }
      else if(key === 'del') {
        vm.onClickDel(fileInfo)
      }
    },
    downloadFile(fileInfo) {
      let vm = this
      let isIOS = JsHelper.isIOS()
      let url = '/api/AttachmentManage/DownLoadAttachment?fileId=' + fileInfo.FileId
        + '&moduleName='+ vm.moduleName + '&attachId='+fileInfo.AttachId
      if(isIOS) {

      }
      else {
        var myFrame= document.createElement('iframe')
        myFrame.src = url
        myFrame.style.display = 'none'
        document.body.appendChild(myFrame);
      }
      // window.location = config.service + '/AttachmentManage/DownLoadAttachment?fileId=' + fileInfo.FileId
      //   + '&moduleName='+ vm.moduleName + '&attachId='+fileInfo.AttachId
    },
    viewFile(fileInfo) {
      let vm = this
      let n = decodeURIComponent(fileInfo.AttachName)
      if(n) {
        let arr = n.split('.')
        let ext = arr[arr.length-1].toLowerCase()
        if(['png','jpg','jpeg','gif','bmp','ico'].find(item => item == ext)) {
          if(fileInfo.AttachUrl && fileInfo.AttachUrl != '/') {
            vm.imgList[0].src='/api' + fileInfo.AttachUrl
            vm.$refs.previewer.show(0)
            // vm.imgsrc = config.service + fileInfo.AttachUrl
            // vm.fileType = 'img'
            // vm.showDialog = true
          }
        }
        else if(ext === 'pdf') {
          vm.$showPDF('/api' +fileInfo.AttachUrl, {title: n, reset: true})
        }
        else if(ext === 'doc' || ext ==='docx' || ext ==='xls' || ext === 'xlsx' ) {
          vm.$vux.loading.show()
          request.get('/api/AttachmentManage/DownLoadPdf', {
            fileId: fileInfo.FileId,
            moduleName: vm.moduleName,
            attachmentId: fileInfo.AttachId
          }).then(res => {
            vm.$vux.loading.hide()
            if(res.indexOf('失败') >= 0) {
              vm.$vux.toast.show(res)
            }
            else {
              vm.$showPDF('/api' + res, {title: n, reset: true})
              // vm.$showPDF(config.service + res, {title: n, reset: true})
            }
          })
        }
        else if(ext === 'mp4' || ext === 'ogg' || ext === 'webm') {
          vm.videoUrl = fileInfo.AttachUrl
          vm.videoShow = true
        }
      }
    },
    videoReady(player){
      player.play()
    },
    showVideoDia() {
      let vm = this
      setTimeout(()=> {
        if(vm.$refs.videoPlayer.player) {
          vm.$refs.videoPlayer.player.play()
        }
      }, 100)
    },
    hideVideoDia() {
      this.$refs.videoPlayer.player.pause()
    }
  },
  watch: {
    value (newVal) {
      if(newVal && newVal.toString() !== this.currentValue) {
        this.currentValue = newVal.toString()
        this.getFileList()
      }
    },
    moduleName (newVal) {
      if(this.currentModuleName!== newVal) {
        this.currentModuleName = newVal
        if(this.currentValue){
          this.getFileList()
        }
      }
    },
    fileList: {
      handler(newVal) {
        this.$emit('file-list-change', newVal)
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/weui/widget/weui-uploader/index.less';

.uploader_container { 
  width: 100%; height: 160px; overflow: hidden;
  padding: 10px 0 0;
}
.uploader_container > .uploader_content {
    padding-bottom: 10px; 
    white-space: nowrap;
    overflow: hidden;
    overflow-x: scroll; /* 1 */
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    -webkit-overflow-scrolling: touch; /* 2 */
    text-align: justify; /* 3 */
    &::-webkit-scrollbar { display: none;}
}
.uploader_container > .uploader_content > ul > li {
  width: 94px; 
  height: 130px; 
  line-height: 130px;
  position: relative; 
  display: inline-block; 
  text-align: center;
  float: none;
  vertical-align: top;
  margin-bottom: 0;
}
.uploader_container ul > li > i {
  position: absolute;
  top: 4px;
  right: 4px;
  line-height: 16px;
  color: #fff;
  background: #000;
  border-radius: 8px;
}

.uploader_container li > .uploader_img {
  width: 94px;
  height: 94px;
  line-height: 94px;
  background-size: cover;
  border-radius: 5px;
}
.uploader_container li .uploader_name {
  margin-top: 6px;
  line-height: 12px;
  font-size: 12px;
}
.uploader_container li .uploader_size {
  margin-top: 6px;
  font-size: 12px;
  line-height: 12px;
}
// 只读时样式
.uploader_readonly_container > .uploader_content > ul > li{
  display: flex;
  float: none;
  width: 100%;
  height: 60px;
  padding: 8px 0;
}
.uploader_readonly_container li > .uploader_img {
  display: inline-block;
  width: 45px;
  height: 45px;
  background-size: cover;
  border-radius: 5px;
}
.uploader_readonly_container li > .desc {
  flex: 1;
  vertical-align: middle;
  height: 45px;
  padding-left: 14px;
}
.uploader_readonly_container li .uploader_name {
  margin-top: 3px;
  line-height: 16px;
  font-size: 16px;
}
.uploader_readonly_container li .uploader_size {
  margin-top: 5px;
  font-size: 12px;
  line-height: 12px;
  color: #999;
}
</style>
