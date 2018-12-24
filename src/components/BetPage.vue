<template>
  <div class='body'>
  	<div class="redBallPart">
  		<p>Choose only one lucky red ball</p>
  		<div v-for="ball in redBalls">
  			<div :class="{'selectedRedBall': ball == selectedRedBall, 'redBallStyle': ball != selectedRedBall}"  @click="selectRedBall">{{ball}}</div>
	  	</div>
  	</div>
  	<div class="blueBallPart">
  		<p>Choose six blue balls</p>
  		<div v-for="ball in blueBalls">
  			<div :class="{'blueBallStyle': selectedBlueBalls.indexOf(ball) === -1, 'selectedBlueBall':  selectedBlueBalls.indexOf(ball) !== -1}"  @click="selectBlueBalls">{{ball}}</div>
	  	</div>
  	</div>
  	<!-- <div class="blueBallPart"></div> -->
    <!-- my codes -->
    <button v-on:click='bet'>Bet</button>
    <button v-on:click='draw'>Draw</button>
    <button v-on:click='getUsers'>getUsers</button>
    <button v-on:click='getWinnerNumbers'>getWinnerNumbers</button>
    <button v-on:click='isAuthority'>isAuthority</button>
    <input v-model='selectedBlueBalls' placeholder='[1,2,3,4,5,6,7]'>
    <input v-model='amount' type='number' placeholder='1' min="1">
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
    <img v-if='pending' id='loader' src='https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif'> -->

    <div class='event' v-if='winEvent'>
      Won: {{ winEvent._status }}
      Amount: {{ winEvent._amount }} Wei
    </div>
  </div>
</template>

<style scoped>
.redBallPart, .blueBallPart {
	float: left;
	padding: 5px;
	background-color: #1F1F3F;
	border-radius: 20px;
	width: 200px;
	background-size: cover;
}
.body {
	width: 100%;
	height: 100%;
	position: absolute;
	background: #121234;
	background-repeat: no-repeat;
	background-size: cover;
	color: white
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
	color: red;
	transition: 0.2s;
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
      betNumbersStr: [],
      selectedRedBall: -1,
      selectedBlueBalls:[],
      blueBalls:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],
      redBalls: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
    }
  },
 mounted () {
 console.log('dispatching getContractInstance')
 this.$store.dispatch('getContractInstance')
 
},
 methods: {
  clickNumber (event) {
    console.log(event.target.innerHTML, this.amount)
    this.winEvent = null
    this.pending = true
    this.$store.state.contractInstance().bet(event.target.innerHTML, {
      gas: 300000,
      value: this.$store.state.web3.web3Instance().toWei(this.amount, 'ether'),
      from: this.$store.state.web3.coinbase
      }, (err, result) => {
      if (err) {
        console.log(err)
        this.pending = false
        } else {
        let Won = this.$store.state.contractInstance().Won()
        Won.watch((err, result) => {
          if (err) {
            console.log('could not get event Won()')
            } else {
            this.winEvent = result.args
            this.pending = false
            }
          })
        }
      })
    },
    selectRedBall(event) {
      // console.log(this.selectedRedBall == parseInt(event.target.innerHTML));
      if(this.selectedRedBall == parseInt(event.target.innerHTML)) {
        this.selectedRedBall = -1
      } else {
      	this.selectedRedBall = parseInt(event.target.innerHTML);
      }      
    },
    selectBlueBalls(event) {
      // 判断是否已选择
      if(this.selectedBlueBalls.indexOf(parseInt(event.target.innerHTML))!== -1) {
      	this.selectedBlueBalls.splice(this.selectedBlueBalls.indexOf(parseInt(event.target.innerHTML)),1);
      } else {
      	if(this.selectedBlueBalls.length == 6) {
      	console.log("You can only choose 6 balls, you can click a selected ball again to unselect it.")
	      } else {
	      	this.selectedBlueBalls.push(parseInt(event.target.innerHTML));
	      }
      }
    },
    bet (event) {
    	// 判断彩民选择的数字合法
    	if(this.selectedRedBall == -1) {

    	}
    	// 读取彩民投注的数字
      var numbers = []
      var temp = this.betNumbersStr.slice(1,-1).split(',')
      for(var i = 0; i < 7; i++) {
      	numbers.push(parseInt(temp[i]))
      }

      this.$store.state.contractInstance().bet(numbers,{
        gas:300000,
        from: this.$store.state.web3.coinbase,
        value: this.$store.state.web3.web3Instance().toWei(this.amount * 2, 'ether'),
      }, (err, result) => {
        if (err) {
          console.log('error in betting')
          console.log(err)
          this.pending = false
        } else {
          console.log('bet successfully')
          console.log(result.args)
          // let Won = this.$store.state.contractInstance().Won()
          // Won.watch((err, result) => {
          //   if (err) {
          //     console.log('could not get event Won()')
          //   } else {
          //     this.winEvent = result.args
          //     this.pending = false
          //   }
          // })
        }
      })
      
    },
    draw (event) {
      console.log('start successfully')
      this.$store.state.contractInstance().testDraw([1,2,3,4,5,6,7],{
        gas:3000000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log('error')
          console.log(err)
          this.pending = false
        } else {
          console.log('drew successfully')
          

          // let Won = this.$store.state.contractInstance().Won()
          // Won.watch((err, result) => {
          //   if (err) {
          //     console.log('could not get event Won()')
          //   } else {
          //     this.winEvent = result.args
          //     this.pending = false
          //   }
          // })
       //    this.$store.state.contractInstance().computeResults({
	      //   gas:300000,
	      //   from: this.$store.state.web3.coinbase
	      // }, (err, result) => {
	      //   if (err) {
	      //     console.log('error in distributig')
	      //     console.log(err)
	      //     this.pending = false
	      //   } else {
	      //     console.log('distributig successfully')
	      //   }
	      // })
        }
      })
    },
    getUsers(event) {
    	console.log('getUsers is clicked')
    	var users = this.$store.state.contractInstance().getUsers({
          	gas:500000,
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
        });
    },
    getWinnerNumbers(event) {
    	var winnerNumber = [];
    	winnerNumber = this.$store.state.contractInstance().getWinnerNumbers({
          	gas:500000,
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
    isAuthority(event) {
    	this.$store.state.contractInstance().isAuthority({
          	gas:500000,
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
        this.$store.state.contractInstance().getAuthority({
          	gas:500000,
          	from: this.$store.state.web3.coinbase
          },
          (err, result) => {
	        if (err) {
	          console.log('error')
	          this.pending = false
	        } else {
	          console.log('Authority is')
	          console.log(JSON.stringify(result))
	        }  
        })
    }

  }
}
</script>
