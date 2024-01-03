<template>
  <div style="height: 100%">
    <Editor ref="Editor" :source="source" :value="text" language="js"></Editor>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["source"],
  data() {
    return {
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
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  updated() {},
  mounted() {},
};
</script>

<style>
</style>
