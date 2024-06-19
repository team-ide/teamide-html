<template>
  <div class="toolbox-maker-model-editor" v-if="ready">
    <tm-layout height="100%">
      <tm-layout height="150px">
        <div class="pdlr-10 pdtb-10">
          <div class="tm-btn tm-btn-sm bg-grey-6" @click="refresh()">
            重新加载
          </div>
          <div class="tm-btn tm-btn-sm bg-green" @click="save()">保存</div>
          <template
            v-if="
              modelType == 'func' ||
              modelType == 'storage' ||
              modelType == 'service'
            "
          >
            <div class="tm-btn tm-btn-sm bg-green" @click="invoke()">
              模拟执行
            </div>
          </template>
          <template v-if="modelType == 'language/golang'">
            <div class="tm-btn tm-btn-sm bg-green" @click="gen()">生成源码</div>
          </template>
        </div>
        <el-form
          ref="form"
          size="mini"
          label-width="300px"
          @submit.native.prevent
        >
          <el-form-item label="说明" class="mgb-5" style="width: 100%">
            <el-input v-model="model.comment" />
          </el-form-item>
        </el-form>
      </tm-layout>
      <tm-layout height="auto">
        <EditorConstant
          ref="Editor"
          v-if="modelType == 'constant'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorConstant>
        <EditorError
          ref="Editor"
          v-else-if="modelType == 'error'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorError>
        <EditorStruct
          ref="Editor"
          v-else-if="modelType == 'struct'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorStruct>
        <EditorFunc
          ref="Editor"
          v-else-if="modelType == 'func'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorFunc>
        <EditorStorage
          ref="Editor"
          v-else-if="modelType == 'storage'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorStorage>
        <EditorService
          ref="Editor"
          v-else-if="modelType == 'service'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorService>
        <EditorApp
          ref="Editor"
          v-else-if="modelType == 'app'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorApp>
        <EditorLanguageGolang
          ref="Editor"
          v-else-if="modelType == 'language/golang'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorLanguageGolang>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
import EditorConstant from "./EditorConstant";
import EditorError from "./EditorError";
import EditorStruct from "./EditorStruct";
import EditorApp from "./EditorApp";
import EditorFunc from "./EditorFunc";
import EditorStorage from "./EditorStorage";
import EditorService from "./EditorService";
import EditorLanguageGolang from "./EditorLanguageGolang";

export default {
  components: {
    EditorConstant,
    EditorError,
    EditorStruct,
    EditorApp,
    EditorFunc,
    EditorStorage,
    EditorService,
    EditorLanguageGolang,
  },
  props: ["source", "toolboxWorker", "extend", "worker"],
  data() {
    return {
      ready: false,
      modelType: null,
      modelName: null,
      model: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      if (this.extend) {
        this.modelType = this.extend.modelType;
        this.modelName = this.extend.modelName;
      }
      if (
        this.tool.isEmpty(this.modelType) ||
        this.tool.isEmpty(this.modelName)
      ) {
        this.tool.warn("参数丢失，请重新打开");
        return;
      }
      let model = await this.worker.get(this.modelType, this.modelName);
      if (model == null) {
        this.tool.warn("数据丢失，请重新打开");
        return;
      }
      model.name = this.modelName;
      this.model = model;
      this.ready = true;
    },
    refresh() {
      this.ready = false;
      this.$nextTick(() => {
        this.init();
      });
    },
    async save() {
      let model = this.model;
      if (this.$refs.Editor.fullModel) {
        let fullRes = this.$refs.Editor.fullModel(model);
        if (fullRes === false) {
          return;
        }
      }
      await this.worker.save(this.modelType, this.modelName, model, false);
    },
    async gen() {
      await this.worker.gen(this.modelType);
    },
    async invoke() {
      let param = {};
      await this.worker.invoke(this.modelType, param);
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-maker-model-editor {
  width: 100%;
  height: 100%;
  position: relative;
  user-select: text;
}
.toolbox-maker-model-editor-header {
  height: 100px;
  position: relative;
}
.toolbox-maker-model-editor-body {
  height: 100px;
  position: relative;
}
</style>
