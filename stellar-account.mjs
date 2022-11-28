import { hexAssets, } from './hex.mjs' // {{{1

class Account { // {{{1
  #opts ( // {{{2
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

  #tx (memo = null) { // {{{2
    if (!this.transaction) {
      delete this.xdr
      this.transaction = new this.sdk.TransactionBuilder(
        this.loaded, this.#opts(memo)
      )
    }
    return this.transaction;
  }

  constructor (opts = null) { // {{{2
    this.network = window.StellarNetwork
    this.sdk = window.StellarSdk
    this.server = new this.sdk.Server(this.network.url)
    Object.assign(this, opts)
  }

  begin (sponsoredId) { // {{{2
    this.#tx().addOperation(
      this.sdk.Operation.beginSponsoringFutureReserves({ sponsoredId })
    )
    return this;
  }

  create (destination, startingBalance) { // {{{2
    this.#tx().addOperation(this.sdk.Operation.createAccount({
      destination, startingBalance
    }))
    return this;
  }

  end (source) { // {{{2
    this.#tx().addOperation(
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
    .catch(e => {
      console.error('- Account.load() failed:', e, this, process?.argv, process?.env)
      throw new Error('Account.load() failed')
    })

    return this;
  }

  pay ( // {{{2
    asset,
    amount, 
    source = null,
    destination = this.network.hex.agent
  ) { 
    this.#tx().addOperation(
      source ? this.sdk.Operation.payment({ destination, asset, amount, source })
      : this.sdk.Operation.payment({ destination, asset, amount })
    )
    return this;
  }

  put (k, v = null, source = null) { // manageData {{{2
    if (v === undefined) {
      return this;
    }
    this.#tx().addOperation(this.sdk.Operation.manageData(
      source ? { name: k, value: v, source } 
      : { name: k, value: v }
    ))
    return this;
  }

  setOpts (opts) { // {{{2
    this.#tx().addOperation(this.sdk.Operation.setOptions(opts))
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
      this.keypair && t.sign(this.keypair)
    }
    return this.server.submitTransaction(t)
    .catch(e => console.error(
      e.response.data.extras ? e.response.data.extras.result_codes
      : e.response.data,
    ));
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
    this.#tx().addOperation(this.sdk.Operation.changeTrust(opts))
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

function now (deltaMs) { // {{{1
  return BigInt.asUintN(
    64, 
    Math.round((new Date(Date.now() - Date.now()%1000 + deltaMs))/1000).toString()
  );
}

export { // {{{1
  Account, User,
}
