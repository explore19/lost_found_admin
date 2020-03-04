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
          轮播图
        </el-button>
      </el-form-item>

    </el-form>
    <el-row>
      <el-col v-for="(item, index) in data" :key="index" :span="4" :offset="index > 0 ? 1 : 0">
        <el-card :body-style="{ padding: '5px' }">
          <img :src="item.image" height="200" width="100" class="image">
          <div style="padding: 5px;">
            <span>名称{{ item.name }}</span>
            <span>优先级{{ item.priority }}</span>
            <div class="bottom clearfix">
              <el-button class="button" @click="handleEdit(item)">编辑</el-button>
              <el-button class="button" @click="handleDelete(item.id)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="rotationChart.id?'修改轮播图':'添加轮播图'"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
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
          label="轮播图名称"
        >
          <el-input
            v-model="editForm.name"
            placeholder="请输入轮播图名称"
            maxlength="10"
          />
        </el-form-item>
        <el-form-item
          prop="type"
          label="轮播图类型"
        >
          <el-radio-group v-model="editForm.type">
            <el-radio :label="0">普通轮播图</el-radio>
            <el-radio :label="1">帖子轮播图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="image" label="图片上传">
          <el-upload
            class="avatar-uploader"
            action="https://localhost:8000/upload/image"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
            name="img"
            with-credentials
          >
            <img v-if="editForm.image" :src="editForm.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item prop="priority" label="优先级(优先级越小越靠前)">
          <el-input-number
            v-model="editForm.priority"
            :min="0"
            :precision="0"
            placeholder="请输入帖子Id"
          />
        </el-form-item>
        <el-form-item v-if="editForm.type==0" label="链接">
          <el-input
            v-model="editForm.url"
            placeholder="请输入链接地址"
          />
        </el-form-item>
        <el-form-item v-else label="帖子Id">
          <el-input
            v-model="editForm.postId"
            placeholder="请输入帖子Id"
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
import { queryRotationChart, createRotationChart, putRotationChart, deleteRotationChart } from '@/api/rotation-chart'

export default {
  name: 'RotationChart',
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
        name: '',
        type: 0,
        image: '',
        postId: '',
        url: '',
        priority: 0
      },
      rotationChart: {},
      loading: true,
      showDialog: false,
      rules: {
        name: [{ required: true, message: '物品名称不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '请选择轮播图类型', trigger: 'blur' }],
        image: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        priority: [{ required: true, message: '优先级不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.requestData()
  },
  methods: {
    requestData() {
      queryRotationChart().then((res) => {
        if (res.status === 0) {
          this.data = res.data
          this.loading = false
        }
      })
    },
    handleCreate() {
      this.rotationChart = {}
      this.resetForm()
      this.showDialog = true
    },
    handleImageSuccess(res, file) {
      if (res.status === 0) {
        this.editForm.image = 'https://localhost:8000/img/' + res.data
      }
    },
    beforeImageUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt10M
    },
    handleSave() {
      this.$refs['editForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.rotationChart.id) {
          putRotationChart(this.editForm, this.rotationChart.id).then((res) => {
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
          createRotationChart(this.editForm).then((res) => {
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
      }
      )
    },
    handleDelete(id) {
      this.$confirm(`确定删除吗？`, '提示', {
        type: 'warning'
      }).then(() => {
        deleteRotationChart(id).then((res) => {
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
        name: '',
        type: 0,
        image: '',
        postId: '',
        url: '',
        priority: 0
      }
    },
    handleFilter() {
      this.queryOptions.page = 1
      this.requestData()
    },
    handleEdit(rotationChart) {
      this.rotationChart = rotationChart
      this.editForm = {
        name: rotationChart.name,
        type: rotationChart.type,
        image: rotationChart.image,
        url: rotationChart.url,
        postId: rotationChart.postId,
        priority: rotationChart.priority
      }
      console.log(this.rotationChart)
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
<style>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
 .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }

</style>

