


/**
*Converting paliword folder to palidb to facilitate instant searching through entire pali texts
*/
function testReadPaliDB(){

}
function testloadPaliDB(){
    let folderpath = path.join("db","অ")
    FS.readdir(folderpath, (err, files)=>{
        files = files.filter(file => !file.endsWith("~"))
        files.sort((a,b)=> a.localeCompare(b, 'en', {numeric: true}))

        //let us test for 10 files
        let testfiles = files.slice().slice(0,10)
        loadFiles(testfiles)
    })


    function loadFiles(files){
        let reportedfiles = 0
        let docnum = 0
        let totaldocs = []

        files.forEach(file=>{
            let dbpath = path.join(folderpath, file)
            let db = getDB(dbpath)
            db.find({}, (err, docs)=>{
                docnum += docs.length
                reportedfiles++

                docs.forEach(doc=>{
                    delete doc._id
                    totaldocs.push(doc)
                })

                paliinfo.innerHTML = reportedfiles+"/"+files.length+ " docs অ: "+ docnum + "<br>"
                if(reportedfiles >= files.length){
                    paliinfo.innerHTML = "final docs অ: "+ docnum +"- "+totaldocs.length+ "<br>"

                    handleDocs(totaldocs)
                }
                //paliinfo.innerHTML += file+": "+ docs.length + "<br>"
                //console.log(docs)
            })
        })

    }
    function handleDocs(docs){
        docs.sort((a,b)=> a.word.localeCompare(b.word))
        //store them in
        let limit = 200

        let docgroups = []

        while(docs.length > 0){
            let ndocs = docs.splice(0, limit)

            let grouplabel = ndocs[0].word
            //docgroups[grouplabel] = ndocs
            let obj = {grouplabel: grouplabel, docs: ndocs}
            //obj[grouplabel] = ndocs
            docgroups.push(obj)

            let lastdocword = ndocs[ndocs.length-1].word
            let nextdocword
            if(docs.length > 0) nextdocword = docs[0].word
            //console.log(grouplabel, "=> lastdocword", lastdocword, "nextdocword ", nextdocword)

            if(docs.length == 0){
                //console.log("docgroups", Object.keys(docgroups).join(" "))
                console.log("docgroups", docgroups.length)

                handleDocgroups(docgroups)
            }

        }
    }
    function handleDocgroups(docgroups){
        let updocgroups = []
        let limit = 200

        while(docgroups.length > 0){
            let ngroups = docgroups.splice(0, limit)

            let grouplabel = ngroups[0].grouplabel
            let obj = {topgrouplabel: grouplabel, groups: ngroups}
            //obj[grouplabel] = ndocs
            updocgroups.push(obj)

            if(docgroups.length == 0){
                console.log("updocgroups", updocgroups.length)

                updocgroups.forEach(dg =>{
                    console.log(dg.topgrouplabel)
                })

                rewriteIntoFolder(updocgroups)
            }

        }
    }

    function rewriteIntoFolder(updocgroups){
        let updocgroupsfinished = 0
        for(let i=0; i<updocgroups.length; i++){
            let docgroups = updocgroups[i]

            let topgrouplabel = docgroups.topgrouplabel
            let groups = docgroups.groups

            let groupsfinished = 0

            for(let j=0; j<groups.length; j++){
                let group = groups[j]
                let grouplabel = group.grouplabel
                let docs = group.docs

                let docfinished = 0

                for(let k=0; k<docs.length; k++){
                    let doc = docs[k]
                    let dbfilepath = path.join("palidb","অ",topgrouplabel, grouplabel,doc.word)
                    let db = getDB(dbfilepath)
                    db.insert(doc, (err, newDoc)=>{
                        if(newDoc) docfinished++

                        if(docfinished >= docs.length) {
                            console.log(grouplabel, "completed")

                            groupsfinished++
                            if(groupsfinished >= groups.length){
                                console.log("-----------togrouplabel-----",topgrouplabel, "completed ------------")

                                updocgroupsfinished++
                                if(updocgroupsfinished >= updocgroups.length){
                                    console.log("all completed!")
                                }
                            }
                        }
                    })


                }

            }
        }
    }
}



function findEngWord(engtext){
    engtext = engtext.trim()
    if(engtext == null || engtext.length == 0) return

    let engmeaningdiv = document.querySelector("#engmeaning")
    let wordobj = engbndict.find(obj => {return obj.en.toLowerCase() == engtext.toLowerCase()} )

    if(wordobj != null){
        engmeaningdiv.innerHTML = engtext +" = "+ wordobj.bn+" => "+wordobj.bn_syns.join(", ")+"<br>"
    }
    else engmeaningdiv.innerHTML = ""
}
function getSelectedText(){
    if(window.getSelection){
        return window.getSelection().toString()
    }
    else if(document.selection){
        return document.selection.createRange().text
    }

    return ""
}
function loadEngBNDB(){
    const engbndbpath = path.join(__dirname,"db.json")
    FS.readFile(engbndbpath, 'utf-8', (err, data)=>{
        engbndict = JSON.parse(data)
        let loadingtime = ((performance.now()-t1)/1000).toFixed(2)
        paliinfo.innerHTML += "<br>Loading finished in "+loadingtime+" seconds"

    })

}
function handlePaliInput(inputelement){
    return function(){
        t1 = performance.now()

        let value = inputelement.value.trim()
        if(value == null || value.length == 0) return

        testProcessText(value)
    }
}


function testProcessText(bntext){
    //get first char and find the directory of siongui
    let firstchar = [...bntext][0]
    let folderpath = path.join("palidb",firstchar,"/")
    if(fileExists(folderpath)){
        FS.readdir(folderpath, (err, subfolders)=>{
            //console.log(subfolders)
            let subfolder = findFolder(subfolders, bntext)
            if(subfolder != null){
                let folderpath2 = path.join(folderpath, subfolder)
                readSubFolder(folderpath2, bntext)
            }

        })
    }
    else console.log("folder doesn't exist!")
}
function readSubFolder(folderpath, bntext){
    if(fileExists(folderpath)){
        FS.readdir(folderpath, (err, subfolders) =>{
            //console.log(subfolders)
            let subfolder = findFolder(subfolders, bntext)
            if(subfolder != null){
                let folderpath2 = path.join(folderpath, subfolder)
                readSubSubFolder(folderpath2, bntext)
            }

        })
    }
}

function readSubSubFolder(folderpath, bntext){
    if(fileExists(folderpath)){
        FS.readdir(folderpath, (err, files) =>{
            //filter files by bntext

            files = files.filter(file => file.startsWith(bntext))
            let html = ""

            let wordlist = document.getElementById("wordlist")
            wordlist.innerHTML = ""

            for(let i=0; i<files.length; i++){
                let file = files[i]

                wordlist.appendChild(getLi(i, file, folderpath))
            }
            /*
            let file = findFolder(files, bntext)
            if(file != null){
                let filepath = path.join(folderpath, file)
                readDBFile(filepath)
            }
            */


        })
    }

    function getLi(i, bnword, folderpath){
        let li = document.createElement("li")
        li.classList = "wordli"
        li.innerHTML = bnword

        li.onclick = ()=>{
            showSentences(bnword, folderpath)

        }

        return li
    }

}
function showSentences(file, folderpath){
    let dbpath = path.join(folderpath, file)
    readDBFile(dbpath)
}

function readDBFile(dbpath){
    if(fileExists(dbpath)){
        let db = loadDBNew(dbpath)
        findAllDocs(db).then(docs=>{
            handleWordDocs(docs)
        })
    }
}
function handleWordDocs(docs){
    let wordmeaning = document.getElementById("wordmeaning")
    wordmeaning.innerHTML = ""

    if(docs.length>1) {
        console.log("multiple words detected in the same doc! error!")
        console.log(docs)
    }

    else {
        let word = docs[0].word

        handleSenObjects(docs[0].sentences)

        /*
        let sentences = getSentences(docs[0].sentences)

        let html = ""
        for(let i=0; i<sentences.length; i++){
            let sentence = getSentenceWithHighlightedWord(word, sentences[i])
            html += "<li>"+sentence+"</li>"

            if(i == sentences.length-1) {
                wordmeaning.innerHTML = html
            }
        }
        */
    }
}


function handleSenObjects(senobjs){
    for(let i=0; i<senobjs.length; i++){
        let senobj = senobjs[i]
        console.log(senobj)
        let sentence = senobj.sentence
        let sendocid = senobj.sendocid
        let sendocpath = senobj.sendocpath

        //We need to fetch file_para_sen_id from sendocpath
        let prepath = "/home/android_dev/Desktop/palitipitaka02-working/"
        if(sendocpath.startsWith(".")) sendocpath = prepath + sendocpath.substring(1)
        console.log(sendocpath)

        let db = getDB(sendocpath)

        db.find({_id: sendocid}, (err, doc)=>{
            console.log(doc.sendocpath)
        })
        //We need sendpath to get
        //sentence, sendocid, sendocpath
        //let html = senobj.sentence+" => " + sen
    }
}
function getSentenceWithHighlightedWord(word, sentence){

    let index = sentence.indexOf(word)
    if(index >= 0){
        let regex = new RegExp(word,'g')
        sentence = sentence.replace(regex, "<span class='highlight'>"+word+"</span>")
    }
    return sentence
}
function getSenObjects(sentenceobjs){
    let sentences = []
    for(let i=0; i<sentenceobjs.length; i++){
        sentences.push(sentenceobjs[i].sentence)
        if(i == sentenceobjs.length-1) return sentences
    }
}
function getSentences(sentenceobjs){
    let sentences = []
    for(let i=0; i<sentenceobjs.length; i++){
        sentences.push(sentenceobjs[i].sentence)
        if(i == sentenceobjs.length-1) return sentences
    }
}

function findFolder(subfolders, bntext){
    subfolders = subfolders.filter(subfolder=> !subfolder.endsWith("~"))

    //sort them
    subfolders.sort((a,b)=>a.localeCompare(b))
    return findfilebnNew(subfolders, bntext)
}

function processTextNew(bntext){
    //get first char and find the directory of siongui
    let firstchar = [...bntext][0]
    const folderpath = path.join("siongui",firstchar,"/")
    loadFolderNew(folderpath, firstchar, bntext)
}
function loadFolderNew(folderpath, firstchar, bntext){

    FS.readdir(folderpath, (err, files)=>{
        if(err) return console.log(err)

        console.log(firstchar, bntext, files.length)
        paliinfo.innerHTML = firstchar+", "+bntext+" "+files.length

        files = files.filter(file=> !file.endsWith("~"))

        //sort them
        files.sort((a,b)=>a.localeCompare(b))
        let dbfile = findfilebnNew(files, bntext)

        const dbpath = path.join('siongui',firstchar,dbfile)
        console.log(dbpath)
        paliinfo.innerHTML = dbpath

        loadDB(dbpath, bntext)
    })
}

function findfilebnNew(files, textbn){
    let prev = ""
    for(let i=0; i<files.length; i++){
        /**
         * if text is after filename, it returns 1,
         * if before filename, -1
         * if equal, 0
         *
         * ie, if -1 found, then text will be in the previous file
         * if 0 found, then text will be in current file
         */
        if(compare(textbn, files[i]) == 0){
            return files[i]
            //console.log(textbn, "in", filesbn[i])
            //break
        }
        else if(compare(textbn, files[i]) == -1){
            return prev
            //console.log(text, "in", prev)
            //break
        }
        else if(compare(textbn, files[i]) == 1 && i== files.length-1){
            return files[i]
            //console.log(textbn, "in", filesbn[i])
        }

        prev = files[i]

        //if no condition fulfilled at the end, then return null
        if(i == files.length-1) return null
    }
}
function compare(a,b){
    return a.localeCompare(b)
}
function loadDB(dbpath, bntext){
    let db

    if(previous.dbpath == dbpath){ //check previous dbpath if already opened
        db = previous.db
        getDBDocs(db, bntext)
    }
    else{
        let db = getDB(dbpath)
        previous.dbpath = dbpath //store for later check
        previous.db = db
        getDBDocs(db, bntext)
    }
}
function getDBDocs(db, bntext){
    findAllDocs(db).then(docs=>{
        replaceBN_RomanChars(bntext).then(romantext=>{
            let matcheddocs = docs.filter(doc=> doc.paliword.toLowerCase().startsWith(romantext) || doc.paliwordalt.toLowerCase().startsWith(romantext))

            let mdgroups = {}
            for(let i=0; i<=matcheddocs.length-1; i++){
                let pword = matcheddocs[i].paliword
                let doc = matcheddocs[i]

                if(Object.keys(mdgroups).includes(pword)){
                    mdgroups[pword].push(doc)
                }
                else{
                    mdgroups[pword] = [doc]
                }

                if(i == matcheddocs.length-1){
                    handleMatchedDocs(mdgroups)
                }
            }
        })

    })
}

function findAllDocs(db){
    return new Promise((resolve, reject)=>{
        db.find({}, function(err, docs){
            if(err) reject(err)
            resolve(docs)
         })
    })
}


function replaceBN_RomanChars(bntext){

    let bnchars = [...bntext]
    let enchars = []

    return new Promise((resolve, reject)=>{
        let i=0
        process(i)

        function process(i){
            if(i >= bnchars.length) {
                resolve(enchars.join(""))
            }
            else{
                let mapobj = getCharObj(bnchars[i])

                //if no replacement char found, handle it here
                if(mapobj == null) {
                    //replace special signs and punctuation marks here
                    if(bnchars[i] == "।") enchars.push(".")

                    else {
                        //skip hasanta,
                        if(!isHasanta(i)){
                            enchars.push(bnchars[i]) //so that punctuation marks remain the same
                        }
                    }
                }

                //a replacement char found, handle it
                else{
                    handleReplaceObj(i, mapobj)
                }

                i++
                process(i)
            }

        }
    })


    function handleReplaceObj(i, mapobj){
        if(mapobj.bn == "ব")replaceBtoV(i)
        else enchars.push(mapobj.en)

        if(mapobj.type == "consonant"){
            if(mapobj.bn == "ং") return
            // Check the next char,
            addAAfterConsonant(i)

        }
    }
    /**
     * Before using this function,
     * be sure that prev char is a consonant type!
    */
    function addAAfterConsonant(i){
        //if it is last char and it is consonant, then add a
        if(i == bnchars.length-1) addA()

        //that means there are next chars!
        else{
            //check if next char is within the alphabet range!
            let nextcharobj = getCharObj(bnchars[i+1])
            if(nextcharobj != null){
                if(nextcharobj.type != "vsign") addA()
            }

            //else next char may be a space, comma, fullstop, hyphen,
            //dash, semicolon, colon, questionmark, arithmetic signs etc
            //so simply add an a

            else if(bnchars[i+1] === "্") return
            else addA()
        }

    }
    function replaceBtoV(i){
        if(i-1 >= 0 && bnchars[i-1] == "্"){
            if(i-2 >=0){
                if((bnchars[i-2]=="ব" || bnchars[i-2]=="ম"))enchars.push("b")
                else enchars.push("v")
            } else enchars.push("b")
        } else enchars.push("b")
    }
    function isHasanta(i){
        return bnchars[i] == "্"
    }

    function addA(){ enchars.push("a")}
}

function getCharObj(bnchar){
    return bnromanall.find(obj => obj.bn == bnchar)
}

function handleMatchedDocs(mdgroups){
    let pwords = Object.keys(mdgroups)
    let i=0
    let mdbngroups = {}

    addBnWord(i)
    function addBnWord(i){
        if(i <= pwords.length-1){

            let pword = pwords[i]

            convertToBN(pword).then(bnword=>{
                mdbngroups[bnword] = mdgroups[pword]

                i++
                addBnWord(i)
            })
        }
        else showBnWordlist(mdbngroups)
    }
}

function convertToBN(romantext){
    let bnchars = []
    let enchars = [...romantext.toLowerCase()]

    return new Promise((resolve, reject)=>{
        let i=0
        process(i)

        function process(i){
            if(i >= enchars.length) {
                resolve(bnchars.join(""))
            }
            else{
                let enchar = enchars[i]
                let mapobj = getCharObjForEN(enchar)
                //if no replacement char found, handle it here
                if(mapobj == null) {
                    //replace special signs and punctuation marks here
                    if(enchar == ".") bnchars.push("।")
                    else bnchars.push(enchars[i])
                }

                //a replacement char found, handle it
                else{
                    handleReplaceObjForEn(i, mapobj)
                }

                i++
                process(i)
            }
        }

        function handleReplaceObjForEn(i, mapobj){
            if(mapobj.type == "consonant"){
                handleForConsonantChar(i, mapobj)
            }
            else if(i == 0 && mapobj.type == "vowel")bnchars.push(mapobj.bn)
            else if(enchars[i-1] == " " && mapobj.type == "vowel")bnchars.push(mapobj.bn)
            else{
                let prevobj = getCharObjForEN(enchars[i-1])
                if(enchars[i-1] == " " && mapobj.type == "vowel")bnchars.push(mapobj.bn)
                else if (prevobj != null && prevobj.type == "vowel")bnchars.push(mapobj.bn)
                else if(enchars[i] != "a" && mapobj.type == "vowel")handleForVSigns(i, mapobj)
            }
        }

        /**
         * if char is consonant, then handle it here
         */
        function handleForConsonantChar(i, mapobj){
            if(enchars[i] == "ṃ") bnchars.push(mapobj.bn)
            //check next char
            else if(i+1 <= enchars.length-1){
                //get next char obj
                let nextobj = getCharObjForEN(enchars[i+1])
                if(nextobj != null){
                    //if next char is h, then ghosa chars will be changed
                    if(nextobj.en == "h")handleAddingHAfterConsonant(i, mapobj)
                    //if next char is ṃ, then simply push ং
                    else if(nextobj.en == "ṃ") bnchars.push(mapobj.bn)
                    //else if consonant then, add hasanta
                    else if(nextobj.type == "consonant"){
                        bnchars.push(mapobj.bn)
                        bnchars.push("্")
                    }

                    //else simply add the bn
                    else bnchars.push(mapobj.bn)
                }
                else bnchars.push(mapobj.bn)
            }
            else bnchars.push(mapobj.bn)
        }

         /**
         * if char is vowel, then handle it here
         */
        function handleForVSigns(i, mapobj){
            let obj = bnromanall.find(ob => ob.type == "vsign" && ob.en == mapobj.en)
            if(obj != null)bnchars.push(obj.bn)
        }


         /**
         * Check if present char is a consonant and next char is h
         */
        function handleAddingHAfterConsonant(i, mapobj){
            if(ghosachars.includes(enchars[i])){
                let ch = mapobj.en+"h"
                let obj = getCharObjForEN(ch)
                if(obj != null){
                    bnchars.push(obj.bn)
                    i = i+2 //increase i to skip one char

                    process(i)
                }
            }
        }
    })
}


function getCharObjForEN(enchar){
    return bnromanall.find(obj => obj.en == enchar)
}


function showBnWordlist(mdbngroups){
    let html = ""
    let bnwords = Object.keys(mdbngroups).sort()

    let wordlist = document.getElementById("wordlist")
    wordlist.innerHTML = ""

    let palioptions = document.getElementById("palioptions")
    palioptions.innerHTML = ""

    for(let i=0; i<bnwords.length; i++){
        let bnword = bnwords[i]
        let bnworddocs = mdbngroups[bnword]
        wordlist.appendChild(getLi(i, bnword, bnworddocs))
    }

    function getLi(i, bnword, bnworddocs){
        let li = document.createElement("li")
        li.classList = "wordli"
        li.innerHTML = bnword

        li.onclick = ()=>{
            showMeaning(bnworddocs)
        }

        return li
    }

    function showMeaning(bnworddocs){
        let wordmeaning = document.getElementById("wordmeaning")
        wordmeaning.innerHTML = ""

        //sort meanings by dictnames order
        function sortbydictnames(a,b){
            //a.dictid //find index in dictnames
            let adict = dictnames.find(dic => dic.id == a.dictid)
            let bdict = dictnames.find(dic => dic.id == b.dictid)
            let aindex = dictnames.indexOf(adict)
            let bindex = dictnames.indexOf(bdict)

            return aindex - bindex
        }
        bnworddocs.sort(sortbydictnames)

        for(let i=0; i<bnworddocs.length; i++){
            let li = getMeaningLi(bnworddocs[i])
            wordmeaning.appendChild(li)
        }
    }

    function getMeaningLi(bnworddoc){
        let dictid = bnworddoc.dictid
        //let dictlang = bnworddoc.dictlang
        let explanation = bnworddoc.explanation
        //let fuzzyspelling = bnworddoc.fuzzyspelling
        //let paliword = bnworddoc.paliword
        //let paliwordalt = bnworddoc.paliwordalt
        //let rownum = bnworddoc.rownum

        let li = document.createElement("li")
        li.classList = "meaningli"
        li.innerHTML = explanation+ "<br><b>-"+dictnames.find(dict=>dict.id == dictid).name+"</b>"
        return li
    }
}
function showProgressBar(){
    let progressbardiv = document.querySelector("#progressbar")

    addTopbar()
    addBottomBar()

    function addTopbar(){
        let topouterbar = document.createElement("div")
        topouterbar.classList = "outerbar"

        let topinnerbar = document.createElement("div")
        topinnerbar.id = "topinnerbar"
        topinnerbar.classList = "innerbar"

        let toppercentagebar = document.createElement("div")
        toppercentagebar.id = "toppercentagebar"
        toppercentagebar.classList = "percentagebar"

        topouterbar.appendChild(topinnerbar)
        topouterbar.appendChild(toppercentagebar)

        progressbardiv.appendChild(topouterbar)
    }

    function addBottomBar(){
        let outerbar = document.createElement("div")
        outerbar.classList = "outerbar"

        let innerbar = document.createElement("div")
        innerbar.id = "innerbar"
        innerbar.classList = "innerbar"

        let percentagebar = document.createElement("div")
        percentagebar.id = "percentagebar"
        percentagebar.classList = "percentagebar"

        outerbar.appendChild(innerbar)
        outerbar.appendChild(percentagebar)

        progressbardiv.appendChild(outerbar)
    }
}
function readSourceData(dbsourcepath){
    FS.readFile(dbsourcepath, 'utf-8', (err, data)=>{
        let message = "Loading Database. Please wait a few minutes..."
        paliinfo.innerHTML += message



        let dbobject = JSON.parse(data) //an obj
        rewriteNeDBFolder(dbobject)
    })
}
function rewriteNeDBFolder(dbobject){
    let subfolders = Object.keys(dbobject)
    let subfolderindex = 0
    createSubfolder(subfolderindex, subfolders, dbobject)
}



function forNeDBloading(){

    /*
    //reading stored database file
    const filepath = path.join(__dirname,'extraResources','db','siongui','অ','অকালপুপ্ফ')
    console.log(filepath)

   const db = new Datastore({filename: "b/newtest.db"})
   db.loadDatabase()

   db.find({}, (err, docs)=>{
    console.log("docs length: ", docs.length)
    let i=1
    let html = ""
    docs.forEach(doc => {
        html += "<br>"+doc.word+"<br>"
        i++

        if(i == docs.length) {
            let loadingtime = ((performance.now()-t1)/1000).toFixed(2)
            document.body.innerHTML += "<br>Loading finished in "+loadingtime+" seconds"

            document.body.innerHTML += html



        }

    })

    if(err) console.log(err)

    db.insert({"word":"What is now for "+i+"?"}, (err, newDoc)=>{
        console.log(newDoc._id, "for ", newDoc.word)
        if(err)console.log(err)
    })
    */
}

function loadFolder(){
    let folderpath = path.join(__dirname,"siongui","/")
    FS.readdir(folderpath, (err, subfolders)=>{
        if(err) return console.log(err)
        console.log(subfolders.length)

        //subfolders = subfolders.filter(file=> !file.endsWith("~"))

        //sort them
        subfolders.sort((a,b)=>a.localeCompare(b))

        let subfolderindex = 0
        handleSubfolders(subfolderindex, subfolders)
    })
}












