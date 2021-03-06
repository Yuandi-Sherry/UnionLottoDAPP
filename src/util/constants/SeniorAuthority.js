const address = '0xf25cd30b4f94f2e28323d96dc0d3c24f5f78c8f9'
const ABI = [
  {
    'constant': false,
    'inputs': [
      {
        'name': 'date',
        'type': 'string'
      }
    ],
    'name': 'createUnionLotto',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'inputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor'
  },
  {
    'payable': true,
    'stateMutability': 'payable',
    'type': 'fallback'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': 'date',
        'type': 'string'
      }
    ],
    'name': 'getContractAddress',
    'outputs': [
      {
        'name': '',
        'type': 'address'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getLatest',
    'outputs': [
      {
        'name': '',
        'type': 'string'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getLottos',
    'outputs': [
      {
        'name': '',
        'type': 'string[]'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'isAuthority',
    'outputs': [
      {
        'name': '',
        'type': 'bool'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }
]
export {address, ABI}
