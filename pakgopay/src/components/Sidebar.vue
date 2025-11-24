<template>
  <div class="sidebar">
    <!-- 侧边栏内容 -->
   <ul>

      <li v-for="item in menuItems" :key="item.menuId" @click="showItems(item)">{{item.menuName}}
        <ul v-if="item.showItem" :key="item.menuId">
          <li v-for="child in item.children" :key="child.menuId" @click.stop="">
            <router-link class="menuRouter" :to="child.path.indexOf('MerchantReport')>0?child.path:''">{{child.menuName}}</router-link>
          </li>
        </ul>
      </li>
   </ul>
  </div>
</template>

<script>
import {menu} from "@/api/interface/backendInterface.js";

export default {
  name: 'Sidebar',
  data() {
    return {
      menuItems: JSON.parse(localStorage.getItem("menu"))
    }
  },
  mounted() {
    if(localStorage.getItem('menu') === null) {
      this.fetchMenu()
    } else {
      this.menuItems = JSON.parse(localStorage.getItem("menu"))
    }
  },
  methods: {
    async fetchMenu() {
      try {
        await menu().then(res => {
          if (res.status === 200) {
            this.menuItems = JSON.parse(res.data.data)
            localStorage.setItem('menu', JSON.stringify(this.menuItems))
          }
        })
      } catch (error) {
        console.error(error)
      }
    },
    showItems(item) {
      item.showItem = (item.showItem == true) ? false : true
      localStorage.setItem('menu',JSON.stringify(this.menuItems))
    },
    testButton() {
      alert("嘿嘿嘿")
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: darkslategrey;
  height: 100vh; /* 100% of the viewport height */
  width: 23vh; /* Adjust as needed */
  position: fixed; /* Or absolute based on your layout needs */
  left: 0;
  top: 0;
}
.sidebar ul {
  list-style-type: none;
  padding: 0;
  color: #f2f2f2;
}
.sidebar li {
  padding: 10px;
  color: #f2f2f2;
}

.menuRouter {
  text-decoration: none;
  color: #f2f2f2;
}


</style>
