<template>
  <div style="height: 100%">
    <div :style="{ height: onSave != null ? 'calc(100% - 60px)' : '100%' }">
      <Editor
        ref="Editor"
        :source="source"
        :value="text"
        language="json"
      ></Editor>
    </div>
    <div class="pd-10" v-if="onSave != null">
      <div class="tm-btn bg-teal-8 ft-13 mgr-10" @click="doSave">确认</div>
    </div>
  </div>
</template>

<script>
var JSONbig = require("json-bigint");
var JSONbigString = JSONbig({});

export default {
  components: {},
  props: ["source", "data", "onSave"],
  data() {
    return {
      text: null,
    };
  },
  computed: {},
  watch: {
    data() {
      this.initEditor();
    },
  },
  methods: {
    async initEditor() {
      this.$nextTick(() => {
        let data = this.data;
        let text = "";
        if (data != null) {
          try {
            if (typeof data == "string") {
              if (data != "") {
                try {
                  let json = JSONbigString.parse(data);
                  text = JSONbigString.stringify(json, null, "    ");
                } catch (e) {
                  text = data;
                }
              }
            } else {
              text = JSONbigString.stringify(data, null, "    ");
            }
          } catch (e) {
            text = e.toString();
          }
        }
        this.$refs.Editor.setValue(text);
      });
    },
    doSave() {
      this.showDialog = false;
      let text = this.$refs.Editor.getValue();
      var jsonData = null;
      var jsonError = null;
      try {
        jsonData = JSONbigString.parse(text);
      } catch (e) {
        jsonError = e.toString();
      }
      this.onSave &&
        this.onSave({
          text: text,
          jsonData: jsonData,
          jsonError: jsonError,
        });
    },
  },
  created() {},
  updated() {},
  mounted() {
    this.initEditor();
  },
};
</script>

<style>
</style>
