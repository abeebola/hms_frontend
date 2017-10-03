<template>
  <div id="app" :class="{'logged-in': showHeader}">
    <header id="site-header" v-show="showHeader">
      <div class="container-fluid">
        <span>
          <span class="snack" @click.stop="toggleSideMenu">
            <i class="fa fa-bars">&nbsp;</i>
          </span>
          <a href="/" class="home">
            <i class="fa fa-home">&nbsp;</i>
            Harmony Management System
          </a>
        </span>
        <span class="logout" v-if="isLoggedIn" @click="logout()"> Log out</span>
      </div>
    </header>
    <main>
      <div class="side-menu" v-if="showHeader && sideMenuVisible" :class="{expanded: expanded}">
        <span class="hs" @click.stop="toggleSideMenu">
          <i class="fa fa-angle-left"></i>
        </span>
        <ul class="menu-list">
          <li class="menu-item">
            <router-link :to="{path: '/members'}" tag="a" active-class="active">
              <i class="fa fa-user">&nbsp;</i> Members</router-link>
          </li>
          <li class="menu-item">
            <router-link :to="{path: '/associations'}" tag="a" active-class="active">
              <i class="fa fa-users">&nbsp;</i> Associations</router-link>
          </li>
          <li class="menu-item">
            <router-link :to="{path: '/settings'}" tag="a" active-class="active">
              <i class="fa fa-gears">&nbsp;</i> Settings</router-link>
          </li>
        </ul>
        <span class="menu-item a">
          <a href="/logout" v-if="isLoggedIn" @click.prevent.stop="logout()">
            <i class="fa fa-minus-circle">&nbsp;</i> Logout
          </a>
        </span>
      </div>
      <div id="content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import './assets/css/style.css'
export default {
  beforeCreate() {
    const uid = localStorage.getItem('laa_uid')
    if (uid)
      this.$store.commit('setUid', uid)
  },
  computed: {
    expanded() {
      return this.$store.getters.sideMenuExpanded
    },
    sideMenuVisible(){
      return this.$store.getters.sideMenuVisible
    }
  },
  created() {
    // Track initial page creation
    this.$store.commit('pageCreated')
  },
  methods: {
    toggleSideMenu() {
      this.$store.commit('toggleSideMenu')
    }
  },
  mounted() {
    // Register global event listener for ESC key
    document.onkeyup = e => {
      if (e.keyCode == 27)
        this.hideModal()
    }
  },
  name: 'app'
}
</script>

<style>
html {
  min-height: 100vh
}

#site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 555;
  margin: 0;
  background-color: #ec1505;
  color: #ffffff;
}
</style>


<style scoped>
body {
  margin: 0;
}

#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app.logged-in {
  width: calc(100% - 220px);
  height: calc(100vh - 40px);
  background-color: #f5f5f5;
  margin-left: 220px;
  margin-top: 40px;
}

header span {
  display: inline-block;
  position: relative;
  font-size: 18px;
  line-height: 40px;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
}

.home {
  cursor: pointer;
  color: #fff;
  text-decoration: none;
}

.snack {
  display: none;
}

.logout {
  float: right;
  font-size: 16px;
  font-weight: 200;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.35);
  padding: 6px;
  border-radius: 3px;
  margin-top: 6px;
  line-height: 1;
}

.logout:hover {
  color: #FF9800;
}

.side-menu {
  width: 220px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: #111;
  padding-top: 45px;
  transition: all .3s ease-in-out;
  z-index: 554;
}

.side-menu.expanded {
  transform: translateX(300px);
}

.side-menu> .a {
  margin-top: 50px;
}

.hs {
  position: absolute;
  top: 5px;
  right: 10px;
  padding: 5px 10px;
  color: #fff;
}

#content.fw {
  width: 100%;
}

@media screen and (max-width: 768px) {
  #app.logged-in {
    width: 100%;
    margin-left: 0;
  }

  .side-menu {
    left: -300px;
    z-index: 556;
  }

  .snack {
    display: inherit;
  }

  .logout {
    display: none;
  }
}
</style>
