async function doGET ( // {{{1
  path = '', 
  secret = null, 
  log = false, 
  parms = '', 
  site = 'https://he-agent.didalik.workers.dev'
) {
  let keypair = secret ? window.StellarSdk.Keypair.fromSecret(secret)
  : window.StellarSdk.Keypair.random()
  let data = keypair.publicKey()
  let signature = keypair.sign(data)
  signature = signature.toString('base64')
  let parmsTail = `sk=ASK_&network=${window.StellarNetwork.id}&${data}=${signature}`
  parms = parms.length == 0 ? `?${parmsTail}` : parms + `&${parmsTail}`
  log && console.log('doGET parms', parms)

  let result = await fetch(`${site}${path}${parms}`, { method: 'GET', })
    .then(async response => {
      if (response.ok) {
        return await response.text();
      }
      console.error(data, parms)
      throw new Error(response.status)
    })
    .catch(e => { throw e; })

  return result;
}

export { doGET, } // {{{1
