const authentication = require('./authentication');

// const newNFT = require('./triggers/new_nft');
const mintNFT = require('./creates/mint_nft');

const App = {
  version: require('./package.json').version, // eslint-disable-line global-require
  platformVersion: require('zapier-platform-core').version, // eslint-disable-line global-require

  authentication,

  beforeRequest: [],

  afterResponse: [],

  resources: {},

  triggers: {
    // [newNFT.key]: newNFT,
  },

  searches: {},

  creates: {
    [mintNFT.key]: mintNFT,
  },
};

module.exports = App;
