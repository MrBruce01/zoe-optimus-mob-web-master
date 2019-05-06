<template>
    <footer class="parent">
        <div v-for="item in controlData">
            <mt-button v-if="item.type =='button'" class="child" type="default">{{item.text}}</mt-button>
            <mt-button v-else-if="item.type =='imgbutton'" class="child">
                <img src="" height="20" width="20" slot="icon">
                {{item.text}}
            </mt-button>
        </div>
</footer>
</template>

<script>
  export default {
    name: 'ZmFootertest',
    componentName: 'ZmFootertest',
    props: {
      controlData: []
    }
  }
</script>
<style scoped>
    .parent{
        display: flex
    }
    .child{
        flex:1;
        height:40px
    }
</style>