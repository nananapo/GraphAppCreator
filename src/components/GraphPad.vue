<template>
<div>
  <div id="main">
    <div id="background"
          v-on:mousedown="onMouseDown"
          v-on:mouseup="onMouseUp"
          v-on:mouseleave="onMouseUp"
          v-on:mousemove="onMouseMove"
          :style="{'top':(-50000+offsetTop)+'px','left':(-50000+offsetLeft)+'px'}"/>

    <Graph v-for="(graph,id) in graphs" :key="id"
           :ref="id"
           :graph-id="id"
           :graph-type="graph.type"
           :definition="graph.definition"
           :setting="graph.setting"
           :offset-top="offsetTop"
           :offset-left="offsetLeft"
           v-on:toFront="toFront(id)"
           v-on:onNodeClick="onNodeClick"/>
  </div>
</div>
</template>

<script>
import Graph from "@/components/Graph";

export default {
  name: "GraphPad",
  components: {
    Graph
  },
  props: {
    graphs: Object
  },
  data() {
    return {
      offsetTop: 0,
      offsetLeft: 0,
      startTop: 0,
      startLeft: 0,
      startX: 0,
      startY: 0,
      mouseDown: false,
    };
  },
  methods: {
    onMouseDown(args) {
      this.mouseDown = true;
      this.startX = args.x;
      this.startY = args.y;
      this.startTop = this.offsetTop;
      this.startLeft = this.offsetLeft;
    },
    onMouseUp() {
      this.mouseDown = false;
    },
    onMouseMove(args) {
      if(this.mouseDown){
        this.offsetTop = this.startTop + (args.y - this.startY);
        this.offsetLeft = this.startLeft + (args.x - this.startX);
      }
    },
    onNodeClick(graphId,nodeType,nodeIndex) {
      this.$emit("onNodeClick", graphId, nodeType, nodeIndex);
    },
    toFront(id) {
      let myZ = this.graphs[id].zIndex;
      let maxZ = myZ - 1;

      Object.keys(this.graphs).forEach(key => {
        let index = this.graphs[key].zIndex;
        if (key !== id && index > myZ) {
          index -= 1;
          this.graphs[key].zIndex = index;
          maxZ = Math.max(index, maxZ);
        }
      });

      this.graphs[id].zIndex = maxZ + 1;
    },
  }
}
</script>

<style scoped>

#main{
  width: 100%;
  height: 100%;
}

#background{
  position: absolute;
  width: 100000px;
  height: 100000px;
  background-color: #ffffff;
  background-image: linear-gradient(0deg, transparent 31px, #006fcc 32px), linear-gradient(90deg,  transparent 31px, #006fcc 32px);
  background-size: 32px 32px;
}

</style>