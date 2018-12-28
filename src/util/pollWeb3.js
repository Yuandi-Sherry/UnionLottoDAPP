import Web3 from 'web3'
import {store} from '../store/'

let pollWeb3 = function (state) {
  // 导入web3实例
  let web3 = window.web3
  web3 = new Web3(web3.currentProvider)

  setInterval(() => {
    if (web3 && store.state.web3.web3Instance) {
      console.log("web3.eth.coinbase1----------" +JSON.stringify(store.state.web3.coinbase) )
       console.log("web3.eth.coinbase2----------" + typeof(JSON.stringify(web3.eth.coinbase) ))
      console.log("web3.eth.coinbase3----------")
      console.log(web3.eth.coinbase == null)
      if(web3.eth.coinbase == null) {
        console.log('未登录')
        // store.dispatch('registerWeb3')
      } else {
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
        }
        else {
          console.log("store.state.web3.coinbase----------" + store.state.web3.coinbase)
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
    }
  }, 500)
}

export default pollWeb3