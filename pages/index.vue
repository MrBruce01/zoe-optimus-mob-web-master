<template>
    <zm-container>
        <zm-main class="main">
            <div class="row">
                <router-link to="/demo/components/common">
                    <mt-button class="button" size="small">组件示例</mt-button>
                </router-link>
            </div>
            <div class="row">
                <router-link to="/odt?templateId=9952&eventNo=0231025001&operationType=1&patientId=0000000827&title=护理评估">
                    <mt-button class="button" size="small">病历表单</mt-button>
                </router-link>
            </div>
            <div class="row">
                <router-link to="/test/index2">
                    <mt-button class="button" size="small">护理记录</mt-button>
                </router-link>
            </div>
            <div class="row">
                <nuxt-link :to="{name:'nursingRecSheet',params:{patientId: 123456789}}">
                    <mt-button class="button" size="small">护理记录单</mt-button>
                </nuxt-link>
            </div>
        </zm-main>
    </zm-container>
</template>

<script>
  export default {
    head () {
      return {
        title: 'his5移动端欢迎页'
      }
    }
  }
</script>

<style scoped lang="scss">
    .main {
        width: 100%;
        .row {
            padding: 2px;
            .button {
                width: calc(100% - 4px)
            }
        }
    }
</style>
