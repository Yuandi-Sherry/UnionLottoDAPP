<template>
  <div class="body">
    <p class="words">It's just a simple UNION LOTTO DAPP.</p>
    <a href="#BetPage" class="bet" @click='goBetPage'>BET</a>
    <!-- <a href="#ResultPage" class="result">RESULT</a> -->
  </div>
</template>
<script>
export default {
  name: 'MainPage',
  data () {
    return {}
  },
  methods: {
    goBetPage (event) {
      this.$router.push({
        path: '/bet'
      })
    },
    getWinnerNumbers (event) {
    }
  }
}
</script>
<style scoped>
.words {
  color: white;
}
.body{
  background:#000000;
  position:absolute;
  margin: 0;
  padding: 0;
  width:100%;
  height:100%;
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
  -webkit-box-shadow: 0 0 15px 2px #000;
  -moz-box-shadow: 0 0 15px 2px #000;
  box-shadow: 0 0 15px 2px #000;
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
  -webkit-box-shadow: 0 0 15px 2px #000;
  -moz-box-shadow: 0 0 15px 2px #000;
  box-shadow: 0 0 15px 2px #000;
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
  background-color: #2A2A2B;
  background-color: rgba(17, 17, 17, 0.67);
}
</style>
