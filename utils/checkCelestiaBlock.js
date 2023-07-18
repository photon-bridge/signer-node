const snarkyjs = require('snarkyjs');
const fetch = require('node-fetch');

module.exports = (data, callback) => {
  const height = data.height;
  const namespace = data.namespace;
  const commitment = data.commitment;
  
  if (!height || !Number.isInteger(height) || height < 0)
    return res.json({ success: false, error: 'bad_request' });

  if (!namespace || typeof namespace != 'string' || !namespace.trim().length)
    return res.json({ success: false, error: 'bad_request' });

  if (!commitment || typeof commitment != 'string' || !commitment.trim().length)
    return res.json({ success: false, error: 'bad_request' });

  fetch('http://localhost:26658', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.CELESTIA_AUTHORIZATION_KEY
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'blob.GetProof',
      params: [
        height,
        namespace,
        commitment
      ]
    })
  })
    .then(res => res.json())
    .then(res => {
      console.log(res); //print output
      if (res.error || !res.result?.length)
        return callback(null, false);

      return callback(null, true);
    })
    .catch(err => {
      console.log(err);
      callback('fetch_error')
    });
}