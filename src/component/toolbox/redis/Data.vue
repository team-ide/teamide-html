<template>
  <div class="toolbox-redis-data" v-loading="loading">
    <template v-if="ready">
      <div class="toolbox-redis-form-box">
        <el-form size="mini" @submit.native.prevent>
          <el-form size="mini" @submit.native.prevent inline class="pdt-10">
            <el-form-item label="Database">
              <el-input v-model="form.database" style="width: 100px">
              </el-input>
            </el-form-item>
            <el-form-item label="值类型">
              <el-select
                placeholder="请选择类型"
                v-model="form.valueType"
                style="width: 100px"
              >
                <el-option label="string" value="string"> </el-option>
                <el-option label="list" value="list"></el-option>
                <el-option label="set" value="set"></el-option>
                <el-option label="hash" value="hash"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="过期时间（秒）">
              <el-input v-model="form.expire" style="width: 100px"> </el-input>
            </el-form-item>
          </el-form>
          <el-form-item label="Key">
            <el-input v-model="form.key"> </el-input>
          </el-form-item>
          <div
            class="ft-12 pdb-10"
            v-if="form.memoryUsage > 0 || form.valueCount > 0"
          >
            <template v-if="form.memoryUsage > 0">
              <span class="mgl-10">
                内存占用
                <span class="mgl-10 color-orange">
                  {{ form.unitMemoryUsage }}
                </span>
                <span class="mgl-3 color-orange">
                  {{ form.unit }}
                </span>
              </span>
            </template>
            <template v-if="form.valueCount > 0">
              <span class="mgl-10">
                值数量
                <span class="mgl-10 color-orange">
                  {{ form.valueCount }}
                </span>
              </span>
            </template>
            <div class="tm-link color-green" @click="reloadForm()">刷新</div>
          </div>
          <template v-if="form.valueType == 'string'">
            <el-form-item label="Value">
              <el-input
                type="textarea"
                v-model="form.value"
                :autosize="{ minRows: 5, maxRows: 10 }"
              >
              </el-input>
            </el-form-item>
            <div class="pdlr-10">
              <div
                class="tm-btn bg-grey-7"
                @click="tool.showJSONData(form.value)"
              >
                预览值
              </div>
              <div class="tm-btn bg-teal-8" @click="toSave">保存</div>
            </div>
          </template>
          <template
            v-if="
              form.valueType == 'list' ||
              form.valueType == 'set' ||
              form.valueType == 'hash'
            "
          >
            <el-form-item label="ValueSize（加载值数量）">
              <el-input v-model="form.valueSize" @change="valueSizeChange">
              </el-input>
            </el-form-item>
          </template>
        </el-form>
        <el-form
          v-if="form.valueType != 'string'"
          class="toolbox-redis-value-box app-scroll-bar"
          size="mini"
          @submit.native.prevent
        >
          <template v-if="form.valueType == 'list'">
            <div class="pdlr-10">
              List
              <a
                class="tm-link color-green ft-15 mgl-20"
                @click="
                  addOne('listList', {
                    value: null,
                    index: listList.length,
                  })
                "
                title="添加"
              >
                <i class="mdi mdi-plus"></i>
              </a>
            </div>
            <div
              v-if="listList.length > 0"
              class="mglr-10 mgt-10 bd-1 bd-grey-7"
            >
              <template v-for="(one, index) in listList">
                <el-row :key="index">
                  <el-col :span="20">
                    <el-form-item :label="'Value' + '（' + one.index + '）'">
                      <el-input v-model="one.value"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <a
                      class="tm-link color-grey ft-15 mgt-30"
                      @click="tool.showJSONData(one.value)"
                      title="预览值"
                    >
                      <i class="mdi mdi-eye"></i>
                    </a>
                    <a
                      class="tm-link color-green ft-15 mgt-30"
                      @click="
                        toDo(one.isNew ? 'rpush' : 'lset', {
                          value: one.value,
                          index: one.index,
                        })
                      "
                      title="保存"
                    >
                      <i class="mdi mdi-content-save-outline"></i>
                    </a>
                    <a
                      class="tm-link color-red ft-15 mgt-30"
                      @click="
                        toDo('lrem', {
                          value: one.value,
                          count: 0,
                          isNew: one.isNew,
                        })
                      "
                      title="删除"
                    >
                      <i class="mdi mdi-delete-outline"></i>
                    </a>
                  </el-col>
                </el-row>
              </template>
            </div>
          </template>
          <template v-else-if="form.valueType == 'set'">
            <div class="pdlr-10">
              Set
              <a
                class="tm-link color-green ft-15 mgl-20"
                @click="
                  addOne('setList', {
                    value: null,
                    index: setList.length,
                  })
                "
                title="添加"
              >
                <i class="mdi mdi-plus"></i>
              </a>
            </div>
            <div
              v-if="setList.length > 0"
              class="mglr-10 mgt-10 bd-1 bd-grey-7"
            >
              <template v-for="(one, index) in setList">
                <el-row :key="index">
                  <el-col :span="20">
                    <el-form-item :label="'Value' + '（' + one.index + '）'">
                      <el-input v-model="one.value"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <a
                      class="tm-link color-grey ft-15 mgt-30"
                      @click="tool.showJSONData(one.value)"
                      title="预览值"
                    >
                      <i class="mdi mdi-eye"></i>
                    </a>
                    <a
                      class="tm-link color-green ft-15 mgt-30"
                      @click="
                        toDo('sadd', {
                          value: one.value,
                          index: one.index,
                          isNew: one.isNew,
                        })
                      "
                      title="保存"
                    >
                      <i class="mdi mdi-content-save-outline"></i>
                    </a>
                    <a
                      class="tm-link color-red ft-15 mgt-30"
                      @click="toDo('srem', { value: one.value })"
                      title="删除"
                    >
                      <i class="mdi mdi-delete-outline"></i>
                    </a>
                  </el-col>
                </el-row>
              </template>
            </div>
          </template>
          <template v-else-if="form.valueType == 'hash'">
            <div class="pdlr-10">
              Hash
              <a
                class="tm-link color-green ft-15 mgl-20"
                @click="
                  addOne('hashList', {
                    field: null,
                    value: null,
                    index: hashList.length,
                  })
                "
                title="添加"
              >
                <i class="mdi mdi-plus"></i>
              </a>
            </div>
            <div
              v-if="hashList.length > 0"
              class="mglr-10 mgt-10 bd-1 bd-grey-7"
            >
              <template v-for="(one, index) in hashList">
                <el-row :key="index">
                  <el-col :span="10">
                    <el-form-item :label="'Field' + '（' + one.index + '）'">
                      <el-input v-model="one.field"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item :label="'Value'">
                      <el-input v-model="one.value"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <a
                      class="tm-link color-grey ft-15 mgt-30"
                      @click="tool.showJSONData(one.value)"
                      title="预览值"
                    >
                      <i class="mdi mdi-eye"></i>
                    </a>
                    <a
                      class="tm-link color-green ft-15 mgt-30"
                      @click="
                        toDo('hset', {
                          field: one.field,
                          value: one.value,
                          index: one.index,
                          isNew: one.isNew,
                        })
                      "
                      title="保存"
                    >
                      <i class="mdi mdi-content-save-outline"></i>
                    </a>
                    <a
                      class="tm-link color-red ft-15 mgt-30"
                      @click="toDo('hdel', { field: one.field })"
                      title="删除"
                    >
                      <i class="mdi mdi-delete-outline"></i>
                    </a>
                  </el-col>
                </el-row>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="text-center ft-13 pdtb-10">
              暂不支持[{{ form.valueType }}]类型的值编辑!
            </div>
          </template>
        </el-form>
      </div>
    </template>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "extend"],
  data() {
    return {
      ready: false,
      loading: false,
      form: {
        database: 0,
        valueType: "string",
        valueSize: 10,
        key: null,
        value: null,
        memoryUsage: 0,
        unitMemoryUsage: null,
        unit: null,
        valueCount: 0,
        expire: null,
      },
      setList: [],
      listList: [],
      hashList: [],
      jsonList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      let extend = this.extend || {};
      let database = extend.database || 0;
      let key = extend.key;
      this.form.database = Number(database);
      this.form.key = key;
      this.initForm();
      this.ready = true;
    },
    refresh() {},
    reloadForm() {
      this.initForm();
    },
    getKeyBase64() {
      if (
        this.extend &&
        this.extend.key &&
        this.extend.keyBase64 &&
        this.extend.key == this.form.key
      ) {
        return this.extend.keyBase64;
      }
      return null;
    },
    async initForm() {
      this.loading = true;
      this.form.value = null;
      this.form.expire = null;
      this.form.memoryUsage = 0;
      this.form.valueCount = 0;

      this.setList = [];
      this.listList = [];
      this.hashList = [];

      if (this.tool.isNotEmpty(this.form.key)) {
        let keyData = await this.load(
          this.form.database,
          this.form.key,
          this.getKeyBase64()
        );
        this.initFormData(keyData);
      }
      if (this.tool.isEmpty(this.form.valueType)) {
        this.form.valueType = "string";
      }
      this.loading = false;
    },
    async load(database, key, keyBase64) {
      let param = this.toolboxWorker.getWorkParam({
        database: Number(database),
        key: key,
        keyBase64: keyBase64 || null,
        valueSize: Number(this.form.valueSize),
      });
      let res = await this.server.redis.get(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let data = res.data || {};
      return data;
    },
    initFormData(data) {
      this.form.database = Number(data.database);
      this.form.key = data.key;
      if (data.valueType != "none") {
        this.form.valueType = data.valueType || "string";
      }
      if (data.ttl > 0) {
        this.form.expire = data.ttl;
      } else {
        this.form.expire = null;
      }
      this.form.value = null;
      this.form.memoryUsage = data.memoryUsage || 0;
      this.form.unitMemoryUsage = null;
      this.form.unit = null;
      this.tool.formatSize(this.form, "memoryUsage", "unitMemoryUsage", "unit");
      this.form.valueCount = data.valueCount || 0;
      this.setList = [];
      this.listList = [];
      this.hashList = [];
      if (data.valueType == "list") {
        data.value = data.value || [];
        data.value.forEach((one, index) => {
          this.listList.push({
            value: one,
            index: index,
            isNew: false,
          });
        });
      } else if (data.valueType == "set") {
        data.value = data.value || [];
        data.value.forEach((one, index) => {
          this.setList.push({
            value: one,
            index: index,
            isNew: false,
          });
        });
      } else if (data.valueType == "hash") {
        data.value = data.value || {};
        let index = 0;
        for (var field in data.value) {
          this.hashList.push({
            field: field,
            value: data.value[field],
            index: index,
            isNew: false,
          });
          index++;
        }
      } else {
        this.form.value = data.value;
      }
    },
    valueSizeChange() {
      if (this.tool.isNotEmpty(this.form.key)) {
        this.initForm();
      }
    },
    addOne(type, one) {
      one.isNew = true;
      this[type].push(one);
    },
    toSave() {
      this.doSave();
    },
    async toDo(doType, data) {
      data = data || {};
      data.database = Number(this.form.database);
      data.key = this.form.key;
      data.keyBase64 = this.getKeyBase64();
      if (this.tool.isEmpty(doType)) {
        this.tool.error("操作类型不能为空！");
        return;
      }
      if (this.tool.isEmpty(data.key)) {
        this.tool.error("Key不能为空！");
        return;
      }
      if (doType == "lrem") {
        if (data.isNew) {
          this.listList.splice(this.listList.indexOf(data), 1);
          return;
        }
        this.tool
          .confirm("确认删除[" + data.key + "]下所有值[" + data.value + "]？")
          .then(async () => {
            await this.doDo(doType, data);
          })
          .catch((e) => {});
      } else if (doType == "srem") {
        if (data.isNew) {
          this.setList.splice(this.setList.indexOf(data), 1);
          return;
        }
        this.tool
          .confirm("确认删除[" + data.key + "]下键[" + data.value + "]？")
          .then(async () => {
            await this.doDo(doType, data);
          })
          .catch((e) => {});
      } else if (doType == "hdel") {
        if (data.isNew) {
          this.hashList.splice(this.hashList.indexOf(data), 1);
          return;
        }
        this.tool
          .confirm("确认删除[" + data.key + "]下键[" + data.field + "]？")
          .then(async () => {
            await this.doDo(doType, data);
          })
          .catch((e) => {});
      } else {
        await this.doDo(doType, data);
      }
    },
    async doDo(doType, data) {
      let param = this.toolboxWorker.getWorkParam(data);
      let call = this.server.redis[doType];
      if (call == null) {
        this.tool.error("暂不支持[" + doType + "]操作！");
        return;
      }
      let res = await call(param);
      if (res.code == 0) {
        this.tool.success("操作成功");
        this.initForm();
        this.toolboxWorker.loadKeys();
      } else {
        this.tool.error(res.msg);
      }
    },
    async doSave() {
      this.form.valueSize = Number(this.form.valueSize);
      this.form.expire = Number(this.form.expire);
      let param = this.toolboxWorker.getWorkParam(Object.assign({}, this.form));
      param.keyBase64 = this.getKeyBase64();
      let res = await this.server.redis.set(param);

      if (res.code == 0) {
        this.tool.success("保存成功!");
        this.initForm();
        this.toolboxWorker.loadKeys();
      } else {
        this.tool.error(res.msg);
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
.toolbox-redis-data {
  width: 100%;
  height: 100%;
}
.toolbox-redis-form-box {
  width: 100%;
  height: 100%;
}
.toolbox-redis-value-box {
  width: 100%;
  height: calc(100% - 240px);
}
.toolbox-redis-form-box .el-form .el-form-item {
  padding: 0px 10px;
}
</style>
