<template>
  <el-container class="layout-container">
    <el-aside class="aside"
              width="200px">
      <AppAside class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i class="el-icon-s-fold"></i>
        <span>覃勇涛的第一个项目</span>
        </div>
        <el-dropdown>
          <div class="avatar-warp">
            <img class="avatar" :src="user.photo" alt="">
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!-- <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <!-- <div class="layout-container"> -->
  <!-- <div>顶部导航栏</div>
    <router-view></router-view>
    <div>侧边导航栏</div>
  </div> -->
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      user: {}
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    // 除了登录接口 其他所有接口都需要授权才能请求使用
    // 或者说，除了登录接口其他接口都需要提供你的身份
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.aside {
  background-color: #d3dce6;
}

.aside-menu {
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  // background-color: #b3c0d1;
}

.main {
  background-color: #e9eef3;
}

.avatar-warp {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
