<template>
    <div class="odt">
        <mt-header title="功能菜单标题名称过长会隐藏后面的内容">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <div class="odt-top">
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">病人信息</mt-tab-item>
                <mt-tab-item id="2">基本情况</mt-tab-item>
                <mt-tab-item id="3">风险因素</mt-tab-item>
            </mt-navbar>
        </div>
        <div class="odt-main">
            <!-- tab-container -->
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <div>
                        <nuxt-link to="/test/index2">不带参数跳转</nuxt-link>
                    </div>
                    <div>
                        <nuxt-link :to="{name:'test-index2',params:{id:'123',mess:'456'}}">name带参数跳转方式</nuxt-link>
                    </div>
                    <div>
                        <nuxt-link :to="{path:'/test/index2',query:{id:'123',mess:'456'}}">路径带参数跳转方式</nuxt-link>
                    </div>
                    <mt-field label="姓名:" placeholder="请输入用户名" :disableClear="true" :readonly="true"
                              v-model="data1.name"></mt-field>
                    <div v-if="seen" class="mint-cell-wrapper">
                        <div class="mint-cell-title">
                            <span class="mint-cell-text">性别:</span>
                        </div>
                        <div class="mint-cell-value">
                            <input placeholder="请输入性别" v-model="data1.sex" type="text" class="mint-field-core">
                            <div class="mint-field-clear" style="display: none;"><i
                                    class="mintui mintui-field-error"></i></div>
                            <span class="mint-field-state is-success"><i class="mintui mintui-field-success"></i></span>
                            <div class="mint-field-other"></div>
                        </div>
                    </div>
                    <span class="mint-cell-text" v-once>性别属性（不改变）:{{seen}}</span>
                    <span class="mint-cell-text">性别属性（改变）:{{seen}}</span>
                    <mt-field label="联系方式：" placeholder="回车会显示性别" prop="mobile" type="number"
                              v-model="data1.tel" @keyup.enter.native="changeTel"></mt-field>
                    <mt-field label="入院时间：" placeholder="请输入入院时间" type="date"
                              v-model="data1.inTime"></mt-field>
                    <mt-field label="当前时间" placeholder="Input now date" v-model="data1.nowDate"></mt-field>
                    <zm-radio :dict-data="todos" :editable="false" v-model="defaultRadio.value"
                              :content.sync="defaultRadio.code"></zm-radio>
                    <!--<mt-checklist title="复选框列表" options="[]">-->
                    <!--</mt-checklist>-->
                    <mt-checklist
                            title="复选框列表"
                            v-model="value"
                            :options="['选项A', '选项B', '选项C']">
                    </mt-checklist>
                    <!--<mt-cell v-for="(item,index) in templateListData" :key="item.id" :title="item.cnName"/>-->
                    <div>
                        <div v-for="item in templateListData">
                            <mt-field :label="item.cnName+ ':'" :placeholder="'请输入'+item.cnName"
                                      :id="item.id"></mt-field>
                        </div>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <mt-cell v-for="n in 4" :key="n" :title="'测试 ' + n"/>
                </mt-tab-container-item>
                <mt-tab-container-item id="3">
                    <mt-cell v-for="n in 6" :key="n" :title="'选项 ' + n"/>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <div class="odt-tool-bar">
            <mt-header title="">
                <mt-button icon="back" @click.native="handleBack" slot="left">返回</mt-button>
                <mt-button type="primary" @click.native="handleSaveClick" slot="right">保&nbsp;&nbsp;&nbsp;存</mt-button>
            </mt-header>
        </div>
    </div>
</template>
<script>
  import {MessageBox, Toast} from 'mint-ui'

  export default {
    layout: 'odt',
    data () {
      return {
        selected: '1',
        value: [],
        templateListData: [],
        seen: false,
        defaultRadio: {
          code: '',
          value: ''
        },
        data1: {
          name: '范小林',
          sex: '',
          tel: '',
          career: '工程师',
          nation: '汉族',
          diagnosis: '急性扁桃体炎',
          inTime: '2017-12-08',
          nowDate: new Date().toLocaleString(),
          inType: '0'
        },
        todos: [
          {label: '学习 JavaScript', value: '0'},
          {label: '学习 Vue', value: '1'},
          {label: '整个牛项目', value: '2'}
        ]
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
      changeTel () {
        this.seen = true
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
    .odt {
        width: 100%;
        height: 100%;
    }

    .odt .odt-main {
        height: calc((100% - 80px - 50px));
        overflow: auto;
    }

    .odt .odt-top {
        height: 50px;
    }

    .odt .odt-tool-bar {
        height: 40px;
    }
</style>