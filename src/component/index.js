import Vue from 'vue'

import './tm';

import './font/font.css'
import './iconfont/iconfont.css'

import TMLayout from './tm/Layout.vue'
Vue.component(TMLayout.name, TMLayout);
import TMLayoutBar from './tm/LayoutBar.vue'
Vue.component(TMLayoutBar.name, TMLayoutBar);

import InfoBox from './message/InfoBox.vue'
Vue.component('InfoBox', InfoBox);

import SystemInfoBox from './message/SystemInfoBox.vue'
Vue.component('SystemInfoBox', SystemInfoBox);

import AlertBox from './message/AlertBox.vue'
Vue.component('AlertBox', AlertBox);

import DataTable from './dataTable/Index.vue'
Vue.component('DataTable', DataTable);

import WorkspaceTabs from './workspace/Tabs.vue'
Vue.component('WorkspaceTabs', WorkspaceTabs);
import WorkspaceSpans from './workspace/Spans.vue'
Vue.component('WorkspaceSpans', WorkspaceSpans);

import IconFont from './icon/IconFont.vue'
Vue.component('IconFont', IconFont);
import Icon from './icon/Icon.vue'
Vue.component('Icon', Icon);

import Contextmenu from './contextmenu/Contextmenu.vue'
Vue.component('Contextmenu', Contextmenu);
import ContextmenuMenus from './contextmenu/ContextmenuMenus.vue'
Vue.component('ContextmenuMenus', ContextmenuMenus);

import Form from './form/Form.vue'
Vue.component('Form', Form);
import FormBox from './form/FormBox.vue'
Vue.component('FormBox', FormBox);
import FormDialog from './form/FormDialog.vue'
Vue.component('FormDialog', FormDialog);

import ShouldLogin from './error/ShouldLogin.vue'
Vue.component('ShouldLogin', ShouldLogin);

import NoPower from './error/NoPower.vue'
Vue.component('NoPower', NoPower);

import TabEditor from './tab-editor/Index.vue'
Vue.component('TabEditor', TabEditor);

import MenuBox from './menu/MenuBox.vue'
Vue.component('MenuBox', MenuBox);

import MenuSubBox from './menu/MenuSubBox.vue'
Vue.component('MenuSubBox', MenuSubBox);

import MenuItem from './menu/MenuItem.vue'
Vue.component('MenuItem', MenuItem);


import ToolboxEditor from './toolbox/Index.vue'
Vue.component('ToolboxEditor', ToolboxEditor);

import ToolboxRedisEditor from './toolbox/redis/Index.vue'
Vue.component('ToolboxRedisEditor', ToolboxRedisEditor);

import ToolboxKafkaEditor from './toolbox/kafka/Index.vue'
Vue.component('ToolboxKafkaEditor', ToolboxKafkaEditor);

import ToolboxZookeeperEditor from './toolbox/zookeeper/Index.vue'
Vue.component('ToolboxZookeeperEditor', ToolboxZookeeperEditor);

import ToolboxElasticsearchEditor from './toolbox/elasticsearch/Index.vue'
Vue.component('ToolboxElasticsearchEditor', ToolboxElasticsearchEditor);

import ToolboxDatabaseEditor from './toolbox/database/Index.vue'
Vue.component('ToolboxDatabaseEditor', ToolboxDatabaseEditor);

import ToolboxSSHEditor from './toolbox/ssh/Index.vue'
Vue.component('ToolboxSSHEditor', ToolboxSSHEditor);

import ToolboxOtherEditor from './toolbox/other/Index.vue'
Vue.component('ToolboxOtherEditor', ToolboxOtherEditor);

import ScriptInfo from './script/Info.vue'
Vue.component('ScriptInfo', ScriptInfo);

import Editor from './Editor.vue'
Vue.component('Editor', Editor);

import DataMove from './datamove/Index.vue'
Vue.component('DataMove', DataMove);

import ScriptValueDescription from './ScriptValueDescription.vue'
Vue.component('ScriptValueDescription', ScriptValueDescription);


import ValueTypeSelect from './toolbox/maker/ValueTypeSelect.vue'
Vue.component('ValueTypeSelect', ValueTypeSelect);

import Flowchart from './flowchart/Index.vue'
Vue.component('Flowchart', Flowchart);

import FlowchartNode from './flowchart/Node.vue'
Vue.component('FlowchartNode', FlowchartNode);


export default {};