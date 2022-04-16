<template>
  <el-container class="container">
    <div class="header">
      <div style="line-height: 50px;padding: 0 12px">
        hijack, just mock.
      </div>
    </div>
    <div class="main">
      <div class="menu">
        <div class="box">
          <div class="projects-list">
            <div class="item active">
              localhost
            </div>
            <div class="item">
              localhost
            </div>
            <div class="item">
              localhost
            </div>
          </div>
        </div>
        <div class="operator">
          +添加
        </div>
      </div>
      <div class="content">
        <div
          class="logs"
          style="overflow-y: scroll;height: 100%;"
        >
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
      </div>
    </div>
    <!-- <el-container class="container">
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

          </div>
        </el-col>
      </el-row>
      <EditorForm />
    </el-container> -->
  </el-container>
</template>

<script>
import { parse } from 'flatted'
import EditorForm from './components/form.vue'

export default {
  components: {
    EditorForm,
  },
  data() {
    return {
      list: [],
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
    })
  },
  methods: {
    onJsonChange(value) {
      console.log('value:', value)
    },
  },
}
</script>
<style>

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    cursor: default
}

ul {
    margin: 0
}

li {
    list-style: none
}

html {
    font-size: 14px;
    user-select: none;
    height: 100%;
    width: 100%;
    min-height: 650px;
    min-width: 1000px;
    -ms-overflow-style: none
}

body {
    font-family: Helvetica,Tahoma,Arial,'Microsoft YaHei','微软雅黑',SimSun,Heiti,'黑体',sans-serif,STXihei,'华文细黑';
    font-size: 1em;
    height: 100%;
    width: 100%;
    min-height: 650px;
    min-width: 1000px
}

*::-webkit-input-placeholder {
    color: #aeaeae;
    font-size: 12px;
    line-height: 20px
}

::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background-color: rgba(0,0,0,0)
}

::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: rgba(0,0,0,0)
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: rgba(174,174,174,0.5)
}
</style>
<style lang="scss" scoped>

.container {
  height: 100%;
  .header {
    position: fixed;
    top: 0;
    z-index: 1000;
    width: 100%;
    height: 50px;
    background: #fff;
    box-shadow: 0 0 3px 1px rgb(224 224 224 / 50%);
  }
  .main {
    height: 100%;
    width: 100%;
    min-height: 650px;
    min-width: 900px;
    position: relative;
    padding-top: 50px;
    overflow: hidden;
    display: flex;
  }
  .menu {
    position: relative;
    flex-basis: 280px;
    flex-grow: 0;
    flex-shrink: 0;
    background: #fff;
    box-shadow: 0 0 3px 1px rgb(237 237 237 / 50%);
    padding-bottom: 42px;
    z-index: 10;
    .box {
      overflow-x: hidden;
      overflow-y: scroll;
      padding-top: 12px;
      width: 100%;
      height: 100%;
    }
    .operator {
      position: absolute;
      bottom: 0;
      height: 42px;
      width: 100%;
      border-top: 1px solid #f4f4f4;
      background-color: #fff;
      padding: 8px 12px 10px 12px;
    }
  }
  .content {
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;
    width: 800px;
    padding: 0;
    background-color: #F3F4F6;
  }
}
.projects-list {
  .item {
    padding-left: 8px;
    height: 38px;
    line-height: 38px;
    background-color: #fff;
    &.active {
      background-color: #f5f5f5;
      border-color: #f5f5f5;
    }
  }
}
</style>
