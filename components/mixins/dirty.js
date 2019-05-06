export default {
  props: {
    dirty: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value () {
      this.$emit('update:dirty', true)
    }
  }
}
