<template>
  <div class="app-container">
    <el-form
      ref="searchForm"
      :inline="true"
      :model="queryOptions"
      @submit.native.prevent="handleFilter"
    >
      <el-form-item
        prop="name"
      >
        <el-input
          v-model="queryOptions.name"
          placeholder="请输入物品名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          物品
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
    >
      <el-table-column
        align="center"
        label="物品Id"
        prop="id"
      />
      <el-table-column
        align="center"
        label="物品名称"
        prop="name"
      />
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
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.row.id)"
          >

            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="`修改信息`"
      :visible.sync="showDialog"
      @close="showDialog = false"
    >
      <el-form
        v-if="showDialog"
        ref="editForm"
        :model="editForm"
        :rules="rules"
        label-position="top"
      >
        <el-form-item
          prop="name"
          label="物品名称"
        >
          <el-input
            v-model="editForm.name"
            placeholder="请输入物品名称"
            maxlength="10"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="showDialog = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { queryItemType, createItem, putItem, deleteItem } from '@/api/item-type'

export default {
  name: 'ItemType',
  data() {
    return {
      data: [],
      selectUserId: [],
      queryOptions: {
        name: '',
        page: 1,
        pageSize: 20
      },
      editForm: {
        name: ''
      },
      item: {},
      loading: true,
      showDialog: false,
      rules: {
        name: [{ required: true, message: '物品名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.requestData()
  },
  methods: {
    requestData() {
      queryItemType(this.queryOptions).then((res) => {
        if (res.status === 0) {
          this.data = res.data
          this.loading = false
        }
      })
    },
    handleCreate() {
      this.item = {}
      this.resetForm()
      this.showDialog = true
    },
    handleSave() {
      this.$refs['editForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.item.id) {
          putItem({ name: this.editForm.name, id: this.item.id }).then((res) => {
            if (res.status === 0) {
              this.resetForm()
              this.showDialog = false
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.requestData()
            }
          })
        } else {
          createItem(this.editForm).then((res) => {
            if (res.status === 0) {
              this.showDialog = false
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.requestData()
            }
          })
        }
      })
    },
    handleDelete(id) {
      this.$confirm(`确定删除吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deleteItem(id).then((res) => {
          if (res.status === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.requestData()
          }
        })
      })
    },
    resetForm() {
      this.editForm = {
        name: ''
      }
    },
    handleFilter() {
      this.queryOptions.page = 1
      this.requestData()
    },
    handleEdit(item) {
      this.item = item
      this.editForm.name = item.name
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
