import { hexAssets, } from './hex.mjs' // {{{1
import { getClaimableBalanceId, parseHEXA, } from './utils.mjs'

class Account { // {{{1
  opts ( // {{{2
    memo,
    fee = this.sdk.BASE_FEE,
    networkPassphrase = this.sdk.Networks[this.network.name],
    timebounds = { 
      minTime: now(-10000),
      maxTime: now(+180000) // 3min TTL for a transaction
    },
    withMuxing = null
  )
  {
    return { fee, networkPassphrase, timebounds, memo, withMuxing };
  }

  tX (memo = null) { // {{{2
    if (!this.transaction) {
      delete this.xdr
      this.transaction = new this.sdk.TransactionBuilder(
        this.loaded, this.opts(memo)
      )
    }
    return this.transaction;
  }

  constructor (opts = null) { // {{{2
    this.network = window.StellarNetwork
    this.sdk = window.StellarSdk
    this.server = window.StellarHorizonServer ?? new this.sdk.Server(this.network.url)
    if (!window.StellarHorizonServer) {
      window.StellarHorizonServer = this.server // always a singleton
    }
    Object.assign(this, opts)
  }

  begin (sponsoredId) { // {{{2
    this.tX().addOperation(
      this.sdk.Operation.beginSponsoringFutureReserves({ sponsoredId })
    )
    return this;
  }

  cb (ccb, memo = null, data = []) { // create/claim Claimable Balance, manageData {{{2
    this.tX(memo).addOperation(ccb)
    for (let d of data) {
      this.tX().addOperation(d)
    }
    return this;
  }

  create (destination, startingBalance) { // {{{2
    this.tX().addOperation(this.sdk.Operation.createAccount({
      destination, startingBalance
    }))
    return this;
  }

  end (source) { // {{{2
    this.tX().addOperation(
      this.sdk.Operation.endSponsoringFutureReserves({ source })
    )
    return this;
  }

  fromXDR (xdr) { // {{{2
    return this.sdk.TransactionBuilder.fromXDR(
      xdr, this.sdk.Networks[this.network.name]
    );
  }

  async load () { // {{{2
    if (this.loaded) {
      return this;
    }
    this.loaded = await this.server.loadAccount(this.keypair.publicKey())
    //.catch(e => { throw e; }) // TODO something more meaningful

    return this;
  }

  manageBuyOffer (opts) { // {{{2
    this.tX().addOperation(this.sdk.Operation.manageBuyOffer(
      opts
    ))
    return this;
  }

  manageOffer (opts) { // {{{2
    return opts.amount ? this.manageSellOffer(opts) : this.manageBuyOffer(opts);
  }

  manageSellOffer (opts) { // {{{2
    this.tX().addOperation(this.sdk.Operation.manageSellOffer(
      opts
    ))
    return this;
  }

  merge (to) { // {{{2
    this.tX().addOperation(this.sdk.Operation.accountMerge({
      source: this.keypair.publicKey(), destination: to
    }))
    return this;
  }

  pay ( // {{{2
    asset,
    amount, 
    source = null,
    destination = this.network.hex.agent
  ) { 
    this.tX().addOperation(
      source ? this.sdk.Operation.payment({ destination, asset, amount, source })
      : this.sdk.Operation.payment({ destination, asset, amount })
    )
    return this;
  }

  put (k, v = null, source = null) { // manageData {{{2
    if (v === undefined) {
      return this;
    }
    this.tX().addOperation(this.sdk.Operation.manageData(
      source ? { name: k, value: v, source } 
      : { name: k, value: v }
    ))
    return this;
  }

  setOpts (opts) { // {{{2
    this.tX().addOperation(this.sdk.Operation.setOptions(opts))
    return this;
  }

  sign (wallet = null) { // {{{2
    return wallet ? wallet.signTransaction(
      this.toXDR(),
      {
        network: this.network.name,
        accountToSign: this.loaded.id,
      }
    ) : null; // FIXME
  }

  submit (opts = null) { // TODO complete {{{2
    let t = this.transaction // undefined OK
    delete this.transaction
    t = opts?.xdr ? this.fromXDR(opts.xdr) : t.build()
    if (opts?.keypairs) {
      t.sign(...opts.keypairs)
    } else {
      this.keypair?.canSign() && t.sign(this.keypair)
    }
    return this.server.submitTransaction(t)
    .catch(e => {
      console.error(t)
      console.error(
        e.response.data.extras ? e.response.data.extras.result_codes
        : e.response.data,
      )
    });
  }

  toXDR (keypairs = null) { // {{{2
    let t = this.transaction
    delete this.transaction
    if (keypairs === null) {
      return t.build().toXDR();
    }
    t = t.build()
    if (keypairs == undefined) {
      t.sign(this.keypair)
    } else {
      t.sign(...keypairs)
    }
    return t.toXDR();
  }

  trust (asset, limit = null, source = null) { // {{{2
    let opts = Object.assign(
      { asset }, limit ? { limit } : null, source ? { source } : null
    )
    this.tX().addOperation(this.sdk.Operation.changeTrust(opts))
    return this;
  }

  trusts (hex) { // {{{2
    let balances = this.loaded.balances
    return balances.length > 2 &&
      balances.find(
        b => b.asset_type == 'credit_alphanum12' &&
        b.asset_code == 'ClawableHexa' && b.is_clawback_enabled &&
        b.asset_issuer == hex.issuerClawableHexa
      ) &&
      balances.find(
        b => b.asset_type == 'credit_alphanum4' &&
        b.asset_code == 'HEXA' && b.asset_issuer == hex.issuerHEXA
      );
  }

  // }}}2
}

class Make { // {{{1
  constructor (opts) { // {{{2
    Object.assign(this, opts)
    this.amount ??= parseHEXA(this.description) // === ClawableHEXA ==

    // Chunk description Operations into this.data 
    if (this.validity) { // making, not retrieving an offer
      this.fee = Make.fee                       // === HEXA ==========
      this.data = chunkDescOps(this.description)
    }
  }

  checkTakes (streams, onmessage) { // {{{2
    streams.push({ 
      close: window.StellarHorizonServer.effects().forAccount(this.makerPK).stream({
        onerror:   e => console.error(e),
        onmessage,
      })
    })
  }

  invalidate () { // {{{2
    console.log('TODO invalidate', this.memo)
  }

  static fee = '0.0000100' // {{{2

  // }}}2
}

class Offer extends Make { // {{{1
  constructor (opts) { // {{{2
    super(opts)
    if (this.validity) {
      this.memo = window.StellarSdk.Memo.text(`Offer ${this.validity}`)
    }
  }

  take (opts, streams, onmessage) { // {{{2
    console.log(this, opts)
    let takerPK = opts.taker.keypair.publicKey()
    let claimants = [ // createClaimableBalance {{{3
      new window.StellarSdk.Claimant(
        this.makerPK,
        !opts.validity || opts.validity == '0' ? // seconds
          window.StellarSdk.Claimant.predicateUnconditional()
        : window.StellarSdk.Claimant.predicateBeforeRelativeTime(opts.validity)
      ),
      new window.StellarSdk.Claimant( // taker can reclaim anytime
        opts.taker.keypair.publicKey(),
        window.StellarSdk.Claimant.predicateUnconditional()
      )
    ]
    let ccb = window.StellarSdk.Operation.createClaimableBalance({ claimants,
      asset: window.StellarNetwork.hex.assets[0], 
      amount: opts.amount ?? this.amount,
    })

    // Submit the tx {{{3
    new User(opts.taker).load().then(taker => taker.cb(
      ccb, window.StellarSdk.Memo.hash(this.txId)
    ).submit()).then(txTake => {
      let balanceId = getClaimableBalanceId(txTake.result_xdr)
      console.log('take balanceId', balanceId)
      streams.push({
        close: window.StellarHorizonServer.claimableBalances().claimableBalance(balanceId).stream({
          onerror:   e => console.error(e),
          onmessage,
        })
      })
    })

    // }}}3
  }

  // }}}2
}

class Request extends Make { // {{{1
  constructor (opts) { // {{{2
    super(opts)
    if (this.validity) {
      this.memo = window.StellarSdk.Memo.text(`Request ${this.validity}`)
    }
  }

  take (opts) { // {{{2
    console.log(this, opts)
  }

  // }}}2
}

class User extends Account { // Stellar HEX User {{{1
  constructor (opts) { // {{{2
    super(opts)
  }

  add () { // trust and fund HEX assets, set user props {{{2
    let hex = this.network.hex
    hexAssets(hex)

    let amountH = this.startingBalanceH; delete this.startingBalanceH
    let amountCH = this.startingBalanceCH; delete this.startingBalanceCH
    return this.trust(hex.assets[0]).trust(hex.assets[1])
    .begin(hex.agent)
    .pay(hex.assets[0], amountCH, hex.agent, this.keypair.publicKey())
    .pay(hex.assets[1], amountH, hex.agent, this.keypair.publicKey())
    .end(hex.agent)
    .setProps();
  }

  make (or) { // Offer or Request {{{2
    or.makerPK = this.loaded.id
    const vtid = tid => or.validityTimeoutId = tid
    let hex = this.network.hex
    hexAssets(hex)

    delete this.transaction
    for (let d of or.data) {
      this.tX(or.memo).addOperation(d)
    }
    return this.pay(hex.assets[1], or.fee).submit().then(txResultBody => {
      !!or.validity && or.validity != '0' &&
        vtid(setTimeout(_ => or.invalidate(), or.validity * 1000))
    })
  }

  remove (mergeTo) { // {{{2
    let hex = window.StellarNetwork.hex
    let amountH = this.loaded.balances.filter(b =>
      b.asset_code == 'HEXA' && b.asset_issuer == hex.issuerHEXA
    )[0].balance
    let amountCH = this.loaded.balances.filter(b =>
      b.asset_code == 'ClawableHexa' && b.asset_issuer == hex.issuerClawableHexa
    )[0].balance

    return this.pay(hex.assets[0], amountCH).trust(hex.assets[0], '0').
      pay(hex.assets[1], amountH).trust(hex.assets[1], '0').
      merge(mergeTo);
  }

  setProps (props = this) { // {{{2
    for (let k of Object.getOwnPropertyNames(props)) {
      if (typeof props[k] != 'string') {
        continue;
      }
      this.put(k, props[k]).put(k)
    }
    return this;
  }

  // }}}2
}

function chunkDescOps (description, source = null) { // {{{1
  // Check description.length
  if (description.length < 1 || description.length > 2000) {
    throw `- chunkDescOps: description.length is ${description.length}`
  }

  // Chunk description Operations into ops array
  let i = 0
  let ops = []
  while (description.length > 64) {
    let chunk = description.slice(0, 64)
    description = description.slice(64)
    if (source) {
      ops.push(window.StellarSdk.Operation.manageData({ name: `data${i}`, value: chunk, source }))
      ops.push(window.StellarSdk.Operation.manageData({ name: `data${i}`, value: null, source }))
    } else {
      ops.push(window.StellarSdk.Operation.manageData({ name: `data${i}`, value: chunk, }))
      ops.push(window.StellarSdk.Operation.manageData({ name: `data${i}`, value: null, }))
    }
    i++
  }
  if (description.length > 0) {
    if (source) {
      ops.push(window.StellarSdk.Operation.manageData({ name: `data${i}`, value: description, source }))
      ops.push(window.StellarSdk.Operation.manageData({ name: `data${i}`, value: null, source }))
    } else {
      ops.push(window.StellarSdk.Operation.manageData({ name: `data${i}`, value: description, }))
      ops.push(window.StellarSdk.Operation.manageData({ name: `data${i}`, value: null, }))
    }
  }

  return ops;
}

function description (operations) { // {{{1
  let result = ''
  for (let o of operations.records) {
    if (o.type == 'manage_data' && o.value.length > 0) {
      result += Buffer.from(o.value, 'base64').toString()
    }
  }
  return result;
}

function now (deltaMs) { // {{{1
  return BigInt.asUintN(
    64, 
    Math.round((new Date(Date.now() - Date.now()%1000 + deltaMs))/1000).toString()
  );
}

export { // {{{1
  Account, Make, Offer, Request, User,
  description,
}
