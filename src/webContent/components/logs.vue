<template>
  <div style="height: 100%">
    <el-table size="mini" :data="tableList" stripe height="100%" style="width: 100%">
      <el-table-column prop="request.url" label="Name">
        <template slot="header" slot-scope="scope">
          <el-input v-model="searchName" size="mini" placeholder="输入关键字搜索" clearable style="width: 260px"/>
        </template>
        <template slot-scope="scope">
          <div class="rule-name" @click="editRule(scope.row)">
            <el-tag
              :type="scope.row.request.method === 'GET' ? 'success' : 'primary'"
              disable-transitions
            >
              {{ scope.row.request.method }}
            </el-tag>
            <el-tooltip effect="dark" placement="top-start" class="tooltip">
              <div slot="content">
                <div class="tooltip">
                  {{ formatLog(scope.row.request.url).href }}
                </div>
                <!-- 多行信息<br>第二行信息 -->
              </div>
              <span>{{ formatLog(scope.row.request.url).pathname }}</span>
            </el-tooltip>
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
        :filters="[
          { text: '拦截', value: true },
          { text: '穿透', value: false },
        ]"
        :filter-method="mockFilterHandler"
      >
        <template slot-scope="scope">
          <span
            :style="{
              color: scope.row.response.isMock ? '#E6A23C' : '#909399',
            }"
          >
            {{ scope.row.response.isMock ? '拦截' : '穿透' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="request.type"
        label="Type"
        width="80"
        :filters="[
          { text: 'fetch', value: 'fetch' },
          { text: 'xhr', value: 'xhr' },
        ]"
        :filter-method="typeFilterHandler"
      />
    </el-table>
  </div>
</template>

<script>
import Url from 'url-parse'

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  computed:{
    tableList() {
      if (this.searchName === '') {
        return this.list
      }
      return this.list.filter(item => item.request.url.indexOf(this.searchName) > -1)
    }
  },
  data() {
    return {
      searchName: ''
    }
  },
  methods: {
    formatLog(url) {
      const targetUrl = new Url(url)

      return targetUrl
    },
    editRule(item) {
      this.$emit('editRuleByLog', item)
    },
    typeFilterHandler(value, row, column) {
      // const property = column['property'];

      return row.request.type === value
    },
    mockFilterHandler(value, row, column) {
      return row.response.isMock === value
    },
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
.tooltip {
  max-width: 400px;
}
</style>
