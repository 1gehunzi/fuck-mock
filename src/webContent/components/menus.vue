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
                ><span @click="alertInfo(123)">新增规则</span></el-dropdown-item>
                <el-dropdown-item icon="el-icon-circle-plus-outline">重命名</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <div class="path-items">
          <div v-for="item in rules">
            {{ item.path }}
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
    <div class="operator">
      +添加项目
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
  methods: {
    alertInfo() {
      // alert(12212)
      console.log(this.rules)
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
    position: absolute;
    bottom: 0;
    height: 42px;
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
