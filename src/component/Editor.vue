<template>
  <div class="teamide-editor" ref="editor" @keydown="keydown"></div>
</template>

<script>
export default {
  props: [
    "source",
    "language",
    "readonly",
    "value",
    "change",
    "onContextMenu",
    "lineNumbers",
    "format",
  ],
  components: {},
  data() {
    return {
      hints: [],
      lastSetValue: null,
    };
  },
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
    setValue(value) {
      this.lastSetValue = value;
      if (this.monacoInstance) {
        if (value == null) {
          value = "";
        }
        if (this.getValue() != value) {
          this.isSetValue = true;
          this.monacoInstance.setValue(value);
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
    getValue() {
      return this.monacoInstance.getValue();
    },
    keydown(event) {
      event = event || window.event;
      if (event.ctrlKey) {
        // Ctrl + S
        if (event.keyCode == 83) {
          event.stopPropagation && event.stopPropagation();
          event.preventDefault && event.preventDefault();
          this.$emit("save", this.getValue());
        }
      }
    },
    getSelection() {
      return this.monacoInstance
        .getModel()
        .getValueInRange(this.monacoInstance.getSelection());
      // return this.monacoInstance.getSelection().toString();
    },
    getEditor() {
      return this.monacoInstance;
    },
    init() {
      let monaco = window.monaco;
      let languageList = monaco.languages.getLanguages();
      let plaintextLanguage = null;
      let iniLanguage = null;
      let language = null;
      languageList.forEach((one) => {
        if (one.id == "plaintext") {
          plaintextLanguage = one;
        } else if (one.id == "ini") {
          iniLanguage = one;
        }
        if (
          one.extensions &&
          one.extensions.indexOf("." + this.language) >= 0
        ) {
          language = one;
        } else if (one.id == this.language) {
          language = one;
        }
      });
      if (language == null) {
        if (
          this.language == "conf" ||
          this.language == "cfg" ||
          this.language == "cnf"
        ) {
          language = iniLanguage;
        } else {
          language = iniLanguage;
        }
      }
      // console.log(language);
      let lineNumbers = "on";
      if (this.lineNumbers !== null) {
        lineNumbers = this.lineNumbers;
      }
      let value = this.lastSetValue;
      if (value == null) {
        value = this.value;
        if (value == null) {
          value = "";
        }
      }
      if (this.format) {
        try {
          let json = this.tool.JSONbig.parse(value);
          value = this.tool.JSONbig.stringify(json, null, "    ");
        } catch (e) {}
      }
      this.monacoInstance = monaco.editor.create(this.$refs.editor, {
        theme: this.getTheme(), //官方自带三种主题vs, hc-black, or vs-dark
        minimap: { enabled: false }, // 缩略导航
        value: value, //编辑器初始显示文字
        language: language.id,
        selectOnLineNumbers: true, //显示行号
        lineNumbers: lineNumbers, //显示行号
        roundedSelection: false,
        readOnly: this.readonly, // 只读
        cursorStyle: "line", //光标样式
        automaticLayout: true, //自动布局
        glyphMargin: false, //字形边缘
        useTabStops: false,
        fontSize: 13, //字体大小
        autoIndent: true, //自动布局
        // quickSuggestionsDelay: 500, //代码提示延时
        contextmenu: false,
        stopRenderingLineAfter: -1, // 一行最大显示字符数，默认 10000 ，-1 表示 一直渲染
      });
      // console.log(this.monacoInstance);
      this.monacoInstance.onDidChangeModelContent((e) => {
        if (this.isSetValue) {
          delete this.isSetValue;
        } else {
          this.change && this.change(this.getValue());
        }
      });
      this.monacoInstance.onContextMenu((e) => {
        this.tool.stopEvent();
        this.onContextMenu && this.onContextMenu();
      });
      // console.log(this.monacoInstance);
      // let as = this.monacoInstance.getActions();
      // as.forEach((a) => {
      //   if (a.id.toLowerCase().indexOf("copy") >= 0) {
      //     console.log(a);
      //   }
      // });
      //提示项设值
      //       monaco.languages.registerCompletionItemProvider("java", {
      //         provideCompletionItems: (model, position) => {
      //           console.log(model);
      //           console.log(position);
      //           let suggestions = [];

      //           suggestions.push({
      //             label: "main", // 显示的提示内容
      //             kind: monaco.languages.CompletionItemKind["Function"], // 用来显示提示内容后的不同的图标
      //             insertText: `public static void main(string[] args){
      // \t
      // }`, // 选择后粘贴到编辑器中的文字
      //             detail: "public static void main", // 提示内容后的说明
      //           });
      //           return { suggestions: suggestions };
      //         },
      //         // 光标选中当前自动补全item时触发动作，一般情况下无需处理
      //         resolveCompletionItem(item, token) {
      //           return null;
      //         },
      //       });
    },
    setSelection(arg) {
      this.monacoInstance && this.monacoInstance.setSelection(arg);
    },
    getAction(action) {
      return this.monacoInstance.getAction(action);
    },
  },
  mounted() {
    window.onMonacoLoad(() => {
      this.tool.registerLanguages();
      this.init();
    }, "component-editor");
  },
  beforeDestroy() {
    if (this.monacoInstance != null) {
      this.monacoInstance.dispose(); //使用完成销毁实例
    }
    this.monacoInstance = null;
  },
  beforeCreate() {},
};
</script>

<style >
.teamide-editor {
  width: 100%;
  height: 100%;
}
</style>
