<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

import { defineComponent, reactive, toRefs } from "vue";

import { Service } from "service";
import { newSource } from "type";
import util from "util";

import Header from "./views/Header.vue";
import Body from "./views/Body.vue";
import Footer from "./views/Footer.vue";

export default defineComponent({
  components: { Header, Body, Footer },
  setup() {
    const source = reactive(newSource());
    const contextmenu = reactive({ menus: [] });

    return {
      util,
      source,
      contextmenu,
    };
  },
  methods: {
    async init() {
      await Service.initServer(this.source);
      document.body.removeChild(document.getElementById("app-loading-box"));

      window.onunload = function () {
        Service.close();
      };
      window.onbeforeunload = function () {
        Service.close();
      };

      util.showContextmenu = (menus) => {
        let e = window.event;
        e.preventDefault();
        this.contextmenu.menus = menus;
        this.$refs.Contextmenu.show(e);
      };
    },
  },
  mounted() {
    this.init();
  },
});
</script>

<template  >
  <template v-if="source.ready">
    <div class="app-box">
      <div class="app-header-box" v-show="util.shouldHeader()">
        <Header :source="source"></Header>
      </div>
      <div class="app-body-box" v-show="util.shouldBody()">
        <Body :source="source"></Body>
      </div>
      <div class="app-footer-box" v-show="util.shouldFooter()">
        <Footer :source="source"></Footer>
      </div>
    </div>
  </template>
  <template v-else>
    <template v-if="source.status == 'connecting'">
      <!-- <b-alert show>
          <h1>服务器连接中，请稍后！</h1>
        </b-alert> -->
    </template>
    <template v-else-if="source.status == 'connected'">
      <!-- <b-alert show variant="success">
          <h1>服务器连接成功，请使用！</h1>
        </b-alert> -->
    </template>
    <template v-else-if="source.status == 'error'">
      <div
        style="
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0px;
          background: #454a4e;
          color: #e61d1d;
        "
      >
        <h4 style="padding: 20px 20px; font-size: 25px">服务器连接异常！</h4>
        <hr />
        <p style="padding: 20px 20px; font-size: 20px">我们很遗憾的通知您：</p>
        <p style="text-indent: 60px; margin-top: 10px; font-size: 20px">
          服务器暂时无法正常访问，请您不要着急，我们正在紧急修复中！！！
        </p>
      </div>
    </template>
  </template>
  <Contextmenu :contextmenu="contextmenu" ref="Contextmenu"></Contextmenu>
</template>

<style>
html,
body {
  height: 100%;
  width: 100%;
}
#app {
  height: 100%;
  width: 100%;
  position: relative;
}
* {
  padding: 0px;
  margin: 0px;
}
*,
:after,
:before {
  box-sizing: border-box;
}
.app-box {
  height: 100%;
  width: 100%;
  position: relative;
}
.app-header-box {
  height: 30px;
  width: 100%;
  position: relative;
  background-color: #2a2f34;
  color: #a7a7a7;
}
.app-body-box {
  height: calc(100% - 30px);
  width: 100%;
  position: relative;
  background-color: #252b2f;
  color: #e5e5e5;
}
</style>
