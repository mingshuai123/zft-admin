<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="(route,index) in routes" :key="index" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { getRoleId } from '@/utils/auth' // get token from cookie
import {router,dynamicRouter} from '@/router'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      var hasAdd=JSON.parse(sessionStorage.getItem('addRouter'));
      if(!hasAdd){
        var dR = new Array(),role=getRoleId();
        dynamicRouter.forEach((item) => {
          if(item.meta.roles==role && item.children){
            let dR2=new Array();
            item.children.forEach(xx=>{
                dR2.push(xx)
              dR2.length>0?item.children=dR2:false;
            })
            dR.push(item);
          }
        });
        this.$router.addRoutes(dR);
        this.$router.options.routes=this.$router.options.routes.concat(dR);
      }
      sessionStorage.setItem('addRouter',false)
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
