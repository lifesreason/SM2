/**
 * [SM2Encrypt description]
 * @param {[type]} data       [待加密数据]
 * @param {[type]} publickey  [公钥 hex]
 * @param {[type]} cipherMode [加密模式 C1C3C2:1, C1C2C3:0]
 * @return {[type]}           [返回加密后的数据 hex]
 */
function sm2Encrypt(data, publickey, cipherMode) {
    cipherMode = cipherMode == 0? cipherMode : 1;
    //msg = SM2.utf8tob64(msg);
    var msgData = CryptoJS.enc.Utf8.parse(data);

    var pubkeyHex = publickey;
    if (pubkeyHex.length > 64 * 2) {
        pubkeyHex = pubkeyHex.substr(pubkeyHex.length - 64 * 2);
    }

    var xHex = pubkeyHex.substr(0, 64);
    var yHex = pubkeyHex.substr(64);


    var cipher = new SM2Cipher(cipherMode);
    var userKey = cipher.CreatePoint(xHex, yHex);

    msgData = cipher.GetWords(msgData.toString());

    var encryptData = cipher.Encrypt(userKey, msgData);
    return '04'+encryptData;
}

/**
 * [SM2Decrypt sm2 解密数据]
 * @param {[type]} encrypted  [待解密数据 hex]
 * @param {[type]} privateKey [私钥 hex]
 * @param {[type]} cipherMode [加密模式 C1C3C2:1, C1C2C3:0]
 * @return {[type]}           [返回解密后的数据]
 */

function sm2Decrypt(encrypted, privateKey, cipherMode) {
    cipherMode = cipherMode == 0? cipherMode : 1;
    encrypted = encrypted.substr(2);
    //privateKey = b64tohex(privateKey);
    var privKey = new BigInteger(privateKey, 16);
    var cipher = new SM2Cipher(cipherMode);
    var decryptData = cipher.Decrypt(privKey, encrypted);
    return decryptData;
}

/**
 * [certCrypt 证书加密]
 * @param  {[type]} data       [加密数据]
 * @param  {[type]} certData   [证书 base64]
 * @param  {[type]} cipherMode [加密模式 C1C3C2:1, C1C2C3:0]
 * @return {[type]}            [返回加密后的数据 hex]
 */
function sm2CertCrypt(data, certData, cipherMode) {
  cipherMode = cipherMode == 0? cipherMode : 1;
  var key = "";
  //证书数据
  if( certData != "") {
    //通过证书获取key
    key = X509.getPublicKeyFromCertPEM(certData);
  }

  var pubkey = key.replace(/\s/g,'');


  var pubkeyHex = pubkey;
  if (pubkeyHex.length > 64 * 2) {
    pubkeyHex = pubkeyHex.substr(pubkeyHex.length - 64 * 2);
  }

  var xHex = pubkeyHex.substr(0, 64);
  var yHex = pubkeyHex.substr(64);


  var cipher = new SM2Cipher(cipherMode);
  var userKey = cipher.CreatePoint(xHex, yHex);

  var msgData = CryptoJS.enc.Utf8.parse(data);
  msgData = cipher.GetWords(msgData.toString());

  var encryptData = cipher.Encrypt(userKey, msgData);
  return encryptData;
}

exports.SecureRandom = SecureRandom;
exports.rng_seed_time = rng_seed_time;

exports.BigInteger = BigInteger;
exports.RSAKey = RSAKey;
exports.ECDSA = KJUR.crypto.ECDSA;
exports.DSA = KJUR.crypto.DSA;
exports.Signature = KJUR.crypto.Signature;
exports.MessageDigest = KJUR.crypto.MessageDigest;
exports.Mac = KJUR.crypto.Mac;
exports.Cipher = KJUR.crypto.Cipher;
exports.KEYUTIL = KEYUTIL;
exports.ASN1HEX = ASN1HEX;
exports.X509 = X509;
exports.CryptoJS = CryptoJS;

// ext/base64.js
exports.b64tohex = b64tohex;
exports.b64toBA = b64toBA;

// base64x.js
exports.stoBA = stoBA;
exports.BAtos = BAtos;
exports.BAtohex = BAtohex;
exports.stohex = stohex;
exports.stob64 = stob64;
exports.stob64u = stob64u;
exports.b64utos = b64utos;
exports.b64tob64u = b64tob64u;
exports.b64utob64 = b64utob64;
exports.hex2b64 = hex2b64;
exports.hextob64u = hextob64u;
exports.b64utohex = b64utohex;
//exports.b64tohex = b64tohex;
exports.utf8tob64u = utf8tob64u;
exports.b64utoutf8 = b64utoutf8;
exports.utf8tob64 = utf8tob64;
exports.b64toutf8 = b64toutf8;
exports.utf8tohex = utf8tohex;
exports.hextoutf8 = hextoutf8;
exports.hextorstr = hextorstr;
exports.rstrtohex = rstrtohex;
exports.newline_toUnix = newline_toUnix;
exports.newline_toDos = newline_toDos;
exports.intarystrtohex = intarystrtohex;
exports.strdiffidx = strdiffidx;
exports.hextob64 = hextob64;
exports.hextob64nl = hextob64nl;
exports.b64nltohex = b64nltohex;
exports.hextoArrayBuffer = hextoArrayBuffer;
exports.ArrayBuffertohex = ArrayBuffertohex;

// name spaces
exports.KJUR = KJUR;
exports.crypto = KJUR.crypto;
exports.asn1 = KJUR.asn1;
exports.jws = KJUR.jws;
exports.lang = KJUR.lang;
exports.SM2Cipher = SM2Cipher;
exports.sm2Encrypt = sm2Encrypt;
exports.sm2Decrypt = sm2Decrypt;
exports.sm2CertCrypt = sm2CertCrypt;

