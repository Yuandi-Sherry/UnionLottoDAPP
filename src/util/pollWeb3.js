import Web3 from 'web3'
import {store} from '../store/'

let pollWeb3 = function (state) {
  // 导入web3实例
  let web3 = window.web3
  web3 = new Web3(web3.currentProvider)

  setInterval(() => {
    if (web3 && store.state.web3.web3Instance) {
      if(web3.eth.coinbase == null) {
        console.log('[warning] fail to log in MetaMask')
      } else {
        if (web3.eth.coinbase !== store.state.web3.coinbase) {
          let newCoinbase = web3.eth.coinbase
          try {
            web3.eth.getBalance(web3.eth.coinbase, function (err, newBalance) {
              if (err) {
                console.log("---- error in pollWeb3 ----")
                console.log(err)
              } else {
                store.dispatch('pollWeb3', {
                  coinbase: newCoinbase,
                  balance: parseInt(newBalance, 10)/1000000000000000000
                })
              }
            })
          } catch(e) {
            console.log("---- error in catch ----")
            console.log(e)
          }
        }
        else {
          // console.log("store.state.web3.coinbase----------" + store.state.web3.coinbase)
          web3.eth.getBalance(store.state.web3.coinbase, (err, polledBalance) => {
            if (err) {
              console.log("---- error in getBalance ----")
              console.log(err)
            } else if (parseInt(polledBalance, 10) !== store.state.web3.balance) {
              
              store.dispatch('pollWeb3', {
                coinbase: store.state.web3.coinbase,
                balance: polledBalance/1000000000000000000
              })
            }
          })
        }
      }
    }
  }, 500)
}

export default pollWeb3