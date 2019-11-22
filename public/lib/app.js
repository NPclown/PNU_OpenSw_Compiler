(function ($) {

    var extensionsMap = {
        ".zip": "fa-file-archive-o",
        ".gz": "fa-file-archive-o",
        ".bz2": "fa-file-archive-o",
        ".xz": "fa-file-archive-o",
        ".rar": "fa-file-archive-o",
        ".tar": "fa-file-archive-o",
        ".tgz": "fa-file-archive-o",
        ".tbz2": "fa-file-archive-o",
        ".z": "fa-file-archive-o",
        ".7z": "fa-file-archive-o",
        ".mp3": "fa-file-audio-o",
        ".cs": "fa-file-code-o",
        ".c++": "fa-file-code-o",
        ".cpp": "fa-file-code-o",
        ".js": "fa-file-code-o",
        ".xls": "fa-file-excel-o",
        ".xlsx": "fa-file-excel-o",
        ".png": "fa-file-image-o",
        ".jpg": "fa-file-image-o",
        ".jpeg": "fa-file-image-o",
        ".gif": "fa-file-image-o",
        ".mpeg": "fa-file-movie-o",
        ".pdf": "fa-file-pdf-o",
        ".ppt": "fa-file-powerpoint-o",
        ".pptx": "fa-file-powerpoint-o",
        ".txt": "fa-file-text-o",
        ".log": "fa-file-text-o",
        ".doc": "fa-file-word-o",
        ".docx": "fa-file-word-o",
    };

    function getFileIcon(ext) {
        return (ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o';
    }

    var currentPath = null;
    var options = {
        "bProcessing": true,
        "bServerSide": false,
        "bPaginate": false,
        "bAutoWidth": false,
        "sScrollY": "500px",
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            if (!aData.IsDirectory) return;
            var path = aData.Path;
            console.log("aData path is " + path)
            $(nRow).bind("click", function (e) {
                $.get('/files?path=' + path).then(function (data) {
                    table.fnClearTable();
                    table.fnAddData(data);
                    currentPath = path;
                });
                e.preventDefault();
            });
        },
        "aoColumns": [
            {
                "sTitle": "", "mData": null, "bSortable": false, "sClass": "head0", "sWidth": "55px",
                "render": function (data, type, row, meta) {
                    if (data.IsDirectory) {
                        return "<a href='#' target='_blank'>" +
                            "<i class='fa fa-folder'></i>&nbsp;" +
                            data.Name + "</a>";
                    } else {
                        let rstr = '';
                        if (data.Root) {
                            rstr = 'r=' + data.Root + '&';
                        }
                        // return "<a href='/b?" + rstr + "f=" + data.Path +
                        //        "' target='_blank'><i class='fa " +
                        //        getFileIcon(data.Ext) + "'></i>&nbsp;" +
                        //        data.Name +"</a>";
                        return "<a href='javascript:void(0)';  data-file_path='" + data.Path + "' onclick='file_select(this)'><i class='fa " +
                            getFileIcon(data.Ext) + "'></i>&nbsp;" +
                            data.Name + "</a>";
                    }
                }
            }
        ]
    };

    var table = $(".linksholder").dataTable(options);
    $('#Save_AS').click(function (event) {
        if (LoginCheck()) {
            return;
        }
        // console("submit is "+ this.name)
        event.preventDefault();
        console.log($(document.activeElement).val());
        $('#code').val(editor.getValue());
        var datastring = $("#myCode").serialize();
        $("#myCode :input").attr("disabled", true);
        var returnValue = prompt("New File Name", "");
        if (returnValue == "" || returnValue == "." || returnValue == "/" || returnValue == "null" || returnValue == null)
            return;
        console.log(returnValue);
        var path;
        var file_path;
        if (!currentPath) {
            file_path = returnValue;
            path = ""
        } else {
            file_path = currentPath + "/" + returnValue;
            path = currentPath;
        }

        console.log("called data file " + $("#code").val())
        $.ajax({
            type: "POST",
            url: "/api/save",
            data: {
                "file_name": returnValue,
                "dataString": $("#code").val()
            },
            // success 응답에 대한 콜백 함수
            success: function (data) {
                $("#myCode :input").attr("disabled", false);
                $("#title").html(returnValue);
                $.get('/files?path=' + path).then(function (data) {
                    console.log("called")
                    table.fnClearTable();
                    table.fnAddData(data);
                    currentPath = path;
                });
            },
            // error 함수에 대한 콜백 함수
            error: function (error) {
                $("#myCode :input").attr("disabled", false);
                console.log("file select error");
            }
        });
    });
    $.get('/files').then(function (data) {
        console.log("called_files")
        table.fnClearTable();
        table.fnAddData(data);
    });

    $(".up").bind("click", function (e) {
        if (!currentPath) return;

        console.log("called currentpath is " + currentPath)
        var idx = currentPath.lastIndexOf("/");
        var path = currentPath.substr(0, idx);

        $.get('/files?path=' + path).then(function (data) {
            console.log("called" + path)
            table.fnClearTable();
            table.fnAddData(data);
            currentPath = path;
        });
    });

    $(".down").bind("click", function (e) {
        var name = '_blank';
        var specs = 'menubar=no,status=no,toolbar=no,fullscreen=no,height=200,weight=200,location=no,resizable=no,scrollbars=no,titlebar=no';
        window.onmessage = function (e) {
            var dir_checker = e.data.toString().slice(0, 1);
            var returnValue = e.data.toString().slice(2);

            console.log("dir checker:" + dir_checker)
            console.log("name:" + name)

            if (returnValue == "" || returnValue == "." || returnValue == "/" || returnValue == "null" || returnValue == null)
                return;
            console.log(returnValue);
            var path;
            var file_path;
            if (!currentPath) {
                file_path = returnValue;
                path = ""
            } else {
                file_path = currentPath + "/" + returnValue;
                path = currentPath;
            }

            if (dir_checker == "d") {
                $.get('/api/down_folder?path=' + file_path).then(function (data) {
                    console.log('/api/create_file?path=' + file_path)
                    // currentPath = path;
                });
            } else {
                // $.get('/api/down_file?path=' + file_path).then(function (data) {
                //     console.log('/api/create_file?path=' + file_path)
                //     // currentPath = path;
                // });
                window.location = "/api/down_file?path=" + file_path;
            }
        };
        var newWindow = window.open("input_window", name, specs);
        newWindow.focus();
    });


    $(".add").bind("click", function (e) {
        var name = '_blank';
        var specs = 'menubar=no,status=no,toolbar=no,fullscreen=no,height=200,weight=200,location=no,resizable=no,scrollbars=no,titlebar=no';
        window.onmessage = function (e) {
            var dir_checker = e.data.toString().slice(0, 1);
            var returnValue = e.data.toString().slice(2);

            console.log("dir checker:" + dir_checker)
            console.log("name:" + name)

            if (returnValue == "" || returnValue == "." || returnValue == "/" || returnValue == "null" || returnValue == null)
                return;
            console.log(returnValue);
            var path;
            var file_path;
            if (!currentPath) {
                file_path = returnValue;
                path = ""
            } else {
                file_path = currentPath + "/" + returnValue;
                path = currentPath;
            }

            if (dir_checker == "d") {
                $.get('/api/create_folder?path=' + file_path).then(function (data) {
                    console.log('/api/create_file?path=' + file_path)
                    // currentPath = path;
                });
            } else {
                $.get('/api/create_file?path=' + file_path).then(function (data) {
                    console.log('/api/create_file?path=' + file_path)
                    // currentPath = path;
                });
            }

            $.get('/files?path=' + path).then(function (data) {
                console.log("called")
                table.fnClearTable();
                table.fnAddData(data);
                currentPath = path;
            });
        };
        var newWindow = window.open("input_window", name, specs);
        newWindow.focus();
    });

    $(".delete").bind("click", function (e) {
        var returnValue = prompt("Deletable File Name", "");
        if (returnValue == "" || returnValue == "." || returnValue == "/" || returnValue == "null" || returnValue == null)
            return;
        console.log(currentPath);
        var path;
        var file_path;
        if (!currentPath) {
            file_path = returnValue;
            path = ""
        } else {
            file_path = currentPath + "/" + returnValue;
            path = currentPath;
        }

        $.get('/api/delete_file?path=' + file_path).then(function (data) {
            console.log('/api/delete_file?path=' + data);
            // currentPath = path;
        });

        $.get('/files?path=' + path).then(function (data) {
            console.log("called")
            table.fnClearTable();
            table.fnAddData(data);
            currentPath = path;
        });
    });

})(jQuery);
