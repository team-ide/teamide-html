<template>
  <el-dialog
    ref="modal"
    title="数据导出"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    width="96%"
    top="30px"
  >
    <div class="toolbox-editor mgt--20 pd-10">
      <Export
        v-if="ready"
        :source="source"
        :toolboxWorker="toolboxWorker"
        :ownerName="ownerName"
        :tableName="tableName"
        :dataList="dataList"
        :columnList="columnList"
        :isDataListExport="true"
        :actived="true"
      >
      </Export>
    </div>
  </el-dialog>
</template>


<script>
import Export from "./Export";

export default {
  components: { Export },
  props: ["source", "toolboxWorker"],
  data() {
    return {
      showDialog: false,
      ownerName: null,
      tableName: null,
      ready: false,
      dataList: null,
      columnList: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    init() {},
    show(options) {
      this.showDialog = true;
      this.ready = false;
      this.ownerName = options.ownerName;
      this.tableName = options.tableName;
      this.dataList = options.dataList || [];
      let columnList = options.columnList || [];
      if (columnList.length == 0) {
        let columnCache = {};
        this.dataList.forEach((one) => {
          for (let name in one) {
            if (columnCache[name]) {
              continue;
            }
            columnCache[name] = true;
            columnList.push({
              columnName: name,
            });
          }
        });
      }
      columnList.forEach((one) => {
        if (this.tool.isEmpty(one.columnName)) {
          one.columnName = one.name;
        }
      });
      this.columnList = columnList;

      this.$nextTick(() => {
        this.ready = true;
      });
    },
    hide() {
      this.ready = false;
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
