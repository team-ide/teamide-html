<template>
  <div class="toolbox-editor" v-if="toolboxType != null" tabindex="-1">
    <template v-if="ready">
      <template v-if="toolboxType == 'redis'">
        <ToolboxRedisEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </ToolboxRedisEditor>
      </template>
      <template v-else-if="toolboxType == 'database'">
        <ToolboxDatabaseEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </ToolboxDatabaseEditor>
      </template>
      <template v-else-if="toolboxType == 'zookeeper'">
        <ToolboxZookeeperEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </ToolboxZookeeperEditor>
      </template>
      <template v-else-if="toolboxType == 'elasticsearch'">
        <ToolboxElasticsearchEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </ToolboxElasticsearchEditor>
      </template>
      <template v-else-if="toolboxType == 'kafka'">
        <ToolboxKafkaEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </ToolboxKafkaEditor>
      </template>
      <template v-else-if="toolboxType == 'ssh'">
        <ToolboxSSHEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </ToolboxSSHEditor>
      </template>
      <template v-else-if="toolboxType == 'other'">
        <ToolboxOtherEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </ToolboxOtherEditor>
      </template>
      <template v-else-if="toolboxType == 'node'">
        <NodeEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </NodeEditor>
      </template>
      <template v-else-if="toolboxType == 'file-manager'">
        <FileManagerEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </FileManagerEditor>
      </template>
      <template v-else-if="toolboxType == 'terminal'">
        <TerminalEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </TerminalEditor>
      </template>
      <template v-else-if="toolboxType == 'connection'">
        <ConnectionEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </ConnectionEditor>
      </template>
      <template v-else-if="toolboxType == 'thrift'">
        <ThriftEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </ThriftEditor>
      </template>
      <template v-else-if="toolboxType == 'maker'">
        <MakerEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </MakerEditor>
      </template>

      <template v-else-if="toolboxType == 'page'">
        <Page :source="source" :extend="extend" :toolboxWorker="toolboxWorker">
        </Page>
      </template>
      <template v-else-if="toolboxType == 'mongodb'">
        <MongodbEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </MongodbEditor>
      </template>
      <template v-else-if="toolboxType == 'http'">
        <HttpEditor
          :source="source"
          :extend="extend"
          :toolboxWorker="toolboxWorker"
        >
        </HttpEditor>
      </template>
    </template>
  </div>
</template>


<script>
import "./toolbox.css";
import Page from "./Page.vue";
import NodeEditor from "./node/Index.vue";
import FileManagerEditor from "./file-manager/Index.vue";
import TerminalEditor from "./terminal/Index.vue";
import toolboxWorker_ from "./toolboxWorker.js";
import ThriftEditor from "./thrift/Index.vue";
import MongodbEditor from "./mongodb/Index.vue";
import ConnectionEditor from "./connection/Index.vue";
import HttpEditor from "./http/Index.vue";
import MakerEditor from "./maker/Index.vue";

export default {
  components: {
    Page,
    NodeEditor,
    FileManagerEditor,
    TerminalEditor,
    ThriftEditor,
    MongodbEditor,
    ConnectionEditor,
    HttpEditor,
    MakerEditor,
  },
  props: ["source", "extend", "toolboxType", "toolboxId", "openId"],
  data() {
    let toolboxWorker = toolboxWorker_.newToolboxWorker({
      toolboxId: this.toolboxId,
      openId: this.openId,
      toolboxType: this.toolboxType,
      extend: this.extend,
    });

    return {
      toolboxWorker: toolboxWorker,
      extendJSON: null,
      ready: false,
    };
  },
  computed: {},
  watch: {
    extend(newExtent, oldExtent) {
      if (newExtent == null || oldExtent == null) {
        return;
      }
      if (JSON.stringify(newExtent) == JSON.stringify(oldExtent)) {
        return;
      }
      this.toolboxWorker.updateOpenExtend(this.extend);
    },
  },
  methods: {
    async init() {
      if (this.inited) {
        return;
      }
      this.inited = true;
      await this.toolboxWorker.init();
      this.ready = true;
    },
    async onFocus() {
      this.$nextTick(async () => {
        await this.init();
        this.$el && this.$el.focus && this.$el.focus();
        this.$children.forEach((one) => {
          one.onFocus && one.onFocus();
        });
      });
    },
    reload() {},
    onKeyDown() {
      if (this.tool.keyIsF5()) {
        this.tool.stopEvent();
        this.$children.forEach((one) => {
          one.refresh && one.refresh();
        });
      }
    },
    bindEvent() {
      if (this.bindEvented) {
        return;
      }
      this.bindEvented = true;
      this.$el.addEventListener("keydown", this.onKeyDown);
    },
    async loadExtends(p) {
      let param = this.toolboxWorker.getWorkParam(p || {});
      let res = await this.server.toolbox.extend.query(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      return res.data || [];
    },
    async loadAllExtends(p) {
      let param = this.toolboxWorker.getWorkParam(p || {});
      delete param.toolboxId;
      let res = await this.server.toolbox.extend.query(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      return res.data || [];
    },
  },
  created() {},
  mounted() {
    this.toolboxWorker.loadExtends = this.loadExtends;
    this.bindEvent();
  },
  beforeDestroy() {
    this.isDestroyed = true;
    this.toolboxWorker = null;
    this.$el.removeEventListener("keydown", this.onKeyDown);
  },
  updated() {},
};
</script>

<style>
</style>
