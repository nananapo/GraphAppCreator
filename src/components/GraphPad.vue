<template>
<div>
  <div id="main">

    <div id="background"
          v-on:pointerdown="onMouseDown"
          v-on:pointerup="onMouseUp"
          v-on:pointerleave="onMouseUp"
          v-on:pointermove="onMouseMove"
          :style="{'top':(-50000+offsetTop)+'px','left':(-50000+offsetLeft)+'px'}"/>

    <Graph v-for="(graph,id) in graphs" :key="id"
           :ref="id"
           :graph-id="id"
           :graph-type="graph.type"
           :definition="graph.definition"
           :setting="graph.setting"
           :offset-top="offsetTop"
           :offset-left="offsetLeft"
           :logo-src="logoSrc"
           v-on:toFront="toFront(id)"
           v-on:onNodeClick="onNodeClick"
           v-on:onMove="onMoveGraph(id)"
           v-on:onRemoveButton="removeGraph(id)"/>

    <Edge v-for="(pointData,connectionId) in connectionPoints" :key="connectionId"
         :x1="pointData.x1"
         :y1="pointData.y1"
         :x2="pointData.x2"
         :y2="pointData.y2"/>
  </div>
</div>
</template>

<script>
import Graph from "@/components/Graph";
import {generateUuid} from "@/assets/uuid";
import Edge from "@/components/Edge";

export default {
  name: "GraphPad",
  components: {
    Edge,
    Graph
  },
  props:{
    generatorSetting : Object,
    logoSrc : String
  },
  data() {
    return {
      graphs: {},
      connections : {},
      connectionPoints : {},

      selectedNode : null,

      offsetTop: 0,
      offsetLeft: 0,
      startTop: 0,
      startLeft: 0,
      lastMouseX: 0,
      lastMouseY: 0,
      mouseDown: false,
    };
  },
  methods: {
    onMouseDown(args) {
      this.mouseDown = true;
      this.lastMouseX = args.x;
      this.lastMouseY = args.y;
      //グラフの選択を解除
      Object.values(this.graphs).forEach(graph => {
        graph.setting.isSelected = false;
      });
    },
    onMouseUp() {
      this.mouseDown = false;
    },
    onMouseMove(args) {
      if(this.mouseDown){

        let dx = args.x - this.lastMouseX;
        let dy = args.y - this.lastMouseY;
        this.lastMouseX = args.x;
        this.lastMouseY = args.y;

        this.offsetTop += dy;
        this.offsetLeft += dx;

        for(let connId in this.connectionPoints){
          let pointData = this.connectionPoints[connId];
          pointData.x1 += dx;
          pointData.y1 += dy;
          pointData.x2 += dx;
          pointData.y2 += dy;
        }

      }
    },
    removeGraph(id){
      //グラフを削除
      this.$delete(this.graphs,id);

      //接続点を削除
      for(let connId in this.connections){
        if(this.connections[connId].from.graphId === id || this.connections[connId].to.graphId === id){
          this.$delete(this.connections,connId);
          this.$delete(this.connectionPoints,connId);
        }
      }

      this.$emit('onUpdate',this.graphs,this.connections,this.generatorSetting);
    },
    toFront(id) {
      let myZ = this.graphs[id].setting.zIndex;
      let maxZ = myZ - 1;

      Object.keys(this.graphs).forEach(key => {
        let index = this.graphs[key].setting.zIndex;
        if (key !== id && index > myZ) {
          index -= 1;
          this.graphs[key].setting.zIndex = index;
          maxZ = Math.max(index, maxZ);
        }
      });

      this.graphs[id].setting.zIndex = maxZ + 1;
    },
    getMaxZIndex : function () {
      let maxZ = -1;
      Object.keys(this.graphs).forEach(key => {
        let index = this.graphs[key].setting.zIndex;
        maxZ = Math.max(index, maxZ);
      });
      return maxZ;
    },
    addGraph : function (type,definition){
      let id = generateUuid();
      this.$set(this.graphs, id,  {
        type:type,
        definition:definition,
        setting:{
          x:-this.offsetLeft + window.innerWidth/3,
          y:-this.offsetTop + window.innerHeight/3,
          zIndex:this.getMaxZIndex() + 1,
          isSelected:false
        }
      });
    },
    onMoveGraph: function(graphId){
      Object.keys(this.connections).forEach(connId => {

        let from = this.connections[connId].from;
        let to = this.connections[connId].to;

        if(from.graphId !== graphId && to.graphId !== graphId){
          return;
        }

        let node1 = this.getNodePosition(from.graphId, from.nodeType, from.nodeIndex);
        let node2 = this.getNodePosition(to.graphId, to.nodeType, to.nodeIndex);

        this.$set(this.connectionPoints, connId, {
          x1: node1.x,
          y1: node1.y,
          x2: node2.x,
          y2: node2.y
        });

      });
    },
    onNodeClick : function (graphId,nodeType,nodeIndex) {
      if(this.selectedNode == null){
        this.selectedNode = {
          graphId : graphId,
          nodeType : nodeType,
          nodeIndex : nodeIndex
        };
      }else{
        if(this.canConnectNode(this.selectedNode.graphId,this.selectedNode.nodeType,this.selectedNode.nodeIndex,graphId,nodeType,nodeIndex)){
          let connId = generateUuid();
          this.$set(this.connections,connId, {
            from:{
              graphId:this.selectedNode.graphId,
              nodeType:this.selectedNode.nodeType,
              nodeIndex:this.selectedNode.nodeIndex
            },
            to:{
              graphId:graphId,
              nodeType:nodeType,
              nodeIndex:nodeIndex
            }
          });
          this.$set(this.connectionPoints,connId, {
            x1:0,
            y1:0,
            x2:0,
            y2:0
          });
          this.onMoveGraph(graphId);
          this.$emit('onUpdate',this.graphs,this.connections,this.generatorSetting);
        }
        this.selectedNode = null;
      }
    },
    canConnectNode(graphId1,nodeType1,nodeIndex1,graphId2,nodeType2,nodeIndex2){
      graphId1 + graphId2 + nodeIndex1 + nodeIndex2;
      if(nodeType1 === 0 && nodeType2 === 1){
        return true;
      }else if(nodeType1 === 1 && nodeType2 === 0){
        return true;
      }else if(nodeType1 === 2 && nodeType2 === 3){
        return true;
      }else if(nodeType1 === 3 && nodeType2 === 2){
        return true;
      }else{
        return false;
      }
    },
    getNodePosition(graphId,nodeType,nodeIndex){
      if(this.$refs[graphId] == null){
        return {
          x:0,
          y:0
        };
      }

      let graph = this.$refs[graphId][0];
      let node = graph.getNodeDom(nodeType,nodeIndex);

      let rect = node.getBoundingClientRect();
      return{
        x:rect.x + window.scrollX,
        y:rect.y + window.scrollY
      }
    }
  }
}
</script>

<style scoped>
#main{
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#background{
  position: absolute;
  width: 100000px;
  height: 100000px;
  background-color: #212121;
  background-image: linear-gradient(0deg, transparent 31px, rgba(255, 255, 255, 0.38) 32px), linear-gradient(90deg,  transparent 31px, rgba(255, 255, 255, 0.12) 32px);
  background-size: 32px 32px;
  overflow: hidden;
}
</style>