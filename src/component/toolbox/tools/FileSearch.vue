<template>
  <div class="tools-file-search-page">
    <el-form
      class="pdt-10 pdlr-10"
      size=""
      @submit.native.prevent
      label-width="140px"
    >
      <el-form-item label="目录" class="mgb-5 mglr-10">
        <el-input type="input" v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="匹配名称" class="mgb-5 mglr-10">
        <el-input type="input" v-model="form.searchFile">
          <span slot="append">(填写正则)</span>
        </el-input>
      </el-form-item>
      <el-form-item label="匹配内容" class="mgb-5 mglr-10">
        <el-input type="input" v-model="form.searchContent">
          <span slot="append">(填写正则)</span>
        </el-input>
      </el-form-item>
    </el-form>
    <el-form
      class="pdlr-10"
      size=""
      @submit.native.prevent
      inline
      label-width="140px"
    >
      <el-form-item
        label="读取最大内容"
        class="mgb-5 mglr-10"
        v-if="tool.isNotEmpty(form.searchContent)"
      >
        <el-input type="input" v-model="form.fileMaxReadSize">
          <span slot="append">M(0无限制)</span>
        </el-input>
      </el-form-item>
      <el-form-item label="搜索最小文件大小" class="mgb-5 mglr-10">
        <el-input type="input" v-model="form.searchFileMinSize">
          <span slot="append">M(0无限制)</span>
        </el-input>
      </el-form-item>
      <el-form-item label="搜索最大文件大小" class="mgb-5 mglr-10">
        <el-input type="input" v-model="form.searchFileMaxSize">
          <span slot="append">M(0无限制)</span>
        </el-input>
      </el-form-item>
      <el-form-item label="是否递归目录" class="mgb-5 mglr-10">
        <el-switch v-model="form.recursiveDir"></el-switch>
      </el-form-item>
      <el-form-item
        label="递归目录层级"
        class="mgb-5 mglr-10"
        v-if="form.recursiveDir"
      >
        <el-input type="input" v-model="form.recursiveLevel">
          <span slot="append">(0无限制)</span>
        </el-input>
      </el-form-item>
      <br />
      <el-form-item label="" class="mgb-5 mglr-10">
        <div
          class="tm-btn tm-btn-smx bg-green-6"
          @click="toSearch()"
          :class="{ 'tm-disabled': searchIng }"
        >
          搜索
        </div>
      </el-form-item>
    </el-form>
    <div
      v-if="result != null"
      class="data-list-box app-scroll-bar"
      style="height: calc(100% - 330px); user-select: text"
    >
      <template v-if="result.fileList.length == 0">
        <div class="data-list-one">
          <div class="data-list-one-text text-center ft-15 pd-20">
            暂无匹配数据
          </div>
        </div>
      </template>
      <template v-for="(one, index) in result.fileList">
        <div :key="index" class="data-list-one">
          <div class="data-list-one-text ft-12">
            <div>{{ one.path }}</div>
            <div>{{ one.sizeText }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      searchIng: false,
      result: null,
      form: {
        path: null,
        searchFile: null,
        searchContent: null,
        recursiveDir: false,
        recursiveLevel: 0,
        fileMaxReadSize: 10,
        searchFileMinSize: 0,
        searchFileMaxSize: 0,
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {},
    async toSearch() {
      this.searchIng = true;
      try {
        let param = Object.assign({}, this.form);
        if (this.tool.isEmpty(param.path)) {
          this.tool.warn("请输入搜索目录");
          return;
        }
        param.recursiveLevel = Number(param.recursiveLevel);
        param.fileMaxReadSize = Number(param.fileMaxReadSize);
        param.searchFileMinSize = Number(param.searchFileMinSize);
        param.searchFileMaxSize = Number(param.searchFileMaxSize);
        let res = await this.server.tools.fileSearch(param);
        if (res.code != 0) {
          this.tool.error(res.msg);
          return;
        }
        let result = res.data || {};
        result.fileList = result.fileList || [];
        result.fileList.forEach((one) => {
          one.sizeText = this.tool.getSizeText(one.size);
        });
        this.result = result;
      } finally {
        this.searchIng = false;
      }
    },
    refresh() {
      this.$nextTick(() => {});
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.tools-file-search-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
