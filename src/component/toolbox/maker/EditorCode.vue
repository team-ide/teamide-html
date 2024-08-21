<template>
  <div v-if="ready" style="height: 100%" class="pdlr-10">
    <ul ref="partBox" class="part-box" style="height: auto">
      <li>
        <span class="color-grey mgr-10">说明</span>
        <span class="mgr-20">
          <input
            v-model="model.comment"
            placeholder="说明"
            style="min-width: 200px"
          />
        </span>
      </li>
      <li>
        <span class="color-grey mgr-10">func</span>
        <span class="color-green mgr-10">{{ model.name }}</span>
        <span class="color-grey mgr-10">(</span>
        <div class="tm-link color-green mgr-10" @click="add({})">新增参数</div>
        <span class="color-grey mgr-10" v-if="list.length == 0">) {</span>
      </li>
      <template v-if="list.length != 0">
        <template v-for="(one, index) in list">
          <li :key="index" class="mglr-20">
            <span class="mgr-20">
              <input
                v-model="one.name"
                placeholder="参数名称"
                style="min-width: 200px"
              />
            </span>
            <span class="mgr-20">
              <ValueTypeSelect
                style="min-width: 200px"
                :source="source"
                :worker="worker"
                :data="one.type"
              >
              </ValueTypeSelect>
            </span>
            <span class="mgr-20">
              <input
                v-model="one.comment"
                placeholder="参数说明"
                style="min-width: 100px"
              />
            </span>
            <div class="tm-link color-grey mglr-5" @click="up(one)">上移</div>
            <div class="tm-link color-grey mglr-5" @click="down(one)">下移</div>
            <div class="tm-link color-grey mglr-5" @click="add({}, one)">
              追加
            </div>
            <div class="tm-link color-red mglr-5" @click="del(one)">删除</div>
          </li>
        </template>
        <li class="color-grey mgr-10">) {</li>
      </template>
    </ul>
    <div ref="editorBox">
      <div class="teamide-editor" ref="editor" @keydown="keydown"></div>
    </div>
    <div>
      <span class="color-grey mgr-10">}</span>
    </div>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "worker", "model", "codeType", "save"],
  data() {
    return {
      ready: false,
      list: [],
      code: "",
      language: "javascript",
    };
  },
  computed: {},
  watch: {
    "source.userSetting.theme"() {
      if (this.monacoInstance) {
        let theme = this.getTheme();
        this.monacoInstance.updateOptions({
          theme: theme,
        });
      }
    },
  },
  methods: {
    async init() {
      this.code = this.model.func || "";
      this.list = [];
      let list = this.model.args || [];
      list.forEach((one) => {
        this.add(one);
      });
      this.ready = true;

      this.$nextTick(() => {
        this.initHeight();
        window.onMonacoLoad(() => {
          this.initEditor();
        }, "component-maker-editor-code");
      });
    },
    initHeight() {
      this.$nextTick(() => {
        if (this.$refs.partBox && this.$refs.editorBox) {
          let partBox = this.tool.jQuery(this.$refs.partBox);
          let editorBox = this.tool.jQuery(this.$refs.editorBox);
          editorBox.height(
            "calc(100% - " + (partBox.outerHeight() + 30) + "px)"
          );
        }
      });
    },
    async fullModel(model) {
      model.args = this.list;
      model.func = this.getCode();
    },
    up(one) {
      this.tool.up(this, "list", one);
    },
    down(one) {
      this.tool.down(this, "list", one);
    },
    add(one, after) {
      one = one || {};
      one.name = one.name || "arg" + (this.list.length + 1);
      one.type = one.type || "string";
      one.comment = one.comment || "";

      let appendIndex = this.list.indexOf(after);
      if (appendIndex < 0) {
        appendIndex = this.list.length;
      } else {
        appendIndex++;
      }
      this.list.splice(appendIndex, 0, one);
      this.initHeight();
    },
    del(one) {
      let findIndex = this.list.indexOf(one);
      if (findIndex >= 0) {
        this.list.splice(findIndex, 1);
      }
      this.initHeight();
    },
    initEditor() {
      if (!this.source["registerCompletionItemProvidered"]) {
        this.source["registerCompletionItemProvidered"] = true;
        this.worker.registerCompletionItemProvider();
      }
      let monaco = window.monaco;
      let lineNumbers = "on";
      if (this.lineNumbers !== null) {
        lineNumbers = this.lineNumbers;
      }

      this.monacoInstance = monaco.editor.create(this.$refs.editor, {
        theme: this.getTheme(), //官方自带三种主题vs, hc-black, or vs-dark
        minimap: { enabled: false }, // 缩略导航
        value: this.code || "", //编辑器初始显示文字
        language: "javascript",
        selectOnLineNumbers: true, //显示行号
        lineNumbers: lineNumbers, //显示行号
        roundedSelection: false,
        readOnly: this.readonly, // 只读
        cursorStyle: "line", //光标样式
        automaticLayout: true, //自动布局
        glyphMargin: false, //字形边缘
        useTabStops: false,
        fontSize: 15, //字体大小
        autoIndent: true, //自动布局
        // quickSuggestionsDelay: 500, //代码提示延时
        contextmenu: false,
        stopRenderingLineAfter: -1, // 一行最大显示字符数，默认 10000 ，-1 表示 一直渲染
      });
      this.monacoInstance.onDidChangeModelContent((e) => {
        if (this.isSetCode) {
          delete this.isSetCode;
        } else {
          this.change && this.change(this.getCode());
        }
      });
      this.monacoInstance.onContextMenu((e) => {
        this.tool.stopEvent();
        this.onContextMenu && this.onContextMenu();
      });
      // console.log(this.monacoInstance);
      let monacoModelId = this.monacoInstance._modelData.model.id;
      console.log(monacoModelId);
      if (this.worker.registerCompletion == null) {
        this.worker.registerCompletion = {};
        this.worker.initRegisterCompletion();
      }
      this.source.registerCompletion = this.source.registerCompletion || {};
      this.source.registerCompletion[monacoModelId] =
        this.worker.registerCompletion;
      window.monacoInstance = this.monacoInstance;
    },
    keydown(event) {
      event = event || window.event;
      if (event.ctrlKey) {
        // Ctrl + S
        if (event.keyCode == 83) {
          event.stopPropagation && event.stopPropagation();
          event.preventDefault && event.preventDefault();
          this.save && this.save();
        }
      }
    },
    setCode(code) {
      if (this.monacoInstance) {
        if (code == null) {
          code = "";
        }
        if (this.getCode() != code) {
          this.isSetCode = true;
          this.monacoInstance.setValue(code);
        }
      }
    },
    getTheme() {
      let theme = "vs-dark";
      if (this.source.userSetting.theme == "light") {
        theme = "vs-light";
      }
      let color = this.source.userSetting.editorBackgroudColor;
      if (
        this.tool.isEmpty(color) &&
        this.source.cssData &&
        this.source.cssData.bodyBackgroudColor6
      ) {
        color = this.source.cssData.bodyBackgroudColor6;
      }

      if (this.tool.isNotEmpty(color)) {
        let monaco = window.monaco;
        monaco.editor.defineTheme("my-theme", {
          base: theme, //指定父级主题
          inherit: true, //继承父级主题中未定义的颜色值
          rules: [],
          colors: {
            //定义新颜色值
            "editor.background": color, //编辑器背景色
          },
        });
        theme = "my-theme";
      }
      return theme;
    },
    getCode() {
      return this.monacoInstance.getValue();
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (this.monacoInstance != null) {
      this.monacoInstance.dispose(); //使用完成销毁实例
    }
    this.monacoInstance = null;
  },
};
</script>

<style>
</style>
