function SM2Cipher(cipherMode) {
    this.ct = 1;
    this.p2 = null;
    this.sm3keybase = null;
    this.sm3c3 = null;
    this.key = new Array(32);
    this.keyOff = 0;
    if (typeof(cipherMode) != 'undefined') {
        this.cipherMode = cipherMode
    } else {
        this.cipherMode = SM2CipherMode.C1C3C2
    }
}
SM2Cipher.prototype = {
    getHexString(h) {
        if((h.length & 1) == 0) return h; else return "0" + h;
    },
    hex2Byte: function (n) {
      if (n > 127 || n < -128) {
        var result = 0xff & n;
        if (result>127) {
          result = 0x7f & n;
          result = 0x7f ^ result;
          return -(result+1);
        } 
        return result;
      } else {
        return n
      }
    },
    Reset: function() {
        this.sm3keybase = new SM3Digest();
        this.sm3c3 = new SM3Digest();
        // var xWords = this.p2.getX().toBigInteger().toByteArray();
        // var yWords = this.p2.getY().toBigInteger().toByteArray();
        var xWords = this.GetWords(this.p2.getX().toBigInteger().toRadix(16));
        var yWords = this.GetWords(this.p2.getY().toBigInteger().toRadix(16));
        this.sm3keybase.BlockUpdate(xWords, 0, xWords.length);
        this.sm3c3.BlockUpdate(xWords, 0, xWords.length);
        this.sm3keybase.BlockUpdate(yWords, 0, yWords.length);
        this.ct = 1;
        this.NextKey()
    },
    NextKey: function() {
        var sm3keycur = new SM3Digest(this.sm3keybase);
        sm3keycur.Update(this.hex2Byte(this.ct >> 24 & 0xff));
        sm3keycur.Update(this.hex2Byte(this.ct >> 16 & 0xff));
        sm3keycur.Update(this.hex2Byte(this.ct >> 8 & 0xff));
        sm3keycur.Update(this.hex2Byte(this.ct & 0xff));
        this.sm3keybase = sm3keycur.doFinalN();
        this.keyOff = 0;
        this.ct++
    },
    InitEncipher: function(userKey) {
        var k = null;
        var c1 = null;
        var ec = new KJUR.crypto.ECDSA({
            "curve": "sm2"
        });
        var keypair = ec.generateKeyPairHex();
        k = new BigInteger(keypair.ecprvhex, 16);
        var pubkeyHex = keypair.ecpubhex;
        c1 = ECPointFp.decodeFromHex(ec.ecparams['curve'], pubkeyHex);
        this.p2 = userKey.multiply(k);
        this.Reset();
        return c1;
    },
    EncryptBlock: function(data) {
        this.sm3c3.updateBytes(data);
        for (var i = 0; i < data.length; i++) {
            if (this.keyOff >= this.key.length) {
                this.NextKey()
            }
            data[i] ^= this.key[this.keyOff++]
        }
        // var yWords = this.GetWords(this.p2.getY().toBigInteger().toRadix(16));
        // this.sm3c3.updateBytes(yWords);
    },
    InitDecipher: function(userD, c1) {
        this.p2 = c1.multiply(userD);
        this.Reset()
    },
    DecryptBlock: function(data) {
        for (var i = 0; i < data.length; i++) {
            if (this.keyOff == this.key.length) {
                this.NextKey()
            }
            data[i] ^= this.key[this.keyOff++]
        }
        this.sm3c3.BlockUpdate(data, 0, data.length)
    },
    Dofinal: function() {
        //var yWords = this.p2.getY().toBigInteger().toByteArray();
        var yWords = this.GetWords(this.p2.getY().toBigInteger().toRadix(16));
        this.sm3c3.BlockUpdate(yWords, 0, yWords.length);
        var c3 = this.sm3c3.doFinalN();
        return c3;
        
    },
    Encrypt: function(pubKey, plaintext) {
    	
        var data = new Array(plaintext.length);
        Array.Copy(plaintext, 0, data, 0, plaintext.length);
        var c1 = this.InitEncipher(pubKey);
        this.EncryptBlock(data);
        var c3 = this.Dofinal();
        
        var hexString;
        switch(this.cipherMode) {
            case SM2CipherMode.C1C3C2:
            hexString = this.getHexString(c1.getX().toBigInteger().toRadix(16)) + this.getHexString(c1.getY().toBigInteger().toRadix(16)) 
            + this.byte2hex(c3) + this.GetHex(data).toString();
            console.log(this.GetHex(data).toString());
            console.log(this.byte2hex(c3));
            //hexString = this.getHexString(c1.getX().toBigInteger().toRadix(16)) + this.getHexString(c1.getY().toBigInteger().toRadix(16)) + this.GetHex(c3).toString() + this.GetHex(data).toString();
            //hexString = this.getHexString(c1.getX().toBigInteger().toRadix(16)) + this.getHexString(c1.getY().toBigInteger().toRadix(16)) + this.GetHex(c3).toString() + this.GetHex(data).toString();
          break;
          case SM2CipherMode.C1C2C3:
            hexString = c1.getX().toBigInteger().toRadix(16) + c1.getY().toBigInteger().toRadix(16) + this.GetHex(data).toString() + this.GetHex(c3).toString();
          break;
          default:
          throw new Error("[SM2:Decrypt]invalid type cipherMode("+ this.cipherMode +")");
        }
        this.Reset()
        return hexString
    },
    byte2hex: function (src) {
        var result = "";
        for (var i=0; i<src.length; i++) {
            var unitInt = src[i] & 0xFF;
            var unitHex = (unitInt).toString(16);
            if (unitHex.length < 2) {
                result += "0";
            }
            result +=unitHex;
        }
        return result;
    },
    GetWords: function(hexStr) {
        var words = [];
        var hexStrLength = hexStr.length;
        for (var i = 0; i < hexStrLength; i += 2) {
            words[words.length] = parseInt(hexStr.substr(i, 2), 16)
        }
        return words
    },
    GetHex: function(arr) {
        var words = [];
        var j = 0;
        for (var i = 0; i < arr.length * 2; i += 2) {
            words[i >>> 3] |= parseInt(arr[j]) << (24 - (i % 8) * 4);
            j++
        }
        var wordArray = new CryptoJS.lib.WordArray.init(words, arr.length);
        return wordArray
    },
    Decrypt: function(privateKey, ciphertext) {
        var hexString = ciphertext;
        var c1X = hexString.substr(0, 64);
        var c1Y = hexString.substr(0 + c1X.length, 64);
        var encrypted;
        var c3;
        switch(this.cipherMode) {
            case SM2CipherMode.C1C3C2:
            c3 = hexString.substr(c1X.length + c1Y.length, 64);
            encrypData = hexString.substr(c1X.length + c1Y.length + 64)
          break;
          case SM2CipherMode.C1C2C3:
            encrypData = hexString.substr(c1X.length + c1Y.length, hexString.length - c1X.length - c1Y.length - 64);
            c3 = hexString.substr(hexString.length - 64);
          break;
          default:
          throw new Error("[SM2:Decrypt]invalid type cipherMode("+ this.cipherMode +")");
        }
        
        var data = this.GetWords(encrypData);
        var c1 = this.CreatePoint(c1X, c1Y);
        this.InitDecipher(privateKey, c1);
        this.DecryptBlock(data);
        var c3_ = this.DoFinal();
        
        var isDecrypt = this.GetHex(c3_).toString() == c3;
        if (isDecrypt) {
            var wordArray = this.GetHex(data);
            var decryptData = CryptoJS.enc.Utf8.stringify(wordArray);
            return decryptData
        } else {
            throw new Error("[SM2:Decrypt] C3 is not match!");
            return ''
        }
    },
    CreatePoint: function(x, y) {
        var ec = new KJUR.crypto.ECDSA({
            "curve": "sm2"
        });
        var ecc_curve = ec.ecparams['curve'];
        var pubkeyHex = '04' + x + y;
        var point = ECPointFp.decodeFromHex(ec.ecparams['curve'], pubkeyHex);
        return point
    }
};
window.SM2CipherMode = {
    C1C2C3: 0,
    C1C3C2: 1
};