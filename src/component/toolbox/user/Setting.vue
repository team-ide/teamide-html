<template>
  <div class="setting-page" v-if="userSetting != null">
    <div class="pd-10">基础设置</div>
    <el-form size="mini" @submit.native.prevent label-width="200px">
      <el-form-item label="主题" class="mgb-5 mglr-10">
        <el-select
          placeholder="请选择主题"
          v-model="userSetting.theme"
          @change="toSave('theme')"
          style="width: 200px"
        >
          <el-option label="暗色" value="dark"> </el-option>
          <el-option label="亮色" value="light"></el-option>
        </el-select>
        <div class="mgl-10 tm-link color-orange" @click="toSave('theme', '')">
          恢复默认
        </div>
      </el-form-item>
    </el-form>
    <div class="pd-10">配色</div>
    <el-form size="mini" @submit.native.prevent label-width="200px" inline>
      <template v-for="(one, index) in cssPlaces">
        <el-form-item :key="index" :label="one.text" class="mgb-5 mglr-10">
          <el-input
            v-model="userSetting[one.value]"
            style="width: 200px"
            placeholder="可以点击右侧选择颜色"
            @change="toSave(one.value)"
          >
          </el-input>
          <el-color-picker
            v-model="userSetting[one.value]"
            size="mini"
            style="vertical-align: -10px; margin-left: 10px"
            @change="toSave(one.value)"
          >
          </el-color-picker>
          <div
            class="mgl-10 tm-link color-orange"
            @click="toSave(one.value, '')"
          >
            置空
          </div>
        </el-form-item>
        <br v-if="(index + 1) % 2 == 0" :key="'br-' + index" />
      </template>
    </el-form>
    <div class="pd-10">快捷键设置</div>
    <el-form size="mini" @submit.native.prevent label-width="200px">
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
      cssPlaces: [
        { value: "color", text: "颜色" },
        { value: "backgroudColor", text: "背景" },
        { value: "headerColor", text: "头部颜色" },
        { value: "headerBackgroudColor", text: "头部背景" },
        { value: "headerTabColor", text: "头部Tab颜色" },
        { value: "headerTabBackgroudColor", text: "头部Tab背景" },
        { value: "bodyColor", text: "内容颜色" },
        { value: "bodyBackgroudColor", text: "内容背景" },
        { value: "bodyTabColor", text: "内容Tab颜色" },
        { value: "bodyTabBackgroudColor", text: "内容Tab背景" },
      ],
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
