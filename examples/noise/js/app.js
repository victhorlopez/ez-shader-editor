
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
                    APP.moveCamera(e.wheelDelta * 2);
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
                var assets_path = "../../assets/";
                gl.meshes["sphere"] = GL.Mesh.sphere({lat:64, long:64});
                gl.meshes["cylinder"] = GL.Mesh.cylinder();
                gl.meshes["grid"] = GL.Mesh.grid({size: 1, lines: 10});
                gl.meshes["man"] = GL.Mesh.fromURL(assets_path+"man.obj");
                gl.meshes["lee"] = GL.Mesh.fromURL(assets_path+"lee/Lee.obj");
                gl.meshes["monkey"] = GL.Mesh.fromURL(assets_path+"suzanne.obj");
                gl.meshes["water"] = GL.Mesh.plane({detail:50, xz:true});
                
                
                gl.textures["checkers"] = GL.Texture.fromURL(assets_path+"textures/checkers.gif", {filter: gl.NEAREST, wrap:gl.REPEAT});
                gl.textures["lee"] = GL.Texture.fromURL(assets_path+"lee/Lee.jpg");
                gl.textures["lee_normal"] = GL.Texture.fromURL(assets_path+"lee/Lee_normal.jpg");
                gl.textures["lee_spec"] = GL.Texture.fromURL(assets_path+"lee/Lee_spec.jpg");

            },

            createScene: function ()
            {

                APP.camera = new RD.Camera();
                APP.camera.perspective(45, gl.canvas.width / gl.canvas.height, 1, 1000);
                APP.camera.lookAt([50, 50, 50], [0, 0, 0], [0, 1, 0]);


                var createBall = function(id, shader_id , color, position, scale)
                {
                    var ball = new RD.SceneNode();
                    ball.id = id;
                    ball.shader = shader_id;
                    ball.color = color;
                    ball.mesh = "sphere";
                    //ball.setTexture("color", "checkers");
                    ball.position = position;
                    ball.scale(scale);
                    APP.scene.root.addChild(ball);

                };

                var scale = 5;
                createBall("sphere", "noise" , [0, 0, 1, 1], [3*scale, 0, 0], [scale, scale, scale]);
                createBall("sphere", "noise" , [0.2, 1, 1, 1], [0, 0, 0], [scale, scale, scale]);
                createBall("sphere", "noise" , [1, 0, 0, 1], [-3*scale, 0, 0], [scale, scale, scale]);
                createBall("sphere", "simple_phong" , [1, 1, 0, 1], [-6*scale, 0, 0], [scale, scale, scale]);


//                var plane = new RD.SceneNode();
//                plane.id = "plane";
//                plane.shader = "noise";
//                plane.color = [0.2, 1, 1, 1];
//                plane.mesh = "grid";
//                //plane.setTexture("color", "checkers");
//                scale *= 10;
//                plane.position = [0, 0, 0];
//                plane.scale([scale, scale, scale]);
//                APP.scene.root.addChild(plane);


            },
            loadShaders: function ()
            {
                var shaders_path = "../../shaders/";
                var shaders_phong = shaders_path + "phong/";
                var shaders_lee = shaders_path + "lee/";
                var shaders_noise = shaders_path + "noise/";
                APP.createShader("default", shaders_path+"default.vs", shaders_path+"default.fs");
                APP.createShader("simple_phong", shaders_phong+"simple_phong.vs", shaders_phong+"simple_phong.fs");
                APP.createShader("simple_Tphong", shaders_phong+"simple_Tphong.vs", shaders_phong+"simple_Tphong.fs");
                APP.createShader("complex_phong", shaders_phong+"complex_phong.vs", shaders_phong+"complex_phong.fs");
                APP.createShader("complex_Tphong", shaders_phong+"complex_Tphong.vs", shaders_phong+"complex_Tphong.fs");
                APP.createShader("complex_phong_ml", shaders_phong+"complex_phong_ml.vs", shaders_phong+"complex_phong_ml.fs");
                APP.createShader("complex_Tphong_ml", shaders_phong+"complex_Tphong_ml.vs", shaders_phong+"complex_Tphong_ml.fs");
                APP.createShader("water", shaders_path+"water.vs", shaders_path+"water.fs");
                APP.createShader("normal_spec_map", shaders_lee+"normal_spec_map.vs", shaders_lee+"normal_spec_map.fs");
                APP.createShader("noise", shaders_noise+"noise.vs", shaders_noise+"noise.fs");
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
                APP.camera.orbit(angle, [0.0, 1.0, 0.0]);
            },
            moveCamera: function (delta)
            {
                console.log(APP.renderer);
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
                //APP.rotateCamera(50 * APP.dt, [0, 1, 0]);


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







