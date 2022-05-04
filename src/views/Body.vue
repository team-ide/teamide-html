<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { defineComponent, reactive, toRefs } from "vue";
import util from "util";

import NoPower from "./error/NoPower.vue";
import Toolbox from "./toolbox/Index.vue";

export default defineComponent({
  components: { NoPower, Toolbox },
  props: ["source"],
  setup() {
    const data: any = reactive({
      isUserPage: false,
      isManagePage: false,
      isToolboxPage: false,
      hasPower: true,
    });
    return data;
  },
  watch: {
    "$route.path"(path) {
      this.initPath(path);
    },
  },
  methods: {
    init() {
      this.initPath(this.$route.path);
    },
    initPath(path) {
      this.hasPower = this.source.hasPower(path);
      this.isToolboxPage = util.isToolboxPage(path);
      this.isUserPage = util.isUserPage(path);
      this.isManagePage = util.isManagePage(path);
    },
  },
  mounted() {
    this.init();
  },
});
</script>

<template  >
  <div class="app-body">
    <template v-if="!hasPower">
      <NoPower :source="source"></NoPower>
    </template>
    <template v-else>
      <template v-if="isManagePage || isUserPage">
        <div class="frame-body-left">
          <template v-if="isManagePage">
            <!-- <ManageNav :source="source"></ManageNav> -->
          </template>
          <template v-if="isUserPage">
            <!-- <UserNav :source="source"></UserNav> -->
          </template>
        </div>
        <div class="frame-body-center">
          <router-view class="app-page" :source="source"></router-view>
        </div>
        <div class="frame-body-right"></div>
      </template>
      <template v-else>
        <router-view class="app-page" :source="source"></router-view>
      </template>
    </template>
    <div class="app-body-toolbox" v-show="isToolboxPage">
      <Toolbox :source="source"></Toolbox>
    </div>
  </div>
</template>

<style>
.app-body {
  height: 100%;
  width: 100%;
  position: relative;
}
.app-page {
  height: 100%;
  width: 100%;
  position: relative;
}
.app-body-toolbox {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
