<template>
  <div>
    <div class="action-head">
        <el-radio-group v-model="collect"
                        size="mini"
                        @change="onCollectChange">
          <el-radio-button :label='false'>全部</el-radio-button>
          <el-radio-button :label='true'>收藏</el-radio-button>
        </el-radio-group>
        <el-button size="mini"
                   type="success"
                   @click="dialogTableVisible = true"
                   v-if="isShowAdd">上传素材</el-button>
      </div>
      <!-- 素材列表 -->
      <div class="shucaiList">
        <el-row :gutter="10">
        <el-col :span="12"
                :xs="12"
                :sm="6"
                :md="8"
                :lg="4"
                v-for="(img, index) in images"
                :key="index"
                class="image-item"
                @click.native="selected = index">
          <el-image style="height: 120px; width:150px "
                    :src="img.url"
                    fit="cover"></el-image>
          <div class="selected" v-if="isShowSelected && selected === index"></div>
          <div class="image-acton" v-if="isShowAction">
            <el-button
              type="warning"
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              circle
              size="small"
              :loading="img.loading"
              @click="onCollect(img)"></el-button>
            <!-- <i
              :class="{
                'el-icon-star-on': img.is_collected,
                'el-icon-star-off': !img.is_collected,
              }"
              @click="onCollect(img)"
            ></i> -->
            <!-- <i class="el-icon-delete-solid"></i> -->
            <el-button
              type="danger"
              icon="el-icon-delete-solid"
              circle
              size="small"
              :loading="img.loading"
              @click="onDelete(img)"></el-button>
          </div>
        </el-col>
      </el-row>
      </div>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="onPageChange">
      </el-pagination>
          <el-dialog title="上传素材"
               :visible.sync="dialogTableVisible"
               :append-to-body="true">
    <!-- upload组件本身就支持请求提交上传操作，说白了
    你使用它不用自己去发请求 他会自己发
    请求方法默认就是POST
     -->
    <el-upload
      class="upload-demo"
      drag
      action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
      :headers="uploadHeaders"
      name="image"
      :on-success="onUploadSuccess"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>

    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageList',
  // 使用对象的定义方式
  // prop更严谨功能更丰富 强烈建议在项目中使用 相反数组声明仅适合演示
  props: {
    // 是否显示添加素材
    isShowAdd: {
      type: Boolean, // 布尔值
      default: true // 默认值
      // require: true 表示只要用这个组件就必须得给我isShowAdd数据 否则就会报错
    },
    // 是否显示图片下方的收藏和删除
    isShowAction: {
      type: Boolean,
      default: true
    },
    // 是否显示打钩
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询全部素材列表
      images: [], // 图片素材
      dialogTableVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0,
      pageSize: 18,
      page: 1,
      selected: null
    }
  },
  created () {
    // 初始化页面加载第一页数据
    this.loadImages(1, false)
  },
  methods: {
    loadImages (page, collect = false) {
      // 重置高亮页码
      this.page = page
      getImages({
        collect,
        page, // 第几页
        per_page: this.pageSize
      }).then(res => {
        // img对象本身没有loading 添加这个属性来控制收藏按钮的loading状态
        const results = res.data.data.results
        results.forEach(img => {
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    onCollectChange (value) {
      this.loadImages(1, value)
    },
    onUploadSuccess () {
      // 关闭上传素材窗口
      this.dialogTableVisible = false
      // 更新素材列表
      this.loadImages(false)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      this.loadImages(1, false)
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollect (img) {
      // 已收藏 就取消收藏
      // 没有收藏添加收藏
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        img.loading = false
      })
    },
    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        this.loadImages(this.page)
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.image-acton {
  height: 40px;
  width: 150px;
  background-color: rgba(204, 204, 204, .2);
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 20px;
  color: rgb(23, 23, 48);
  bottom: 4px;
  left: 5px;
  right: 5px;
}

.image-item {
  position: relative;
}

.selected {
  background: url(./selected.png) no-repeat;
  background-size: cover;
  position: absolute;
  left: 0;
  top: -15px;
  right: 0;
  bottom: 0;
}
</style>
