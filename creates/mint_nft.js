var Web3 = require("web3");
var web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/84653a332a3f4e70b1a46aaea97f0435"
  )
);

// https://docs.rarible.com/asset/creating-an-asset#rinkeby
const contract_address = '0x25646B08D9796CedA5FB8CE0105a51820740C049';

const contractAbi = JSON.parse(`[{ "inputs": [ { "components": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "string", "name": "uri", "type": "string" }, { "internalType": "address[]", "name": "creators", "type": "address[]" }, { "components": [ { "internalType": "address payable", "name": "account", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "internalType": "struct LibPart.Part[]", "name": "royalties", "type": "tuple[]" }, { "internalType": "bytes[]", "name": "signatures", "type": "bytes[]" } ], "internalType": "struct LibERC721LazyMint.Mint721Data", "name": "data", "type": "tuple" }, { "internalType": "address", "name": "to", "type": "address" } ], "name": "mintAndTransfer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]`);

const buildERC721Data = async (bundle) => {
  const { cid, token_id } = bundle.inputData;
  const { user_address } = bundle.authData;

  const ipfs = `/ipfs/${cid}`;
  const creators = [user_address];
  const royalties = [];
  const signers = ['0x'];

  return [
    token_id,
    ipfs,
    creators,
    royalties,
    signers
  ];
};

const mintToken = async (contract, mint721Data, addressTo) => {
  const invocation = await contract.methods.mintAndTransfer(mint721Data, addressTo);
  return new Promise(async (resolve, reject) => {
			web3.eth.sendTransaction({
					data: invocation.encodeABI(),
					to: contract_address,
					from: addressTo,
					chainId: await web3.eth.net.getId(),
					gasPrice: "5000000000",
					gas: "10000000"
			})
			.once("transactionHash", resolve)
			.once("error", reject)
  });
};

const perform = async (z, bundle) => {
  const { user_address } = bundle.authData;
  const contract = await new web3.eth.Contract(contractAbi, contract_address)

  const erc721Data = await buildERC721Data(bundle);
  await mintToken(contract, erc721Data, user_address);
  z.console.log('Token should be minted');

  return {
    'rarible_url': `https://rinkeby.rarible.com/${contract_address}:${bundle.inputData.token_id}`
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
        key: 'cid',
        label: 'IPFS CID',
        required: true,
        helpText: 'IPFS CID to the NFT content from the Add Metadata Step',
      },
      {
        key: 'token_id',
        label: 'Token ID',
        required: true,
        helpText: 'Token ID from the Add Metadata Step',
      },
      {
        key: 'royalties',
        label: 'Royalties',
        required: false,
        helpText: 'How much would you like to take a cut of from each sale?',
      },
    ],
    sample: {
      id: "string",
      token: "string",
      tokenId: 0,
      unlockable: true,
      creator: "string",
      supply: 0,
      owners: [
        "string"
      ],
      royalties: [
        {
          recipient: "string",
          value: 0
        }
      ]
    },
  },
};
