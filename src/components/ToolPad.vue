<template>
<div>
  <div id="main" :style="{top:top+'px',left:left+'px'}">

    <div id="menu-title"
         v-on:pointerdown="onPointerDown"
         v-on:pointerup="onPointerUp"
         v-on:pointerleave="onPointerUp"
         v-on:pointermove="onPointerMove">Create</div>

    <div id="buttons">
      <div class="detail" v-for="(graph,type) in generatorSetting.Graphs" :key="type">
        <button class="name" v-on:click="addGraph(type)">{{type}}</button>
      </div>
    </div>

    <div id="footer"/>

  </div>
</div>
</template>

<script>
export default {
  name: "ToolPad",
  props:{
    generatorSetting : Object
  },
  data(){
    return{
      top:50,
      left:50,
      lastPointerX:0,
      lastPointerY:0,
      isPointerDown:false
    }
  },
  methods:{
    onPointerDown(args){
      this.isPointerDown = true;
      this.lastPointerX = args.x;
      this.lastPointerY = args.y;
    },
    onPointerUp(){
      this.isPointerDown = false;
    },
    onPointerMove(args){
      if(this.isPointerDown){
        this.top += args.y - this.lastPointerY;
        this.left += args.x - this.lastPointerX;
        this.lastPointerX = args.x;
        this.lastPointerY = args.y;
      }
    },
    addGraph(type){
      this.$emit('onAddGraph',type,this.generatorSetting.Graphs[type]);
    }
  }
}
</script>

<style scoped>

#main{
  position:absolute;
  width: 200px;
  height: 100%;
  max-height: 400px;
  border: yellow solid 1px;
  border-radius: 10px;
  background-color: #ffffff;
  overflow: hidden;
}

#menu-title{
  position: relative;
  height: 30px;
  padding-top: 10px;
  font-size: medium;
  font-weight: bold;
  vertical-align: center;
  text-align: center;
  border-bottom: black solid 1px;
  background: #e5e5e5;
  pointer-events: auto;
  overflow: auto;
}

#buttons{
  width: 100%;
  max-height: 370px;
  overflow: auto;
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
  cursor: pointer;
  color: black;
  font-weight: normal;
  font-size: medium;
}

#footer{
  height: 10px;
}
</style>