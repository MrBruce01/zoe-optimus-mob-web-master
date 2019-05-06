<template>
    <zm-container>
        <zm-header height="50px">
            <mt-header title="功能菜单标题">
                <router-link to="/test" slot="left">
                    <mt-button icon="back">返回</mt-button>
                </router-link>
                <mt-button icon="more" slot="right"></mt-button>
            </mt-header>
        </zm-header>
        <zm-container>
            <zm-header>
                <mt-navbar v-model="selected">
                    <mt-tab-item id="1">常规内容</mt-tab-item>
                    <mt-tab-item id="2">入量</mt-tab-item>
                    <mt-tab-item id="3">出量</mt-tab-item>
                </mt-navbar>
            </zm-header>
            <zm-main>
                <mt-tab-container v-model="selected">
                    <mt-tab-container-item id="1">
                        <div> queryParams参数：{{  this.$route.params.id}}</div>
                        <div> params参数：{{  this.$route.query.id}}</div>
                        <div>
                            <div v-for="item in templateListData">
                                <mt-field v-if="item.type == 'date'" :label="item.cnName+ ':'"
                                          :id="item.id" type="date"></mt-field>
                                <mt-field v-else-if="item.type == 'time'" :label="item.cnName+ ':'"
                                          :id="item.id" @click.native="openPicker1" v-model="dtPickerVal"></mt-field>
                                <zm-radio v-else-if=" item.id == 'mind'" :label="item.cnName+':'" v-model="data1.mindRadio"
                                          :dictData="mindData" :editable="false"></zm-radio>
                                <mt-field v-else :label="item.cnName+ ':'" :placeholder="'请输入'+item.cnName"
                                          :id="item.id"></mt-field>
                            </div>
                            <mt-datetime-picker
                                    ref="picker1"
                                    type="time"
                                    @confirm="handleDtPickerConfirm">
                            </mt-datetime-picker>
                        </div>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="2">
                        <div v-for="item in inputItemData">
                            <mt-field :label="item.ioTypeItemName+ '('+item.unitCode+'):'"
                                      :placeholder="'请输入'+item.ioTypeItemName" :id="item.ioTypeItemCode"></mt-field>
                        </div>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="3">
                        <div v-for="item in outputItemData">
                            <mt-field :label="item.ioTypeItemName+ '('+item.unitCode+'):'"
                                      :placeholder="'请输入'+item.ioTypeItemName" :id="item.ioTypeItemCode"></mt-field>
                        </div>
                    </mt-tab-container-item>
                </mt-tab-container>
            </zm-main>
        </zm-container>
        <zm-footer>
            <mt-header title="">
                <mt-button icon="primary" @click.native="" slot="right">病程记录</mt-button>
                <mt-button icon="primary" @click.native="handleBack" slot="right">&nbsp;&nbsp;&nbsp;删除</mt-button>
                <mt-button icon="primary" @click.native="add" slot="right">&nbsp;&nbsp;&nbsp;新建</mt-button>
                <mt-button type="primary" @click.native="handleSaveClick" slot="right">&nbsp;&nbsp;&nbsp;保存</mt-button>
            </mt-header>
        </zm-footer>
    </zm-container>
</template>
<script>
  import ZmRadio from '../../components/common/radio'
  import ZmChecklist from '../../components/common/checklist'
  import {MessageBox, Toast} from 'mint-ui'
  import ZmContainer from '../../components/common/container-layout/container'
  import ZmHeader from '../../components/common/container-layout/header'
  import ZmFooter from '../../components/common/container-layout/footer'
  import ZmMain from '../../components/common/container-layout/main'

  export default {
    layout: 'odt',
    components: {
      ZmMain,
      ZmFooter,
      ZmHeader,
      ZmContainer,
      ZmRadio,
      ZmChecklist
    },
    data () {
      return {
        selected: '1',
        value: [],
        templateListData: [],
        inputItemData: [],
        outputItemData: [],
        seen: false,
        dtPickerVal: new Date().getHours() + ':' +
        ('00' + new Date().getMinutes()).substr(-new Date().getMinutes().toString().length),
        data1: {
          name: '范小林',
          sex: '',
          tel: '',
          career: '工程师',
          nation: '汉族',
          diagnosis: '急性扁桃体炎',
          inTime: '2017-12-08',
          nowDate: new Date().toLocaleString(),
          inType: '0',
          mindRadio: {
            code: '',
            value: ''
          }
        },
        mindData: [
          {label: '清醒', value: '清醒'}, {label: '朦胧', value: '朦胧'},
          {label: '嗜睡', value: '嗜睡'}, {label: '昏睡', value: '昏睡'},
          {label: '谵妄', value: '谵妄'}, {label: '模糊', value: '模糊'}]
      }
    },
    mounted () {
      this.$http.post('mobile/emr/nurserec/getNurseRecTemplateInfo', {
        templateCode: '186'
      }).then(res => {
        window.console.log(res.data)
        this.templateListData = res.data.templateData
      }).catch(error => {
        this.$alert('获取模板内容失败: ' + error, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
      this.$http.post('mobile/emr/nurserec/findNursingDictItem', {
        ioTypeCode: '1'
      }).then(res => {
        window.console.log(res.data)
        this.inputItemData = res.data
      }).catch(error => {
        this.$alert('获取入量字典项失败: ' + error, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
      this.$http.post('mobile/emr/nurserec/findNursingDictItem', {
        ioTypeCode: '2'
      }).then(res => {
        window.console.log(res.data)
        this.outputItemData = res.data
      }).catch(error => {
        this.$alert('获取出量字典项失败: ' + error, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        })
      })
    },
    methods: {
      handleBack () {
        MessageBox.confirm('表单未保存，是否离开').then(action => {
          this.$router.go(-1)
        }, action => {
          alert('保留在本页面')
        })
      },
      handleSaveClick () {
        Toast({
          message: '保存成功',
          iconClass: 'icon icon-success',
          duration: 1000
        })
      },
      add () {

      },
      changeTel () {
        this.seen = true
      },
      openPicker1 () {
        this.$refs.picker1.open()
      },
      handleDtPickerConfirm (val) {
        window.console.log(val)
        this.dtPickerVal = val
      }
    },
    watch: {
      seen: function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      }
    }
  }
</script>
<style scoped>

</style>