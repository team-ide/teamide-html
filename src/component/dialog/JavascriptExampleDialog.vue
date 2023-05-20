<template>
  <el-dialog
    ref="modal"
    :title="title || '示例代码'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="true"
    :append-to-body="true"
    :visible="showDialog"
    :before-close="hide"
    width="1200px"
    top="40px"
  >
    <div class="mgt--20">
      <div style="height: 720px !important">
        <Editor
          ref="Editor"
          :source="source"
          :value="text"
          language="js"
        ></Editor>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: ["source"],
  data() {
    return {
      showDialog: false,
      text: `
let config = {
	address:"127.0.0.1:6379",
	auth:"",
};
start = util.GetNowMilli()
let redisService = redis.newService(config);
end = util.GetNowMilli()
logger.info("new redisService use:",(end-start))

let key = "xx";

start = util.GetNowMilli()
res = redisService.get(key)
end = util.GetNowMilli()
logger.info("redis get", logger.any("key",key), logger.any("value",res), logger.any("use",(end-start)))


start = util.GetNowMilli()
redisService.set(key,"这是一个UUID:" + util.getUUID())
end = util.GetNowMilli()
logger.info("redis set", logger.any("key",key), logger.any("use",(end-start)))

start = util.GetNowMilli()
res = redisService.get(key)
end = util.GetNowMilli()
logger.info("redis get", logger.any("key",key), logger.any("value",res), logger.any("use",(end-start)))

config = {
	address:"127.0.0.1:2181",
};
start = util.GetNowMilli()
let zookeeperService = zookeeper.newService(config);
end = util.GetNowMilli()
logger.info("new zookeeperService", logger.any("use",(end-start)))


let path = "/xx";

start = util.GetNowMilli()
exists = zookeeperService.exists(path)
end = util.GetNowMilli()
logger.info("zookeeper exists", logger.any("path",path), logger.any("exists",exists), logger.any("use",(end-start)))

if(!exists){
	start = util.GetNowMilli()
	zookeeperService.create(path, "这是一个UUID:" + util.getUUID())
	end = util.GetNowMilli()
	logger.info("zookeeper create", logger.any("path",path), logger.any("use",(end-start)))
}

start = util.GetNowMilli()
res = zookeeperService.get(path)
end = util.GetNowMilli()
logger.info("zookeeper get", logger.any("path",path), logger.any("value", res), logger.any("use",(end-start)))

wait = util.newWaitGroup()
wait.Add(1)
let watchChildrenCount = 0
start = util.GetNowMilli()
zookeeperService.watchChildren(path, function(event){
	watchChildrenCount++
	logger.info("zookeeper watchChildren", logger.any("path",path), logger.any("event", util.objToJson(event)))
	if(watchChildrenCount >= 2){
		wait.Done();
	}
	return false;
})
end = util.GetNowMilli()
logger.info("zookeeper watchChildren start", logger.any("path",path), logger.any("use",(end-start)))
wait.Wait()
end = util.GetNowMilli()
logger.info("zookeeper watchChildren end", logger.any("path",path), logger.any("use",(end-start)))
      
`,
      title: null,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {},
  methods: {
    async show() {
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {},
};
</script>

<style>
</style>
