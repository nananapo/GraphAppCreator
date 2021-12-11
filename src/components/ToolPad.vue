<template>
<div>
  <div id="main">
    <div class="detail" v-for="(graph,type) in generatorSetting.Graphs" :key="type">
      <button class="name" v-on:click="addGraph(type)">{{type}}</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "ToolPad",
  props:{
    generatorSetting : Object
  },
  methods:{
    addGraph(type){
      this.$emit('onAddGraph',type,this.generatorSetting.Graphs[type]);
    }
  }
}
</script>

<style scoped>

#main{
  background-color: #bfbfbf;
  width: 100%;
  height: 100%;
}

.detail{
  width: 100%;
  height: 50px;
  border-bottom: black solid 1px;
}

.name{
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: none;
  text-align: left;
  font-weight: lighter;
  cursor: pointer;
}
</style>