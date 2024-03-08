<template>
  <div class="toolbox-mongodb-collection-data">
    <template v-if="ready">
      <tm-layout height="100%">
        <tm-layout height="120px" style="overflow: hidden">
          <tm-layout width="auto">
            <ul class="part-box app-scroll-bar mg-0">
              <template v-for="(one, index) in searchForm.whereList">
                <li :key="index">
                  <input v-model="one.checked" type="checkbox" />
                  <select
                    v-model="one.name"
                    @change="whereNameChange(one)"
                    class="part-form-input"
                  >
                    <option :value="null" text="请选择">请选择</option>
                    <template v-for="(one, index) in pointColumnList">
                      <option
                        :key="index"
                        :value="one.name"
                        :text="one.name + '&nbsp;'"
                      >
                        {{ one.name }}
                        <template v-if="tool.isNotEmpty(one.comment)">
                          （{{ one.comment }}）
                        </template>
                      </option>
                    </template>
                  </select>
                  <select
                    v-model="one.conditionalOperation"
                    @change="conditionalOperationChange(one)"
                    class="part-form-input"
                  >
                    <option value="=">等于</option>
                    <option value="<>">不等于</option>
                    <option value="like">包含</option>
                    <option value=">">大于</option>
                    <option value=">=">大于等于</option>
                    <option value="<">小于</option>
                    <option value="<=">小于等于</option>
                    <option value="like start">开始以</option>
                    <option value="like end">结束以</option>
                    <option value="between">介于</option>
                    <option value="in">IN</option>
                  </select>
                  <template v-if="one.conditionalOperation == 'between'">
                    <input
                      v-model="one.before"
                      type="text"
                      @input="initInputWidth"
                      @change="initInputWidth"
                      class="part-form-input"
                    />
                    <span class="mglr-5">,</span>
                    <input
                      v-model="one.after"
                      type="text"
                      @input="initInputWidth"
                      @change="initInputWidth"
                      class="part-form-input"
                    />
                  </template>
                  <template v-else>
                    <input
                      v-model="one.value"
                      type="text"
                      @input="initInputWidth"
                      @change="initInputWidth"
                      class="part-form-input"
                    />
                  </template>
                  <!-- <select
                    v-model="one.andOr"
                    @change="initInputWidth"
                    class="part-form-input"
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select> -->

                  <span>类型</span>
                  <select
                    v-model="one.dataType"
                    class="part-form-input"
                    style="width: 80px"
                  >
                    <option value="string">字符串</option>
                    <option value="number">数字</option>
                    <option value="objectID">ObjectID</option>
                  </select>

                  <div
                    @click="removeWhere(one)"
                    class="color-grey tm-link mgl-10"
                  >
                    删除
                  </div>
                </li>
              </template>
              <li class="pdl-5">
                <div @click="addWhere" class="color-green tm-link mgr-10">
                  添加条件
                </div>
              </li>
            </ul>
          </tm-layout>
          <!-- <tm-layout-bar right></tm-layout-bar> -->
          <tm-layout width="300px">
            <ul class="part-box app-scroll-bar mg-0">
              <template v-for="(one, index) in searchForm.orderList">
                <li :key="index">
                  <input v-model="one.checked" type="checkbox" />
                  <select
                    v-model="one.name"
                    @change="initInputWidth"
                    class="part-form-input"
                  >
                    <option :value="null" text="请选择">请选择</option>
                    <template v-for="(one, index) in pointColumnList">
                      <option
                        :key="index"
                        :value="one.name"
                        :text="one.name + '&nbsp;'"
                      >
                        {{ one.name }}
                        <template v-if="tool.isNotEmpty(one.comment)">
                          （{{ one.comment }}）
                        </template>
                      </option>
                    </template>
                  </select>
                  <select
                    v-model="one.ascDesc"
                    @change="initInputWidth"
                    class="part-form-input"
                  >
                    <option value="DESC">DESC</option>
                    <option value="ASC">ASC</option>
                  </select>
                  <div
                    @click="removeOrder(one)"
                    class="color-grey tm-link mgl-10"
                  >
                    删除
                  </div>
                </li>
              </template>
              <li class="pdl-5">
                <div @click="addOrder" class="color-green tm-link mgr-10">
                  添加排序
                </div>
              </li>
            </ul>
          </tm-layout>
        </tm-layout>
        <tm-layout-bar bottom></tm-layout-bar>
        <tm-layout height="35px">
          <div class="pdl-10 pdt-4">
            <div
              class="tm-btn tm-btn-sm bg-teal-8 ft-13"
              @click="toSearch"
              :class="{ 'tm-disabled': dataListLoading }"
            >
              搜索
            </div>
            <div class="tm-btn tm-btn-sm bg-green ft-13" @click="toInsert">
              新增
            </div>
            <div
              v-if="dataList != null && dataList.length != 0"
              class="tm-btn tm-btn-sm bg-grey ft-13"
              @click="toExportData"
            >
              导出表格数据
            </div>
          </div>
        </tm-layout>
        <tm-layout height="auto">
          <div style="height: 100%">
            <el-table
              :data="dataList"
              :border="true"
              height="100%"
              style="width: 100%"
              size="mini"
              v-loading="dataListLoading"
            >
              <!-- @row-dblclick="rowDblClick" -->
              <template v-for="(column, index) in columnList">
                <template v-if="column.checked">
                  <el-table-column
                    :key="index"
                    :prop="column.name"
                    :label="column.name"
                  >
                    <template slot-scope="scope">
                      <span
                        v-if="column.name == '_id' && scope.row.isObjectID"
                        class=""
                      >
                        <span class="color-orange">ObjectId('</span>
                        {{ tool.getStringValue(scope.row.data[column.name]) }}
                        <span class="color-orange">')</span>
                      </span>
                      <span v-else class="">
                        {{ tool.getStringValue(scope.row.data[column.name]) }}
                      </span>
                    </template>
                  </el-table-column>
                </template>
              </template>
              <el-table-column width="180" label="操作" fixed="right">
                <template slot-scope="scope">
                  <div
                    class="tm-btn color-grey tm-btn-xs"
                    @click="tool.showJSONData(scope.row.value)"
                  >
                    查看
                  </div>
                  <div
                    class="tm-btn color-blue tm-btn-xs"
                    @click="toUpdate(scope.row)"
                  >
                    修改
                  </div>
                  <div
                    class="tm-btn color-grey tm-btn-xs"
                    @click="toCopy(scope.row)"
                  >
                    复制
                  </div>
                  <div
                    class="tm-btn color-orange tm-btn-xs"
                    @click="toDelete(scope.row)"
                    title="删除"
                  >
                    <i class="mdi mdi-delete-outline"></i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </tm-layout>
        <tm-layout height="30px">
          <div class="ft-12 pdt-2 text-center">
            <el-pagination
              small
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[10, 50, 100, 200, 500, 1000, 5000]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :disabled="total == 0"
            >
            </el-pagination>
          </div>
        </tm-layout>
      </tm-layout>
    </template>
  </div>
</template>


<script>
var JSONbig = require("json-bigint");
var JSONbigString = JSONbig({ storeAsString: true });

export default {
  components: {},
  props: ["source", "databaseName", "collectionName", "toolboxWorker"],
  data() {
    return {
      ready: false,
      searchForm: {
        databaseName: this.databaseName,
        collectionName: this.collectionName,
        whereList: [],
        orderList: [],
      },
      pageIndex: 1,
      pageSize: 50,
      total: 0,
      dataList: null,
      columnList: [],
      pointColumnList: [],
      dataListLoading: false,
      columnNames: [],
      pointColumnNames: [],
      source_name: "$$_source_key_for_tool_$$",
    };
  },
  computed: {},
  watch: {},
  methods: {
    toExportData() {
      let dataList = [];
      this.dataList.forEach((one) => {
        dataList.push(one._source);
      });
      let options = {
        title: "数据导出",
        from: {
          type: "data",
          dataList: dataList,
          columnList: this.columnList,
        },
        to: {},
      };
      this.tool.showDataMove(options);
    },
    async init() {
      this.ready = true;
      await this.toSearch();
    },
    async toSearch() {
      this.pageIndex = 1;
      await this.doSearch();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.doSearch();
    },
    handleCurrentChange(pageIndex) {
      this.pageIndex = pageIndex;
      this.doSearch();
    },
    fullColumnByData(data, parentName) {
      if (data == null) {
        return;
      }
      let keys = Object.keys(data);
      if (keys == null || keys.length == 0) {
        return;
      }
      keys.forEach((key) => {
        let value = data[key];
        this.appendColumnList(key, value, parentName);
      });
    },
    appendColumnList(name, value, parentName) {
      if (this.tool.isEmpty(name) || name == this.source_name) {
        return;
      }
      let key = name;
      if (this.tool.isNotEmpty(parentName)) {
        key = parentName + "." + name;
      }
      let isStruct = false;
      try {
        if (value != null && typeof value == "object" && !value.length) {
          this.fullColumnByData(value, key);
          isStruct = true;
        }
      } catch (error) {}
      let column = {
        name: key,
        checked: true,
        isStruct: isStruct,
      };
      if (!isStruct) {
        if (this.pointColumnNames.indexOf(key) < 0) {
          this.pointColumnNames.push(key);
          this.pointColumnList.push(column);
        }
      }
      if (this.tool.isEmpty(parentName) && this.columnNames.indexOf(key) < 0) {
        this.columnNames.push(key);
        this.columnList.push(column);
      }
    },
    inputValueChange() {},
    initInputWidth() {
      this.$nextTick(() => {
        if (this.initInputWidthIng) {
          return;
        }
        this.initInputWidthIng = true;
        let es = this.$el.getElementsByClassName("part-form-input");
        if (es) {
          Array.prototype.forEach.call(es, (one) => {
            this.tool.initInputWidth(one);
          });
        }
        this.initInputWidthIng = false;
      });
    },
    addOrder() {
      let order = {
        checked: true,
        name: null,
        ascDesc: "ASC",
      };
      let column = null;
      if (this.pointColumnList.length > 0) {
        this.pointColumnList.forEach((one) => {
          if (column != null) {
            return;
          }
          let find = false;
          this.searchForm.orderList.forEach((w) => {
            if (w.name == one.name) {
              find = true;
            }
          });
          if (find) {
            return;
          }
          column = one;
        });
      }
      if (column != null) {
        order.name = column.name;
      }

      this.searchForm.orderList.push(order);
      this.initInputWidth();
      return order;
    },
    removeOrder(order) {
      let orderList = this.searchForm.orderList;
      if (orderList.indexOf(order) >= 0) {
        orderList.splice(orderList.indexOf(order), 1);
      }
    },
    removeWhere(where) {
      let whereList = this.searchForm.whereList;
      if (whereList.indexOf(where) >= 0) {
        whereList.splice(whereList.indexOf(where), 1);
      }
    },
    whereNameChange(one) {
      this.initInputWidth();
      if (one.name == "_id") {
        one.dataType = "objectID";
      } else {
        one.dataType = "string";
      }
    },
    conditionalOperationChange(one) {
      this.initInputWidth();
      let nums = ["=", ">", ">=", "<", "<=", "between"];
      if (nums.indexOf(one.conditionalOperation) >= 0) {
        one.dataType = "number";
      }
      if (one.name == "_id") {
        one.dataType = "objectID";
      }
    },
    addWhere() {
      let where = {
        checked: true,
        name: null,
        value: null,
        before: null,
        after: null,
        conditionalOperation: "=",
        andOr: "AND",
        dataType: "string",
      };
      let column = null;
      if (this.pointColumnList.length > 0) {
        this.pointColumnList.forEach((one) => {
          if (column != null) {
            return;
          }
          let find = false;
          this.searchForm.whereList.forEach((w) => {
            if (w.name == one.name) {
              find = true;
            }
          });
          if (find) {
            return;
          }
          column = one;
        });
      }
      if (column != null) {
        where.name = column.name;
        if (where.name == "_id") {
          where.dataType = "objectID";
        }
      }

      this.searchForm.whereList.push(where);
      this.initInputWidth();
      return where;
    },
    async saveExtend() {
      let keyValueMap = {};
      keyValueMap.orderList = this.searchForm.orderList;
      keyValueMap.whereList = this.searchForm.whereList;
      keyValueMap.pageSize = this.pageSize;
      keyValueMap.pageIndex = this.pageIndex;
      await this.toolboxWorker.updateOpenTabExtend(this.tabId, keyValueMap);
    },
    toIndex() {},
    rowDblClick(row, column, event) {
      this.tool.showJSONData(row);
    },
    toDelete(data) {
      let msg = "确认删除数据";
      msg += "?";
      this.tool
        .confirm(msg)
        .then(async () => {
          this.doDelete(data);
        })
        .catch((e) => {});
    },
    async toInsert() {
      let data = {
        databaseName: this.databaseName,
        collectionName: this.collectionName,
      };
      this.toolboxWorker.showDataForm(data, this.columnList, async (m) => {
        let flag = await this.doInsert(m);
        return flag;
      });
    },
    async doInsert(data) {
      let param = this.toolboxWorker.getWorkParam({
        databaseName: data.databaseName,
        collectionName: data.collectionName,
        doc: data.doc,
      });
      let res = await this.server.mongodb.insert(param);
      if (res.code == 0) {
        this.tool.success("新增成功");
        this.doSearch();
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    async toCopy(data) {
      let param = {
        databaseName: this.databaseName,
        collectionName: this.collectionName,
        doc: data.value,
      };
      this.toolboxWorker.showDataForm(param, this.columnList, async (m) => {
        let flag = await this.doInsert(m);
        return flag;
      });
    },
    async toUpdate(data) {
      let param = {
        databaseName: this.databaseName,
        collectionName: this.collectionName,
        doc: data.value,
        id: data._id,
        idType: data._id_type,
      };
      this.toolboxWorker.showDataForm(param, this.columnList, async (m) => {
        let flag = await this.doUpdate(m);
        return flag;
      });
    },
    async doUpdate(data) {
      if (data.id == null) {
        this.tool.warn("_id信息丢失");
        return;
      }
      let param = this.toolboxWorker.getWorkParam({
        databaseName: data.databaseName,
        collectionName: data.collectionName,
        doc: data.doc,
        id: data.id,
        idType: data.idType,
      });
      let res = await this.server.mongodb.update(param);
      if (res.code == 0) {
        this.tool.success("修改成功");
        this.doSearch();
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    async doDelete(data) {
      if (data._id == null) {
        this.tool.warn("_id信息丢失");
        return;
      }
      let param = this.toolboxWorker.getWorkParam({
        databaseName: this.databaseName,
        collectionName: this.collectionName,
        id: data._id,
        idType: data._id_type,
      });
      let res = await this.server.mongodb.deleteById(param);
      if (res.code == 0) {
        this.tool.success("删除成功");
        this.doSearch();
        return true;
      } else {
        this.tool.error(res.msg);
        return false;
      }
    },
    formatSourceJSON(_source) {
      let sourceJSON = {};
      try {
        sourceJSON = JSONbigString.parse(_source);
      } catch (error) {}
      return sourceJSON;
    },
    getFilter() {
      let filter = {};

      this.searchForm.whereList.forEach((one) => {
        if (one.checked) {
          let v = one.value;
          if (one.dataType == "number") {
            let numV = Number(v);
            if (numV != null) {
              v = numV;
            }
          }
          filter[one.name] = v;
          switch (one.conditionalOperation) {
            case "like":
              filter[one.name] = {
                $regex: v,
              };
              break;
            case "like start":
              filter[one.name] = {
                $regex: "^" + v + "",
              };
              break;
            case "like end":
              filter[one.name] = {
                $regex: v + "$",
              };
              break;
            case "<>":
              filter[one.name] = {
                $ne: v,
              };
              break;
            case ">":
              filter[one.name] = {
                $gt: v,
              };
              break;
            case ">=":
              filter[one.name] = {
                $gte: v,
              };
              break;
            case "<":
              filter[one.name] = {
                $lt: v,
              };
              break;
            case "<=":
              filter[one.name] = {
                $lte: v,
              };
              break;
            case "between": {
              let b = one.before;
              let a = one.after;
              if (one.dataType == "number") {
                b = Number(b);
                a = Number(a);
              }
              filter[one.name] = {
                $gte: b,
                $lte: a,
              };
              break;
            }
            case "in": {
              let vs = [];
              if (this.tool.isNotEmpty(one.value)) {
                vs = one.value.split(",");

                if (one.dataType == "number") {
                  let list = [];
                  vs.forEach((v) => {
                    list.push(Number(v));
                  });
                  vs = list;
                }
              }
              filter[one.name] = {
                $in: vs,
              };
              break;
            }
          }
        }
      });
      return filter;
    },
    getSort() {
      let sort = [];

      this.searchForm.orderList.forEach((one) => {
        if (one.checked) {
          if (one.ascDesc == "ASC") {
            sort.push({
              key: one.name,
              value: 1,
            });
          } else {
            sort.push({
              key: one.name,
              value: -1,
            });
          }
        }
      });
      return sort;
    },
    async doSearch() {
      this.dataListLoading = true;
      try {
        this.saveExtend();
        let data = {};
        Object.assign(data, this.searchForm);

        data.filter = this.getFilter();
        data.sort = this.getSort();
        data.pageIndex = Number(this.pageIndex);
        data.pageSize = Number(this.pageSize);
        this.searchForm.whereList.forEach((one) => {
          if (one.checked && one.dataType == "objectID") {
            data.isObjectID = true;
            data.objectIDKey = one.name;
          }
        });
        let param = this.toolboxWorker.getWorkParam(data);

        let res = await this.server.mongodb.queryPage(param);
        if (res.code != 0) {
          this.tool.error(res.msg);
        } else {
          let result = res.data || {};
          let list = result.list || [];
          let dataList = [];
          list.forEach((one) => {
            one.data = this.formatSourceJSON(one.value);
            one.isObjectID =
              one._id_type &&
              (one._id_type == "ObjectID" ||
                one._id_type == "primitive.ObjectID");
            this.appendColumnList("_id", one._id);
            this.fullColumnByData(one.data);
            dataList.push(one);
            // console.log(this.tool.getStringValue(one._source["aa"]));
          });
          this.dataList = dataList;
          this.total = result.totalCount || 0;
        }
      } catch (error) {}
      this.dataListLoading = false;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-mongodb-collection-data {
  width: 100%;
  height: 100%;
}
</style>
