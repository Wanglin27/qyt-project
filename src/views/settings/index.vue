<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="16">
          <el-form ref="form"
                   :model="user"
                   label-width="70px">
            <el-form-item label="编号">
              {{user.id}}
            </el-form-item>
            <el-form-item label="手机">
              {{user.mobile}}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea"
                        v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                        :loading="updateProfileLoading"
                         @click="onUpdateUser">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2"
                :span="4">
          <el-avatar shape="square"
                     :size="150"
                     :src="user.photo">
          </el-avatar>
          <!-- <p @click="$refs.file.click()">点击修改头像</p> 这个在input里定义ref 获取dom元素-->
          <!-- lable的for和input的id对上 -->
          <label for="file"
                 style="display: block">点击修改头像</label>
          <!-- input的type是file就相当于打开我的电脑 -->
          <input id="file"
                 type="file"
                 hidden
                 ref="file"
                 @change="onFileChange">
        </el-col>
      </el-row>
    </el-card>
    <!-- 会话框弹出时调用onDialogOpened -->
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               width="30%"
               append-to-body
               @opened="onDialogOpened"
               @closed="onDialogClosed">
      <div class="preview-image-wrap">
        <img class="preview-image"
             :src="previewImage"
             ref="preview-image">
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="onUpdatePhoto"
                   :loading="updateProfileLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'
import 'cropperjs/dist/cropper.css'

import Cropper from 'cropperjs'
export default {
  name: 'SettingsIndex',
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      }, // 用户资料
      dialogVisible: false,
      previewImage: '',
      cropper: null,
      updateProfileLoading: false
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file
      // file.files[0]得到文件对象
      console.log(file.files[0])
      // 如果是图片文件 可以处理图片预览 得到的blobData可以直接给src使用
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // console.log(this.previewImage) blob:http://localhost:8081/b5bfa15d-3233-4e1c-9838-20fd05a0d436
      // 解决重复选择相同文件不触发change事件
      this.$refs.file.value = ''
      // 展示弹出层
      this.dialogVisible = true
    },
    onDialogOpened () {
      // 注意图片裁洁器必须在img是可见状态下才能完成初始化所以在弹出层打开动画结束时
      // 第一次初始化好以后 如果预览裁捷的图片发生变化 裁捷器是不会更新的
      // 方法一裁捷器replace方法 二 销毁裁捷器重新初始化（最简单）
      // 获取图片DOM节点
      const image = this.$refs['preview-image']
      // eslint-disable-next-line no-unused-vars
      this.cropper = new Cropper(image, {
        // 初始化比例
        // aspectRatio: 16 / 9,
        aspectRatio: 1,
        // 默认为0可以移除图片外 1不可以
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: false
        // 当你移动裁切器的时候会触发调用crop方法 得到坐标
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    onDialogClosed () {
      // 在对话框完全关闭的时候销毁拆解器 等在重新打开对话框时又会重新加载一个新的
      this.cropper.destroy()
    },
    onUpdatePhoto () {
      // 获取裁切的图片对象
      this.updateProfileLoading = true
      this.cropper.getCroppedCanvas().toBlob(file => {
        console.log(file)
        // 把文件对象方法FormData中提交给后端
        const fd = new FormData()
        fd.append('photo', file)
        // 请求提交fd
        updateUserPhoto(fd).then(res => {
          // console.log(res)
          this.updateProfileLoading = false
          this.dialogVisible = false
          // 把服务端返回的图片进行展示有点慢
          // this.user.photo = res.data.data.photo
          this.user.photo = window.URL.createObjectURL(file)
          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
          globalBus.$emit('updateUser', this.user)
        })
      })
      // 请求更新用户头像
      // 关闭对话框
      // 更新视图展示
    },
    // 更新用户信息
    onUpdateUser () {
      this.updateProfileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 关闭loading
        this.updateProfileLoading = false
        // 更新顶部的用户信息 用全局事件总线
        globalBus.$emit('updateUser', this.user)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
