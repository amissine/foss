// Generated on Tue Nov 22 17:06:25 EST 2022

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
        agent: 'GCR7JNFQV5L3JGZ6QJP2RRJWH4KYNJSZYGS4JRY645BABA62U3XLTXIR',
        issuerClawableHexa: 'GC7H7K3VU3FSEJ4NZIKFZEYHEMUVKOASZSEGYKPH7B4EKFAISCSUCCIJ',
        issuerHEXA: 'GBCI4XH27DBIWADCQNSNTM72Y4QA73QTSQYRPWASVCQYZEQO6IYIJOQB',
      },
      name: 'TESTNET',
      passphrase: 'Test SDF Network ; September 2015',
      url: 'https://horizon-testnet.stellar.org',
    }, // }}}2
  ]
  return networks;
}

export { stellarNetworks, } // {{{1

