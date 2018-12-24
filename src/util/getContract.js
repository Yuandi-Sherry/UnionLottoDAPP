import Web3 from 'web3'
import {address, ABI} from './constants/casinoContract'
// const fs = require("fs")
// const solc = require('solc')
// 这一步会出问题
// CONTRACT_FILE = '../../../UnionLotto.sol'

let getContract = new Promise(function (resolve, reject) {
  // content =fs.readFileSync(CONTRACT_FILE).toString()
  // input = {
  //   language: 'Solidity',
  //   sources: {
  //     [CONTRACT_FILE]: {
  //       content: content
  //     }
  //   },
  //   settings: {
  //     outputSelection: {
  //       '*': {
  //         '*': ['*']
  //       }
  //     }
  //   }
  // }
  // compiled = solc.compile(JSON.stringify(input))
  // output = JSON.parse(compiled)
  // abi = output.contracts[CONTRACT_FILE]['UnionLotto'].abi
  // bytecode = output.contracts[CONTRACT_FILE]['UnionLotto'].evm.bytecode.object
  // bytecode = '0x'+bytecode
  // UnionLotto = web3.eth.contract(abi)
  // deployedContract = UnionLotto.new('testId','testDate',{from: web3.eth.accounts[0], data: bytecode, gas: 4700000})
  // let compiledContract = solc.compile(source, 1);
  // let abi = compiledContract.contracts['UnionLotto'].interface;
  // let bytecode = compiledContract.contracts['UnionLotto'].bytecode;
  // let gasEstimate = web3.eth.estimateGas({data: bytecode});

  // let MyContract = web3.eth.contract(JSON.parse(abi));
  // var myContractReturned = MyContract.new("param1", "param2", {
  //   from:mySenderAddress,
  //   data:bytecode,
  //   gas:gasEstimate}, function(err, myContract){
  //    if(!err) {
  //       // NOTE: The callback will fire twice!
  //       // Once the contract has the transactionHash property set and once its deployed on an address.
  //        // e.g. check tx hash on the first call (transaction send)
  //       if(!myContract.address) {
  //           console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
  //       // check address on the second call (contract deployed)
  //       } else {
  //           console.log(myContract.address) // the contract address
  //       }
  //        // Note that the returned "myContractReturned" === "myContract",
  //       // so the returned "myContractReturned" object will also get the address set.
  //    }
  //  });
  // // Deploy contract syncronous: The address will be added as soon as the contract is mined.
  // // Additionally you can watch the transaction by using the "transactionHash" property
  // var myContractInstance = MyContract.new("param1", "param2", {data: bytecode, gas: 300000, from: mySenderAddress});
  // myContractInstance.transactionHash // The hash of the transaction, which created the contract
  // myContractInstance.address
  // geth --rpc --nodiscover --datadir data0 --port 30303 --rpcapi "db,eth,net,web3" --rpccorsdomain "*" --networkid 1001 --ipcdisable console 2>>geth.log
  let web3 = new Web3(window.web3.currentProvider)
  let casinoContract = web3.eth.contract(ABI)
  let casinoContractInstance = casinoContract.at(address)
  // casinoContractInstance = () => casinoContractInstance
  resolve(casinoContractInstance)
})

export default getContract
