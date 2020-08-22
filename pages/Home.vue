<template>
  <div class="Home content">
    <div class="head">
      <el-input placeholder="输入项目名" v-model="name" style="width: 300px">
        <el-button slot="append" icon="el-icon-search" @click="getProjects"></el-button>
      </el-input>
      <el-button type="primary" round @click="createUpdate()">创建项目</el-button>
    </div>
    <div class="projects" v-loading="loading">
      <div class="card" v-for="(item, index) in projects" :key="index">
        <h1>{{ item.name }}</h1>
        <p>创建时间：{{ item.creationDate }}</p>
        <div>
           <el-button type="primary" round @click="$router.push(`/bury/list/${item._id}`)">进入</el-button>
           <el-button type="primary" icon="el-icon-edit" circle @click="createUpdate(item)"></el-button>
           <el-popconfirm
              title="确认删除？"
              @onConfirm="del(item)"
            >
              <el-button slot="reference" type="danger" icon="el-icon-delete" circle style="margin-left: 10px"></el-button>
            </el-popconfirm>
        </div>
      </div>
    </div>
    <!-- 创建/更新项目弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="showModal"
      width="30%"
      :before-close="close">
      <el-input placeholder="输入项目名" v-model="project.name" style="margin-bottom: 20px"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data () {
    return {
      projects: [],
      name: '',
      loading: false,

      /** 弹框 */
      project: {},
      showModal: false
    }
  },
  computed: {
    title () {
      return this.project._id ? '更新项目':'创建项目'
    }
  },
  methods: {
    async getProjects () {
      this.loading = true
      const res = await this.$request('/getBuckets')
      this.projects = res.data
      this.loading = false
    },
    createUpdate (project = {}) {
      this.project = project
      this.showModal = true
    },
    close () {
      this.project = {},
      this.showModal = false
    },
    async sure () {
      if (this.project._id) {
        await this.$request('/updateProject', this.project)
      } else {
        await this.$request('/createBucket', this.project)
      }
      this.close()
      this.getProjects()
    },
    async del (item) {
      await this.$request('/delBucket', item)
      this.getProjects()
    }
  },
  mounted () {
    this.getProjects()
  }
}
</script>

<style lang="less" scoped>
.head {
  margin: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.projects {
  display: flex;
  flex-wrap: wrap;

  .card {
    padding: 20px;
    width: 320px;
    box-shadow: 0 0 4px #ddd;
    border-radius: 20px;
    margin: 0 20px 20px 0;
    cursor: pointer;

    p {
      margin: 10px 0;
    }
  }
}
</style>