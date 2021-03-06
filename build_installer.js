// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64", 
const APP_DIR = path.resolve(__dirname, './palisearch-win32-x64');
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer", 
const OUT_DIR = path.resolve(__dirname, './windows_installer');

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,
    appIconPath: "C:/Users/ASUS/source/mygithubrepos/projectassets/palisearch2/assets/images/search16.ico",
    // Configure metadata
    description: 'Pali Search',
    exe: 'PaliSearch',
    name: 'PaliSearch',
    manufacturer: 'Gansanta Bhikkhu',
    version: '3.2.0',

    // Configure installer User Interface
    ui: {
        chooseDirectory: true
    },

    //for admin privileges
    installPrivileges:"elevated",
    installScope:"perMachine",

});

// 4. Create a .wxs template file
msiCreator.create().then(function(){

    // Step 5: Compile the template to a .msi file
    //still not working 
    msiCreator.compile();

    //although it still requires right click and run as admin to work, otherwise
    //nedb doesn't work. so it just stops ad database loading... please wait.
    //so I don't recommend building msi in this way, unless asks for privileges
    alert("finished creating "+msiCreator.name+" msi package.")
});