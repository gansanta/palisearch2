"use strict"
const Datastore = require("nedb")
const path = require("path")
const FS = require("fs")

const ipcRenderer = require('electron').ipcRenderer

let alldocs = {}
let t1
let paliinfo
    

window.onload = ()=>{
    t1 = performance.now()
    let message = "ডেটাবেজ চেক হচ্ছে ..."
    paliinfo = document.querySelector("#paliinfo")
    paliinfo.innerHTML = message+"<br>"

    //search for siongui db folder
    let dbsourcepath = path.join("siongui", "/")
    
    if(fileExists(dbsourcepath)){
        let message = "ডেটাবেজ রেডি।"
        paliinfo.innerHTML = message+"<br>"

        //open index window after showing splash screen for 3 seconds
        sendOpeningIndexWindowSignalToMain()
    }
    else {
        //First time db loading.
        let message = "অপেক্ষা করুন। ডেটাবেজ প্রস্তুত করা হচ্ছে..."
        paliinfo.innerHTML = message+"<br>"

        //show progressbar
        showProgressBar()

        let dbsourcepath = path.join(__dirname,"data.db")
        //let dbsourcepath = "data.db"
        readSourceData(dbsourcepath)
    }
    
}
function sendOpeningIndexWindowSignalToMain(){
    ipcRenderer.send("close-splash-window")
        
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
function removeProgressBar(){
    document.querySelector("#progressbar").innerHTML = ""
}
function readSourceData(dbsourcepath){
    FS.readFile(dbsourcepath, 'utf-8', (err, data)=>{
        let message = "ডেটাবেজ লোড হচ্ছে। কয়েক মিনিট লাগবে ... "
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

function createSubfolder(subfolderindex, subfolders, dbobject){
    if(subfolderindex < subfolders.length){
        //get files inside subfolder
        let subfolder = subfolders[subfolderindex]
        let subfolderobj = dbobject[subfolder]

        //show subfolder progress
        let percentage = Math.trunc((subfolderindex/(subfolders.length-1))*100)
        document.querySelector("#topinnerbar").style.width = percentage+"%"
        document.querySelector("#toppercentagebar").innerHTML = percentage+"%"

        let files = Object.keys(subfolderobj)
        let fileindex = 0

        createFile(fileindex, files, subfolderobj, subfolderindex, subfolders, dbobject)

    }
    else{
        //subfolders complete, db creation complete
        console.log(subfolders.length," folders created. Db rewriting complete.")
        let loadingtime = ((performance.now()-t1)/1000).toFixed(2)
        paliinfo.innerHTML = "<br>ডেটাবেজ লোড হয়েছে। সময়: "+loadingtime+" সেকেণ্ড।"
        document.querySelector("#palidata").innerHTML = ""

        //hide progressbar
        removeProgressBar()

        sendOpeningIndexWindowSignalToMain()
    }
}

function createFile(fileindex, files, subfolderobj, subfolderindex, subfolders, dbobject){
    if(fileindex < files.length){
        let file = files[fileindex]
        let subfolder = subfolders[subfolderindex]
        let docs = subfolderobj[file]

        //show file progress
        let percentage = Math.trunc((fileindex/(files.length-1))*100)
        document.querySelector("#innerbar").style.width = percentage+"%"
        document.querySelector("#percentagebar").innerHTML = percentage+"%"

        
        rewriteDocs(docs, file,subfolder )
    }
    else{
        //no more files to rewrite in the subfolder
        

        //so start next subfolder
        subfolderindex++
        createSubfolder(subfolderindex, subfolders, dbobject)

    }

    function rewriteDocs(docs, file, subfolder){
        let folder = "siongui"
        //let filepath = path.join(__dirname, folder, subfolder, file)
        //let filepath = folder+"/"+subfolder+"/"+file
        let filepath = path.join(folder, subfolder, file)
        //console.log(filepath)
        const db = new Datastore({filename: filepath})
        db.loadDatabase()
    
        db.insert(docs, (err, newDocs)=>{
            if(err) return console.log(err)
    
            if(newDocs.length>0){
                document.querySelector("#palidata").innerHTML = newDocs.length+" docs inserted in => "+subfolder+"/"+file
                
                fileindex++
                createFile(fileindex, files, subfolderobj, subfolderindex, subfolders, dbobject)
            }
        })
    }
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

function handleSubfolders(subfolderindex, subfolders){
    if(subfolderindex < subfolders.length){

        let subfolder = subfolders[subfolderindex]

        //add as a property to alldocs
        alldocs[subfolder] = {}

        let subfolderpath = path.join(__dirname,"siongui",subfolder,"/")
        FS.readdir(subfolderpath, (err, files)=>{
            if(err) return console.log(err)
            console.log(files.length)

            files = files.filter(file=> !file.endsWith("~"))
            
            //sort them
            files.sort((a,b)=>a.localeCompare(b))

            let fileindex = 0
            handleFiles(fileindex, files, subfolder, subfolderindex, subfolders)
        })

        
    }

    else{
        //time to write data in alldocs
        FS.writeFile("data.db", JSON.stringify(alldocs), (err)=>{
            if(err) return console.log(err)

            console.log("writing data finished! I hope!")
            //console.log()

            //then you will need to read data.db next time.
        })
        
        return
    }
}

function handleFiles(fileindex, files, subfolder, subfolderindex, subfolders){
    if(fileindex < files.length){
        let file = files[fileindex]

        //add as a property to subfolder
        alldocs[subfolder][file] = []
            
        
        let filepath = path.join(__dirname,"siongui",subfolder,file)
        //console.log(filepath)

        const db = new Datastore({filename: filepath})
        db.loadDatabase()

        db.find({}, (err, docs)=>{
            console.log(subfolder,"=> ",file," => docs length: ", docs.length)

            for(let i=0; i<docs.length; i++){
                let doc = docs[i]
                delete doc._id

                // alldocs.push(doc)
                //add as a property to subfolder
                alldocs[subfolder][file].push(doc)

                if(i == docs.length-1){
                    fileindex++
                    handleFiles(fileindex, files, subfolder, subfolderindex, subfolders)
                }
            }
        })
    }
    else{
        subfolderindex++
        handleSubfolders(subfolderindex, subfolders)
    }
}

function fileExists(filepath){
    try {
        if (FS.existsSync(filepath)) {
          return true
        }
        else return false
    } catch(err) {
        console.error(err)
        return false
    }
}