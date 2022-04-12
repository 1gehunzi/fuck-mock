<template>
  <el-container class="container">
    <el-header>Fuck Mock</el-header>
    <el-main>
      <EditorForm />
    </el-main>
  </el-container>
</template>

<script>
import EditorForm from './components/form.vue'

export default {
  components: {
    EditorForm,
  },
  data() {
    return {}
  },
  mounted() {
    chrome.runtime.onMessage.addListener((event) => {
       console.log(' chrome.runtime.onMessage.addListener', JSON.parse(event.detail))
    });
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
