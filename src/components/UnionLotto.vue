<template>
  <hello-metamask/>
</template>
<script>
import HelloMetamask from './MetaMask.vue'
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
