<template>
    <zm-container>
        <zm-header>
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">常规录入</mt-tab-item>
                <mt-tab-item id="2">入量</mt-tab-item>
                <mt-tab-item id="3">出量</mt-tab-item>
                <mt-tab-item id="4">医嘱</mt-tab-item>
            </mt-navbar>
        </zm-header>
        <zm-main>
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <div>
                        <div class="item1" v-for="item in templateListData.templateData">
                            <div v-if="item.id == 'nursing_date'"></div>
                            <div v-else-if="item.id == 'nursing_time'"></div>
                            <div v-else-if="item.id == 'input_name'"></div>
                            <div v-else-if="item.id == 'input_value'"></div>
                            <div v-else-if="item.id == 'output_name'"></div>
                            <div v-else-if="item.id == 'output_value'"></div>
                            <div v-else-if="item.id == 'output_color'"></div>
                            <div v-else-if="item.id == 'signature'">
                                <mt-field :label="item.cnName + ':'" :placeholder="'不可编辑'"
                                          :id="item.id" :readonly="true" v-model="item.value"></mt-field>
                            </div>
                            <div v-else-if="item.dict != ''">
                                <zm-radio :label="item.cnName + ':'"
                                          v-model="item.value"
                                          :content.sync="item.label"
                                          :dict-id="item.dict"
                                          :dict-service-info="dictServiceInfo"
                                          :editable="false"></zm-radio>
                            </div>
                            <div v-else-if="item.id == 'temperature'">
                                <!--<mt-field :label="item.cnName + ':'"-->
                                <!--:placeholder="'请输入'+item.cnName"-->
                                <!--:id="item.id"-->
                                <!--v-model="item.value"-->
                                <!--@change.native="verifierTemperature(item.value)"></mt-field>-->
                                <zm-radio :label="item.cnName + ':'"
                                          v-model="item.value"
                                          :content.sync="item.label"
                                          :dict-data="temperatureData"
                                          :editable="false"></zm-radio>
                            </div>
                            <div v-else-if="item.id == 'pulse'">
                                <mt-field :label="item.cnName + ':'"
                                          :placeholder="'请输入'+item.cnName"
                                          :id="item.id"
                                          v-model="item.value"
                                          type="number"
                                          @change.native="verifierPluse(item.value)"></mt-field>
                            </div>
                            <div v-else-if="item.id == 'breathe'">
                                <mt-field :label="item.cnName + ':'"
                                          :placeholder="'请输入'+item.cnName"
                                          :id="item.id"
                                          v-model="item.value"
                                          type="number"
                                          @change.native="verifierBreathe(item.value)"></mt-field>
                            </div>
                            <div v-else>
                                <mt-field :label="item.cnName + ':'"
                                          :placeholder="'请输入'+item.cnName"
                                          :id="item.id"
                                          v-model="item.value"
                                          @click.native="setScrollTop($)"></mt-field>
                            </div>
                        </div>
                        <mt-datetime-picker
                                ref="picker1"
                                type="time"
                                @confirm="selDtPicker">
                        </mt-datetime-picker>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <div v-for="item in inputItemData">
                        <mt-field :label="item.ioTypeItemName+ '('+item.unitCode+'):'"
                                  v-model="item.value" type="number"
                                  :placeholder="'请输入'+item.ioTypeItemName"
                                  :id="item.ioTypeItemCode"></mt-field>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="3">
                    <div v-for="item in outputItemData">
                        <mt-field :label="item.ioTypeItemName+ '('+item.unitCode+'):'"
                                  v-model="item.value" type="number"
                                  :placeholder="'请输入'+item.ioTypeItemName"
                                  :id="item.ioTypeItemCode"></mt-field>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="4">
                    <table>
                        <thead>
                        <tr>
                            <th width="21%">下嘱时间</th>
                            <th width="2%"></th>
                            <th width="46%">医嘱名称</th>
                            <th width="15%">剂量</th>
                            <th width="16%">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in inputPresData">
                            <td>{{getFormatDate(item.operatTime)}}</td>
                            <td>
                                <div v-if="item.groupClass ==='1'"
                                     style="border-top: 2px solid #00a3e7;border-left: 2px solid #00a3e7;width: 5px;">
                                    &nbsp;
                                </div>
                                <div v-else-if="item.groupClass ==='2'" style="border-left: 2px solid #00a3e7;">&nbsp;
                                </div>
                                <div v-else-if="item.groupClass ==='3'"
                                     style="border-bottom: 2px solid #00a3e7;border-left: 2px solid #00a3e7;">&nbsp;
                                </div>
                                <div v-else="item.groupClass ===''"></div>
                            </td>
                            <td>{{item.itemName}}</td>
                            <td>{{item.dosage}} {{item.dosageUnit}}</td>
                            <td>
                                <mt-button v-if="item.check === ''" @click.native="addPresItem(item)"
                                           size="small">引用
                                </mt-button>
                                <mt-button v-else-if="item.check === '1'"
                                           style="background-color: lightgreen;" size="small"
                                           @click.native="cancelPresItem(item)">取消
                                </mt-button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </mt-tab-container-item>
            </mt-tab-container>
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
  import ZmContainer from '../../../components/common/container-layout/container/src/main'
  import ZmHeader from '../../../components/common/container-layout/header/src/main'
  import ZmFooter from '../../../components/common/container-layout/footer/src/main'
  import {MessageBox, Toast} from 'mint-ui'
  import guidUtils from '../../../utils/guidUtils'

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
        selected: '1',
        templateListData: [],
        inputItemData: [],
        outputItemData: [],
        dtPickerVal: new Date().getHours() + ':' +
        ('00' + new Date().getMinutes()).substr(-new Date().getMinutes().toString().length),
        dictServiceInfo: {
          url: '/emr/nursingDict/getNursingBusDictItem',
          props: {
            label: 'valueName',
            value: 'valueName'
          }
        },
        outResult: [
          {
            patientId: '260',
            eventNo: '181001',
            babyFlag: '0',
            emrClassCode: '8',
            nursingData: [
              {
                rowId: '825d8d14-36f5-6142-ec89-61b9964a0679',
                templateId: '1516',
                type: '0',
                status: 'add',
                timeStamp: '1513668815000',
                emrId: '',
                modifierList: [{name: '测试人员', id: '1'}],
                data: []
              }]
          }],
        mobileClientInput: [],
        nurseDate: '',
        nurseTime: '',
        staffNo: '',
        patientId: '',
        eventNo: '',
        saveBtnShow: true,
        cancelBtnVisible: false,
        pulseValue: '',
        breatheValue: '',
        temperatureValue: '',
        tempData: [],
        temperatureData: [],
        jDisabled: false,
        inputPresData: []
      }
    },
    mounted () {
      this.$registerMobileEvent('initWeb', this.initWeb)
      this.$registerMobileEvent('selDtPicker', this.selDtPicker)
      this.$http.post('mobile/emr/nurserec/getNurseRecTemplateInfo', {
        templateCode: this.$route.query.id
      }).then(res => {
        window.console.log('模板内容:' + JSON.stringify(res.data))
        let templateListData = JSON.parse(JSON.stringify(res.data))
        for (let item of templateListData.templateData) {
          item.value = ''
          item.label = ''
        }
        this.templateListData = templateListData
      }).catch(error => {
        Toast({
          message: '获取模板内容失败: ' + error,
          iconClass: 'icon icon-error',
          duration: 2000
        })
      })
      this.$http.post('mobile/emr/nurserec/findNursingDictItem', {
        ioTypeCode: '1'
      }).then(res => {
        window.console.log(res.data)
        let inputItemData = res.data
        for (const inputItem of inputItemData) {
          inputItem.value = ''
        }
        this.inputItemData = inputItemData
        console.log('模板inputItemData：' + JSON.stringify(inputItemData))
      }).catch(error => {
        Toast({
          message: '获取入量字典项失败: ' + error,
          iconClass: 'icon icon-error',
          duration: 2000
        })
      })
      this.$http.post('mobile/emr/nurserec/findNursingDictItem', {
        ioTypeCode: '2'
      }).then(res => {
        window.console.log(res.data)
        let outputItemData = res.data
        for (const outputItem of outputItemData) {
          outputItem.value = ''
        }
        this.outputItemData = outputItemData
      }).catch(error => {
        Toast({
          message: '获取出量字典项失败: ' + error,
          iconClass: 'icon icon-error',
          duration: 2000
        })
      })
      if (!this.$isMobile()) {
        let selDate = new Date()
        let month = selDate.getMonth() < 10 ? '0' + (selDate.getMonth() + 1) : (selDate.getMonth() + 1)
        let hours = selDate.getHours() < 10 ? '0' + selDate.getHours() : selDate.getHours()
        let mins = selDate.getMinutes() < 10 ? '0' + selDate.getMinutes() : selDate.getMinutes()
        this.nurseDate = month + '-' + selDate.getDate()
        this.nurseTime = hours + ':' + mins
        this.mobileClientInput.patientId = '1585'
        this.mobileClientInput.eventNo = '964001'
        this.cancelBtnVisible = true
        this.getTempByDate(this.mobileClientInput.patientId, this.mobileClientInput.eventNo, 0, '1526486400000')
        this.getPresByCondition(this.mobileClientInput.patientId, this.mobileClientInput.eventNo,
          '0', [])
      }
    },
    methods: {
      initWeb (parms) {
        //    入参：{"babyFlag":"0","eventNo":"846001","patientId":"1388","babyName":"个人","staffNo":"12917","staffName":"陈护士","operName":"陈护士","templateCode":"10075","operCode":"12917","date":"2018-05-1709: 42"}"
        Toast({
          message: 'history传入参数: ' + JSON.stringify(parms),
          iconClass: 'icon icon-error',
          duration: 2000
        })
        this.mobileClientInput = JSON.parse(JSON.stringify(parms))
        console.log('入参：' + JSON.stringify(parms))
        this.setSelDateTime(this.mobileClientInput.date)
        let date = new Date(this.mobileClientInput.date)
        let time = Date.parse(date)
        //    获取患者体征记录，用于引用体征信息
        this.getTempByDate(this.mobileClientInput.patientId, this.mobileClientInput.eventNo,
          this.mobileClientInput.babyFlag, time)
        //    获取引用医嘱信息
        this.getPresByCondition(this.mobileClientInput.patientId, this.mobileClientInput.eventNo,
          '0', [])
      },
      handleBack () {
        MessageBox.confirm('表单未保存，是否离开').then(action => {
          // try {
          //   this.$execMobileEvent('back')
          // } catch (error) {
          //   Toast({
          //     message: '调用安卓客户端的方法: ' + error,
          //     iconClass: 'icon icon-error',
          //     duration: 2000
          //   })
          // }
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
        if (this.verifierTemperature(this.temperatureValue) === false) {
          Toast({
            message: '体温格式有误，请检查 ',
            iconClass: 'icon icon-error',
            duration: 2000
          })
          return
        }
        if (this.verifierPluse(this.pulseValue) === false) {
          Toast({
            message: '脉搏格式有误，请检查 ',
            iconClass: 'icon icon-error',
            duration: 2000
          })
          return
        }
        if (this.verifierBreathe(this.breatheValue) === false) {
          Toast({
            message: '呼吸格式有误，请检查 ',
            iconClass: 'icon icon-error',
            duration: 2000
          })
          return
        }

        for (let i = 0; i < this.templateListData.templateData.length; i++) {
          if (this.templateListData.templateData[i].id === 'nursing_date') {
            this.templateListData.templateData[i].value = this.nurseDate
          } else if (this.templateListData.templateData[i].id === 'nursing_time') {
            this.templateListData.templateData[i].value = this.nurseTime
          } else if (this.templateListData.templateData[i].id === 'signature') {
            this.templateListData.templateData[i].value = this.mobileClientInput.operName
          }
        }
        let saveInputItemData = []
        for (let i = 0; i < this.inputItemData.length; i++) {
          if (this.inputItemData[i].value !== '') {
            saveInputItemData.push(this.inputItemData[i])
          }
        }
        //      引用医嘱，保存到入量中
        for (let i = 0; i < this.inputPresData.length; i++) {
          if (this.inputPresData[i].check !== '') {
            let tempInputItem = {}
            tempInputItem.ioTypeItemName = this.inputPresData[i].itemName
            tempInputItem.ioTypeCode = '3'
            tempInputItem.ioTypeItemCode = this.inputPresData[i].presNo + this.inputPresData[i].presSubNo
            tempInputItem.value = this.inputPresData[i].dosage
            tempInputItem.spellCode = ''
            tempInputItem.unitCode = ''
            tempInputItem.wbzxCode = ''
            saveInputItemData.push(tempInputItem)
          }
        }
        let saveOutputItemData = []
        for (let i = 0; i < this.outputItemData.length; i++) {
          if (this.outputItemData[i].value !== '') {
            saveOutputItemData.push(this.outputItemData[i])
          }
        }
        this.templateListData.patientId = this.mobileClientInput.patientId
        this.templateListData.eventNo = this.mobileClientInput.eventNo
        this.templateListData.templateCode = this.mobileClientInput.templateCode
        this.templateListData.status = 'add'
        this.templateListData.emrId = ''
        this.templateListData.babyFlag = this.mobileClientInput.babyFlag
        this.templateListData.type = '0'
        this.templateListData.guid = guidUtils()
        this.templateListData.operCode = this.mobileClientInput.operCode
        this.templateListData.operName = this.mobileClientInput.operName
        this.templateListData.deptTemplate = '0'
        if (this.jDisabled) {
          return
        }
        this.jDisabled = true
        this.$http.post('mobile/emr/nurserec/saveNurseRecForWeb', {
          content1: this.templateListData,
          content2: JSON.stringify(saveInputItemData),
          content3: JSON.stringify(saveOutputItemData)
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
      openPicker1 () {
        this.$refs.picker1.open()
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
        this.nurseDate = fullDate[1] + '-' + fullDate[2]
        this.nurseTime = fullDate[3] + ':' + fullDate[4]
      },
      verifierPluse (val) {
        this.pulseValue = val
        let rule = /^(([2-9][0-9])|(1[0-8][0-9])|(190))$/
        if (val === '') {
          return true
        }
        let result = rule.test(val)
        if (!result) {
          return result
        }
      },
      verifierBreathe (val) {
        this.breatheValue = val
        let rule = /^(([0-9])|([0-7][0-9])|(80))$/
        if (val === '') {
          return true
        }
        let result = rule.test(val)
        if (!result) {
          return result
        }
      },
      verifierTemperature (val) {
        this.temperatureValue = val
        let rule = /^((3[5-9]\.\d{1})|(3[5-9])|(4[0-2]\.\d{1})|(4[0-2]))$/
        if (val === '') {
          return true
        }
        let result = rule.test(val)
        if (!result) {
          return result
        }
      },
      setScrollTop () {
        document.getElementsByClassName('zm-main')[0].scrollTop = event.currentTarget.offsetTop
      },
      getTempByDate (patientId, eventNo, babyFlag, nurseTime) {
        this.$http.post('mobile/emr/emr/getTempByDate', {
          patientId: patientId,
          eventNo: eventNo,
          babyFlag: babyFlag,
          nurseTime: nurseTime
        }).then(res => {
          console.log('获取患者当天体征记录:' + JSON.stringify(res.data))
          this.tempData = res.data
          if (this.tempData != null && this.tempData.length > 0) {
            for (const temp of this.tempData) {
              let collectTime = temp.collectionTime.split(' ')
              let fullTime = collectTime[1].split(':')
              let time = fullTime[0] + ':' + fullTime[1]
              this.temperatureData.push({
                label: time + ' | ' + temp.temperature,
                value: temp.temperature
              })
            }
          }
        }).catch(error => {
          Toast({
            message: '获取患者当天体征记录失败: ' + error,
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
      },
      getPresByCondition (patientId, eventNo, presPropertyCode, presStatusCode) {
        this.$http.post('mobile/pres/pres/getPresByCondition', {
          patientId: patientId,
          eventNo: eventNo,
          presPropertyCode: presPropertyCode,
          presStatusCode: presStatusCode
        }).then(res => {
          window.console.log('引用医嘱信息：')
          window.console.log(res.data)
          let inputPresData = res.data
          for (const itemPres of inputPresData) {
            itemPres.check = ''
          }
          this.inputPresData = inputPresData
        }).catch(error => {
          Toast({
            message: '获取引用医嘱信息失败: ' + error,
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
      },
      getFormatDate (paramTimes) {
        let dateValue = new Date(parseInt(paramTimes / 1000) * 1000)
        return this.$format('yy-MM-dd', dateValue)
      },
      addPresItem (item) {
        if (item.groupClass !== '') {
          for (let presItem of this.inputPresData) {
            if (item.presNo === presItem.presNo) {
              presItem.check = '1'
            }
          }
        }
        item.check = '1'
        console.log('addPres-val:' + item.itemName)
      },
      cancelPresItem (item) {
        if (item.groupClass !== '') {
          for (let presItem of this.inputPresData) {
            if (item.presNo === presItem.presNo) {
              presItem.check = ''
            }
          }
        }
        item.check = ''
        console.log('cancelPres-val:' + item.itemName)
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
    #table {
        table-layout: fixed;
        margin-left: 10px;
    }
</style>