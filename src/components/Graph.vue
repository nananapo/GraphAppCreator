<template>
  <div>
    <div id="main"
         :style="{'top':(setting.y+offsetTop)+'px','left':(setting.x+offsetLeft)+'px','z-index':setting.zIndex}">

      <div ref="contextMenu">
        <transition name="fade" appear>
          <div v-if="showContextMenu" class="context-menu flex-column" :style="{position:'fixed', top:contextTop+'px',left:contextLeft+'px'}">
            <div v-on:pointerdown="removeButton" style="z-index: auto;pointer-events: auto;">
              グラフを削除する
            </div>
          </div>
        </transition>
      </div>

      <div class="node-list" :style="getNodeListStyle()">
        <Node ref="inprocess_0"
              name="Process"
              :index=0
              :node-type="definition.InProcessNode ? 0 : -1"
              :is-used="true"
              v-on:onNodeClick="onNodeClick"/>
        <Node v-for="node in inItems" :key="node.id"
              :ref="node.id"
              :name="node.name"
              :index="node.index"
              :node-type="2"
              :item-type="node.type"
              :is-used="true"
              v-on:onNodeClick="onNodeClick"/>
      </div>

      <div id="body"
           v-on:pointerdown="onMouseDown"
           v-on:pointerup="onMouseUp"
           v-on:pointermove="onMouseMove"
           v-on:pointerleave="onMouseUp"
           :style="getBodyStyle()">

        <div id="card-header" ref="cardHeader">
          <img id="graph-type-image" :src="logoSrc" alt="img"/>
          <div id="text-field">
            <div id="graph-namespace-text">ID : {{graphId.slice(0,8)}}</div>
            <div id="graph-type-text">{{graphType}}</div>
          </div>
        </div>

        <div id="node-names-layout">
          <div class="node-names-container">
            <div class="node-name left" v-if="definition.InProcessNode || outProcessNodes.length !== 0"/>
            <div class="node-name left" v-for="node in inItems" :key="`name_${node.id}`">{{node.name}}</div>
          </div>
          <div class="node-names-container right">
            <div class="node-name right" v-if="definition.InProcessNode && outProcessNodes.length === 0"/>
            <div class="node-name right" v-for="node in outProcessNodes" :key="`name_${node.id}`">{{node.name}}</div>
            <div class="node-name right" v-for="node in outItems" :key="`name_${node.id}`">{{node.name}}</div>
          </div>
        </div>

        <div v-if="graphType === 'Value<int>'">
          <input type="number" v-model="setting.Value"/>
        </div>

        <div v-if="graphType === 'Value<string>'">
          <input type="text" v-model="setting.Value"/>
        </div>

        <div v-if="graphType === 'div'">
          <input type="text" v-model="setting.Id" placeholder="ID"/>
        </div>

        <div v-if="graphType === 'Text'">
          <input type="text" v-model="setting.Text" placeholder="TEXT"/>
        </div>

        <div v-if="graphType === 'button'">
          <div>
            <input type="text" v-model="setting.Id" placeholder="ID"/>
          </div>
          <div>
            <input type="text" v-model="setting.Text" placeholder="TEXT"/>
          </div>
        </div>

        <div id="card-footer"></div>
      </div>

      <div class="node-list" :style="getNodeListStyle()">
        <Node v-if="definition.InProcessNode && outProcessNodes.length === 0"
              :node-type="-1"/>
        <Node v-for="node in outProcessNodes" :key="node.id"
              :ref="node.id"
              name="Process"
              :index="node.index"
              :node-type=1
              :is-used="true"
              v-on:onNodeClick="onNodeClick"/>
        <Node v-for="node in outItems" :key="node.id"
              :ref="node.id"
              :name="node.name"
              :index="node.index"
              :node-type="3"
              :item-type="node.type"
              :is-used="true"
              v-on:onNodeClick="onNodeClick"/>
      </div>

    </div>
  </div>
</template>

<script>
import Node from "@/components/Node";

export default {
  name: 'Graph',
  props: {
    graphId: String,
    graphType: String,
    definition: Object,
    setting: Object,
    offsetTop: Number,
    offsetLeft: Number,
    logoSrc: String,
  },
  components: {
    Node
  },
  data : function(){
    return {
      isMounted: false,

      dragMode : false,
      clickX:0,
      clickY:0,
      inItems:[],
      outItems:[],
      outProcessNodes:[],

      showContextMenu: false,
      contextTop: 0,
      contextLeft: 0,
    }
  },
  mounted: function () {

    //Add context menu event
    this.$el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showContextMenu = true;
      this.contextLeft = e.pageX;
      this.contextTop = e.pageY;
    });

    //disappear context menu event
    document.addEventListener("pointerdown", (e) => {
      if(!this.showContextMenu) return;
      if(e.target.id === 'context-menu') return;
      this.showContextMenu = false;
    });

    if (this.graphType === "Value<int>") {
      this.$set(this.setting, "Value", 0);
    }

    if (this.graphType === "Value<string>") {
      this.$set(this.setting, "Value", "");
    }

    if (this.graphType === "div") {
      this.$set(this.setting, "Id", "");
    }

    if (this.graphType === "Text") {
      this.$set(this.setting, "Text", "");
    }

    if (this.graphType === "button") {
      this.$set(this.setting, "Id", "");
      this.$set(this.setting, "Text", "");
    }

    // InItem
    let i = 0;
    for (let key in this.definition.InItem) {
      this.inItems.push({
        id: "initem_" + i,
        index: i,
        name: key,
        type: this.definition.InItem[key]
      });
      i++;
    }

    // OutItem
    i = 0;
    for (let key in this.definition.OutItem) {
      this.outItems.push({
        id: "outitem_" + i,
        index: i,
        name: key,
        type: this.definition.OutItem[key]
      });
      i++;
    }

    // OutProcess
    for (i = 0; i < this.definition.OutProcessNodeCount; i++) {
      this.outProcessNodes.push({
        id: "outprocess_" + i,
        index: i,
        name: ""
      });
    }

    this.isMounted = true;
  },
  methods:{
    onMouseDown : function (args){
      this.dragMode = true;
      this.setting.isSelected = true;

      this.clickX = args.x;
      this.clickY = args.y;

      this.$emit("toFront");
      this.$emit("onSelected");
    },
    onMouseUp : function () {
      this.dragMode = false;
      this.setting.isSelected = false;
    },
    onMouseMove : function (args) {
      if(this.dragMode){
        let dx = args.x - this.clickX;
        let dy = args.y - this.clickY;
        this.setting.y += dy;
        this.setting.x += dx;
        this.clickX = args.x;
        this.clickY = args.y;
        this.$emit("onMove");
      }
    },
    removeButton: function () {
      this.$emit("onRemoveButton");
    },
    onNodeClick : function (nodeType,nodeIndex){
      this.$emit("onNodeClick",this.graphId,nodeType,nodeIndex);
    },
    getNodeListStyle : function (){
      if(this.isMounted){
        let element = this.$refs.cardHeader;
        let rect = element.getBoundingClientRect();
        return {
          marginTop: rect.height + "px",
        }
      }
    },
    getBodyStyle : function (){
      if(this.setting.isSelected){
        return {
          border: "2px solid #ffff00",
        }
      }else{
        return {
          border: "2px solid #212121",
        }
      }
    },
    getNodeDom : function (nodeType,nodeIndex){
      if(nodeType === 0){
        return this.$refs["inprocess_0"].$el;
      } else if(nodeType === 1){
        return this.$refs["outprocess_" + nodeIndex][0].$el;
      } else if(nodeType === 2) {
        return this.$refs["initem_" + nodeIndex][0].$el;
      } else if(nodeType === 3){
        return this.$refs["outitem_" + nodeIndex][0].$el;
      }
    },
  }
}
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

#main{
  display: inline-flex;
  position: absolute;
  background: transparent;
  pointer-events: none;
}

.context-menu{
  position: absolute;
  background: #ffffff;
  border: 1px solid #212121;
  box-shadow: 0px 0px 10px #212121;
  padding: 5px;
  z-index: 1000000;
}

#body{
  height: 100%;
  border:none;
  background: #444444;
  border-radius: 8px;
  overflow: hidden;
  pointer-events: auto;
  padding-bottom: 2px;
}

#card-header{
  display: flex;
  flex-direction: row;
  background: #6c6c6c;
  padding-bottom: 5px;
  padding-right: 20px;
}

#graph-type-image{
  width: 30px;
  height: 30px;
  margin: 10px 10px 0 10px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

#card-header #text-field{
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin-top: 5px;
  text-align: left;
}

#graph-type-text{
  font-size: large;
  font-weight: 300;
  color: white;
}

#graph-namespace-text{
  font-size: small;
  font-weight: 100;
  color: rgba(255, 255, 255, 0.75);
}

.node-list{
  display: flex;
  flex-direction: column;
  position: relative;
  width: 30px;
  pointer-events: none;
}

#node-names-layout{
  display: flex;
  color: white;
}

.node-names-container{
  width: 100%;
}

.node-name.right{
  text-align: right;
  margin-right: 10px;
}

.node-name.left{
  text-align: left;
  margin-left: 10px;
}

.node-name{
  height: 30px;
  line-height:30px;
}

#card-footer{
  width: 100%;
  height: 5px;
  background: #6c6c6c;
}
</style>
