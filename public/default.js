$(document).ready(function(){
    //code here...
    var code = $(".codemirror-textarea")[0];
    var editor = CodeMirror.fromTextArea(code, {
        lineNumbers : true,
        theme: "darcula"
    });
    editor.setOption("theme", "darcula")
    location.hash = "#darcula";
});