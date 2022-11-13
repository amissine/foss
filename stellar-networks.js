function stellarNetworks () {
  return [
    {
      id: 'futurenet',
      name: 'CUSTOM',
      passphrase: 'Test SDF Future Network ; October 2022',
      url: 'https://horizon-futurenet.stellar.org',
    },
    {
      id: 'public',
      name: 'PUBLIC',
      passphrase: 'Public Global Stellar Network ; September 2015',
      url: 'https://horizon.stellar.org',
    },
    {
      id: 'test',
      name: 'TESTNET',
      passphrase: 'Test SDF Network ; September 2015',
      url: 'https://horizon-testnet.stellar.org',
    },
  ];
}

export { stellarNetworks, }
