<template>
  <div class="menu">
    <div class="box">
      <div class="projects-list">
        <div
          v-for="item in projectList"
          :key="item.name"
          class="item"
        >
          <div
            :class="['project-name', item.name === currentProject ? 'active' : '']"
          >
            <div @click="changeProject(item.name)">
              <span
                class="icon-circle"
                :style="{ background: item.color }"
              />{{
                item.name
              }} {{item.rules && item.rules.length}}
            </div>
            <span>
              <el-dropdown>
                <i class="el-icon-more-outline" />
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <el-button type="text" @click="addRule(item.name)">
                      <i class="el-icon-circle-plus-outline" />
                      新增规则
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button  type="text" @click="editProject(item.name)"><i class="el-icon-edit"/>编辑项目</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button @click="deleteProjectByName(item.name)"  type="text"><i class="el-icon-delete"/> 删除</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </div>
          <div
            v-if="item.name === currentProject"
            class="rule-items"
          >
            <div
              v-for="rule in rules"
              :key="rule.path"
              @click="editRule(item.name, rule)"
              class="rule-item"
            >
              <span>{{ rule.name }}</span>
              <el-popconfirm  title="确定删除吗？" @confirm="deleteRule(item.name, rule)">
                <span class="delete-btn"  slot="reference" @click.stop>
                  <i
                    class="el-icon-delete"
                  />
                </span>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="editProjectName ? '编辑项目' : '新增项目'"
      :visible.sync="dialogFormVisible"
      width="400px"
      :show-close="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="projectForm"
        label-width="80px"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="项目名称"
          />
        </el-form-item>
        <el-form-item label="项目域名" prop="host">
          <el-input
            v-model="form.host"
            :placeholder="hostPlaceholder"
          />
        </el-form-item>
        <el-form-item label="标识色">
          <el-color-picker v-model="form.color" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="saveProject"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="删除项目"
      :visible="!!deleteProjectName"
      width="300px"
      :show-close="false"
      :modal-append-to-body="false"
    >
      <div slot="title">
        <i class="el-icon-warning-outline" style="color: #E6A23C"/>
        删除<span style="font-weight: bold;">{{ deleteProjectName }}</span> 项目
      </div>
      <div>确认删除 {{ deleteProjectName }} 项目吗？ <div style="color: #909399;line-height: 40px;">项目下的所有 mock 配置随之清空</div></div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="deleteProjectName = ''">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="confirmDeleteProject"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <div class="operator">
      <el-button type="text" @click="addProject()">
        <i class="el-icon-plus" />
        添加项目
      </el-button>
    </div>
  </div>
</template>

<script>
const originRegx = /^(?=^.{3,255}$)(http(s)?:\/\/)(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62}){0,}(:\d+)*$/
const hostPlaceholder = 'protocal://hostname[:port]'
export default {
  props: {
    rules: {
      type: Array,
    },
    currentProject: {
      type: String,
    },
    projectList: {
      type: Array,
    },
  },
  data() {
    const checkProjectNameUnique = (_rule, value, callback) => {
      const editProjectName = this.editProjectName
      const exitsProjectList = this.projectList.filter(item => item.name !== editProjectName)

      const index = exitsProjectList.findIndex(item => item.name === value)
      if (index >= 0) {
        callback('已存在同名的项目，请换个名吧')
      } else {
        callback()
      }
    }
    return {
      deleteFormVisible: true,
      dialogFormVisible: false,
      hostPlaceholder,
      editProjectName: '',
      deleteProjectName: '',
      form: {
        color: '#409EFF',
      },
      formRules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
          { validator: checkProjectNameUnique, trigger: 'blur' }
        ],
        host: [
          { required: true, message: '请输入项目域名', trigger: 'blur' },
          {
            pattern: originRegx, message: `请输入符合规格的域名，${hostPlaceholder}`
          }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    addRule(projectName) {
      this.$emit('addRule', projectName)
    },
    editRule(projectName, rule) {
      this.$emit('editRule', projectName, rule)
    },
    deleteRule(projectName, rule) {
      this.$emit('deleteRule', projectName, rule)
    },
    addProject() {
      this.form = {
        color: '#409EFF',
      }
      this.dialogFormVisible = true
    },
    saveProject() {
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          this.$emit('saveProject', {...this.form}, this.editProjectName)
          this.form = {color: '#409EFF'}
          this.editProjectName = ''
          return
        }
      })
    },
    deleteProjectByName(projectName) {
      this.deleteProjectName = projectName
    },
    confirmDeleteProject() {
      const projectName = this.deleteProjectName
      this.$emit('deleteProject', projectName)

      this.deleteProjectName = ''
    },
    editProject(projectName) {
      this.dialogFormVisible = true
      this.editProjectName = projectName
      this.form = this.projectList.find(item => item.name = projectName)
    },
    changeProject(project) {
      this.$emit('changeActiveProject', project)
    },
  },
}
</script>

<style lang="scss" scoped>
.menu {
  position: relative;
  flex-basis: 280px;
  flex-grow: 0;
  flex-shrink: 0;
  background: #fff;
  box-shadow: 0 0 3px 1px rgb(237 237 237 / 50%);
  padding-bottom: 42px;
  z-index: 10;
  .box {
    overflow-x: hidden;
    overflow-y: scroll;
    padding-top: 12px;
    width: 100%;
    height: 100%;
  }
  .operator {
    font-size: 14px;
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #f4f4f4;
    background-color: #fff;
    padding: 4px 12px 4px 12px;
  }
}
.projects-list {
  .item {
    .project-name {
      cursor: pointer;
      padding: 0 8px;
      height: 38px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      & >* {
        vertical-align: middle;
      }
      &.active {
        background-color: #ecf8ff;
        color: #409EFF;
        border-radius: 4px;
      }
    }
  }
}
.rule-items {
  & > .rule-item {
    padding: 0 8px 0 24px;
    cursor: pointer;
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    .delete-btn {
      display: none;
    }
    &:hover {
      .delete-btn {
        display: inline-block;
      }
      background-color: #f5f5f5;
    }
  }
}
.icon-circle {
  vertical-align: middle;
  margin-right: 6px;
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
