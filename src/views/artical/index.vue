<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑bread 路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '查看文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form"
               :model="form"
               size="small"
               label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId"
                     placeholder="请选择">
            <el-option label="全部"
                       :value="null"></el-option>
            <el-option :label="channel.name"
                       :value="channel.id"
                       v-for="(channel, index) in channels" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="rangeDate"
                          type="datetimerange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['12:00:00']"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- button按钮的click事件有个默认参数当你没有指定参数的时候 他会传递一个没用的数据 -->
          <el-button type="primary"
                     @click="loadArticles(1)">查询</el-button>
        </el-form-item>
        <!-- 数据筛选表单 -->
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        根据筛选条件共查询 {{this.totalCount}} 条结果
      </div>
      <!-- 数据列表 -->
      <!--
        Table表格组件
        1、把需要展示的数组列表数据绑定给table组件的data属性
        2、设计列表表格 el-table-colum
        width 可以设定表格列的宽度
        label 可以设定列的标题
        prop 用来设定要渲染的列表项数据字段 只能展示文本
        3、表格列默认只能渲染普通文本，如果需要展示其他内容，例如放个按钮 图片
        那就需要自定义表格列模板了：
       -->
      <el-table :data="articles"
                stripe
                style="width: 100%"
                class="list-table"
                size="small"
                v-loading="loading">
        <el-table-column
                         label="封面">
                         <template slot-scope="scope">
                           <img class="article-cover" v-if="scope.row.cover.images[0]" :src="scope.row.cover.images[0]" alt="">
                           <img class="article-cover" v-else src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.zhimg.com%2F80%2Fv2-62cb2e5711796e788676c5878a1efdd7_hd.jpg&refer=http%3A%2F%2Fpic4.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1635921559&t=5b689dcd88cccfee9e1d63e6ffda45c8" alt="">
                           <!-- <img class="article-cover"
                           :src="scope.row.cover.images[0] || 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.zhimg.com%2F80%2Fv2-62cb2e5711796e788676c5878a1efdd7_hd.jpg&refer=http%3A%2F%2Fpic4.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1635921559&t=5b689dcd88cccfee9e1d63e6ffda45c8'" alt=""> -->
                         </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="标题">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
            <!-- <el-tag type="warning" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="info" v-else-if="scope.row.status === 4">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate"
                         label="发布时间">
        </el-table-column>
        <el-table-column label="操作">
          <!-- 如果需要自定义表格列的模板 则需要自定义内容放到template里面 -->
          <template  slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          circle
          icon="el-icon-edit"
          @click="$router.push('/publish?id=' + scope.row.id)"
          ></el-button>
        <el-button
          size="mini"
          type="danger"
          circle
          icon="el-icon-delete"
          @click="onDeleteArticle(scope.row.id)"
         ></el-button>
      </template>
        </el-table-column>
      </el-table>
      <!-- 列表分页
           total用来设定总数据的条数（从后端获取）
           它默认按照10条每页计算总页码
           page-size 每页显示条目个数
       -->
      <el-pagination layout="prev, pager, next"
                     :total="totalCount"
                     @current-change="onCurrentChange"
                     :page-size="pageSize"
                     :disabled="loading"
                     :current-page="page">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章数据列表
      articleStatus: [
        { text: '草稿', type: 'info' },
        { text: '待审核', type: '' },
        { text: '审核通过', type: 'success' },
        { text: '审核失败', type: 'warning' },
        { text: '已删除', type: 'danger' }
      ],
      totalCount: 0,
      pageSize: 10,
      status: null, // 查询文章的状态 不传就是全部
      channels: [], // 文章频道列表
      channelId: null, // 文章频道列表
      rangeDate: [],
      loading: true, // 表单数据加载中
      page: 1
    }
  },
  created () {
    this.loadArticles(1)
    this.loadChannels()
  },
  methods: {
    loadArticles (page) {
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 起始时间
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截止时间
      }).then(res => {
        this.articles = res.data.data.results
        this.totalCount = res.data.data.total_count
        this.loading = false
        console.log(res)
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteArticle(articleId.toString()).then(res => {
            console.log(res)
            this.loadArticles()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 30px;
}

.list-table {
  margin-bottom: 20px;
}

.article-cover {
  width: 60px;
  background-size: cover;
}
</style>
