<template>
<div>
  <div id="node">
    <img id="node-image" src="@/assets/round.svg"  v-on:mousedown="onMouseDown">
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
    itemType:String
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
#node-image{
  width: 30px;
  height: 30px;
  object-fit: fill;
  pointer-events: auto;
}
</style>