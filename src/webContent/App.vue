<template>
  <el-container class="container">
    <el-header>Fuck Mock</el-header>
    <el-main>
      <el-switch v-model="value" />
      <EditorForm />
      <!-- <vue-json-editor
        v-model="json"
        :show-btns="true"
        :expanded-on-start="true"
        @json-change="onJsonChange"
      /> -->
    </el-main>
  </el-container>
</template>

<script>
// import vueJsonEditor from 'vue-json-editor'
import EditorForm from './components/form.vue'

export default {
  components: {
    // vueJsonEditor,
    EditorForm,
  },
  data() {
    return {
      value: true,
      json: {
        msg: 'demo of jsoneditor',
      },
    }
  },
  methods: {
    onJsonChange(value) {
      console.log('value:', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
}
</style>
