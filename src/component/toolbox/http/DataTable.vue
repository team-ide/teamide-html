<template>
  <el-table
    :data="dataList"
    :border="true"
    style="width: 100%"
    height="100%"
    size="mini"
  >
    <el-table-column label="" fixed width="70">
      <template slot-scope="scope">
        <el-checkbox v-model="scope.row.selected" />
      </template>
    </el-table-column>
    <el-table-column label="Key" width="200">
      <template slot-scope="scope">
        <el-input
          v-model="scope.row.key"
          @change="keyChange(dataList, scope.row)"
        />
      </template>
    </el-table-column>
    <el-table-column label="Value">
      <template slot-scope="scope">
        <div class="" v-if="!scope.row.isFile">
          <el-input v-model="scope.row.value" type="textarea" :rows="1" />
        </div>
        <div class="" v-if="scope.row.isFile" style="white-space: normal">
          <span
            v-for="(one, index) in scope.row.files"
            :key="index"
            class="mgl-10 mgr-10 ft-12"
          >
            <span>{{ one.name }}</span>
            <span @click="removeOne(scope.row.files, one)">
              <Icon
                class="mdi-close color-orange-8 mgl-10"
                style="vertical-align: 5px"
              >
              </Icon>
            </span>
          </span>
          <el-upload
            v-if="uploadReady[scope.row]"
            :action="source.api + 'upload'"
            :limit="5"
            multiple
            :data="{ place: 'other' }"
            :headers="{ JWT: tool.getJWT() }"
            name="file"
            :on-success="onFileUpload[scope.row]"
            :show-file-list="false"
            style="display: inline-block; margin-left: 10px"
          >
            <div class="tm-link color-green-8">点击上传</div>
          </el-upload>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="备注" width="200">
      <template slot-scope="scope">
        <el-input v-model="scope.row.comment" />
      </template>
    </el-table-column>
    <el-table-column label="是文件" width="100" v-if="isForm">
      <template slot-scope="scope">
        <el-checkbox
          v-model="scope.row.isFile"
          @change="initUpload(scope.row)"
        />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="120">
      <template slot-scope="scope">
        <div
          class="tm-link color-grey mglr-5"
          @click="upOne(dataList, scope.row)"
        >
          上移
        </div>
        <div
          class="tm-link color-grey mglr-5"
          @click="upOne(dataList, scope.row)"
        >
          下移
        </div>
        <div
          class="tm-link color-red mglr-5"
          @click="removeOne(dataList, scope.row)"
        >
          删除
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>


<script>
export default {
  components: {},
  props: ["source", "toolboxWorker", "dataList", "isForm"],
  data() {
    return {
      ready: false,
      uploadReady: {},
      onFileUpload: {},
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.initDataList(this.dataList);
      this.ready = true;
    },
    addOne(list, one) {
      list.push(one);
    },
    removeOne(list, one) {
      let index = list.indexOf(one);
      if (index >= 0) {
        list.splice(index, 1);
      }
    },
    upOne(list, one) {
      this.tool.upList(list, one);
    },
    downOne(list, one) {
      this.tool.downList(list, one);
    },
    initUpload(one) {
      one.files = one.files || [];
      if (!one.isFile) {
        this.uploadReady[one] = null;
        this.onFileUpload[one] = null;
        return;
      }
      this.uploadReady[one] = true;
      this.onFileUpload[one] = (response) => {
        this.uploadReady[one] = false;
        this.$nextTick(() => {
          this.uploadReady[one] = true;
        });
        if (response.code != 0) {
          this.tool.error(response.msg);
          return false;
        }
        response.data.files.forEach((f) => {
          one.files.push(f);
        });
      };
    },
    initDataList(dataList) {
      let hasEmptyKey = false;
      dataList.forEach((d) => {
        this.initUpload(d);
        if (this.tool.isEmpty(d.key)) {
          hasEmptyKey = true;
        }
      });
      if (!hasEmptyKey) {
        let data = {
          key: "",
          value: "",
          comment: "",
          selected: true,
        };
        if (this.isForm) {
          data.isFile = false;
        }
        this.initUpload(data);
        dataList.push(data);
      }
    },
    keyChange(dataList, one) {
      this.initDataList(dataList);
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
