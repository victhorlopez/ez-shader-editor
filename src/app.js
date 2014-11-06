$(document).ready(function () {
    UI.init();
    App.init();
});


var App =
{
    scene: null,
    renderer: null,
    gl: null,
    last: 0,
    now: 0,
    dt: 0.0,
    camera: null,
    light: null,
    shaders: [],
    init: function () {
        var container = $(".wtabcontent-Editor");
        this.gl = GL.create({width: container.width(), height: container.parent().parent().height() - container.parent().height()});
        this.scene = new RD.Scene();
        this.renderer = new RD.Renderer(gl);
        container.append(gl.canvas);

        // need to fix on load
        this.addExtraAssets();
        this.createScene();
        this.captureInput();

        requestAnimationFrame(this.animate);
    },
    captureInput: function () {

        $(window).resize(this.resize.bind(this));

        gl.captureMouse(true);
        this.renderer.context.onmousewheel = function (e) {
            App.moveCamera(e.wheelDelta * App.dt * 20);
        };

        this.renderer.context.onmousedown = function (e) {

        };

        this.renderer.context.onmousemove = function (e) {
            if (e.dragging) {
                var sign = e.deltax  > 0 ? 1 : 0;
                App.rotateCamera(sign * App.dt * 100, [0, -1, 0], App.camera.position);
                sign = e.deltay  > 0 ? 1 : 0;
               // App.rotateCamera(sign * App.dt * 10, [-1, 0, 0], [0, 0, 0]);
            }

        };

        gl.captureKeys();
        this.renderer.context.onkey = function (e) {
        };

    },
    addExtraAssets: function () {
        var assets_path = "../../assets/";
        gl.meshes["sphere"] = GL.Mesh.sphere({lat: 64, long: 64});
        gl.meshes["cylinder"] = GL.Mesh.cylinder();
        //gl.meshes["monkey"] = GL.Mesh.fromURL(assets_path + "suzanne.obj");
        gl.meshes["water"] = GL.Mesh.plane({detail: 50, xz: true});
        gl.meshes["grid"] = GL.Mesh.grid({size: 1, lines: 25});

        //gl.textures["checkers"] = GL.Texture.fromURL(assets_path + "textures/checkers.gif", {filter: gl.NEAREST, wrap: gl.REPEAT});

    },
    createScene: function () {

        this.camera = new RD.Camera();
        this.camera.perspective(45, gl.canvas.width / gl.canvas.height, 1, 1000);
        this.camera.lookAt([100, 100, 100], [0, 0, 0], [0, 1, 0]);

        var scale = 10;


        var grid = new RD.SceneNode();
        grid.id = "grid";
        grid.mesh = "grid";
        grid.color = [0.3, 0.3, 0.3];
        grid.primitive = gl.LINES;
        grid.position = [0, 0, 0];
        scale *= 20;
        grid.scale([scale, scale, scale]);
        this.scene.root.addChild(grid);


    },
    rotateCamera: function (angle, axis, center) {
        this.camera.orbit(angle, axis, center);
    },
    moveCamera: function (delta) {
        console.log(this.renderer._uniforms);
        this.camera.orbitDistanceFactor(1 + delta * -0.05 * 0.1  );

    },
    resize: function () {

        var parent = gl.canvas.parentNode;
        var w = $(parent).width();
        var h = $(parent).height();
        if (w == 0 || h == 0)
            return;
        if (w == this.gl.canvas.width && h == this.gl.canvas.height)
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
        this.setUniforms();
        //this.rotateCamera(20 * this.dt, [0, 1, 0]);


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







