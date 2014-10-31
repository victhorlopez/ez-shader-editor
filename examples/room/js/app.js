
var APP =
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
            init: function ()
            {
                APP.gl = GL.create({width: window.innerWidth, height:window.innerHeight});
                APP.scene = new RD.Scene();
                APP.renderer = new RD.Renderer(gl);
                $("body").append(gl.canvas);
                APP.resize();
                $(window).resize(APP.resize.bind(this));


                gl.captureMouse(true);
                APP.renderer.context.onmousewheel = function (e)
                {
                    APP.moveCamera(e.wheelDelta * 10);
                };

                APP.renderer.context.onmousedown = function (e)
                {

                };

                APP.renderer.context.onmousemove = function (e)
                {
                    if (e.dragging)
                    {
                        APP.rotateCamera(e.deltax * APP.dt, [0, 1, 0]);
                    }

                };

                gl.captureKeys();
                APP.renderer.context.onkey = function (e) {
                };

                // need to fix on load
                APP.addExtraAssets();
                APP.loadShaders();
                APP.createScene();


                requestAnimationFrame(APP.animate);
            },
            addExtraAssets: function ()
            {
                var assets_path = "../../assets/room/";
                gl.meshes["room"] = GL.Mesh.fromURL(assets_path+"room.obj");
                
                
                gl.textures["room"] = GL.Texture.fromURL(assets_path+"room.jpg");
                gl.textures["concrete"] = GL.Texture.fromURL(assets_path+"concrete.jpg", {});
                gl.textures["metaldoor"] = GL.Texture.fromURL(assets_path+"metaldoor.jpg");
                gl.textures["puddle"] = GL.Texture.fromURL(assets_path+"puddle.png");
                gl.textures["blind-shadow"] = GL.Texture.fromURL(assets_path+"blind-shadow.jpg");

            },
            createScene: function ()
            {

                APP.camera = new RD.Camera();
                APP.camera.perspective(45, gl.canvas.width / gl.canvas.height, 1, 2000);
                APP.camera.lookAt([73.484786987304688, 163.37295532226562, -181.99932861328125], [101.65011596679687, -60.369964599609375, -560.88555908203125], [0, 1, 0]);

                var scale = 0.10000000149011612;
                
                var room = new RD.SceneNode();
                room.id = "room";
                room.shader = "detail_texture";
                room.mesh = "room";
                room.setTexture("ambient", "room");
                room.setTexture("detail", "concrete");
                room.position = [0 , 0, 0];
                room.scale([scale, scale, scale]);
                APP.scene.root.addChild(room);


//                var plane = new RD.SceneNode();
//                plane.id = "plane";
//                plane.shader = "water";
//                plane.color = [0.2, 1, 1, 1];
//                plane.mesh = "water";
//                plane.setTexture("color", "checkers");
//                plane.position = [0, 0, 0];
//                scale *= 200;
//                plane.scale([scale, scale, scale]);
//                APP.scene.root.addChild(plane);


            },
            loadShaders: function ()
            {
                var shaders_path = "../../shaders/";
                APP.createShader("default", shaders_path+"default.vs", shaders_path+"default.fs");
                APP.createShader("simple_phong", shaders_path+"simple_phong.vs", shaders_path+"simple_phong.fs");
                APP.createShader("simple_Tphong", shaders_path+"simple_Tphong.vs", shaders_path+"simple_Tphong.fs");
                APP.createShader("complex_phong", shaders_path+"complex_phong.vs", shaders_path+"complex_phong.fs");
                APP.createShader("complex_Tphong", shaders_path+"complex_Tphong.vs", shaders_path+"complex_Tphong.fs");
                APP.createShader("complex_phong_ml", shaders_path+"complex_phong_ml.vs", shaders_path+"complex_phong_ml.fs");
                APP.createShader("complex_Tphong_ml", shaders_path+"complex_Tphong_ml.vs", shaders_path+"complex_Tphong_ml.fs");
                APP.createShader("water", shaders_path+"water.vs", shaders_path+"water.fs");
                APP.createShader("detail_texture", shaders_path+"room/detail_texture.vs", shaders_path+"room/detail_texture.fs");
            },
            // params shader_id, vs_path, fs_path
            createShader: function (shader_id, vs_path, fs_path)
            {
                gl.shaders[shader_id] = Shader.fromURL(vs_path, fs_path);
                APP.shaders[shader_id] = gl.shaders[shader_id];
            },
            changeRenderShader: function (id)
            {
                var nodes = APP.scene._root.getAllChildren();
                for (var i = nodes.length - 1; i >= 0; i--) {
                    var node = nodes[i];
                    node.shader = id;
                }
            },
            rotateCamera: function (angle, axis)
            {
                //APP.scene.root.rotate(angle);
                APP.camera.orbit(angle, [0.0, 1.0, 0.0]);
            },
            moveCamera: function (delta)
            {
                console.log(APP.scene.root);
                APP.camera.moveLocal([0.0, 0.0, delta * APP.dt]);
            },
            resize: function ()
            {

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
                
                APP.renderer._uniforms["u_time"] = APP.scene.time;
                APP.renderer._uniforms["u_ambient"] = 0.1;
                APP.renderer._uniforms["u_eye"] = APP.camera.position;
                APP.renderer._uniforms["u_light_dir"] = [1.5, 1.1, 1.4];
                APP.renderer._uniforms["u_light_color"] = [1.0, 1.0, 1.0, 1.0];
                APP.renderer._uniforms["u_lights_dir"] = [1.5, 1.1, 1.4, 1.0,
                                                            -1.0, 0.3, 0.3, 1.0,
                                                            1.3, 0.4, -1.0, 1.0,
                                                            0.0, 0.0, 0.0, 0.0];

            },
            update: function ()
            {
                APP.scene.update(APP.dt);
                APP.setUniforms();
                //APP.rotateCamera(20 * APP.dt, [0, 1, 0]);


            },
            animate: function ()
            {
                requestAnimationFrame(APP.animate);

                APP.last = APP.now;
                APP.now = getTime();
                APP.dt = (APP.now - APP.last) * 0.001;
                APP.renderer.render(APP.scene, APP.camera);
                APP.update();
            }


        };







