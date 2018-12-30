import Web3 from 'web3'
import {address, ABI} from './constants/SeniorAuthority'

let getSeniorAuthority = new Promise(function (resolve, reject) {
  let web3 = new Web3(window.web3.currentProvider)
  let seniorAuthority = web3.eth.contract(ABI)
  let seniorAuthorityInstance = seniorAuthority.at(address)
  resolve(seniorAuthorityInstance)
})

export default getSeniorAuthority
