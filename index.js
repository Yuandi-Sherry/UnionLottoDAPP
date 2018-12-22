const Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse('[{"constant": false,"inputs": [{"name": "numbers","type": "uint256[7]"}],"name": "bet","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": false,"inputs": [{"name": "numbers","type": "uint256[7]"}],"name": "checkPriceLevel","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "computeResults","outputs": [],"payable": true,"stateMutability": "payable","type": "function"},{"constant": false,"inputs": [],"name": "draw","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "results","type": "uint256[7]"}],"name": "draw","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"inputs": [{"name": "_id","type": "string"},{"name": "_date","type": "string"}],"payable": true,"stateMutability": "payable","type": "constructor"},{"payable": true,"stateMutability": "payable","type": "fallback"},{"constant": true,"inputs": [{"name": "","type": "uint256"}],"name": "countResults","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "date","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "firstPrize","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "id","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "uint256"}],"name": "prizeForEachLevel","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "range","type": "uint256"}],"name": "rand","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "secondPrize","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "uint256"}],"name": "winnerNumbers","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"}]')
UnionLotto = web3.eth.contract(abi);
//在你的控制台中, 执行contractInstance.address，并将获得的地址替换下面这个0x413a...地址
contractInstance = UnionLotto.at('0xfe857064a2ac4cc874afd34bd3cfca023e793fbb');
 
$(document).ready(function() {
  
  $("#betButton").click(function () {
    var arr = $("#LotteryNumber").val().slice(1,-1).split(',');
    var numbers = [];
    for(var i = 0; i < arr.length; i++) {
      numbers.push(parseInt(arr[i]));
    }
    console.log(numbers);
    contractInstance.bet(numbers, {from:web3.eth.accounts[0]});
  })

  $("#drawButton").click(function () {
    contractInstance.draw({from: web3.eth.accounts[0]});
  })

});