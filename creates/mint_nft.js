const Web3 = require('web3');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const config = {
  private: process.env.PRIVATE_KEY,
  rpc: 'https://rinkeby.infura.io/v3/84653a332a3f4e70b1a46aaea97f0435',
  erc721ContractAddress: '0x25646B08D9796CedA5FB8CE0105a51820740C049',
  apiBaseUrl: 'https://api-staging.rarible.com',
};

const maker = new HDWalletProvider(config.private, config.rpc);
const web3 = new Web3(maker);

const contractAbi = JSON.parse(
  `[{ "inputs": [ { "components": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "string", "name": "uri", "type": "string" }, { "internalType": "address[]", "name": "creators", "type": "address[]" }, { "components": [ { "internalType": "address payable", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "internalType": "struct LibPart.Part[]", "name": "royalties", "type": "tuple[]" }, { "internalType": "bytes[]", "name": "signatures", "type": "bytes[]" } ], "internalType": "struct LibERC721LazyMint.Mint721Data", "name": "data", "type": "tuple" }, { "internalType": "address", "name": "to", "type": "address" } ], "name": "mintAndTransfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]`
);
const contract = new web3.eth.Contract(
  contractAbi,
  config.erc721ContractAddress
);

const getNonce = async (z, token, minter) => {
  const response = await z.request({
    method: 'GET',
    url: `${config.apiBaseUrl}/protocol/ethereum/nft/indexer/v0.1/collections/${token}/generate_token_id?minter=${minter}`,
  });
  return response.json.tokenId;
};

const buildERC721Data = async (z, bundle, nonce) => {
  const { hash } = bundle.inputData;
  // const { user_address } = bundle.authData;

  const ipfs = `/ipfs/${hash}`;
  const creators = [maker.getAddress()];
  const royalties = [];
  const signers = [
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  ];

  return [nonce, ipfs, creators, royalties, signers];
};

const mintToken = async (z, bundle, nonce) => {
  const erc721Data = await buildERC721Data(z, bundle, nonce);

  const invocation = await contract.methods.mintAndTransfer(
    erc721Data,
    maker.getAddress()
  );

  return new Promise(async (resolve, reject) => {
    await web3.eth
      .sendTransaction({
        data: invocation.encodeABI(),
        to: config.erc721ContractAddress,
        from: maker.getAddress(),
        chainId: await web3.eth.net.getId(),
        gasPrice: '5000000000',
        gas: '10000000',
      })
      .once('transactionHash', resolve)
      .once('error', reject);
  });
};

const perform = async (z, bundle) => {
  const nonce = await getNonce(
    z,
    config.erc721ContractAddress,
    maker.getAddress()
  );

  mintToken(z, bundle, nonce)
    .then(x => {
      z.console.log('Hash:', x);
      return x;
    })
    .catch(error => z.console.log('Mint error', error));
  z.console.log('Token should be minted');

  return {
    rarible_url: `https://rinkeby.rarible.com/${config.erc721ContractAddress}:${nonce}`,
  };
};

module.exports = {
  key: 'mint_nft',
  noun: 'NFT',

  display: {
    label: 'Lazy Mint NFT',
    description: 'Lazy Mint NFT metadata on Rarible.',
  },

  operation: {
    perform,
    inputFields: [
      {
        key: 'hash',
        label: 'IPFS Hash',
        required: true,
        helpText: 'IPFS Hash/CID to the NFT content.',
      },
      // {
      //   key: 'royalties',
      //   label: 'Royalties',
      //   required: false,
      //   helpText: 'How much would you like to take a cut of from each sale?',
      // },
    ],
    sample: {
      id: 'string',
      token: 'string',
      tokenId: 0,
      unlockable: true,
      creator: 'string',
      supply: 0,
      owners: ['string'],
      royalties: [
        {
          recipient: 'string',
          value: 0,
        },
      ],
    },
  },
};
