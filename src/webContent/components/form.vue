<template>
  <div style="padding: 0 20px;">
    <el-form
      :inline="false"
      :model="formData"
      :rules="formRules"
      ref="ruleForm"
      label-width="80px"
      label-position="left"

    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="请输入接口名称" />
      </el-form-item>
      <el-form-item label="Path" prop="path">
        <el-input v-model="formData.path" placeholder="请输入接口路径" />
      </el-form-item>
      <el-form-item label="Method">
        <el-select v-model="formData.method" placeholder="请选择请求方法">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
        </el-select>
      </el-form-item>
      <el-form-item label="Delay">
        <el-input-number v-model="formData.delay" placeholder="响应延时" controls-position="right" /> （ms）
      </el-form-item>
      <el-form-item label="Code">
        <el-select v-model="formData.status" placeholder="请输入响应状态码">
          <el-option label="200" :value="200" />
          <el-option label="500" :value="500" />
          <el-option label="401" :value="401" />
          <el-option label="403" :value="403" />
        </el-select>
      </el-form-item>
      <el-form-item label="Response" prop="response">
        <VueJsonEditor
          style="height: 400px"
          v-model="formData.response"
          :mode="editorMode"
          :modes="modes"
          :expandedOnStart="true"
          ref="jsonEditor"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit"> 保存 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VueJsonEditor from 'vue-json-editor'
const defaultForm = {
  name: '',
  path: '',
  status: 200,
  method: 'GET',
  response: '',
  switchOn: true,
}
export default {
  props: {
    data: {
      type: Object,
      default: {},
    },
  },
  components: {
    VueJsonEditor,
  },
  mounted() {
    this.formData = { ...defaultForm, ...this.data }
  },
  data() {
    const checkJsonInput = (_rule, value, callback) => {
      this.$refs.jsonEditor
      if (this.$refs.jsonEditor.error) {
        callback('请检查 Json 输入')
      }
      callback()
    }
    return {
      formRules: {
        name: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
          { min: 5, max: 60, message: '长度在 5 到 60 个字符', trigger: 'blur' },
          // { validator: checkRuleNameUnique, trigger: 'blur' }
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
      formData: {

      },
    }
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
</style>
