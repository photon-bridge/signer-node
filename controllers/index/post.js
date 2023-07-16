const snarkyjs = require('snarkyjs');

const checkCelestiaDataPoint = require('../../utils/checkCelestiaDataPoint');
const stringToBigInt = require('../../utils/stringToBigInt');

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const Field = snarkyjs.Field;
const Poseidon = snarkyjs.Poseidon;
const PrivateKey = snarkyjs.PrivateKey;
const Signature = snarkyjs.Signature;

module.exports = (req, res) => {
  const data = req.body.data;
  const height = req.body.height;

  if (!data || typeof data != 'string' || !data.trim().length)
    return res.json({ success: false, error: 'bad_request' });
  
  if (!height || !Number.isInteger(height) || height < 0)
    return res.json({ success: false, error: 'bad_request' });

  checkCelestiaDataPoint({
    data,
    height
  }, (err, result) => {
    if (err) return res.json({ success: false, error: err });
    if (!result)
      return res.json({ success: false, error: 'data_not_found_on_celestia' });
    
    const dataAsANumber = stringToBigInt(data);

    if (!dataAsANumber)
      return res.json({ success: false, error: 'unknown_error' });

    const hash = Poseidon.hash(Field(dataAsANumber).toFields());
    const sign = Signature.create(PrivateKey.fromBase58(PRIVATE_KEY), hash.toFields());

    return res.json({
      success: true,
      sign: sign.toBase58()
    });
  });
};