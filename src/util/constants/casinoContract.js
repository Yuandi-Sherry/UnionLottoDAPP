const address = '0x2b49c4dd0e5736388687012c8eb3a479f624d432'
const ABI = [
  {
    'constant': false,
    'inputs': [],
    'name': 'kill',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'checkContractBalance',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': '_number',
        'type': 'uint256'
      }
    ],
    'name': 'bet',
    'outputs': [],
    'payable': true,
    'stateMutability': 'payable',
    'type': 'function'
  },
  {
    'inputs': [
      {
        'name': '_minBet',
        'type': 'uint256'
      },
      {
        'name': '_houseEdge',
        'type': 'uint256'
      }
    ],
    'payable': true,
    'stateMutability': 'payable',
    'type': 'constructor'
  },
  {
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'fallback'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': '_status',
        'type': 'bool'
      },
      {
        'indexed': false,
        'name': '_amount',
        'type': 'uint256'
      }
    ],
    'name': 'Won',
    'type': 'event'
  }
]
export {address, ABI}
