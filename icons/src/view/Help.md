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

* 1、使用前请先全局 安装 [`npm i uf-node -g`](https://www.npmjs.com/package/uf-node)
* 2、如遇到权限问题 请参阅 [mac 免输sudo密码](https://www.cnblogs.com/amize/p/14540156.html) 或 以下 【mac 免输sudo密码】 教程

### mac 免输sudo密码

```shell
# 1
sudo visudo 或者 sudo vi /etc/sudoers


# 2
将%admin ALL=(ALL) ALL
替换为 %admin ALL=(ALL) NOPASSWD: ALL
```

### uf-node 控制台错误及解决办法

错误一

> Could not find expected browser (chrome) locally. Run `npm install` to download the correct Chromium revision (901912).

执行以下命令, 前提是已经npm全局安装过[ts-node](https://www.npmjs.com/package/uf-node)， 如为安装，请看使用方法1

`uf-install`