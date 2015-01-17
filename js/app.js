/**
 * Created by vik on 15/01/2015.
 */


var vik = vik || {};
vik.app = vik.app || {};
vik.ui = vik.ui || {};

vik.app = (function() {
    var module = {};
    var gcanvas = {};
    module.init = function() {
        window.addEventListener("load", vik.ui.init());
        loadContent();
        loadListeners();
    }

    function loadContent() {
        var container = $("#layout_layout2_panel_main div.w2ui-panel-content");
        var gl = GL.create({width: container.width(), height: container.height()});
        container.append(gl.canvas);
        gl.animate();
        //build the mesh
        var cube_mesh = GL.Mesh.cube({size: 10});
        var cam_pos = vec3.fromValues(100, 0, 100);
        //create basic matrices for cameras and transformation
        var persp = window.persp = mat4.create();
        var view = window.view = mat4.create();
        var mvp = window.mvp = mat4.create();
        var temp = mat4.create();
        var objects = [];

        container = $("#layout_main_layout_panel_main div.w2ui-panel-content");
        var h = container.height();
        var w = container.width();
        var html = "<canvas class='graph' width='" + w + "' height='" + h + "'></canvas>";
        container.append(html);
        var graph = new LGraph();
        gcanvas = new LGraphCanvas(container.children()[0], graph);
        gcanvas.background_image = "img/grid.png";
        gcanvas.drawBackCanvas();


        for (var x = -10; x <= 10; x++)
            for (var y = -5; y <= 5; y++)
                objects.push({ color: [0.3, 0.3, 0.3, 1.0], model: mat4.translationMatrix([x * 12, y * 12, 0]), mesh: cube_mesh });
        //set the camera perspective
        mat4.perspective(persp, 45 * DEG2RAD, gl.canvas.width / gl.canvas.height, 0.1, 1000);
        //mat4.ortho(persp, -50,50,-50,50,0,500); //ray doesnt work in perspective
        function getClosestObject(x, y) {
            var RT = new GL.Raytracer(view, persp);
            var ray = RT.getRayForPixel(x, y);
            var closest_object = null;
            var closest_t = 100000000;
            for (var i in objects) {
                var object = objects[i];
                var result = Raytracer.hitTestBox(cam_pos, ray, BBox.getMin(object.mesh.bounding), BBox.getMax(object.mesh.bounding), object.model);
                if (result && closest_t > result.t) {
                    closest_object = object;
                    closest_t = result.t;
                }
            }
            return closest_object;
        }

        gl.captureMouse();
        gl.onmousemove = function (e) {
            var object = getClosestObject(e.canvasx, gl.canvas.height - e.canvasy);
            if (object && object.color[0] != 1)
                vec3.random(object.color);
        }
        //basic phong shader
        var shader = new Shader('\
				precision highp float;\
				attribute vec3 a_vertex;\
				attribute vec3 a_normal;\
				varying vec3 v_normal;\
				uniform mat4 u_mvp;\
				uniform mat4 u_modelt;\
				void main() {\
					v_normal = (u_modelt * vec4(a_normal,1.0)).xyz;\
					gl_Position = u_mvp * vec4(a_vertex,1.0);\
				}\
				', '\
				precision highp float;\
				varying vec3 v_normal;\
				uniform vec3 u_lightvector;\
				uniform vec4 u_color;\
				void main() {\
				  vec3 N = normalize(v_normal);\
				  gl_FragColor = u_color * max(0.0, dot(u_lightvector,N));\
				}\
			');
        //generic gl flags and settings
        gl.clearColor(0.01, 0.01, 0.01, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        var modelt = mat4.create();
        //rendering loop
        gl.ondraw = function () {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            var L = vec3.normalize(vec3.create(), [1.5, 1.1, 1.4]);
            mat4.lookAt(view, cam_pos, [0, 0, 0], [0, 1, 0]);
            //create modelview and projection matrices
            for (var i in objects) {
                var model = objects[i].model;
                mat4.multiply(temp, view, model); //modelview
                mat4.multiply(mvp, persp, temp); //modelviewprojection
                //compute rotation matrix for normals
                mat4.toRotationMat4(modelt, model);
                //render mesh using the shader
                shader.uniforms({
                    u_color: objects[i].color,
                    u_lightvector: L,
                    u_modelt: modelt,
                    u_mvp: mvp
                }).draw(objects[i].mesh);
            }
        };
        //update loop
        gl.onupdate = function (dt) {
            cam_pos[0] = Math.sin(getTime() * 0.001) * 100;
        };
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
            gl.canvas.width = w;
            gl.canvas.height = h;
            gl.viewport(0, 0, w, h);
            mat4.perspective(persp, 45 * DEG2RAD, gl.canvas.width / gl.canvas.height, 0.1, 1000);
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
