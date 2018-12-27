<template>
  <div class='body'>
    <p>{{LottoName}}</p>
    <div class="redBallPart">
      <p>Choose 1 red ball</p>
      <div :key="ball" v-for="ball in redBalls">
        <div :class="{'selectedRedBall': ball == selectedRedBall, 'redBallStyle': ball != selectedRedBall}"  @click="selectRedBall">{{ball}}</div>
      </div>
    </div>
    <div class="blueBallPart">
      <p>Choose 6 blue balls</p>
      <div :key="ball" v-for="ball in blueBalls">
        <div :class="{'blueBallStyle': selectedBlueBalls.indexOf(ball) === -1, 'selectedBlueBall':  selectedBlueBalls.indexOf(ball) !== -1}"  @click="selectBlueBalls">{{ball}}</div>
      </div>
    </div>
    <div class="betSet">
      <p class="warning">{{ warningMsg }}</p>
      <input v-model='amount' type='number' class="betAmount" placeholder='1' min="1">
      <button v-on:click='bet' class="betButton">Bet</button>
      <button  v-if="authority" v-on:click='draw' class="drawButton">Draw</button>
    </div>
    <loadingPart v-if='pending'></loadingPart>
    <button @click="getUsers">get users</button>
    
    <button @click="getResult">get Result</button>
    <button @click="test">test</button>
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
  max-width: 700px;
  padding-left:130px;
  padding-right:130px;
  padding-top: 20px;
  padding-bottom: 20px;
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
.betButton,.drawButton {
  width: 50px;
	border-style: none;
	border-radius: 5px;
	font-size: 10pt;
  outline-style: none;
	color: white;
	padding: 5px;
	/*background-color: #6a5ff1;*/
  background: linear-gradient(to right, #1090F8, #6451F0);
  font-family: 'Montserrat';
  /*right: 0px;*/
  /*display: inline-block;*/
  margin-top: 10px;
  margin-left: 10px;

}
.drawButton{
  /*display: block;*/
   /*margin-bottom: 20px;*/
}
.betButton {
  
  /*margin-bottom: 200px;*/
}
.betAmount {
  padding: 5px;
  font-family: 'Montserrat';
  /*margin: 10px;*/
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
  text-align: right;
  position: relative;
}
.betSet p {
  line-height: 15pt;
}
.warning {
  height: 10px;
  transition: 1s;
}
loadingPart {
  z-index: 1;
}
</style>

<script type="text/javascript">
import LoadingPart from '@/components/Loading'
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
      warningMsg: '',
      authority: true,
      LottoName: null
    }
  },
  mounted () {
    this.LottoName = this.$store.state.unionLottoName
    console.log('dispatching setCurrentUnionLotto')
    console.log(this.$store.state.SeniorAuthority)
    this.$store.dispatch('getUnionLotto', {name:this.$store.state.unionLottoName,}).then(response=>{
      console.log("当前彩票" + this.$store.state.currentUnionLotto())
      this.$store.state.currentUnionLotto().isAuthority({
          gas: 300000,
          from: this.$store.state.web3.coinbase
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
            // this.authority = JSON.stringify(result) == "false" ? false : true
            // console.log("isAuthority")
            // console.log(this.authority )
          }
        })
    })
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
        this.pending = true
        betNumbers.push(this.selectedRedBall)
        this.selectedBlueBalls.sort((a, b) => {
          return a - b
        })
        for (var i = 0; i < 6; i++) {
          betNumbers.push(this.selectedBlueBalls[i])
        }
        console.log(betNumbers)
        this.$store.state.currentUnionLotto().bet(betNumbers, {
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
            console.log('在下述地址投注彩票')
            console.log(this.$store.state.currentUnionLotto())
            this.pending = false
          }
        })
      }      
    },
    draw (event) {
      console.log('start successfully')
      this.$store.state.currentUnionLotto().draw({
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
      this.$store.state.currentUnionLotto().getUsers({
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
      this.$store.state.currentUnionLotto().getWinnerNumbers({
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
      this.$store.state.currentUnionLotto().isAuthority({
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
    },
    getResult(event) {
      console.log("当前账户为")
      console.log(this.$store.state.web3.coinbase)
      this.$store.state.currentUnionLotto().getResult({
        gas: 3000000000000000000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log('error in getResult')
          console.log(err)
          this.pending = false
        } else {
          // 获得账户投注的所有彩票
          console.log('获得账户投注的所有彩票')
          console.log(result)
          // console.log(JSON.getJSONArray(result))
          var temp = JSON.stringify(result).slice(1,-1).split(',')
          // console.log(temp)
          // console.log(temp.length)
          if(temp.length === 1){
            this.hasBet = false
            this.pending = false
            return
          }
          for(var i = 0; i < temp.length; i += 8) {
            var tempNumbers = []
            var tempCount = 0
            for(var j = 0; j < 7; j++) {
              tempNumbers.push(parseInt(temp[i+j].slice(1,-1)))
            }
            var tempCount = parseInt(temp[i+7].slice(1,-1))
            // console.log('tempNumbers')
            // console.log(tempNumbers)
            var level = 0;
            (function (bets, result, contract, coinbase, numbers, i, pending) {
              contract.checkPriceLevel(numbers,{
                gas: 300000,
                from: coinbase
              }, (err, result) => {
                if(err) {
                  console.log(e)
                } else {
                  pending = false
                  // console.log('checkPriceLevel')
                  // console.log(numbers)
                  // console.log(JSON.stringify(result).slice(1,-1))
                  level = JSON.stringify(result).slice(1,-1)
                  if(level == 0)
                    level = "TO BE EXPECTED"
                  if(level == 0)
                    level = "NONE"
                  console.log('push')
                  bets.push({
                    no: i/8 + 1,
                    red: numbers[0],
                    blues: numbers.splice(1,6),
                    count: tempCount,
                    level: level
                  })
                }
              })
            })(this.bets, result, this.$store.state.currentUnionLotto(),this.$store.state.web3.coinbase, tempNumbers, i, this.pending);
          }
        }
      })
    },
    test(event) {
      this.$store.state.currentUnionLotto().test({
        gas: 3000000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log('error in getResult')
          console.log(err)
          this.pending = false
        } else {
          // 获得账户投注的所有彩票
          console.log('获得账户投注的所有彩票总数')
          console.log( JSON.stringify(result))
         
        }
      })
    }
  },
  components: {
    "loadingPart": LoadingPart
  }
}
</script>
