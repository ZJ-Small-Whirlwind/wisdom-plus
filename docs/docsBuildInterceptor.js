const fs = require("fs")
const path = require("path")
const vitepress = require("vitepress");
const node_modules = path.resolve(__dirname,"../node_modules");
const files = [
    {id:"./.pnpm/wangeditor@4.7.12/node_modules/wangeditor/dist/wangEditor.min.js"},
    {id:"./.pnpm/@amap+amap-jsapi-loader@1.0.1/node_modules/@amap/amap-jsapi-loader/dist/index.js"},
];
files.forEach(({id})=>{
    const filePath = path.resolve(node_modules, id);
    if(fs.existsSync(filePath)){
        const oldName = 'old_'+path.basename(filePath);
        const originFilePath = path.resolve(filePath,"../",oldName);
        if(!fs.existsSync(originFilePath)){
            fs.copyFileSync(filePath,originFilePath);
        }
        const code = fs.readFileSync(originFilePath,"utf-8");
        fs.writeFileSync(filePath,`try {
            ${code}
        }catch (err) {console.error(err.message)}`)
    }
});
vitepress.build("docs").then(()=>{
    process.exit();
})
