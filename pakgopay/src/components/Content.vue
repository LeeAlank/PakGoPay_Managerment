<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: ['collapse']
}
</script>

<style scoped>
/*.content {
  margin-left: 250px; !* 与侧边栏的默认宽度一致 *!
  transition: margin-left 0.3s;
}
.content.collapsed {
  margin-left: 50px; !* 与侧边栏的折叠宽度一致 *!
}*/

</style>
