<template>
  <div>
    <div class="content">
      <div
        v-for="(item, index) in list"
        :key="item.request.url + index"
        class="log-item"
        @click="editRule(item)"
      >
        <span>
          {{ item.request.method }}
        </span>
        {{ formatLog(item.request.url) }}
        <span>{{ item.response.status }}</span>
        <span>{{ item.response.isMock ? '拦截' : '穿透' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Url from 'url-parse'

export default {
  props: {
    list: {
      type: Array,
    },
  },
  methods: {
    formatLog(url) {
      const targetUrl = new Url(url)
      const str = targetUrl.pathname
      return str
    },
    editRule(item) {
      this.$emit('editRuleByLog', item)
    }
  },
}
</script>

<style lang="scss" scoped>
.content {
  padding: 8px;
  .log-item {
    height: 20px;
    line-height: 20px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>
