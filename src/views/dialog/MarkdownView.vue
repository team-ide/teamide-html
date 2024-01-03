<template>
  <div class="" style="height: 100%">
    <article
      class="markdown-body"
      style="text-align: left"
      v-html="text"
    ></article>
  </div>
</template>

<script>
import marked from "marked";

export default {
  components: {},
  props: ["source", "data"],
  data() {
    return {
      text: null,
    };
  },
  computed: {},
  watch: {
    data() {
      this.initView();
    },
  },
  methods: {
    async initView() {
      this.$nextTick(() => {
        // let blog = marked(data);
        this.text = marked.parse(this.data);
      });
    },
  },
  created() {},
  updated() {},
  mounted() {
    this.initView();
  },
};
</script>

<style>
.markdown-body {
  box-sizing: border-box;
  /* max-width: 980px; */
  /* padding: 45px; */
  max-width: 100%;
  margin: 0 auto;
  box-shadow: 2px 4px 6px gray;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
  min-height: 100%;
}

.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 100%;
  margin: 0 auto;
  padding: 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
</style>
