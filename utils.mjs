const CFW_URL_DEV = 'https://he-agent.didalik.workers.dev' // {{{1

function delay (ms, result = 'OK') { // {{{1
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result), ms)
  });
}

async function doGET ( // {{{1
  path = '', 
  secret = null, 
  log = false, 
  parms = '', 
  site = CFW_URL_DEV
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

function pGET ( // {{{1
  path = '', 
  parms = '', 
  secret = null, 
  log = false, 
  site = CFW_URL_DEV
) {
  let keypair = secret ? window.StellarSdk.Keypair.fromSecret(secret)
  : window.StellarSdk.Keypair.random()
  let data = keypair.publicKey()
  let signature = keypair.sign(data)
  signature = encodeURIComponent(signature.toString('base64'))
  let parmsTail = `sk=ASK_&network=${window.StellarNetwork.id}&${data}=${signature}`
  parms = parms.length == 0 ? `?${parmsTail}` : parms + `&${parmsTail}`
  log && console.log('pGET parms', parms)

  return fetch(`${site}${path}${parms}`, { method: 'GET', })
    .then(async response => {
      if (response.ok) {
        return response.text();
      }
      let text
      try {
        text = await response.text()
      } catch(e) {
        console.error(e)
        throw new Error(response.status)
      }
      console.error('-', response.status, text)
    });
}

let timestamps = {} // function timestamp (label = 'default') {{{1
function timestamp (label = 'default') {
  let ts = Date.now()       // Usage:
  if (!timestamps[label]) { //   timestamp('sink1')
    timestamps[label] = ts  //   ...
    return ts;              //   if (timestamp('sink1') < 3000) ...
  }
  return ts - timestamps[label];
}

export { CFW_URL_DEV, delay, doGET, pGET, timestamp, } // {{{1
