<template>
  <div class="app-container">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="queryOptions"
      @submit.native.prevent="handleFilter"
    >
      <el-form-item
        prop="keyWords"
      >
        <el-input
          v-model="queryOptions.keyWords"
          placeholder="请输入帖子关键字"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
      </el-form-item>
      <el-button
        type="primary"
        plain
        @click="showCheckbox=!showCheckbox"
      >
        多选
      </el-button>
      <el-button
        v-if="showCheckbox"
        type="danger"
        @click="handleBatchDelete"
      >
        批量冻结
      </el-button>
    </el-form>

    <el-table
      v-loading="loading"
      :data="data"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelect"
    >
      <el-table-column
        v-if="showCheckbox"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        label="失物名称"
        prop="post.name"
      />
      <el-table-column
        align="center"
        label="发帖人名称"
        prop="nickName"
      />
      <el-table-column
        show-overflow-tooltip
        align="center"
        prop="post.details"
        label="帖子详情"
      />

      <!-- <el-table-column
        align="center"
        prop="post.loseTime"
        label="丢失时间"
      />
      <el-table-column
        align="center"
        prop="post.contact"
        label="联系方式"
      /> -->
      <el-table-column
        align="center"
        label="帖子类型"
        prop="post.type"
      >
        <template slot-scope="scope">
          <el-tag>
            <span v-if="scope.row.post.postType===0">失物</span>
            <span v-if="scope.row.post.postType===1">拾物</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="帖子状态"
        prop="post.status"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.post.status| formatPostColor">
            {{ scope.row.post.status| formatPostStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="post.createTime"
        label="发帖时间"
      />

      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.post.status!==1"
            size="mini"
            @click="handlePersonInfo(scope.row)"
          >
            查看帖子详情
          </el-button>
          <el-button
            v-if="scope.row.post.status===1"
            type="primary"
            size="mini"
          >

            审核
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.row.post.id)"
          >

            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-show="total > 0"
      :current-page.sync="queryOptions.page"
      :page-sizes="[10,20, 50, 100]"
      :page-size="10"
      layout="total,sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      :title="`个人信息`"
      :visible.sync="showDialog"
      width="30%"
      @close="showDialog = false"
    >
      <!-- <el-container>
        <el-aside width="100px" />
        <el-main>
          <span> <svg-icon icon-class="head" />
            头像: <el-avatar shape="square" size="small" :src="user.headPortrait" /></span><br><br>
          <span> <i
            class="el-icon-user"
          />
            真实姓名:{{ user.realName }}</span><br><br>
          <span> <svg-icon icon-class="sex" />
            性别:{{ user.sex?user.sex:'未填写' }}</span><br><br>
          <span> <i
            class="el-icon-mobile"
          />
            手机:{{ user.phone?user.phone:'未填写' }}</span><br><br>
          <span> <svg-icon icon-class="qq" />
            QQ:{{ user.qq ?user.qq:'未填写' }}</span><br><br>

        </el-main>
        <el-aside width="100px" /> -->
      <!-- </el-container> -->

    </el-dialog>

  </div>
</template>

<script lang="ts">
import { queryPost, deletePost } from '@/api/post'

export default {
  name: 'Post',
  data() {
    return {
      data: [],
      selectUserId: [],
      queryOptions: {
        keyWords: '',
        page: 1,
        pageSize: 10
      },
      user: {},
      total: 0,
      loading: true,
      showCheckbox: false,
      showDialog: false
    }
  },
  created() {
    this.requestData()
  },
  methods: {
    requestData() {
      queryPost(this.queryOptions).then((res) => {
        if (res.status === 0) {
          this.data = res.data.data
          this.total = res.data.total
          this.loading = false
        }
      })
    },
    handleSelect(select) {
      this.selectUserId = select.map((item) => {
        return item.id
      })
    },
    handleBatchDelete() {
      // if (this.selectMajorId.length < 1) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请先选择要删除项'
      //   })
      //   return
      // }
      // this.$confirm(`确定要批量删除所选项吗？`, '提示', {
      //   type: 'warning'
      // }).then(async() => {
      //   const res = await this.api.batchDeleteMajor(this.selectMajorId)
      //   if (res.code === 0) {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!'
      //     })
      //     this.requestData()
      //   }
      // })
    },
    handleDelete(id) {
      this.$confirm(`确定删除帖子吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deletePost(id).then((res) => {
          if (res.status === 0) {
            this.requestData()
            this.$message({
              type: 'success',
              message: res.msg
            })
          }
        })
      })
    },
    handleFilter() {
      this.queryOptions.page = 1
      this.requestData()
    },
    handlePersonInfo(user) {
      this.user = user
      this.showDialog = true
    },
    handleSizeChange(val) {
      this.queryOptions.pageSize = val
      this.requestData()
    },
    handleCurrentChange(val) {
      this.queryOptions.page = val
      this.requestData()
    }

  }

}
</script>
