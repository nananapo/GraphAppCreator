<template>
  <div id="main" :style="{'top':top+'px','left':left+'px','z-index':zindex}">
    <div class="node-list">
      <Node v-if="graphdata.inprocessnode" name="Process" type="Process" v-on:node_click="$emit('node_click',[graphid,0,0])"/>
      <Node v-for="node in graphdata.initemnodes" :key="node.name" :name="node.name" :type="node.type" v-on:node_click="$emit('node_click',[graphid,2,node.index])"/>
    </div>
    <div id="body"
         v-on:mousedown="onMouseDown"
         v-on:mouseup="onMouseUp"
         v-on:mousemove="onMouseMove"
         v-on:mouseleave="onMouseUp">
      <div id="name">{{ type=="Updater" ? "Main" : type == "DebugText" ? "PrintText" : type }}</div>
      <div id="node-names-layout">
        <div class="node-names-container">
          <div class="node-name" v-if="graphdata.inprocessnode">Process</div>
          <div class="node-name" v-for="node in graphdata.initemnodes" :key="node.name">{{node.name}}</div>
        </div>
        <div class="node-names-container">
          <div class="node-name" v-for="node in graphdata.outprocessnodes" :key="node.name">{{node.name}}</div>
          <div class="node-name" v-for="node in graphdata.outitemnodes" :key="node.name">{{node.name}}</div>
        </div>
      </div>
    </div>
    <div class="node-list">
      <Node v-for="node in graphdata.outprocessnodes" :key="node.name" :name="node.name" type="Process" v-on:node_click="$emit('node_click',[graphid,1,node.index])"/>
      <Node v-for="node in graphdata.outitemnodes" :key="node.name" :name="node.name" :type="node.type" v-on:node_click="$emit('node_click',[graphid,3,node.index])"/>
    </div>
  </div>
</template>

<script>
import Node from "@/components/Node";

export default {
  name: 'Graph',
  props: {
    type: String,
    zindex: Number,
    graphid:String,
    graphdata: Object
  },
  components: {
    Node
  },
  data : function(){
    return {
      dragMode : false,
      clickX:0,
      clickY:0,
      top:100,
      left:0
    }
  },
  methods:{
    onMouseDown : function (args){
      this.dragMode = true;
      this.clickX = args.x;
      this.clickY = args.y;
      this.$emit("to_front")
    },
    onMouseUp : function () {
      this.dragMode = false;
    },
    onMouseMove : function (args) {
      if(this.dragMode){
        let dx = args.x - this.clickX;
        let dy = args.y - this.clickY;
        this.top += dy;
        this.left += dx;
        this.clickX = args.x;
        this.clickY = args.y;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main{
  display: inline-flex;
  position: relative;
  height: 100px;
  background: transparent;
  pointer-events: none;
}
#body{
  width: 180px;
  height: 100%;
  border: solid;;
  background: white;
  pointer-events: auto;
}
#name{
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
