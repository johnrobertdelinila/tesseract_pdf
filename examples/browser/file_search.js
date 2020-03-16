const path = require('path');
const fs = require('fs');
const user = 'JohnRobertDelinila';
const systemName = 'Pdfsystem.js';
const root = '/Users/' + user + '/Downloads/'+ systemName +'/';
const folder = 'Sample/';
const myPath = root + folder;

function recFindByExt(base,ext,files,result) {
    files = files || fs.readdirSync(base) 
    result = result || [] 

    files.forEach( 
        function (file) {
            var newbase = path.join(base,file)
            if ( fs.statSync(newbase).isDirectory()) {
                result = recFindByExt(newbase,ext,fs.readdirSync(newbase),result)
            }
            else {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext ) {
                    result.push(newbase)
                } 
            }
        }
    )
    return result
}

const ext_file_list = recFindByExt(myPath, 'pdf');
const output = {};
for (let i = 0; i < ext_file_list.length; i++) {
    output[i] = ext_file_list[i].replace(root, "/").trim();
}
fs.appendFile('pdf_directories.txt', JSON.stringify(output), function (err) {
  if (err) throw err;
  console.log('File is created successfully.');
});