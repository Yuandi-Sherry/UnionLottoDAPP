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
  components: {
    'hello-metamask': HelloMetamask,
    'casino-component': LotteryPart
  }
}
</script>
<style scoped>
</style>
