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
      hex: {
        agent: 'GCKD37IZDNMZN5ZAYDCJPSJNESQEE7UDPM6C4QU7LPIHFZVN4WPBO2EN',
        issuer: 'GC7BFT2ZXIQAU2GAYNODPVJV4OBFECV5L3NKO4RV5SHXFUR24M3BZNPY',
      },
      name: 'PUBLIC',
      passphrase: 'Public Global Stellar Network ; September 2015',
      url: 'https://horizon.stellar.org',
    },
    {
      id: 'test',
      hex: {
        agent: 'GB4Q6UNLMNGQCHC3NKU2OZJBUP7KMELMUDKWNQRG2RA72GSPPBL7USVU',
        issuer: 'GBVH4OS7KLLY5KTHSO35NB2OUX56Y5QJUSB3BLC47Z6DNLZ4WFOEQA2R',
      },
      name: 'TESTNET',
      passphrase: 'Test SDF Network ; September 2015',
      url: 'https://horizon-testnet.stellar.org',
    },
  ];
}

export { stellarNetworks, }
