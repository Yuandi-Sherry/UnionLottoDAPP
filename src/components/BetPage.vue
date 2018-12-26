<template>
  <div>
    <hello-metamask/>
    <casino-component/>
    <img @click="back" class="button"  src="../assets/backButton.png">back</img>
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
  },
  methods: {
    back (event) {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>
<style scoped>
div {
  text-align: center;
}
.button, .button:hover{
  position: fixed;
  top: 0px;
  left: 0px;
  height: 30px;
  border-style: none;
  border-radius: 50%;
  outline-style: none;
  margin: 10px;
  padding: 10px;
  font-family: 'Montserrat';
}
.button {
  background: #272748;
  transition: 0.5s;
  /*background: linear-gradient(to right, #1090F8, #6451F0);*/
}
.button:hover {
  background: #3A3A57;
  transition: 0.5s;
  /*background: linear-gradient(to right, #6451F0, #1090F8);*/
}
</style>
