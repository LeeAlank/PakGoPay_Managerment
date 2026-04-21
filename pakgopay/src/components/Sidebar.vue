<template>
  <div :class="{'iscollapsed' : collapse}" class="sidebar">
      <div :class="{'collapse-title' : collapse}" class="title">PakGoPay</div>
      <!-- 侧边栏内容 -->
      <ul @click.stop="" class="firstMenu">
        <li v-for="item in menuItems" :key="item.menuId" @click="showItems(item)">
          <div class="first-menu-item" style="display: flex; justify-content: space-between;align-items: center">
            <div style=" display: flex;width: 90%;justify-content: space-between;align-items: center;">
              <SvgIcon :name="resolveMenuIcon(item)" style="height: 34px;width:40px;align-items: center;"/>
              <span v-if="!collapse" style="font-size: 17px;align-items: center;text-align: left;width: 75%;">{{ item.meta ? $t(JSON.parse(item.meta).title) : item.menuName}}</span>
            </div>
            <SvgIcon v-if="!collapse" style="height: 16px;width:16px;" :name="item.showItem?'right':'down'"/>
          </div>
          <ul class="secondMenu" v-if="item.showItem" :key="item.menuId" v-for="child in item.children">
            <li v-if="!collapse" @click.stop="" :key="child.menuId" :class="[$route.path === child.path ? 'selectedClass' : 'unselectedClass']">
              <router-link
                  ref="routerLink"
                  class="menuRouter"
                  :to="child.path">
                {{ child.meta ? $t(JSON.parse(child.meta).title) : child.menuName }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon/index.vue";

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
    this.reloadMenuItems()
    this._menuUpdatedListener = () => {
      this.reloadMenuItems()
    }
    window.addEventListener("menu-updated", this._menuUpdatedListener)
  },
  beforeUnmount() {
    if (this._menuUpdatedListener) {
      window.removeEventListener("menu-updated", this._menuUpdatedListener)
    }
  },
  methods: {
    reloadMenuItems() {
      this.menuItems = JSON.parse(localStorage.getItem('menu')) || []
      this.ensureHomeMenu()
      this.expandActiveMenu()
    },
    normalizeMenuMetaTitle(item, titleKey) {
      if (!item) {
        return
      }
      let meta = null
      if (item.meta) {
        try {
          meta = typeof item.meta === 'string' ? JSON.parse(item.meta) : item.meta
        } catch (error) {
          meta = null
        }
      }
      if (!meta || !meta.title) {
        meta = { ...(meta || {}), title: titleKey }
        item.meta = JSON.stringify(meta)
      }
    },
    resolveMenuIcon(item) {
      const homePath = "/web/pakGoPay";
      if (Array.isArray(item?.children) && item.children.some(child => child.path === homePath)) {
        return "home";
      }
      return item?.icon || "orderNum";
    },
    ensureHomeMenu() {
      const homePath = "/web/pakGoPay";
      const homeItem = this.menuItems.find(item =>
        Array.isArray(item.children) && item.children.some(child => child.path === homePath)
      )
      if (homeItem) {
        this.normalizeMenuMetaTitle(homeItem, 'route.home')
        const homeChild = homeItem.children.find(child => child.path === homePath)
        this.normalizeMenuMetaTitle(homeChild, 'route.home')
      } else {
        const homeMenu = {
          menuId: "home",
          menuName: this.$t('route.home'),
          icon: "orderNum",
          showItem: true,
          meta: JSON.stringify({ title: "route.home" }),
          children: [
            {
              menuId: "home-1",
              menuName: this.$t('route.home'),
              path: homePath,
              meta: JSON.stringify({ title: "route.home" })
            }
          ]
        };
        this.menuItems.unshift(homeMenu);
      }
      localStorage.setItem("menu", JSON.stringify(this.menuItems));
    },
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
    expandActiveMenu() {
      const currentPath = this.$route?.path || localStorage.getItem('currentPath')
      if (!currentPath || !Array.isArray(this.menuItems)) {
        return
      }
      this.menuItems.forEach(item => {
        if (!Array.isArray(item.children)) {
          return
        }
        const hasActiveChild = item.children.some(child => child.path === currentPath)
        if (hasActiveChild) {
          item.showItem = true
        }
      })
      localStorage.setItem('menu', JSON.stringify(this.menuItems))
    },
    testButton() {

    },
    changeCollapse() {
      this.collapse = !this.collapse
    }
  }
  ,
  watch: {
    '$route.path'() {
      this.expandActiveMenu()
    },
    '$i18n.locale'() {
      this.ensureHomeMenu()
    }
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #334155;
  height: 100vh; /* 100% of the viewport height */
  /*width: 20vh;*/ /* Adjust as needed */
  width: 13%;
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
  font-size: medium;
  /*margin: 10px;*/
  padding-top: 0;
  padding-bottom: 0;
  height: 100%;
  width: 100%;
  cursor: pointer;
}
.first-menu-item {
  transition: transform 0.15s ease, background-color 0.15s ease;
  border-radius: 10px;
  padding: 10px 6px;
}

.first-menu-item:hover {
  transform: scale(1.06);
  transform-origin: left center;
  background-color: #475569;
  box-shadow: inset 0 0 0 1px rgba(241, 245, 249, 0.18);
}

.menuRouter {
  transition: transform 0.15s ease, background-color 0.15s ease;
  border-radius: 10px;
  box-sizing: border-box;
}

.menuRouter:hover {
  transform: none;
  background-color: #475569;
  box-shadow: inset 0 0 0 1px rgba(241, 245, 249, 0.18);
  color: #F1F5F9;
  font-size: 20px;
}

.menuRouter {
  text-decoration: none;
  color: #CBD5E1;
  margin: 0;
  height: 100%;
  padding: 10px 6px;
  width: 100%;
  display: block;
  align-items: center;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.selectedClass {
  background-color: transparent;
  transform: none;
  color: #f2f2f2;
  margin: 0;
  border-radius: 10px;
}

.selectedClass .menuRouter {
  background-color: #475569;
  color: #F8FAFC;
  box-shadow: inset 0 0 0 1px rgba(241, 245, 249, 0.18);
}

.firstMenu {
  list-style-type: none;
  color: #f2f2f2;
  font-size: 18px;
  padding: 2px;
  margin-left: 15px;
  width: 80%;
}

.secondMenu {
  list-style-type: none;
  color: #f2f2f2;
  font-size: 18px;
  padding: 0;
  margin-left: 15px;
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  justify-items: center;
  border-radius: 10px;
}

.secondMenu li {
  padding-top: 0;
  padding-bottom: 0;
  margin: 0;
}

.unselectedClass {
  background: transparent;
  border-radius: 10px;
  overflow: hidden;
}

.unselectedClass .menuRouter {
  border-radius: 10px;
}

.sidebar.collapsed {
  width: 60px; /* 或者任何你希望折叠后的宽度 */
  overflow: auto;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 999px;
}

.iscollapsed::-webkit-scrollbar {
  width: 0;
  height: 0;
}

</style>
