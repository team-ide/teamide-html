<template>
  <span class="color-orange ft-12">
    值表达式说明：字符串使用`'这是字符串'`； 可以使用 `xx` 来使用参数 如：
    `index`、`'xx-' + index`：可以取到当前执行索引，从0开始；
    `util.nextId()`、`'xx-' +util.nextId()`：获取雪花片算法的ID；
    <a
      class="tm-link color-grey tm-pointer mgl-10"
      @click="tool.showJavascriptFunc()"
    >
      点击查看内置函数
    </a>
  </span>
</template>

<script>
export default {
  props: ["source"],
  components: {},
  data() {
    return {};
  },
  watch: {},
  methods: {},
  mounted() {},
  beforeDestroy() {},
  beforeCreate() {},
};
</script>

<style >
</style>
