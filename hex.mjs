import { timestamp, } from './utils.mjs' // {{{1

let auxOrderbook = timestamp('Orderbook')

class Orderbook { // {{{1
  constructor (data) { // {{{2
    this.ts = timestamp('Orderbook')
    if (Orderbook.same(data)) { // heartbeat
      this.last = Orderbook.last
      return;
    }
    Object.assign(this, data) // {{{3
/*
    this.mp = [] // the midprice array {{{3
    let depth = Math.max(this.asks.length, this.bids.length)
    for (let i = 0; i < depth; i++) {
      let ai = +(this.asks[i]?.price ?? 0), bi = +(this.bids[i]?.price ?? 0)
      let midprice  = (ai + bi) / 2
      this.mp.push(midprice)
    }
*/
    this.p = Orderbook.last // maintain the time series depth {{{3
    Orderbook.last = this
    let q = this
    for (let i = 0; i < Orderbook.depth; i++) {
      if (!q.p) {
        return;
      }
      q = q.p
    }
    q.p = null // }}}3
  }

  line () { // {{{2
    //console.dir(this, { depth: null })

    let r = '', asks = this.asks ?? this.last.asks, bids = this.bids ?? this.last.bids
    for (let e of bids) {
      r = ' ' + (+(hexaValue(e.amount / e.price))) + '@' + (+e.price) + r
    }
    r += ' : '
    for (let e of asks) {
      r += (+e.amount) + '@' + (+e.price) + ' '
    }
    return r;
  }

  size () { // {{{2
    let asks = this.asks ?? this.last.asks, bids = this.bids ?? this.last.bids
    return bids.length + asks.length;
  }

  static depth = 3 // depth in time {{{2

  static diff (q) { // {{{2
    const adiff = (q, p) => { // amount difference for same prices
      return q.amount - p.amount;
      //return q;
    }
    const peq = (a, b) => a.price_r.n == b.price_r.n && a.price_r.d == b.price_r.d
    const notIn = (a1, a2) => a1.filter(e1 => !a2.find(e2 => peq(e1, e2)))
    const updBy = (p, q) => p.filter(ep => q.find(eq => peq(ep, eq)))
      .map(fp => adiff(q.find(eq => peq(fp, eq)), fp))
    const aru = (p, q) => {
      p = p ?? []
      //console.log(p, q)

      let [added, removed, updated] = [notIn(q, p), notIn(p, q), updBy(p, q)]
      //console.log(added, removed, updated)

      return { added, removed, updated };
    }
    let p = Orderbook.last
    let [bids, asks] = [aru(p?.bids, q.bids), aru(p?.asks, q.asks)]
    return { asks, bids };
  }

  static last = null // {{{2
  
  static lastdiff = null // {{{2

  static line (b) { // {{{2
    let r = ''
    for (let e of b.bids) {
      r = ' ' + (+(hexaValue(e.amount / e.price))) + '@' + (+e.price) + r
    }
    r += ' : '
    for (let e of b.asks) {
      r += (+e.amount) + '@' + (+e.price) + ' '
    }
    return r;
  }

  static same (data) { // {{{2
    Orderbook.lastdiff = Orderbook.diff(data)
    let ld = Orderbook.lastdiff
    const updated = a => {
      for (let e of a) {
        if (+e.amount != 0) {
          return true;
        }
      }
      return false;
    }
    if (
      !Orderbook.last ||
      ld.asks.added.length || ld.asks.removed.length || updated(ld.asks.updated) ||
      ld.bids.added.length || ld.bids.removed.length || updated(ld.bids.updated)
    ) {
      return false;
    }
    return true;
  }

  // }}}2
}

/** function dog2hexa (bigInt) // {{{1
 * Drops Of Gratitude (DOGs) are internal representation of HEXAs. 
 * 1 HEXA is 10000000 DOGs. 1 DOG is 0.0000001 HEXA.
 * A HEXA is a String, a DOG is a BigInt.
 */
function dog2hexa (bigInt) {
  const truncated  = bigInt / 10000000n
  const fractional = bigInt % 10000000n
  let zeroes
  switch (fractional.toString().length) {
    case 1:
      zeroes = '000000'
      break
    case 2:
      zeroes = '00000'
      break
    case 3:
      zeroes = '0000'
      break
    case 4:
      zeroes = '000'
      break
    case 5:
      zeroes = '00'
      break
    case 6:
      zeroes = '0'
      break
    case 7:
      zeroes = ''
  }
  return truncated.toString() + '.' + zeroes + fractional.toString();
}

function hexAssets (hex) { // {{{1
  hex.assets = [
    new window.StellarSdk.Asset('ClawableHexa', hex.issuerClawableHexa),
    new window.StellarSdk.Asset('HEXA', hex.issuerHEXA),
  ];
}

const hexStartingBalance = '1000000000' // {{{1

function hexaValue (d) { // {{{1
  d *= 10000000
  d = Math.round(d)
  return dog2hexa(BigInt(d));
}

/** function hexa2dog (str) // {{{1
 * Drops Of Gratitude (DOGs) are internal representation of HEXAs. 
 * 1 HEXA is 10000000 DOGs. 
 * A HEXA is a String, a DOG is a BigInt.
 */
function hexa2dog (str) {
  let dotIndex = str.indexOf('.')
  if (dotIndex < 0) {
    return BigInt(str) * 10000000n;
  }
  let truncated = dotIndex == 0 ? '0' : str.slice(0, dotIndex)
  let fractional = dotIndex == 0 ? '0000000' : str.slice(dotIndex + 1)
  while (fractional.length < 7) {
    fractional += '0'
  }
  return BigInt(truncated) * 10000000n + BigInt(fractional);
}

function offerCreated (xdr, kind = 'manageBuyOfferResult') { // {{{1
  let result = window.StellarSdk.xdr.TransactionResult.fromXDR(xdr, "base64")
    .result().results()

  //console.dir({ resultLength: result.length }, { depth: 1 })

  let index = result.length == 3 ? 1
  : result.length == 1 ? 0
  : undefined
  result = result[index] // 0:begin, 1:manage...Offer, 2:end
    .value()[kind]().value()
  let offersClaimed = result._attributes.offersClaimed
  let offer = result.offer().value()
  let id = offer.offerId().low
  let price_r = offer.price()._attributes

  return { offer: { id, price_r, }, offersClaimedLength: offersClaimed.length, };
}

function offerDeleted (xdr, kind = 'manageBuyOfferResult') { // {{{1
  let result = window.StellarSdk.xdr.TransactionResult.fromXDR(xdr, "base64")
    .result().results()

  //console.dir({ resultLength: result.length }, { depth: 1 })

  let index = result.length == 3 ? 1
  : result.length == 1 ? 0
  : undefined
  result = result[index] // 0:begin, 1:manage...Offer, 2:end
    .value()[kind]().value()
  let offersClaimed = result._attributes.offersClaimed
  let offer = result.offer().value()

  return {
    offersClaimed, // []
    //offer,         // undefined
  };
}

export { // {{{1
  Orderbook, dog2hexa, hexAssets, hexStartingBalance, hexaValue, hexa2dog, 
  offerCreated, offerDeleted, 
}
