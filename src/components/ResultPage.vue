<template>
  <div>
    <hello-metamask/>
    <result-component/>
  </div>
</template>
<script>
import HelloMetamask from '@/components/MetaMask'
import RecordPart from '@/components/RecordPart'
export default {
  name: 'casino-dapp',
  components: {
    'hello-metamask': HelloMetamask,
    'result-component': RecordPart
  }
}
</script>
<style scoped>
</style>

