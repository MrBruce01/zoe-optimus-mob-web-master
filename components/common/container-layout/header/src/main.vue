<template>
    <div class="zm-header" :style="{ height }">
        <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'ZmHeader',

    componentName: 'ZmHeader',

    props: {
      height: {
        type: String,
        default: '48px'
      }
    }
  }
</script>
