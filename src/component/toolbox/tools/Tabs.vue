<template>
  <div class="toolbox-kafka-tabs">
    <div class="default-tabs-container">
      <WorkspaceTabs :source="source" :itemsWorker="toolboxWorker.itemsWorker">
      </WorkspaceTabs>
    </div>
    <div class="default-spans-container">
      <WorkspaceSpans :source="source" :itemsWorker="toolboxWorker.itemsWorker">
        <template v-slot:span="{ item }">
          <template v-if="item.extend == null"> </template>
          <template v-else-if="item.extend.type == 'timestamp'">
            <Timestamp
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </Timestamp>
          </template>
          <template v-else-if="item.extend.type == 'crontab'">
            <Crontab
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </Crontab>
          </template>
          <template v-else-if="item.extend.type == 'json'">
            <Json
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </Json>
          </template>
          <template v-else-if="item.extend.type == 'yaml'">
            <Yaml
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </Yaml>
          </template>
          <template v-else-if="item.extend.type == 'urlEncode'">
            <UrlEncode
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </UrlEncode>
          </template>
          <template v-else-if="item.extend.type == 'base64'">
            <Base64
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </Base64>
          </template>
          <template v-else-if="item.extend.type == 'md5'">
            <Md5
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </Md5>
          </template>
          <template v-else-if="item.extend.type == 'filehash'">
            <Filehash
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </Filehash>
          </template>
          <template v-else-if="item.extend.type == 'randomNumber'">
            <RandomNumber
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </RandomNumber>
          </template>
          <template v-else-if="item.extend.type == 'randomString'">
            <RandomString
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </RandomString>
          </template>
          <template v-else-if="item.extend.type == 'generatePassword'">
            <GeneratePassword
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
            >
            </GeneratePassword>
          </template>
        </template>
      </WorkspaceSpans>
    </div>
  </div>
</template>


<script>
import Timestamp from "./Timestamp";
import Crontab from "./Crontab";
import Json from "./Json";
import Yaml from "./Yaml";
import UrlEncode from "./UrlEncode";
import Base64 from "./Base64";
import Filehash from "./Filehash";
import RandomNumber from "./RandomNumber";
import RandomString from "./RandomString";
import GeneratePassword from "./GeneratePassword";

export default {
  components: {
    Timestamp,
    Crontab,
    Json,
    Yaml,
    UrlEncode,
    Base64,
    Filehash,
    RandomNumber,
    RandomString,
    GeneratePassword,
  },
  props: ["source", "toolboxWorker"],
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
.toolbox-kafka-tabs {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
