这是我用于备份毕业设计的repo，如果有感兴趣的同学可以持续关注一下，昨晚这个毕设，应该会写一个比较完整的教程，记述我的开发经历，包括前端开发（React、ant-design组件库等）、后台代理（Node Express）、Python脚本程序、数据存储（MongoDB）等等。想要试用的同学，可以按照以下步骤搭建本地服务器。

# Get Started
## 1、克隆这个repo

使用`git clone`命令克隆这个repo到你的本机。

## 2、还原MongoDB数据库
我已经将MongoDB数据库备份到了`/MongoBak`文件夹下面，使用以下命令进行还原：

    mongorestore -h <hostname><:port> -d dbname <path>

具体还原方法请参考：[MongoDB数据恢复](http://www.runoob.com/mongodb/mongodb-mongodump-mongorestore.html)

## 3、安装依赖
在`/Project/WebProject/NodeProject`路径下使用以下命令，安装所有依赖：

    npm install

## 4、启动MongoDB服务器
在你的MongoDB路径下，输入`mongod`打开MongoDB服务器。

## 5、启动本地服务器
在`/Project/WebProject/NodeProject`路径下使用以下命令，启动本地服务器：

    node CreateServer.js

## 6、访问服务器指定网址
打开浏览器，输入`localhost:8000`，回车即可查看效果。

# Attentions

以下情况可能会导致你打开该软件失败。

## 1、MongoDB服务器端口不符

由于在软件开发过程中，我已经将MongoDB服务器地址端口硬编码成了27017（官方默认端口），所以如果你的MongoDB服务器地址端口已经被修改过，将会导致Node服务器无法访问MongoDB。

## 2、环境不全

此处环境已经默认你已经安装了Node.js（>8.0）、MongoDB，但是由于还需要运行一些Python脚本程序，所以你的机器上必须安装Python（>3.0）。

# Declarations

* 由于我也没有完整的跑过一遍上面的流程，有些方面的问题可能没有考虑到，所以无法保证一定能够成功，但是如果有问题，可以通过issues反馈给我，我会尽快帮助解决的。

* 我没有给这个repo添加开源协议，但是这个毕业设计的所有内容，允许被用于商用，也请毕设代做的淘宝（包括其他所有网购平台的商家，不单独指代淘宝）商家不要拿去贩卖，做毕设的同学不要进行抄袭。