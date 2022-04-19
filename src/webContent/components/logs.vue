<template>
  <div>
    <div
      v-for="item in list"
      :key="item.request.url"
      class="log-item"
    >
      {{ formatLog(item.request.url) }}
      <el-tag
        effect="dark"
        type="success"
      >
        {{ item.request.method }}
      </el-tag>
      <span>{{ item.response.status }}</span>
      <span>{{ item.response.isMock ? '拦截' : '穿透' }}</span>
    </div>
  </div>
</template>

<script>
import Url from 'url-parse'

export default {
  props: {
    list: {
      type: Array
    }
  },
  methods: {
    formatLog(url) {
      const targetUrl = new Url(url)
      const str = targetUrl.pathname

      return str
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
