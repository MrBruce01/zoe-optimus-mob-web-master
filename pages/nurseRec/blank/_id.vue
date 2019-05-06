<template>
    <zm-container>
        <zm-main>
            <div class="item1" v-for="item in templateListData.data">
                <div v-if="item.id == 'pathography'">
                    <mt-field label="病情记录:"
                              v-model="item.value"
                              placeholder="请输入内容"
                              type="textarea"
                              rows="4"
                              id="pathography"></mt-field>
                </div>
            </div>
        </zm-main>
        <zm-footer>
            <mt-header title="">
                <mt-button icon="primary" @click.native="handleBack" v-show="cancelBtnVisible" slot="right">取消
                </mt-button>
                <mt-button type="primary" @click.native="handleSave" slot="right">&nbsp;&nbsp;&nbsp;保存</mt-button>
            </mt-header>
        </zm-footer>
    </zm-container>
</template>

<script>
  import ZmMain from '../../../components/common/container-layout/main/src/main'
  import {MessageBox, Toast} from 'mint-ui'

  export default {
    components: {ZmMain},
    layout: 'default',
    data () {
      return {
        cancelBtnVisible: false,
        templateListData: [],
        mobileClientInput: [],
        nurseDate: '',
        nurseTime: '',
        dtPickerVal: new Date().getHours() + ':' +
        ('00' + new Date().getMinutes()).substr(-new Date().getMinutes().toString().length),
        inputValue: '',
        jDisabled: false
      }
    },
    mounted () {
      if (!this.$isMobile()) {
        let str = this.$route.query.content
        this.mobileClientInput = JSON.parse(JSON.stringify(str))
        window.console.log('入参内容:' + JSON.stringify(this.mobileClientInput))
        this.templateListData = JSON.parse(JSON.parse(JSON.stringify(this.mobileClientInput.jsonData)))
        this.mobileClientInput.operCode = '1'
        this.mobileClientInput.operName = '测试护士'
        this.cancelBtnVisible = true
      }
      this.$registerMobileEvent('initWeb', this.initWeb)
      this.$registerMobileEvent('selDtPicker', this.selDtPicker)
    },
    methods: {
      initWeb (parms) {
        Toast({
          message: '界面传入参数: ' + JSON.stringify(parms),
          iconClass: 'icon icon-error',
          duration: 1000
        })
        this.mobileClientInput = JSON.parse(JSON.stringify(parms))
        this.templateListData = JSON.parse(JSON.stringify(this.mobileClientInput.jsonData))
      },
      handleBack () {
        MessageBox.confirm('表单未保存，是否离开').then(action => {
          this.$router.push({
            name: 'nurseRec-roleList-eventNo',
            params: {
              patientId: this.mobileClientInput.patientId,
              eventNo: this.mobileClientInput.eventNo
            }
          })
        }, action => {
        })
      },
      handleSave () {
        if (this.jDisabled) {
          return
        }
        this.jDisabled = true
        this.templateListData.status = 'update'
        this.templateListData.operCode = this.mobileClientInput.operCode
        this.templateListData.operName = this.mobileClientInput.operName
        this.templateListData.patientId = this.mobileClientInput.patientId
        this.templateListData.eventNo = this.mobileClientInput.eventNo
        this.templateListData.emrId = this.mobileClientInput.emrId
        this.templateListData.babyFlag = this.mobileClientInput.babyFlag
        this.templateListData.templateCode = this.mobileClientInput.templateCode
        this.templateListData.guid = this.mobileClientInput.guid
        this.templateListData.emrClassCode = this.mobileClientInput.emrClassCode
        this.templateListData.templateData = []
        for (let i = 0; i < this.templateListData.data.length; i++) {
          this.templateListData.templateData[i] = {}
          this.templateListData.templateData[i].value = this.templateListData.data[i].value
          this.templateListData.templateData[i].id = this.templateListData.data[i].id
        }
        window.console.log('保存前templateListData值：' + this.templateListData)
        this.$http.post('mobile/emr/nurserec/saveNurseRecForWeb', {
          content1: this.templateListData,
          content2: '',
          content3: ''
        }).then(res => {
          window.console.log('saveNurseRecForWeb调用结果:' + res.data)
          this.jDisabled = false
          Toast({
            message: '保存成功',
            iconClass: 'icon icon-success',
            duration: 1000
          })
        }).catch(error => {
          Toast({
            message: '保存失败: ' + error,
            iconClass: 'icon icon-error',
            duration: 2000
          })
          console.log('保存失败：' + error)
          this.jDisabled = false
        })
      },
      selDtPicker (val) {
        this.dtPickerVal = val
      }
    }
  }
</script>

<style scoped>

</style>