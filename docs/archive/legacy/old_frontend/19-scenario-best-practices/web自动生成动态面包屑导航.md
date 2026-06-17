## [来源](https://jzplp.github.io/2022/vue-breadcrumb.html)

## 简介
面包屑（Breadcrumb）是网页中一个常见的模块，用于显示用户在网站中当前的所处的位置，并且可以向上导航。常见的前端组件库都会包含这个组件，例如：

- [Element UI Breadcrumb 面包屑](https://element.eleme.cn/#/zh-CN/component/breadcrumb)
- [Ant Design Vue Breadcrumb 面包屑](https://www.antdv.com/components/breadcrumb-cn)

面包屑的代码：

```html
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item :to="{ path: '/' }">活动管理</el-breadcrumb-item>
  <el-breadcrumb-item :to="{ path: '/' }">活动列表</el-breadcrumb-item>
  <el-breadcrumb-item :to="{ path: '/' }">活动详情</el-breadcrumb-item>
</el-breadcrumb>
```

以上代码存在的问题: 重复性.


## 路由结构分类

树形和网状的路由结构

### 树形路由结构

#### 特点
* 每个子页面只能有一个上级页面
* 按照树的路径访问,面包屑与用户访问的路径一致;如果不按照树的路径访问,面包屑依然显示完整路径
* 面包屑是固定的，不会根据用户的访问和跳转顺序而改变。

举例几个用户的访问操作：
- 用户访问： 首页 -> A页面 -> AB页面  
    面包屑 首页 > A页面 > AB页面
- 用户访问： 首页 -> AB页面  
    面包屑 首页 > A页面 > AB页面


#### 图例
![[Pasted image 20240416170102.png]]

### 网状路由结构

#### 特点
* 路由不仅可以在上下级中跳转，而且还可以跨子树跳转
* 面包屑也能根据跳转的不同而显示不同的路径

#### 图例
![[Pasted image 20240416170629.png]]

#### 案例
- 用户访问： 首页 -> A页面 -> AB页面  
    面包屑 首页 > A页面 > AB页面
- 用户访问： 首页 -> AB页面  
    面包屑 首页 > AB页面
- 用户访问： 首页 -> B页面 -> CA页面  
    面包屑 首页 > B页面 > CA页面


## 1.嵌套路由
嵌套路由本身就是带有层级的，天然适合自动生嵌套路由。Vue Router中对嵌套路由有[文档说明](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)。
#### 方法描述
1. 按照Vue Router规范设置多级路由表，meta标签中放置面包屑名称。
2. 面包屑实现代码中使用route.matched获取多级路由，直接显示即可。

#### 优缺点
**优点**
1. 实现最简单，最方便。
2. 能够适应多种情形，无论是刷新页面还是直接访问子页面URL，都能保证面包屑的一致性。
3. 能够保存路由参数，query和定义在路由中的params都可以保存下来，上级跳转功能的体验较好。

**缺点**
1. 要求存在可以手写的路由表，使用自动生成路由的工程难以使用。例如vite-plugin-pages插件使用文件目录自动生成路由表，虽然可以自动生成嵌套路由，但是不方便设置meta。
2. 要求路由必须是清晰的树形结构，必须使用多级路由表。如果不路由结构不方便设置为树形，或者是网状结构，则不能使用此方法。

#### 案例代码
代码来自后台管理系统vue-template-admin
```vue
//Breadcrumb.vue 案例来源: 

<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }

      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>

```

对应的router配置文件
```js
//router/index.js

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index'),
        name: 'Guide',
        meta: { title: 'Guide', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]



const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
```
## 2.缓存和计算新面包屑
### 方法简介
> 使用LocalStorage存储已有的面包屑，跳转到新的页面后，对原有面包屑进行计算，展示修改后新的面包屑。

1. 进入首页时，生成初始面包屑列表。
2. 当前面包屑列表和当前页面path缓存到LocalStorage中。
3. 跳转到其他页面前，缓存到新页面时的面包屑处理方式，既现有面包屑的删除数量。
4. 跳转到新页面后，计算新面包屑：  
    判断新页面path和缓存path是否一致，如果一致则认为是刷新页面，直接使用缓存面包屑。  
    如果不一致则说明是跳转，根据缓存和处理方式生成新的面包屑，显示并重新缓存。


### 缓存中的结构(图示)
![[Pasted image 20240416110849.png]]


* breadcrumb中存放的是面包屑列表的缓存
* routerPush中是跳转使用的处理方式
	* 其中formPath指当前页面path
	* step指新页面删除面包屑的数量，0代表不删除，-1代表删除一项，-2代表删除两项。删除一般表示面包屑向上导航。

```js
// 文件路径 @/utils/breadcrumb.ts

import { getStorage, setStorage } from '@/utils/localStor'
const ModuleName = 'breadcrumb'

// 获取面包屑
export function getBreadcrumb(): Array<ANTD.Route> {
  const rou = getStorage(ModuleName) || {}
  return rou.breadcrumb || []
}

// 保存面包屑
export function setBreadcrumb(arr: Array<ANTD.Route>) {
  setStorage(ModuleName, { breadcrumb: arr })
}

// 保存当前路由跳转项
export function setRouterPush(path: string, step: number) {
  setStorage(ModuleName, {
    routerPush: {
      formPath: path,
      step,
    },
  })
}

// 获取路由跳转项
export function getRouterPush(): any {
  const rou = getStorage(ModuleName) || {}
  return rou.routerPush || {}
}

// 处理面包屑 step小于等于0
export function handleBreadcrumb(step: number): Array<ANTD.Route> {
  let arr: Array<ANTD.Route> = getBreadcrumb()
  if (!arr.length || !step) {
    return arr
  } else if (arr.length <= -step) {
    arr = []
  } else {
    arr.length = arr.length + step
  }
  return arr
}
```


```js
// File path: @/utils/breadcrumb.js

import { getStorage, setStorage } from '@/utils/localStor'

const ModuleName = 'breadcrumb'

// Get breadcrumb
export function getBreadcrumb() {
  const rou = getStorage(ModuleName) || {}
  return rou.breadcrumb || []
}

// Save breadcrumb
export function setBreadcrumb(arr) {
  setStorage(ModuleName, { breadcrumb: arr })
}

// Save current router push
export function setRouterPush(path, step) {
  setStorage(ModuleName, {
    routerPush: {
      formPath: path,
      step,
    },
  })
}

// Get router push
export function getRouterPush() {
  const rou = getStorage(ModuleName) || {}
  return rou.routerPush || {}
}

// Handle breadcrumb if step is less than or equal to 0
export function handleBreadcrumb(step) {
  let arr = getBreadcrumb()

  if (!arr.length || !step) {
    return arr
  } else if (arr.length <= -step) {
    arr = []
  } else {
    arr.length = arr.length + step
  }

  return arr
}
```









## 3.递归处理路由表

### 使用背景
> 不使用嵌套路由的场景，且路由可以设置成树形结构的场合，可以使用递归处理路由表的方式，在每个页面独立计算面包屑。

### 方法描述
>1. 在普通的路由表项中添加一个上层路由name项prevName，表示路由的上一层的name，breadcrumb表示面包屑名称。
>2. 每个页面独立处理面包屑，首先取得整个路由表和当前的路由信息。再根据当前的prevName递归查找路由表，一直找到prevName为空的路由项，即根结点。然后整个查找路径就组成了面包屑列表。如果觉得列表查找耗时，可以先处理成key/value结构，查找的时间复杂度低一些。


```js
{
    'name': 'index',
    'path': '/index',
    'component': 'index',
    'breadcrumb': '首页',
    'prevName': null,
  },
  {
    'name': 'nameA',
    'path': '/nameA',
    'component': 'nameA',
    'breadcrumb': 'A页面',
    'prevName': 'index',
  },
  {
    'name': 'nameB',
    'path': '/nameB',
    'component': 'nameB',
    'breadcrumb': 'B页面',
    'prevName': 'index',
  },
  {
    'name': 'nameAA',
    'path': '/nameAA',
    'component': 'nameAA',
    'breadcrumb': 'AA页面',
    'prevName': 'nameA',
  },
```


### 注意事项(缺点)
1. 路由必须是清晰的树形结构，每个结点只能有一个prevName。
2. 不能保存路由参数。query和params无法保存，点击面包屑向上级跳转时可能发生错误。
3. 要求存在可以手写的路由表，使用自动生成路由的工程难以使用。