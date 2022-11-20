function stellarNetworks () { // {{{1
  let networks = [
    { // custom {{{2
      id: 'custom',
      hex: {
        agent: '{{ custom.network.hex.agent }}',
        issuerClawableHexa: '{{ custom.network.hex.issuerClawableHexa }}',
        issuerHEXA: '{{ custom.network.hex.issuerHEXA }}',
      },
      name: 'CUSTOM',
      passphrase: 'Test SDF Future Network ; October 2022',
      url: 'https://horizon-futurenet.stellar.org',
    },
    { // public {{{2
      id: 'public',
      hex: {
        agent: 'GCKD37IZDNMZN5ZAYDCJPSJNESQEE7UDPM6C4QU7LPIHFZVN4WPBO2EN',
        issuerClawableHexa: 'GC7BFT2ZXIQAU2GAYNODPVJV4OBFECV5L3NKO4RV5SHXFUR24M3BZNPY',
        issuerHEXA: 'GC7BFT2ZXIQAU2GAYNODPVJV4OBFECV5L3NKO4RV5SHXFUR24M3BZNPY',
      },
      name: 'PUBLIC',
      passphrase: 'Public Global Stellar Network ; September 2015',
      url: 'https://horizon.stellar.org',
    },
    { // test {{{2
      id: 'test',
      hex: {
        agent: 'GB4Q6UNLMNGQCHC3NKU2OZJBUP7KMELMUDKWNQRG2RA72GSPPBL7USVU',
        issuerClawableHexa: 'GBVH4OS7KLLY5KTHSO35NB2OUX56Y5QJUSB3BLC47Z6DNLZ4WFOEQA2R',
        issuerHEXA: 'GBVH4OS7KLLY5KTHSO35NB2OUX56Y5QJUSB3BLC47Z6DNLZ4WFOEQA2R',
      },
      name: 'TESTNET',
      passphrase: 'Test SDF Network ; September 2015',
      url: 'https://horizon-testnet.stellar.org',
    }, // }}}2
  ]
  return networks;
}

export { stellarNetworks, } // {{{1

