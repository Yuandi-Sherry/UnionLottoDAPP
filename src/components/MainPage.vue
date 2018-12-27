<template>
  <div class="body">
    <p class="words">It's just a simple UNION LOTTO DAPP.</p>
    <div :class="{'display': !getMetaMaskState, 'nodisplay': getMetaMaskState}">Notice that you haven't logged in Metamask, please log in at first!</div>
    <div class="buttons">
      <div class="bet" @click='goBetPage'>BET</div>
      <div class="result" @click="goResultPage">RESULT</div>
    </div>
    <input type="date" v-model="date">
    <button @click="testPublish">test publish </button>
    <button @click="test">test </button>
  </div>
</template>
<script>
import HelloMetamask from '@/components/MetaMask'
export default {
  name: 'MainPage',
  data () {
    return {
      valid: false,
      date: null
    }
  },
  methods: {
    goBetPage (event) {
      this.$router.push({
        path: '/bet'
      })
    },
    goResultPage (event) {
      this.$router.push({
        path: '/result'
      })
    },
    testPublish(event) {
      console.log(this.date)
      this.$store.dispatch('publishUnionLotto', {name: this.date, date: "1", address: '0x4c02d8d6cf951e636642a21f43bbb46c7fbf9342'})
    },
    test(event) {
      // console.log(this.$store.state.web3.coinbase)
      this.$store.state.SeniorAuthority().test(this.date,{
          gas: 300000,
          from: this.$store.state.web3.coinbase
        }, (err, result) => {
          if (err) {
          } else {
            console.log(JSON.stringify(result))
          }
        })
    }
  },
  computed: {
    getMetaMaskState() {
      console.log('computed')
      try {
        return this.$store.state.web3.isInjected
      } catch(e) {
        return false
      } 
    }
  }, 
  created () {
    console.log('registerWeb3 Action dispatched from casino-dapp.vue')
    this.$store.dispatch('registerWeb3')
    this.$store.dispatch('getSeniorAuthority')
  },
  components: {
    'hello-metamask': HelloMetamask
  }
}
</script>
<style scoped>
.display, .nodisplay{
  margin-left: auto;
  margin-right: auto;
  min-width: 700px;
  text-align: center;
}
.display {
  visibility: visible;
}
.nodisplay{
  visibility: hidden;
}

.words {
  margin: auto;
  margin-top: 200px;
  min-width: 700px;
  min-height: 200px;
  max-height: 200px;
  text-align: center;
  font-size: 24pt;
}
.body{
  color: white;
}
.buttons {
  color: white;
  min-width: 700px;
  text-align: center;
}
.bet:after,.bet:hover:after,.bet,.bet:hover,
.result:after,.result:hover:after,.result, .result:hover {
  -webkit-transition:all 1s ease;
  -moz-transition:all 1s ease;
  -o-transition:all 1s ease;
  transition:all 1s ease;
}
.bet,.result{
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 100px;
  height: 100px;
  z-index: 999999999;
  text-align: center;
  line-height: 100px;
  text-decoration: none;
  color: #FFF;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  border-radius: 100%;
  -webkit-box-shadow: 0 0 15px 2px #111133;
  -moz-box-shadow: 0 0 15px 2px #111133;
  box-shadow: 0 0 15px 2px #111133;
}

.result {
  left: 30%;
  right: 0;

}
.bet {
    right: 30%;
    left: 0;
}
.bet:after, .result:after {
  content: " ";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 80px;
  height: 80px;
  /*color of the circle in the center*/
  z-index: 999999999;
  text-align: center;
  line-height: 80px;
  text-decoration: none;
  color: #FFF;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  border-radius: 100%;
  -webkit-box-shadow: 0 0 15px 2px #111133;
  -moz-box-shadow: 0 0 15px 2px #111133;
  box-shadow: 0 0 15px 2px #111133;
}
.bet:after {
  background-color: #3FB4BE;
  background-color: rgba(0, 235, 255, 0.44);
}
.result:after {
  background-color: #FF7F50;
  background-color: rgba(255, 100, 80, 0.44);
}
.bet:hover{
  -webkit-box-shadow:0 0 4px 4px #3FB4BE;
  -moz-box-shadow:0 0 4px 4px #3FB4BE;
  box-shadow:0 0 4px 4px #3FB4BE;
}
.result:hover {
  -webkit-box-shadow:0 0 4px 4px #FF7F50;
  -moz-box-shadow:0 0 4px 4px #FF7F50;
  box-shadow:0 0 4px 4px #FF7F50;
}
.bet:hover:after, .result:hover:after{
  opacity: 0.0
}
</style>
