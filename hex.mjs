function hexAssets (hex) { // {{{1
  return [
    new window.StellarSdk.Asset('ClawableHexa', hex.issuerClawableHexa),
    new window.StellarSdk.Asset('HEXA', hex.issuerHEXA),
  ];
}

export { hexAssets, } // {{{1

