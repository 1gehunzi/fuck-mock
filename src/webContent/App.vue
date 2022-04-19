<template>
  <div class="container">
    <div class="main">
      <menus
        :rules="rules"
        :project-list="projectList"
        :current-project="currentProject"
        @saveProject="saveProject"
        @deleteProject="deleteProject"
        @addRule="addRules"
        @editRule="editRule"
        @deleteRule="deleteRule"
        @changeActiveProject="changeActiveProject"
      />
      <div class="content">
        <div class="header">
          <div class="info">
            {{ activeProject.host }}
            <el-switch
              v-if="activeProject.host"
              v-model="activeProject.toggle"
              :width="30"
              @change="toggleSwitch"
            />
          </div>
        </div>
        <div
          class="logs"
          style="overflow-y: scroll; height: 100%"
        >
          <Logs :list="list" />
        </div>
      </div>
    </div>
    <el-drawer
      v-if="addItem"
      title="我是标题"
      size="50%"
      :visible.sync="addItem"
      direction="rtl"
    >
      <EditorForm @save-form="onSubmit" :data="this.formData"/>
    </el-drawer>
  </div>
</template>

<script>
import { parse } from 'flatted'
import EditorForm from './components/form.vue'
import Menus from './components/menus.vue'
import Logs from './components/logs.vue'
import {
  saveStorage,
  AJAX_INTERCEPTOR_CURRENT_PROJECT,
  AJAX_INTERCEPTOR_PROJECTS,
} from '@/store'

export default {
  components: {
    EditorForm,
    Menus,
    Logs
  },
  data() {
    return {
      currentProject: '',
      editKey: '',
      projectList: [],
      addItem: false,
      formData: {
        path: '',
        method: 'GET',
        response: '',
        switchOn: true,
      },
      list: [],
    }
  },
  computed: {
    activeProject() {
      const current = this.projectList.find(item => item.name === this.currentProject) || {}
      return current
    },
    rules() {
      return this.activeProject.rules || []
    },
    toggle() {
      return this.activeProject.switchOn
    }
  },
  mounted() {
    chrome.storage.local.get(
      [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
      (result) => {
        this.currentProject = result[AJAX_INTERCEPTOR_CURRENT_PROJECT]
        this.projectList = result[AJAX_INTERCEPTOR_PROJECTS] || []
      }
    )
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
    onSubmit(formData) {
      const editKey = this.editKey

      const current = this.projectList.find(item => item.name === this.editKey)
      let  rules  = current.rules || []

      const index = rules.findIndex((item) => {
        return item.path === formData.path && item.method === formData.method
      })

      if (index >= 0) {
        rules[index] = formData
      } else {
        rules = [...rules, formData]
      }
      const activeProject = {...current, rules}
      this.formData = {}
      this.addItem = false
      this.saveProject(activeProject)
    },
    addRules(projectName) {
      this.formData = {}
      this.addItem = true
      this.editKey = projectName
    },
    editRule(projectName, rule) {
      console.log(projectName, rule, '--------------------------------------')
      this.editKey = projectName
      this.addItem = true
      this.formData = rule
    },
    deleteRule(projectName, rule) {
       const current = this.projectList.find(item => item.name === projectName)
       let  rules  = current.rules || []

      const index = rules.findIndex((item) => {
        return item.path === rule.path && item.method === rule.method
      })

      rules.splice(index, 1);
      const activeProject = {...current, rules}
       this.saveProject(activeProject)
    },
    changeActiveProject(project) {
      saveStorage(AJAX_INTERCEPTOR_CURRENT_PROJECT, project)
      this.currentProject = project
    },
    toggleSwitch(event) {
      const activeProject = {...this.activeProject, switchOn: event}
      this.saveProject(activeProject)
    },
    saveProject(project) {
      let { projectList } = this

      const index = projectList.findIndex((item) => {
        return item.name === project.name
      })

      if (index >= 0) {
        projectList[index] = project
      } else {
        projectList = [...projectList, project]
      }
      this.projectList = [...projectList]
      saveStorage(AJAX_INTERCEPTOR_PROJECTS, this.projectList)
    },
    deleteProject(projectName) {
      let { projectList } = this

      const index = projectList.findIndex((item) => {
        return item.name === projectName
      })

      projectList.splice(index, 1)
      this.projectList = [...projectList]
      saveStorage(AJAX_INTERCEPTOR_PROJECTS, this.projectList)
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
  /* min-height: 650px;
  min-width: 1000px; */
  -ms-overflow-style: none;
}

body {
  font-family: Helvetica, Tahoma, Arial, 'Microsoft YaHei', '微软雅黑', SimSun,
    Heiti, '黑体', sans-serif, STXihei, '华文细黑';
  font-size: 1em;
  height: 100%;
  width: 100%;
  /* min-height: 650px;
  min-width: 1000px; */
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
  width: 100%;
  .header {
    position: absolute;
    top: 0;
    z-index: 12;
    width: 100%;
    background: #fff;
    padding: 0 16px;
    .info {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    // box-shadow: 0 0 0px 1px rgb(224 224 224 / 50%);
  }
  .main {
    height: 100%;
    width: 100%;
    min-height: 650px;
    min-width: 900px;
    position: relative;
    overflow: hidden;
    display: flex;
  }

  .content {
    padding-top: 50px;
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;
    background-color: #f3f4f6;
  }
}
.log-item {
  height: 20px;
  line-height: 20px;
  &:hover {
    background: #eee;
  }
}
</style>
