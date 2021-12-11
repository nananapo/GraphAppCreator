<template>
  <div id="app">
    <ToolPad id="tool-pad" :generator-setting="javascriptSetting" v-on:onAddGraph="onAddGraph"/>
    <GraphPad id="graph-pad" ref="graphpad" :graphs="graphs" v-on:onNodeClick="onNodeClick"/>
    <ResultPad id="result-pad" :log="logString" :result="resultString" :html="htmlString" :js="jsString"/>
  </div>
</template>

<script>

import ToolPad from "@/components/ToolPad";
import GraphPad from "@/components/GraphPad";
import ResultPad from "@/components/ResultPad";

function generateUuid() {
  // https://github.com/GoogleChrome/chrome-platform-analytics/blob/master/src/internal/identifier.js
  // const FORMAT: string = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
  let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
  for (let i = 0, len = chars.length; i < len; i++) {
    switch (chars[i]) {
      case "x":
        chars[i] = Math.floor(Math.random() * 16).toString(16);
        break;
      case "y":
        chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
        break;
    }
  }
  return chars.join("");
}

export default {
  name: 'App',
  components: {
    GraphPad,
    ResultPad,
    ToolPad
  },
  data() {
    return {
      connections : [ ],
      graphs: {},
      selectedNode : null,

      javascriptSetting:{
        Graphs:{}
      },

      logString : "",
      resultString : "<h1>Test</h1>",
      htmlString : "HTML",
      jsString : "JS",
    }
  },
  mounted() {
    const jsSettingUrl = "https://raw.githubusercontent.com/myWorldHub/GeneratorSetting/main/javascript.json";
    let parent = this;
    fetch(jsSettingUrl).then(function(response) {
      return response.json();
    }).then(function(json){
      parent.javascriptSetting = json;
    });
  },
  methods:{
    getMaxZIndex : function () {
      let maxZ = -1;
      Object.keys(this.graphs).forEach(key => {
        let index = this.graphs[key].zIndex;
        maxZ = Math.max(index, maxZ);
      });
      return maxZ;
    },
    onNodeClick : function (graphId,nodeType,nodeIndex) {
      if(this.selectedNode == null){
        this.selectedNode = {
          graphId : graphId,
          nodeType : nodeType,
          nodeIndex : nodeIndex
        };
      }else{

        this.logString += "Connect Node\n"
        this.logString += this.selectedNode.graphId + "\n" + this.selectedNode.nodeType + "\n" + this.selectedNode.nodeIndex + "\n";
        this.logString += graphId + "\n" + nodeType + "\n" + nodeIndex + "\n";

        if((nodeType === 0 && this.selectedNode.nodeType === 1)
            || (nodeType === 1 && this.selectedNode.nodeType === 0)){
          this.logString +="Process\n";
          this.connections.push([
            this.selectedNode.graphId,
            this.selectedNode.nodeType,
            this.selectedNode.nodeIndex,
            graphId,
            nodeType,
            nodeIndex
          ]);
        }
        else if((nodeType === 2 && this.selectedNode.nodeType === 3)
        || (nodeType === 3 && this.selectedNode.nodeType === 2)){
          this.logString +="Item\n";
          this.connections.push([
            this.selectedNode.graphId,
            this.selectedNode.nodeType,
            this.selectedNode.nodeIndex,
            graphId,
            nodeType,
            nodeIndex
          ]);
        }else{
          this.logString +="TypeError\n";
        }

        this.selectedNode = null;
        this.generate();
      }
    },
    onAddGraph : function (type,definition){
      let pad = this.$refs.graphpad;
      let id = generateUuid();

      this.$set(this.graphs, id,  {
        type:type,
        definition:definition,
        setting:{
          x:-pad.offsetLeft + window.innerWidth/3,
          y:-pad.offsetTop + window.innerHeight/3,
          zIndex:this.getMaxZIndex() + 1
        }
      });
    },
    generate: async function (){

      let startGraphId = "";

      //トポロジーの設定の生成
      let topology = {
        Graphs: {},
        Connections: []
      };

      //グラフを読み込む
      for(let id in this.graphs){
        let graphType = this.graphs[id].type;

        topology.Graphs[id] = {
          Type : graphType,
          Args : {}
        }

        for(let key in this.graphs[id].definition.Args){
          topology.Graphs[id].Args[key] = this.graphs[id].setting[key];
        }

        if(graphType === "OnClicked"){
          startGraphId = id;
        }
      }

      //接続設定を読み込む
      for(let id in this.connections){
        let conn = this.connections[id];
        topology.Connections.push(conn[0] + ":" + conn[1] + ":" + conn[2] + "," + conn[3] + ":" + conn[4] + ":" + conn[5]);
      }

      //生成する
      let topologyString = encodeURI(JSON.stringify(topology));
      let settingString = encodeURI(JSON.stringify(this.javascriptSetting));

      let uri = 'http://localhost:80/?t=' + topologyString + "&g=" + settingString + "&s=" + startGraphId;
      console.log(uri);

      let response = await fetch(uri);
      let result = await response.text();

      console.log(result);

      this.jsString = result;
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

#tool-pad{
  width: 200px;
  height: 100%;
  z-index: 10000;
}

#graph-pad{
  flex-grow: 1;
  height: 100%;
}

#result-pad{
  width: 600px;
  height: 100%;
  z-index: 10000;
}

</style>
