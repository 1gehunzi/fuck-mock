<template>
  <el-container class="container">
    <div class="header">
      <div style="line-height: 50px; padding: 0 12px">
        hijack, just mock.
      </div>
    </div>
    <div class="main">
      <menus
        :rules="rules"
        @add="addRules"
      />
      <div class="content">
        <div
          class="logs"
          style="overflow-y: scroll; height: 100%"
        >
          <div
            v-for="item in list"
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
    <el-drawer
      title="我是标题"
      size="50%"
      :visible.sync="addItem"
      direction="rtl"
      :before-close="handleClose"
    >
      <EditorForm @save-form="onSubmit" />
    </el-drawer>
  </el-container>
</template>

<script>
import { parse } from 'flatted'
import EditorForm from './components/form.vue'
import Menus from './components/menus.vue'
import {
  saveStorage,
  getStorageItem,
  AJAX_INTERCEPTOR_RULES,
  AJAX_INTERCEPTOR_SWITCHON,
} from '@/store'

export default {
  components: {
    EditorForm,
    Menus,
  },
  data() {
    return {
      addItem: false,
      toggle: false,
      formData: {
        path: '',
        method: 'GET',
        response: '',
        switchOn: true,
      },
      list: [],
      rules: [],
    }
  },
  mounted() {
    getStorageItem(AJAX_INTERCEPTOR_SWITCHON).then((result) => {
      this.toggle = result
    })

    getStorageItem(AJAX_INTERCEPTOR_RULES).then((result = []) => {
      this.rules = result

      this.formData = result[0] || {
        path: '',
        method: 'GET',
        response: '',
        switchOn: true,
      }
    })
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
    onSubmit(formData) {
      console.log(formData)
      let { rules } = this

      const index = rules.findIndex(item => {
        return item.path === formData.path && item.method === formData.method
      })

      console.log(index === -1 ? '新增' : '编辑', 'onSubmit------------------------');
      if (index >= 0) {
        rules[index] = formData
      } else {
        rules = [...rules, formData]
      }
      this.rules = rules
      saveStorage(AJAX_INTERCEPTOR_RULES, this.rules)
    },
    toggleSwitch(event) {
      console.log(event)
      saveStorage(AJAX_INTERCEPTOR_SWITCHON, event)
    },
    addRules() {
      this.addItem = true
    }
  },
}
</script>
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  cursor: default;
}

ul {
  margin: 0;
}

li {
  list-style: none;
}

html {
  font-size: 14px;
  user-select: none;
  height: 100%;
  width: 100%;
  min-height: 650px;
  min-width: 1000px;
  -ms-overflow-style: none;
}

body {
  font-family: Helvetica, Tahoma, Arial, 'Microsoft YaHei', '微软雅黑', SimSun,
    Heiti, '黑体', sans-serif, STXihei, '华文细黑';
  font-size: 1em;
  height: 100%;
  width: 100%;
  min-height: 650px;
  min-width: 1000px;
}

*::-webkit-input-placeholder {
  color: #aeaeae;
  font-size: 12px;
  line-height: 20px;
}

::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0);
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(174, 174, 174, 0.5);
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

  .content {
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;
    width: 800px;
    padding: 0;
    background-color: #f3f4f6;
  }
}
</style>
