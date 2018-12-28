const address = '0x56de5b5c61f5903c17f8edb806ea6f3b0ecdb670'
const ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "date",
        "type": "string"
      }
    ],
    "name": "createUnionLotto",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "date",
        "type": "string"
      }
    ],
    "name": "getContractAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getLatest",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getLottos",
    "outputs": [
      {
        "name": "",
        "type": "string[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
export {address, ABI}
