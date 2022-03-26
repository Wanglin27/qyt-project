<template>
  <div class="upload-cover" @click="dialogVisible=true">
    <div class="cover-wrap">
      <img ref="el-image" class="el-image" :src="value" alt="">
    </div>
    <el-dialog title="选择封面"
               :visible.sync="dialogVisible"
               append-to-body>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="素材库" name="first">
          <!--
            ref有两个作用
            作用到普通html标签上可以获取DOM
            作用到组件上可以获取组件
            -->
          <ImageList :isShowAdd="false"
                     :isShowAction="false"
                     :isShowSelected="true"
                     ref="image-list"/>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input ref="file" type="file" @change="uploadFile">
          <img ref="preview-image" class="el-image" src="" alt="">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="onCoverProfile">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 取出props的值 直接coverImage 因为到组件里面就成驼峰了
import { uploadImage } from '@/api/image'
import ImageList from '@/components/image-list'
export default {
  name: 'UploadCover',
  props: ['value'],
  // props: ['cover-image'],
  components: { ImageList },
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  methods: {
    uploadFile () {
      const file = this.$refs.file
      // 如果是图片文件 可以处理图片预览 得到的blobData可以直接给src使用
      const blobData = window.URL.createObjectURL(file.files[0])
      this.$refs['preview-image'].src = blobData
    },
    onCoverProfile () {
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          this.dialogVisible = false
          // 展示上传的图片
          // this.$refs['el-image'].src = res.data.data.url
          // 将图片地址发送给父组件
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 还有一种通信方式：父组件可以直接访问子组件的数据
        // ref
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择图片')
          // eslint-disable-next-line no-useless-return
          return
        }
        this.dialogVisible = false
        this.$emit('input', imageList.images[selected].url)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.upload-cover {
  display: flex;
  // justify-content: center;
}
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid gray;
}
.el-image {
  width: 150px;
}
</style>
