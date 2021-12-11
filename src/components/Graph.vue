<template>
<div>
  <div id="main"
       :style="{'top':(setting.y+offsetTop)+'px','left':(setting.x+offsetLeft)+'px','z-index':setting.zIndex}">

    <div class="node-list">
      <Node v-if="definition.InProcessNode"
            ref="inprocess_0"
            name="Process"
            :index=0
            :node-type=0
            v-on:onNodeClick="onNodeClick"/>
      <Node v-for="node in inItems" :key="node.id"
            :ref="node.id"
            :name="node.name"
            :index="node.index"
            :node-type=2
            :item-type="node.type"
            v-on:onNodeClick="onNodeClick"/>
    </div>

    <div id="body"
         v-on:mousedown="onMouseDown"
         v-on:mouseup="onMouseUp"
         v-on:mousemove="onMouseMove"
         v-on:mouseleave="onMouseUp">

      <div id="graph-type">{{graphType}}</div>

      <div id="node-names-layout">
        <div class="node-names-container">
          <div class="node-name" v-if="definition.InProcessNode">Process</div>
          <div class="node-name" v-for="node in inItems" :key="`name_${node.id}`">{{node.name}}</div>
        </div>
        <div class="node-names-container">
          <div class="node-name" v-for="node in outProcessNodes" :key="`name_${node.id}`">{{node.name}}</div>
          <div class="node-name" v-for="node in outItems" :key="`name_${node.id}`">{{node.name}}</div>
        </div>
      </div>

      <div v-if="graphType === 'Value<int>'">
        <input type="number" v-model="setting.Value"/>
      </div>

      <div v-if="graphType === 'Value<string>'">
        <input type="text" v-model="setting.Value"/>
      </div>
    </div>

    <div class="node-list">
      <Node v-for="node in outProcessNodes" :key="node.id"
            :ref="node.id"
            name="Process"
            :index="node.index"
            :node-type=1
            v-on:onNodeClick="onNodeClick"/>
      <Node v-for="node in outItems" :key="node.id"
            :ref="node.id"
            :name="node.name"
            :index="node.index"
            :node-type=3
            :item-type="node.type"
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
  },
  components: {
    Node
  },
  data : function(){
    return {
      dragMode : false,
      clickX:0,
      clickY:0,
      inItems:[],
      outItems:[],
      outProcessNodes:[],
    }
  },
  mounted() {

    if(this.graphType === "Value<int>"){
      this.$set(this.setting, "Value", 0);
    }

    if(this.graphType === "Value<string>"){
      this.$set(this.setting, "Value", "");
    }

    // InItem
    let i = 0;
    for(let key in this.definition.InItem){
      this.inItems.push({
        id:"initem_"+i,
        index:i,
        name:key,
        type:this.definition.InItem[key]
      });
      i++;
    }

    // OutItem
    i = 0;
    for(let key in this.definition.OutItem){
      this.outItems.push({
        id:"outitem_"+i,
        index:i,
        name:key,
        type:this.definition.OutItem[key]
      });
      i++;
    }

    // OutProcess
    for(i = 0;i < this.definition.OutProcessNodeCount;i++){
      this.outProcessNodes.push({
        id:"outprocess_"+i,
        index:i,
        name:"Process"
      });
    }
  },
  methods:{
    onMouseDown : function (args){
      this.dragMode = true;
      this.clickX = args.x;
      this.clickY = args.y;
      this.$emit("toFront")
    },
    onMouseUp : function () {
      this.dragMode = false;
    },
    onMouseMove : function (args) {
      if(this.dragMode){
        let dx = args.x - this.clickX;
        let dy = args.y - this.clickY;
        this.setting.y += dy;
        this.setting.x += dx;
        this.clickX = args.x;
        this.clickY = args.y;
      }
    },
    onNodeClick : function (nodeType,nodeIndex){
      this.$emit("onNodeClick",this.graphId,nodeType,nodeIndex);
    },
    getNode(nodeType,nodeIndex){
      if(nodeType === 0){
        return this.$refs["inprocess_0"];
      }else if(nodeType === 1){
        return this.$refs["outprocess_"+nodeIndex];
      }else if(nodeType === 2){
        return this.$refs["initem_"+nodeIndex];
      }else if(nodeType === 3){
        return this.$refs["outitem_"+nodeIndex];
      }
    },
  }
}
</script>

<style scoped>

#main{
  height: 100px;
  display: inline-flex;
  position: absolute;
  background: transparent;
  pointer-events: none;
}

#body{
  height: 100%;
  width: 180px;
  border: solid;;
  background: white;
  pointer-events: auto;
}

#graph-type{
  font-weight: bold;
}

.node-list{
  display: flex;
  flex-direction: column;
  position: relative;
  top: 20px;
  width: 30px;
  pointer-events: none;
}

#node-names-layout{
  display: flex;
}

.node-names-container{
  width: 100%;
}

.node-name{
  height: 30px;
  line-height:30px;
  text-align:center;
}
</style>
