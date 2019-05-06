<template>
    <zm-container>
        <zm-header style="background-color: aliceblue">
            <div>头部</div>
        </zm-header>
        <zm-main style="background-color: antiquewhite">
            <zm-container>
                <zm-aside style="background-color: cadetblue">
                    侧边栏
                </zm-aside>
                <zm-main style="background-color: darkorange">
                    主体部分
                </zm-main>
            </zm-container>
        </zm-main>
        <zm-footer style="background-color: aliceblue">
            <div>尾部</div>
        </zm-footer>
    </zm-container>
</template>
<script>
  export default {
    layout: 'demo',
    head () {
      return {
        title: '容器布局组件演示'
      }
    },
    components: {},
    mounted () {
    },
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style>

</style>
