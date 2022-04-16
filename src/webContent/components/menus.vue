<template>
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
</template>

<script>
export default {}
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
