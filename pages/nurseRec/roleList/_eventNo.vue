<template>
    <zm-container>
        <zm-header v-show="headerShow">
            <mt-navbar v-model="selected">
                <div v-for="page in tabPages">
                    <mt-tab-item :id="page.babySeq">
                        {{page.babyName}}
                    </mt-tab-item>
                </div>
            </mt-navbar>
        </zm-header>
        <zm-main>
            <div class="mint-cell-wrapper">
                <mt-field id="fromDate" type="date" v-model="fromDateValue"><img
                        src="../../../assets/img/icon_日期_38_36.png" height="18" width="19"/>
                </mt-field>
                <mt-field id="endDate" type="date" v-model="endDateValue"><img
                        src="../../../assets/img/icon_日期_38_36.png" height="18" width="19"/>
                </mt-field>
            </div>
            <mt-tab-container v-model="selected">
                <mt-tab-container-item :id="itemPage.babySeq" :key="index" v-for="(itemPage,index) in tabPages">
                    <mt-cell v-for="item in nurseRecHistory" :title="getFormatDate(item.nursingTime)"
                             :label="item.templateName + '-' + itemPage.babyName"
                             @click.native="jumpToViewDetail(item)" :key="item.guid"/>
                </mt-tab-container-item>
            </mt-tab-container>
        </zm-main>
        <zm-footer>
            <mt-header title="">
                <mt-button type="primary" @click.native="add" slot="right">新建</mt-button>
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
        selected: 0,
        selBabyName: '',
        fromDateValue: this.$format('yyyy-MM-dd', new Date()),
        endDateValue: this.$format('yyyy-MM-dd', new Date(new Date().setDate(new Date().getDate() + 1))),
        nurseRecHistory: [],
        defaultNurseRecHis: [
          {
            templateName: '普通护理记录模板1',
            nursingTime: '1513585818000',
            guid: '123456'
          },
          {
            templateName: '普通护理记录模板2',
            nursingTime: '1513584989000',
            guid: '123457'
          },
          {
            templateName: '危重护理记录模板',
            nursingTime: '1513584949000',
            guid: '123458'
          }],
        patientId: '',
        eventNo: '',
        mobileClientInput: [],
        tabPages: [],
        headerShow: false,
        jDisabled: false
      }
    },
    mounted () {
      this.$registerMobileEvent('initWeb', this.initWeb)
      if (!this.$isMobile()) {
        this.getChild('1387', '845001')
      }
    },
    watch: {
      fromDateValue: function (newFromDateValue) {
        let sel = this
        if (newFromDateValue > sel.endDateValue) {
          Toast({
            message: '开始日期不能大于结束日期',
            iconClass: 'icon icon-error',
            duration: 2000
          })
        } else {
          sel.getNurseRecByDate(sel.mobileClientInput.patientId, sel.mobileClientInput.eventNo, sel.selected,
            sel.fromDateValue, sel.endDateValue, sel.mobileClientInput.sort)
        }
      },
      endDateValue: function (newEndDateValue) {
        let sel = this
        if (sel.fromDateValue > newEndDateValue) {
          Toast({
            message: '结束日期不能小于开始日期',
            iconClass: 'icon icon-error',
            duration: 2000
          })
        } else {
          sel.getNurseRecByDate(sel.mobileClientInput.patientId, sel.mobileClientInput.eventNo, sel.selected,
            sel.fromDateValue, sel.endDateValue, sel.mobileClientInput.sort)
        }
      },
      selected: function (newValue) {
        let self = this
        for (let page of self.tabPages) {
          if (page.babySeq === newValue) {
            self.selBabyName = page.babyName
            break
          }
        }

        this.getNurseRecByDate(this.mobileClientInput.patientId, this.mobileClientInput.eventNo,
          newValue, this.fromDateValue, this.endDateValue, this.mobileClientInput.sort)
      }
    },
    methods: {
      initWeb (param) {
        let sel = this
        if (this.$isMobile()) {
          Toast({
            message: 'eventNo界面: ' + JSON.stringify(param),
            iconClass: 'icon icon-error',
            duration: 2000
          })
          sel.mobileClientInput = JSON.parse(JSON.stringify(param))
          sel.mobileClientInput.babyFlag = '0'
          sel.mobileClientInput.sort = 'DESC'
          sel.getNurseRecByDate(sel.mobileClientInput.patientId, sel.mobileClientInput.eventNo,
            sel.mobileClientInput.babyFlag, sel.fromDateValue, sel.endDateValue, sel.mobileClientInput.sort)
        } else {
          sel.mobileClientInput.patientId = '1387'
          sel.mobileClientInput.eventNo = '845001'
          sel.mobileClientInput.babyFlag = '0'
          sel.mobileClientInput.sort = 'DESC'
          sel.getNurseRecByDate(sel.mobileClientInput.patientId, sel.mobileClientInput.eventNo,
            sel.mobileClientInput.babyFlag, sel.fromDateValue, sel.endDateValue, sel.mobileClientInput.sort)
        }
        sel.getChild(sel.mobileClientInput.patientId, sel.mobileClientInput.eventNo)
      },
      getNurseRecByDate (patientId, eventNo, babyFlag, fromDate, endDate, sort) {
        if (!this.$isMobile()) {
          patientId = '1387'
          eventNo = '845001'
          babyFlag = '0'
        }
        console.log('babyFlag:' + babyFlag)
        let fromDateValue = Date.parse(new Date(fromDate))
        let endDateValue = Date.parse(new Date(endDate))
        let self = this
        this.$http.post('mobile/emr/nurserec/getNurseRecByDate', {
          patientId: patientId,
          eventNo: eventNo,
          babyFlag: babyFlag,
          begin: fromDateValue,
          end: endDateValue,
          sort: sort
        }).then(res => {
          console.log('getNurseRecByDate:' + JSON.stringify(res.data))
          if (res.data === '') {
            self.nurseRecHistory = self.defaultNurseRecHis
          } else {
            self.nurseRecHistory = res.data
          }
        }).catch(error => {
          Toast({
            message: '获取护理历史记录API接口异常:' + error.toString(),
            iconClass: 'icon icon-error',
            duration: 2000
          })
          self.nurseRecHistory = self.defaultNurseRecHis
        })
      },
      getFormatDate (paramTimes) {
        let dateValue = new Date(parseInt(paramTimes / 1000) * 1000)
        return this.$format('yyyy-MM-dd hh:mm:ss', dateValue)
      },
      add () {
        if (this.jDisabled) {
          return
        }
        this.jDisabled = true
        if (this.$isMobile()) {
          let url = window.location.origin + '/nurseRec/add'
          let params = '{"path":"' + url + '","babyFlag":"' + this.selected + '","babyName":"' + this.selBabyName + '"}'
          console.log('參數：' + params)
          try {
            this.$execMobileEvent('add', params)
            this.jDisabled = false
          } catch (error) {
            Toast({
              message: '调用安卓客户端的方法: ' + error,
              iconClass: 'icon icon-error',
              duration: 2000
            })
            console.log('调用安卓客户端的方法: ' + error)
            this.jDisabled = false
          }
        } else {
          console.log('add_babyName：' + this.selBabyName)
          this.$router.push(
            {
              path: '/nurseRec/add',
              query: {
                eventNo: this.mobileClientInput.eventNo, babyFlag: this.selected, babyName: this.selBabyName
              }
            })
          this.jDisabled = false
        }
      },
      pushRec (value) {
        // this.$router.push({path: '/nurseRec/history/1', query: {id: '123123'}})
        console.log(value)
        this.$http.post('mobile/emr/nurserec/bindNurseRecTemplateInfo', {
          nurseRec: value
        }).then(res => {
          window.console.log(res.data)
        }).catch(error => {
          Toast({
            message: '获取该条护理记录信息的API接口异常:' + error.toString(),
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
      },
      jumpToViewDetail (value) {
        if (this.$isMobile()) {
          let guid = JSON.stringify(value.guid).substr(1, value.guid.length - 1)
          let content = JSON.stringify(value).replace('"{', '{').replace('}"', '}')
          let url = ''
          if (JSON.stringify(value.type) === '4') {
            // 4：病情记录模板 0：一般/危重护理记录单模板
            url = window.location.origin + '/nurseRec/blank/' + guid
          } else {
            url = window.location.origin + '/nurseRec/history/' + guid
          }
          let params = '{"path":"' + url + '","content":' + content + ',"id":"' +
            guid + '"}'
          try {
            this.$execMobileEvent('queryDetail', params)
          } catch (error) {
            Toast({
              message: '调用安卓客户端的方法: ' + error,
              iconClass: 'icon icon-error',
              duration: 2000
            })
          }
        } else {
          let pathUrl = ''
          if (JSON.stringify(value.type) === '4') {
            // 4：病情记录模板 0：一般/危重护理记录单模板
            pathUrl = '/nurseRec/blank/' + value.guid
          } else {
            pathUrl = '/nurseRec/history/' + value.guid
          }
          this.$router.push({path: pathUrl, query: {content: value, id: value.guid}})
        }
      },
      getChild (patientId, eventNo) {
        let sel = this
        this.$http.post('mobile/emr/emr/getChildren', {
          patientId: patientId,
          eventNo: eventNo
        }).then(res => {
          window.console.log('getChild:' + res.data)
          sel.tabPages = res.data
          sel.selected = sel.tabPages[0].babySeq
          if (sel.tabPages.length > 1) {
            sel.headerShow = true
          } else {
            sel.headerShow = false
          }
        }).catch(error => {
          Toast({
            message: '获取婴儿数API接口异常:' + error.toString(),
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
      },
      showId (value) {
        Toast({
          message: '弹出标签ID：' + value,
          iconClass: 'icon icon-success',
          duration: 1000
        })
      },
      setBabyFlag (value) {

      }
    }
  }
</script>
<style scoped>
    .mint-navbar div {
        flex: 1;
    }

    .mint-tab-container-wrap {
        color: #000;
    }
</style>