<template>
<div>
  <div id="main">
    <div class="row">
      <div class="pad-column" id="javascript">
        <div class="title">Generated JavaScript</div>
        <textarea v-model="js" readonly/>
      </div>
      <div class="pad-column" id="html">
        <div class="title">Generated HTML</div>
        <textarea v-model="html" readonly/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "ResultPad",
  props:{
    js:String,
    html:String,
    log:String,
    result:String
  },
  methods:{
    reloadIframe(){
      this.$refs.resultIframe.contentWindow.location.reload();
    }
  }
}
</script>

<style scoped>

#main{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  border-left: black solid 1px;
  background-color: #ffffff;
}

.row{
  display: flex;
  flex-direction: column;
  flex: 1;
  border-right: black solid 1px;
}

.title{
  text-align: left;
}

.pad-column{
  display: flex;
  flex-direction: column;
  flex: 1;
}

textarea{
  width: 100%;
  height: 100%;
  resize: none;
  padding: 0;
  outline: none;
  border: none;
  border-top: black solid 1px;
  border-bottom: black solid 1px;
  background: #e5e5e5;
  font-size: x-large;
  font-weight: bold;
}

iframe{
  width: 100%;
  height: 100%;
  border-top: black solid 1px;
  border-bottom: black solid 1px;
  border-left: none;
  border-right: none;
}
</style>