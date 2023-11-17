<template>
  <el-dialog
    ref="modal"
    title="Sql Profile"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    :destroy-on-close="true"
    class="app-dialog"
    :fullscreen="true"
  >
    <div class="pd-10 toolbox-editor" style="height: 100%">
      <div
        class="toolbox-database-sql-profile"
        style="height: 100%"
        v-if="data != null"
      >
        <div style="height: 80px">
          <div class="sql-execute-one mgb-10 ft-12">
            <div class="mgb-10">
              <span class="color-green">{{ data.profiling.Query }}</span>
            </div>
            <template v-if="data.error">
              <div class="color-orange">
                执行异常
                <span class="color-orange pdlr-5">{{ data.error }}</span>
              </div>
            </template>
            <template v-else>
              <div>
                <span class="color-green pdr-5"> 执行成功 </span>
                <template
                  v-if="data.rowsAffected == 0 || data.rowsAffected > 0"
                >
                  <span class="">
                    受影响行数:
                    <span class="color-green pdlr-5">
                      {{ data.rowsAffected }}
                    </span>
                  </span>
                </template>
                <template v-if="data.dataList != null">
                  <span class="">
                    查询行数:
                    <span class="color-green pdlr-5">
                      {{ data.dataSize }}
                    </span>
                  </span>
                  <span v-if="data.showDataMaxSize > 0">
                    最大展示行数:
                    <span class="color-green pdlr-5">
                      {{ data.showDataMaxSize }}
                    </span>
                  </span>
                </template>
                <span>
                  耗时:
                  <span class="pdlr-5">{{ data.useTime }}毫秒</span>
                </span>
              </div>
            </template>
          </div>
        </div>
        <div style="height: calc(100% - 80px)">
          <DataTable
            ref="DataTable"
            :source="source"
            :openDateFormat="openDateFormat"
          ></DataTable>
        </div>
      </div>
    </div>
  </el-dialog>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "openDateFormat"],
  data() {
    return {
      showDialog: false,
      data: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {},
    show(data) {
      this.showDialog = true;
      this.data = data;
      let options = {};
      options.showSize = 50;
      options.dataList = this.data.profiling.profileDataList;
      options.columnList = this.data.profiling.columnList;

      let dataList = options.dataList;
      let columnList = options.columnList;
      options.getRowMenus = (arg1, arg2, arg3) => {
        let menus = this.toolboxWorker.getRowMenus(arg1, arg2, arg3);
        if (dataList.length > 0) {
          menus.push({
            text: "数据导出",
            onClick: () => {
              this.toolboxWorker.showDataListExport({
                dataList: dataList,
                columnList: columnList,
              });
            },
          });
        }
        return menus;
      };
      this.$nextTick(() => {
        this.$refs.DataTable.build(options);
      });
    },
    hide() {
      this.showDialog = false;
    },
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>
