const snarkyjs = require('snarkyjs');

const checkCelestiaBlock = require('../../utils/checkCelestiaBlock');
const stringToBigInt = require('../../utils/stringToBigInt');

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const Field = snarkyjs.Field;
const Poseidon = snarkyjs.Poseidon;
const PrivateKey = snarkyjs.PrivateKey;
const Signature = snarkyjs.Signature;

module.exports = (req, res) => {
  const height = req.body.height;
  const namespace = req.body.namespace;
  const commitment = req.body.commitment;
  
  if (!height || !Number.isInteger(height) || height < 0)
    return res.json({ success: false, error: 'bad_request' });

  if (!namespace || typeof namespace != 'string' || !namespace.trim().length)
    return res.json({ success: false, error: 'bad_request' });

  if (!commitment || typeof commitment != 'string' || !commitment.trim().length)
    return res.json({ success: false, error: 'bad_request' });

  checkCelestiaBlock({
    height,
    namespace,
    commitment
  }, (err, result) => {
    if (err) return res.json({ success: false, error: err });
    if (!result)
      return res.json({ success: false, error: 'commitment_not_found_on_celestia' });
    
    const commitmentAsANumber = stringToBigInt(commitment);

    if (!commitmentAsANumber)
      return res.json({ success: false, error: 'unknown_error' });

    const hash = Poseidon.hash(Field(commitmentAsANumber).toFields());
    const sign = Signature.create(PrivateKey.fromBase58(PRIVATE_KEY), hash.toFields());

    return res.json({
      success: true,
      sign: sign.toBase58()
    });
  });
};