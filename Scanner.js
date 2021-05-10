// Some functions of hash.js will be used
const hs = require("./hash");


function scan_history(file_path, API_Key){

    /*
     * Purpose: This function is used to check whether the file is already scanned with the help of hash calculation, if results are 
     * not found then this function will call uploading_file function.
     * Input: In this function file path and your API Key are used as input parameter.
     * Output: If this file is previously scanned results will be provided as output or else we will call the uploading_file function.
     */


    //Using hash.js hash_calculator_sha1 function in order to calculate the hash value of the file content.
    var hashid = hs.hash_calculator_sha1(file_path);
    
    


    var http = require("https");

    var options = {
    "method": "GET",
    "hostname": "api.metadefender.com",
    "path":
        `/v4/hash/${hashid}`,
    "headers": {
        "apikey": API_Key
    }
    };
    
    var req = http.request(options, function (res) {
    var chunks = [];
    
    res.on("data", function (chunk) {
        chunks.push(chunk);
    });
    
    res.on("end", function () {
        var body = Buffer.concat(chunks);
        
        if (body.toString().split('"')[1]==='error'){
            uploading_file(file_path, API_Key)
        }
        else{

            let file_name = file_path.split("\\")
            let len = file_name.length-1

            console.log("Results From Previously Scanned File")
            console.log("------------------------------------")

            console.log("File Name: " + file_name[len])

            var json_output = JSON.parse(body.toString());
            console.log("Overall_status: " + json_output['scan_results']['scan_all_result_a'])
    

             var allEngine = json_output['scan_results']['scan_details']
             console.log("All Engine Status: " + JSON.stringify(allEngine, null, 4))

        }
        

    });
    });


    req.end();



}


function uploading_file(file_path, apikey){

    /*
     * Purpose: This function is used to upload the file on the OPSWAT API, if the file is not scanned perviously.
     * Additionally, data_id will generated after uploading the file and with the help of that we will call result_by_dataid in order to get the result.
     * Input: In this function file path and your API Key are used as input parameter.
     * Output: This function will upload the file and will call result_by_dataid function.
     */

    console.log("File Uploading Started")
    var http = require("https");
    var fs = require("fs");
    const data = fs.readFileSync(file_path, 'utf8');

    var options = {
    "method": "POST",
    "hostname": "api.metadefender.com",
    "path": '/v4/file',
    "headers": {
        "apikey": apikey,
        "Content-Type": 'application/octet-stream',
    }
    };
    
    var req = http.request(options, function (res) {
    var chunks = [];
    
    res.on("data", function (chunk) {
        chunks.push(chunk);
    });
    
    res.on("end", function () {
        var body = Buffer.concat(chunks);

        var json_output = JSON.parse(body.toString());
        const data_id = json_output['data_id']
        console.log("File Uploading Completed")
        console.log("Waiting For Results")
        result_by_dataid(apikey,data_id, file_path)

        
    });

    });


    req.on('error', error => {
        console.error(error)
    })

    req.write(data);
    req.end();
}



function result_by_dataid(api_key, data_id, file_path){

    /*
     * Purpose: This function is used to geneate the result for the above uploaded file with the help of data_id.
     * Input: In this function file path, data_id and your API Key are used as input parameter.
     * Output: This function will print the result of the scan.
     */

    

    var http = require("https");
 
    var options = {
    "method": "GET",
    "hostname": 
        "api.metadefender.com"
    ,
    "path": 
        `/v4/file/${data_id}`
    ,
    "headers": {
        "apikey": api_key
    }
    };
    
    var req = http.request(options, function (res) {
    var chunks = [];
    
    res.on("data", function (chunk) {
        chunks.push(chunk);
    });
    
    res.on("end", function () {
        var body = Buffer.concat(chunks);
        //console.log(body.toString());
        var json_output = JSON.parse(body.toString());
        const scan_details = json_output['scan_results']['scan_details']
        
        if (Object.keys(scan_details).length==0){
            result_by_dataid(api_key,data_id,file_path)
        }
        else{

            let file_name = file_path.split("\\")
            let len = file_name.length-1

            console.log("Results of Newly Uploaded File")
            console.log("------------------------------")

            console.log("File Name: " + file_name[len])

            var json_output = JSON.parse(body.toString());
            console.log("Overall_status: " + json_output['scan_results']['scan_all_result_a'])
    

             var allEngine = json_output['scan_results']['scan_details']
             console.log("All Engine Status: " + JSON.stringify(allEngine, null, 4))
        }
    });
    });
    
    req.end();




}


function main(file_path,API_Key){
    //This function will check whether the file was uploaded recently or not.
    scan_history(file_path, API_Key);

}




//Calling main function with TextFile Path and API-Key as input parameters.

// PLEASE ENTER YOUR PATH AND API-KEY HERE.
path = 'C:\\Users\\Hardik\\Desktop\\OPSWAT\\Code.py'
API_Key = 'ENTER API_KEY'
main(path, API_Key)

