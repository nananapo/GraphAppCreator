<template>
  <div>
    <div id="main" :style="{top:getTop()+'px',left:getLeft()+'px'}">
      <svg id="main" xmlns="http://www.w3.org/2000/svg" :height="height()" :width="width()" :viewBox="'0 0 ' + width() + ' ' + height()" class="SvgFrame">
        <line x1="0" :y1="lineY1()" :x2="width()" :y2="lineY2()" style="stroke:white; stroke-width:2 "/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "Edge",
  props: {
    x1:Number,
    y1:Number,
    x2:Number,
    y2:Number,
  },
  data() {
    return {
      nodeSize: 30
    }
  },
  methods: {
    height: function() {
      return Math.max(2,Math.abs(this.y2 - this.y1));
    },
    width: function() {
      return Math.abs(this.x2 - this.x1);
    },
    getTop: function (){
      let v = Math.max(this.y1,this.y2) - this.height();
      return v + this.nodeSize / 2;
    },
    getLeft: function (){
      return Math.min(this.x1,this.x2) + this.nodeSize / 2;
    },
    lineY1: function (){
      if(this.x1 < this.x2) {
        return this.y1 > this.y2 ? this.height() : 0;
      }else{
        return this.y1 > this.y2 ? 0 : this.height();
      }
    },
    lineY2: function (){
      if(this.x1 < this.x2) {
        return this.y1 > this.y2 ? 0 : this.height();
      }else{
        return this.y1 > this.y2 ? this.height() : 0;
      }
    }
  }
}
</script>

<style scoped>
#main{
  position: absolute;
  z-index: 0;
  pointer-events: none;
}
</style>