/**
 * Created by vik on 15/01/2015.
 */


var vik = vik || {};
vik.app = vik.app || {};
vik.ui = vik.ui || {};

vik.app = (function() {
    var module = {};
    var gcanvas = null;
    var graph = null;
    var graph_gl = null;
    var renderer = null;
    var main_node = null;
    var node_grid = null;
    var node_box = null;
    var live_update = true;
    var canvas2webgl = window.location.href.indexOf('?3d') > -1;
    LiteGraph.current_ctx = LiteGraph.CANVAS_2D;
    module.init = function() {
        window.addEventListener("load", vik.ui.init());
        loadContent();
        loadListeners();
    }

    module.loadTexture = function(name,url, sync_load, params) {

        sync_load.data.callbacksToComplete += 2;
        graph_gl.textures[name] = GL.Texture.fromURL( url, params, sync_load.onComplete, graph_gl);

        renderer.addTextureFromURL(name, url, params, sync_load.onComplete);


    }
    module.loadCubeMap = function(name,url, sync_load, params) {

        sync_load.data.callbacksToComplete += 2;
        graph_gl.textures[name] = GL.Texture.cubemapFromURL( url, params, sync_load.onComplete, graph_gl);
        renderer.addCubeMapFromURL(name, url, params, sync_load.onComplete);

    }

    module.loadTextures = function(name,url) {

        var data =  {
            callbacksToComplete: 0,
            callbacksCompleted: 0,
            callback: module.changeGraph
        };
        var sync_load = {
            data: data,
            onComplete: function( ){
                data.callbacksCompleted++;
                if(data.callbacksCompleted == data.callbacksToComplete) {
                    data.callback("lee.json");
                }
            }
        };
//        module.loadTexture("ball", "assets/textures/texture/ball.jpg", sync_load);
//        module.loadTexture("noise", "assets/textures/texture/noise.png", sync_load);
//        module.loadTexture("NewTennisBallColor", "assets/textures/texture/NewTennisBallColor.jpg", sync_load);
//        module.loadTexture("BasketballColor", "assets/textures/texture/BasketballColor.jpg", sync_load);


        module.loadTexture("small_waves_normal", "assets/textures/texture/small_waves_normal.png", sync_load, {minFilter: gl.LINEAR});
        module.loadTexture("small_waves2_DISP", "assets/textures/texture/small_waves2_DISP.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("grass1", "assets/textures/texture/grass1.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("snow", "assets/textures/texture/snow.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("CobblesDiffuse", "assets/textures/texture/CobblesDiffuse.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("CobblesGloss", "assets/textures/texture/CobblesGloss.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("CobblesNormal", "assets/textures/texture/CobblesNormal.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("Cobbles_DISP", "assets/textures/texture/Cobbles_DISP.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("CobblesNormal_SPEC", "assets/textures/texture/Cobbles_SPEC.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("lee", "assets/textures/texture/lee.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("lee_normal", "assets/textures/texture/lee_normal.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadTexture("lee_spec", "assets/textures/texture/lee_spec.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});
        module.loadCubeMap("cube2", "assets/textures/cubemap/cube2.jpg", sync_load, {minFilter: gl.LINEAR_MIPMAP_LINEAR});


    }

//    module.loadGraph = function(graph_url) {
//
//        graph.loadFromURL(graph_url, vik.app.compile, [true,true]);
//        vik.ui.updateLeftPanel( null );
//
//    }

    function loadContent() {

        // ez render
        var container = $("#layout_layout2_panel_main div.w2ui-panel-content");
        renderer = new EZ.Renderer();
        renderer.createCanvas(container.width(), container.height(), "preview_canvas");
        renderer.append(container[0]);
        renderer.color = [0.2,0.2,0.2];

        var camera = new EZ.ECamera(45, renderer.context.width / renderer.context.height, 0.1, 1000);
        camera.position = [0,0.5, 2];
        camera.target = [0, 0.5, 0];
        var scene = new EZ.EScene();
        main_node = new EZ.EMesh();
        main_node.mesh = "lee";
//        main_node.setTexture("cubemap","cubemap");
//        main_node.shader = "env_reflection";
        main_node.position = [0, 0.5, 0];
        scene.addChild(main_node);
//
        node_box = new EZ.EMesh();
        node_box.mesh = "box";
        node_box.followEntity(camera);
        node_box.setSkyBox();
        node_box.shader = "cubemap";
        node_box.setTexture("cube2","cube2");
        node_box.scale = [50,50,50];
        scene.addChild(node_box);

        scene.addChild(camera);

        node_grid = new EZ.EMesh();
        node_grid.mesh = "grid";
        node_grid.flags.primitive = gl.LINES;
        node_grid.scale = [50,50,50];
        scene.addChild(node_grid);

        // litegraph
        graph = new LGraph();

        graph.onUpdateExecutionOrder = function() {
            module.compile(false,true);
        }


        module.changeCanvas();

        module.loadTextures();


        function render () {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        render();

    }


    module.compile = function(force_compile, draw){
        if(live_update || force_compile){
            if(canvas2webgl)
                graph_gl.makeCurrent(); // we change the context so stuff like downloading from the gpu in execution doesn't bug
            else
                renderer.context.makeCurrent();

            graph.runStep(1);
            if(draw)
                gcanvas.draw(true,true);

            renderer.context.makeCurrent();
            if(graph.shader_output){
                try {
                    gl.shaders["current"] = new GL.Shader(graph.shader_output.vertex_code,graph.shader_output.fragment_code);
                }
                catch(err) {
                    gl.shaders["current"] = gl.shaders["notfound"];
                    if(LiteGraph.showcode){
                        console.log("vertex:");
                        console.log(graph.shader_output.vertex_code);
                        console.log("fragment:");
                        console.log(graph.shader_output.fragment_code);
                        console.error(err);
                    }
                }
            } else
                gl.shaders["current"] = gl.shaders["notfound"];

            for(var i in graph.shader_textures){
                var texture_name = graph.shader_textures[i];
                main_node.setTexture(texture_name, texture_name);
            }
            main_node.shader = "current";
            var code_div =  $("#code");//document.getElementById("code");
            code_div.height(code_div.parent().height());
            if(graph.shader_output){
                code_div[0].innerHTML = '<div class="dg"><ul>' +
                    '<li class="code-title">Vertex Code</li>' +
                    '<pre><code class="glsl" id="vertex_code">'+graph.shader_output.vertex_code +' </pre></code>' +
                    '<li class="code-title">Fragment Code</li>'+
                    '<pre><code class="glsl" id="fragment_code">' + graph.shader_output.fragment_code +'</pre></code>' +
                    '</ul></div>';
                hljs.highlightBlock(document.getElementById("vertex_code"));
                hljs.highlightBlock(document.getElementById("fragment_code"));
            }
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

        if ((w > 0 || h > 0) && (w != renderer.context.canvas.width || h != renderer.context.canvas.height)){
            renderer.resize(w,h);
        }

        vik.ui.onResize();
    }

    module.setLiveUpdate = function(value){
        live_update = value;
        if(live_update) module.compile();
    }

    module.changeCanvas = function(){
        var container = $("#layout_main_layout_panel_main div.w2ui-panel-content");
        $("#layout_main_layout_panel_main div.w2ui-panel-content canvas").remove();
        var h = container.height();
        var w = container.width();
        if(!graph_gl){
            graph_gl = GL.create({width:w,height:h-20, alpha:false});
            graph_gl.canvas.id = "graph";
        }
        if(gcanvas)
            gcanvas.stopRendering();

        if(canvas2webgl){
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

        gcanvas.onClearRect = function(){
            if(canvas2webgl){
                gl.clearColor(0.2,0.2,0.2,1);
                gl.clear( gl.COLOR_BUFFER_BIT );
            }
        }

        gcanvas.onNodeSelected = function(node)
        {
            vik.ui.updateLeftPanel( node );
        }

        gcanvas.onDropFile = function(data, filename, file){
            var ext = LGraphCanvas.getFileExtension(filename);
            if(ext = "json"){
                var obj = JSON.parse(data);
                graph.configure(obj);
                main_node.mesh = obj.mesh;
            } else {
                var gl = canvas2webgl ? renderer.context : graph_gl;
                var tex = LGraphTexture.loadTextureFromFile(data, filename, file, null, gl);
            }


        }
        module.compile(true,true);


    }


    module.changeGraph = function(graph_name) {
        function onComplete(data){
            main_node.mesh = data.mesh;
            vik.ui.updateLeftPanel( null );
        }


        graph.loadFromURL("graphs/"+graph_name, onComplete);
    }

    function loadListeners(){

        window.addEventListener("contentChange",function(force_compile, draw){
           vik.app.compile(force_compile, draw);
            //console.log("content changed");
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
        clean_graph.addEventListener("click",function(){
            w2confirm('Are you sure you want to delete the graph?', function (btn) { if(btn == "Yes"){ graph.clear(); module.changeGraph("empty_graph.json"); } })

        });

        var apply_button = document.getElementById("apply");
        apply_button.addEventListener("click",function(){
            module.compile(true);
        });

        var code_downloader = document.getElementById("download_code");
        code_downloader.addEventListener("click",function(){
            var json = graph.serialize();
            json.mesh = main_node.mesh;
            var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
            this.href = data;
            return true;
        });

        var live_update_el = document.getElementById("live_update");
        live_update_el.addEventListener("click",function(){
            var div = this.parentNode;
            var icon = this.getElementsByTagName('i')[0];
            if(live_update){
                div.className = div.className.replace(/pressed\b/,'');
                icon.className = icon.className.replace(/spin\b/,'');
                module.setLiveUpdate(false);

            } else{
                div.className = div.className +" pressed";
                icon.className = icon.className +"spin";
                module.setLiveUpdate(true);
            }

        });

        var change_canvas_but = document.getElementById("change_canvas");
        change_canvas_but.addEventListener("click",function(){
            var div = this.parentNode;
            if(!canvas2webgl){
                canvas2webgl = true;
                this.childNodes[1].nodeValue = "WebGL";
                LiteGraph.current_ctx = LiteGraph.CANVAS_WEBGL;
            } else {
                canvas2webgl = false;
                this.childNodes[1].nodeValue = "Canvas";
                LiteGraph.current_ctx = LiteGraph.CANVAS_2D;
            }

            module.changeCanvas();

        });




        var code_loader = document.getElementById("load_graph");
        code_loader.addEventListener("click",function(){

            function onComplete(list){

                w2popup.open({
                    title: 'Load Graph',
                    body: '<div class="w2ui-inner-popup">'+list+'</div>'
                });

                var list_nodes = document.getElementById("popup-list").childNodes;
                for(var i = list_nodes.length - 1; i>= 0; --i){
                    list_nodes[i].addEventListener("click",function(){
                        var graph_name = this.id.toLowerCase();
                        module.changeGraph(graph_name+".json");
                        w2popup.close();

                    });
                }
            }
            var request = new XMLHttpRequest();
            request.open('GET',"graphs/list.txt");
            request.onreadystatechange = function() {
                if (request.readyState==4 && request.status==200) {
                    var txt = request.responseText.split(/\r?\n/);
                    var html = '<div class="dg"><ul id="popup-list">';
                    for (var i in txt) {
                        html += '<li class="cr function" id="'+ txt[i] +'"> <span class="property-name">' + txt[i] + '</span></li>';
                    }
                    html += '</ul></div>';
                    onComplete(html);
                }
            }
            request.send();
        });


        var mesh_buttons = document.getElementById("mesh-changer").childNodes;
        for (var i = 0; i < mesh_buttons.length ; i++) {
            mesh_buttons[i].childNodes[0].addEventListener("click",function(){
                if(this.id == "grid"){
                    node_grid.visible = !node_grid.visible;
                } else if(this.id == "cubemap"){
                    node_box.visible = !node_box.visible;
                } else if(this.id != ""){
                    main_node.mesh = this.id;
                }
            });
        }


        $(".search").on("input", function() {
            var value = $(this).val().toLowerCase();
            $("#layout_layout3_panel_main .property-name").each(function (index) {
                if ($(this).html().toLowerCase().indexOf(value) >= 0 || value == "") {
                    $(this).parent().parent().show();
                }
                else {
                    $(this).parent().parent().hide();
                }
            });

            $("#layout_layout3_panel_main .folder ul").each(function (index) {
                $(this).show();
                if($(this).children(':visible').length <= 1)
                    $(this).hide();
            });
        });

    }
    return module;
})();
