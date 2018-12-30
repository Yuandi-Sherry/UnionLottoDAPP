<!-- geth --rpc --nodiscover --datadir data0 --port 30303 --rpcapi "db,eth,net,web3" --rpccorsdomain "*" --networkid 1001 --ipcdisable console 2>>geth.log -->
<template>
  <div class="body">
    <div class="result" >
        <p>{{ announcedMsg}}</p>
        <div class=blue>{{ getWinningBlue }}</div>
        <div :key="red" class="red" v-for="red in winningReds">
          <div >{{ red }}</div>
      </div>
    </div>
    <div class="dateContainer">
      <p>Recent Lottos</p>
      <div :key='lottos' v-for="lottos in allUnionLottos">
       <p @click="changeLottos" :class="{'allLottos': lottos != currentLotto, 'chosen': lottos == currentLotto}">{{ lottos }}</p>
      </div>
    </div>
    <br>
    <div v-if="!hasBet" class="hasntBet">
      <p v-if="!hasBet">You haven't bet anything. </p>
    </div>
    <table v-if="hasBet">
      <th>Blue Ball</th>
      <th>Red Balls</th>
      <th># of bets</th>
      <th v-if="displayResult">Level of Prize</th>
      <tr  :key="bet" v-for="bet in bets">
        <td><div :class="{blue: bet.blue == getWinningBlue, ball: bet.blue != getWinningBlue}">{{ bet.blue }}</div> </td>
        <td><div :key="red" :class="{red: winningReds.indexOf(red+'')!= -1, ball: winningReds.indexOf(red + '') === -1}" v-for="red in bet.reds" @click="test">{{ red }}</div></td>
        <td>{{ bet.count }}</td>
        <td v-if="displayResult">{{ bet.level }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  inject: ['reload'],
  name: 'RecordPart',
  data () {
    return {
      bets: [ ],
      hasBet: true,
      winningBlue: -1,
      winningReds: [],
      pending: true,
      displayResult: true,
      announcedMsg: '',
      allUnionLottos: [ ],
      currentLotto: ''
    }
  },
  computed: {
    getWinningBlue () {
      return this.winningBlue
    },
    getHasBet () {
      return this.hasBet
    }
  },
  mounted () {
    console.log('------debug3--------- ' + this.$store.state.recordPageName)
    this.$store.dispatch('getUnionLotto', {name: this.$store.state.recordPageName}).then(response => {
      this.currentLotto = this.$store.state.recordPageName
      // 获得此人投注本期彩票的所有记录
      this.$store.state.currentUnionLotto().getResult({
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          this.pending = false
        } else {
          // 获得账户投注的所有彩票
          console.log('获得账户投注的所有彩票')
          console.log(result)
          // console.log(JSON.getJSONArray(result))
          var temp = JSON.stringify(result).slice(1, -1).split(',')
          // console.log(temp)
          // console.log(temp.length)
          if (temp.length === 1) {
            this.hasBet = false
            this.pending = false
            return
          }
          for (var i = 0; i < temp.length; i += 8) {
            var tempNumbers = []
            var tempCount = 0
            for (var j = 0; j < 7; j++) {
              tempNumbers.push(parseInt(temp[i + j].slice(1, -1)))
            }
            tempCount = parseInt(temp[i + 7].slice(1, -1))
            // console.log('tempNumbers')
            // console.log(tempNumbers)
            var level = 0;
            (function (bets, result, contract, coinbase, numbers, i, pending, tempCount) {
              contract.checkPriceLevel(numbers, {
                gas: 300000,
                from: coinbase
              }, (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  pending = false
                  level = JSON.stringify(result).slice(1, -1)
                  if (level === '0') {
                    level = 'TO BE EXPECTED'
                  }
                  if (level === '7') {
                    level = 'NONE'
                  }
                  console.log('push')
                  bets.push({
                    no: i / 8 + 1,
                    blue: numbers[0],
                    reds: numbers.splice(1, 6),
                    count: tempCount,
                    level: level
                  })
                }
              })
            })(this.bets, result, this.$store.state.currentUnionLotto(), this.$store.state.web3.coinbase, tempNumbers, i, this.pending, tempCount)
          }
          this.hasBet = true
        }
      })
      // 获得开奖结果
      this.$store.state.currentUnionLotto().getWinnerNumbers({
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log(result)
          if (JSON.stringify(result) === '["0","0","0","0","0","0","0"]') {
            console.log("haven't drawn")
            this.winningBlue = JSON.stringify(result).slice(1, -1).split(',')[0].slice(1, -1)
            for (var i = 1; i < 7; i++) {
              this.winningReds.push(JSON.stringify(result).slice(1, -1).split(',')[i].slice(1, -1))
            }
            this.announcedMsg = 'This lottery haven\'t been annouced yet.'
            this.winningBlue = '?'
            this.winningReds = ['?', '?', '?', '?', '?', '?']
            this.hasResult = true
          } else {
            this.winningReds = []
            this.winningBlue = JSON.stringify(result).slice(1, -1).split(',')[0].slice(1, -1)
            for (var j = 1; j < 7; j++) {
              this.winningReds.push(JSON.stringify(result).slice(1, -1).split(',')[j].slice(1, -1))
            }
            this.announcedMsg = 'The result of thie lottery is: '
            this.hasResult = true
          }
        }
      })
      // 获得目前为止的所有彩票
      this.$store.state.SeniorAuthority().getLottos({
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log('获得目前为止的所有彩票')
          console.log(result)
          for (var i = 1; i < result.length; i++) {
            this.allUnionLottos.push(result[i])
          }
          this.$store.state.SeniorAuthority().getLatest({
            gas: 300000,
            from: this.$store.state.web3.coinbase
          }, (err, result) => {
            if (err) {
              console.log(err)
            } else {
              console.log('获得最后一个彩票的日期')
              console.log(result)
              this.allUnionLottos.push(result)
            }
          })
        }
      })
    }).catch(response => {
      console.log(response)
    })
  },
  methods: {
    test (event) {
      console.log(this.winningReds.indexOf(event.target.innerHTML))
    },
    getWinnerNumbers (event) {
      this.$store.state.currentUnionLotto().getWinnerNumbers({
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          console.log(result)
          if (JSON.stringify(result) === '["0","0","0","0","0","0","0"]') {
            console.log("haven't drawn")
            this.winningBlue = JSON.stringify(result).slice(1, -1).split(',')[0].slice(1, -1)
            for (var i = 1; i < 7; i++) {
              this.winningReds.push(JSON.stringify(result).slice(1, -1).split(',')[i].slice(1, -1))
            }
            this.announcedMsg = 'This lottery haven\'t been annouced yet.'
            this.winningBlue = '?'
            this.winningReds = ['?', '?', '?', '?', '?', '?']
            this.hasResult = true
          } else {
            this.winningReds = []
            this.winningBlue = JSON.stringify(result).slice(1, -1).split(',')[0].slice(1, -1)
            for (var j = 1; j < 7; j++) {
              this.winningReds.push(JSON.stringify(result).slice(1, -1).split(',')[j].slice(1, -1))
            }
            this.announcedMsg = 'The result of thie lottery is: '
            this.hasResult = true
          }
        }
      })
    },
    changeLottos (event) {
      this.$store.dispatch('changeRecordPage', event.target.innerHTML).then(result => {
        this.currentLotto = event.target.innerHTML
        // console.log("then of changeRecordPage in recordPart")
        this.$store.dispatch('getUnionLotto', {name: this.$store.state.recordPageName}).then(response => {
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
              var temp = JSON.stringify(result).slice(1, -1).split(',')
              // console.log(temp)
              // console.log(temp.length)
              if (temp.length === 1) {
                this.hasBet = false
                this.pending = false
                return
              }
              for (var i = 0; i < temp.length; i += 8) {
                var tempNumbers = []
                var tempCount = 0
                for (var j = 0; j < 7; j++) {
                  tempNumbers.push(parseInt(temp[i + j].slice(1, -1)))
                }
                tempCount = parseInt(temp[i + 7].slice(1, -1))
                // console.log('tempNumbers')
                // console.log(tempNumbers)
                var level = 0;
                (function (bets, result, contract, coinbase, numbers, i, pending, tempCount) {
                  contract.checkPriceLevel(numbers, {
                    gas: 300000,
                    from: coinbase
                  }, (err, result) => {
                    if (err) {
                      console.log(err)
                    } else {
                      pending = false
                      // console.log('checkPriceLevel')
                      // console.log(numbers)
                      // console.log(JSON.stringify(result).slice(1, -1))
                      level = JSON.stringify(result).slice(1, -1)
                      if (level === 0) {
                        level = 'TO BE EXPECTED'
                      }
                      if (level === 7) {
                        level = 'NONE'
                      }
                      console.log('push')
                      bets.push({
                        no: i / 8 + 1,
                        blue: numbers[0],
                        reds: numbers.splice(1, 6),
                        count: tempCount,
                        level: level
                      })
                    }
                  })
                })(this.bets, result, this.$store.state.currentUnionLotto(), this.$store.state.web3.coinbase, tempNumbers, i, this.pending, tempCount)
              }
              this.hasBet = true
            }
          })
          // 获得开奖结果
          this.$store.state.currentUnionLotto().getWinnerNumbers({
            gas: 300000,
            from: this.$store.state.web3.coinbase
          }, (err, result) => {
            if (err) {
              console.log(err)
            } else {
              console.log(result)
              if (JSON.stringify(result) === '["0","0","0","0","0","0","0"]') {
                console.log("haven't drawn")
                this.winningBlue = JSON.stringify(result).slice(1, -1).split(',')[0].slice(1, -1)
                for (var i = 1; i < 7; i++) {
                  this.winningReds.push(JSON.stringify(result).slice(1, -1).split(',')[i].slice(1, -1))
                }
                this.announcedMsg = "This lottery haven't been annouced yet."
                this.winningBlue = '?'
                this.winningReds = ['?', '?', '?', '?', '?', '?']
                this.hasResult = true
              } else {
                this.winningReds = []
                this.winningBlue = JSON.stringify(result).slice(1, -1).split(',')[0].slice(1, -1)
                for (var j = 1; j < 7; j++) {
                  this.winningReds.push(JSON.stringify(result).slice(1, -1).split(',')[j].slice(1, -1))
                }
                this.announcedMsg = 'The result of thie lottery is: '
                this.hasResult = true
              }
            }
          })
        }).catch(response => {
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
.blue, .red, .ball {
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

table {
  min-width: 700px;
  float: right;
  min-width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-right: 15%;
}
td {
  text-align: center;
}
.dateContainer {
  float: left;
  margin-left: 15%;
  width: 10%;
}
.dateContainer > p {
  font-weight: bold;
}
.allLottos, .chosen {
  display: block;
  width: 100%;
  padding: 5px;
  /*margin: 10px;*/
  border-radius: 10px;
  background: linear-gradient(#2A2A4A, #1F1F41);
}
.chosen {
  color: #CF8143;

}
.allLottos:hover {
  background: linear-gradient(#3A3A57, #2A2A4A);
  transition: 5s;
}
.hasntBet {
  float: right;
  min-width: 50%;
  /*margin: auto;*/
  margin-right: 15%;
}
.hasntBet p {
  vertical-align: center;
  font-weight: bold;
}

</style>
