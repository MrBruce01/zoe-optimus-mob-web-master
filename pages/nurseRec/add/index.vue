<template>
    <zm-container>
        <zm-header>
            <mt-header title="新建护理记录">
                <mt-button icon="back" @click.native="handleBack" slot="left">取消</mt-button>
            </mt-header>
        </zm-header>
        <zm-container>
            <zm-header>
                <mt-cell title="病情记录" id="bingqing"
                         @click.native="createTemplate('/nurseRec/blank','',dataValue)" is-link>
                </mt-cell>
            </zm-header>
            <zm-main>
                <div style="background:#ADADAD; color:#ADADAD">分隔栏</div>
                <div class="mint-cell-wrapper">
                    <zm-datetime-picker :format="format"
                                        v-model="defaultDateValue"></zm-datetime-picker>
                    <img src="../../../assets/img/icon_日期_38_36.png" height="18" width="19"/></div>
                <mt-cell title="选择模板"></mt-cell>
                <div v-for="item in nurseList">
                    <!--<nuxt-link-->
                    <!--:to="{name:'nurseRec-history-id',params:{id:item.templateCode, eventNo:mobileClientInput.eventNo, dateValue:defaultDateValue}}">-->
                    <!--<mt-cell :title="item.templateName" :id="item.templateCode" @click.native="createTemplate(window.location.origin + '/nurseRec/history/id',item.templateCode,defaultDateValue)" is-link></mt-cell>-->
                    <!--</nuxt-link>-->
                    <mt-cell :title="item.templateName" :id="item.templateId"
                             @click.native="createTemplate('/nurseRec/history',item.templateId, dataValue)"
                             is-link></mt-cell>
                </div>
            </zm-main>
        </zm-container>
        <zm-footer></zm-footer>
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
        defaultDateValue: this.$format('yyyy-MM-dd hh:mm', new Date()),
        dataValue: this.$format('yyyy-MM-dd hh:mm', new Date()),
        nurseList: [],
        mobileClientInput: [],
        format: 'yyyy-MM-dd hh:mm'
      }
    },
    methods: {
      initWeb (param) {
        let sel = this
        if (this.$isMobile()) {
          Toast({
            message: 'add界面: ' + JSON.stringify(param),
            iconClass: 'icon icon-error',
            duration: 2000
          })
          sel.mobileClientInput = JSON.parse(JSON.stringify(param))
          sel.getTemplateList()
        }
      },
      handleBack () {
        if (this.$isMobile()) {
          this.$execMobileEvent('back')
        } else {
          window.history.go(-1)
        }
      },
      createTemplate (url, templateCode, dateValue) {
        let pathUrl = url
        url = window.location.origin + url
        let params = '{"path":"' + url + '","templateCode":"' + templateCode + '","date":"' + dateValue + '",' +
          '"babyFlag":"' + this.mobileClientInput.babyFlag + '","babyName":"' + this.mobileClientInput.babyName + '"}'
        if (this.$isMobile()) {
          this.$execMobileEvent('createTemplate', params)
        } else {
          this.$router.push({
            path: pathUrl,
            query: {
              id: templateCode,
              eventNo: this.mobileClientInput.eventNo,
              dateValue: dateValue,
              babyFlag: this.mobileClientInput.babyFlag,
              babyName: this.mobileClientInput.babyName
            }
          })
        }
      },
      getTemplateList () {
        this.$http.post('mobile/emr/nurserec/getDistributedTemplateList', {
          emrClassCode: '8',
          patientId: this.mobileClientInput.patientId
        }).then(res => {
          window.console.log(res.data)
          this.nurseList = res.data
        }).catch(error => {
          Toast({
            message: '获取科室护理模板API接口异常:' + error.toString(),
            iconClass: 'icon icon-error',
            duration: 2000
          })
        })
      }
    },
    mounted () {
      let sel = this
      if (this.$isMobile()) {
        this.$registerMobileEvent('initWeb', this.initWeb)
      } else {
        sel.mobileClientInput.eventNo = '181001'
        sel.mobileClientInput.patientId = '260'
        sel.mobileClientInput.babyFlag = '0'
        sel.getTemplateList()
      }
    },
    watch: {
      defaultDateValue: function (val, oldVal) {
        this.dataValue = this.$format(this.format, val)
      }
    }
  }
</script>