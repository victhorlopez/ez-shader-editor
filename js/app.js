/**
 * Created by vik on 15/01/2015.
 */


var vik = vik || {};
vik.app = vik.app || {};
vik.ui = vik.ui || {};

vik.app = (function () {
    var module = {};
    var gcanvas = null;
    var graph = null;
    var graph_gl = null;
    var renderer = null;
    var main_node = new EZ.EMesh();
    module.main_node = main_node;
    var node_grid = null;
    var node_box = null;
    var live_update = true;
    var textures = {};
    var scene_default_properties =  {
        // lighting options
        color: "#ffffff",
        light_dir_x: 1.0,
        light_dir_y: 1.0,
        light_dir_z: 1.0,
        light_mode:"phong",
        alpha_threshold:0.5,
        environment_name: "default"
    };
    module.scene_properties = scene_default_properties;

    var canvas2webgl = window.location.href.indexOf('?3d') > -1;
    //var url_graph = window.location.href.indexOf('?3d') > -1;

    module.CUBEMAPS_PATH = "assets/textures/cubemap/";
    module.TEXTURES_PATH = "assets/textures/texture/";




    LiteGraph.current_ctx = LiteGraph.CANVAS_2D;

    module.init = function () {
        window.addEventListener("load", vik.ui.init());
        loadContent();
        loadListeners();
        var graph = getGraphFromURL() || 'lee.json';
        module.changeGraph(graph);
    }

    module.loadTexture = function (name, url, sync_load, params) {

        sync_load.data.callbacksToComplete++;
        renderer.addTextureFromURL(name, url, params, sync_load.onComplete);


    }
    module.loadCubeMap = function (name, url, sync_load, params) {

        return renderer.addCubeMapFromURL(name, url, params);
    }
    module.setDefaultCubeMap = function (name, url, sync_load, params) {
        if(gl.textures[name]){
            gl.textures["cube_default"] = gl.textures[name];
        } else {
            gl.textures["cube_default"] = gl.textures[name] = module.loadCubeMap(name, url, null, {temp_color:[34,34,34,255], is_cross:1, minFilter: gl.LINEAR_MIPMAP_LINEAR});;
        }
    }

    module.loadTextures = function (name, url) {
        module.setDefaultCubeMap("miramar_large", module.CUBEMAPS_PATH +"miramar_large.jpg", null, {temp_color:[34,34,34,255], is_cross:1, minFilter: gl.LINEAR_MIPMAP_LINEAR});
        renderer.addMesh("torus", GL.Mesh.fromURL("assets/meshes/torus.obj"));

        // we read the list of assets and store the filename and its paths into a map
        var request = new XMLHttpRequest();
        request.open('GET', module.TEXTURES_PATH +"list.txt");
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                var txt = request.responseText.split(/\r?\n/);
                for (var i in txt) {
                    var filename = LiteGraph.removeExtension(txt[i]);
                    textures[filename] = module.TEXTURES_PATH  + txt[i];
                }
            }
        }
        request.send();
    }

    function getGraphFromURL() {
        var qs = document.location.search;
        console.log("qs "+qs);
        qs = qs.split('+').join(' ');
    
        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
    
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
    
        return params.graph;
    }

    function loadContent() {

        // ez render
        var container = $("#layout_layout2_panel_main div.w2ui-panel-content");
        renderer = new EZ.Renderer();
        var w = container.width();
        var h = container.height();
        renderer.createCanvas(w, h, "preview_canvas");
        renderer.append(container[0]);
        renderer.color = [0.2, 0.2, 0.2];

        var camera = new EZ.ECamera(45, w / h, 0.1, 1000);
        camera.position = [0, 0.5, 2];
        camera.target = [0, 0.5, 0];
        var scene = new EZ.EScene();
        main_node.mesh = "lee";
        main_node.flags.blend = false;
        main_node.shader = "phong";
        main_node.position = [0, 0.5, 0];
        main_node.render_priority = EZ.PRIORITY_ALPHA;
        scene.addChild(main_node);

        node_box = new EZ.EMesh();
        node_box.mesh = "box";
        node_box.followEntity(camera);
        node_box.setSkyBox();
        node_box.shader = "cubemap";
        node_box.setTexture("cube_default", "cube_default");
        node_box.scale = [50, 50, 50];
        scene.addChild(node_box);

        scene.addChild(camera);

        node_grid = new EZ.EMesh();
        node_grid.mesh = "grid";
        node_grid.flags.primitive = gl.LINES;
        node_grid.scale = [50, 50, 50];
        scene.addChild(node_grid);

        // litegraph
        graph = new LGraph();
        graph.scene_properties = scene_default_properties;
        module.scene_properties = graph.scene_properties;

        graph.onUpdateExecutionOrder = function () {
            module.compile(false, true);
        }

        graph.onNodeRemove = function (node) {
            vik.ui.removeNode(node);
        }


        module.changeCanvas();
        module.loadTextures();


        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        render();

    }
    function addEnvironmentGlobals(shader) {

        shader.globals["light_dir"] = {name:"u_light_dir", value: module.scene_properties , getValue:function(){return [this.value.light_dir_x,this.value.light_dir_y,this.value.light_dir_z]}};
        shader.globals["light_color"] = {name:"u_light_color", value: module.scene_properties , getValue:function(){return LiteGraph.hexToColor(this.value["color"], true)}};
        shader.globals["alpha_threshold"] = {name:"u_alpha_threshold", value: module.scene_properties , getValue:function(){return this.value.alpha_threshold}};
    }

    module.compile = function (force_compile, draw) {
        if (live_update || force_compile) {

            graph.runStep(1);

            renderer.context.makeCurrent();
            var shader = graph.shader_output;
            if (shader)
            {
                try {
                    gl.shaders["current"] = new GL.Shader(shader.vertex_code, shader.fragment_code);
                    gl.shaders["current"].globals = shader.globals;
                    addEnvironmentGlobals(shader);
                }
                catch (err) {
                    gl.shaders["current"] = gl.shaders["phong"];
                    if (LiteGraph.showcode) {
                        console.log("vertex:\n" + graph.shader_output.vertex_code + "\nfragment:\n" + graph.shader_output.fragment_code);
                        console.error(err);
                    }
                }

                var shader_textures = shader.textures;
                main_node.clearTextures();
                for (var i in shader_textures) {
                    var texture_name = shader_textures[i];
                    // we add the texture to our node
                    main_node.setTexture(texture_name, texture_name);
                }
                for (var i in shader.cubemaps) {
                    var texture_name = shader.cubemaps[i];
                    main_node.setTexture(texture_name, texture_name);
                }
                main_node.setTexture("cube_default", "cube_default");
                main_node.shader = "current";
                module.createCodeHighlighted(shader);
            }
            else
            {
                gl.shaders["current"] = gl.shaders["phong"];
            }

            if (canvas2webgl)
                graph_gl.makeCurrent(); // we change the context so stuff like downloading from the gpu in execution doesn't bug
            else
                renderer.context.makeCurrent();

            if (draw)
                gcanvas.draw(true, true);
        }
    }

    module.draw = function () {
        gcanvas.draw(true, true);
    }

    module.createCodeHighlighted = function (shader) {
        // code creation
        var code_div = $("#code");//document.getElementById("code");
        code_div.height(code_div.parent().parent().height() - 30);
        if (graph.shader_output) {
            code_div[0].innerHTML = '<div class="dg"><ul>' +
                '<li class="code-title">Vertex Code</li>' +
                '<pre><code class="glsl" id="vertex_code">' + shader.vertex_code + ' </pre></code>' +
                '<li class="code-title">Fragment Code</li>' +
                '<pre><code class="glsl" id="fragment_code">' + shader.fragment_code + '</pre></code>' +
                '</ul></div>';
            hljs.highlightBlock(document.getElementById("vertex_code"));
            hljs.highlightBlock(document.getElementById("fragment_code"));
        }
    }

    module.resize = function () {
        var parent = $("#layout_main_layout_panel_main div.w2ui-panel-content");
        var w = parent.width();
        var h = parent.height();
        gcanvas.resize(w, h);

        parent = renderer.context.canvas.parentNode;
        w = $(parent).width();
        h = $(parent).height();

        if ((w > 0 || h > 0) && (w != renderer.context.canvas.width || h != renderer.context.canvas.height)) {
            renderer.resize(w, h);
        }
        vik.ui.onResize();
    }

    module.setLiveUpdate = function (value) {
        live_update = value;
        if (live_update) module.compile();
    }

    module.changeCanvas = function () {
        var container = $("#layout_main_layout_panel_main div.w2ui-panel-content");
        $("#layout_main_layout_panel_main div.w2ui-panel-content canvas").remove();
        var h = container.height();
        var w = container.width();
        if (!graph_gl) {
            graph_gl = GL.create({width: w, height: h - 20, alpha: false});
            graph_gl.canvas.id = "graph";
        }
        if (gcanvas)
            gcanvas.stopRendering();

        if (canvas2webgl) {
            graph_gl.makeCurrent();
            graph_gl.canvas.className = "";
            container.append(gl.canvas);
            gcanvas = new LGraphCanvas(gl.canvas, graph);
        } else {
            renderer.context.makeCurrent();
            var html = "<canvas id='graph' class='graph' width='" + w + "' height='" + h + "'></canvas>";
            container.append(html);
            gcanvas = new LGraphCanvas(document.getElementById("graph"), graph);
        }
        gcanvas.background_image = "img/grid.png";

        gcanvas.onClearRect = function () {
            if (canvas2webgl) {
                gl.clearColor(0.2, 0.2, 0.2, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
        }

        gcanvas.onNodeSelected = function (node) {
            vik.ui.updateLeftPanel(node);
        }

        gcanvas.onDropFile = function (data, filename, file) {
            var ext = LGraphCanvas.getFileExtension(filename);
            if (ext == "json") {
                var obj = JSON.parse(data);
                graph.configure(obj);
                main_node.mesh = obj.mesh;
                vik.ui.reset();
            } else {
                var gl = canvas2webgl ? renderer.context : graph_gl;
                //var tex = LGraphTexture.loadTextureFromFile(data, filename, file, null, gl);
            }
        }
        module.compile(true, true);
    }

    module.changeGraph = function (graph_name) {
        function onPreConfigure(data) {
            main_node.mesh = data.mesh;
            main_node.flags = data.node_flags || main_node.flags;
            module.scene_properties = graph.scene_properties = data.scene_properties || scene_default_properties;

        }
        function onComplete(data) {
            vik.ui.reset(graph._nodes);
        }
        graph.loadFromURL("graphs/" + graph_name, onPreConfigure, onComplete);
    }

    function loadListeners() {

        window.addEventListener("contentChange", function (force_compile, draw) {
            module.compile(force_compile, draw);
        });

        window.addEventListener("graphCanvasChange", function () {
            gcanvas.draw(true, true);
        });


        w2ui['main_layout'].on('resize', function (target, data) {
            data.onComplete = function () {
                module.resize();
            }
        });
        w2ui['layout2'].on('resize', function (target, data) {
            data.onComplete = function () {
                module.resize();
            }
        });

        w2ui['layout3'].on('resize', function (target, data) {
            data.onComplete = function () {
                module.resize();
            }
        });

        var clean_graph = document.getElementById("clean_graph");
        clean_graph.addEventListener("click", function () {
            w2confirm('Are you sure you want to delete the graph?', function (btn) {
                if (btn == "Yes") {
                    graph.clear();
                    module.changeGraph("empty_graph.json");
                }
            })

        });

        var apply_button = document.getElementById("apply");
        apply_button.addEventListener("click", function () {
            module.compile(true);
        });

        var code_downloader = document.getElementById("download_code");
        code_downloader.addEventListener("click", function () {
            var json = graph.serialize();
            json.mesh = main_node.mesh;
            json.node_flags = main_node.flags;
            json.scene_properties = graph.scene_properties;
            var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
            this.href = data;
            return true;
        });

        var live_update_el = document.getElementById("live_update");
        live_update_el.addEventListener("click", function () {
            var div = this.parentNode;
            var icon = this.getElementsByTagName('i')[0];
            if (live_update) {
                div.className = div.className.replace(/pressed\b/, '');
                icon.className = icon.className.replace(/spin\b/, '');
                module.setLiveUpdate(false);

            } else {
                div.className = div.className + " pressed";
                icon.className = icon.className + "spin";
                module.setLiveUpdate(true);
            }

        });

//        var change_canvas_but = document.getElementById("change_canvas");
//        change_canvas_but.addEventListener("click", function () {
////            var div = this.parentNode;
////            if (!canvas2webgl) {
////                canvas2webgl = true;
////                this.childNodes[1].nodeValue = "WebGL";
////                LiteGraph.current_ctx = LiteGraph.CANVAS_WEBGL;
////            } else {
////                canvas2webgl = false;
////                this.childNodes[1].nodeValue = "Canvas";
////                LiteGraph.current_ctx = LiteGraph.CANVAS_2D;
////            }
////            module.changeCanvas();
//        });

        var change_layout_but = document.getElementById("change_layout");
        change_layout_but.addEventListener("click", function () {

            if (this.childNodes[1].nodeValue == "Full Screen") {
                this.childNodes[1].nodeValue = "Edit Graph";
            } else {
                this.childNodes[1].nodeValue = "Full Screen";
            }
            vik.ui.changeLayout();
        });

        var code_loader = document.getElementById("load_graph");
        code_loader.addEventListener("click", function () {

            function onComplete(list) {

                w2popup.open({
                    title: 'Load Graph',
                    body: '<div class="w2ui-inner-popup">' + list + '</div>'
                });

                var list_nodes = document.getElementById("popup-list").childNodes;
                for (var i = list_nodes.length - 1; i >= 0; --i) {
                    list_nodes[i].addEventListener("click", function () {
                        var graph_name = this.id.toLowerCase();
                        module.changeGraph(graph_name + ".json");
                        w2popup.close();

                    });
                }
            }


            var request = new XMLHttpRequest();
            request.open('GET', "graphs/list.txt");
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var txt = request.responseText.split(/\r?\n/);
                    var html = '<div class="dg"><ul id="popup-list">';
                    for (var i in txt) {
                        html += '<li class="cr function" id="' + txt[i] + '"> <span class="property-name">' + txt[i] + '</span></li>';
                    }
                    html += '</ul></div>';
                    onComplete(html);
                }
            }
            request.send();
        });

        var info_but = document.getElementById("about");
        info_but.addEventListener("click", function () {

            w2popup.load({ url: 'readme.html', showMax: true,
                width     : 800,
                height    : 600});

        });


        var mesh_buttons = document.getElementById("mesh-changer").childNodes;
        for (var i = 0; i < mesh_buttons.length; i++) {
            mesh_buttons[i].childNodes[0].addEventListener("click", function () {
                if (this.id == "grid") {
                    node_grid.visible = !node_grid.visible;
                } else if (this.id == "cubemap") {
                    node_box.visible = !node_box.visible;
                } else if (this.id != "") {
                    main_node.mesh = this.id;
                }
            });
        }

        $(".search").on("input", function () {
            var value = $(this).val().toLowerCase();
            $("#layout_layout3_panel_main #palette .property-name").each(function (index) {
                if ($(this).html().toLowerCase().indexOf(value) >= 0 || value == "") {
                    $(this).parent().parent().show();
                }
                else {
                    $(this).parent().parent().hide();
                }
            });

            $("#layout_layout3_panel_main #palette .folder ul").each(function (index) {
                $(this).show();
                if ($(this).children(':visible').length <= 1)
                    $(this).hide();
            });
        });

        var doc = document.getElementById("layout_layout2_panel_main");
        doc.ondragover = function () { this.className = 'hover'; return false; };
        doc.ondragend = function () { this.className = ''; return false; };
        doc.ondrop = function (event) {

            var file = event.dataTransfer.files[0];
            var filename = file.name;
            var reader = new FileReader();
            reader.onload = function (event) {
                //console.log(event.target);
                var data = event.target.result;
                renderer.addMesh("drop_mesh", GL.Mesh.fromData(filename, data, gl));
                main_node.mesh = "drop_mesh";
            };
            reader.readAsText(file);
            return false;
        };


    }

    return module;
})();
