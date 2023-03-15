// Generated on Wed Mar 15 09:15:20 EDT 2023

function stellarNetworks () { // {{{1
  let networks = [
    { // custom {{{2
      id: 'custom',
      hex: {
        agent: '',
        issuerClawableHexa: '',
        issuerHEXA: '',
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
        issuerHEXA: 'GC5HFEQ3XLALGFBS6WOE2Z3GFLPL366PDXCL5CWSZXHIXVVN7WIOZP5B',
      },
      name: 'PUBLIC',
      passphrase: 'Public Global Stellar Network ; September 2015',
      url: 'https://horizon.stellar.org',
    },
    { // test {{{2
      id: 'test',
      hex: {
        agent: 'GDBHKLFVOPPLR4SRPNO3S4KU5TUGGZY6QSW77D4BAYI367CZXXMQWLYB',
        issuerClawableHexa: 'GBK337NLODFRL5NGTOLQBFUNKANPU6GK2IX4DOPVXU4N4XEPJMIUMYIO',
        issuerHEXA: 'GBLICEQU2TUSCRMS6KZZ4Z6YJRLATTUVVQ5TU6KQ25TLQD5GWQPYGYZU',
      },
      name: 'TESTNET',
      passphrase: 'Test SDF Network ; September 2015',
      url: 'https://horizon-testnet.stellar.org',
    }, // }}}2
  ]
  return networks;
}

export { stellarNetworks, } // {{{1

