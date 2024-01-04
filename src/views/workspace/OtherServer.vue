<template>
  <el-dialog
    ref="modal"
    title="其它服务"
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
      <tm-layout height="100%">
        <tm-layout height="110px">
          <el-form
            class="pdt-10 pdlr-10"
            size="mini"
            :inline="true"
            @submit.native.prevent
          >
            <el-form-item label="">
              <div class="">
                <div
                  class="tm-btn tm-btn-sm bg-grey ft-13"
                  @click="load()"
                  :class="{ 'tm-disabled': dataListLoading }"
                >
                  刷新
                </div>
                <div
                  class="tm-btn tm-btn-sm bg-green ft-13"
                  @click="toInsert()"
                >
                  新增
                </div>
              </div>
            </el-form-item>
          </el-form>
        </tm-layout>
        <tm-layout height="auto" class="">
          <div style="height: 100%">
            <el-table
              :data="source.otherServers"
              :border="true"
              height="100%"
              style="width: 100%"
              size="mini"
              v-loading="dataListLoading"
            >
              <el-table-column label="名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" label="地址">
                <template slot-scope="scope">
                  {{ scope.row.extend && scope.row.extend.url }}
                </template>
              </el-table-column>
              <el-table-column width="140" label="创建时间">
                <template slot-scope="scope">
                  {{
                    tool.formatDate(
                      new Date(scope.row.createTime),
                      "yyyy-MM-dd hh:mm:ss"
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column width="140" label="更新时间">
                <template slot-scope="scope">
                  {{
                    tool.formatDate(
                      new Date(scope.row.updateTime || scope.row.createTime),
                      "yyyy-MM-dd hh:mm:ss"
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column width="150" label="操作" fixed="right">
                <template slot-scope="scope">
                  <div
                    class="tm-btn color-green tm-btn-xs"
                    @click="toOpen(scope.row)"
                  >
                    打开
                  </div>
                  <div
                    class="tm-btn color-blue tm-btn-xs"
                    @click="toUpdate(scope.row)"
                  >
                    修改
                  </div>
                  <div
                    class="tm-btn color-orange tm-btn-xs"
                    @click="toDelete(scope.row)"
                  >
                    删除
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </tm-layout>
      </tm-layout>
    </div>
    <FormDialog
      ref="OtherServerForm"
      :source="source"
      title="其它服务"
      :onSave="doSave"
    ></FormDialog>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: ["source"],
  data() {
    return {
      showDialog: false,
      dataListLoading: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.load();
    },
    hide() {
      this.showDialog = false;
    },
    async showOtherServers() {
      this.showDialog = true;
      this.$nextTick(() => {
        this.load();
      });
    },
    getForm() {
      let form = {
        fields: [
          {
            label: "名称",
            name: "name",
            rules: [
              {
                required: true,
                message: `名称不能为空!`,
              },
            ],
          },
          {
            label: "地址",
            name: "url",
            rules: [
              {
                required: true,
                message: `地址不能为空!`,
              },
            ],
          },
        ],
      };
      return form;
    },
    async toInsert() {
      let data = {};
      this.$refs.OtherServerForm.show({
        title: `新增其它服务`,
        form: [this.getForm()],
        data: [data],
      });
    },
    async toUpdate(row) {
      let data = {};
      data.name = row.name;
      data.url = row.extend.url;
      this.$refs.OtherServerForm.show({
        title: `修改${data.name}服务`,
        form: [this.getForm()],
        data: [data],
        extendId: row.extendId,
      });
    },
    async doSave(dataList, config) {
      let url = dataList[0].url;
      try {
        new URL(url);
      } catch (error) {
        this.tool.error("请填写正确地址");
        return false;
      }
      let param = {
        extendId: config.extendId,
        extendType: "otherServer",
        name: dataList[0].name,
        extend: {
          url: url,
        },
      };
      let res = await this.server.toolbox.extend.save(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.load();
      }
      return true;
    },
    async toDelete(data) {
      let msg = "确认删除";
      msg += "服务[" + data.name + "]";
      msg += "?";
      this.tool
        .confirm(msg)
        .then(async () => {
          let res = await this.server.toolbox.extend.delete({
            extendId: data.extendId,
          });
          if (res.code != 0) {
            this.tool.error(res.msg);
          } else {
            this.load();
          }
        })
        .catch((e) => {});
    },
    async toOpen(row) {
      let options = {};
      options.title = "Team · IDE （" + row.name + "）";
      options.url = row.extend.url;
      this.tool.newWindow(options);
    },
    async load() {
      this.dataListLoading = true;
      let param = {
        extendType: "otherServer",
      };
      let res = await this.server.toolbox.extend.query(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let dataList = res.data || [];
      this.source.otherServers = dataList;
      this.dataListLoading = false;
    },
  },
  created() {},
  updated() {
    this.tool.openOtherServer = this.toOpen;
    this.tool.showOtherServers = this.showOtherServers;
  },
  mounted() {
    this.tool.openOtherServer = this.toOpen;
    this.tool.showOtherServers = this.showOtherServers;

    this.init();
  },
};
</script>

<style>
</style>
