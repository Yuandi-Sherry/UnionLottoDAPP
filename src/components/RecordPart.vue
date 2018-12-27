<!-- geth --rpc --nodiscover --datadir data0 --port 30303 --rpcapi "db,eth,net,web3" --rpccorsdomain "*" --networkid 1001 --ipcdisable console 2>>geth.log -->
<template>
  <div class="body">
    <p v-if="!hasBet">You haven't bet anything. </p>
    <div class="result" >
        <p>{{ announcedMsg}}</p>
        <div class=red>{{ getWinningRed }}</div>
        <div class="blue" v-for="blue in winningBlues">
          <div >{{ blue }}</div>
      </div>
    </div>
    <div class="allLottos" v-for="lottos in allUnionLottos">
     <button @click="changeLottos">{{ lottos }}</button>
    </div>
    <br>
    <table v-if="hasBet">
      <th>No</th>
      <th>Red Ball</th>
      <th>Blue Balls</th>
      <th># of bets</th>
      <th v-if="displayResult">Level of Prize</th>
      <tr v-for="bet in bets">
        <!-- <tbody> -->
          <td>{{ bet.no }}</td>
          <td><div :class="{red: bet.red == getWinningRed, ball: bet.red != getWinningRed}">{{ bet.red }}</div> </td>
          <td><div :class="{blue: winningBlues.indexOf(blue+'')!= -1, ball: winningBlues.indexOf(blue + '') === -1}" v-for="blue in bet.blues" @click="test">{{ blue }}</div></td>
          <td>{{ bet.count }}</td>
          <td v-if="displayResult">{{ bet.level }}</td>
      </tr>
    </table>
    <button @click="getWinnerNumbers">getWinnernumbers</button>
  </div>
  
</template>
<script>
export default {
  inject: ['reload'],
  name: 'RecordPart',
  data() {
  	return {
  	  bets: [],
      hasBet: true,
      winningRed:-1,
      winningBlues:[],
      pending: true,
      displayResult: true,
      announcedMsg: "",
      allUnionLottos: []
  	}
  },
  computed: {
    getWinningRed () {
      return this.winningRed
    },
    getHasBet() {
      return this.hasBet
    },
    getWinningNumbers() {

    }
  },
  mounted() {
  	console.log('------debug3--------- ' + this.$store.state.recordPageName)
    this.$store.dispatch('getUnionLotto', {name: this.$store.state.recordPageName}).then(response=> {
      // 获得此人投注本期彩票的所有记录
      this.$store.state.currentUnionLotto().getResult({
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          // console.log('error in getResult')
          // console.log(err)
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
          this.hasBet = true
        }
      })
      // 获得开奖结果
      this.$store.state.currentUnionLotto().getWinnerNumbers({
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if(err) {
          console.log(err)
        } else {
          console.log(result)
          if(JSON.stringify(result) == '["0","0","0","0","0","0","0"]') {
            console.log("haven't drawn")
            this.winningRed = JSON.stringify(result).slice(1,-1).split(',')[0].slice(1,-1)
            for(var i = 1; i < 7; i++) {
              this.winningBlues.push(JSON.stringify(result).slice(1,-1).split(',')[i].slice(1,-1))
            }
            this.announcedMsg = "This lottery haven't been annouced yet."
            this.winningRed = "?"
            this.winningBlues = ["?", "?", "?", "?", "?", "?"]
            this.hasResult = true
          } else {
            this.winningBlues = []
            this.winningRed = JSON.stringify(result).slice(1,-1).split(',')[0].slice(1,-1)
            for(var i = 1; i < 7; i++) {
              this.winningBlues.push(JSON.stringify(result).slice(1,-1).split(',')[i].slice(1,-1))
            }
            this.announcedMsg = "The result of thie lottery is: "
            this.hasResult = true
          }
        }
      })
      // 获得目前为止的所有彩票
      this.$store.state.SeniorAuthority().getLottos({
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if(err) {
          console.log(err)
        } else {
          console.log('获得目前为止的所有彩票')
          console.log(result)
          for(var i = 0; i < result.length; i++) {
            this.allUnionLottos.push(result[i])
          }
        }
      })
    }).catch(response=>{ 
       console.log(response)
    })   
  },
  methods: {
    test (event) {
      console.log(this.winningBlues.indexOf(event.target.innerHTML))
    },
    getWinnerNumbers(event) {
      this.$store.state.currentUnionLotto().getWinnerNumbers({
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if(err) {
          console.log(err)
        } else {
          console.log(result)
          if(JSON.stringify(result) == '["0","0","0","0","0","0","0"]') {
            console.log("haven't drawn")
            this.winningRed = JSON.stringify(result).slice(1,-1).split(',')[0].slice(1,-1)
            for(var i = 1; i < 7; i++) {
              this.winningBlues.push(JSON.stringify(result).slice(1,-1).split(',')[i].slice(1,-1))
            }
            this.announcedMsg = "This lottery haven't been annouced yet."
            this.winningRed = "?"
            this.winningBlues = ["?", "?", "?", "?", "?", "?"]
            this.hasResult = true
          } else {
            this.winningBlues = []
            this.winningRed = JSON.stringify(result).slice(1,-1).split(',')[0].slice(1,-1)
            for(var i = 1; i < 7; i++) {
              this.winningBlues.push(JSON.stringify(result).slice(1,-1).split(',')[i].slice(1,-1))
            }
            this.announcedMsg = "The result of thie lottery is: "
            this.hasResult = true
          }
          
          
        }
      })
    },
    changeLottos(event) {
      this.$store.dispatch('changeRecordPage', event.target.innerHTML).then(result=> {
        // console.log("then of changeRecordPage in recordPart")
        this.$store.dispatch('getUnionLotto', {name: this.$store.state.recordPageName}).then(response=> {
          this.$store.state.currentUnionLotto().getResult({
            gas: 300000,
            from: this.$store.state.web3.coinbase
          }, (err, result) => {
            if (err) {
              // console.log('error in getResult')
              // console.log(err)
              this.pending = false
            } else {
              this.bets = []
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
              this.hasBet = true
            }
          })
          // 获得开奖结果
          this.$store.state.currentUnionLotto().getWinnerNumbers({
            gas: 300000,
            from: this.$store.state.web3.coinbase
          }, (err, result) => {
            if(err) {
              console.log(err)
            } else {
              console.log(result)
              if(JSON.stringify(result) == '["0","0","0","0","0","0","0"]') {
                console.log("haven't drawn")
                this.winningRed = JSON.stringify(result).slice(1,-1).split(',')[0].slice(1,-1)
                for(var i = 1; i < 7; i++) {
                  this.winningBlues.push(JSON.stringify(result).slice(1,-1).split(',')[i].slice(1,-1))
                }
                this.announcedMsg = "This lottery haven't been annouced yet."
                this.winningRed = "?"
                this.winningBlues = ["?", "?", "?", "?", "?", "?"]
                this.hasResult = true
              } else {
                this.winningBlues = []
                this.winningRed = JSON.stringify(result).slice(1,-1).split(',')[0].slice(1,-1)
                for(var i = 1; i < 7; i++) {
                  this.winningBlues.push(JSON.stringify(result).slice(1,-1).split(',')[i].slice(1,-1))
                }
                this.announcedMsg = "The result of thie lottery is: "
                this.hasResult = true
              }
            }
          })
        }).catch(response=>{ 
           console.log(response)
        })   
      })


    }
  }
}

</script>
<style scoped>
.body {
	color: white;
  margin-left: auto;
  margin-right: auto;
}
.red, .blue, .ball {
  display: inline-block;
  border-radius: 50%;
  color: white;
  height: 30px;
  width: 30px;
  text-align: center;
  vertical-align: baseline;
  margin: 10px;
  line-height: 30px;
  
}
.ball {
  background-color: #3A3A57;
}
.red {
  background-color: #FF7F50;
}
.blue {
  background-color: #00AA90;
}
table {
  min-width: 700px;
  margin-left: auto;
  margin-right: auto;
}
td {
  text-align: center;
  border-radius: 10px;
  background: #232345;
  margin: 10px;
  padding-right: 20px;
  padding-left: 20px;
}
.result {
  height: 90px;
}

</style>
