# 帮助说明

> 通过node中间件服务，动态搜索[阿里图标库](https://www.iconfont.cn/), 然后点击下载至本地项目，并建立本地配置文件

### package.json 命令说明

```json5
{
    "scripts": {
        // 开发模式， 同时开启服务端
        "icons:dev": "sudo uf & vite",
        // 本地配置同步按钮， 如果存在多协同报错误就可以使用该命令
        "icons:sync": "ts-node iconsSync.ts"
    },
}
```

### 使用方法

