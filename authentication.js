const test = async (z, bundle) => {
  return {status: 'ok'};
  const response = await z.request({
    method: 'GET',
    url: `http://api.rarible.com/protocol/ethereum/nft/indexer/
    v1/items`,
    disableMiddlewareErrorChecking: true,
    params: {
      token: bundle.inputData.user_address
    }
  });

  if (response.status !== 200) {
    throw new Error('Your User Address is invalid. Please try again.');
  }
  return response.json;
};

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'user_address',
      label: 'User Address',
      required: true,
      type: 'string',
      placeholder: '0x...',
      helpText:
        'Visit your user profile on [Rarible](https://rarible.com/) to copy your user token.',
    },
  ],
  test,
};
