var b = 2;
var testbranch = "test2";
var end = "END"
var newgameselectedusers = $("#newgameselectedusers");
const { exec } = require('child_process'); //no i18n

module.exports = {
    execute : (fBranch,tBranch,pathdir)=>{
        return new Promise((resolve,reject) => {
            var fromBranch = fBranch ? fBranch : 'master'; //no i18n
            var toBranch = tBranch ? tBranch : 'Test' //no i18n
            var filesdiff = `git diff --name-only origin/${fromBranch} origin/${toBranch}`
            var singleFileDIff = `git diff --ignore-blank-lines -b -w -U origin/${fromBranch} origin/${toBranch} --`
            if(!pathdir){
                pathdir = "/Users/mari-pt6431/Desktop/gitFiles/project1"
                // pathdir = `C:\\Users\\test\\audit tool\\gitCrmRepo\\zohocrm` 
                // pathdir = "/Users/naveen-6833/Documents/ZohoCrmRepo/zohocrm" //no i18n
            }
            //check helper
            var ignoreList = [
                // '[$][(]',
                // 'networkUtils.makeRequest', //no i18n
                // 'networkUtils.lyteInitiateRequest', //no i18n
                // 'crmRequestPool', //no i18n
                // 'crmui.showMsgBand', //no i18n
                // 'lyte-dropdown', //no i18n
                // 'crmui.showTooltip' //no i18n
            ]
            var restrcitedFiles = [
                "footer.jsp", //no i18n
                "initial-js-files.json", //no i18n
                "inital-css-files.json" //no i18n
            ]
            var ignoreFilesTobeChecked = [
                '.java', //no i18n
                '.css', //no i18n
                '.xml', //no i18n
                '.properties', //no i18n
                '.less', //no i18n
                '.txt', //no i18n
                '.svg', //no i18n
                '.eot', //no i18n
                '.woff' //no i18n
            ]
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
                        }else{
                            let flag = 0
                            ignoreFilesTobeChecked.forEach((ext)=>{
                                if(item.indexOf(ext) > 0){
                                    flag = 1;
                                    return;
                                }
                            })
                            if(flag == 1){
                                if(printEnd){
                                    printEnd = 0;
                                    writeFn(printN)
                                }
                                return;
                            }
                            exec(`cd ${pathdir} && ${singleFileDIff} ${item}`, { maxBuffer: 2e+7 }, async (error, stdout, stderr) =>{
                                var printEndInside = 0;
                                diffcode = stdout.split("\n");
                                var fileFlag = 0, fileName = files[filesIndex];
                                // var oriFile = diffcode[0].substring(diffcode[0].indexOf(" b/") + 3);
                                diffLineArray = [], k = 0, al = 0;
                                for (var j = 0; j < diffcode.length; j++) {
                                    if (diffcode[j].match("@@")) {
                                        diffcode[j] = diffcode[j].substring(0, diffcode[j].lastIndexOf("@@") + 2);
                                        linenum = diffcode[j].split(/[ ,]+/);
                                        if (linenum.length === 4) {
                                            linenum.splice(2, 0, "1");
                                            linenum.splice(4, 0, "1");
                                        } else if (linenum.length === 5) {
                                            if (linenum[2].indexOf('+') > -1) {
                                                linenum.splice(2, 0, "1");
                                            } else {
                                                linenum.splice(4, 0, "1");
                                            }
                                        }
                                        if (linenum[4] !== '0') {
                                            tmp = +linenum[2] + +linenum[4];
                                            for (var k = +linenum[3]; k < tmp; k++) {
                                                diffLineArray[al] = k;
                                                al++;
                                            }
                                        }
                                    }
                                }
                                var addline = 0;
                                diffcode.forEach((line,index)=>{
                                    if(line[0] == '+' && line[1]!='+'){
                                        line = line.slice(1);
                                        // ignoreList.forEach((ignore)=>{
                                            if(line.match('[$]')){
                                                if(!fileFlag){
                                                    printN[item] = [];
                                                    fileFlag = 1;
                                                }
                                                printN[item].push('$ is used in line no '+diffLineArray[addline]+' in '+toBranch+'/'+fileName+' :')
                                                printN[item].push(line)
                                                addline++;
                                            }
                                        // })
                                    }
                                    else if(line[0] == ' '){
                                        addline++;
                                    }
                                })
                                if(filesIndex == filesArray.length - 1){
                                    writeFn(printN)
                                }
                            })
                        }
                    })
                })
            });
            var writeFn = (arr)=>{
                // res.writeHead(200,{'Content-Type':'application/json'});
                // res.write(JSON.stringify({ message: arr}));  
                // res.end();
                resolve(arr);
            }
        })
    }
}
