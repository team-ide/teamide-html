<template>
  <div>
    <el-form-item label="数据库方言" v-if="shouldDialectType">
      <el-select
        placeholder="默认方言"
        v-model="config.dialectType"
        style="width: 120px"
      >
        <el-option value="" label="默认方言"> </el-option>
        <template v-for="(one, index) in source.databaseTypes">
          <el-option
            :key="index"
            :label="one.dialectName"
            :value="one.dialectName"
          >
          </el-option>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label="追加库名">
      <el-switch v-model="config.appendOwnerName" @change="change"> </el-switch>
    </el-form-item>
    <template v-if="config.appendOwnerCreateSql || config.appendOwnerName">
      <el-form-item label="库名包装">
        <el-select
          placeholder="默认"
          v-model="config.ownerNamePackChar"
          @change="change"
          style="width: 90px"
        >
          <el-option
            v-for="(one, index) in source.namePackChars"
            :key="index"
            :value="one.value"
            :label="one.text"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </template>
    <el-form-item label="表名包装">
      <el-select
        placeholder="默认"
        v-model="config.tableNamePackChar"
        @change="change"
        style="width: 90px"
      >
        <el-option
          v-for="(one, index) in source.namePackChars"
          :key="index"
          :value="one.value"
          :label="one.text"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="字段包装">
      <el-select
        placeholder="默认"
        v-model="config.columnNamePackChar"
        @change="change"
        style="width: 90px"
      >
        <el-option
          v-for="(one, index) in source.namePackChars"
          :key="index"
          :value="one.value"
          :label="one.text"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="字符值包装">
      <el-select
        v-model="config.sqlValuePackChar"
        @change="change"
        style="width: 90px"
      >
        <el-option
          v-for="(one, index) in source.sqlValuePackChars"
          :key="index"
          :value="one.value"
          :label="one.text"
        >
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>


<script>
export default {
  components: {},
  props: ["source", "config", "change", "shouldDialectType"],
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    init() {},
  },
  created() {},
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>
