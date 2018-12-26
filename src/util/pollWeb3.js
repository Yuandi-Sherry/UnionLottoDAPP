import Web3 from 'web3'
import {store} from '../store/'

let pollWeb3 = function (state) {
  // 导入web3实例
  let web3 = window.web3
  web3 = new Web3(web3.currentProvider)

  setInterval(() => {
    if (web3 && store.state.web3.web3Instance) {
      if (web3.eth.coinbase !== store.state.web3.coinbase) {
        let newCoinbase = web3.eth.coinbase
        try {
          web3.eth.getBalance(web3.eth.coinbase, function (err, newBalance) {
            if (err) {
              console.log("err")
              console.log(err)
            } else {
              console.log("result")
              console.log(newCoinbase)
              store.dispatch('pollWeb3', {
                coinbase: newCoinbase,
                balance: parseInt(newBalance, 10)
              })
            }
          })
        } catch(e) {
          console.log(e)
        }
        
      } else {
        web3.eth.getBalance(store.state.web3.coinbase, (err, polledBalance) => {
          if (err) {
            console.log(err)
          } else if (parseInt(polledBalance, 10) !== store.state.web3.balance) {
            store.dispatch('pollWeb3', {
              coinbase: store.state.web3.coinbase,
              balance: polledBalance
            })
          }
        })
      }
    }
  }, 500)
}

export default pollWeb3
