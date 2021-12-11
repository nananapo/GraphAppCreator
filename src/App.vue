<template>
  <div id="app">
    <ToolPad id="tool-pad"/>
    <div id="graph-pad">
      <div v-for="(graph,id) in graphs" :key="id">
        <Graph :graphid="id" :graphdata="graph.data" :type="graph.type" :zindex="graph.zIndex" v-on:to_front="toFront(id)" v-on:node_click="clickNode"/>
      </div>
    </div>
    <ResultPad id="result-pad" :log-string="logString" :code-string="codeString"/>
  </div>
</template>

<script>
import ToolPad from "@/components/ToolPad";
import Graph from "@/components/Graph";
import ResultPad from "@/components/ResultPad";

export default {
  name: 'App',
  components: {
    ResultPad,
    ToolPad,
    Graph
  },
  data() {
    return {
      connections : [
      ],
      graphs: {
        0: {
          type: "Updater",
          zIndex: 0,
          data: {
            inprocessnode: false,
            outprocessnodes: [{index:0,name: "Process",x:0,y:0}],
            initemnodes: [],
            outitemnodes: []
          }
        },
        1: {
          type: "DebugText",
          zIndex: 1,
          data: {
            inprocessnode: true,
            outprocessnodes: [{index:0,name: "Process",x:0,y:0}],
            initemnodes: [
              {index:0,name: "Text", type: "String",x:0,y:0}
            ],
            outitemnodes: []
          }
        },
        2: {
          type: "Value",
          zIndex: 2,
          data: {
            inprocessnode: true,
            outprocessnodes: [{index:0,name: "Process",x:0,y:0}],
            initemnodes: [],
            outitemnodes: [
              {index:0,name: "Int:2", type: "String",x:0,y:0}
            ],
            type: "Int",
            value: 2
          }
        },
        3: {
          type: "Value",
          zIndex: 3,
          data: {
            inprocessnode: true,
            outprocessnodes: [{index:0,name: "Process",x:0,y:0}],
            initemnodes: [],
            outitemnodes: [
              {index:0,name: "Int:3", type: "Int",x:0,y:0}
            ],
            type: "Int",
            value: 3
          }
        },
        4: {
          type: "AdditionOperator",
          zIndex: 4,
          data: {
            inprocessnode: true,
            outprocessnodes: [{index:0,name: "Process",x:0,y:0}],
            initemnodes: [
              {index:0,name: "Value1", type: "Int",x:0,y:0},
              {index:1,name: "Value2", type: "Int",x:0,y:0}
            ],
            outitemnodes: [
              {index:0,name: "Result", type: "Int",x:0,y:0}
            ]
          }
        }
      },
      selectedNode : null,
      logString : "",
      codeString : "('ω')"
    }
  },
  methods:{
    toFront : function (id) {
      let myZ = this.graphs[id].zIndex;
      let maxZ = myZ - 1;

      Object.keys(this.graphs).forEach(key => {
        let index = this.graphs[key].zIndex;
        if (key !== id && index > myZ) {
          index -= 1;
          this.graphs[key].zIndex = index;
          maxZ = Math.max(index, maxZ);
        }
      });

      this.graphs[id].zIndex = maxZ + 1;
      //console.log(this.graphs[id], maxZ);
    },
    clickNode : function (data){
      let graphId = data[0];
      let nodeType = data[1];
      let nodeIndex = data[2];
      if(this.selectedNode == null){
        this.selectedNode = data;
      }else{
        this.logString += "Connect : Graph["+graphId+"]["+nodeType+"]["+nodeIndex+"] & Graph["+this.selectedNode[0]+"]["+this.selectedNode[1]+"]["+this.selectedNode[2]+"]\n";
        this.connections.push(this.selectedNode[0] + ":" + this.selectedNode[1] + ":" + this.selectedNode[2] + "," + graphId + ":" + nodeType + ":" + nodeIndex);
        this.selectedNode = null;
        this.connectToServer();
      }
    },
    createXMLHttpRequest : function() {
      return new XMLHttpRequest();
    },
    connectToServer: async function (){
      let data = {
        Graphs: {},
        Connections: []
      };

      Object.keys(this.graphs).forEach(key => {
        let type = this.graphs[key].type;
        data.Graphs[key] = {
          Type:type,
          Setting:{}
        }
        switch (type) {
          case "Value":
            data.Graphs[key].Setting.Type = this.graphs[key].data.type;
            data.Graphs[key].Setting.Value = this.graphs[key].data.value.toString();
            break;
        }
      });

      this.connections.forEach(str=>{
        data.Connections.push(str);
      })

      console.log(JSON.stringify(data));

      let url = 'http://localhost:80/?t='+JSON.stringify(data);
      let request = this.createXMLHttpRequest();
      request.open("GET", url, true);
      request.send("");

      let aaa = this;

      request.onreadystatechange = function() {
        aaa.codeString = request.responseText;
      }
    }
  }
}
</script>

<style>
body{
  margin: 0;
  padding: 0;
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
  width: 0px;
  height: 100%;
  background-color: #bfbfbf;
  z-index: 10000;
}

#graph-pad{
  flex-grow: 1;
  height: 100%;
  background-color: #ecf0f1;
}

#result-pad{
  width: 400px;
  height: 100%;
  z-index: 10000;
}

</style>
