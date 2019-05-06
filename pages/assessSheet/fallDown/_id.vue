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
                <mt-button type="primary" @click.native="handleSave" slot="right">&nbsp;&nbsp;&nbsp;保存</mt-button>
            </mt-header>
        </zm-footer>
    </zm-container>
</template>

<script>
  import ZmMain from '../../../components/common/container-layout/main/src/main'
  import ZmContainer from '../../../components/common/container-layout/container/src/main'
  import ZmHeader from '../../../components/common/container-layout/header/src/main'
  import ZmFooter from '../../../components/common/container-layout/footer/src/main'
  import {Toast} from 'mint-ui'
  import _ from 'lodash'
  import Vue from 'vue'

  export default {
    layout: 'default',
    components: {
      ZmMain,
      ZmContainer,
      ZmHeader,
      ZmFooter
    },
    data () {
      return {
        cancelBtnVisible: false,
        templateId: '',
        mobileClientInput: [],
        templateListData: [],
        testParms2: {
          'assessTime': '1528709123000',
          'assessorCode': '12917',
          'emrId': '505f2a6e-f333-451f-9dee-f0405a8a17f7',
          'eventNo': '2021001',
          'id': 'a5728857-99c0-0d12-c295-a139980fa5e3',
          'nursingAccessData': [
            {
              'nursingAssessItemCode': 'assess_time',
              'nursingAssessItemValue': '2018-06-11 17:25'
            },
            {
              'nursingAssessItemCode': 'cognitive_state',
              'valueCode': '15',
              'nursingAssessItemValue': '高估自己活动能力或忘记自己受限制'
            },
            {
              'nursingAssessItemCode': 'degree_of_risk',
              'nursingAssessItemValue': '高度危险'
            },
            {
              'nursingAssessItemCode': 'assessor',
              'nursingAssessItemValue': '12917'
            },
            {
              'nursingAssessItemCode': 'medical_diagnosis',
              'valueCode': '25',
              'nursingAssessItemValue': '是'
            },
            {
              'nursingAssessItemCode': 'medicine',
              'valueCode': '25',
              'nursingAssessItemValue': '是'
            },
            {
              'nursingAssessItemCode': 'tread',
              'valueCode': '0',
              'nursingAssessItemValue': '正常'
            },
            {
              'nursingAssessItemCode': 'tumble',
              'valueCode': '25',
              'nursingAssessItemValue': '是'
            },
            {
              'nursingAssessItemCode': 'walking_auxiliary',
              'valueCode': '15',
              'nursingAssessItemValue': '使用拐杖、手杖、助行器'
            },
            {
              'nursingAssessItemCode': 'nursing_management',
              'nursingAssessItemValue': '测试'
            },
            {
              'nursingAssessItemCode': 'total_points',
              'nursingAssessItemValue': '105'
            }],
          'parentClassCode': '27',
          'patientId': '3270',
          'templateClassCode': '2705',
          'templateId': '10102',
          'templateName': '住院患者Morse跌倒/坠床危险因素评估表'
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
        dtPickerVal: '',
        odtJsData: '',
        jDisabled: false
      }
    },
    mounted () {
      this.$registerMobileEvent('initWeb', this.initWeb)
      this.$registerMobileEvent('selDtPicker', this.selDtPicker)
      if (!this.$isMobile()) {
        this.initWeb(this.testParms2)
        this.cancelBtnVisible = true
      }
    },
    methods: {
      initWeb (parms) {
        // Toast({
        //   message: 'fallDown-Mdy传入参数: ' + JSON.stringify(parms),
        //   iconClass: 'icon icon-error',
        //   duration: 2000
        // })
        console.log('传入参数: ' + JSON.stringify(parms))
        let sef = this
        this.mobileClientInput = JSON.parse(JSON.stringify(parms))
        this.dtPickerVal = this.mobileClientInput.assessTime
        this.$http.post('mobile/emr/nurserec/bindAssessTemplateInfo', {
          assessRec: JSON.stringify(parms)
        }).then(res => {
          if (res.data === '') {
            Toast({
              message: '获取模板内容失败，请联系管理员 ',
              iconClass: 'icon icon-error',
              duration: 2000
            })
            return ''
          } else {
            console.log('bind:' + JSON.stringify(res.data))
            let odtData = sef.templateListData = res.data
            //  获取脚本接口，动态绑定脚本
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
                        console.log('cell.setString-before-value:' + item.value)
                        console.log('cell.setString-content:' + content)
                        console.log('cell.setString-label:' + item.label)
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
            message: '获取模板内容失败，请联系管理员: ' + error,
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
        //    获取模板脚本
        this.$http.post('mobile/emr/nurserec/getTempalteScript', {
          templateId: this.mobileClientInput.templateId,
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
          console.log('获取模板脚本失败，请联系管理员:' + error)
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
        saveTemplateData.nursingAccessRecord.emrId = this.mobileClientInput.emrId
        saveTemplateData.nursingAccessRecord.templateId = this.mobileClientInput.templateId
        saveTemplateData.nursingAccessRecord.rowDatas = []
        saveTemplateData.nursingAccessRecord.rowDatas[0] = {}
        saveTemplateData.nursingAccessRecord.rowDatas[0].rowId = this.mobileClientInput.id
        saveTemplateData.nursingAccessRecord.rowDatas[0].status = 'update'
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
          }
          saveTemplateData.nursingAccessRecord.rowDatas[0].data[i].id = this.templateListData.templateData[i].id
        }
        console.log('保存：' + JSON.stringify(this.templateListData))
        this.$http.post('mobile/emr/emr/updateNurseAccessRec', {
          nursingAccessRecord: saveTemplateData
        }).then(res => {
          window.console.log(res.data)
          this.saveBtnShow = false
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
      handleBack () {
        this.$router.go(-1)
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
      },
      setScoreAndResult () {
        this.scriptValidate(this.odtJsData)
      }
    },
    watch: {
      dtPickerVal: function (val, oldVal) {
        let dateValue = new Date(parseInt(val / 1000) * 1000)
        this.setSelDateTime(this.$format('yyyy-MM-dd hh:mm:ss', dateValue))
      }
    }
  }
</script>

<style scoped>

</style>