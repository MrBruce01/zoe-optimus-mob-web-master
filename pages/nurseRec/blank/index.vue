<template>
    <zm-container>
        <zm-main>
            <mt-field label="病情记录:"
                      v-model="inputValue"
                      placeholder="请输入内容"
                      type="textarea"
                      rows="4"
                      id="pathography"></mt-field>
        </zm-main>
        <zm-footer>
            <mt-header title="">
                <mt-button icon="primary" @click.native="handleBack" v-show="cancelBtnVisible" slot="right">取消
                </mt-button>
                <mt-button type="primary" @click.native="handleSave" slot="right" v-show="saveBtnShow">&nbsp;&nbsp;&nbsp;保存</mt-button>
            </mt-header>
        </zm-footer>
    </zm-container>
</template>

<script>
  import ZmMain from '../../../components/common/container-layout/main/src/main'
  import {MessageBox, Toast} from 'mint-ui'
  import guidUtils from '../../../utils/guidUtils'

  export default {
    components: {ZmMain},
    layout: 'default',
    data () {
      return {
        saveBtnShow: true,
        cancelBtnVisible: false,
        templateListData:
          {
            babyFlag: '',
            emrClassCode: '8',
            eventNo: '',
            patientId: '',
            type: '4',
            templateData: [
              {
                id: 'nursing_date', value: ''
              }, {
                id: 'nursing_time', value: ''
              }, {
                id: 'pathography', value: ''
              }]
          },
        mobileClientInput: [],
        nurseDate: '',
        nurseTime: '',
        dtPickerVal: new Date().getHours() + ':' +
        ('00' + new Date().getMinutes()).substr(-new Date().getMinutes().toString().length),
        inputValue: '',
        templateCodeData: [],
        jDisabled: false
      }
    },
    mounted () {
      this.$registerMobileEvent('initWeb', this.initWeb)
      this.$registerMobileEvent('selDtPicker', this.selDtPicker)
      if (!this.$isMobile()) {
        let selDate = new Date()
        let month = selDate.getMonth() < 10 ? '0' + (selDate.getMonth() + 1) : (selDate.getMonth() + 1)
        let hours = selDate.getHours() < 10 ? '0' + selDate.getHours() : selDate.getHours()
        let mins = selDate.getMinutes() < 10 ? '0' + selDate.getMinutes() : selDate.getMinutes()
        this.nurseDate = month + '-' + selDate.getDate()
        this.nurseTime = hours + ':' + mins
        this.mobileClientInput.patientId = '260'
        this.mobileClientInput.eventNo = '181001'
        this.mobileClientInput.babyFlag = '0'
        this.mobileClientInput.operCode = '1'
        this.mobileClientInput.operName = '测试护士'
        this.cancelBtnVisible = true
      }
    },
    methods: {
      initWeb (parms) {
        Toast({
          message: 'history传入参数: ' + JSON.stringify(parms),
          iconClass: 'icon icon-error',
          duration: 2000
        })
        this.mobileClientInput = JSON.parse(JSON.stringify(parms))
        console.log('入参：' + JSON.stringify(parms))
        this.setSelDateTime(this.mobileClientInput.date)
        this.$http.post('mobile/emr/nurserec/getPatientNursingTemplateCode', {
          patientId: this.mobileClientInput.patientId,
          eventNo: this.mobileClientInput.eventNo,
          babyFlag: this.mobileClientInput.babyFlag
        }).then(res => {
          if (res.data === '') {
            Toast({
              message: '获取模板ID失败，请联系管理员 ',
              iconClass: 'icon icon-error',
              duration: 2000
            })
            return ''
          } else {
            this.templateCodeData = res.data
          }
        }).catch(error => {
          Toast({
            message: '获取模板ID失败，请联系管理员: ' + error,
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
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
        this.templateListData.patientId = this.mobileClientInput.patientId
        this.templateListData.eventNo = this.mobileClientInput.eventNo
        this.templateListData.status = 'add'
        this.templateListData.emrId = ''
        this.templateListData.babyFlag = this.mobileClientInput.babyFlag
        this.templateListData.templateCode = this.templateCodeData.templateCode
        this.templateListData.operCode = this.mobileClientInput.operCode
        this.templateListData.operName = this.mobileClientInput.operName
        this.templateListData.guid = guidUtils()
        for (let i = 0; i < this.templateListData.templateData.length; i++) {
          if (this.templateListData.templateData[i].id === 'nursing_date') {
            this.templateListData.templateData[i].value = this.nurseDate
          } else if (this.templateListData.templateData[i].id === 'nursing_time') {
            this.templateListData.templateData[i].value = this.nurseTime
          } else if (this.templateListData.templateData[i].id === 'pathography') {
            this.templateListData.templateData[i].value = this.inputValue
          }
        }
        window.console.log('保存前templateListData值：' + this.templateListData)
        if (this.jDisabled) {
          return
        }
        this.jDisabled = true
        this.$http.post('mobile/emr/nurserec/saveNurseRecForWeb', {
          content1: this.templateListData,
          content2: '',
          content3: ''
        }).then(res => {
          window.console.log(res.data)
          this.saveBtnShow = false
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
          this.saveBtnShow = true
        })
      },
      selDtPicker (val) {
        this.dtPickerVal = val
      },
      setSelDateTime (selDate) {
        selDate = selDate.replace(/[^0-9]/mg, '-')
        let fullDate = selDate.split('-')
        this.nurseDate = fullDate[1] + '-' + fullDate[2]
        this.nurseTime = fullDate[3] + ':' + fullDate[4]
      }
    }
  }
</script>

<style scoped>

</style>