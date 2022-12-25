// Generated on Fri Dec 23 14:06:27 EST 2022

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
        agent: 'GA53PUDSEQKWXQ4XE6Q4KQ465O7BUXKGP7KVICMFCY43ZEWJSOCMLBEB',
        issuerClawableHexa: 'GAUPOPIKMDMTJRD3EOMW2FXD2UKECVOWS2PGPSSGG7SZ7BYCK7ADI7AY',
        issuerHEXA: 'GDKMEV2X2IFEE4GU55OV7CXM72NJOPPSJJC6QIN2TLNGP63JKS55IEBQ',
      },
      name: 'TESTNET',
      passphrase: 'Test SDF Network ; September 2015',
      url: 'https://horizon-testnet.stellar.org',
    }, // }}}2
  ]
  return networks;
}

export { stellarNetworks, } // {{{1

