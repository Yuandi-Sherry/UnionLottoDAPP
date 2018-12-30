<template>
  <div class='body'>
    <p>This Union Lotto will be annouced on {{LottoName}}</p>
    <div class='blueBallPart'>
      <p>Choose 1 blue ball</p>
      <div :key='ball' v-for="ball in blueBalls">
        <div :class="{'selectedBlueBall': ball == selectedBlueBall, 'blueBallStyle': ball != selectedBlueBall}"  @click="selectBlueBall">{{ball}}</div>
      </div>
    </div>
    <div class="redBallPart">
      <p>Choose 6 red balls</p>
      <div :key="ball" v-for="ball in redBalls">
        <div :class="{'redBallStyle': selectedRedBalls.indexOf(ball) === -1, 'selectedRedBall':  selectedRedBalls.indexOf(ball) !== -1}"  @click="selectRedBalls">{{ball}}</div>
      </div>
    </div>
    <div class="betSet">
      <p class="warning">{{ warningMsg }}</p>
      <input v-model='amount' type='number' class="betAmount" placeholder='1' min="1">
      <button v-on:click='bet' class="betButton">Bet</button>
      <!-- <button  v-if="authority" v-on:click='draw' class="drawButton">Draw</button> -->
    </div>
    <loadingPart v-if='pending'></loadingPart>
  </div>
</template>

<style scoped>
/*global*/
.body {
  text-align: center;
  position: relative;
  color: white;
  font-family: 'Montserrat';
  margin-left: auto;
  margin-right: auto;
  min-width: 800px;
  max-width: 800px;
  padding-left:130px;
  padding-right:130px;
  padding-top: 20px;
  padding-bottom: 20px;
}
/*ball containers*/
.blueBallPart, .redBallPart {
  float: left;
  padding: 5px;
  background: linear-gradient(#2A2A4A, #1F1F41);
  border-radius: 10px;
  background-size: cover;
  margin: 10px;
  position: relative;

}
/*balls*/
.blueBallPart {
  width: 200px;
}
.redBallPart {
  width: 500px;
}
.blueBallStyle, .redBallStyle,.selectedBlueBall, .selectedRedBall,
.blueBallStyle:hover, .redBallStyle:hover {
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
.blueBallStyle, .redBallStyle {
  background-color: #3A3A57;
}
.blueBallStyle:hover, .selectedBlueBall {
  background-color: #00AA90;
  transition: 0.2s;
}
.redBallStyle:hover, .selectedRedBall {
  background-color: #FF7F50;
  transition: 0.2s;
}
.blueBallPart p, .redBallPart p {
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
      selectedBlueBall: -1,
      selectedRedBalls: [ ],
      redBalls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
      blueBalls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
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
    this.$store.dispatch('getUnionLotto', {name: this.$store.state.unionLottoName}).then(response => {
      console.log('当前彩票' + this.$store.state.currentUnionLotto())
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
        }
      })
    })
  },
  methods: {
    selectBlueBall (event) {
      // console.log(this.selectedBlueBall == parseInt(event.target.innerHTML));
      if (this.selectedBlueBall === parseInt(event.target.innerHTML)) {
        this.selectedBlueBall = -1
      } else {
        this.selectedBlueBall = parseInt(event.target.innerHTML)
      }
    },
    selectRedBalls (event) {
      // 判断是否已选择
      if (this.selectedRedBalls.indexOf(parseInt(event.target.innerHTML)) !== -1) {
        this.selectedRedBalls.splice(this.selectedRedBalls.indexOf(parseInt(event.target.innerHTML)), 1)
      } else {
        if (this.selectedRedBalls.length === 6) {
          console.log('You can only choose 6 balls, you can click a selected ball again to unselect it.')
        } else {
          this.selectedRedBalls.push(parseInt(event.target.innerHTML))
        }
      }
    },
    bet (event) {
      // 判断彩民选择的数字合法
      this.warningMsg = ''
      this.invalid = false
      var betNumbers = []
      if (this.selectedBlueBall === -1) {
        this.warningMsg += 'Please select 1 blue ball. '
        console.log()
        this.invalid = true
      }
      if (this.selectedRedBalls.length !== 6) {
        console.log('没有选择足够的蓝球')
        if (this.warningMsg === 'Please select 1 blue ball. ') {
          this.warningMsg = this.warningMsg.slice(0, -2)
          this.warningMsg += ' and 6 blue balls'
        } else {
          this.warningMsg += 'Please select 6 blue balls. '
        }
        this.invalid = true
      }
      // 在彩民选择数字合法的情况下，读取彩民投注的数字
      if (this.invalid === false) {
        this.pending = true
        betNumbers.push(this.selectedBlueBall)
        this.selectedRedBalls.sort((a, b) => {
          return a - b
        })
        for (var i = 0; i < 6; i++) {
          betNumbers.push(this.selectedRedBalls[i])
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
    }
  },
  components: {
    'loadingPart': LoadingPart
  }
}
</script>
