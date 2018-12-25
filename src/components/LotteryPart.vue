<template>
  <div class='body'>
    <div class="redBallPart">
      <p>Choose only one lucky red ball</p>
      <div :key="ball" v-for="ball in redBalls">
        <div :class="{'selectedRedBall': ball == selectedRedBall, 'redBallStyle': ball != selectedRedBall}"  @click="selectRedBall">{{ball}}</div>
      </div>
    </div>
    <div class="blueBallPart">
      <p>Choose six blue balls</p>
      <div :key="ball" v-for="ball in blueBalls">
        <div :class="{'blueBallStyle': selectedBlueBalls.indexOf(ball) === -1, 'selectedBlueBall':  selectedBlueBalls.indexOf(ball) !== -1}"  @click="selectBlueBalls">{{ball}}</div>
      </div>
    </div>
    <div class="betSet">
      <p class="warning">{{ warningMsg }}</p>
      <input v-model='amount' type='number' class="betAmount" placeholder='1' min="1">
      <button v-on:click='bet' class="betButton">Bet</button>
      
    </div>
    
   
    <button v-on:click='draw'>Draw</button>
    <button v-on:click='getUsers'>getUsers</button>
    <button v-on:click='getWinnerNumbers'>getWinnerNumbers</button>
    <button v-on:click='isAuthority'>isAuthority</button>
    
<!--     <input v-model='selectedBlueBalls' placeholder='[1,2,3,4,5,6,7]'> -->
    
    <!-- <h1>Welcome to the Casino</h1>
    <h4>Please pick a number between 1 and 10</h4>
    Amount to bet:
    <ul>
      <li v-on:click='clickNumber'>1</li>
      <li v-on:click='clickNumber'>2</li>
      <li v-on:click='clickNumber'>3</li>
      <li v-on:click='clickNumber'>4</li>
      <li v-on:click='clickNumber'>5</li>
      <li v-on:click='clickNumber'>6</li>
      <li v-on:click='clickNumber'>7</li>
      <li v-on:click='clickNumber'>8</li>
      <li v-on:click='clickNumber'>9</li>
      <li v-on:click='clickNumber'>10</li>
    </ul>
    

    <div class='event' v-if='winEvent'>
      Won: {{ winEvent._status }}
      Amount: {{ winEvent._amount }} Wei
    </div>-->
  </div>
</template>

<style scoped>
/*global*/
.body {
  position: relative;
  color: white;
  font-family: 'Montserrat';
  margin-left: auto;
  margin-right: auto;
  min-width: 700px;
  max-width: 700px
}
/*ball containers*/
.redBallPart, .blueBallPart {
  float: left;
  padding: 5px;
  background: linear-gradient(#2A2A4A, #1F1F41);
  border-radius: 10px;
  background-size: cover;
  margin: 10px;
  position: relative;

}
/*balls*/

.redBallPart {
  width: 200px;
}
.blueBallPart {
  width: 400px;
}
.redBallStyle, .blueBallStyle,.selectedRedBall, .selectedBlueBall,
.redBallStyle:hover, .blueBallStyle:hover {
  border-radius: 50%;
  color: white;
  height: 30px;
  width: 30px;
  text-align: center;
  vertical-align: baseline;
  float: left;
  margin: 10px;
  line-height: 30px;
}
.redBallStyle, .blueBallStyle {
  background-color: #3A3A57;
}
.redBallStyle:hover, .selectedRedBall {
  background-color: #FF7F50;
  transition: 0.2s;
}
.blueBallStyle:hover, .selectedBlueBall {
  background-color: #00AA90;
  transition: 0.2s;
}
.redBallPart p, .blueBallPart p {
	min-height: 20px;
	max-height: 20px;
}
/*for buttons*/
.betButton {
	width: 50px;
	border-style: none;
	border-radius: 5px;
	font-size: 10pt;
  outline-style: none;
	color: white;
	padding: 5px;
	/*background-color: #6a5ff1;*/
  background: linear-gradient(to right, #1090F8, #6451F0);
  font-family: 'Montserrat'
}
.betAmount {
  padding: 5px;
  font-family: 'Montserrat';
  margin: 10px;
  border-radius: 5px;
  border-style: none;
  outline-style: none;
  width: 50px;
  background-color: #2A2A4A;
  color: white;
  font-weight: bold;
}
.betSet {
  float: right;
  text-align: center;
  position: relative;
  min-width: 700px;
  max-width: 700px;
  margin: auto;
}
.betSet p {
  line-height: 15pt;
}
</style>

<script type="text/javascript">
export default {
  name: 'BetPage',
  data () {
    return {
      amount: 1,
      pending: false,
      winEvent: null,
      betNumbersStr: [ ],
      selectedRedBall: -1,
      selectedBlueBalls: [ ],
      blueBalls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
      redBalls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      invalid: false,
      warningMsg: ''
    }
  },
  mounted () {
    console.log('dispatching getContractInstance')
    this.$store.dispatch('getContractInstance')
  },
  methods: {
    selectRedBall (event) {
      // console.log(this.selectedRedBall == parseInt(event.target.innerHTML));
      if (this.selectedRedBall === parseInt(event.target.innerHTML)) {
        this.selectedRedBall = -1
      } else {
        this.selectedRedBall = parseInt(event.target.innerHTML)
      }
    },
    selectBlueBalls (event) {
      // 判断是否已选择
      if (this.selectedBlueBalls.indexOf(parseInt(event.target.innerHTML)) !== -1) {
        this.selectedBlueBalls.splice(this.selectedBlueBalls.indexOf(parseInt(event.target.innerHTML)), 1)
      } else {
        if (this.selectedBlueBalls.length === 6) {
          console.log('You can only choose 6 balls, you can click a selected ball again to unselect it.')
        } else {
          this.selectedBlueBalls.push(parseInt(event.target.innerHTML))
        }
      }
    },
    bet (event) {
      // 判断彩民选择的数字合法
      this.warningMsg = ''
      this.invalid = false
      var betNumbers = []
      if (this.selectedRedBall === -1) {
        this.warningMsg += 'Please select 1 red ball. '
        console.log()
        this.invalid = true
      }
      if (this.selectedBlueBalls.length !== 6) {
        console.log('没有选择足够的蓝球')
        if (this.warningMsg == 'Please select 1 red ball. ') {
          this.warningMsg = this.warningMsg.slice(0,-2)
          this.warningMsg += ' and 6 blue balls'
        } else {
          this.warningMsg += 'Please select 6 blue balls. '
        }
        this.invalid = true
      }
      // 在彩民选择数字合法的情况下，读取彩民投注的数字
      if (this.invalid === false) {
        betNumbers.push(this.selectedRedBall)
        this.selectedBlueBalls.sort((a, b) => {
          return a - b
        })
        for (var i = 0; i < 6; i++) {
          betNumbers.push(this.selectedBlueBalls[i])
        }
        console.log(betNumbers)
        this.$store.state.contractInstance().bet(betNumbers, {
          gas: 300000,
          from: this.$store.state.web3.coinbase,
          value: this.$store.state.web3.web3Instance().toWei(this.amount * 2, 'ether')
        }, (err, result) => {
          if (err) {
            if (err.indexOf(' User denied transaction signature.') !== -1) {
              this.invalid = true
              this.warningMsg = 'You\'ve denied transaction signature.'
            }
            console.log('error in betting')
            console.log(err)
            this.pending = false
          } else {
            console.log('bet successfully')
          }
        })
      }

      
    },
    draw (event) {
      console.log('start successfully')
      this.$store.state.contractInstance().testDraw([1,2,3,4,5,6,7],{
        gas: 3000000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log('error')
          console.log(err)
          this.pending = false
        } else {
          console.log('drew successfully')
        }
      })
    },
    getUsers (event) {
      this.$store.state.contractInstance().getUsers({
        gas: 500000,
        from: this.$store.state.web3.coinbase
      },
      (err, result) => {
        if (err) {
          console.log('error')
          this.pending = false
        } else {
          console.log('getUsers')
          console.log(JSON.stringify(result))
        }
      })
    },
    getWinnerNumbers (event) {
      this.$store.state.contractInstance().getWinnerNumbers({
        gas: 500000,
        from: this.$store.state.web3.coinbase
      },
      (err, result) => {
        if (err) {
          console.log('error')
          this.pending = false
        } else {
          console.log('getWinnerNumbers')
          console.log(JSON.stringify(result))
        }
      })
    },
    isAuthority (event) {
      this.$store.state.contractInstance().isAuthority({
        gas: 500000,
        from: this.$store.state.web3.coinbase
      },
      (err, result) => {
        if (err) {
          console.log('error')
          this.pending = false
        } else {
          console.log('isAuthority')
          console.log(JSON.stringify(result))
        }
      })
    }
  }
}
</script>
