<template>
  <div style="padding: 0 20px;">
    <el-form
      ref="ruleForm"
      :inline="false"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      label-position="left"
    >
      <el-form-item
        label="Name"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          placeholder="请输入规则名称"
        />
      </el-form-item>
      <el-form-item
        label="switchOn"
        prop="switchOn"
      >
        <el-switch v-model="formData.switchOn" />
      </el-form-item>
      <el-form-item
        label="Path"
        prop="path"
      >
        <el-input
          v-model="formData.path"
          placeholder="请输入接口路径"
        />
      </el-form-item>
      <el-form-item label="Method">
        <el-select
          v-model="formData.method"
          placeholder="请选择请求方法"
        >
          <el-option
            label="GET"
            value="GET"
          />
          <el-option
            label="POST"
            value="POST"
          />
          <el-option
            label="PUT"
            value="PUT"
          />
          <el-option
            label="DELETE"
            value="DELETE"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Delay">
        <el-input-number
          v-model="formData.delay"
          placeholder="响应延时"
          controls-position="right"
        /> （ms）
      </el-form-item>
      <el-form-item label="Code">
        <el-select
          v-model="formData.status"
          placeholder="请输入响应状态码"
        >
          <el-option
            label="200"
            :value="200"
          />
          <el-option
            label="201"
            :value="201"
          />
          <el-option
            label="500"
            :value="500"
          />
          <el-option
            label="401"
            :value="401"
          />
          <el-option
            label="403"
            :value="403"
          />
          <el-option
            label="404"
            :value="404"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="Response"
        prop="response"
      >
        <VueJsonEditor
          ref="jsonEditor"
          v-model="formData.response"
          style="height: 400px"
          :mode="editorMode"
          :modes="modes"
          :expanded-on-start="true"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VueJsonEditor from 'vue-json-tool'
const defaultForm = {
  name: '',
  path: '',
  status: 200,
  method: 'GET',
  response: '',
  switchOn: true,
}
export default {
  components: {
    VueJsonEditor,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    projectList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const checkJsonInput = (_rule, value, callback) => {
      this.$refs.jsonEditor
      if (this.$refs.jsonEditor.error) {
        callback('请检查 Json 输入')
      }
      callback()
    }

    const checkUniqueName = (_rule, value, callback) => {
      const { name } = this.data
      const rules = this.rules.filter(item => item.name !== name)
      const exits = rules.findIndex(item => item.name === value) >= 0
      if (exits) {
        callback('规则名已经存在')
      }
      callback()
    }
    return {
      formRules: {
        name: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
          { min: 4, max: 60, message: '长度在 4 到 60 个字符', trigger: 'blur' },
          { validator: checkUniqueName }
        ],
        path: [
          { required: true, message: '请输入规则', trigger: 'blur' },
        ],
        response: [
          { validator: checkJsonInput },
        ],
      },
      editorMode: 'code',
      modes: ['code', 'tree', 'text'],
      formData: {},
    }
  },
  computed: {
    rules() {
      const projectName = this.data.projectName
      const currentProject = this.projectList.find(item => item.name === projectName)

      return currentProject.rules || []
    }
  },
  mounted() {
    this.formData = { ...defaultForm, ...this.data }
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('save-form', { ...this.formData })
        }
      })
    },
  },
}
</script>
<style>
.jsoneditor-vue {
  height: 100%;
}
.el-drawer__header {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  color: #72767b;
  display: flex;
  margin-bottom: 16px;
  padding: 12px 12px 0;
}
.el-form-item__label:before {
    display: none;
    color: #F56C6C;
    margin-right: 0;
    font-size: 0;
}
</style>
