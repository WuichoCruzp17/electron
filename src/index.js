const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname,{
        electron:path.join(__dirname,'../node_modules','.bin','electron')
    });
}

let mainWindow
let produtWinndow
app.on('ready',()=>{
    mainWindow=  new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'views/index.html'),
        protocol:'file',
        slashes:true
    }));
    //Crea un meu atravez de un arreglo
   const mainMenu =  Menu.buildFromTemplate(templateMenu);
   Menu.setApplicationMenu(mainMenu);
   mainWindow.on('close',()=>{
        app.quit();
   });
});


function createNewProductWindow(){
    produtWinndow =  new BrowserWindow({
        width:400,
        height:330,
        title:'Add New Product'
    });
   // produtWinndow.setMenu(null);
    produtWinndow.loadURL(url.format({
        pathname: path.join(__dirname,'views/new-product.html'),
        protocol:'file',
        slashes:true
    }));
    produtWinndow.on('close',()=>{
        produtWinndow = null;
    });

}


ipcMain.on('product:new',(e, newProduct)=>{
    console.log(newProduct);
    mainWindow.webContents.send('product:new', newProduct);
    produtWinndow.close();
});

const templateMenu = [
{
    label:'File',
    submenu:[{
       label:'Nuevo Productos',
       accelerator:'Ctrl+N',
       click(){
        createNewProductWindow()
       },
       
    },
    {
        label:'Remove All Products',
        click(){

        }
    },
    {
        label:'Exit',
        accelerator: process.platform =='darwin'?'command+Q': 'Ctrl+Q',
        click(){
            app.quit();
        }
    }]
}
];

if(process.platform == 'darwin'){
    templateMenu.unshift({
        label:app.getName()
    });
}

if(process.env.NODE_ENV != 'production'){
    templateMenu.push({
        label:'DevTools',
        submenu:[{
            label:'Show/Hide Dev Tools',
            accelerator:'Ctrl+D',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            }
        },
    {
        role:'reload'
    }
],
        
    });
}