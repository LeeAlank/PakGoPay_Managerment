<script setup>

import Sidebar from "@/views/Sidebar.vue";
</script>

<template id="app">
  <div>
    <sidebar></sidebar>
  </div>
  <router-link to="/welcome">welcome</router-link>
  <router-view>

  </router-view>
</template>
<script>
  export default {
    name: 'app'
  }
</script>
<style scoped>

</style>