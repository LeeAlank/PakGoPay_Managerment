<template>
  <div :class="{'iscollapsed' : collapse}" class="sidebar">
      <div :class="{'collapse-title' : collapse}" class="title">PakGoPay</div>
      <!-- 侧边栏内容 -->
      <ul @click.stop="" class="firstMenu">
        <li v-for="item in menuItems" :key="item.menuId" @click="showItems(item)">
          <div style="display: flex; justify-content: space-between;align-items: center;">
            <div style="justify-content: flex-start">
              <SvgIcon :name="item.icon" style="height: 14px;margin-right: 2px;"/>
              <span v-if="!collapse" style="font-size: 15px;">{{item.menuName}}</span>
            </div>
            <SvgIcon v-if="!collapse" style="height: 10px;justify-content: flex-end;" :name="item.showItem?'right':'down'"/>
          </div>
          <ul class="secondMenu" v-if="item.showItem" :key="item.menuId" v-for="child in item.children">
            <li v-if="!collapse" @click.stop="" :key="child.menuId" :class="[$route.path === child.path ? 'selectedClass' : 'unselectedClass']">
              <router-link
                  ref="routerLink"
                  class="menuRouter"
                  :to="child.path">{{child.menuName}}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
</template>

<script>
import {menu} from "@/api/interface/backendInterface.js";
import SvgIcon from "@/components/SvgIcon/index.vue";
import {getAsyncRoutes} from "@/router/asyncRouter.js";
import router from "@/router/index.js";

export default {
  props: [
    'collapse'
  ],
  name: 'Sidebar',
  components: {SvgIcon},
  data() {
    return {
      menuItems: []
      /*menuItems: JSON.parse(localStorage.getItem("menu")),*/
      /*collapse: false,*/
    }
  },
  created() {
    /*if(localStorage.getItem('menu') === null) {
      this.fetchMenuList()
    } else {
      getAsyncRoutes(this.menuItems).forEach((route) => {
        console.log("sssss---",route)
        router.addRoute(route)
      })
    }*/
  },
  mounted() {
    this.menuItems = JSON.parse(localStorage.getItem('menu'))
  },
  methods: {
    /*async fetchMenu() {
      try {
        await menu().then(res => {
          if (res.status === 200 && res.data.data) {
            this.menuItems = JSON.parse(res.data.data)
            localStorage.setItem('menu', JSON.stringify(this.menuItems))
          }
        })
      } catch (error) {
        console.error(error)
      }
    },
    async fetchMenuList() {
      await menu().then(res => {
        if (res.status === 200 && res.data.data) {
          this.menuItems = JSON.parse(res.data.data)
          localStorage.setItem('menu', JSON.stringify(this.menuItems))
          // 根据菜单提取路由
        getAsyncRoutes(this.menuItems).forEach((route) => {
            router.addRoute(route)
          })
        }
      })
    },*/
    showItems(item) {
      item.showItem = (item.showItem == true) ? false : true
      localStorage.setItem('menu',JSON.stringify(this.menuItems))
    },
    testButton() {
      alert("嘿嘿嘿")
    },
    changeCollapse() {
      this.collapse = !this.collapse
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: darkslategrey;
  height: 100vh; /* 100% of the viewport height */
  /*width: 20vh;*/ /* Adjust as needed */
  width: 11%;
  position: fixed; /* Or absolute based on your layout needs */
  left: 0;
  top: 0;
  overflow: auto;
}

.title {
  text-align: center;
  font-size: larger;
  padding-top: 40px;
}

collapse-title {
  visibility: hidden;
}

.nocollapsed {

  width: 20vw;
}
.iscollapsed {
  width: 30px;
  display: none;
}
.sidebar li {
  color: #f2f2f2;
  font-size: small;
  margin: 0;
  height: 100%;
  padding: 2px;
  width: 100%;
  cursor: pointer;
}

.menuRouter {
  text-decoration: none;
  color: #f2f2f2;
  margin: 0;
  height: 100%;
  padding: 1px;
  width: 100%;
  display: block;
}

.selectedClass {
  background-color: #001529;
  color: #f2f2f2;
  margin: 0;
}

.firstMenu {
  list-style-type: none;
  color: #f2f2f2;
  font-size: 18px;
  padding: 2px;
  margin-left: 15px;
  width: 70%;
}

.secondMenu {
  list-style-type: none;
  color: #f2f2f2;
  font-size: 18px;
  padding: 0;
  margin-left: 15px;
}

.unselectedClass {
  /*background-color: #203030;*/
  background: linear-gradient(to right, #2f4f4f, #4f6f6f); /* 渐变高亮 */
}

.sidebar.collapsed {
  width: 60px; /* 或者任何你希望折叠后的宽度 */
  overflow: auto;

}

</style>
