<template>
<div>
  <div id="main"
       class="flex-column"
       :style="{top:top+'px',right:right+'px'}">

    <div id="title"
         class="flex-row"
         v-on:pointerdown="onPointerDown"
         v-on:pointermove="onPointerMove"
         v-on:pointerup="onPointerUp"
         v-on:pointerleave="onPointerUp">

      <div id="title-text">View (16:9)</div>
      <img id="title-image" src="@/assets/refresh_black_48dp.svg" alt="" v-on:click="refresh"/>

    </div>

    <iframe ref="iframe" v-bind:srcdoc="resultHtml"/>

  </div>
</div>
</template>

<script>
export default {
  name: "ResultViewer",
  props: {
    resultHtml:String
  },
  data() {
    return {
      top:50,
      right:50,
      isDragging:false,
      lastPointerX:0,
      lastPointerY:0,
    }
  },
  methods:{
    refresh:function(){
      this.$refs.iframe.contentWindow.location.reload();
    },
    onPointerDown:function(e){
      this.isDragging = true;
      this.lastPointerX = e.x;
      this.lastPointerY = e.y;
    },
    onPointerMove:function(e){
      if(this.isDragging){
        this.top += e.y - this.lastPointerY;
        this.right -= e.x - this.lastPointerX;
        this.lastPointerX = e.x;
        this.lastPointerY = e.y;
      }
    },
    onPointerUp:function(){
      this.isDragging = false;
    },
  }
}
</script>

<style scoped>
#main{
  position: absolute;
  background: white;
  width: 270px;
  height: 520px;
  overflow: hidden;
  border-radius: 10px;
  border: yellow solid 1px;
}

#title{
  height: 40px;
  border-bottom: 1px solid #939393;
  background: #eaeaea;
}

#title-text{
  margin-left: 46px;
  padding-top: 12px;
  font-size: 16px;
  font-weight: bold;
  flex-grow: 1;
}

#title-image{
  width: 30px;
  height: 30px;
  padding-top: 4px;
  margin-right: 16px;
}

#title-image:hover{
  cursor: pointer;
  background: #b9b9b9;
  transition: background 0.2s;
}

#title-image:active{
  background: #e3e3e3;
}

iframe{
  width:100%;
  flex-grow: 1;
  border: none;
}
</style>