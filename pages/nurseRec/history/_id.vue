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
                        <div v-for="item in templateListData.templateData">
                            <div v-if="item.id == 'nursing_date'"></div>
                            <div v-else-if="item.id == 'nursing_time'"></div>
                            <div v-else-if="item.id == 'input_name'"></div>
                            <div v-else-if="item.id == 'input_value'"></div>
                            <div v-else-if="item.id == 'output_name'"></div>
                            <div v-else-if="item.id == 'output_value'"></div>
                            <div v-else-if="item.id == 'output_color'"></div>
                            <div v-else-if="item.id == 'signature'">
                                <mt-field :label="item.cnName+ ':'"
                                          :placeholder="'不可编辑'"
                                          :id="item.id"
                                          :readonly="true"
                                          v-model="item.value"></mt-field>
                            </div>
                            <div v-else-if="item.dict != ''">
                                <zm-radio :label="item.cnName + ':'"
                                          v-model="item.value"
                                          :content.sync="item.value"
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
                                          :content.sync="item.value"
                                          :dict-data="temperatureData"
                                          :editable="true"></zm-radio>
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
                                <mt-field :label="item.cnName+ ':'"
                                          :placeholder="'请输入'+item.cnName"
                                          :id="item.id"
                                          v-model="item.value"
                                          @click.native="setScrollTop"></mt-field>
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
                        <mt-field :label="item.ioTypeItemName+ '('+item.unitCode+'):'" v-model="item.value"
                                  type="number"
                                  :placeholder="'请输入'+item.ioTypeItemName" :id="item.ioTypeItemCode"></mt-field>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="3">
                    <div v-for="item in outputItemData">
                        <mt-field :label="item.ioTypeItemName+ '('+item.unitCode+'):'" v-model="item.value"
                                  type="number"
                                  :placeholder="'请输入'+item.ioTypeItemName" :id="item.ioTypeItemCode"></mt-field>
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
  import {MessageBox, Toast} from 'mint-ui'

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
        value: [],
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
      if (this.$isMobile()) {
        this.$registerMobileEvent('initWeb', this.initWeb)
      } else {
        this.cancelBtnVisible = true
        this.getNurseRec(this.$route.query.content)
        this.getInNurseRec(this.$route.query.content)
        this.getOutNurseRec(this.$route.query.content)
        this.getPresNurseRec(this.$route.query.content.patientId, this.$route.query.content.eventNo, '0', [],
          this.$route.query.content)
      }
    },
    methods: {
      initWeb (param) {
        //    入参格式:{"path":"http://10.0.5.22:3000/nurseRec/history/32f47191-7633-b537-5101-d53a9c4612f","content":{"contentVerificationStatus":"","nurseData":"","patientId":"1647","validFlag":1,"emrId":"7331ed3b-bfa3-4265-bf84-10bb1b879e57","nursingTime":1526547518000,"templateCode":"10075","type":0,"eventNo":"1023001","jsonData":{"data":[{"id":"temperature","value":"36.2"},{"id":"senses","value":"清醒"},{"id":"conscious_level","value":"正常 3分"},{"id":"reaction","value":"迟钝"},{"id":"pupil_size_left","value":"1"},{"id":"signature","value":"陈护士"}],"emrId":"7331ed3b-bfa3-4265-bf84-10bb1b879e57","modifierList":[{"id":"12917","name":"陈护士"}],"rowId":"32f47191-7633-b537-5101-d53a9c4612fd","status":"add","templateId":"10075","timeStamp":"1526547518127","type":"0"},"templateName":"一般护理记录new-FGH","babyFlag":0,"guid":"32f47191-7633-b537-5101-d53a9c4612fd","emrClassCode":8},"id":"32f47191-7633-b537-5101-d53a9c4612f"}
        this.mobileClientInput = JSON.parse(JSON.stringify(param))
        Toast({
          message: '传入参数: ' + JSON.stringify(param),
          iconClass: 'icon icon-error',
          duration: 4000
        })
        this.getNurseRec(this.mobileClientInput)
        this.getInNurseRec(this.mobileClientInput)
        this.getOutNurseRec(this.mobileClientInput)
        //    获取患者体征记录，用于引用体征信息
        this.getTempByDate(this.mobileClientInput.patientId, this.mobileClientInput.eventNo,
          this.mobileClientInput.babyFlag, this.mobileClientInput.nursingTime)
        //    获取患者医嘱信息，用于入量引用
        this.getPresNurseRec(this.mobileClientInput.patientId, this.mobileClientInput.eventNo, '0', [],
          this.mobileClientInput)
      },
      handleBack () {
        MessageBox.confirm('表单未保存，是否离开').then(action => {
          this.$router.go(-1)
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
          if (this.templateListData.templateData[i].id === 'signature') {
            this.templateListData.templateData[i].value = this.mobileClientInput.operName
          } else if (this.templateListData.templateData[i].id === 'input_name' ||
            this.templateListData.templateData[i].id === 'input_value' ||
            this.templateListData.templateData[i].id === 'output_name' ||
            this.templateListData.templateData[i].id === 'output_value') {
            this.templateListData.templateData.splice(i, 1)
            i = i - 1
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
        this.templateListData.status = 'update'
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
      openPicker1 () {
        this.$refs.picker1.open()
      },
      selDtPicker (val) {
        window.console.log(val)
        this.dtPickerVal = val
      },
      getNurseRec (recValue) {
        this.$http.post('mobile/emr/nurserec/bindNurseRecTemplateInfo', {
          nurseRec: recValue
        }).then(res => {
          window.console.log('NurseRec:' + res.data)
          this.templateListData = res.data
        }).catch(error => {
          Toast({
            message: '获取该条护理记录信息的API接口异常:' + error.toString(),
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
      },
      getInNurseRec (recValue) {
        this.$http.post('mobile/emr/nurserec/bindInOrOutNurseRecTemplateInfo', {
          ioTypeCode: '1',
          nurseRec: recValue
        }).then(res => {
          this.inputItemData = res.data
        }).catch(error => {
          Toast({
            message: '获取入量记录的API接口异常:' + error.toString(),
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
      },
      getOutNurseRec (recValue) {
        this.$http.post('mobile/emr/nurserec/bindInOrOutNurseRecTemplateInfo', {
          ioTypeCode: '2',
          nurseRec: recValue
        }).then(res => {
          this.outputItemData = res.data
        }).catch(error => {
          Toast({
            message: '获取出量记录信息的API接口异常:' + error.toString(),
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
      },
      getPresNurseRec (patientId, eventNo, presPropertyCode, presStatusCode, recValue) {
        this.$http.post('mobile/emr/nurserec/bindPresNurseRecTemplateInfo', {
          patientId: patientId,
          eventNo: eventNo,
          presPropertyCode: presPropertyCode,
          presStatusCode: presStatusCode,
          nurseRec: recValue
        }).then(res => {
          window.console.log('引用医嘱信息：')
          window.console.log(res.data)
          let inputPresData = res.data
          this.inputPresData = inputPresData
        }).catch(error => {
          Toast({
            message: '获取引用医嘱信息失败: ' + error,
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
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
      },
      getFormatDate (paramTimes) {
        let dateValue = new Date(parseInt(paramTimes / 1000) * 1000)
        return this.$format('yy-MM-dd', dateValue)
      }
    }
  }
</script>