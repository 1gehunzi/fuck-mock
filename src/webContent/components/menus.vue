<template>
  <div class="menu">
    <div class="box">
      <div class="projects-list">
        <div class="item active">
          <label>
            localhost
          </label>
          <span>
            <el-dropdown>
              <i class="el-icon-more-outline" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-circle-plus"
                ><span @click="addRule()">新增规则</span></el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus-outline">重命名</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus-outline">导出</el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus-outline">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div class="path-items">
          <div v-for="item in rules">
            {{ item.name }}
          </div>
        </div>
        <div class="item">
          localhost
        </div>
        <div class="item">
          localhost
        </div>
      </div>
    </div>
    <el-dialog
      title="新增项目"
      :visible.sync="dialogFormVisible"
      width="400px"
      :show-close="false"
      :modal-append-to-body="false"
    >
      <el-form
        :model="form"
        label-width="80px"
      >
        <el-form-item label="项目名称">
          <el-input
            v-model="form.name"
            placeholder="项目名称"
          />
        </el-form-item>
        <el-form-item label="项目域名">
          <el-input
            v-model="form.host"
            placeholder="项目域名"
          />
        </el-form-item>
        <el-form-item label="标识色">
          <el-color-picker
            v-model="form.color"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="saveProject"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <div class="operator">
      <div @click="addProject()">
        <i
          class="el-icon-plus"
        />
        添加项目
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rules: {
      type: Array,
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {}
    }
  },
  methods: {
    addRule() {
      this.$emit('add')
    },
    addProject() {
      this.dialogFormVisible = true
    },
    saveProject() {
      //
    }
  }
}
</script>

<style lang="scss" scoped>
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
    cursor: pointer;
    color: rgb(253, 85, 83);
    font-size: 14px;
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #f4f4f4;
    background-color: #fff;
    padding: 8px 12px 10px 12px;
  }
}
.projects-list {
  .item {
    padding: 0 8px;
    height: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    &.active {
      background-color: #f5f5f5;
      border-color: #f5f5f5;
      border-radius: 4px;
    }
  }
}
.path-items {
  padding: 0 8px;
  margin-left: 8px;
  background-color: #f9f5f5;
  border-color: #f5f5f5;
  &>div {
    height: 20px;
    line-height: 20px;
  }
}
</style>
