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
        var container = $(".wtabcontent-Scene");
        gl = GL.create({width: container.width(), height: container.parent().parent().height() - container.parent().height()});
        this.scene = new RD.Scene();
        this.renderer = new RD.Renderer(gl);
        container.append(gl.canvas);


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
        this.renderer.context.onkey = function (e) {
        };

    },
    addExtraAssets: function () {
        var assets_path = "../old/assets/";
        this.renderer.addMesh("sphere",GL.Mesh.sphere({lat: 64, long: 64, size:0.5}));
        this.renderer.addMesh("cylinder",GL.Mesh.cylinder({height: 2, radius:0.1}));
        this.renderer.addMesh("circle", GL.Mesh.circle({xz: true}));
        this.renderer.addMesh("grid", GL.Mesh.grid({size: 1, lines: 50}));
        this.renderer.addMesh("box", GL.Mesh.box({size: 1}));
        this.renderer.addMesh("bounding", GL.Mesh.boundingFrame({size: 1}));
        this.renderer.addMesh("monkey", GL.Mesh.fromURL(assets_path + "suzanne.obj"));
        //this.renderer.addMesh("batman", GL.Mesh.fromURL(assets_path + "batman.obj"));


        //gl.textures["checkers"] = GL.Texture.fromURL(assets_path + "textures/checkers.gif", {filter: gl.NEAREST, wrap: gl.REPEAT});

    },
    createScene: function () {

        this.camera = new RD.Camera();
        this.camera.perspective(45, gl.canvas.width / gl.canvas.height, 1, 1000);
        this.camera.lookAt([0, 10, 10], [0, 0, 0], [0, 1, 0]);
        // canvas controller needs the camera created
        this.canvas_controller = new CanvasController();


        var scale = 10;
        var grid = new RD.SceneNode();
        grid.unselecteble = true;
        grid.id = "grid";
        grid.mesh = "grid";
        grid.color = [0.3, 0.3, 0.3];
        grid.primitive = gl.LINES;
        grid.position = [0, 0, 0];
        scale *= 20;
        grid.scaleFromVector([scale, scale, scale]);
        this.scene.root.addChild(grid);

        scale = 1.0;
        var ball = new RD.SceneNode();
        ball.id = "sphere";
        ball.mesh = "sphere";
        ball.shader = "phong";
        ball.color = [0.3, 0.7, 0.56];
        ball.position = [0, scale*0.5, 0];
        ball.scaleFromVector([scale, scale, scale]);
        this.scene.root.addChild(ball);

        scale = 1.0;
        var cube = new RD.SceneNode();
        cube.id = "box";
        cube.mesh = "box";
        cube.shader = "phong";
        cube.color = [0.7, 0.3, 0.96];
        cube.position = [2*scale, scale*0.5, 0];
        cube.scaleFromVector([scale, scale, scale]);
        this.scene.root.addChild(cube);

        var monkey = new RD.SceneNode();
        monkey.id = "monkey";
        //monkey.mesh = "batman";
        monkey.mesh = "monkey";
        monkey.shader = "phong";
        monkey.color = [0.8, 0.2, 0.2];
        monkey.position = [-2*scale, scale, 0];
        monkey.scaleFromVector([scale, scale, scale]);
        this.scene.root.addChild(monkey);
        UI.updateSceneTreeTab();


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
    setUniforms: function () {

        this.renderer._uniforms["u_time"] = this.scene.time;
        this.renderer._uniforms["u_ambient"] = 0.1;
        this.renderer._uniforms["u_eye"] = this.camera.position;
        this.renderer._uniforms["u_light_dir"] = [1.5, 1.1, 1.4];
        this.renderer._uniforms["u_light_color"] = [1.0, 1.0, 1.0, 1.0];
        this.renderer._uniforms["u_lights_dir"] = [1.5, 1.1, 1.4, 1.0,
            -1.0, 0.3, 0.3, 1.0,
            1.3, 0.4, -1.0, 1.0,
            0.0, 0.0, 0.0, 0.0];

    },
    update: function () {
        this.scene.update(this.dt);
        //this.setUniforms();
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







