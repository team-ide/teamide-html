<template>
  <div class="toolbox-maker-model-editor" v-if="ready">
    <tm-layout height="100%">
      <tm-layout height="150px">
        <div class="pdlr-10 pdtb-10">
          <div class="tm-btn tm-btn-sm bg-grey-6" @click="refresh()">
            重新加载
          </div>
          <div class="tm-btn tm-btn-sm bg-green" @click="save()">保存</div>
        </div>
        <el-form
          ref="form"
          size="mini"
          label-width="300px"
          @submit.native.prevent
        >
          <el-form-item
            label="说明（简要说明，方便查看）"
            class="mgb-5"
            style="width: 100%"
          >
            <el-input v-model="model.comment" />
          </el-form-item>
          <el-form-item
            label="注释（详细说明，用户源码输出）"
            class="mgb-5"
            style="width: 100%"
          >
            <el-input type="textarea" v-model="model.note" resize="none" />
          </el-form-item>
        </el-form>
      </tm-layout>
      <tm-layout height="auto">
        <EditorConstant
          ref="Editor"
          v-if="this.modelType == 'constant'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorConstant>
        <EditorError
          ref="Editor"
          v-else-if="this.modelType == 'error'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorError>
        <EditorStruct
          ref="Editor"
          v-else-if="this.modelType == 'struct'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorStruct>
        <EditorConfigDatabase
          ref="Editor"
          v-else-if="this.modelType == 'config/database'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorConfigDatabase>
        <EditorConfigRedis
          ref="Editor"
          v-else-if="this.modelType == 'config/redis'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorConfigRedis>
        <EditorConfigZookeeper
          ref="Editor"
          v-else-if="this.modelType == 'config/zookeeper'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorConfigZookeeper>
        <EditorConfigKafka
          ref="Editor"
          v-else-if="this.modelType == 'config/kafka'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorConfigKafka>
        <EditorConfigElasticsearch
          ref="Editor"
          v-else-if="this.modelType == 'config/elasticsearch'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorConfigElasticsearch>
        <EditorConfigMongodb
          ref="Editor"
          v-else-if="this.modelType == 'config/mongodb'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorConfigMongodb>
        <EditorFunc
          ref="Editor"
          v-else-if="this.modelType == 'func'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorFunc>
        <EditorDao
          ref="Editor"
          v-else-if="this.modelType == 'dao'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorDao>
        <EditorService
          ref="Editor"
          v-else-if="this.modelType == 'service'"
          class="toolbox-maker-model-editor-body"
          :source="source"
          :worker="worker"
          :model="model"
        >
        </EditorService>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
import EditorConstant from "./EditorConstant";
import EditorError from "./EditorError";
import EditorStruct from "./EditorStruct";
import EditorConfigDatabase from "./EditorConfigDatabase";
import EditorConfigRedis from "./EditorConfigRedis";
import EditorConfigZookeeper from "./EditorConfigZookeeper";
import EditorConfigKafka from "./EditorConfigKafka";
import EditorConfigElasticsearch from "./EditorConfigElasticsearch";
import EditorConfigMongodb from "./EditorConfigMongodb";
import EditorFunc from "./EditorFunc";
import EditorDao from "./EditorDao";
import EditorService from "./EditorService";

export default {
  components: {
    EditorConstant,
    EditorError,
    EditorStruct,
    EditorConfigDatabase,
    EditorConfigRedis,
    EditorConfigZookeeper,
    EditorConfigKafka,
    EditorConfigElasticsearch,
    EditorConfigMongodb,
    EditorFunc,
    EditorDao,
    EditorService,
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
