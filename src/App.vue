<template>
  <div id="app">
    <ToolPad id="tool-pad" :generator-setting="jsMode ? javascriptSetting : htmlSetting" v-on:onAddGraph="onAddGraph"/>

    <GraphPad class="graph-pad"
              ref="jsPad"
              v-show="jsMode"
              :generator-setting="javascriptSetting"
              :logo-src="require('@/assets/javascript_logo.jpeg')"
              v-on:onUpdate="onUpdateGraphPad"
              v-on:onGraphSelected="onGraphSelected"/>

    <GraphPad class="graph-pad"
              ref="htmlPad"
              v-show="!jsMode"
              :generator-setting="htmlSetting"
              :logo-src="require('@/assets/html_logo.png')"
              v-on:onUpdate="onUpdateGraphPad"
              v-on:onGraphSelected="onGraphSelected"/>

    <ResultViewer id="result-viewer"
                  :result-html="resultString"/>

    <ResultPad id="result-pad"
               v-show="showResultPad"
               :html="htmlString"
               :js="jsString"
               :html-syntax-string="htmlSyntaxString"
               :js-syntax-string="jsSyntaxString"
               :highlight-graph-id="selectedGraphId"/>

    <div class="flex-column fixed-bottom-left no-select">
      <div class="flex-row gap-8 mybutton background-transparent hover-white click-black" v-on:click="regenerate">
        <img class="button-img" src="@/assets/refresh_white_48dp.svg" alt=""/>
        <div class="button-text">再生成</div>
      </div>
      <div class="flex-row gap-8 mybutton background-transparent hover-white click-black" id="refresh-button" v-on:click="jsMode = !jsMode">
        <img class="button-img" :src="jsMode ? require('@/assets/javascript_logo.jpeg') : require('@/assets/html_logo.png')" alt=""/>
        <div class="button-text">{{jsMode ? "JavaScript" : "HTML"}}</div>
      </div>
      <button id="show-result-button" v-on:click="showResultPad = !showResultPad">{{showResultPad ? "結果を非表示" : "結果を表示"}}</button>
    </div>
  </div>
</template>

<script>

import GraphPad from "@/components/GraphPad";
import ResultPad from "@/components/ResultPad";
import ToolPad from "@/components/ToolPad";
import ResultViewer from "@/components/ResultViewer";

export default {
  name: 'App',
  components: {
    GraphPad,
    ResultPad,
    ToolPad,
    ResultViewer
  },
  data() {
    return {
      javascriptSetting:{Graphs:{}},
      htmlSetting:{Graphs:{}},

      jsMode:true,
      showResultPad:false,

      resultString : "",

      htmlString : "HTML",
      jsString : "JS",

      htmlSyntaxString : "",
      jsSyntaxString : "",

      selectedGraphId:""
    }
  },
  async mounted() {
    const jsSettingUrl = "https://raw.githubusercontent.com/myWorldHub/GeneratorSetting/main/javascript.json";
    this.javascriptSetting = await (await fetch(jsSettingUrl)).json();

    const htmlSettingUrl = "https://raw.githubusercontent.com/myWorldHub/GeneratorSetting/main/html.json";
    this.htmlSetting = await (await fetch(htmlSettingUrl)).json();
  },
  methods:{
    onUpdateGraphPad: function(graphs,connections,generatorSetting){
      this.generate(graphs, connections, generatorSetting);
    },
    onAddGraph: function(type,definition){
      if(this.jsMode){
        this.$refs.jsPad.addGraph(type,definition);
      }else {
        this.$refs.htmlPad.addGraph(type,definition);
      }
    },
    onGraphSelected: function(graphId){
      this.selectedGraphId = graphId;
    },
    regenerate: function(){
      //JavaScriptを再生成
      this.generate(this.$refs.jsPad.graphs,this.$refs.jsPad.connections,this.javascriptSetting);
      //HTMLを再生成
      this.generate(this.$refs.htmlPad.graphs,this.$refs.htmlPad.connections,this.htmlSetting);
    },
    generate: async function (graphs,connections,generatorSetting) {

      let startGraphId = "";

      //トポロジーの設定の生成
      let topology = {
        Graphs: {},
        Connections: []
      };

      //グラフを読み込む
      for(let id in graphs){
        let graphType = graphs[id].type;

        topology.Graphs[id] = {
          Type : graphType,
          Args : {}
        }

        for(let i in graphs[id].definition.Args){
          let key = graphs[id].definition.Args[i];
          let value = graphs[id].setting[key];
          topology.Graphs[id].Args[key] = value.toString();
        }

        if(graphType === "OnClicked"){
          startGraphId = id;
        }

        if(graphType === "body"){
          startGraphId = id;
        }
      }

      //接続設定を読み込む
      for(let id in connections){
        let conn = connections[id];
        let from = conn.from;
        let to = conn.to;
        topology.Connections.push(
            from.graphId + ":" + from.nodeType + ":" + from.nodeIndex + ","
            + to.graphId + ":" + to.nodeType + ":" + to.nodeIndex);
      }

      //生成する
      let uri = 'http://localhost:80/';

      const postObj = {
        GraphTopologySetting: topology,
        GeneratorSetting: generatorSetting,
        StartGraphId: startGraphId
      };

      const method = "POST";
      const body = JSON.stringify(postObj);
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'POST, GET'
      };

      let response = await fetch(uri,{method, headers, body});

      //エラー
      if(response.status !== 200){
        let result = await response.text();
        if(generatorSetting === this.javascriptSetting){
          this.jsString = result;
        }else {
          this.htmlString = result;
        }
      }

      if(response.status === 200){
        let result = await response.json();

        if(generatorSetting === this.javascriptSetting){
          this.jsString = result.GeneratedCode;
          this.jsSyntaxString = result.SyntaxHighlight;
        }else {
          this.htmlString = result.GeneratedCode;
          this.htmlSyntaxString = result.SyntaxHighlight;
        }

        this.resultString = `<html><body>${this.htmlString}<script>`;
        this.resultString += this.jsString;
        this.resultString += "<" + "/script></body></html>";

        console.log("Result:");
        console.log(result.GeneratedCode);

        console.log("Highlight:");
        console.log(result.SyntaxHighlight);
      }

      if(startGraphId !== ""){
        this.selectedGraphId = startGraphId;
      }
    }
  }
}
</script>

<style>

body{
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.flex-column{
  display: flex;
  flex-direction: column;
}

.flex-row{
  display: flex;
  flex-direction: row;
}

.flex-1{
  flex: 1;
}

.gap-8{
  gap: 8px;
}

.no-select{
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

</style>

<style scoped>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  width: 100vw;
  height: 100vh;
}

.fixed-bottom-left{
  position: fixed;
  bottom: 16px;
  left: 16px;
}

.mybutton{
  height: 40px;
  padding:5px;
  width: 190px;
}

.background-transparent{
  background-color: transparent;
  transition: all 0.5s;
}

.hover-white:hover {
  background: rgba(255, 255, 255, 0.25);
  transition: all 0.3s;
}

.click-black:active {
  background: rgba(0, 0, 0, 0.56);
  transition: all 0.3s;
}

.button-img{
  width: 40px;
  height: 40px;
  z-index: 1000000;
}

.button-text{
  font-size: 30px ;
  color: white;
  text-align: center;
}

#tool-pad{
  position: relative;
  z-index: 10000;
}

.graph-pad{
  flex-grow: 1;
  height: 100%;
}

#result-pad{
  width: 600px;
  height: 100%;
  z-index: 10000;
}

#result-viewer{
  z-index: 10000;
}

</style>
