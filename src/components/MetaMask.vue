<template>
 <div class="body">
  <div>
    <p class="title">Metamask:</p>
    <p class="content"> {{ web3.isInjected }}</p>
  </div>
  <div>
    <p class="title">Network:</p>
    <p class="content"> {{ web3.networkId }}</p>
  </div> 
  <div>
    <p class="title">Account:</p>
    <p class="content"> {{ web3.coinbase }}</p>
  </div>
  <div>
    <p class="title">Balance:</p>
    <p class="content"> {{ web3.balance }}</p>
  </div>
 </div>
</template>
<script>
export default {
  name: 'MetaMask',
  computed: {
    web3 () {
      return this.$store.state.web3
    }
  }
}
</script>
<style scoped>
.body {
  color: white;
  height: 100%;
  width:100%;
  position: relative;
  z-index: 1;
}
.body div{
  padding: 10px;
  height: auto;
  margin: 1%;
  border-radius: 10px;
  display: inline-block;
  background-color: #2A2A4A;
}
.body div p {
  line-height: 1pt;
}
.title {
  font-size: 10pt;
  font-weight: bold;
}
.content {
  font-size: 15pt;
  color: #CF8143
}

</style>
