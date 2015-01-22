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
    var renderer = null;
    module.init = function() {
        window.addEventListener("load", vik.ui.init());
        loadContent();
        loadListeners();
    }

    function loadContent() {

        // ez render
        var container = $("#layout_layout2_panel_main div.w2ui-panel-content");
        renderer = new EZ.Renderer();
        renderer.createCanvas(container.width(), container.height());
        renderer.append(container[0]);

        var camera = new EZ.ECamera(45, gl.canvas.width / gl.canvas.height, 1, 1000);
        camera.position = [0, 0.5, 1.8];
        camera.target = [0, 0.5, 0];
        var scene = new EZ.EScene();
        var node = new EZ.EMesh();
        node.mesh = "sphere";
        node.setTexture("cubemap","cubemap");
        node.shader = "env_reflection";
        node.position = [0, 0.5, 0];
        scene.addChild(node);

        var box = new EZ.EMesh();
        box.mesh = "box";
        box.followEntity(camera);
        box.setSkyBox();
        box.shader = "cubemap";
        box.setTexture("cubemap","cubemap");
        box.scale = [50,50,50];
        scene.addChild(box);

        scene.addChild(camera);

        node = new EZ.EMesh();
        node.mesh = "grid";
        node.flags.primitive = gl.LINES;
        node.scale = [50,50,50];
        //scene.addChild(node);


        // litegraph
        container = $("#layout_main_layout_panel_main div.w2ui-panel-content");
        var h = container.height();
        var w = container.width();
        var html = "<canvas class='graph' width='" + w + "' height='" + h + "'></canvas>";
        container.append(html);
        graph = new LGraph();
        gcanvas = new LGraphCanvas(container.children()[0], graph);
        gcanvas.background_image = "img/grid.png";
        //gcanvas.drawBackCanvas();
        var node_vec = LiteGraph.createNode("texture/UVs");
        node_vec.pos = [200,200];
        graph.add(node_vec);

        var node_tex = LiteGraph.createNode("texture/textureSample");
        node_tex.pos = [400,500];
        graph.add(node_tex);

        var node_prev = LiteGraph.createNode("texture/preview");
        node_prev.pos = [1000,100];
        graph.add(node_prev);

        var node_shader = LiteGraph.createNode("core/ShaderNode");
        node_shader.pos = [1000,600];
        graph.add(node_shader);

        node_vec.connect(0,node_tex,0 );
        node_tex.connect(1,node_shader,0 );
        node_tex.connect(0,node_prev,0 );

        function render () {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        render();

    }
    module.compile = function(){

        graph.runStep(1);
        gcanvas.draw(true,true);


    }

    module.resize = function () {
        var parent = $("#layout_main_layout_panel_main div.w2ui-panel-content");
        var w = parent.width();
        var h = parent.height();
        gcanvas.resize(w, h);

        parent = gl.canvas.parentNode;
        w = $(parent).width();
        h = $(parent).height();

        if ((w > 0 || h > 0) && (w != gl.canvas.width || h != gl.canvas.height)){
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


    }

    return module;
})();
