<template>
  <el-container class="container">
    <el-row type="flex">
      <el-col
        :span="7"
        style="height: 100vh; overflow: scroll"
      >
        <div class="grid-content bg-purple">
          dfdfdf
        </div>
      </el-col>
      <el-col :span="19">
        <div style="height: 100vh; overflow: scroll">
          <div
            v-for="(item) in list"
            :key="item.request.url"
          >
            {{ item.request.url }}
            <el-tag
              effect="dark"
              type="success"
            >
              {{ item.request.method }}
            </el-tag>
            <span>{{ item.response.status }}</span>
            <span>{{ item.request.type }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- <EditorForm /> -->
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
          console.log(result.request, result.response)
          this.list = [...this.list, result]
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
  height: 100vh;
}
</style>
