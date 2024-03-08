<template>
  <div class="toolbox-mongodb-index">
    <template v-if="ready">
      <el-form class="pdlr-10" size="mini">
        <el-form-item label="库">
          <el-input :value="databaseName" readonly> </el-input>
        </el-form-item>
        <el-form-item label="集合">
          <el-input :value="collectionName" readonly> </el-input>
        </el-form-item>
      </el-form>

      <div class="pd-10">
        <div class="pdtb-5 ft-13">
          <span class="color-grey">索引列表</span>
          <div class="tm-link color-grey mgl-10" @click="initIndexList()">
            刷新
          </div>
          <div class="tm-link color-green mgl-10" @click="addIndex({})">
            新增
          </div>
        </div>
        <el-table
          :data="indexList"
          :border="true"
          style="width: 100%"
          size="mini"
        >
          <el-table-column label="索引名称" width="200">
            <template slot-scope="scope">
              <div class="">
                <el-input
                  v-model="scope.row.name"
                  type="text"
                  :readonly="scope.row.oldData != null"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="索引字段">
            <template slot-scope="scope">
              <div class="">
                <el-table
                  :data="scope.row.keys"
                  :border="true"
                  size="mini"
                  style="width: 100%"
                  :show-header="false"
                >
                  <el-table-column label="">
                    <template slot-scope="scopeKey">
                      <div class="">
                        <el-input
                          v-model="scopeKey.row.name"
                          type="text"
                          :readonly="scope.row.oldData != null"
                        />
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="">
                    <template slot-scope="scopeKey">
                      <div class="">
                        <el-select
                          v-model="scopeKey.row.value"
                          filterable
                          style="width: 100%"
                          :disabled="scope.row.oldData != null"
                        >
                          <el-option
                            v-for="(one, index) in indexKeyTypes"
                            :key="index"
                            :value="one.value"
                            :label="one.text"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="" width="60">
                    <template slot-scope="scopeKey">
                      <div
                        v-if="scope.row.oldData == null"
                        class="tm-link color-red mglr-5"
                        @click="removeKey(scope.row, scopeKey.row)"
                      >
                        删除
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  v-if="scope.row.oldData == null"
                  class="tm-link color-green mgl-10"
                  @click="addKey(scope.row, {})"
                >
                  新增
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="索引类型" width="180px">
            <template slot-scope="scope">
              <div class="">
                <el-select
                  v-model="scope.row.type"
                  filterable
                  style="width: 100%"
                  :disabled="scope.row.oldData != null"
                >
                  <el-option
                    v-for="(one, index) in indexTypes"
                    :key="index"
                    :value="one.value"
                    :label="one.text"
                  >
                  </el-option>
                </el-select>
                <div class="pd-5" v-if="scope.row.type == 'expireAfterSeconds'">
                  失效时间：
                  <el-input
                    v-model="scope.row.expireAfterSeconds"
                    type="text"
                    :readonly="scope.row.oldData != null"
                    style="width: 80px"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <div
                class="tm-link color-green mglr-5"
                @click="createIndex(scope.row)"
                v-if="scope.row.oldData == null && scope.row.keys.length != 0"
              >
                创建
              </div>
              <div
                class="tm-link color-red mglr-5"
                @click="removeIndex(scope.row)"
              >
                删除
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "databaseName", "collectionName", "toolboxWorker"],
  data() {
    return {
      ready: false,
      indexList: [],
      indexKeyTypes: [
        { text: "正序索引", value: 1 },
        { text: "倒排索引", value: -1 },
        { text: "文本索引", value: "text" },
        { text: "地理空间索引", value: "2dsphere" },
        { text: "散列索引", value: "hashed" },
      ],
      indexTypes: [
        { text: "常规索引", value: "" },
        { text: "唯一索引", value: "unique" },
        { text: "TTL索引", value: "expireAfterSeconds" },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      this.ready = true;
      this.initIndexList();
    },
    addIndex(index) {
      index = index || {};
      index.name = index.name || "index_xx";
      index.oldData = index.oldData || null;
      index.keys = index.keys || [];
      index.type = index.type || "";
      if (index.unique) {
        index.type = "unique";
      } else if (index.expireAfterSeconds != null) {
        index.type = "expireAfterSeconds";
      }
      index.expireAfterSeconds = index.expireAfterSeconds || 3600;
      if (index.keys.length == 0) {
        this.addKey(index, {});
      }

      this.indexList.push(index);
      return index;
    },
    addKey(index, key) {
      key = key || {};
      key.name = key.name || "index_key";
      key.value = key.value || 1;

      index.keys.push(key);
      return key;
    },
    removeKey(index, key) {
      if (index.keys.indexOf(key) >= 0) {
        index.keys.splice(index.keys.indexOf(key), 1);
      }
    },
    removeIndex(index) {
      if (index.oldData == null) {
        if (this.indexList.indexOf(index) >= 0) {
          this.indexList.splice(this.indexList.indexOf(index), 1);
        }
      } else {
        let msg = "确认删除索引[" + index.name + "]";
        msg += "?";
        this.tool
          .confirm(msg)
          .then(async () => {
            this.doDelete(index);
          })
          .catch((e) => {});
      }
    },
    async initIndexList() {
      let list = await this.loadIndexes();
      this.indexList = [];
      list.forEach((one) => {
        let oldData = JSON.parse(JSON.stringify(one));
        one.keys = [];
        if (one.key) {
          Object.keys(one.key).forEach((k) => {
            one.keys.push({
              name: k,
              value: one.key[k],
            });
          });
        }
        delete one.key;
        one.oldData = oldData;
        this.addIndex(one);
      });
    },
    async loadIndexes() {
      let param = this.toolboxWorker.getWorkParam({
        databaseName: this.databaseName,
        collectionName: this.collectionName,
      });
      let res = await this.server.mongodb.index.list(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let list = res.data || [];
      return list;
    },
    async doDelete(index) {
      let param = this.toolboxWorker.getWorkParam({
        databaseName: this.databaseName,
        collectionName: this.collectionName,
        indexName: index.name,
      });
      let res = await this.server.mongodb.index.delete(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      } else {
        this.tool.success("删除成功");
        this.initIndexList();
      }
      return true;
    },
    async createIndex(index) {
      let keys = [];
      index.keys.forEach((one) => {
        if (this.tool.isEmpty(one.name)) {
          return;
        }
        let d = {
          key: one.name,
          value: one.value,
        };
        if (this.tool.isEmpty(one.value)) {
          d.value = 1;
        }
        keys.push(d);
      });

      if (keys.length == 0) {
        this.tool.warn("请设置key");
        return;
      }

      if (this.tool.isEmpty(index.name)) {
        index.name = "";
        keys.forEach((k, i) => {
          if (i > 0) {
            index.name += "_";
          }
          index.name += k.key + "_" + k.value;
        });
      }
      let param = this.toolboxWorker.getWorkParam({
        databaseName: this.databaseName,
        collectionName: this.collectionName,
        indexName: index.name,
        keys: keys,
      });
      param.indexType = index.type;
      if (index.type == "expireAfterSeconds") {
        param.expireAfterSeconds = Number(index.expireAfterSeconds);
        if (param.expireAfterSeconds == null || param.expireAfterSeconds < 0) {
          this.tool.warn("请设置失效时间");
          return;
        }
      }
      let res = await this.server.mongodb.index.create(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        return false;
      } else {
        this.tool.success("创建成功");
        this.initIndexList();
      }
      return true;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
};
</script>

<style>
.toolbox-mongodb-index {
  width: 100%;
  height: 100%;
  user-select: text;
}
</style>
