<template>
  <div class="setting-page">
    <el-form
      v-if="userSetting != null"
      class="pdt-10 pdlr-10"
      size="mini"
      @submit.native.prevent
      label-width="200px"
    >
      <div class="pd-5 color-grey-1">基础设置</div>
      <el-form-item label="主题" class="mgb-5 mglr-10">
        <el-select
          placeholder="请选择主题"
          v-model="userSetting.theme"
          @change="toSave('theme')"
        >
          <el-option label="暗色" value="dark"> </el-option>
          <el-option label="亮色" value="light"></el-option>
        </el-select>
        <div class="mgl-10 tm-link color-orange" @click="toSave('theme', '')">
          恢复默认
        </div>
      </el-form-item>
      <div class="pd-5 color-grey-1">快捷键设置</div>
      <el-form-item label="关闭Tab页" class="mgb-5 mglr-10">
        <div
          class="mgl-10 tm-link color-green"
          @click="toSetKey('keyTabClose')"
        >
          点击设置：{{ keyToText(userSetting.keyTabClose) }}
        </div>
        <div
          class="mgl-10 tm-link color-orange"
          @click="toSave('keyTabClose', '')"
        >
          恢复默认
        </div>
      </el-form-item>
      <el-form-item label="切换到上一个Tab页" class="mgb-5 mglr-10">
        <div
          class="mgl-10 tm-link color-green"
          @click="toSetKey('keySwitchTabUp')"
        >
          点击设置：{{ keyToText(userSetting.keySwitchTabUp) }}
        </div>
        <div
          class="mgl-10 tm-link color-orange"
          @click="toSave('keySwitchTabUp', '')"
        >
          恢复默认
        </div>
      </el-form-item>
      <el-form-item label="切换到下一个Tab页" class="mgb-5 mglr-10">
        <div
          class="mgl-10 tm-link color-green"
          @click="toSetKey('keySwitchTabDown')"
        >
          点击设置：{{ keyToText(userSetting.keySwitchTabDown) }}
        </div>
        <div
          class="mgl-10 tm-link color-orange"
          @click="toSave('keySwitchTabDown', '')"
        >
          恢复默认
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      userSetting: null,
    };
  },
  computed: {},
  watch: {
    "source.userSetting"() {
      this.userSetting = Object.assign({}, this.source.userSetting);
    },
  },
  methods: {
    async init() {
      this.userSetting = Object.assign({}, this.source.userSetting);
    },
    refresh() {
      this.$nextTick(() => {
        this.init();
      });
    },
    toSetKey() {
      this.tool.warn("功能开发中，敬请期待！");
    },
    keyToText(key) {
      let ks = ("" + key).split(" + ");
      let res = "";
      if (ks.length > 0) {
        for (let i in ks) {
          let t = this.tool.keyCodeTextMap[ks[i]];
          if (i > 0) {
            res += " + ";
          }
          if (t) {
            res += t;
          } else {
            res += ks[i];
          }
        }
        return res;
      }
    },
    async toSave(name, v) {
      let value = this.userSetting[name];
      let data = {};
      if (v != null) {
        value = v;
      }
      if (value != null) {
        value = "" + value;
      }
      data[name] = value;
      let res = await this.server.user.setting.save({
        setting: data,
      });
      if (res.code == 0) {
        this.tool.success("设置成功！");
        if (value == "") {
          this.source.userSetting[name] = this.source.defaultUserSetting[name];
        } else {
          this.source.userSetting[name] = value;
        }
      } else {
        this.tool.error(res.msg);
      }
      this.userSetting[name] = this.source.userSetting[name];
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.setting-page {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
