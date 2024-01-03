<template>
  <div class="dialog-page">
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
  </div>
</template>

<script>
import JavascriptExample from "./JavascriptExample";
import JavascriptFunc from "./JavascriptFunc";
import Markdown from "./Markdown";
import MarkdownView from "./MarkdownView";
import JSONData from "./JSONData";

export default {
  components: {
    JSONData,
    JavascriptExample,
    JavascriptFunc,
    Markdown,
    MarkdownView,
  },
  props: ["source"],
  data() {
    return {
      type: "",
      cacheData: null,
      listenKeys: null,
      onSave: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.type = this.$route.query.type;
      if (this.$route.query.title) {
        document.title = this.$route.query.title;
      }

      if (this.$route.query.cacheKey) {
        let cacheData = await this.tool.electronDo({
          method: "get-cache",
          key: this.$route.query.cacheKey,
        });
        this.cacheData = cacheData;
      }
      if (this.$route.query.listenKeys) {
        console.log(this.$route.query.listenKeys);
        this.listenKeys = JSON.parse(this.$route.query.listenKeys);
      }
      if (this.listenKeys && this.listenKeys.length > 0) {
        this.onSave = (data) => {
          this.tool.electronNotifyListen({
            listenKey: this.listenKeys[0],
            data: data,
          });
        };
      }
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
