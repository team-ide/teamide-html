<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { defineComponent, reactive, toRefs } from "vue";

import util from "util";
export default defineComponent({
  props: ["source"],
  setup() {
    return { util };
  },
  methods: {
    async init() {},
  },
  mounted() {
    this.init();
  },
});
</script>

<template  >
  <div class="app-header">
    <div class="app-header-title">
      <div>Team · IDE</div>
    </div>
    <div class="app-header-nav-box">
      <div v-for="one in source.headerNavs" :key="one">
        <div
          class="app-header-nav"
          @click="$router.push(`${one.link}`)"
          :active="
            $route.path == `${one.link}` ||
            (one.match && one.match($route.path))
          "
        >
          {{ one.name }}
        </div>
      </div>
    </div>
    <div class="app-header-right">
      <template v-if="source.session.user == null">
        <div
          class="app-header-nav"
          v-if="source.hasPower('login')"
          @click="util.toLogin()"
        >
          登录
        </div>
      </template>
      <template v-else>
        <div class="app-header-nav app-header-user-info">
          <div class="app-header-user-img"></div>
          <div class="app-header-user-name">{{ source.session.user.name }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.app-header {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
}
.app-header .app-header-nav-box {
  flex: 1;
  display: flex;
}
.app-header .app-header-title {
  font-size: 16px;
  font-weight: 600;
  padding: 0px 40px 0px 10px;
  line-height: 30px;
}
.app-header .app-header-nav {
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
  padding: 0px 10px;
  cursor: pointer;
}
.app-header .app-header-nav.active {
  background-color: #2f353b;
  color: #ffffff;
}
.app-header .app-header-nav:hover {
  background-color: #2f353b;
  color: #dddddd;
}
</style>
