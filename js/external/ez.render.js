/**
 * Created by vik on 17/01/2015.
 *
 *    dependencies: gl-matrix.js, litegl.js
 */



var EZ = EZ || {};



/* consts ************/
EZ.ZERO = vec3.fromValues(0,0,0);
EZ.LEFT = vec3.fromValues(1,0,0);
EZ.UP = vec3.fromValues(0,1,0);
EZ.FRONT = vec3.fromValues(0,0,1);
EZ.WHITE = vec3.fromValues(1,1,1);
EZ.BLACK = vec3.fromValues(0,0,0);

/* Temporary containers ************/
EZ.temp_mat4 = mat4.create();
EZ.temp_vec2 = vec3.create();
EZ.temp_vec3 = vec3.create();
EZ.temp_vec4 = vec4.create();
EZ.temp_quat = quat.create();
EZ.temp_quat2 = quat.create();
EZ.temp_mat3 = mat3.create();

/* priority render values ****/

EZ.PRIORITY_BACKGROUND = 30;
EZ.PRIORITY_OPAQUE = 20;
EZ.PRIORITY_ALPHA = 10;
EZ.PRIORITY_HUD = 0;

/**
 * Created by vik on 17/01/2015.
 */



EZ.entity_count = 0;

EZ.Entity = function() {

    //ids
    this.uuid = EZ.entity_count++;
    this.name = "";
    this.type = "entity";

    // space attributes
    this.position = vec3.create();
    this.quat = quat.create();
    this.scale = vec3.fromValues(1,1,1);
    this.up = vec3.clone(EZ.UP);


    // transforms
    this.local_transform = mat4.create();
    this.global_transform = mat4.create();

    this.local_needs_update = true;
    this.global_needs_update = true;

    // tree
    this.parent = null;
    this.children = [];

    //
    this.follow = null;
};

EZ.Entity.prototype = {

    constructor: EZ.Entity,

    updateLocalMatrix: function() {
        mat4.identity(this.local_transform);
        mat4.translate(this.local_transform,this.local_transform, this.follow ? this.follow.position : this.position);
        mat4.fromQuat(EZ.temp_mat4, this.quat);
        mat4.mul(this.local_transform, this.local_transform, EZ.temp_mat4);
        mat4.scale(this.local_transform,this.local_transform, this.scale);

        this.local_needs_update = false;
        this.global_needs_update = true;
    },

    // fast to skip parent update
    updateGlobalMatrix: function(fast) {

        if(this.local_needs_update || (this.follow && this.follow.local_needs_update))
            this.updateLocalMatrix();

        if(this.parent){
            if(!fast)
                this.parent.updateGlobalMatrix();
            mat4.mul(this.global_transform, this.local_transform,this.parent.global_transform);
        }
        this.global_needs_update = false;
    },
    lookAt: function (target){
        mat4.lookAt(this.global_transform, this.position, target, this.up);
        //mat3.fromMat4(EZ.temp_mat3, this.global_transform);
        //quat.fromMat3(this.quat, EZ.temp_mat3);
        quat.fromMat4(this.quat, this.global_transform); //  quat.fromMat4 says not tested
        this.local_needs_update = true;
    },
    addChild: function(child){
        if(child.parent)
            throw ("the child "+ child.name+ " has already a parent");

        child.parent = this;
        this.children.push(child);

        child.propagate("updateGlobalMatrix", [true]);
    },
    removeChild: function(child){
        if(child.parent !== this )
            throw ("the child "+ child.name+ " has a different parent");

        child.parent = null;
        this.children[this.children.length] = child;
        for(var i = this.children.length - 1; i >= 0; i--) {
            if(this.children[i] === child) {
                this.children.splice(i, 1);
            }
        }
        this.propagate("updateGlobalMatrix", [true]);

    },
    // follows an entity with 0 offset
    followEntity: function(entity){
        this.follow = entity;
    },
    // method from rendeer
    propagate: function(method, params)
    {
        for(var i = this.children.length - 1; i >= 0; i--) {
            var e = this.children[i];
            if(!e)
                continue;
            if(e[method])
                e[method].apply(e, params);
            e.propagate(e, params);
        }
    },

    getAllChildren: function()
    {
        var r = [];
        for(var i = this.children.length - 1; i >= 0; i--) {
            var en = this.children[i];
            r[r.length] = en;
            en.getAllChildren(r);
        }
        return r;
    },

    getLeft: function(){
        return this.getGlobalVector([1,0,0]);
    },

    getUp: function(){
        return this.getGlobalVector([0,1,0]);
    },

    getFront: function(){
        return this.getGlobalVector([0,0,1]);
    },

    getGlobalVector: function(v, out){
        return vec3.transformMat4(  out || vec3.create(), v, this.global_transform );
    }

};
/**
 * Created by vik on 17/01/2015.
 */




EZ.EMesh = function (fov, aspect, near, far) {

    EZ.Entity.call( this );

    this.color = vec4.fromValues(1, 1, 1, 1);

    this.render_priority = EZ.PRIORITY_OPAQUE;

    this.shader = "";
    this.mesh = "";
    this.mesh_obj = null;
    this.textures = {};
    this.uniforms = { u_color: this.color, u_color_texture: 0 };
    this.flags = {}; // rendering flags: flip_normals , depth_test, depth_write, blend, two_sided

    this.type = "mesh";
};

EZ.EMesh.prototype = Object.create(EZ.Entity.prototype); // we inherit from Entity
EZ.EMesh.prototype.constructor = EZ.EMesh;

// from rendeer
EZ.EMesh.prototype.setTexture = function (channel, texture) {
    if (!texture)
        this.textures[channel] = null;
    else if (typeof(texture) == "string")
        this.textures[ channel ] = texture;
};

EZ.EMesh.prototype.setSkyBox = function (){
    this.flags.depth_write = false;
    this.flags.depth_test = false;
    this.render_priority = EZ.PRIORITY_BACKGROUND;
    this.flags.flip_normals = true;
};

// from rendeer
EZ.EMesh.prototype.render = function (renderer) {
    //get mesh
    if(this.mesh)
        this.mesh_obj = gl.meshes[this.mesh];

    if (!this.mesh_obj)
        return;

    //get texture
    var slot = 0;
    var texture = null;
    for (var i in this.textures) {
        var texture_name = this.textures[i];
        texture = gl.textures[ texture_name ];
        if (!texture)
            texture = gl.textures[ "white" ];
        this.uniforms["u_" + i + "_texture"] = texture.bind(slot++);
    }

    //get shader
    var shader = null;
    if (this.shader)
        shader = gl.shaders[ this.shader ];

    // use default shader
    if (!shader)
        shader = gl.shaders[ "flat" ];

    //flags
    gl.frontFace(this.flags.flip_normals ? gl.CW : gl.CCW);
    gl[ this.flags.depth_test === false ? "disable" : "enable"](gl.DEPTH_TEST);
    if (this.flags.depth_write === false)
        gl.depthMask(false);
    gl[ this.flags.two_sided === true ? "disable" : "enable"](gl.CULL_FACE);

    //blend
    if (this.flags.blend) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, this.blendMode == "additive" ? gl.ONE : gl.ONE_MINUS_SRC_ALPHA);
    }

    shader.uniforms(this.uniforms);
    shader.uniforms(renderer.uniforms);
    shader.draw(this.mesh_obj , this.flags.primitive === undefined ? gl.TRIANGLES : this.flags.primitive);

    if (this.flags.flip_normals) gl.frontFace(gl.CCW);
    if (this.flags.depth_test === false) gl.enable(gl.DEPTH_TEST);
    if (this.flags.blend) gl.disable(gl.BLEND);
    if (this.flags.two_sided) gl.disable(gl.CULL_FACE);
    if (this.flags.depth_write === false)
        gl.depthMask(true);
};
/**
 * Created by vik on 17/01/2015.
 */




EZ.EScene = function() {
    EZ.Entity.call( this );

    this.time = 0.0;

    this.type = "scene";
};

EZ.EScene.prototype = Object.create( EZ.Entity.prototype ); // we inherit from Entity
EZ.EScene.prototype.constructor = EZ.EScene;

EZ.EScene.prototype.update = function(dt) {
    this.time += dt;
};
/**
 * Created by vik on 17/01/2015.
 */



EZ.ECamera = function (fov, aspect, near, far) {

    EZ.Entity.call( this );

    this.target = vec3.create();
    // so far perspective cam, if I need ortho inhertic from this class
    this.aspect = aspect || 1.0;
    this.fov = fov || 45;
    this.near = near || 0.1;
    this.far = far || 1000;

    // matrices
    this.projection_matrix = mat4.create();
    this.view_projection = mat4.create();
    this.view = mat4.create();

    this.type = "camera";
};

EZ.ECamera.prototype = Object.create(EZ.Entity.prototype); // we inherit from Entity
EZ.ECamera.prototype.constructor = EZ.ECamera;


EZ.ECamera.prototype.updateProjectionMatrix = function () {
    mat4.invert(this.view,this.global_transform); // the view matrix is inverse of the transform
    mat4.perspective(this.projection_matrix, this.fov * DEG2RAD, this.aspect, this.near, this.far);
    mat4.mul(this.view_projection , this.projection_matrix, this.view);
};
/**
 * Created by vik on 19/01/2015.
 */




EZ.CameraController = function ( renderer ) {
    if(renderer  && !renderer.context)
        throw("CameraController can't work without the canvas");

    this.renderer = renderer;
    this.ctx = renderer.context; // ctx = context
    this.cam = null;
    this.needs_update = true;
    this.needs_rotation_update = true;

    this.radius = vec3.create();


    // controller vars
    this.scale = 1.0;
    this.zoom_speed = 1.0;

    // the scope changes if we enter through an event, thus we need the var that
    var that = this;
    this.onMouseMove = function (e) {
        if(e.dragging){
            // TBH this approach is incorrect, we are supposing that our target is in
            // the 0,0,0 , otherwise it won't work

            var delta = e.deltax > 0.1 || e.deltax < -0.1 ? -e.deltax : 0;
            if(delta){
                quat.setAxisAngle( EZ.temp_quat, [0,1,0], delta * DEG2RAD );
                that.cam.needs_local_update = true;
                that.needs_x_rot = true;
                that.needs_update = true;
            }

            // this works to set the limit in the Y axis
            var front = that.cam.getFront();
            vec3.normalize(front,front);
            var dot = vec3.dot([0,1,0],front);
            var dt = 0.01;
            var angle = e.deltay > 0.1 ? dt : e.deltay < -0.1 ? -dt : 0;
            if( dot + angle < 0.99 && dot + angle > -0.99){
                delta = e.deltay > 0.1 || e.deltay < -0.1 ? -e.deltay : 0;
                if(delta){
                    var left = that.cam.getLeft();
                    vec3.sub(left,left, that.cam.position);// -front
                    quat.setAxisAngle( EZ.temp_quat2, left, delta * DEG2RAD );
                    that.cam.needs_local_update = true;
                    that.needs_y_rot = true;
                    that.needs_update = true;
                }
            }


        }
    };

    this.onMouseDown = function (e) {

    };
    this.onMouseWheel= function (e) {
        var scale = Math.pow( 0.95, that.zoom_speed ); // each mousewheel is a 5% increment at speed 1
        if(e.deltaY < 1)
            that.scale *=0.95;
        else
            that.scale /=0.95;
        that.needs_update = true;
    };
    this.update = function (dt) {
        this.cam = this.renderer.current_cam;
        if(this.cam && this.needs_update){
            // computations for the zoom, EZ.temp_vec4 is the new radius
            vec3.sub(EZ.temp_vec4,this.cam.position, this.cam.target);// -front
            vec3.scale(EZ.temp_vec4, EZ.temp_vec4, this.scale); // scale -front

            if( this.needs_x_rot)
                vec3.transformQuat(EZ.temp_vec4, EZ.temp_vec4, EZ.temp_quat ); // rotate -front with quat
            if( this.needs_y_rot)
                vec3.transformQuat(EZ.temp_vec4, EZ.temp_vec4, EZ.temp_quat2 ); // rotate -front with quat

            vec3.add(this.cam.position,this.cam.target, EZ.temp_vec4 ); // add -front to target so it becomes our new position

            this.scale = 1.0; // reset scale
            this.cam.lookAt(this.cam.target); // set the correct lookAt of the camera
            this.needs_update = false;
            this.needs_y_rot = false;
            this.needs_x_rot = false;
        }
    };


    this.ctx.captureMouse(true);
    this.ctx.onmousewheel = this.onMouseWheel;
    this.ctx.onmousedown = this.onMouseDown;
    this.ctx.onmousemove = this.onMouseMove;

    this.ctx.captureKeys();
    this.ctx.onkeydown = function(e) {  };
};


/**
 * Created by vik on 17/01/2015.
 */





EZ.Renderer = function (options) {


    // current rendering objects
    this.current_cam = null;
    this.current_scene = null;
    this.cam_controller = null;

    // vars needed for the rendering
    this.color = [0,0,0,0];
    this.mvp_matrix = mat4.create();
    this.uniforms = {
        u_view: {},
        u_viewprojection: {},
        u_model: {},
        u_mvp: this.mvp_matrix,
    };

    // time vars
    this.now = getTime();
    this.then = this.now;
    this.dt = 0;
    this.total_time = 0;
};

EZ.Renderer.prototype = {
    constructor: EZ.Renderer,

    addMesh: function (name,mesh) {
        if(this.context != window.gl)
            this.context.makeCurrent();
        this.context.meshes[name] = mesh;
    },

    addTextureFromURL: function (name, url, callback) {
        this.context.textures[name] = GL.Texture.fromURL( url, {minFilter: gl.NEAREST}, callback, this.context);
    },
    addCubeMapFromURL: function (name, url, callback) {
        this.context.textures[name] = GL.Texture.cubemapFromURL( url, {minFilter: gl.NEAREST}, callback, this.context);
    },


    loadAssets: function () {
        var options = {lat: 128, size: 0.5};
        options["long"] = 128;
        this.addMesh("sphere", GL.Mesh.sphere(options));
        this.addMesh("cylinder", GL.Mesh.cylinder({height: 2, radius: 0.1}));
        this.addMesh("circle", GL.Mesh.circle({xz: true}));
        this.addMesh("grid", GL.Mesh.grid({size: 1, lines: 50}));
        this.addMesh("box", GL.Mesh.box({size: 1}));
        this.addMesh("plane", GL.Mesh.plane({size:1}));
        this.addMesh("monkey", GL.Mesh.fromURL("assets/meshes/suzanne.obj"));
        // useful when you don't find a texture
        gl.textures = {};
        gl.textures["notfound"] = new GL.Texture(1,1,{ filter: gl.NEAREST, pixel_data: new Uint8Array([0,0,0,255]) });
        gl.textures["white"] = new GL.Texture(1,1,{ filter: gl.NEAREST, pixel_data: new Uint8Array([255,255,255,255]) });

    },

    createCanvas: function (width, height, id) {
        this.context = GL.create({width: width, height: height});
        this.context.canvas.id = id;
        this.context.canvas.width = width;
        this.context.canvas.height = height;
        this.cam_controller = new EZ.CameraController(this);

        this.loadAssets();
        this.createShaders();
    },

    setModelMatrix: function (model, cam) {
        mat4.multiply(this.mvp_matrix, cam.view_projection, model);
    },

    setUniforms: function (cam, entity) {
        this.uniforms = {
            u_eye: cam.position,
            u_view: cam.view,
            u_viewprojection: cam.view_projection,
            u_model: entity.global_transform,
            u_mvp: this.mvp_matrix,
            u_time: this.total_time
        };
    },
    clearContext: function(){
        this.context.clearColor( this.color[0],this.color[1],this.color[2],this.color[3] );
        this.context.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    },
    update: function() {
        this.now = getTime();
        var dt = (this.now - this.then )* 0.001;
        this.total_time += dt;
        if( this.current_scene )
            this.current_scene.update(dt);
        this.cam_controller.update(dt);

    },
    // method from rendeer
    render: function (scene, camera) {
        if (!scene)
            throw("Renderer.render: scene not provided");
        if (!camera)
            throw("Renderer.render: camera not provided");

        if(this.context != window.gl)
            this.context.makeCurrent();

        this.current_cam = camera;
        this.current_scene = scene;
        // we update the different objects before rendering
        this.update();


        this.clearContext();

        //find which nodes should we render
        var entities = scene.getAllChildren();
        var en = null;
        //recompute matrices
        for(var i = entities.length - 1; i >= 0; i--) {
            en = entities[i];
            en.updateGlobalMatrix(true);
        }

        //get matrices in the camera
        camera.updateProjectionMatrix();

        // after the scene it's update sort entities by priority
        entities.sort(function(a,b) { return a.render_priority - b.render_priority; } );

        //rendering
        for(var i = entities.length - 1; i >= 0; i--) {
            en = entities[i];

            if (en.render){
                this.setModelMatrix(en.global_transform, camera);
                this.setUniforms(camera, en);
                en.render(this);
            }

        }
    },
    createShaders: function (){
        // shaders from rendeer
        var flat_shader = new GL.Shader('\
				precision highp float;\
				attribute vec3 a_vertex;\
				uniform mat4 u_mvp;\
				void main() {\
					gl_Position = u_mvp * vec4(a_vertex,1.0);\
					gl_PointSize = 5.0;\
				}\
				', '\
				precision highp float;\
				uniform vec4 u_color;\
				void main() {\
				  gl_FragColor = u_color;\
				}\
			');
        gl.shaders["flat"] = flat_shader;
        var phong_uniforms = { u_lightvector: vec3.fromValues( 1.0, 0.0, 0.0), u_lightcolor: EZ.WHITE };
        var phong_shader = new GL.Shader('\
			precision highp float;\
			attribute vec3 a_vertex;\
			attribute vec3 a_normal;\
			varying vec3 v_normal;\
			uniform mat4 u_mvp;\
			uniform mat4 u_model;\
			void main() {\
				v_normal = (u_model * vec4(a_normal,0.0)).xyz;\
				gl_Position = u_mvp * vec4(a_vertex,1.0);\
			}\
			', '\
			precision highp float;\
			varying vec3 v_normal;\
			uniform vec3 u_lightcolor;\
			uniform vec3 u_lightvector;\
			uniform vec4 u_color;\
			void main() {\
			  vec3 N = normalize(v_normal);\
			  gl_FragColor = u_color * max(0.0, dot(u_lightvector,N)) * vec4(u_lightcolor,1.0);\
			}\
		');
        gl.shaders["phong"] = phong_shader;
        gl.shaders["phong"].uniforms( phong_uniforms );

        var cubemap_shader = new Shader('\
				precision highp float;\
				attribute vec3 a_vertex;\
				attribute vec3 a_normal;\
				varying vec3 v_pos;\
				varying vec3 v_normal;\
				uniform mat4 u_mvp;\
				uniform mat4 u_model;\
				void main() {\
					v_pos = a_vertex.xyz;\
					v_normal = (u_model * vec4(a_normal,0.0)).xyz;\
					gl_Position = u_mvp * vec4(a_vertex,1.0);\
				}\
				', '\
				precision highp float;\
				varying vec3 v_normal;\
				varying vec3 v_pos;\
				uniform vec4 u_color;\
				uniform samplerCube u_cubemap_texture;\
				void main() {\
				  vec3 N = normalize(v_normal);\
				  gl_FragColor = u_color * textureCube( u_cubemap_texture, v_pos );\
				}\
			');
        gl.shaders["cubemap"] = cubemap_shader;

        var env_reflection_shader = new Shader('\
				precision highp float;\
				attribute vec3 a_vertex;\
				attribute vec3 a_normal;\
				varying vec3 v_pos;\
				varying vec3 v_normal;\
				varying vec3 v_refl;\
				uniform vec3 u_eye;\
				uniform mat4 u_mvp;\
				uniform mat4 u_model;\
				void main() {\
					v_pos = (u_model * vec4(a_vertex,1.0)).xyz;\
					v_normal = (u_model * vec4(a_normal,0.0)).xyz;\
					gl_Position = u_mvp * vec4(a_vertex,1.0);\
				    vec3 I = v_pos - u_eye;\
				    v_refl = reflect(I,v_normal);\
				}\
				', '\
				precision highp float;\
				varying vec3 v_normal;\
				varying vec3 v_pos;\
				varying vec3 v_refl;\
				uniform vec4 u_color;\
				uniform vec3 u_lightvector;\
				uniform samplerCube u_cubemap_texture;\
				void main() {\
				  vec3 N = normalize(v_normal);\
				  vec4 color = u_color * textureCube( u_cubemap_texture, v_refl);\
				  gl_FragColor = color *(0.2  +  max(0.2, dot(u_lightvector, N)));\
				}\
			');
        gl.shaders["env_reflection"] = env_reflection_shader;
        gl.shaders["env_reflection"].uniforms( phong_uniforms );

        var env_refraction_shader = new Shader('\
				precision highp float;\
				attribute vec3 a_vertex;\
				attribute vec3 a_normal;\
				varying vec3 v_pos;\
				varying vec3 v_normal;\
				uniform mat4 u_mvp;\
				uniform mat4 u_model;\
				void main() {\
					v_pos = (u_model * vec4(a_vertex,1.0)).xyz;\
					v_normal = (u_model * vec4(a_normal,0.0)).xyz;\
					gl_Position = u_mvp * vec4(a_vertex,1.0);\
				}\
				', '\
				precision highp float;\
				varying vec3 v_normal;\
				varying vec3 v_pos;\
				varying vec3 v_refr;\
				uniform vec3 u_eye;\
				uniform vec4 u_color;\
				uniform vec3 u_lightvector;\
				uniform samplerCube u_cubemap_texture;\
				void main() {\
                  vec3 N = normalize(v_normal);\
				  vec3 I = normalize(v_pos - u_eye);\
				  vec3 refr = refract(I,N, (0.666));\
				  vec4 RR_color = u_color * textureCube( u_cubemap_texture, refr);\
				  gl_FragColor = RR_color;\
				}\
			');

//        vec4 RR_color = u_color * textureCube( u_cubemap_texture, RR);\
//				  vec4 RL_color = u_color * textureCube( u_cubemap_texture, RF);\
//				  float reflectionFactor = 0.5 + 15.0 * pow(1.0 + dot(I, N), 2.0);\
//				  vec4 color = mix(RR_color, RL_color, reflectionFactor);\
        gl.shaders["env_refraction"] = env_refraction_shader;
        gl.shaders["env_refraction"].uniforms( phong_uniforms );
    },
    append: function (node) {
        node.appendChild(this.context.canvas);
    },
    resize: function (width, height) {
        if(this.context != window.gl)
            this.context.makeCurrent();
        gl.canvas.width = width;
        gl.canvas.height = height;
        gl.viewport(0, 0, width, height);
        if(this.current_cam){
            this.current_cam.aspect = gl.canvas.width / gl.canvas.height;
        }
    }

};