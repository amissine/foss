class Orderbook { // {{{1
  constructor (data) { // {{{2
    this.ts = Date.now()
    if (Orderbook.same(data)) { // heartbeat
      debug && console.log(this.ts - Orderbook.last.ts)
      return;
    }
    Object.assign(this, data) // {{{3

    this.mp = [] // the midprice array {{{3
    let depth = Math.max(this.asks.length, this.bids.length)
    for (let i = 0; i < depth; i++) {
      let ai = +(this.asks[i]?.price ?? 0), bi = +(this.bids[i]?.price ?? 0)
      let midprice  = (ai + bi) / 2
      this.mp.push(midprice)
    }

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

  isEmpty () { // {{{2
    return this.bids.length == 0 && this.asks.length == 0;
  }

  line () { // {{{2
    let r = ''
    for (let e of this.bids) {
      r = ' ' + (e.amount / e.price) + '@' + (+e.price) + r
    }
    r += ' - '
    for (let e of this.asks) {
      r += (+e.amount) + '@' + (+e.price) + ' '
    }
    return r;
  }

  static depth = 3 // depth in time {{{2

  static diff (q) { // {{{2
    const adiff = (q, p) => { // amount difference for same prices
      q.amount -= p.amount
      return q;
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
    r += ' - '
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

const hexStartingBalance = '1000000000'

function hexAssets (hex) { // {{{1
  hex.assets = [
    new window.StellarSdk.Asset('ClawableHexa', hex.issuerClawableHexa),
    new window.StellarSdk.Asset('HEXA', hex.issuerHEXA),
  ];
}

export { Orderbook, hexAssets, hexStartingBalance, } // {{{1

