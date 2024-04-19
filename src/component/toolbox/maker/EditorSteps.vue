<template>
  <div v-if="ready" class="editor-steps">
    <div class="step-info">
      {
      <div class="tm-link color-grey mgr-10" @click="add({})">添加操作</div>
    </div>
    <template v-for="(step, index) in list">
      <div :key="'step-' + index" class="mglr-10 pd editor-step-box">
        <div class="step-info">
          <div class="tm-link color-grey mgr-10" @click="up(step)">上移</div>
          <div class="tm-link color-grey mgr-10" @click="down(step)">下移</div>
          <div class="tm-link color-grey mgr-10" @click="add({}, step)">
            追加操作
          </div>
          <div class="tm-link color-grey mgr-10" @click="del(step)">
            删除操作
          </div>
        </div>
        <EditorStep
          ref="EditorStep"
          :source="source"
          :worker="worker"
          :model="model"
          :step="step"
        >
        </EditorStep>
        <div class="step-info"></div>
      </div>
    </template>
    <div class="step-info">}</div>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "worker", "model"],
  data() {
    return {
      ready: false,
      list: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.list = [];
      let list = this.model.steps || [];
      list.forEach((one) => {
        this.add(one);
      });
      this.ready = true;
    },
    getStepComponents() {
      let s = this.$refs.EditorStep;
      if (s == null) {
        return [];
      }
      if (s.length >= 0) {
        return s;
      }
      return [s];
    },
    async fullSteps(model) {
      let stepComponents = this.getStepComponents();
      if (stepComponents.length != this.list.length) {
        this.tool.warn("阶段组件丢失");
        return false;
      }
      for (let i = 0; i < this.list.length; i++) {
        let stepComponent = stepComponents[i];
        if ((await stepComponent.fullStep(this.list[i])) === false) {
          return false;
        }
      }
      model.steps = this.list;
    },
    up(one) {
      this.tool.up(this, "list", one);
    },
    down(one) {
      this.tool.down(this, "list", one);
    },
    add(one, after) {
      one = one || {};
      one.name = one.name || "";
      one.comment = one.comment || "";

      let appendIndex = this.list.indexOf(after);
      if (appendIndex < 0) {
        appendIndex = this.list.length;
      } else {
        appendIndex++;
      }
      this.list.splice(appendIndex, 0, one);
    },
    del(one) {
      let findIndex = this.list.indexOf(one);
      if (findIndex >= 0) {
        this.list.splice(findIndex, 1);
      }
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.editor-steps {
  font-size: 12px;
}
.editor-steps .step-info {
  color: #6f6f6f;
}
.editor-step-box {
  border: 1px dotted #6f6f6f;
  margin-bottom: 10px;
}
</style>
