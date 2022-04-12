<template>
  <div>
    <el-switch
      v-model="toggle"
      @change="toggleSwitch"
    />

    <el-form
      :inline="false"
      :model="formData"
      label-width="80px"
      label-position="left"
    >
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
            value="get"
          />
          <el-option
            label="POST"
            value="post"
          />
        </el-select>
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
import { saveStorage, getStorageItem, AJAX_INTERCEPTOR_RULES, AJAX_INTERCEPTOR_SWITCHON } from '@/store'

export default {
  components: {
    VueJsonEditor,
  },
  data() {
    return {
      toggle: false,
      editorMode: 'code',
      modes: ['code'],
      formData: {
        path: '',
        method: 'get',
        response: '',
      },
    }
  },
  mounted() {
    getStorageItem(AJAX_INTERCEPTOR_SWITCHON).then((result) => {
      this.toggle = result
    })

    getStorageItem(AJAX_INTERCEPTOR_RULES).then((result) => {
      console.log(result, '------------------- result')
      this.formData = result || {
        path: '',
        method: 'get',
        response: '',
      }
    })
  },
  methods: {
    onSubmit() {
      console.log(this.formData)
      saveStorage(AJAX_INTERCEPTOR_RULES, this.formData)
    },
    toggleSwitch(event) {
      console.log(event)
      saveStorage(AJAX_INTERCEPTOR_SWITCHON, event)
    },
  },
}
</script>
