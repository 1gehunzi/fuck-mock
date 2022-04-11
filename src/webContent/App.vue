<template>
  <el-container class="container">
    <el-header>Fuck Mock</el-header>
    <el-main>
      <EditorForm />
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
