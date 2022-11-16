class Account { // {{{1
  constructor (opts = null) { // {{{2
    Object.assign(this, opts)
  }

  trust (asset, limit = null, source = null) { // {{{2
    let opts = Object.assign(
      { asset }, limit ? { limit } : null, source ? { source } : null
    )
  }

  trusts (assets) { // {{{2
    return this.loaded.balances.length > 1; // FIXME
  }

  // }}}2
}

export { // {{{1
  Account,
}
