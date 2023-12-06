import CryptoJS from "crypto-js";
export function encrypt(msgString) {
    // msgString is expected to be Utf8 encoded
    const platform=localStorage.getItem("Platform")
    var key = CryptoJS.enc.Utf8.parse(process.env[`REACT_APP_${platform}_SECRET_KEY`]);

    var iv = CryptoJS.lib.WordArray.random(16);
    var encrypted = CryptoJS.AES.encrypt(msgString, key, {
        iv: iv
    });
    return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}