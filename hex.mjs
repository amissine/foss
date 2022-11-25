const hexStartingBalance = '1000000000'

function hexAssets (hex) { // {{{1
  hex.assets = [
    new window.StellarSdk.Asset('ClawableHexa', hex.issuerClawableHexa),
    new window.StellarSdk.Asset('HEXA', hex.issuerHEXA),
  ];
}

export { hexAssets, hexStartingBalance, } // {{{1

