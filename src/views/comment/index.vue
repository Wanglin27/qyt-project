<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 把数据列表绑定给表格data
           设计表格列
           给表格列绑定要渲染的数据字段
       -->
      <el-table
      class="table-list"
      stripe
      :data="articles"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数">
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
      </el-table-column>
      <el-table-column
        prop="comment_status"
        label="评论状态">
        <template slot-scope="scope">
          <!-- scope.row是数组里面的行对象 -->
          {{ scope.row.comment_status ? '正常' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="onStatusChange(scope.row)"
            :disabled="scope.row.statusDisabled">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <!-- 绑定页码
         绑定每页大小
         current-page 高亮页码
         page-sizes 控制可选的，每页大小
         page-size 默认每页大小
     -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync=page
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  data () {
    return {
      articles: [], // 文章数据列表
      page: 1,
      totalCount: 0, // 总数据条数
      pageSize: 10
    }
  },
  created () {
    this.loadArticles()
  },
  mounted () {

  },
  methods: {
    loadArticles (page) {
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        const results = res.data.data.results
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 请求提交修改
      // console.log(article.comment_status)
      article.statusDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        console.log(res)
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      })
    },
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      // console.log(page)
      this.loadArticles(page)
    }
  }
}
</script>

<style lang="less" scoped>
.table-list {
  margin-bottom: 30px;
}
</style>
