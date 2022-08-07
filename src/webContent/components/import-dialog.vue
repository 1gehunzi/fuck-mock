<template>
  <el-dialog
    append-to-body
    title="导入配置文件"
    :visible="value"
  >
    <div style="text-align: center;">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        accept=".json"
        :limit="1"
        :auto-upload="false"
        :on-change="handleChange"
        action="/"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <div
          slot="tip"
          class="el-upload__tip"
        >
          只能上传 json 文件，且只能是从 Just Mock 插件导出的
        </div>
      </el-upload>
    </div>

    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeDialog">
        取 消
      </el-button>
      <el-button
        type="primary"
        @click="handleMerge"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  saveStorage,
  AJAX_INTERCEPTOR_CURRENT_PROJECT,
  AJAX_INTERCEPTOR_PROJECTS,
} from '@/store'
import { validProjectList, mergeProject } from './validate'
import { Message } from 'element-ui';

export default {
    props: {
      value: {
        type: Boolean
      }
    },
    data() {
        return {
          importJson: []
        }
    },
    methods: {
      closeDialog() {
        this.$emit("input", false);
      },
      handleChange (file) {
        const thisBak = this
        const reader = new FileReader()
        reader.readAsText(file?.raw, 'utf-8')
        reader.onload = function () {
          const json = JSON.parse(reader.result)

          thisBak.importJson = json

        }
      },

      handleMerge() {
        const thisBak = this
        chrome.storage.local.get(
          [AJAX_INTERCEPTOR_PROJECTS, AJAX_INTERCEPTOR_CURRENT_PROJECT],
          (result) => {
            const projectList = result[AJAX_INTERCEPTOR_PROJECTS] || []
            try {
              const importJson = [...thisBak.importJson]
              if (validProjectList(importJson)) {
                const newProjects = mergeProject(projectList, importJson)
                saveStorage(AJAX_INTERCEPTOR_PROJECTS, newProjects)
                location.reload()
                thisBak.closeDialog()
              } else {
                Message({type: 'error', message: '导入的文件不符合 Just Mock 插件规格'});
              }
            } catch(err) {
              Message({type: 'error', message: '导入的文件不符合 Just Mock 插件规格'});
            }

          }
        )
      }
    }
};
</script>

<style lang="scss" scoped>

</style>
