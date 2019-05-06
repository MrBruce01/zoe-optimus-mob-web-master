<template>
    <div class="odt">
        <mt-header title="遍历数组和添加属性">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <div class="odt-top">
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">病人信息</mt-tab-item>
            </mt-navbar>
        </div>
        <div class="odt-main">
            <!-- tab-container -->
            <mt-tab-container v-model="selected">
                <mt-tab-container-item id="1">
                    <mt-field label="测试文本:" :disableClear="true" :readonly="true"></mt-field>
                    <mt-field label="姓名:" placeholder="请输入用户名" :disableClear="true" :readonly="true"
                              v-model="data1.name"></mt-field>
                    <mt-field label="联系方式：" placeholder="请输入联系方式" prop="mobile" type="number"
                              v-model="data1.tel"></mt-field>
                    <mt-field label="入院时间：" placeholder="请输入入院时间" type="date"
                              v-model="data1.inTime"></mt-field>
                    <mt-field label="当前时间" placeholder="Input now date" v-model="data1.nowDate"></mt-field>
                    <mt-checklist
                            title="复选框列表"
                            v-model="value"
                            :options="['选项A', '选项B', '选项C']">
                    </mt-checklist>
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
  import {Toast} from 'mint-ui'

  export default {
    components: {},
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
    methods: {
      handleSaveClick () {
        window.console.log('联系方式：' + this.data1.tel)
        this.data1.age = '18'
        window.console.log('新增年龄：' + this.data1.age)
        for (var i = 0; i < this.todos.length; i++) {
          console.log(this.todos[i].label + 's value is: ' + this.todos[i].value)
          this.todos[i].id = '1' + this.todos[i].value
          console.log(this.todos[i].label + 's id is: ' + this.todos[i].id)
        }
        var array = ['a', 'b', 'c', 'd']
        console.log('--- for in 循环 ---')
        for (var element1 in array) {
          console.log('var:' + element1)
        }
        console.log('--- for of 循环 ---')
        for (const element2 of array) {
          console.log('const:' + element2)
        }
        Toast({
          message: '保存操作',
          iconClass: 'icon icon-success',
          duration: 1000
        })
      }
    }
  }
</script>
<style lang="scss">
    .scss-test {
        .scss-test-1 {
            background-color: white;
        }
    }

    .background-color {
        .mint-field-core {
            background-color: #dbe1ec;
        }

    }
</style>