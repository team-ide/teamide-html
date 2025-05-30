<template>
  <div
    class="workspace-tabs"
    :class="{ 'workspace-tabs-no-tab': mainTabs.length == 0 }"
  >
    <div class="workspace-tabs-left">
      <slot name="leftExtend"></slot>
      <el-dropdown
        v-if="leftTabs.length != 0"
        trigger="click"
        @command="handleCommand"
        class="workspace-tabs-nav-dropdown"
      >
        <div class="workspace-tabs-nav tm-pointer">
          <i class="mdi mdi-menu-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <template v-for="(one, index) in leftTabs">
            <el-dropdown-item :key="index" :command="one">
              {{ one.name || one.title }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <draggable
      class="workspace-tabs-body"
      ref="workspaceTabsBody"
      v-bind="dragOptions"
      tag="div"
      v-model="mainTabs"
      @start="isDragging = true"
      @end="moveEnd"
      draggable=".workspace-tabs-one"
    >
      <template v-for="(one, index) in mainTabs">
        <div
          :key="index"
          class="workspace-tabs-one"
          :title="one.title"
          :class="{ active: one == itemsWorker.activeItem }"
          @contextmenu.prevent="tabContextmenu(one)"
          @mouseup="tabMouseup(one)"
        >
          <span class="workspace-tabs-one-text" @click="toSelectTab(one)">
            <template v-if="tool.isNotEmpty(one.iconFont)">
              <IconFont class="mgr-5" :class="one.iconFont"> </IconFont>
            </template>
            <template v-if="tool.isNotEmpty(one.icon)">
              <Icon class="mgr-5" :class="one.icon"> </Icon>
            </template>
            {{ one.name || one.title }}
          </span>
          <span
            class="workspace-tabs-delete-btn tm-pointer color-orange"
            @click="toDeleteTab(one)"
            title="关闭"
          >
            <Icon class="mdi-close"></Icon>
          </span>
        </div>
      </template>
    </draggable>
    <div class="workspace-tabs-right">
      <el-dropdown
        v-if="rightTabs.length > 0"
        trigger="click"
        @command="handleCommand"
        placement="bottom-start"
        class="workspace-tabs-nav-dropdown"
      >
        <div class="workspace-tabs-nav tm-pointer">
          <i class="mdi mdi-menu-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <template v-for="(one, index) in rightTabs">
            <el-dropdown-item :key="index" :command="one">
              {{ one.name || one.title }}
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
      <slot name="rightExtend"></slot>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: { draggable },
  props: ["source", "itemsWorker", "onSequenceChange", "formatContextmenu"],
  data() {
    return {
      mainTabs: [],
      leftTabs: [],
      rightTabs: [],
      tabsWidth: 0,
      tabHeaderWidthCount: 0,
      tabEditorHeaderWidth: 0,
      isDragging: false,
      delayedDragging: false,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算

  computed: {
    dragOptions() {
      return {
        disabled: this.onSequenceChange == null,
      };
    },
  },
  // 计算属性 数据变，直接会触发相应的操作
  watch: {
    isDragging(newValue) {
      if (newValue) {
        this.delayedDragging = true;
        return;
      }
      this.$nextTick(() => {
        this.delayedDragging = false;
      });
    },
    "itemsWorker.items"() {
      this.$nextTick(() => {
        this.initTabs();
      });
    },
    "itemsWorker.activeItem"() {
      this.$nextTick(() => {
        this.initTabs();
      });
    },
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.initTabs();
      });
    },
    moveEnd(arg) {
      this.isDragging = false;
      let thisObj = this.mainTabs[arg.newIndex];
      if (arg.newIndex == arg.oldIndex || !thisObj) {
        return;
      }
      let nowSequence = thisObj.sequence;
      let sequence = 0;
      let beforeObj = null;
      let afterObj = null;
      if (arg.newIndex == 0) {
        afterObj = this.mainTabs[arg.newIndex + 1];
        if (afterObj) {
          sequence = afterObj.sequence - 1;
        }
      } else if (arg.newIndex > 0) {
        beforeObj = this.mainTabs[arg.newIndex - 1];
        if (beforeObj) {
          sequence = beforeObj.sequence + 1;
          if (sequence == nowSequence) {
            if (this.mainTabs[arg.newIndex + 1]) {
              sequence = this.mainTabs[arg.newIndex + 1].sequence - 1;
            }
          }
        }
      }
      if (this.onSequenceChange && (beforeObj || afterObj)) {
        let idx = this.itemsWorker.items.indexOf(thisObj);
        if (idx >= 0) {
          this.itemsWorker.items.splice(idx, 1);
        }
        if (beforeObj) {
          idx = this.itemsWorker.items.indexOf(beforeObj);
          if (idx >= 0) {
            this.itemsWorker.items.splice(idx + 1, 0, thisObj);
          }
        } else if (afterObj) {
          idx = this.itemsWorker.items.indexOf(afterObj);
          if (idx >= 0) {
            this.itemsWorker.items.splice(idx, 0, thisObj);
          }
        }
        this.onSequenceChange(thisObj, sequence);
      }
    },
    initTabs() {
      let leftTabs = [];
      let rightTabs = [];
      let mainTabs = [];

      this.itemsWorker.showCount = 0;
      this.itemsWorker.items.forEach((one) => {
        if (!one.show) {
          return;
        }
        this.itemsWorker.showCount++;
        mainTabs.push(one);
      });
      this.mainTabs = mainTabs;

      this.$nextTick(() => {
        let tabsWidth = this.tool.jQuery(this.$el).width();
        let workspaceTabsBody = this.tool.jQuery(
          this.$refs.workspaceTabsBody.$el || this.$refs.workspaceTabsBody
        );
        let tabsBodyWidth = workspaceTabsBody.width();
        let tabWidthCount = 0;
        let children = workspaceTabsBody.children();
        this.mainTabs.forEach((one, index) => {
          let tabWidth = this.tool.jQuery(children[index]).width();
          one._tabWidth = tabWidth;
          tabWidthCount += Number(tabWidth);
        });
        let scrollLeft = 0;
        let activeIndex = this.getActiveIndex();
        let showWidth = 0;
        if (tabsBodyWidth < tabWidthCount) {
          let showIndex = 0;
          this.mainTabs.forEach((one) => {
            if (showIndex < activeIndex - 2) {
              scrollLeft += Number(one._tabWidth);
              leftTabs.push(one);
            } else {
              showWidth += Number(one._tabWidth);
            }
            if (showWidth > tabsBodyWidth) {
              rightTabs.push(one);
            }
            showIndex++;
          });
        } else {
          this.mainTabs.forEach((one, index) => {
            showWidth += Number(one._tabWidth);
          });
        }
        this.leftTabs = leftTabs;
        this.rightTabs = rightTabs;
        if (scrollLeft > 0) {
          scrollLeft += 2;
          if (scrollLeft > tabWidthCount - showWidth) {
            scrollLeft = tabWidthCount - showWidth;
          }
          scrollLeft = parseInt(scrollLeft);
        }
        workspaceTabsBody.scrollLeft(scrollLeft);
      });
    },
    getActiveIndex() {
      return this.mainTabs.indexOf(this.itemsWorker.activeItem);
    },
    handleCommand(tab) {
      this.toSelectTab(tab);
    },
    tabMouseup(tab) {
      if (window.event && window.event.button != 1) {
        return;
      }
      if (tab == null) {
        return;
      }
      this.itemsWorker.toRemoveItem(tab);
    },
    tabContextmenu(tab) {
      if (tab == null) {
        return;
      }
      let menus = [];

      menus.push({
        header: tab.name,
      });
      if (this.hasOpenNewWindow) {
        menus.push({
          text: "新窗口打开",
          onClick: () => {
            this.openNewWindow && this.openNewWindow(tab);
          },
        });
      }
      menus.push({
        text: "关闭",
        onClick: () => {
          this.toDeleteTab(tab);
        },
      });
      menus.push({
        text: "打开新标签",
        onClick: () => {
          this.itemsWorker.toCopyItem(tab);
        },
      });
      if (tab.toolboxId && tab.toolboxId < 9999999910000) {
        menus.push({
          text: "查看配置信息",
          onClick: () => {
            this.tool.showToolboxInfo(tab.toolboxId);
          },
        });
      }
      menus.push({
        text: "选择",
        onClick: () => {
          this.toSelectTab(tab);
        },
      });
      menus.push({
        text: "关闭其它",
        onClick: () => {
          this.itemsWorker.toDeleteOtherItem(tab);
        },
      });
      menus.push({
        text: "关闭所有",
        onClick: () => {
          this.itemsWorker.toRemoveAll();
        },
      });

      if (this.formatContextmenu != null) {
        this.formatContextmenu(tab, menus);
      }
      this.tool.showContextmenu(menus);
    },
    toSelectTab(tab) {
      this.itemsWorker.toActiveItem(tab);
    },
    toDeleteTab(tab) {
      this.itemsWorker.toRemoveItem(tab);
    },
    doChangeSize() {
      // console.log("doChangeSize");
      this.initTabs();
    },
    listenResize() {
      if (this.isDestroyed || this.listenResizeIng) {
        return;
      }
      this.listenResizeIng = true;
      this.$nextTick(() => {
        // console.log("listenResize");
        try {
          let newElWidth = this.tool.jQuery(this.$el).width();
          if (this.oldElWidth != newElWidth) {
            this.oldElWidth = newElWidth;
            this.doChangeSize();
          }
        } catch (e) {
        } finally {
          window.setTimeout(() => {
            this.listenResizeIng = false;
            this.listenResize();
          }, 1000);
        }
      });
    },
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {
    this.init();
    this.$nextTick(() => {
      this.oldElWidth = this.tool.jQuery(this.$el).width();
      this.listenResize();
    });
  },
  beforeDestroy() {
    this.isDestroyed = true;
  },
};
</script>

<style >
.workspace-tabs {
  width: 100%;
  height: 100%;
  font-size: 14px;
  position: relative;
  user-select: none;
  display: flex;
}
.workspace-tabs.workspace-tabs-no-tab {
  border-bottom: 1px solid transparent;
}
.workspace-tabs-body {
  display: flex;
  position: relative;
  overflow: hidden;
}
.workspace-tabs-left,
.workspace-tabs-right {
  height: 100%;
  position: relative;
  padding: 0px 0px;
  display: flex;
}
.workspace-tabs-nav-dropdown {
  height: 100%;
  align-items: center;
}
.workspace-tabs-nav {
  height: 100%;
  align-items: center;
  display: flex;
  white-space: nowrap;
}
.workspace-tabs-nav .mdi {
  font-size: 16px;
}
.workspace-tabs-one {
  display: flex;
  position: relative;
  border-top-left-radius: 0px;
  border-top-right-radius: 10px;
  align-items: center;
}
.workspace-tabs-one .workspace-tabs-one-text {
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0px 5px 0px 10px;
  cursor: pointer;
  white-space: nowrap;
}
.workspace-tabs-one .workspace-tabs-delete-btn {
  transition: all 0.1s;
  transform: scale(0);
  margin: 0px 5px;
}
.workspace-tabs-one:hover .workspace-tabs-delete-btn {
  transform: scale(1);
}
</style>
