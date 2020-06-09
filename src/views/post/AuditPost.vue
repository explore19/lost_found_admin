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
      <el-select v-model="queryOptions.postType" clearable placeholder="帖子类型" @change="selectForm()">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <!-- <el-button
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
      </el-button> -->
    </el-form>

    <el-table
      v-loading="loading"
      :data="data"
      stripe
      fit
      border
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
      <el-table-column
        align="center"
        label="帖子类型"
        prop="post.type"
      >
        <template slot-scope="scope">
          <el-tag>
            <span v-if="scope.row.post.postType===0">失物</span>
            <span v-if="scope.row.post.postType===1">拾物</span>
            <span v-if="scope.row.post.type===101&&scope.row.post.postType===2">匿名表白贴</span>
            <span v-if="scope.row.post.type===1&&scope.row.post.postType===2">实名表白贴</span>
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
          <!-- <el-button
            v-if="scope.row.post.status!==1"
            size="mini"
            @click="handlePersonInfo(scope.row)"
          >
            查看帖子详情
          </el-button> -->
          <el-button
            v-if="scope.row.post.status===1"
            type="primary"
            size="mini"
            @click="handlePost(scope.row)"
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
      :title="`帖子详情`"
      :visible.sync="showpostDetail"
      width="50%"
      @close="showpostDetail = false"
    >
      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="物品名称">
          <span>{{ post.name }}</span>
        </el-form-item>
        <el-form-item label="丢失地点">
          <span>{{ post.lostPlace }}</span>
        </el-form-item>
        <el-form-item label="丢失时间">
          <span>{{ post.loseTime }}</span>
        </el-form-item>
        <el-form-item label="手机号码">
          <span>{{ post.contact }}</span>
        </el-form-item>
        <el-form-item label="物品详情">
          <span>{{ post.details }}</span>
        </el-form-item>
        <div class="demo-image__preview">
          <el-image
            v-for="url in image"
            :key="url"
            fit="cover"
            style="width: 200px; height: 200px;margin-right:20px;"
            :src="url"
            :preview-src-list="image"
          />
        </div>
        <div v-for="(item,index) in replyList" :key="index" class="block" style="margin: 20px 0px">
          <el-divider />
          <div>
            <el-avatar :size="40" :src="item.replyUserPortrait" />
            <el-form-item>
              <template @mouseover="visible1" @mouseleave="visible1">
                <el-popover
                  placement="right-end"
                  trigger="hover"
                >
                  <p>你确认删除该评论吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="mini" @click.prevent="removereply1(item.id,index)">删除</el-button>
                  </div>
                  <span slot="reference" style="margin-left:10px;"><span style="color:#2a5caa;">{{ item.replyUserName }}</span>：{{ item.info }}</span>
                </el-popover>
                <!-- <span style="margin-left:10px;"><span style="color:#2a5caa;">{{ item.replyUserName }}</span>：{{ item.info }}</span> -->
                <!-- <span style="font-size:7px;display:block;margin-left:12px;">{{ item.createTime }}</span> -->

              </template></el-form-item>
          </div>

          <div v-for="(item2,index2) in item.replys" :key="index2" class="block" style="margin: 10px 40px;background:#fafafa">
            <div> <el-avatar :size="30" :src="item2.headPortrait" />
              <el-form-item>
                <el-popover
                  placement="right-end"
                  trigger="hover"
                >
                  <p>你确认删除该评论吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="mini" @click.prevent="removereply2(item2.reply.id,index2,index)">删除</el-button>
                  </div>
                  <span v-if="item.id==item2.reply.replyId" slot="reference" style="margin-left:10px;"><span style="color:#2a5caa;">{{ item2.nickName }}</span>：{{ item2.reply.info }}</span>
                  <span v-if="item.id!=item2.reply.replyId" slot="reference" style="margin-left:10px;"><span style="color:#2a5caa;">{{ item2.nickName }}</span> 回复 <span style="color:#2a5caa;">{{ item2.replyedUserNickName }}</span>：{{ item2.reply.info }}</span>
                </el-popover>
              </el-form-item></div>

          </div>
        </div>
        <el-divider />
        <div style="text-align: right; margin: 0">
          <el-form-item><el-button @click="handleUnPass(post.id,2)">审核不通过</el-button>
            <el-button type="primary" @click="handlePass(post.id,0)">审核通过</el-button>
          </el-form-item>
        </div>
      </el-form>

    </el-dialog>

  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
<script lang="ts">
import { queryPost, deletePost, queryreply, deletereply, AuditPost } from '@/api/post'
import Utils from '@/utils/util'

export default {
  name: 'Post',
  data() {
    return {
      visible: false,
      data: [],
      selectUserId: [],
      queryOptions: {
        keyWords: '',
        page: 1,
        pageSize: 10,
        status: 1,
        postType: ''
      },
      user: {},
      total: 0,
      loading: true,
      showCheckbox: false,
      showDialog: false,
      post: {},
      showpostDetail: false,
      image: [],
      hasImg: false,
      firstFloorReply: {
        replyUserPortrait: '',
        replyUserName: '',
        info: '',
        createTime: '',
        replys: []
      },
      replyForm: {
        replyId: -1,
        type: 0,
        postId: '',
        info: ''
      },
      replyList: [],
      options: [{
        value: '0',
        label: '失物'
      }, {
        value: '1',
        label: '拾物'
      }, {
        value: '2',
        label: '表白贴'
      }],
      value: ''

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
    selectForm() {
      this.requestData()
    },
    handleUnPass(id, operation) {
      AuditPost(id, operation).then((res) => {
        this.$message({
          message: '审核未通过',
          type: 'success'
        })
        this.requestData()
        this.showpostDetail = false
        Utils.$emit('demo')
      })
    },
    handlePass(id, operation) {
      AuditPost(id, operation).then((res) => {
        this.$message({
          message: '审核已通过',
          type: 'success'
        })
        this.requestData()
        this.showpostDetail = false
        Utils.$emit('demo')
      })
    },
    removereply1(id, index) {
      deletereply(id).then((res) => {
        this.replyList.splice(index, 1)
      })
    },
    removereply2(id, index2, index) {
      deletereply(id).then((res) => {
        this.replyList[index].replys.splice(index2, 1)
      })
    },
    handleSelect(select) {
      this.selectUserId = select.map((item) => {
        return item.id
      })
    },
    handlePost(post) {
      this.replyForm.postId = post.post.id
      queryreply({ postId: post.post.id }).then((res) => {
        if (res.status === 0) {
          const replyList = []
          this.recursionReply(res.data, replyList)
          this.replyList = replyList
        }
      })
      this.post = post.post
      this.showpostDetail = true
      if (post.post.image == null) {
        this.hasImg = false
      } else {
        this.hasImg = true
        this.image = post.post.image.split('&&&')
      }
    },
    recursionReply: function(node, replyList) {
      if (node.reply.status === null) { // -null代表根节点
        if (node.children == null) {
          return
        }
        for (var i = 0; i < node.children.length; i++) {
          this.recursionReply(node.children[i], replyList)
        }
        return
      }

      if (node.reply.status === 0) { // 0代表回复帖子的回复
        this.firstFloorReply.info = node.reply.reply.info
        this.firstFloorReply.replyUserPortrait = node.reply.headPortrait
        this.firstFloorReply.replyUserName = node.reply.nickName
        this.firstFloorReply.createTime = node.reply.reply.createTime
        this.firstFloorReply.id = node.reply.reply.id
      } else { // 回复回复的回复
        this.firstFloorReply.replys.push(node.reply)
      }
      if (node.children == null) {
        return
      }
      for (let i = 0; i < node.children.length; i++) {
        this.recursionReply(node.children[i], replyList)
      }
      if (node.reply.status === 0) {
        replyList.push(this.firstFloorReply)
        this.firstFloorReply = {
          replyUserPortrait: '',
          replyUserName: '',
          info: '',
          createTime: '',
          replys: []
        }
      }
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
