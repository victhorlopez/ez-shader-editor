$(document).ready(function () {
    App.init();
});


var App =
{
    scene: null,
    renderer: null,
    last: 0,
    now: 0,
    dt: 0.0,
    camera: null,
    light: null,
    canvas_controller: null,

    init: function () {
        UI.preinit();
        var container = $("#canvasarea");
        gl = GL.create({width: container.width(), height: container.parent().parent().height() - container.parent().height()});
        this.scene = new RD.Scene();
        this.renderer = new RD.Renderer(gl);
        container.append(gl.canvas);


        var container = $(".wtabcontent-Scene");
        var h = container.parent().parent().height() - container.parent().height();
        var w = container.width();
        var html = "<canvas class='graph' width='"+ w +"' height='"+ h +"'></canvas>";
        container.append(html);
        var graph = new LGraph();
        var gcanvas = new LGraphCanvas(container.children()[0], graph);
        gcanvas.background_image = "../img/grid.png";
        gcanvas.drawBackCanvas();


        // need to fix on load
        this.addExtraAssets();
        this.createScene();
        this.captureInput();

        UI.postinit();
        requestAnimationFrame(this.animate);
    },
    captureInput: function () {

        $(window).resize(this.resize.bind(this));

        gl.captureMouse(true);
        this.renderer.context.onmousewheel = function (e) {
            App.canvas_controller.onMouseEvent(e);
        };

        this.renderer.context.onmousedown = function (e) {
            App.canvas_controller.onMouseEvent(e);
        };

        this.renderer.context.onmousemove = function (e) {
            App.canvas_controller.onMouseEvent(e);
        };

        gl.captureKeys();
        this.renderer.context.onkeydown = function (e) {
            if(e.character = "d") App.renderer.toggleDebug();
        };

    },
    addExtraAssets: function () {
        var assets_path = "../old/assets/";
        gl.textures["light"] = GL.Texture.fromURL( "../img/light.png", {minFilter: gl.LINEAR_MIPMAP_LINEAR, wrap: gl.REPEAT});

        this.renderer.addMesh("sphere",GL.Mesh.sphere({lat: 64, long: 64, size:0.5}));
        this.renderer.addMesh("cylinder",GL.Mesh.cylinder({height: 2, radius:0.1}));
        this.renderer.addMesh("circle", GL.Mesh.circle({xz: true}));
        this.renderer.addMesh("grid", GL.Mesh.grid({size: 1, lines: 50}));
        this.renderer.addMesh("box", GL.Mesh.box({size: 1}));
        this.renderer.addMesh("bounding", GL.Mesh.boundingFrame({size: 1}));
        this.renderer.addMesh("monkey", GL.Mesh.fromURL(assets_path + "suzanne.obj"));
        this.renderer.addMesh("thin_plane", GL.Mesh.box({sizex: 1, sizey: 1, sizez: 0.5}));
        //this.renderer.addMesh("batman", GL.Mesh.fromURL(assets_path + "batman.obj"));




    },
    createScene: function () {

        this.camera = new RD.Camera();
        this.camera.perspective(45, gl.canvas.width / gl.canvas.height, 1, 1000);
        this.camera.lookAt([0, 5, 25], [0, 5, 0], [0, 1, 0]);
        // canvas controller needs the camera created
        this.canvas_controller = new CanvasController();

        var light = new RD.LightNode();
        light.position = [0, 5, -10];
        light.id = "light1";
        this.scene.root.addChild(light);

        light = new RD.LightNode();
        light.position = [-10, 5, 5];
        light.id = "light2";
        this.scene.root.addChild(light);


        var scale = 10;
        var grid = new RD.SceneNode();
        grid.unselectable = true;
        grid.id = "grid";
        grid.mesh = "grid";
        grid.color = [0.3, 0.3, 0.3];
        grid.primitive = gl.LINES;
        grid.position = [0, 0, 0];
        scale *= 20;
        grid.scaleFromVector([scale, scale, scale]);
        this.scene.root.addChild(grid);

        scale = 10.0;
        var ball = new RD.SceneNode();
        ball.id = "sphere";
        ball.mesh = "sphere";
        ball.shader = "phong";
        ball.color = [0.3, 0.7, 0.56];
        ball.position = [0, scale*0.5, 0];
        ball.scaleFromVector([scale, scale, scale]);
        this.scene.root.addChild(ball);



    },
    resize: function () {

        var parent = gl.canvas.parentNode;
        var w = $(parent).width();
        var h = $(parent).height();
        if (w == 0 || h == 0)
            return;
        if (w == gl.canvas.width && h == gl.canvas.height)
            return;

        gl.canvas.width = w;
        gl.canvas.height = h;
        gl.viewport(0, 0, w, h);
    },
    update: function () {
        this.scene.update(this.dt);
    },
    animate: function () {
        requestAnimationFrame(App.animate);

        App.last = App.now;
        App.now = getTime();
        App.dt = (App.now - App.last) * 0.001;
        App.renderer.render(App.scene, App.camera);
        App.update();
    }


};







