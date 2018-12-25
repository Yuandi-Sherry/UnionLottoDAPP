<!-- geth --rpc --nodiscover --datadir data0 --port 30303 --rpcapi "db,eth,net,web3" --rpccorsdomain "*" --networkid 1001 --ipcdisable console 2>>geth.log -->
<template>
  <div class="body">
    <p v-if="pending">Pending</p>
    <p v-if="!hasBet">You haven't bet anything. </p>
    <div>
      <p @click="selectRedBall">The winning numbers of this Union Lotto are: </p>
      <p>{{ winningNumbers }}</p>
    </div>
    <table v-if="hasBet">
      <th>No</th>
      <th>Red Ball</th>
      <th>Blue Balls</th>
      <th># of bets</th>
      <th v-if="displayResult">Level of Prize</th>
      <tr v-for="bet in bets">
        <!-- <tbody> -->
          <td>{{ bet.no }}</td>
          <td class="red">{{ bet.red }}</td>
          <td><div class="blue" v-for="blue in bet.blues">{{ blue }}</div></td>
          <td>{{ bet.count }}</td>
          <td v-if="displayResult">{{ bet.level }}</td>
        <!-- </tbody> -->
      </tr>
    </table>
    	
  </div>
  
</template>
<script>
export default {
  name: 'RecordPart',
  data() {
  	return {
  	  bets: [],
      hasBet: true,
      winningNumbers:[0,0,0,0,0,0,0],
      pending: true,
      displayResult: true
  	}
  },
  mounted() {
  	console.log('dispatching getContractInstance')
    this.$store.dispatch('getContractInstance').then(response=> {
      this.$store.state.contractInstance().getResult({
        gas: 300000,
        from: this.$store.state.web3.coinbase
      }, (err, result) => {
        if (err) {
          // console.log('error in getResult')
          // console.log(err)
          this.pending = false
        } else {
          // 获得账户投注的所有彩票
          // console.log('result in getResult')
          // console.log(result)
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
            console.log(tempNumbers)
            var level = 0;
            (function (bets, result, contract, coinbase, numbers, i) {
              contract.checkPriceLevel(numbers,{
                gas: 300000,
                from: coinbase
              }, (err, result) => {
                if(err) {
                  console.log(e)
                } else {
                  console.log('checkPriceLevel')
                  console.log(numbers)
                  console.log(JSON.stringify(result).slice(1,-1))
                  level = JSON.stringify(result).slice(1,-1)
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
            })(this.bets, result, this.$store.state.contractInstance(),this.$store.state.web3.coinbase, tempNumbers, i);
          }
        }
      })
    }).catch(response=>{ 
       console.log(response)
    })   
  },
  methods: {
    selectRedBall (event) {
      console.log("after getResult")
      console.log(this.bets.length)
      for(var i = 0; i < this.bets.length; ) {
        // console.log("i="+i)
      
      }
    },
  }
}

</script>
<style scoped>
.body {
	color: white;
}
.red, .blue {
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
.red {
  background-color: #FF7F50;
}
.blue {
  background-color: #00AA90;
}
td {
  text-align: center;
  border-radius: 10px;
  background: #232345;
  margin: 10px;
}

</style>
