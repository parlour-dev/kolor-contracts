# The Content Protocol - Contracts

This is the repo with smart contracts for The Content Protocol. It also contains comprehensive tests and deployments for the contracts.

Basic commands:

```shell
yarn hardhat test
yarn hardhat coverage

```

Additional commands:

```shell
yarn hardhat accounts
yarn hardhat compile
yarn hardhat clean
yarn hardhat node
node scripts/sample-script.js
```

The contract is presently deployed at:

```
0xa398De2fEF0b37cf50c2F9D88b8953b94b49c78C
```

The ABI is: 

```json
[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "idx",
        "type": "uint256"
      }
    ],
    "name": "ContentAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "idx",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TipReceived",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newHeader",
        "type": "string"
      }
    ],
    "name": "addContent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "content",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "author",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "header",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContent",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "author",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "header",
            "type": "string"
          }
        ],
        "internalType": "struct TCPData.Content[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "idx",
        "type": "uint256"
      }
    ],
    "name": "getContentBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContentLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLastContent",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "idx",
        "type": "uint256"
      }
    ],
    "name": "tipContent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "who",
        "type": "address"
      }
    ],
    "name": "tipPerson",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawBalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```