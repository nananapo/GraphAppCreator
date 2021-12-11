<template>
<div id="node">
  <img id="node-image" src="@/assets/round.svg"  v-on:mousedown="$emit('node_click')">
</div>
</template>

<script>
export default {
  name: "Node",
  props:{
    name:String,
    type:String
  },
  methods:{
    onMouseDown: function (){
      console.log("1")
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