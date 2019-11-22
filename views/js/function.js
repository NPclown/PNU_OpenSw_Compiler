function onThemeChange() {
    var themeName = $('#theme option:selected').val();

    switch (themeName) {
        case "idea":
            editor.setOption("theme", "idea");
            break
        case "darcula":
            editor.setOption("theme", "darcula");
            break
    }
}

function onModeChange() {
    console.log("changing mode");
    var modeName = Langauge_String($('#language option:selected').val());
    switch (modeName) {
        case "C":
            editor.setValue("//gcc 5.4.0\n" +
                "\n" +
                "#include  <stdio.h>\n" +
                "\n" +
                "int main(void)\n" +
                "{\n" +
                "    printf(\"Hello, world!\\n\");\n" +
                "    return 0;\n" +
                "}")
            this.editor.setOption("mode", "text/x-csrc");
            break
        case "C(clang)":
            this.editor.setOption("mode", "text/x-csrc");
            editor.setValue("//clang 3.8.0\n" +
                "\n" +
                "#include  <stdio.h>\n" +
                "\n" +
                "int main(void)\n" +
                "{\n" +
                "    printf(\"Hello, world!\\n\");\n" +
                "    return 0;\n" +
                "}")
            break
        case "C++":
            editor.setValue("//g++  5.4.0\n" +
                "\n" +
                "#include <iostream>\n" +
                "\n" +
                "int main()\n" +
                "{\n" +
                "    std::cout << \"Hello, world!\\n\";\n" +
                "}")
            this.editor.setOption("mode", "text/x-c++src")
            break
        case "C++11":
            editor.setValue("//g++  5.4.0\n" +
                "\n" +
                "#include <iostream>\n" +
                "\n" +
                "int main()\n" +
                "{\n" +
                "    std::cout << \"Hello, world!\\n\";\n" +
                "}")
            this.editor.setOption("mode", "text/x-c++src")
            break
        case "C++(clang)":
           editor.setValue("//clang 3.8.0\n" +
                "\n" +
                "#include <iostream>\n" +
                "\n" +
                "int main()\n" +
                "{\n" +
                "    std::cout << \"Hello, world!\\n\";\n" +
                "}")
            this.editor.setOption("mode", "text/x-c++src")
            break
        case "java":
           editor.setValue("//'main' method must be in a class 'Pnutest'.\n" +
                "//Compiler version 1.8.0_111\n" +
                "\n" +
                "import java.util.*;\n" +
                "import java.lang.*;\n" +
                "\n" +
                "class Pnutest\n" +
                "{  \n" +
                "    public static void main(String args[])\n" +
                "    {\n" +
                "        System.out.println(\"Hello, World!\");\n" +
                "    }\n" +
                "}")
            this.editor.setOption("mode", "text/x-java")
            break
        case "python":
           editor.setValue("#python 2.7.12\n" +
                "\n" +
                "print \"Hello, world!\"\n"
                )
            this.editor.setOption("mode", "python")
            break
        case "python3":
           editor.setValue("#python 3.5.2\n" +
                "\n" +
                "print (\"Hello, world!\")\n"
                )
            this.editor.setOption("mode", "python")
            break
        case "bash":
           editor.setValue("#!/bin/bash\n" +
                "# GNU bash, version 4.3.46" +
                "\n" +
                "echo \"Hello, world!\";\n"
               )
            this.editor.setOption("mode", "text/x-sh")
            break
        case "perl":
           editor.setValue("#perl 5.22.1 \n" +
                "\n" +
                "print \"Hello World\";\n"
            )
            this.editor.setOption("mode", "text/x-perl")
            break
        case "nodejs":
           editor.setValue("//nodejs v4.2.6\n" +
                "\n" +
                "console.log(\"Hello, World!\");\n"
            )
            this.editor.setOption("mode", "text/javascript")
            break
        case "R":
           editor.setValue("#R version 3.3.2 \n" +
                "\n" +
                "print(\"Hello, world!\")\n"
            )
            this.editor.setOption("mode", "text/x-rsrc")
            break
        case "object-c":
           editor.setValue("//gcc 5.0.4\n" +
                "\n" +
                "#import <Foundation/Foundation.h>\n" +
                "\n" +
                "int main (void)\n" +
                "{\n" +
                "    NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];\n" +
                "    NSInteger a,b;\n" +
                "    scanf(\"%d %d\",&a,&b);\n" +
                "    printf(\"%d\",a+b);\n" +
                "    [pool drain];\n" +
                "    return 0;\n" +
                "}")
            this.editor.setOption("mode", "text/x-objectivec")
            break
        case "object-c++":
           editor.setValue("//gcc 5.0.4\n" +
                "\n" +
                "#import <Foundation/Foundation.h>\n" +
                "\n" +
                "int main (void)\n" +
                "{\n" +
                "    NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];\n" +
                "    NSInteger a,b;\n" +
                "    scanf(\"%d %d\",&a,&b);\n" +
                "    printf(\"%d\",a+b);\n" +
                "    [pool drain];\n" +
                "    return 0;\n" +
                "}")
            this.editor.setOption("mode", "text/x-objectivec")
            break
        case "csharp":
           editor.setValue("//Pnutest.Program.Main is the entry point for your code. Don't change it.\n" +
                "//Compiler version 4.0.30319.17929 for Microsoft (R) .NET Framework 4.5\n" +
                "\n" +
                "using System;\n" +
                "using System.Collections.Generic;\n" +
                "using System.Linq;\n" +
                "using System.Text.RegularExpressions;\n" +
                "\n" +
                "namespace Pnutest\n" +
                "{\n" +
                "    public class Program\n" +
                "    {\n" +
                "        public static void Main(string[] args)\n" +
                "        {\n" +
                "            //Your code goes here\n" +
                "            Console.WriteLine(\"Hello, world!\");\n" +
                "        }\n" +
                "    }\n" +
                "}")
            this.editor.setOption("mode", "text/x-csharp")
            break
    }
    $('#inputs').val("");
    $('#result').val("");
    $('#time').empty();
    console.log($("#code").val());
}

function LoginCheck() {
    if (user_id == 'undefined') {
        alert("로그인 안됨");
        return true;
    }
}

function confirmCheck() {
   var returnValue = confirm("Current changes will be lost, continue?");
   return !returnValue;
}

function Langauge_extension(lang_num){
    var Lang_Extension;
    switch (lang_num) {
        case "1":
            Lang_Extension = "sh"
            break
        case "5":
            Lang_Extension = "c"
            break
        case "6":
            Lang_Extension = "c"
            break
        case "7":
            Lang_Extension = "cpp"
            break
        case "8":
            Lang_Extension = "cpp"
            break
        case "9":
            Lang_Extension = "cpp"
            break
        case "10":
            Lang_Extension = "cs"
            break
        case "15":
            Lang_Extension = "java"
            break
        case "20":
            Lang_Extension = "js"
            break
        case "25":
            Lang_Extension = "m"
            break
        case "26":
            Lang_Extension = "mm"
            break
        case "30":
            Lang_Extension = "pl"
            break
        case "31":
            Lang_Extension = "py"
            break
        case "32":
            Lang_Extension = "py"
            break
        case "35":
            Lang_Extension = "r"
            break
    }
    return Lang_Extension;
}

function Langauge_Num(lang_ext){
    var Lang_Num;
    switch (lang_ext) {
        case "sh":
            Lang_Num = "1"
            break
        case "c":
            Lang_Num = "5"
            break
        case "cpp":
            Lang_Num = "7"
            break
        case "cs":
            Lang_Num = "10"
            break
        case "java":
            Lang_Num = "15"
            break
        case "js":
            Lang_Num = "20"
            break
        case "m":
            Lang_Num = "25"
            break
        case "mm":
            Lang_Num = "26"
            break
        case "pl":
            Lang_Num = "30"
            break
        case "py":
            Lang_Num = "31"
            break
        case "r":
            Lang_Num = "32"
            break
	default :
	    Lang_Num = "5"
    }
    return Lang_Num;
}

function Langauge_String(lang_num){
    var Lang_Name;
    switch (lang_num) {
        case "1":
            Lang_Name = "bash"
            break
        case "5":
            Lang_Name = "C"
            break
        case "6":
            Lang_Name = "C(clang)"
            break
        case "7":
            Lang_Name = "C++"
            break
        case "8":
            Lang_Name = "C++11"
            break
        case "9":
            Lang_Name = "C++(clang)"
            break
        case "10":
            Lang_Name = "csharp"
            break
        case "15":
            Lang_Name = "java"
            break
        case "20":
            Lang_Name = "nodejs"
            break
        case "25":
            Lang_Name = "object-c"
            break
        case "26":
            Lang_Name = "object-c++"
            break
        case "30":
            Lang_Name = "perl"
            break
        case "31":
            Lang_Name = "python"
            break
        case "32":
            Lang_Name = "python3"
            break
        case "35":
            Lang_Name = "R"
            break
    }
    return Lang_Name;
}
