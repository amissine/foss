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
    Object.assign(this, opts, { sdk: window.StellarSdk })
  }

  fromXDR (xdr) { // {{{2
    return this.sdk.TransactionBuilder.fromXDR(
      xdr, this.sdk.Networks[this.network.name]
    );
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

  trusts (assets) { // {{{2
    return this.loaded.balances.length > 1; // FIXME
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
  Account,
}
