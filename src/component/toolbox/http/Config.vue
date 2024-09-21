<template>
  <div class="toolbox-http-config">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="60px">
          <el-form class="pdt-10 pdlr-10" inline>
            <el-form-item label="" class="mgb-5">
              <div class="tm-btn tm-btn-smx bg-grey-6" @click="toSave()">
                保存
              </div>
            </el-form-item>
          </el-form>
        </tm-layout>
        <tm-layout height="400px">
          <div class="toolbox-http-config-tabs-box">
            <el-tabs v-model="activeName">
              <el-tab-pane
                :label="'变量 (' + variables.length + ')'"
                name="variables"
              >
                <div style="height: 100%">
                  <DataTable
                    :source="source"
                    :toolboxWorker="toolboxWorker"
                    :dataList="variables"
                    :isForm="false"
                  >
                  </DataTable>
                </div>
              </el-tab-pane>
              <el-tab-pane
                :label="'加密变量 (' + secrets.length + ')'"
                name="secrets"
                disabled
              >
                <div style="height: 100%">
                  <DataTable
                    :source="source"
                    :toolboxWorker="toolboxWorker"
                    :dataList="secrets"
                    :isForm="false"
                  >
                  </DataTable>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </tm-layout>
      </tm-layout>
    </template>
  </div>
</template>


<script>
import DataTable from "./DataTable";

export default {
  components: { DataTable },
  props: ["source", "toolboxWorker", "tabId", "extend", "config"],
  data() {
    return {
      ready: false,
      activeName: "variables",
      variables: [],
      secrets: [],
      extendId: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      let extend = this.config.extend || {};
      this.variables = extend.variables || [];
      this.secrets = extend.secrets || [];
      this.ready = true;
    },
    async toSave() {
      let extend = {};
      extend.variables = this.variables;
      extend.secrets = this.secrets;
      await this.toolboxWorker.saveExtend({
        extendId: this.config.extendId,
        extendType: "http-config",
        extend: extend,
      });
      this.config.extend = extend;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-http-config {
  width: 100%;
  height: 100%;
}

.toolbox-http-config-tabs-box {
  width: 100%;
  height: 100%;
}
.toolbox-http-config-tabs-box .el-tabs {
  height: 100%;
}
.toolbox-http-config-tabs-box .el-tabs__content {
  height: calc(100% - 55px);
}
.toolbox-http-config-tabs-box .el-tab-pane {
  height: 100%;
}
.toolbox-http-config-tabs-box .el-tabs__item {
  color: darkgrey;
  padding-left: 20px !important;
}
.toolbox-http-config-tabs-box .el-tabs__item.is-active {
  color: inherit;
}
.toolbox-http-config-tabs-box .el-tabs__active-bar {
  background-color: #ffffff;
}
.toolbox-http-config-tabs-box .el-tabs__nav-wrap::after {
  background-color: transparent;
}

.toolbox-http-config-tabs-box .el-radio__label {
  padding-left: 5px;
}
</style>
