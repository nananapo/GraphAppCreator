<template>
  <div id="result-pad">
    <div id="generated-code">
      <div style="text-align: left">生成されたコード</div>
      <textarea readonly v-model="codeString"/>
    </div>
    <div id="log">
      <div style="text-align: left">ログ</div>
      <textarea readonly v-model="logString"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultPad",
  props:{
    logString:String,
    codeString:String
  }
}
</script>

<style scoped>
#result-pad{
  border-left: black solid 1px;
}

#generated-code{
  display: flex;
  flex-direction: column;
  height: 60%;
  background: #ffffff;
}

textarea{
  flex-grow: 1;
  resize: none;
  padding: 0;
  outline: none;
  border: none;
  border-top: black solid 1px;
  border-bottom: black solid 1px;
}

#log{
  display: flex;
  flex-direction: column;
  height: 40%;
  background: #ffffff;
}
</style>