<template>
  <div class="tools-json-page">
    <tm-layout height="100%">
      <tm-layout width="50%" class="">
        <el-form
          class="pdt-10 pdlr-10"
          style="height: 100%"
          size="mini"
          @submit.native.prevent
        >
          <el-form-item label="源文格式" class="mgb-5">
            <el-select v-model="fromType" style="width: 100px" @change="change">
              <el-option
                v-for="(one, index) in types"
                :key="index"
                :value="one.value"
                :label="one.text"
                :disabled="one.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <div style="width: 100%; height: calc(100% - 100px)">
            <Editor
              ref="Editor"
              :source="source"
              :value="from"
              :language="fromType"
              :change="fromChange"
            ></Editor>
          </div>
          <template v-if="error != null">
            <div class="color-error pdlr-10">
              异常： <span>{{ error }}</span>
            </div>
          </template>
        </el-form>
      </tm-layout>
      <tm-layout-bar right></tm-layout-bar>
      <tm-layout width="auto" class="app-scroll-bar">
        <el-form class="pdt-10 pdlr-10" size="mini" @submit.native.prevent>
          <el-form-item label="转换为" class="mgb-5">
            <el-checkbox-group v-model="toTypes" @change="change">
              <el-checkbox
                v-for="(one, index) in types"
                :key="index"
                :label="one.value"
                :disabled="one.disabled"
              >
                {{ one.text }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <template v-for="(one, index) in tos">
          <div :key="index">
            <div class="pdlr-5 pdb-5">{{ one.toType }}</div>
            <div style="height: 400px">
              <Editor ref="viewEditor" :source="source" :language="one.toType">
              </Editor>
            </div>
            <template v-if="one.error != null">
              <div class="color-error pdlr-10">
                异常： <span>{{ one.error }}</span>
              </div>
            </template>
          </div>
        </template>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
import jsYaml from "js-yaml";

export default {
  components: {},
  props: ["source", "toolboxWorker", "tabId", "extend", "defaultFormat"],
  data() {
    return {
      from: null,
      fromType: null,
      tos: [],
      toTypes: [],
      types: [
        { text: "JSON", value: "json" },
        { text: "YAML", value: "yaml" },
      ],
      error: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      let extend = this.extend || {};
      this.from = extend.from;
      this.fromType = extend.fromType || this.defaultFormat || "json";
      this.toTypes = extend.toTypes || [this.defaultFormat || "json"];
      this.format();
      this.$refs.Editor.setValue(this.from);
    },
    refresh() {
      this.$nextTick(() => {
        this.format();
      });
    },
    fromChange(value) {
      this.from = value;
      this.change(0);
    },
    change() {
      let keyValueMap = this.extend || {};
      keyValueMap.from = this.from;
      keyValueMap.fromType = this.fromType || "json";
      keyValueMap.toTypes = this.toTypes;
      this.toolboxWorker.updateOpenTabExtend(this.tabId, keyValueMap);
      this.format();
    },
    format() {
      let tos = [];
      let fromData = this.getFromData(this.fromType, this.from);
      if (this.toTypes) {
        this.toTypes.forEach((toType) => {
          let to = {};
          to.from = this.from;
          to.fromType = this.fromType;
          to.fromData = fromData;
          to.toType = toType;
          to.value = null;
          to.error = null;
          this.formatValue(to);
          tos.push(to);
        });
      }
      this.tos = tos;
      this.$nextTick(() => {
        this.tos.forEach((one, index) => {
          let es = this.$refs["viewEditor"];
          if (es && es.length > index) {
            es[index] && es[index].setValue && es[index].setValue(one.value);
          }
        });
      });
    },
    formatValue(data) {
      data.value = this.getToValue(data, data.fromData);
    },
    getFromData(type, value) {
      this.error = null;

      let fromData = null;

      if (this.tool.isNotEmpty(value)) {
        let fromType = ("" + type).toLowerCase();
        try {
          if (fromType == "json") {
            let json = null;
            try {
              json = this.tool.JSONbig.parse(value);
            } catch (error) {
              try {
                json = eval("(" + value + ")");
              } catch (error2) {
                throw error;
              }
            }
            fromData = json;
          } else if (fromType == "yaml") {
            fromData = jsYaml.load(value);
          }
        } catch (e) {
          this.error = e.toString();
        }
      }

      return fromData;
    },
    getToValue(data, fromData) {
      data.error = null;
      if (data == null || this.tool.isEmpty(data.toType) || fromData == null) {
        return null;
      }
      let value = null;
      let toType = ("" + data.toType).toLowerCase();

      try {
        if (toType == "json") {
          value = this.tool.JSONbig.stringify(fromData, null, "  ");
        } else if (toType == "yaml") {
          value = jsYaml.dump(fromData);
        }
      } catch (e) {
        data.error = e.toString();
      }
      return value;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.tools-json-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
