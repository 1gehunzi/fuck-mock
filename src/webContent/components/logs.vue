<template>
  <div style="height:100%;">
    <el-table
      size="mini"
      :data="list"
      stripe
      height="100%"
      style="width: 100%"
    >
      <el-table-column
        prop="request.url"
        label="Name"
      >
        <template slot-scope="scope">
          <div
            class="rule-name"
            @click="editRule(scope.row)"
          >
            <el-tag
              :type="scope.row.request.method === 'GET' ? 'success' : 'primary'"
              disable-transitions
            >
              {{ scope.row.request.method }}
            </el-tag>
            {{ formatLog(scope.row.request.url) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="response.status"
        label="Status"
        width="100"
      />
      <el-table-column
        align="center"
        prop="response.isMock"
        label="Mock"
        width="80"
      >
        <template slot-scope="scope">
          <span :style="{color: scope.row.response.isMock ? '#E6A23C' : ''}">
            {{ scope.row.response.isMock ? '拦截' : '穿透' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="request.type"
        label="Type"
        width="80"
      />
    </el-table>
    <!-- <div
      class="content"
    >
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
    </div> -->
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
  mounted() {
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
.rule-name {
  cursor: pointer;
}
</style>
