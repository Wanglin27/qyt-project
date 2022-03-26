<template>
  <el-container class="layout-container">
    <el-aside class="aside"
              width="auto">
      <AppAside :is-collapse="isCollapse"
                class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <!--
            :class样式处理
            {
              css类名：布尔值
            }
            true 作用类名
            false 不作用类名
           -->
          <i :class="{
            'el-icon-s-fold': isCollapse,
            'el-icon-s-unfold': !isCollapse,
          }"
             @click="isCollapse = !isCollapse"></i>
          <span>覃勇涛的第一个项目</span>
        </div>
        <div class="weather">
          <Weather />
        </div>
        <el-dropdown>
          <div class="avatar-warp">
            <img class="avatar"
                 :src="user.photo"
                 alt="">
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!-- <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
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
import Weather from './components/weather'
import globalBus from '@/utils/global-bus'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside,
    Weather
  },
  props: {},
  data () {
    return {
      user: {},
      isCollapse: true
    }
  },
  // 初始化的时候调用
  // 这个生命周期里数据data和方法都可以操作了
  created () {
    this.loadUserProfile()
    globalBus.$on('updateUser', (data) => {
      // this.user = data 不要这样写 对象之前赋值的是引用 会导致相互影响的问题
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    // 除了登录接口 其他所有接口都需要授权才能请求使用
    // 或者说，除了登录接口其他接口都需要提供你的身份
    loadUserProfile () {
      // 用户发起的请求
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确认退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.localStorage.removeItem('user')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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

.weather {
  position: absolute;
  right: 12%;
}

.avatar-warp {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>
