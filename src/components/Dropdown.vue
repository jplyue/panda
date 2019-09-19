<template>
  <div class="btn-group">
    <slot></slot>
    <slot name="dropdown-menu"></slot>
  </div>
</template>
<style lang="scss" scoped>
.btn-group {
  float: right;
  position: relative;
}
</style>
<script>
import EventListener from '@/lib/EventListener.js'
export default {
  methods: {
    toggleDropdown(e) {
      e.preventDefault()
      this.$el.classList.toggle('open')
    }
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$el
      const toggle = el.querySelector('[datas-toggle="dropdown"]')
      if (toggle) {
        toggle.addEventListener('click', this.toggleDropdown)
      }
      this._closeEvent = EventListener.listen(window, 'click', (e) => {
        if (!el.contains(e.target) || e.target.nodeName.toLowerCase() == 'a') el.classList.remove('open')
      })
    })
  },
  beforeDestroy() {
    if (this._closeEvent) this._closeEvent.remove()
  }
}
</script>
