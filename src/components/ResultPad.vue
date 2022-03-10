<template>
<div>
  <div id="main" class="flex-column">
    <div class="flex-1 flex-column" id="javascript">
      <div class="title">JavaScript</div>
      <iframe :srcdoc="highlightedJs"></iframe>
    </div>
    <div class="flex-1 pad-column" id="html">
      <div class="title">HTML</div>
      <iframe :srcdoc="highlightedHtml"></iframe>
    </div>
  </div>
</div>
</template>

<script>

import highlight from "@/assets/highlight.js";

export default {
  name: "ResultPad",
  props:{
    jsSyntaxString:String,
    htmlSyntaxString:String,
    highlightGraphId:String,
  },
  data() {
    return {
      highlightedJs: "",
      highlightedHtml: "",
      spanStart:"<span style='color:red;'>",
      spanEnd:"</span>",
    }
  },
  methods:{
    refreshJavascript(){
      this.highlightedJs = highlight(this.jsSyntaxString,this.highlightGraphId,this.spanStart,this.spanEnd)
          .replace(/\n/g,"<br/>");
    },
    refreshHtml(){
      let myspan = this.my_escape(this.spanStart);
      let myspan2 = this.my_escape(this.spanEnd);
      let h = highlight(this.htmlSyntaxString,this.highlightGraphId,myspan,myspan2);
      h = this.escape_html(h);
      h = this.my_deescape(h);
      h = h.replace(/\n/g,"<br/>");
      this.highlightedHtml = h;
    },
    escape_html(string) {
      if(typeof string !== 'string') {
        return string;
      }
      return string.replace(/[&'`"<>]/g, function(match) {
        return {
          '&': '&amp;',
          "'": '&#x27;',
          '`': '&#x60;',
          '"': '&quot;',
          '<': '&lt;',
          '>': '&gt;',
        }[match]
      });
    },
    my_escape(string){
      return string.replace(/[&'`"<>]/g, function(match) {
        return {
          '&': '__ESCAPE__AND__',
          "'": '__ESCAPE__PI__',
          '`': '__ESCAPE__TYON__',
          '"': '__ESCAPE__TYONTYON__',
          '<': '__ESCAPE__LT__',
          '>': '__ESCAPE__RT__',
        }[match]
      });
    },
    my_deescape: function (string) {
      return string.replace(/__ESCAPE__AND__/g, '&')
          .replace(/__ESCAPE__PI__/g, "'")
          .replace(/__ESCAPE__TYON__/g, '`')
          .replace(/__ESCAPE__TYONTYON__/g, '"')
          .replace(/__ESCAPE__LT__/g, '<')
          .replace(/__ESCAPE__RT__/g, '>');
    },
  },
  watch:{
    highlightGraphId:function(){
      this.refreshJavascript();
      this.refreshHtml();
    },
    jsSyntaxString:function(){
      this.refreshJavascript();
    },
    htmlSyntaxString:function(){
      this.refreshHtml();
    },
  },
}
</script>

<style scoped>

#main{
  width: 100%;
  height: 100%;
  border-left: black solid 1px;
  background-color: #ffffff;
}

.title{
  text-align: left;
}

iframe{
  width: 100%;
  height: 100%;
  border: black solid 1px;
}
</style>