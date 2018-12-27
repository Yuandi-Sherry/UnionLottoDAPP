// import Web3 from 'web3'
// import {store} from '../store/'

// const fs = require("fs")
// // let solc = require("solc")
// // 这一步会出问题
// // CONTRACT_FILE = '../../../UnionLotto.sol'

// let getUnionLotto = new Promise(function (resolve, reject) {
// 	var UnionLottoAddress = null
// 	console.log(store)
// 	store.state.SeniorAuthority().createUnionLotto(payload, {
// 		gas: 300000,
// 		from: store.state.web3.coinbase
// 	}, (err, result) => {
// 	  if (err) {
// 	    console.log('error in betting')
// 	    console.log(registerUnionLotto)
// 	  } else {
// 	    console.log('successully publish a lottery')
// 	    console.log(result)
// 	    UnionLottoAddress = result
// 	    let web3 = new Web3(window.web3.currentProvider)
// 		  let unionLotto = web3.eth.contract(UnionLottoABI)
// 		  let unionLottoInstance = unionLotto.at(UnionLottoAddress)
// 		  resolve(unionLottoInstance)
// 	  }
// 	})
  
// })

// export default getUnionLotto
