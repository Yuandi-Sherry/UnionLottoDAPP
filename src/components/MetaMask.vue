<template>
 <div class="body">
  <p v-if="!web3.isInjected">Please log in Metamask at first</p>
<!--   <div>
    <p class="title">Metamask:</p>
    <p class="content"> {{ web3.isInjected }}</p>
  </div>
  <div>
    <p class="title">Network:</p>
    <p class="content"> {{ web3.networkId }}</p>
  </div>  -->
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
  height: 100px;
  width:100%;
  position: relative;
  z-index: 1;
  min-width: 1000px;
  max-width: 1000px;
  margin: 10px auto;
}
.body div{
  text-align: left;
  padding-right: 15px;
  padding-left: 15px;
  height: auto;
  margin: 5px;
  border-radius: 5px;
  display: inline-block;
  background: linear-gradient(#272748, #2A2A4A);
  vertical-align:top;
  min-width: 100px;
  max-width: 300px;
  height: 80px;
  padding-bottom: 15px;
}
.body div p {
  word-wrap: break-word;
  
  /*line-height: 15pt;*/
}
.title {
  font-size: 10pt;
  font-weight: bold;
}
.content {
  font-size: 15pt;
  color: #CF8143;
  vertical-align: center;
  margin-top: -10px;
}


</style>
