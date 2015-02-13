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
    module.init = function() {
        window.addEventListener("load", vik.ui.init());
        loadContent();
        loadListeners();
    }

    module.loadTexture = function(name,url) {
        graph_gl.makeCurrent();
        graph_gl.textures[name] = GL.Texture.fromURL( url, {minFilter: gl.NEAREST});
        renderer.addTextureFromURL(name, url);


    }
    module.loadCubeMap = function(name,url) {
        graph_gl.makeCurrent();
        gl.textures[name] = GL.Texture.cubemapFromURL( url, {minFilter: gl.NEAREST});
        renderer.addCubeMapFromURL(name, url);

    }

    module.loadTextures = function(name,url) {
        module.loadTexture("ball", "assets/textures/ball.jpg");
        module.loadTexture("noise", "assets/textures/noise.png");
        module.loadCubeMap("cubemap", "assets/textures/cube2.jpg");
    }


    function loadContent() {

        // ez render
        var container = $("#layout_layout2_panel_main div.w2ui-panel-content");
        renderer = new EZ.Renderer();
        renderer.createCanvas(container.width(), container.height());
        renderer.append(container[0]);
        renderer.color = [0.2,0.2,0.2];

        var camera = new EZ.ECamera(45, renderer.context.width / renderer.context.height, 0.1, 1000);
        camera.position = [0, 0.5, 1.8];
        camera.target = [0, 0.5, 0];
        var scene = new EZ.EScene();
        main_node = new EZ.EMesh();
        main_node.mesh = "sphere";
//        main_node.setTexture("cubemap","cubemap");
//        main_node.shader = "env_reflection";
        main_node.position = [0, 0.5, 0];
        scene.addChild(main_node);
//
//        var box = new EZ.EMesh();
//        box.mesh = "box";
//        box.followEntity(camera);
//        box.setSkyBox();
//        box.shader = "cubemap";
//        box.setTexture("cubemap","cubemap");
//        box.scale = [50,50,50];
//        scene.addChild(box);

        scene.addChild(camera);

        var node = new EZ.EMesh();
        node.mesh = "grid";
        node.flags.primitive = gl.LINES;
        node.scale = [50,50,50];
        //scene.addChild(node);


        // litegraph
        container = $("#layout_main_layout_panel_main div.w2ui-panel-content");
        var h = container.height();
        var w = container.width();
//        var html = "<canvas id='graph' class='graph' width='" + w + "' height='" + h + "'></canvas>";
//        container.append(html);

        graph_gl = GL.create({width:w,height:h-20, alpha:false});
        graph_gl.makeCurrent();
        container.append(gl.canvas);
        graph_gl.canvas.id = "graph";
        graph = new LGraph();

        gcanvas = new LGraphCanvas(gl.canvas, graph, true);
        graph_gl.animate();
        graph_gl.ondraw = module.drawete.bind(gcanvas);


        gcanvas.background_image = "img/grid.png";
        gcanvas.autocompile = true;




        gcanvas.onClearRect = function(){
            if(gl != graph_gl)
                graph_gl.makeCurrent();
            gl.clearColor(0.2,0.2,0.2,1);
            gl.clear( gl.COLOR_BUFFER_BIT );
        }

        gcanvas.onNodeSelected = function(node)
        {
            vik.ui.updateLeftPanel( node );
        }
        gcanvas.onUpdate = function(node)
        {
            vik.app.compile( );
        }

        module.loadTextures();
        graph.loadFromURL("graphs/smoothstep.json", vik.app.compile);

        function render () {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        render();

    }

    module.drawete = function(){
        if(gl != graph_gl)
            graph_gl.makeCurrent();
        gl.clearColor(0.2,0.2,0.2,1);
        gl.clear( gl.COLOR_BUFFER_BIT );
        this.draw(true);
    }

    module.compile = function(){
        graph_gl.makeCurrent(); // we change the context so stuff like downloading from the gpu in execution doesn't bug
        graph.runStep(1);
        gcanvas.draw(true,true);
        renderer.context.makeCurrent();
        gl.shaders["current"] = new GL.Shader(graph.shader_output.vertex_code,graph.shader_output.fragment_code);;
        for(var i in graph.shader_textures){
            var texture_name = graph.shader_textures[i];
            main_node.setTexture(texture_name, texture_name);
        }
        main_node.shader = "current";
        var code_div = document.getElementById("code");
        if(graph.shader_output){
            code_div.innerHTML = '<div class="dg"><ul>' +
                '<li class="code-title">Vertex Code</li>' +
                '<pre><code class="glsl" id="vertex_code">'+graph.shader_output.vertex_code +' </pre></code>' +
                '<li class="code-title">Fragment Code</li>'+
                '<pre><code class="glsl" id="fragment_code">' + graph.shader_output.fragment_code +'</pre></code>' +
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
        graph_gl.makeCurrent();
        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.viewport(0, 0, w, h);

        parent = renderer.context.canvas.parentNode;
        w = $(parent).width();
        h = $(parent).height();

        if ((w > 0 || h > 0) && (w != renderer.context.canvas.width || h != renderer.context.canvas.height)){
            renderer.resize(w,h);
        }

        vik.ui.onResize();
    }

    function loadListeners(){

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
            graph.clear();
        });

        var code_downloader = document.getElementById("download_code");
        code_downloader.addEventListener("click",function(){
            var json = graph.serialize();
            var data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
            this.href = data;
            return true;
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
                        graph.loadFromURL("graphs/"+graph_name+".json", vik.app.compile);
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


    }


    return module;
})();
