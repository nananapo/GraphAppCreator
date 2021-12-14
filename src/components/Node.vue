<template>
<div>
  <div id="node">

    <img v-if="nodeType === -1"
         class="node-image none"/>

    <img v-if="nodeType === 0 || nodeType === 1"
         class="node-image"
         src="@/assets/triangle.svg"
         alt="node"
         v-on:mousedown="onMouseDown">

    <img v-if="nodeType === 2 || nodeType === 3"
         class="node-image"
         src="@/assets/round.svg"
         alt="node"
         v-on:mousedown="onMouseDown">

  </div>
</div>
</template>

<script>
export default {
  name: "Node",
  props:{
    name:String,
    index:Number,
    nodeType:Number,
    itemType:String,
    isUsed:Boolean,
  },
  methods:{
    onMouseDown: function (){
      this.$emit('onNodeClick', this.nodeType, this.index);
    }
  }
}
</script>

<style scoped>
#node{
  width: 30px;
  height: 30px;
}
.node-image{
  width: 15px;
  height: 15px;
  margin-top: 7.5px;
  object-fit: fill;
  pointer-events: auto;
}
.none{
  display: none;
}
</style>