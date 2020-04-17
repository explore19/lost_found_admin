<template>
  <div class="app-container">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="queryOptions"
      @submit.native.prevent="handleFilter"
    >
      <el-form-item prop="nickName">
        <el-input
          v-model="queryOptions.nickName"
          placeholder="请输入用户昵称"
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
        align="center"
        label="用户昵称"
        prop="nickName"
      />
      <el-table-column
        align="center"
        label="用户公开Id"
        prop="openId"
      />
      <el-table-column
        align="center"
        label="用户状态"
        prop="status"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status| formatUserStatusColor">
            {{ scope.row.status| formatUserStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="添加时间"
      />
      <el-table-column
        align="center"
        prop="updateTime"
        label="更新时间"
      />
      <el-table-column
        align="center"
        prop="currentTime"
        label="上次登录时间"
      />
      <el-table-column
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handlePersonInfo(scope.row)"
          >
            查看个人信息
          </el-button>
          <el-button
            :type="scope.row.status===1?'success':'danger'"
            size="mini"
            @click="handleForbid(scope.row.id)"
          >

            {{ scope.row.status===1?'解禁':'封禁' }}
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
      <el-container>
        <el-aside width="100px" />
        <el-main>
          <span>

            <el-avatar
              shape="square"

              src="user.headPortrait"
            /></span>
          <br><br>
          <span> <i class="el-icon-user" />
            真实姓名:{{ user.realName }}</span><br><br>
          <span>
            <svg-icon icon-class="sex" />
            性别:{{ user.sex?user.sex:'未填写' }}</span><br><br>
          <span> <i class="el-icon-mobile" />
            手机:{{ user.phone?user.phone:'未填写' }}</span><br><br>
          <span>
            <svg-icon icon-class="qq" />
            QQ:{{ user.qq ?user.qq:'未填写' }}</span><br><br>

        </el-main>
        <el-aside width="100px" />
      </el-container>

    </el-dialog>

  </div>
</template>

<script lang="ts">
import { queryUser, forbidUser } from '@/api/manager'

export default {
  name: 'User',
  data() {
    return {
      data: [],
      selectUserId: [],
      queryOptions: {
        nickName: '',
        page: 1,
        pageSize: 10
      },
      user: {},
      total: 0,
      loading: true,
      showDialog: false
    }
  },
  created() {
    this.requestData()
  },
  methods: {
    requestData() {
      queryUser(this.queryOptions).then(res => {
        if (res.status === 0) {
          this.data = res.data.list
          this.total = res.data.total
          this.loading = false
        }
      })
    },
    handleSelect(select) {
      this.selectUserId = select.map(item => {
        return item.id
      })
    },
    handleForbid(id) {
      this.$confirm(`确定封禁(解禁)用户吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        forbidUser(id).then(res => {
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
