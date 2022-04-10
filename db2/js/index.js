"use strict"
const Datastore = require("nedb")
const path = require("path")
const FS = require("fs")
const { createInflate } = require("zlib")
const ipcrenderer = require('electron').ipcRenderer

let bnromanall = [
    {bn:"অ", en: "a", type:"vowel"},
    {bn:"আ", en: "ā", type:"vowel"},
    {bn:"ই", en: "i", type:"vowel"},
    {bn:"ঈ", en: "ī", type:"vowel"},
    {bn:"উ", en: "u", type:"vowel"},
    {bn:"ঊ", en: "ū", type:"vowel"},
    {bn:"এ", en: "e", type:"vowel"},
    {bn:"ও", en: "o", type:"vowel"},

    {bn:"ক", en: "k", type:"consonant"},
    {bn:"খ", en: "kh", type:"consonant"},
    {bn:"গ", en: "g", type:"consonant"},
    {bn:"ঘ", en: "gh", type:"consonant"},
    {bn:"ঙ", en: "ṅ", type:"consonant"},
    {bn:"চ", en: "c", type:"consonant"},
    {bn:"ছ", en: "ch", type:"consonant"},
    {bn:"জ", en: "j", type:"consonant"},
    {bn:"ঝ", en: "jh", type:"consonant"},
    {bn:"ঞ", en: "ñ", type:"consonant"},
    {bn:"ট", en: "ṭ", type:"consonant"},
    {bn:"ঠ", en: "ṭh", type:"consonant"},
    {bn:"ড", en: "ḍ", type:"consonant"},
    {bn:"ঢ", en: "ḍh", type:"consonant"},
    {bn:"ণ", en: "ṇ", type:"consonant"},
    {bn:"ত", en: "t", type:"consonant"},
    {bn:"থ", en: "th", type:"consonant"},
    {bn:"দ", en: "d", type:"consonant"},
    {bn:"ধ", en: "dh", type:"consonant"},
    {bn:"ন", en: "n", type:"consonant"},
    {bn:"প", en: "p", type:"consonant"},
    {bn:"ফ", en: "ph", type:"consonant"},
    {bn:"ব", en: "b", type:"consonant"},
    {bn:"ভ", en: "bh", type:"consonant"},
    {bn:"ম", en: "m", type:"consonant"},
    {bn:"য", en: "y", type:"consonant"},
    {bn:"র", en: "r", type:"consonant"},
    {bn:"ল", en: "l", type:"consonant"},
    {bn:"ৰ", en: "v", type:"consonant"},
    {bn:"স", en: "s", type:"consonant"},
    {bn:"হ", en: "h", type:"consonant"},
    {bn:"ল়", en: "ḷ", type:"consonant"},
    {bn:"ং", en: "ṃ", type:"consonant"},

    {bn:"া", en: "ā", type:"vsign"},
    {bn:"ি", en: "i", type:"vsign"},
    {bn:"ী", en: "ī", type:"vsign"},
    {bn:"ু", en: "u", type:"vsign"},
    {bn:"ূ", en: "ū", type:"vsign"},
    {bn:"ে", en: "e", type:"vsign"},
    {bn:"ো", en: "o", type:"vsign"}
]
let ghosachars = ["k","g","c","j","ṭ","ḍ","t","d","p","b"]
let dictnames = [
    {id:"C", lang:"E", name: "Concise P-E Dictionary", author: "Concise Pali-English Dictionary by A.P. Buddhadatta Mahathera"},
    {id:"I", lang:"E", name: "Pali-Dictonary from VRI", author: "Pali-Dictionary Vipassana Research Institute"},
    {id:"P", lang:"E", name: "PTS P-E Dictionary", author: "PTS Pali-English dictionary The Pali Text Society's Pali-English dictionary"},
    {id:"N", lang:"E", name: "Buddhist Dictionary", author: "Buddhist Dictionary by NYANATILOKA MAHATHERA"},
    {id:"V", lang:"E", name: "Pali Proper Names Dictionary", author: "Buddhist Dictionary of Pali Proper Names by G P Malalasekera"},
    {id:"K", lang:"E", name: "Tipiṭaka Pāḷi-Myanmar Dictionary", author: "Tipiṭaka Pāḷi-Myanmar Dictionary တိပိဋက-ပါဠိျမန္မာ အဘိဓာန္"},
    {id:"B", lang:"E", name: "Pali Myanmar Dictionary", author: "Pali Word Grammar from Pali Myanmar Dictionary"},
    {id:"O", lang:"E", name: "Pali Roots Dictionary", author: "Pali Roots Dictionary ဓါတ္အဘိဓာန္"},
    {id:"R", lang:"E", name: "U Hau Sein’s Pāḷi-Myanmar Dictionary", author: "U Hau Sein’s Pāḷi-Myanmar Dictionary ပါဠိျမန္မာ အဘိဓာန္(ဦးဟုတ္စိန္)"},
    {id:"U", lang:"E", name: "Pali Viet Dictionary", author: "Pali Viet Dictionary  Bản dịch của ngài Bửu Chơn."},
    {id:"Q", lang:"E", name: "Pali Viet Vinaya Terms", author: "Pali Viet Vinaya Terms  Từ điển các thuật ngữ về luật do tỳ khưu Giác Nguyên sưu tầm."},
    {id:"E", lang:"E", name: "Pali Viet Abhi- Terms", author: "Pali Viet Abhidhamma Terms  Từ điển các thuật ngữ Vô Tỷ Pháp của ngài Tịnh Sự, được chép từ phần ghi chú thuật ngữ trong các bản dịch của ngài."},
    {id:"H", lang:"C", name: "《汉译パーリ语辞典》", author: "汉译パーリ语辞典 黃秉榮譯"},
    {id:"T", lang:"C", name: "《汉译パーリ语辞典》", author: "汉译パーリ语辞典 李瑩譯"},
    {id:"S", lang:"C", name: "《パーリ语辞典》", author: "パーリ语辞典 日本水野弘元"},
    {id:"A", lang:"C", name: "《パーリ语辞典》", author: "パーリ语辞典 增补改订 日本水野弘元"},
    {id:"J", lang:"C", name: "《パーリ语辞典-勘误表》", author: "《水野弘元-巴利语辞典-勘误表》 Bhikkhu Santagavesaka 覓寂尊者"},
    {id:"M", lang:"C", name: "《巴利语汇解》", author: "巴利语汇解&巴利新音译 玛欣德尊者"},
    {id:"D", lang:"C", name: "《巴汉词典》", author: "《巴汉词典》Mahāñāṇo Bhikkhu编著"},
    {id:"F", lang:"C", name: "《巴汉词典》", author: "《巴汉词典》明法尊者增订"},
    {id:"G", lang:"C", name: "《巴利语字汇》", author: "四念住课程开示集要巴利语字汇（葛印卡）"},
    {id:"W", lang:"C", name: "《巴英术语汇编》", author: "巴英术语汇编 《法的医疗》附 温宗堃"},
    {id:"Z", lang:"C", name: "《巴汉佛学辞汇》", author: "巴利文-汉文佛学名相辞汇 翻译：张文明"},
    {id:"X", lang:"C", name: "《巴利语入门》", author: "《巴利语入门》释性恩(Dhammajīvī)"},
]

let alldocs = {}
let t1

let engbndict
//to store dbpath and db later
let previous = {
    dbpath: null,
    db: null
}

let paliinfo, palidata, palisubfolder, palifile, palidoc, palisen, palisentence


let arr = [1,2,3,10]
let dd = arr.splice(0,2)
console.log(dd, arr.length)

window.onload = ()=>{
    t1 = performance.now()
    paliinfo = document.querySelector("#paliinfo")
    palidata = document.querySelector("#palidata")
    palisubfolder = document.querySelector("#palisubfolder")
    palifile = document.querySelector("#palifile")
    palidoc = document.querySelector("#palidoc")
    palisen = document.querySelector("#palisen")
    palisentence = document.querySelector("#palisentence")


    attachListners()
    //loadEngBNDB()


    //converting paliword folder to palidb to facilitate instant browsing
    //testloadPaliDB()
    //testReadPaliDB()

}

function attachListners(){
    document.querySelector("#startbutton").onclick = ()=>{
      let subfolderinput, fileinput, docinput
      subfolderinput = document.querySelector("#subfolderinput")
      fileinput = document.querySelector("#fileinput")
      docinput = document.querySelector("#docinput")

      let subfolderindex = 0, fileindex = 0, docindex = 0
      if(subfolderinput.value != null && subfolderinput.value.length > 0) subfolderindex = subfolderinput.value
      if(fileinput.value != null && fileinput.value.length > 0) fileindex = fileinput.value
      if(docinput.value != null && docinput.value.length > 0) docindex = docinput.value

      let ok = confirm("subfolderindex: "+subfolderindex+", fileindex: "+fileindex+", docindex: "+docindex+". Ok?")


      //add page_para_sen from palisen to paliword
      if(ok)getPaliWordFolder(subfolderindex, fileindex, docindex)

      //startUpdatingPageParaSen()
    }
}

function getPaliWordFolder(subfolderstartindex, fileindex, docindex){
  let folderpath = path.join("./db", "paliword")
  getFolderContent(folderpath).then(subfolders =>{
    let sfindex = subfolderstartindex //put startvalue here
    getPaliWordSubfolder(sfindex, subfolders, folderpath, fileindex, docindex)
  })
}
function getPaliWordSubfolder(sfindex, subfolders, folderpath, fileindex, docindex){
  if(sfindex < subfolders.length){
    let subfolder = subfolders[sfindex]
    //reset folderpath
    folderpath = path.join("./db", "paliword")
    //show some info
    palisubfolder.innerHTML = subfolder + " => " + sfindex + "/" + subfolders.length


    folderpath = path.join(folderpath, subfolder)
    getFolderContent(folderpath).then(files =>{
      console.log(subfolder+" files => "+files.length)

      let findex = fileindex //fileindex starts from 0 or any set value here, so docindex remains same.
      handlePaliFile(findex, files, folderpath, subfolder, sfindex, subfolders, docindex)
    })
  }
  else{
    console.log("subfolders completed. All completed.")
  }
}
function handlePaliFile(findex, files, folderpath, subfolder, sfindex, subfolders, docindex){
  if(findex < files.length){
    let file = files[findex]

    //show info
    palifile.innerHTML = file + " => " + findex + "/" + files.length


    let filepath = path.join(folderpath, file)
    getFileDocs(filepath).then(docs=>{
      docs.sort((a,b)=>a.word.localeCompare(b.word))
      //let docindex = 0
      handleDoc(docindex, docs, file, findex, files, filepath, folderpath, subfolder, sfindex, subfolders)
    })
  }
  else{
    console.log("All files updated in folder => "+subfolder)
    console.log("go to next folder. WIll ya?")
    sfindex++
    findex = 0//reset findex
    docindex = 0 //reset docindex
    getPaliWordSubfolder(sfindex, subfolders, folderpath, findex, docindex) //sfindex, subfolders, folderpath, fileindex, docindex
  }
}
function handleDoc(docindex, docs, file, findex, files, filepath, folderpath,  subfolder, sfindex, subfolders){
  let senobjs

  if(docindex < docs.length){
   //for every doc, find senobjs
    let paliworddoc = docs[docindex]

    //show info
    palidoc.innerHTML = paliworddoc.word + " => " + docindex + "/" + docs.length

    senobjs = paliworddoc.sentences //array of senobjs

    handleSenObjectsNew(paliworddoc, filepath, senobjs, docindex, docs, file, findex, files, folderpath,  subfolder, sfindex, subfolders)

/*
    modifySenObjs().then(promises=>{
      console.log(promises.length,"senobjs modified! simultaneously!")

        paliworddoc.sentences = senobjs

         let docid = paliworddoc._id
         delete paliworddoc._id

         let db = loadDBNew(filepath)//replace doc
          db.update({_id: docid}, paliworddoc, {}, (err, numReplaced)=>{
            if(err) {console.log(err)}
            else if(numReplaced){
              console.log("doc "+paliworddoc.word+" updated! going for next doc!")

              docindex++//then increase docindex
              handleDoc(docindex, docs, file, findex, files, filepath, folderpath, subfolder, sfindex, subfolders)//go to next doc
            }
            else {
              console.log("numReplaced is 0 for doc"+paliworddoc.word+"! What's wrong?")
              console.log("stopped at doc ",paliworddoc.word, " because numReplaced should not be 0!" )
            }
        })
    })*/
  }
  else{
    console.log(file+" finished.")
    console.log("going to next file!")
    findex++

    docindex = 0 //reset docindex
    handlePaliFile(findex, files, folderpath, subfolder,  sfindex, subfolders, docindex)//findex, files, folderpath, subfolder, sfindex, subfolders, docindex
  }
}

function handleSenObjectsNew(paliworddoc, filepath, senobjs, docindex, docs, file, findex, files, folderpath,  subfolder, sfindex, subfolders){
  //find sendocid and sendocpath
  let senobjindex = 0
  handleSenOBJ(paliworddoc, senobjindex, filepath, senobjs, docindex, docs, file, findex, files, folderpath,  subfolder,sfindex, subfolders)
}
function handleSenOBJ(paliworddoc, senobjindex, filepath, senobjs, docindex, docs, file, findex, files, folderpath,  subfolder, sfindex, subfolders){
  if(senobjindex < senobjs.length){
    let senobj = senobjs[senobjindex]
    let sendocpath = senobj.sendocpath.trim()
    let sendocid = senobj.sendocid

    //show info
    palisen.innerHTML = senobjindex + "/" + senobjs.length
    palisentence.innerHTML = senobj.sentence

    if(sendocpath.startsWith("/home/gsb")){
      sendocpath = sendocpath.replace("/home/gsb/Desktop/palitipitaka02-working-dict",".")
    }
    else if(sendocpath.startsWith("/home/android_dev")){
      sendocpath = sendocpath.replace("/home/android_dev/Desktop/palitipitaka02-working",".")
    }
    handleSenDocPath(sendocpath, sendocid).then(ppsarray=>{

      delete senobj.sendocpath
      delete senobj.sendocid

      senobj.page_para_sens = ppsarray
      senobjs[senobjindex] = senobj

      senobjindex++
      handleSenOBJ(paliworddoc, senobjindex, filepath, senobjs, docindex, docs, file, findex, files, folderpath, subfolder, sfindex, subfolders)
    })
  }
  else{
    //now replace it in paliword doc
    paliworddoc.sentences = senobjs
    let docid = paliworddoc._id
    delete paliworddoc._id

    let db = getDB(filepath)//replace doc
    db.update({_id: docid}, paliworddoc, {}, (err, numReplaced)=>{
      if(err) {console.log(err)}
      else {
          if(numReplaced){
            console.log("doc "+paliworddoc.word+" updated! going for next doc!")
            docindex++//then increase docindex
            handleDoc(docindex, docs, file, findex, files, filepath, folderpath, subfolder, sfindex, subfolders)//go to next doc
          }
          else {
            console.log("numReplaced is 0 for doc"+paliworddoc.word+"! What's wrong?")
            console.log("stopped at doc ",paliworddoc.word, " because numReplaced should not be 0!" )
          }
      }
    })
  }

}

function handleSenDocPath(dbpath, docid){
  return new Promise((resolve, reject)=>{
    getDocById(dbpath, docid).then(doc=>{
      resolve(doc.page_para_sen)
    })
    .catch(err => reject(err))
  })
}
function getDocById(dbpath, docid){
  return new Promise((resolve, reject)=>{
    if(fileExists(dbpath)){
      //let db = getDB(dbpath)
      let db = loadDBNew(dbpath)
      db.find({_id: docid}, (err, docs)=>{
        if(err) reject(err)
        else if(docs.length > 1) reject("multiple docs found with same id! Error in "+dbpath)
        else resolve(docs[0])
      })
    }
    else reject("files doesn't exist!"+ dbpath)
  })
}
function getFileDocs(filepath){
  return new Promise((resolve, reject)=>{
    if(fileExists(filepath)){
      let db = getDB(filepath)
      db.find({}, (err, docs)=>{
        resolve(docs)
      })
    }
  })
}
function getFolderContent(folderpath){
  return new Promise((resolve, reject)=>{
    if(fileExists(folderpath)){
      FS.readdir(folderpath, (err, files)=>{
        files = files.filter(file => !file.endsWith("~"))
        files.sort((a,b)=> a.localeCompare(b, 'en', {numeric: true}))

        resolve(files)
      })
    }
    else reject("folderpath: "+folderpath+" doesn't exist!")
  })
}



function loadDBNew(dbpath){
    let db

    if(previous.dbpath == dbpath){ //check previous dbpath if already opened
        db = previous.db
        return db
    }
    else{
        let db = getDB(dbpath)
        previous.dbpath = dbpath //store for later check
        previous.db = db
        return db
    }
}



function getDB(filepath){
    const db = new Datastore({filename: filepath})
    db.loadDatabase()
    return db
}



function testDB(){
    //search for siongui db folder
    let dbsourcepath = path.join("siongui", "/")

    if(fileExists(dbsourcepath)){


        let folderpath = path.join("siongui","অ", "/")
        FS.readdir(folderpath, "utf-8", (err, files)=>{
            let dbpath = path.join(folderpath, files[0])

            const db = new Datastore({filename: dbpath})
            db.loadDatabase()
            db.find({}, (err, docs)=>{
                console.log(docs.length)
                paliinfo.innerHTML = docs.length+" docs"
            })
        })

    }
    else {
        //Splashwindow will load the db. so wait silently!

    }
}

function removeProgressBar(){
    document.querySelector("#progressbar").innerHTML = ""
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
        paliinfo.innerHTML = "<br>Database loaded in "+loadingtime+" seconds"
        document.querySelector("#paliinput").disabled = false
        document.querySelector("#palidata").innerHTML = ""

        //hide progressbar
        removeProgressBar()
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
function showAlertBox(){
    alert("প্রোগ্রাম নির্মাতা: জ্ঞানশান্ত ভিক্ষু, \n Email: schakma94@gmail.com \n ধর্মদান সকল দানকে জয় করে।")
}
ipcrenderer.on("test-db", testDB)
ipcrenderer.on("show-about-alertbox", showAlertBox)
