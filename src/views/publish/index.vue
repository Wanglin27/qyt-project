<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <el-form
        ref="publish-form"
        :model="article"
        label-width="60px"
        :rules="formRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="article.content"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!--
            当你给事件处理函数传递自定义参数以后 就无法得到原本的那个数据参数了
            如果我们想要在事件处理函数自定义传参以后还想得到
            原来的那个事件本身的参数则手动指定$event 他就代表事件本身的参数

            v-model="article.cover.images[index] 相当于
            @update-cover="onUpdateCover(index, $event)"
              :cover-image="article.cover.images[index]"></UploadCover>
              只不过变成了@input :value -->
           -->
          <template v-if="article.cover.type > 0">
            <UploadCover
              v-for="(cover, index) in article.cover.type"
              :key="cover"
              v-model="article.cover.images[index]"></UploadCover>
              <!-- <UploadCover
              v-for="(cover, index) in article.cover.type"
              :key="cover"
              @update-cover="onUpdateCover(index, $event)"
              :cover-image="article.cover.images[index]"></UploadCover> -->
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in channels" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article'
import UploadCover from './components/upload-cover'
export default {
  name: 'PublishIndex',
  components: { UploadCover },
  props: {},
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          // 封面类型 -1:自动，0-无图，1-1张，3-3张
          type: 1,
          images: []
        },
        channel_id: null // 文章所属频道id

      },
      channels: [], // 文章频道列表
      formRules: {
        title: [
          { required: true, message: '请输入文章的标题', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        channel_id: [
          { required: 'true', message: '请选择文章频道' }
        ]

      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()

    // 由于我们发布和修改使用的同一个组件
    // 所以这里要判断
    // 如果路由路径参数中有id 则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        // 验证失败 停止提交表单
        if (!valid) {
          return false
        }
        // 验证通过提交表单
        const articleId = this.$route.query.id
        // 找到数据接口
        // 封装请求方法
        // 请求提交表单
        // 如果是修改文章 则执行修改操作 否则执行添加操作
        if (articleId) {
          updateArticle(articleId, this.article, draft).then(res => {
            console.log(res)
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          })
        } else {
          addArticle(this.article, draft).then(res => {
            console.log(res)
            this.$message({
              message: '发布成功',
              type: 'success'
            })
          })
        }
        // 处理响应结果
      })
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    // 修改文章：加载文章内容
    loadArticle () {
      // 找到数据接口
      // 封装请求方法
      // 请求获取数据
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    }
    // onUpdateCover (index, url) {
    //   this.article.cover.images[index] = url
    // }
  }
}
</script>

<style lang="less" scoped>

</style>>
