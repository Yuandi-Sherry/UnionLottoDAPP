<template>
  <hello-metamask/>
</template>
<script>
import HelloMetamask from './hello-metamask.vue'
export default {
  name: 'UnionLotto',
  beforeCreate () {
    console.log('registerWeb3 Action dispatched from casino-dapp.vue')
    this.$store.dispatch('registerWeb3')
  },
  components: {
    'hello-metamask': HelloMetamask
  }
}
</script>
<style scoped></style>
