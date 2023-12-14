export default {
    css: `
/** 设置用户自定义样式 **/
.workspace-container .workspace-header .workspace-header-nav{
    color: headerColor;
}
.workspace-container .workspace-header{
    background-color: headerBackgroudColor5;
    border-color: headerBackgroudColor2;
}
.workspace-container .workspace-header .workspace-header-nav:hover{
    background-color: headerBackgroudColor3;
}
.workspace-main-tabs-container>.workspace-tabs{
    color: headerTabColor;
    border-color: headerTabBackgroudColor2;
}
.workspace-main-tabs-container>.workspace-tabs .workspace-tabs-nav,
.workspace-main-tabs-container>.workspace-tabs .workspace-tabs-one{
    border-color: headerTabBackgroudColor2;
}

.workspace-main-tabs-container>.workspace-tabs .workspace-tabs-one,
.workspace-main-tabs-container>.workspace-tabs .workspace-tabs-left,
.workspace-main-tabs-container>.workspace-tabs .workspace-tabs-right{
    background-color: headerTabBackgroudColor5;
}
.workspace-main-tabs-container>.workspace-tabs .workspace-tabs-one.active{
    background-color: headerTabBackgroudColor7;
}
.workspace-container .workspace-main{
    color: bodyColor;
}
.workspace-container .workspace-main{
    background-color: bodyBackgroudColor;
}
.workspace-spans .workspace-tabs{
    color: bodyTabColor;
    border-color: bodyTabBackgroudColor2;
}
.workspace-spans .workspace-tabs .workspace-tabs-nav,
.workspace-spans .workspace-tabs .workspace-tabs-one{
    border-color: bodyTabBackgroudColor2;
}
.workspace-spans .workspace-tabs .workspace-tabs-one,
.workspace-spans .workspace-tabs .workspace-tabs-left,
.workspace-spans .workspace-tabs .workspace-tabs-right{
    background-color: bodyTabBackgroudColor5;
}

.workspace-spans .workspace-tabs .workspace-tabs-one.active{
    background-color: bodyTabBackgroudColor7;
} 

.workspace-container .toolbox-editor input, .workspace-container .toolbox-editor input:focus, .workspace-container .toolbox-editor select, .workspace-container .toolbox-editor select:focus, .workspace-container .toolbox-editor textarea, .workspace-container .toolbox-editor textarea:focus{
    border-color: bodyBackgroudColor2;
}


.workspace-container .toolbox-editor table th,
.workspace-container .toolbox-editor table tr td {
    border: 1px solid bodyBackgroudColor2;
}

.workspace-container .toolbox-editor .el-table td,
.workspace-container .toolbox-editor .el-table th.is-leaf {
    border-bottom: 1px solid bodyBackgroudColor2;
}

.workspace-container .toolbox-editor .el-table--border th.el-table__cell,
.workspace-container .toolbox-editor .el-table__fixed-right-patch {
    border-bottom: 1px solid bodyBackgroudColor2;
}
.workspace-container .toolbox-editor .el-table__fixed {
    background-color: bodyBackgroudColor5;
}
.workspace-container .toolbox-editor .el-table .el-table__row:hover td.el-table__cell,
.workspace-container .toolbox-editor .el-table .el-table__row:hover td.el-table__cell,
.workspace-container .toolbox-editor .el-table .el-table__row.hover-row td.el-table__cell {
    background-color: bodyBackgroudColor7;
}

.workspace-container .toolbox-editor .el-table--border,
.workspace-container .toolbox-editor .el-table--group {
    border: 1px solid bodyBackgroudColor2;
}

.workspace-container .toolbox-editor .el-table--border .el-table__cell,
.workspace-container .toolbox-editor .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
    border-right: 1px solid bodyBackgroudColor2;
}

.workspace-container .toolbox-editor .el-table--border th.el-table__cell.gutter:last-of-type {
    border-bottom: 1px solid bodyBackgroudColor2;
}

.workspace-container .toolbox-editor .el-table .el-switch .el-switch__core {
    background-color: bodyBackgroudColor8;
}

.workspace-container .toolbox-editor .el-table .el-switch .el-switch__core:after {
    background-color: bodyBackgroudColor2;
}

.workspace-container .toolbox-editor .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background: bodyBackgroudColor7;
}

.workspace-container .toolbox-editor .el-table__body-wrapper::-webkit-scrollbar-track {
    background: bodyBackgroudColor6;
}

.workspace-container .toolbox-editor .el-table__body-wrapper::-webkit-scrollbar-track-piece {
    background: bodyBackgroudColor6;
}


.workspace-container .toolbox-editor .el-tree {
    border: 1px dotted bodyBackgroudColor2;
}

.workspace-container .toolbox-editor .el-tree-node__content {
    border-bottom: 1px dotted bodyBackgroudColor2;
}

.workspace-container .toolbox-editor .el-tree .el-tree-node.is-current>.el-tree-node__content {
    background-color: bodyBackgroudColor6 !important;
}

.workspace-container .toolbox-editor .el-tree .el-tree-node:focus>.el-tree-node__content {
    background-color: bodyBackgroudColor7;
}

.workspace-container .toolbox-editor .el-tree .el-tree-node>.el-tree-node__content:hover {
    background-color: bodyBackgroudColor7;
}

.workspace-container .data-list-box {
    border: 1px solid bodyBackgroudColor2;
}

.workspace-container .data-list-box .data-list-one {
    border-bottom: 1px solid bodyBackgroudColor2;
}

.workspace-container .data-list-box .data-list-one:hover {
    background: bodyBackgroudColor7;
}


.workspace-container .app-scroll-bar:hover::-webkit-scrollbar-thumb {
    background: bodyBackgroudColor7;
}

.workspace-container .app-scroll-bar:hover::-webkit-scrollbar-track {
    background: bodyBackgroudColor6;
}

.workspace-container .app-scroll-bar:hover::-webkit-scrollbar-track-piece {
    background: bodyBackgroudColor6;
}

.workspace-container .app-scroll-bar:hover::-webkit-scrollbar-corner {
    background: bodyBackgroudColor6;
}

.workspace-container .app-scroll-bar-textarea textarea::-webkit-scrollbar-thumb {
    background: bodyBackgroudColor7;
}

.workspace-container .app-scroll-bar-textarea textarea:hover::-webkit-scrollbar-track {
    background: bodyBackgroudColor6;
}

.workspace-container .app-scroll-bar-textarea textarea:hover::-webkit-scrollbar-track-piece {
    background: bodyBackgroudColor6;
}

.workspace-container .app-scroll-bar-textarea textarea:hover::-webkit-scrollbar-corner {
    background: bodyBackgroudColor6;
}


.workspace-container .toolbox-editor .tm-layout>.tm-layout-bar {
    background-color: bodyBackgroudColor6;
}

.workspace-container .toolbox-editor .tm-layout-bar>.tm-layout-bar-part {
    background-color: bodyBackgroudColor6;
}

.workspace-container .toolbox-editor .toolbox-layout-header {
    border-bottom: 1px solid bodyBackgroudColor6;
}



.workspace-container .toolbox-file-manager-file-box:hover {
    background: bodyBackgroudColor7;
}

.workspace-container .toolbox-file-manager-file-select {
    background: bodyBackgroudColor6;
}

    `
}