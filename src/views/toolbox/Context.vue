<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

import WaterfallLayout from "./WaterfallLayout.vue";

export default defineComponent({
  components: { WaterfallLayout },
  props: ["source", "toolbox"],
  setup() {
    return {};
  },
  methods: {
    async init() {},
  },
  mounted() {
    this.init();
  },
});
</script>

<template >
  <div class="toolbox-context">
    <WaterfallLayout
      class="toolbox-type-box"
      :columns="3"
      :gap="10"
      :startLeft="10"
      :startTop="10"
      ref="WaterfallLayout"
    >
      <div
        v-for="toolboxType in toolbox.types"
        :key="toolboxType.name"
        class="toolbox-type-one waterfall-layout-item"
      >
        <div class="toolbox-type-title">
          <template v-if="toolboxType.name == 'database'">
            <IconFont class="teamide-database"> </IconFont>
          </template>
          <template v-else-if="toolboxType.name == 'redis'">
            <IconFont class="teamide-redis"> </IconFont>
          </template>
          <template v-else-if="toolboxType.name == 'elasticsearch'">
            <IconFont class="teamide-elasticsearch"> </IconFont>
          </template>
          <template v-else-if="toolboxType.name == 'kafka'">
            <IconFont class="teamide-kafka"> </IconFont>
          </template>
          <template v-else-if="toolboxType.name == 'zookeeper'">
            <IconFont class="teamide-zookeeper"> </IconFont>
          </template>
          <template v-else-if="toolboxType.name == 'ssh'">
            <IconFont class="teamide-ssh"> </IconFont>
            <IconFont class="teamide-ftp"> </IconFont>
          </template>
          <span class="toolbox-type-text">
            {{ toolboxType.text || toolboxType.name }}
          </span>
          <span
            class="tm-link color-green mgl-10"
            title="新增"
            @click="toInsert(toolboxType)"
          >
            <i class="mdi mdi-plus ft-14"></i>
          </span>
        </div>
        <div class="toolbox-type-data-box">
          <template
            v-if="
              toolbox.context[toolboxType.name] == null ||
              toolbox.context[toolboxType.name].length == 0
            "
          >
            <span
              class="tm-link color-green"
              title="新增"
              @click="toInsert(toolboxType)"
            >
              新增
            </span>
          </template>
          <template v-else>
            <div
              v-for="toolboxData in toolbox.context[toolboxType.name]"
              :key="toolboxData.toolboxId"
            >
              <div class="toolbox-type-data">
                <span
                  class="toolbox-type-data-text tm-link color-grey mgr-10"
                  title="打开"
                  @click="toolboxDataOpen(toolboxData)"
                >
                  {{ toolboxData.name }}
                </span>
                <span
                  title="打开FTP"
                  v-if="toolboxType.name == 'ssh'"
                  class="tm-link color-orange mgr-10"
                  @click="toolboxDataOpenSfpt(toolboxData)"
                >
                  <i class="mdi mdi-folder-outline ft-13"></i>
                </span>
                <span
                  title="编辑"
                  class="tm-link color-blue mgr-10"
                  @click="toUpdate(toolboxType, toolboxData)"
                >
                  <i class="mdi mdi-folder-edit-outline ft-13"></i>
                </span>
                <span
                  title="复制"
                  class="tm-link color-grey mgr-10"
                  @click="toCopy(toolboxType, toolboxData)"
                >
                  <i class="mdi mdi-content-copy ft-12"></i>
                </span>
                <span
                  title="删除"
                  class="tm-link color-red mgr-10"
                  @click="toDelete(toolboxType, toolboxData)"
                >
                  <i class="mdi mdi-delete-outline ft-14"></i>
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </WaterfallLayout>
  </div>
</template>

<style>
.toolbox-context {
  position: relative;
}

.toolbox-type-box {
  width: 960px;
  font-size: 12px;
  padding: 10px;
  margin: 0px auto;
}

.toolbox-type-one {
  width: 300px;
}
.toolbox-type-title {
  padding: 0px 10px;
  background: #2b3f51;
  color: #ffffff;
  line-height: 23px;
}

.toolbox-type-title .icon {
  font-size: 12px;
  margin-right: 5px;
}
.toolbox-type-title .tm-link {
  padding: 0px;
}
.toolbox-type-data-box {
  background: #1b2a38;
  padding: 5px 10px;
}
.toolbox-type-data {
  display: flex;
  overflow: hidden;
  padding: 2px 0px;
}
.toolbox-type-data-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: left;
}
.toolbox-type-data .tm-link {
  padding: 0px;
}
</style>
