# 数字孪生-案例 

---

### 1. 如何使用

#### 1.1 clone 工程.


然后新开一个分支, 名称随意, 后续代码通过 `pr`合并到 master 分支.

### 1.2 安装依赖并本地运行

> 这里我们使用`pnpm`作为包管理工具, 终端执行

```bash
pnpm install
```

安装依赖, 然后运行

```bash
pnpm dev
```

打开浏览器 访问 [http://localhost:5173/](http://localhost:5173/) 即可看到三维场景.

### 2 开发说明

#### 2.1 项目技术栈

> 主要使用 Typescript + React + BabylonJS
> 其中, 二维的 UI 使用 React 开发.
> 三维相关的则使用 BabylonJS.

#### 2.2 工程目录结构

静态资源放到 `public`文件夹下
源码在 `src`文件夹下, 包含 UI + 三维场景

### 3 Roadmap

>  使用 TS + React + BabylonJS 


