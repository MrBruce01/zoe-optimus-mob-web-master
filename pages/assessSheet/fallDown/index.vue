<template>
    <zm-container>
        <zm-main>
            <div class="item1" v-for="item in templateListData.templateData">
                <div v-if="item.id == 'assess_time'"></div>
                <div v-else-if="item.id == 'assessor'"></div>
                <div v-else-if="item.id == 'total_points'">
                    <mt-field label="总分:" :placeholder="'不可编辑'"
                              :id="item.id" :readonly="true" v-model="item.value"></mt-field>
                </div>
                <div v-else-if="item.dict != ''">
                    <zm-spec-radio :label="item.cnName + ':'"
                                   v-model="item.label"
                                   :content.sync="item.label"
                                   :code.sync="item.value"
                                   :dict-id="item.dict"
                                   :dict-service-info="dictServiceInfo"
                                   :editable="false"
                                   @change="setScoreAndResult"></zm-spec-radio>
                </div>
                <div v-else>
                    <mt-field :label="item.cnName + ':'"
                              :placeholder="'请输入'+item.cnName"
                              :id="item.id"
                              v-model="item.value"></mt-field>
                </div>
            </div>
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
  import {Toast} from 'mint-ui'
  import guidUtils from '../../../utils/guidUtils'
  import _ from 'lodash'
  import Vue from 'vue'

  export default {
    components: {ZmMain},
    data () {
      return {
        saveBtnShow: true,
        cancelBtnVisible: false,
        templateId: '',
        mobileClientInput: [],
        templateListData: [],
        testParms: {
          patientId: '1388',
          eventNo: '846001',
          parentClassCode: '27',
          templateId: '10102'
        },
        dictServiceInfo: {
          url: '/emr/nursingDict/getNursingBusDictItem',
          props: {
            label: 'valueName',
            value: 'valueCode'
          }
        },
        totalPoint: '',
        resultContent: '',
        dtPickerVal: new Date().getHours() + ':' +
        ('00' + new Date().getMinutes()).substr(-new Date().getMinutes().toString().length),
        assessDate: '',
        assessTime: '',
        odtJsData: '',
        jDisabled: false
      }
    },
    mounted () {
      this.$registerMobileEvent('initWeb', this.initWeb)
      this.$registerMobileEvent('selDtPicker', this.selDtPicker)
      if (!this.$isMobile()) {
        this.initWeb(this.testParms)
        this.cancelBtnVisible = true
      }
    },
    methods: {
      //   {"assessorCode":"12917","date":"1528356556400","eventNo":"2021001","parentClassCode":"27","patientId":"3270","templateClassCode":"2705","templateId":"10102","templateName":"住院患者Morse跌倒/坠床危险因素评估表"}
      initWeb (parms) {
        Toast({
          message: 'fallDown-add入参: ' + JSON.stringify(parms),
          iconClass: 'icon icon-error',
          duration: 2000
        })
        let sef = this
        this.mobileClientInput = JSON.parse(JSON.stringify(parms))
        this.dtPickerVal = this.mobileClientInput.data
        console.log('mobileClientInput:' + JSON.stringify(parms))
        // this.setSelDateTime(this.mobileClientInput.date)
        this.$http.post('mobile/emr/nurserec/getNurseRecTemplateInfo', {
          templateCode: sef.mobileClientInput.templateId
        }).then(res => {
          if (res.data === '') {
            Toast({
              message: '获取模板失败，请联系管理员 ',
              iconClass: 'icon icon-error',
              duration: 2000
            })
            return ''
          } else {
            sef.templateListData = res.data
            let odtData = sef.templateListData = res.data
            console.log(odtData)
            //   通过getTempalteScript动态获取脚本接口，如下重写脚本中的方法
            //   获取对象
            odtData.getCursorAccess = function () {
              let cursorAccess = {}
              cursorAccess.getTableRow = function () {
                let row = {}
                //   根据ID获取对象
                row.getCellById = function (id) {
                  let cell = {}
                  for (let item of odtData.templateData) {
                    //    设置/获取对象的value属性值
                    if (item.id === id) {
                      cell.getPropertyValue = function (key) {
                        if (item.value === undefined) {
                          item.value = ''
                        }
                        console.log('cell.getPropertyValue-id:' + id + '|value:' + item.value)
                        return item.value
                      }
                      //  对象赋值/获取
                      cell.setString = function (content) {
                        //    Vue.set触发视图更新；如果用item.value = content只会更改值，不会触发视图刷新
                        Vue.set(item, 'value', content)
                        return item.value
                      }
                    }
                  }
                  return cell
                }
                return row
              }
              return cursorAccess
            }
          }
        }).catch(error => {
          Toast({
            message: '获取模板失败，请联系管理员: ' + error,
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
        //    获取模板脚本
        this.$http.post('mobile/emr/nurserec/getTempalteScript', {
          templateId: sef.mobileClientInput.templateId,
          scriptType: '0'
        }).then(res => {
          if (res.data === '') {
            // Toast({
            //   message: '获取模板脚本失败，请联系管理员 ',
            //   iconClass: 'icon icon-error',
            //   duration: 2000
            // })
            return ''
          } else {
            sef.odtJsData = res.data
            console.log('获取模板脚本，属性contentString：')
            console.log(sef.odtJsData)
          }
        }).catch(error => {
          Toast({
            message: '获取模板脚本失败，请联系管理员: ' + error,
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
      },
      handleSave () {
        if (this.jDisabled) {
          return
        }
        this.jDisabled = true
        let saveTemplateData = {'nursingAccessRecord': {}}
        saveTemplateData.nursingAccessRecord.type = this.mobileClientInput.templateClassCode
        saveTemplateData.nursingAccessRecord.patientId = this.mobileClientInput.patientId
        saveTemplateData.nursingAccessRecord.eventNo = this.mobileClientInput.eventNo
        saveTemplateData.nursingAccessRecord.emrClassCode = this.mobileClientInput.templateClassCode
        saveTemplateData.nursingAccessRecord.emrId = ''
        saveTemplateData.nursingAccessRecord.templateId = this.mobileClientInput.templateId
        saveTemplateData.nursingAccessRecord.rowDatas = []
        saveTemplateData.nursingAccessRecord.rowDatas[0] = {}
        saveTemplateData.nursingAccessRecord.rowDatas[0].rowId = guidUtils()
        saveTemplateData.nursingAccessRecord.rowDatas[0].status = 'add'
        saveTemplateData.nursingAccessRecord.rowDatas[0].timeStamp = this.dtPickerVal
        saveTemplateData.nursingAccessRecord.rowDatas[0].data = []
        for (let i = 0; i < this.templateListData.templateData.length; i++) {
          saveTemplateData.nursingAccessRecord.rowDatas[0].data[i] = {}
          saveTemplateData.nursingAccessRecord.rowDatas[0].data[i].value = ''
          if (this.templateListData.templateData[i].id === 'total_points') {
            this.templateListData.templateData[i].label = this.templateListData.templateData[i].value
          } else if (this.templateListData.templateData[i].id === 'assessor') {
            this.templateListData.templateData[i].label = this.mobileClientInput.assessorCode
          } else if (this.templateListData.templateData[i].id === 'assess_time') {
            this.templateListData.templateData[i].label = this.assessDate + ' ' + this.assessTime
          }
          if (this.templateListData.templateData[i].label != null) {
            saveTemplateData.nursingAccessRecord.rowDatas[0].data[i].value = this.templateListData.templateData[i].label
          } else {
            saveTemplateData.nursingAccessRecord.rowDatas[0].data[i].value = this.templateListData.templateData[i].value
          }
          saveTemplateData.nursingAccessRecord.rowDatas[0].data[i].id = this.templateListData.templateData[i].id
        }
        console.log('save入参：' + JSON.stringify(saveTemplateData))
        this.$http.post('mobile/emr/emr/updateNurseAccessRec', {
          nursingAccessRecord: saveTemplateData
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
        })
      },
      handleBack () {
        this.$router.go(-1)
      },
      setScoreAndResult () {
        this.scriptValidate(this.odtJsData)
      },
      setScrollTop () {
        document.getElementsByClassName('zm-main')[0].scrollTop = event.currentTarget.offsetTop
      },
      selDtPicker (val) {
        Toast({
          message: '修改日期: ' + val,
          iconClass: 'icon icon-error',
          duration: 2000
        })
        this.dtPickerVal = val
      },
      setSelDateTime (selDate) {
        selDate = selDate.replace(/[^0-9]/mg, '-')
        let fullDate = selDate.split('-')
        this.assessDate = fullDate[0] + '-' + fullDate[1] + '-' + fullDate[2]
        this.assessTime = fullDate[3] + ':' + fullDate[4]
      },
      invokeJavaScript (script) {
        let fn = new Function('doc', script) // eslint-disable-line
        return fn(this.templateListData)
      },
      scriptValidate (script) {
        if (!_.isEmpty(script.contentString)) {
          let result = this.invokeJavaScript(script.contentString)
          console.log('脚本执行结果:' + result)
        }
      }
    },
    watch: {
      dtPickerVal: function (val, oldVal) {
        if (val === '' || val === undefined) {
          val = this.mobileClientInput.date
          this.dtPickerVal = this.mobileClientInput.date
        }
        let dateValue = new Date(parseInt(val / 1000) * 1000)
        this.setSelDateTime(this.$format('yyyy-MM-dd hh:mm:ss', dateValue))
      }
    }
  }
</script>

<style scoped>

</style>