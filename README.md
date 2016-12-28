# SM2
sm2,sm3,cryptojs,crypto,base64,rsa,aes crypt

var ec = new KJUR.crypto.ECDSA({"curve": curve});
var keypair = ec.generateKeyPairHex();

var privateKey = keypair.ecprvhex;
var publickey = keypair.ecpubhex;

privateKey: 54232d8aaa3209ee123e07c34314e50e29fbb941496f92e219eb62c5bd40d968

publickey: 044a77c33fa976ddab1d8e2ad05694f01151ed39892832947fbcb4a89199db72bc5db91b29616009f0b504459ad72f97b078cf35aebd32b6066003dd81db9a3244


var encryptData = sm2Encrypt("hello world", publickey);

encryptData: 04193e23bd85dcaae13f0a7d2abf90459710942f98f9813536019d282ed5466c81efed9573da77bf69c1c3c9e3eaff0316abe3581fab08f1897b969fe1d0dd520e7797ffaa2005daa993d9b94171137970e25bf7b5c84b7e39d3a2fd95cecdac780ea3c706a64315e6b06e8f


var decryptData = sm2Decrypt(encrypData, privateKey);

decryptData: hello world




