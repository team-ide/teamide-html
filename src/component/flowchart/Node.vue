<template>
  <div v-if="ready"></div>
</template>


<script>
export default {
  components: {},
  props: ["source"],
  data() {
    return {
      ready: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.ready = true;
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
