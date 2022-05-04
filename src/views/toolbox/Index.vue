<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

import { ToolboxService } from "service";
import Context from "./Context.vue";
import Tabs from "../tabs/Index.vue";
import util from "util";

export default defineComponent({
  components: { Context, Tabs },
  props: ["source"],
  setup() {
    const data: any = reactive({ ready: false, showContextBox_: false });
    return data;
  },
  watch: {
    "source.toolbox.opens"() {
      this.$nextTick(() => {
        this.initOpens();
      });
    },
  },
  methods: {
    async init() {
      this.ready = true;
    },
    showContextBox() {
      this.showContextBox_ = !this.showContextBox_;
    },
    initOpens() {
      let beforeTab = null;
      let opens = [];
      this.source.toolbox.opens.forEach((one: any) => {
        opens.push(one);
        if (one.tab != null) {
          beforeTab = one.tab;
          return;
        }
        let tab = this.createTabByOpen(one);
        if (tab == null) {
          opens.splice(opens.length - 1, 1);
          return;
        }
        beforeTab = tab;
        one.tab = tab;
        this.addTab(tab, beforeTab);
      });
      if (this.source.toolbox.opens.length != opens.length) {
        this.source.toolbox.opens = opens;
      }
    },
    addTab(tab: any, fromTab: any) {
      this.$refs.Tabs.addTab(tab, fromTab);
    },
    createTabByOpen(open: any) {
      this.initOpenData(open);
      let openData = open.openData;
      if (openData == null) {
        ToolboxService.close(open.openId);
        return;
      }

      let type = openData.type;
      let model = openData.model;
      let extend = openData.extend || {};
      let title = type.text + ":" + model.name;
      let name = model.name;

      if (extend.isFTP) {
        title = "FTP:" + model.name;
      }

      if (extend.isFTP) {
        extend.local = extend.local || {};
        extend.remote = extend.remote || {};
        extend.local.dir = extend.local.dir || "";
        extend.remote.dir = extend.remote.dir || "";
      }

      let tab = {
        key: open.openId,
        model,
        title,
        name,
        type,
        extend,
        openId: openData.openId,
        openData: openData,
        comment: "",
        active: false,
      };
      return tab;
    },
    initOpenData(open: any) {
      let model: any = ToolboxService.getModel(this.source, open);
      if (model == null) {
        return;
      }
      let type: any = ToolboxService.getType(this.source, model.toolboxType);
      if (type == null) {
        return;
      }
      let extend = {};
      if (util.isNotEmpty(open.extend)) {
        extend = JSON.parse(open.extend);
      }
      let openData: any = {};
      openData.openId = open.openId;
      openData.model = model;
      openData.type = type;
      openData.extend = extend;
      open.openData = openData;
    },
    onRemoveTab() {},
    onActiveTab() {},
    toCopyTab() {},
  },
  mounted() {
    this.init();
  },
});
</script>

<template >
  <div
    v-if="source.toolboxLoading"
    style="
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      color: grey;
      padding: 30px 0px;
    "
  >
    工具箱加载中，请稍后！
  </div>
  <div
    v-else-if="source.toolboxError"
    style="
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      color: red;
      padding: 30px 0px;
    "
  >
    工具箱加载异常：{{ source.toolboxError }}
  </div>
  <div class="toolbox-box" v-else-if="source.toolbox != null">
    <Tabs
      ref="Tabs"
      :onRemoveTab="onRemoveTab"
      :onActiveTab="onActiveTab"
      :copyTab="toCopyTab"
    >
      <template v-slot:icon="{ tab }">
        <template v-if="tab.type.name == 'database'">
          <IconFont class="teamide-database"> </IconFont>
        </template>
        <template v-else-if="tab.type.name == 'redis'">
          <IconFont class="teamide-redis"> </IconFont>
        </template>
        <template v-else-if="tab.type.name == 'elasticsearch'">
          <IconFont class="teamide-elasticsearch"> </IconFont>
        </template>
        <template v-else-if="tab.type.name == 'kafka'">
          <IconFont class="teamide-kafka"> </IconFont>
        </template>
        <template v-else-if="tab.type.name == 'zookeeper'">
          <IconFont class="teamide-zookeeper"> </IconFont>
        </template>
        <template v-else-if="tab.type.name == 'ssh'">
          <IconFont class="teamide-ssh"> </IconFont>
          <IconFont class="teamide-ftp"> </IconFont>
        </template>
      </template>
      <template v-slot:body="{ tab }">
        {{ tab }}
      </template>
      <template v-slot:extend>
        <div class="tab-header-extend">
          <div class="tab-header-nav tm-pointer" @click="showContextBox">
            <i class="mdi mdi-plus"></i>
          </div>
        </div>
      </template>
    </Tabs>
    <div
      class="toolbox-context-box"
      :class="{
        'toolbox-context-box-show':
          showContextBox_ || source.toolbox.opens.length == 0,
      }"
    >
      <Context :source="source" :toolbox="source.toolbox"></Context>
    </div>
  </div>
</template>

<style>
.toolbox-box {
  height: 100%;
  width: 100%;
  position: relative;
}
.toolbox-context-box {
  position: absolute;
  top: 30px;
  left: calc((100% - 960px) / 2);
  width: 960px;
  height: auto;
  transform: scale(0);
}
.toolbox-context-box-show {
  transform: scale(1);
}
</style>
