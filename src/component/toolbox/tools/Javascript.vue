<template>
  <div class="tools-javascript-page">
    <tm-layout height="100%">
      <tm-layout height="500px">
        <Editor ref="javascriptEditor" :source="source" language="javascript">
        </Editor>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="100px">
        <div class="pd-10">
          <div class="tm-btn tm-btn-sm bg-green-6" @click="toInvoke">执行</div>
        </div>
        <div class="pdlr-10 pdt-5">
          <div v-if="result != null" class="mgt-10 ft-12">
            <div v-if="result.start > 0">
              开始时间:
              <span class="color-green pdlr-5">
                {{
                  tool.formatDate(
                    new Date(result.start),
                    "yyyy-MM-dd hh:mm:ss.S"
                  )
                }}
              </span>
              结束时间:
              <span class="color-green pdlr-5">
                {{
                  tool.formatDate(new Date(result.end), "yyyy-MM-dd hh:mm:ss.S")
                }}
              </span>
              总耗时:
              <span class="color-green pdlr-5">
                {{ tool.formatTimeStr(result.end - result.start) }}
              </span>
            </div>

            <template v-if="tool.isNotEmpty(result.error)">
              <div class="mgt-5 color-error">
                异常: <span>{{ result.error }}</span>
              </div>
            </template>
          </div>
        </div>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="auto">
        <Editor ref="loggerEditor" :source="source" language="log"></Editor>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend", "tabId"],
  data() {
    return {
      result: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      let extend = this.extend || {};
      this.$nextTick(() => {
        if (extend.javascript != null) {
          this.$refs.javascriptEditor.setValue(extend.javascript);
        }
      });
      this.startLoad();
    },
    refresh() {
      this.$nextTick(() => {});
    },
    async toInvoke() {
      let javascript = this.$refs.javascriptEditor.getValue();
      let param = this.toolboxWorker.getWorkParam({
        javascript: javascript,
      });
      this.saveExtend(param);
      let res = await this.server.javascript.run(param);
      let result = res.data || {};
      result.error = null;
      if (res.code != 0) {
        result.error = res.msg;
        this.tool.error(res.msg);
      } else {
        this.startLoad();
      }
    },
    async startLoad() {
      if (this.startLoading) {
        return;
      }
      this.startLoading = true;
      let isEnd = false;
      try {
        let param = this.toolboxWorker.getWorkParam({});
        let res = await this.server.javascript.load(param);

        this.result = res.data;
        if (this.result == null) {
          isEnd = true;
        } else {
          isEnd = this.result.isEnd;
          this.$refs.loggerEditor.setValue(this.result.log);
        }
      } catch (e) {
      } finally {
        this.startLoading = false;
        if (!isEnd) {
          window.setTimeout(() => {
            this.startLoad();
          }, 200);
        }
      }
    },
    async saveExtend(param) {
      let keyValueMap = {};
      keyValueMap.javascript = param.javascript;

      await this.toolboxWorker.updateOpenTabExtend(this.tabId, keyValueMap);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.tools-javascript-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
