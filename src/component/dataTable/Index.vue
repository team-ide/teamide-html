<template>
  <div style="height: 100%">
    <el-table
      :data="showDataList"
      :border="true"
      height="100%"
      style="width: 100%"
      size="mini"
      @row-contextmenu="rowContextmenu"
      @header-contextmenu="headerContextmenu"
    >
      <el-table-column width="70" label="序号" fixed>
        <template slot-scope="scope">
          <template v-if="selects != null">
            <input
              type="checkbox"
              class="mglr-5"
              style="width: auto"
              :checked="selects.indexOf(scope.row) >= 0"
              @change="checkboxChange(scope.row)"
            />
          </template>
          <span>{{ scope.$index + 1 }}</span>
          <template v-if="updates != null && updates.indexOf(scope.row) >= 0">
            <i
              class="mgl-5 mdi mdi-database-edit-outline"
              style="vertical-align: 0px"
            ></i>
          </template>
          <template v-if="inserts != null && inserts.indexOf(scope.row) >= 0">
            <i
              class="mgl-5 mdi mdi-database-plus-outline"
              style="vertical-align: 0px"
            ></i>
          </template>
        </template>
      </el-table-column>
      <template v-for="(column, index) in columnList">
        <template v-if="column.checked">
          <el-table-column
            :key="index"
            :prop="column.name"
            :label="column.name"
          >
            <template slot-scope="scope">
              <div class="">
                <template v-if="typeIsDate(column)">
                  <el-date-picker
                    v-model="scope.row[column.name]"
                    type="date"
                    placeholder="选择日期"
                    value-format="timestamp"
                    @change="inputValueChange(scope.row, column, $event)"
                  >
                  </el-date-picker>
                </template>
                <template v-else-if="typeIsDateTime(column)">
                  <el-date-picker
                    v-model="scope.row[column.name]"
                    type="datetime"
                    placeholder="选择时间"
                    value-format="timestamp"
                    @change="inputValueChange(scope.row, column, $event)"
                  >
                  </el-date-picker>
                </template>
                <template v-else-if="valueIsDate(scope.row[column.name])">
                  <el-date-picker
                    v-model="scope.row[column.name]"
                    type="date"
                    placeholder="选择日期"
                    value-format="timestamp"
                    @change="inputValueChange(scope.row, column, $event)"
                  >
                  </el-date-picker>
                </template>
                <template v-else-if="valueIsDateTime(scope.row[column.name])">
                  <el-date-picker
                    v-model="scope.row[column.name]"
                    type="datetime"
                    placeholder="选择时间"
                    value-format="timestamp"
                    :name="column.name"
                    @change="inputValueChange(scope.row, column, $event)"
                  >
                  </el-date-picker>
                </template>
                <template v-else>
                  <input
                    v-model="scope.row[column.name]"
                    :name="column.name"
                    @change="inputValueChange(scope.row, column, $event)"
                    @input="inputValueChange(scope.row, column, $event)"
                    :placeholder="scope.row[column.name] == null ? 'NULL' : ''"
                    type="text"
                  />
                </template>
              </div>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "selects", "inserts", "updates", "deletes"],
  data() {
    return {
      columnList: [],
      showSize: 0,
      showDataList: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    build(options) {
      options = options || {};
      this.options = options;
      let columnList = options.columnList || [];
      this.dataList = options.dataList || [];
      this.showSize = options.showSize || 0;
      this.columnList.splice(0, this.columnList.length);
      // console.log(this.columnList);
      columnList.forEach((one) => {
        let column = Object.assign({}, one);
        column.checked = true;
        this.columnList.push(column);
      });

      this.refreshData();

      this.$nextTick(() => {
        this.unbind();
        this.bind();
      });
    },
    typeIsDate(column) {
      let columnType = column.columnDataType || column.type;
      if (
        this.source.isTableDataDateFormat() &&
        this.tool.isNotEmpty(columnType) &&
        columnType.toLowerCase() == "date"
      ) {
        return true;
      }
      return false;
    },
    typeIsDateTime(column) {
      let columnType = column.columnDataType || column.type;
      if (
        this.source.isTableDataDateFormat() &&
        this.tool.isNotEmpty(columnType) &&
        (columnType.toLowerCase() == "datetime" ||
          columnType.toLowerCase() == "timestamp")
      ) {
        return true;
      }
      return false;
    },

    valueIsDate(value) {
      return false;
    },
    valueIsDateTime(value) {
      if (this.tool.isEmpty(value)) {
        return false;
      }
      if (
        this.source.isTableDataTimestampDateFormat() &&
        ("" + value).length == 13
      ) {
        try {
          if (new Date(Number(value)).getTime() > 0) {
            return true;
          }
        } catch (error) {
          console.log(error);
        }
      }
      return false;
    },
    refreshData() {
      this.showDataList.splice(0, this.showDataList.length);
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.showSize <= 0 || i < this.showSize) {
          this.showDataList.push(this.dataList[i]);
        } else {
          break;
        }
      }
    },
    bind() {
      this.selectWrap = this.$el.querySelector(".el-table__body-wrapper");
      this.selectWrap.addEventListener("scroll", this.onBodyScroll);
    },
    unbind() {
      let selectWrap = this.$el.querySelector(".el-table__body-wrapper");
      if (selectWrap) {
        selectWrap.removeEventListener("scroll", this.onBodyScroll);
      }
    },
    onBodyScroll() {
      const scrollDistance =
        this.selectWrap.scrollHeight -
        this.selectWrap.scrollTop -
        this.selectWrap.clientHeight;
      // 判断是否到底,scrollTop为已滚动到元素上边界的像素数，scrollHeight为元素完整的高度，clientHeight为内容的可见宽度
      if (scrollDistance <= 10) {
        this.loadmore();
      }
    },
    checkboxChange(data) {
      if (this.options.checkboxChange) {
        this.options.checkboxChange(data);
      }
    },
    findColumnByName(name) {
      let findColumn = null;
      this.columnList.forEach((one) => {
        if (one.name == name) {
          findColumn = one;
        }
      });
      return findColumn;
    },
    headerContextmenu(column, event) {
      let menus = [];
      let findColumn = this.findColumnByName(column.property);
      if (findColumn) {
        if (findColumn.checked) {
          menus.push({
            text: "隐藏列",
            onClick: () => {
              findColumn.checked = false;
            },
          });
        }
      }
      menus.push({
        text: "隐藏所有列",
        onClick: () => {
          this.columnList.forEach((one) => {
            one.checked = false;
          });
        },
      });
      menus.push({
        text: "显示所有列",
        onClick: () => {
          this.columnList.forEach((one) => {
            one.checked = true;
          });
        },
      });
      let hColMenu = {
        text: "已隐藏列",
        menus: [],
        disabled: true,
      };
      menus.push(hColMenu);
      let sColMenu = {
        text: "已显示列",
        menus: [],
        disabled: true,
      };
      menus.push(sColMenu);
      this.columnList.forEach((one) => {
        if (one.checked) {
          sColMenu.disabled = false;
          sColMenu.menus.push({
            text: "隐藏[" + one.name + "]",
            onClick: () => {
              one.checked = false;
            },
          });
        } else {
          hColMenu.disabled = false;
          hColMenu.menus.push({
            text: "显示[" + one.name + "]",
            onClick: () => {
              one.checked = true;
            },
          });
        }
      });
      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    rowContextmenu(row, column, event) {
      let menus = [];
      let findColumn = this.findColumnByName(column.property);
      if (this.options.getRowMenus) {
        menus = this.options.getRowMenus(row, findColumn, event);
      }
      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    inputValueChange(data, column, event) {
      if (this.options.inputValueChange) {
        this.options.inputValueChange(data, column, event);
      }
    },
    loadmore() {
      if (this.showSize <= 0) {
        return;
      }
      if (this.loadmore_ing) {
        return;
      }

      this.loadmore_ing = true;
      let allDataList = this.dataList || [];
      let showDataList = this.showDataList || [];
      if (allDataList.length <= showDataList.length) {
        return;
      }

      let start = showDataList.length;
      for (let i = start; i < allDataList.length; i++) {
        if (i - start < this.showSize) {
          showDataList.push(allDataList[i]);
        } else {
          break;
        }
      }
      this.loadmore_ing = false;
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.unbind();
  },
};
</script>

<style>
.toolbox-editor .el-table .el-date-editor input {
  padding: 0px 30px;
}
.toolbox-editor .el-table .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
