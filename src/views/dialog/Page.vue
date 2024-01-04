<template>
  <div class="dialog-page" v-if="ready">
    <JavascriptExample v-if="type == 'JavascriptExample'" :source="source">
    </JavascriptExample>
    <JavascriptFunc v-else-if="type == 'JavascriptFunc'" :source="source">
    </JavascriptFunc>
    <Markdown v-else-if="type == 'Markdown'" :source="source" :data="cacheData">
    </Markdown>
    <MarkdownView
      v-else-if="type == 'MarkdownView'"
      :source="source"
      :data="cacheData"
    >
    </MarkdownView>
    <JSONData
      v-else-if="type == 'JSONData'"
      :source="source"
      :data="cacheData"
      :onSave="onSave"
    >
    </JSONData>
    <CommonForm
      v-else-if="type == 'Form'"
      :source="source"
      :onSave="onSave"
      :onSuccess="windowClose"
      :options="cacheData"
    >
    </CommonForm>
  </div>
</template>

<script>
import JavascriptExample from "./JavascriptExample";
import JavascriptFunc from "./JavascriptFunc";
import Markdown from "./Markdown";
import MarkdownView from "./MarkdownView";
import JSONData from "./JSONData";
import CommonForm from "./CommonForm";

export default {
  components: {
    JSONData,
    JavascriptExample,
    JavascriptFunc,
    Markdown,
    MarkdownView,
    CommonForm,
  },
  props: ["source"],
  data() {
    return {
      type: "",
      cacheData: null,
      listenKeys: null,
      onSave: null,
      ready: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.type = this.$route.query.type;
      if (this.type == "Form") {
        await this.source.initUserToolboxSSHList();
      }
      if (this.$route.query.title) {
        document.title = this.$route.query.title;
      }

      if (this.$route.query.cacheKey) {
        let cacheData = await this.tool.electronDo({
          method: "get-cache",
          key: this.$route.query.cacheKey,
        });
        this.cacheData = cacheData;
        // console.log(this.cacheData);
      }
      if (this.$route.query.listenKeys) {
        // console.log(this.$route.query.listenKeys);
        this.listenKeys = JSON.parse(this.$route.query.listenKeys);
      }
      if (this.listenKeys && this.listenKeys.length > 0) {
        this.onSave = async (data) => {
          if (this.type == "Form" && data) {
            this.tool.electronNotifyListen({
              listenKey: this.listenKeys[0],
              data: data,
            });
            if (data) {
              this.windowClose();
            }
          }
          if (this.type != "Form") {
            this.tool.electronNotifyListen({
              listenKey: this.listenKeys[0],
              data: data,
            });
            this.windowClose();
          }
        };
      }
      this.ready = true;
    },
    windowClose() {
      window.close();
    },
  },
  created() {},
  updated() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.dialog-page {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  position: relative;
  user-select: text;
}
</style>
