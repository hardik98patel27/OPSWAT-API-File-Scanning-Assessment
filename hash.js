//This functions are used to calculate the hash values(SHA1, SHA256, MD5) of the given file, which can be furthur used in Scanner.js file

function hash_calculator_sha256(file_path){

    var fs = require('fs')
    var SHA = require('crypto-js/sha256');

    try{
        const data = fs.readFileSync(file_path, 'utf8');

        var zz = (SHA(data));
       
        return zz.toString().toUpperCase();
    }
    catch (e){
        console.error("File Not Found");
        process.exit()
    }

}

function hash_calculator_sha1(file_path){

    var fs = require('fs')
    var SHA = require('crypto-js/sha1');
    try{
        const data = fs.readFileSync(file_path, 'utf8');

        var zz = (SHA(data));
        return zz.toString().toUpperCase();
    }
    catch (e){
        console.error("File Not Found");
        process.exit()
    }
    

}

function hash_calculator_md5(file_path){

    var fs = require('fs')
    var md5 = require('crypto-js/md5');

    try{
        const data = fs.readFileSync(file_path, 'utf8');

        var zz = (md5(data));
        
        return zz.toString().toUpperCase();
    }
    catch (e){
        console.error("File Not Found");
        process.exit()
    }
}


module.exports={
    hash_calculator_sha256,
    hash_calculator_sha1,
    hash_calculator_md5
}

