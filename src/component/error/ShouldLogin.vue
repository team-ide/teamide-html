<template>
  <div class="text-center ft-25 ft-600 pdt-50 color-orange">
    该功能需要登录才能使用，请先
    <div class="tm-link color-green mgt--1" @click="tool.toLogin()">
      立即登录
    </div>
    ！
  </div>
</template>

<script>
export default {
  components: {},
  props: ["source"],
  data() {
    return {};
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {},
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {},
};
</script>

<style>
</style>
