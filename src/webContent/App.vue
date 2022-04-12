<template>
  <el-container class="container">
    <el-header>Fuck Mock</el-header>
    <el-main>
      <div
        v-for="(item, index) in list"
        :key="item.config.url + index"
      >
        {{ item.config.url }}
      </div>
      <EditorForm />
    </el-main>
  </el-container>
</template>

<script>
import { parse } from 'flatted';
import EditorForm from './components/form.vue'

export default {
  components: {
    EditorForm,
  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    chrome.runtime.onMessage.addListener((event) => {
      try {
        if (event.type === 'ajaxInterceptor') {
          const result = parse(event.detail)

          this.list = [result, ...this.list]
        }

      } catch (e) {
        console.warn('sddddddddddd', e, event)
      }

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
