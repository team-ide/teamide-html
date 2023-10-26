<template>
  <div class="toolbox-database-sql-data-list">
    <div style="height: 70px">
      <div class="sql-execute-one mgb-10 ft-12">
        <div>
          <span class="">{{ item.sql }}</span>
        </div>
        <template v-if="item.error">
          <div class="color-orange">
            执行异常
            <span class="color-orange pdlr-5">{{ item.error }}</span>
          </div>
        </template>
        <template v-else>
          <div>
            <span class="color-green pdr-5"> 执行成功 </span>
            <template v-if="item.rowsAffected == 0 || item.rowsAffected > 0">
              <span class="">
                受影响行数:
                <span class="color-green pdlr-5">
                  {{ item.rowsAffected }}
                </span>
              </span>
            </template>
            <template v-if="item.dataList != null">
              <span class="">
                查询行数:
                <span class="color-green pdlr-5">
                  {{ item.dataSize }}
                </span>
              </span>
              <span v-if="item.showDataMaxSize > 0">
                最大展示行数:
                <span class="color-green pdlr-5">
                  {{ item.showDataMaxSize }}
                </span>
              </span>
            </template>
            <span>
              耗时:
              <span class="pdlr-5">{{ item.useTime }}毫秒</span>
            </span>
          </div>
        </template>
      </div>
    </div>
    <div style="height: calc(100% - 70px)">
      <DataTable ref="DataTable" :source="source"></DataTable>
    </div>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "item"],
  data() {
    return {
      updates: [],
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {
      let options = {};
      options.showSize = 50;
      options.dataList = this.item.dataList;
      options.columnList = this.item.columnList;
      options.getRowMenus = this.getRowMenus;
      this.$nextTick(() => {
        this.$refs.DataTable.build(options);
      });
    },
    getRowMenus(row, column, event) {
      let menus = [];

      if (column) {
        menus.push({
          text: "查看列数据",
          onClick: () => {
            this.tool.showJSONData(row[column.name]);
          },
        });
      }
      menus.push({
        text: "查看行数据",
        onClick: () => {
          this.tool.showJSONData(row);
        },
      });

      if (this.item && this.item.columnList) {
        let ownerName = "ownerName";
        let dataList = [Object.assign({}, row)];
        let tableDetail = {
          tableName: "tableName",
          columnList: [],
        };
        this.item.columnList.forEach((one) => {
          tableDetail.columnList.push({
            columnName: one.name,
          });
        });
        menus.push({
          text: "查看SQL",
          onClick: () => {
            this.toolboxWorker.showTableDataListSql(
              ownerName,
              tableDetail,
              dataList
            );
          },
        });
      }

      return menus;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
.toolbox-database-sql-data-list {
  width: 100%;
  height: 100%;
}
</style>
