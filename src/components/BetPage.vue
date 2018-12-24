<template>
  <div>
    <hello-metamask/>
    <casino-component/>
  </div>
</template>
<script>
import HelloMetamask from '@/components/MetaMask'
import LotteryPart from '@/components/LotteryPart'
export default {
  name: 'casino-dapp',
  beforeCreate () {
    console.log('registerWeb3 Action dispatched from casino-dapp.vue')
    this.$store.dispatch('registerWeb3')
  },
  components: {
    'hello-metamask': HelloMetamask,
    'casino-component': LotteryPart
  }
}
</script>
<style scoped>
</style>
