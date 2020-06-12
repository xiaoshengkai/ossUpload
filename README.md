# ossUpload
基于nuxt实现的一套文件上传到阿里云oss的文件系统，其简单而不简单~

<img src="http://mpv-blog.oss-cn-beijing.aliyuncs.com/1591929199730/image.png" width="800">

### 实现功能
- [x] 1.上传文件（主要是图片）
- [x] 2.上传进度条
- [x] 3.图片预览

**其中上传方式支持**
- 选择文件
- 拖拽文件
- 截图黏贴上传

### 如何使用？

#### 基本操作

**第一种**：直接点击[这里](https://github.com/xiaoshengkai/ossUpload/)clone下载

**第二种**：可以使用 [g-xsk-cli](https://www.npmjs.com/package/g-xsk-cli)：我自己写的一个拉取某个人的github项目小工具，操作如下

1.准备好node环境

2.全局安装：npm i -g g-xsk-cli

3.启动它，然后根据问题走：gxc

- 其中输入我的github用户：xiaoshengkai
- 选择 ossUpload:阿里云oss上传这个项目，下载

<img src="http://mpv-blog.oss-cn-beijing.aliyuncs.com/1591930815331/image.png" width="800">

**注意**

这里在拉取的时候网络不是很稳定的话，多试几次或者换第一种方式

**进入到项目中，加载依赖**
```
cd ossUpload

npm i
```

#### 创建配置文件oss.config.js，配置如下

主要就是阿里云oss对象存储配置

<img src="http://mpv-blog.oss-cn-beijing.aliyuncs.com/1591931902426/image.png" width="800" />

```
accessKeyId //通过阿里云控制台创建的AccessKey,
accessKeySecret //通过阿里云控制台创建的AccessSecret.
bucket // 通过控制台或PutBucket创建的bucket空间
region // bucket所在的区域， 默认oss-cn-hangzhou
```
具体看[阿里云oss配置](https://help.aliyun.com/document_detail/64097.html?spm=a2c4g.11186623.6.1291.255869fbI67Q8Q/)

#### 本地调试模式
```
npm run dev
```

#### 部署：使用pm2 挂载服务
```
安装pm2: npm i -g pm2
启动应用：npm run start

```
[具体pm2使用](https://pm2.keymetrics.io/docs/usage/quick-start/)
  
#### 后记
做这套东西的初衷是为了写博客的时候图片易于采集到，节省时间以及自己的图片也有地方放置，如有改进或者其他想法的地方可以[联系我](https://xiaoshengkai.com/)。
