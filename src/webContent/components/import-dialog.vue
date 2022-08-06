<template>
  <el-dialog
    append-to-body
    title="导入配置文件"
    :visible="value"
  >
    <div style="text-align: center;">
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
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
        @click="closeDialog"
      >
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
    props: {
      value: {
        type: Boolean
      }
    },
    data() {
        return {
          // dialogFormVisible: true
        }
    },
    methods: {
      closeDialog() {
        console.log('ffffffff', 'closeDialog')
        this.$emit("input", false);
      }
    }
};
</script>

<style lang="scss" scoped>

</style>
