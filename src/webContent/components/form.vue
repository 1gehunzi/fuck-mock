<template>
  <div>
    <el-form
      :inline="false"
      :model="formData"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="Name">
        <el-input
          v-model="formData.name"
          placeholder="请输入接口名称"
        />
      </el-form-item>
      <el-form-item label="Path">
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
        </el-select>
      </el-form-item>
      <el-form-item label="Delay">
        <el-input
          v-model="formData.delay"
          placeholder="请属于延时毫秒"
        />
      </el-form-item>
      <el-form-item label="Response">
        <VueJsonEditor
          v-model="formData.response"
          :mode="editorMode"
          :modes="modes"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          创建
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VueJsonEditor from 'vue-json-editor'

export default {
  components: {
    VueJsonEditor,
  },
  data() {
    return {
      editorMode: 'code',
      modes: ['code', 'tree', 'text'],
      formData: {
        name: '',
        path: '',
        method: 'GET',
        response: '',
        switchOn: true,
      },
    }
  },
  mounted() {

  },
  methods: {
    onSubmit() {
      this.$emit('save-form', this.formData)
    },
  },
}
</script>
