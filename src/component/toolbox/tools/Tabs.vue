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
              :tabId="item.tabId"
            >
            </Timestamp>
          </template>
          <template v-else-if="item.extend.type == 'crontab'">
            <Crontab
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
            >
            </Crontab>
          </template>
          <template v-else-if="item.extend.type == 'json'">
            <Json
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
              defaultFormat="json"
            >
            </Json>
          </template>
          <template v-else-if="item.extend.type == 'yaml'">
            <Json
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
              defaultFormat="yaml"
            >
            </Json>
          </template>
          <template v-else-if="item.extend.type == 'urlEncode'">
            <UrlEncode
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
            >
            </UrlEncode>
          </template>
          <template v-else-if="item.extend.type == 'base64'">
            <Base64
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
            >
            </Base64>
          </template>
          <template v-else-if="item.extend.type == 'md5'">
            <Md5
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
            >
            </Md5>
          </template>
          <template v-else-if="item.extend.type == 'fileSearch'">
            <FileSearch
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
            >
            </FileSearch>
          </template>
          <template v-else-if="item.extend.type == 'randomString'">
            <RandomString
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
            >
            </RandomString>
          </template>
          <template v-else-if="item.extend.type == 'javascript'">
            <Javascript
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
            >
            </Javascript>
          </template>
          <template v-else-if="item.extend.type == 'QRCode'">
            <QRCode
              :source="source"
              :toolboxWorker="toolboxWorker"
              :extend="item.extend"
              :tabId="item.tabId"
            >
            </QRCode>
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
import UrlEncode from "./UrlEncode";
import Base64 from "./Base64";
import Md5 from "./Md5";
import RandomString from "./RandomString";
import Javascript from "./Javascript";
import QRCode from "./QRCode";
import FileSearch from "./FileSearch";

export default {
  components: {
    Timestamp,
    Crontab,
    Json,
    UrlEncode,
    Base64,
    Md5,
    RandomString,
    Javascript,
    QRCode,
    FileSearch,
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
