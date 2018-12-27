<template>
  <div>
    <hello-metamask/>
    <result-component/>
    <img @click="back" class="button"  src="../assets/backButton.png">back</img>
  </div>
</template>
<script>
import HelloMetamask from '@/components/MetaMask'
import RecordPart from '@/components/RecordPart'
export default {
  name: 'ResultPage',
  components: {
    'hello-metamask': HelloMetamask,
    'result-component': RecordPart
  },
  methods: {
    back (event) {
      this.$router.push({
        path: '/'
      })
    }
  },
  created () {
    console.log('registerWeb3 Action dispatched from casino-dapp.vue')
    this.$store.dispatch('registerWeb3')
    this.$store.dispatch('getSeniorAuthority')
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
