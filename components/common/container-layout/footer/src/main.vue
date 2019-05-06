<template>
    <div class="zm-footer" :style="styles">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'ZmFooter',
        componentName: 'ZmFooter',
        props: {
            styles:{
                type: Object
            }
        }
    }
</script>
