# GDUT-Information-Engineering-2024-UAV-Ground-Station

本项目是 gdut 信息工程学院大三下的前六周的课程设计的分工 3——实现一个无人机地面站

## 要求

![alt text](分工3.png)
[text](无人机.docx)

## 使用方法

###

## client

### Project setup

```
yarn install
```

#### Compiles and hot-reloads for development

```
yarn serve
```

#### Compiles and minifies for production

```
yarn build
```

#### Lints and fixes files

```
yarn lint
```

#### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## server

### 依赖安装

`npm install`

### 启动后台

`node index`或者 `npm run dev`

### 开发过程用到的模块

`serialport`、 `nodemon`、`ws`

#### nodemon

```
"scripts": {
    "dev": "nodemon index.js" //在package.json里添加这句
  },
```

### node 版本

v20.12.1
