/**
 * Adapted from https://developers.cloudflare.com/workers/examples/signing-requests
 */

const MAC_HEADER = 'X-Signature-Mac';
const EXPIRY_HEADER = 'X-Signature-Expiry';

export const signRequest = async <T extends Request>(req: T, secretKey: string): Promise<T> => {
  // You will need some super-secret data to use as a symmetric key.
  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(secretKey);
  const key = await crypto.subtle.importKey('raw', secretKeyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

  // Signed requests expire after one minute. Note that you could choose
  // expiration durations dynamically, depending on, for example, the path or a query
  // parameter.
  const expirationMs = 60000;
  const expiry = Date.now() + expirationMs;

  // The signature will be computed for the pathname and the expiry timestamp.
  // The two fields must be separated or padded to ensure that an attacker
  // will not be able to use the same signature for other pathname/expiry pairs.
  // The @ symbol is guaranteed not to appear in expiry, which is a (decimal)
  // number, so you can safely use it as a separator here. When combining more
  // fields, consider JSON.stringify-ing an array of the fields instead of
  // concatenating the values.
  const dataToAuthenticate = `${new URL(req.url).pathname}@${expiry}`;

  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToAuthenticate));

  // `mac` is an ArrayBuffer, so you need to make a few changes to get
  // it into a ByteString
  const baseMac = btoa(String.fromCharCode(...new Uint8Array(mac)));

  req.headers.set(MAC_HEADER, baseMac);
  req.headers.set(EXPIRY_HEADER, String(expiry));

  return req;
};

export const verifySignedRequest = async <T extends Request>(req: T, secretKey: string): Promise<true> => {
  // You will need some super-secret data to use as a symmetric key.
  const encoder = new TextEncoder();
  const secretKeyData = encoder.encode(secretKey);

  // Convert a ByteString (a string whose code units are all in the range
  // [0, 255]), to a Uint8Array. If you pass in a string with code units larger
  // than 255, their values will overflow.
  function byteStringToUint8Array(byteString: string) {
    const ui = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; ++i) {
      ui[i] = byteString.charCodeAt(i);
    }
    return ui;
  }

  const receivedExpiry = req.headers.get(EXPIRY_HEADER);
  const receivedMacBase = req.headers.get(MAC_HEADER);

  // Make sure you have the minimum necessary query parameters.
  if (!receivedExpiry || !receivedMacBase) {
    throw new Error('Missing signature header');
  }

  const key = await crypto.subtle.importKey('raw', secretKeyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);

  // Extract the query parameters we need and run the HMAC algorithm on the
  // parts of the request we are authenticating: the path and the expiration
  // timestamp. It is crucial to pad the input data, for example, by adding a symbol
  // in-between the two fields that can never occur on the right side. In this
  // case, use the @ symbol to separate the fields.
  const expiry = Number(receivedExpiry);
  const dataToAuthenticate = `${new URL(req.url).pathname}@${expiry}`;

  // The received MAC is Base64-encoded, so you have to go to some trouble to
  // get it into a buffer type that crypto.subtle.verify() can read.
  const receivedMac = byteStringToUint8Array(atob(receivedMacBase));

  // Use crypto.subtle.verify() to guard against timing attacks. Since HMACs use
  // symmetric keys, you could implement this by calling crypto.subtle.sign() and
  // then doing a string comparison -- this is insecure, as string comparisons
  // bail out on the first mismatch, which leaks information to potential
  // attackers.
  const verified = await crypto.subtle.verify('HMAC', key, receivedMac, encoder.encode(dataToAuthenticate));

  if (!verified) {
    throw new Error('Invalid MAC');
  }

  if (Date.now() > expiry) {
    throw new Error(`URL expired at ${new Date(expiry)}`);
  }

  return true;
};
