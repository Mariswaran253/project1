var printN= {};
var ignoredFilesList;
exec(`cd ${pathdir} && git pull`, { maxBuffer: 2e+7 }, async (error, stdout, stderr) =>{
    exec(`cd ${pathdir} && ${filesdiff}`, { maxBuffer: 2e+7 }, async (error, stdout, stderr) =>{
        var files = stdout.split('\n');files.pop();
        var printEnd = 0;
        files.forEach((item,filesIndex,filesArray)=>{
            if(filesIndex == filesArray.length - 1){
                printEnd = 1;
            }
            if(restrcitedFiles.indexOf(item) > 0){
                printN[item]=["Restricted Folder"]
                if(printEnd){
                    printEnd = 0;
                    writeFn(printN);
                }
            }
        }
    });
});
