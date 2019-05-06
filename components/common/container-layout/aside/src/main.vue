<template>
    <div class="zm-aside" :style="{ width }">
        <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'ZmAside',

    componentName: 'ZmAside',

    props: {
      width: {
        type: String,
        default: '48px'
      }
    }
  }
</script>

