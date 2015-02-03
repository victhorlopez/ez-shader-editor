/**
 * Created by vik on 21/01/2015.
 */


function LGraphShader()
{

    this.addInput("Base color","vec4");
    //inputs: ["base color","metallic", "specular", "roughness", "emissive color", "opacity", "opacitiy mask", "normal", "world position offset", "world displacement", "tesselation multiplier", "subsurface color", "ambient occlusion", "refraction"],
    this.properties = { value:1.0 };
    this.editable = { property:"value", type:"number" };
    this.size = [200,200];
    this.shader_piece = ShaderConstructor;
}

LGraphShader.title = "ShaderMain";
LGraphShader.desc = "Shader Main Node";


LGraphShader.prototype.setValue = function(v)
{

};

LGraphShader.prototype.onExecute = function()
{
    this.processInputCode();

}

LGraphShader.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    //this.outputs[0].label = this.properties["value"].toFixed(3);
}

LGraphShader.prototype.onWidget = function(e,widget)
{

}


LGraphShader.prototype.processInputCode = function() {

    var input_code = this.getInputCode(0); // 0 it's the color

    var shader = this.shader_piece.createShader(input_code, "");
    this.graph.shader_output = shader;
    var texture_nodes = this.graph.findNodesByType("texture/textureSample");// we need to find all the textures used in the graph
    this.graph.shader_textures = [];
    // we set all the names in one array
    // useful to render nodes
    for(var i = 0; i < texture_nodes.length; ++i){
        this.graph.shader_textures.push(texture_nodes[i].properties.name);
    }
}



LiteGraph.registerNodeType("core/ShaderNode",LGraphShader);
//UVS
function LGraphCamToPixelWS()
{
    this.addOutput("Camera To Pixel","vec3");


    this.shader_piece = PCameraToPixelWS; // hardcoded for testing
}

LGraphCamToPixelWS.title = "CameraToPixelWS";
LGraphCamToPixelWS.desc = "The vector from camera to pixel";

LGraphCamToPixelWS.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode(); // I need to check texture id
}


LiteGraph.registerNodeType("texture/CameraToPixelWS", LGraphCamToPixelWS);



//Constant
function LGraphConstant()
{
    this.addOutput("value","number", {number:1});
    this.properties = { value:1.0 };
    this.editable = { property:"value", type:"number" };

    this.shader_piece = new PConstant("float"); // hardcoded for testing
}

LGraphConstant.title = "Number";
LGraphConstant.desc = "Constant value";


LGraphConstant.prototype.setValue = function(v)
{
    if( typeof(v) == "string") v = parseFloat(v);
    this.properties["value"] = v;
    this.setDirtyCanvas(true);
};

LGraphConstant.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode("float_"+this.id, this.properties["value"], PConstant.FRAGMENT); // need to check scope

    this.setOutputData(0, parseFloat( this.properties["value"] ) );
}

LGraphConstant.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.properties["value"].toFixed(3);
}

LGraphConstant.prototype.onWidget = function(e,widget)
{
    if(widget.name == "value")
        this.setValue(widget.value);
}

LiteGraph.registerNodeType("constants/Number", LGraphConstant);


//Constant
function LGraphConstVec2()
{
    this.addOutput("value","vec2", {vec2:1});
    this.properties = { v1:1.0,
                        v2:1.0 };
    //this.editable = { property:"value", type:"vec2" };

    this.shader_piece = new PConstant("vec2"); // hardcoded for testing
}

LGraphConstVec2.title = "ConstVec2";
LGraphConstVec2.desc = "Constant vector2";


LGraphConstVec2.prototype.setFloatValue = function(old_value,new_value) {
    if( typeof(new_value) == "string") new_value = parseFloat(new_value);
    old_value = new_value;
}

LGraphConstVec2.prototype.setValue = function(v1,v2)
{
    this.setFloatValue(this.properties["v1"],v1);
    this.setFloatValue(this.properties["v2"],v2);
    this.setDirtyCanvas(true);
};

LGraphConstVec2.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode("vec2_"+this.id, this.valueToString(), PConstant.FRAGMENT); // need to check scope
}

LGraphConstVec2.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.valueToString();
}

LGraphConstVec2.prototype.valueToString = function()
{
    return "vec2("+this.properties["v1"]+","+this.properties["v2"]+")";
}

LiteGraph.registerNodeType("constants/ConstVec2", LGraphConstVec2);


//Constant
function LGraphConstVec3()
{
    this.addOutput("value","vec3", {vec3:1});
    this.properties = { value:"1.0,1.0,1.0" };
    this.editable = { property:"value", type:"vec3" };

    this.shader_piece = new PConstant("vec3"); // hardcoded for testing
}

LGraphConstVec3.title = "ConstVec3";
LGraphConstVec3.desc = "Constant vector3";


LGraphConstVec3.prototype.setValue = function(v1,v2,v3)
{
    if( typeof(v) == "string") v = parseFloat(v);
    this.properties["value"] = v;
    this.setDirtyCanvas(true);
};

LGraphConstVec3.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode("vec3_"+this.id, "vec3("+this.properties["value"]+")", PConstant.FRAGMENT); // need to check scope
}

LGraphConstVec3.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.properties["value"];
}


LiteGraph.registerNodeType("constants/ConstVec3", LGraphConstVec3);


//Constant
function LGraphConstVec4()
{
    this.addOutput("value","vec4", {vec4:1});
    this.properties = { value:"1.0,1.0,1.0,1.0" };
    this.editable = { property:"value", type:"vec4" };

    this.shader_piece = new PConstant("vec4"); // hardcoded for testing
}

LGraphConstVec4.title = "ConstVec4";
LGraphConstVec4.desc = "Constant vector4";


LGraphConstVec4.prototype.setValue = function(v1,v2,v3,v4)
{
    if( typeof(v1) == "string") v1 = parseFloat(v1);
    this.properties["value"] = v1;
    this.setDirtyCanvas(true);
};

LGraphConstVec4.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode("vec4_"+this.id, "vec4("+this.properties["value"]+")", PConstant.FRAGMENT); // need to check scope
}

LGraphConstVec4.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.properties["value"];
}


LiteGraph.registerNodeType("constants/ConstVec4", LGraphConstVec4);


function LGraphMixer()
{
    this.addOutput("Result","vec4",{vec4:1, vec3:1});
    this.addInput("A","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("B","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("alpha","float", {float:1});

    this.shader_piece = PMixer; // hardcoded for testing
}

LGraphMixer.title = "Lerp";
LGraphMixer.desc = "Lerp between A and B";

LGraphMixer.prototype.onExecute = function()
{
    this.processInputCode();

}

LGraphMixer.prototype.processInputCode = function()
{

    var input_codes_l1 = this.getInputCode(0);
    var input_codes_l2 = this.getInputCode(1);
    var input_codes_l2 = this.getInputCode(1);

    this.codes = this.shader_piece.getCode( "mixed_"+this.id, input_codes_l1[1].getOutputVar(), input_codes_l2[1].getOutputVar(), "0.5"); // output var must be fragment

    this.codes[0].merge(input_codes_l1[0]);
    this.codes[1].merge(input_codes_l1[1]);
    this.codes[0].merge(input_codes_l2[0]);
    this.codes[1].merge(input_codes_l2[1]);

}


LiteGraph.registerNodeType("texture/Lerp", LGraphMixer );


function LGraphOperation()
{
    this.addOutput("Result","vec4",{vec4:1, vec3:1});
    this.addInput("A","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("B","vec3", {vec4:1, vec3:1, float:1});

    this.shader_piece = POperation; // hardcoded for testing
}

LGraphOperation.title = "operation";
LGraphOperation.desc = "operation between A and B";

LGraphOperation.prototype.onExecute = function()
{

    this.processInputCode();

}

LGraphOperation.prototype.processInputCode = function()
{

    var input_codes_l1 = this.getInputCode(0);
    var input_codes_l2 = this.getInputCode(1);

    this.codes = this.shader_piece.getCode( "result_"+this.id, "+",  input_codes_l1[1].getOutputVar(), input_codes_l2[1].getOutputVar()); // output var must be fragment

    this.codes[0].merge(input_codes_l1[0]);
    this.codes[1].merge(input_codes_l1[1]);
    this.codes[0].merge(input_codes_l2[0]);
    this.codes[1].merge(input_codes_l2[1]);

}


LiteGraph.registerNodeType("texture/Operation", LGraphOperation );

//UVS
function LGraphPixelNormalWS()
{
    this.addOutput("Pixel Normal","vec3");


    this.shader_piece = PPixelNormalWS; // hardcoded for testing
}

LGraphPixelNormalWS.title = "PixelNormalWS";
LGraphPixelNormalWS.desc = "The normal in world coordinates";

LGraphPixelNormalWS.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode(); // I need to check texture id
}


LiteGraph.registerNodeType("texture/PixelNormalWS", LGraphPixelNormalWS);


//**************************
function LGraphTexturePreview()
{
    this.addInput("Texture","Texture", {Texture:1, Vec3:1, Vec4:1});
    this.properties = { flipY: false };
    this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];
}

LGraphTexturePreview.title = "Preview";
LGraphTexturePreview.desc = "Show a texture in the graph canvas";

LGraphTexturePreview.prototype.onDrawBackground = function(ctx)
{
    if(this.flags.collapsed) return;

    var tex = this.getInputData(0);
    if(!tex) return;

    var tex_canvas = null;

    if(!tex.handle && ctx.webgl)
        tex_canvas = tex;
    else
        tex_canvas = LGraphTexture.generateLowResTexturePreview(tex);

    //render to graph canvas
    ctx.save();
    if(this.properties.flipY)
    {
        ctx.translate(0,this.size[1]);
        ctx.scale(1,-1);
    }
    ctx.drawImage(tex_canvas,0 + LiteGraph.NODE_COLLAPSED_RADIUS * 0.5,0 + LiteGraph.NODE_COLLAPSED_RADIUS * 0.5,this.size[0] - LiteGraph.NODE_COLLAPSED_RADIUS,this.size[1]- LiteGraph.NODE_COLLAPSED_RADIUS);
    ctx.restore();
}

LiteGraph.registerNodeType("texture/preview", LGraphTexturePreview );
window.LGraphTexturePreview = LGraphTexturePreview;
//UVS
function LGraphReflect()
{
    this.addOutput("reflect vector","vec3");
    this.addInput("normal","vec3");
    this.addInput("vector","vec3");

    this.shader_piece = PReflect; // hardcoded for testing
}

LGraphReflect.title = "ReflectVector";
LGraphReflect.desc = "To reflect a vector3";


LGraphReflect.prototype.onExecute = function()
{
    this.processInputCode();
}


LGraphReflect.prototype.processInputCode = function()
{

    var in_codes_normal = this.getInputCode(0); // normal
    var in_codes_incident = this.getInputCode(1); // inident vector

    // (output, incident, normal)
    this.codes = this.shader_piece.getCode("reflect_"+this.id, in_codes_incident[1].getOutputVar(), in_codes_normal[1].getOutputVar()); // output var must be fragment

    this.codes[0].merge(in_codes_normal[0]);
    this.codes[1].merge(in_codes_normal[1]);
    this.codes[0].merge(in_codes_incident[0]);
    this.codes[1].merge(in_codes_incident[1]);

}

LiteGraph.registerNodeType("texture/reflect", LGraphReflect);


function LGraphTexture()
{
    this.addOutput("Texture","Texture",{Texture:1});
    this.addOutput("Color","vec4", {vec3:1, vec4:1});
    this.addOutput("R","R");
    this.addOutput("G","G");
    this.addOutput("B","B");
    this.addOutput("A","A");
    this.addInput("UVs","vec2");
    this.properties = {name:""};
    this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];

    this.shader_piece = PTextureSample; // hardcoded for testing

    // default texture
    if(typeof(gl) != "undefined" && gl.textures["default"]){
        this.properties.name = "default";
        this._drop_texture = gl.textures["default"];
    }
}

LGraphTexture.title = "textureSample";
LGraphTexture.desc = "textureSample";
LGraphTexture.widgets_info = {"name": { widget:"texture"} };

//REPLACE THIS TO INTEGRATE WITH YOUR FRAMEWORK
LGraphTexture.textures_container = {}; //where to seek for the textures, if not specified it uses gl.textures
LGraphTexture.loadTextureCallback = null; //function in charge of loading textures when not present in the container
LGraphTexture.image_preview_size = 256;

//flags to choose output texture type
LGraphTexture.PASS_THROUGH = 1; //do not apply FX
LGraphTexture.COPY = 2;			//create new texture with the same properties as the origin texture
LGraphTexture.LOW = 3;			//create new texture with low precision (byte)
LGraphTexture.HIGH = 4;			//create new texture with high precision (half-float)
LGraphTexture.REUSE = 5;		//reuse input texture
LGraphTexture.DEFAULT = 2;

LGraphTexture.MODE_VALUES = {
    "pass through": LGraphTexture.PASS_THROUGH,
    "copy": LGraphTexture.COPY,
    "low": LGraphTexture.LOW,
    "high": LGraphTexture.HIGH,
    "reuse": LGraphTexture.REUSE,
    "default": LGraphTexture.DEFAULT
};

LGraphTexture.getTexture = function(name)
{
    var container = LGraphTexture.textures_container || gl.textures;

    if(!container)
        throw("Cannot load texture, container of textures not found");

    var tex = container[ name ];
    if(!tex && name && name[0] != ":")
    {
        //texture must be loaded
        if(LGraphTexture.loadTextureCallback)
        {
            var loader = LGraphTexture.loadTextureCallback;
            if(loader)
                loader( name );
            return null;
        }
        else
        {
            var url = name;
            if(url.substr(0,7) == "http://")
            {
                if(LiteGraph.proxy) //proxy external files
                    url = LiteGraph.proxy + url.substr(7);
            }
            tex = container[ name ] = GL.Texture.fromURL(url, {});
        }
    }

    return tex;
}

//used to compute the appropiate output texture
LGraphTexture.getTargetTexture = function( origin, target, mode )
{
    if(!origin)
        throw("LGraphTexture.getTargetTexture expects a reference texture");

    var tex_type = null;

    switch(mode)
    {
        case LGraphTexture.LOW: tex_type = gl.UNSIGNED_BYTE; break;
        case LGraphTexture.HIGH: tex_type = gl.HIGH_PRECISION_FORMAT; break;
        case LGraphTexture.REUSE: return origin;
        case LGraphTexture.COPY:
        default: tex_type = origin ? origin.type : gl.UNSIGNED_BYTE; break;
    }

    if(!target || target.width != origin.width || target.height != origin.height || target.type != tex_type )
        target = new GL.Texture( origin.width, origin.height, { type: tex_type, format: gl.RGBA, filter: gl.LINEAR });

    return target;
}

LGraphTexture.getNoiseTexture = function()
{
    if(this._noise_texture)
        return this._noise_texture;

    var noise = new Uint8Array(512*512*4);
    for(var i = 0; i < 512*512*4; ++i)
        noise[i] = Math.random() * 255;

    var texture = GL.Texture.fromMemory(512,512,noise,{ format: gl.RGBA, wrap: gl.REPEAT, filter: gl.NEAREST });
    this._noise_texture = texture;
    return texture;
}

LGraphTexture.prototype.onDropFile = function(data, filename, file)
{
    console.log([data, filename, file]);
    if(!data)
    {
        this._drop_texture = null;
        this.properties.name = "";
    }
    else
    {
        var texture = null;
        var no_ext_name = filename.split('.')[0];
        if( typeof(data) == "string" )
            gl.textures[no_ext_name] = texture = GL.Texture.fromURL( data );
        else if( filename.toLowerCase().indexOf(".dds") != -1 )
            texture = GL.Texture.fromDDSInMemory(data);
        else
        {
            var blob = new Blob([file]);
            var url = URL.createObjectURL(blob);
            texture = GL.Texture.fromURL( url );
        }

        this._drop_texture = texture;
        this.properties.name = no_ext_name;
    }
}

LGraphTexture.prototype.getExtraMenuOptions = function(graphcanvas)
{
    var that = this;
    if(!this._drop_texture)
        return;
    return [ {content:"Clear", callback:
        function() {
            that._drop_texture = null;
            that.properties.name = "";
        }
    }];
}

LGraphTexture.prototype.onExecute = function()
{
    this.processInputCode();

    if(this._drop_texture)
    {
        this.setOutputData(0, this._drop_texture);
        return;
    }

    if(!this.properties.name)
        return;

    var tex = LGraphTexture.getTexture( this.properties.name );
    if(!tex)
        return;

    this._last_tex = tex;
    this.setOutputData(0, tex);
}

LGraphTexture.prototype.onDrawBackground = function(ctx)
{
    if( this.flags.collapsed || this.size[1] <= 20 )
        return;

    if( this._drop_texture && ctx.webgl )
    {
        ctx.drawImage( this._drop_texture, 0,0,this.size[0],this.size[1]);
        //this._drop_texture.renderQuad(this.pos[0],this.pos[1],this.size[0],this.size[1]);
        return;
    }


    //Different texture? then get it from the GPU
    if(this._last_preview_tex != this._last_tex)
    {
        if(ctx.webgl)
        {
            this._canvas = this._last_tex;
        }
        else
        {
            var tex_canvas = LGraphTexture.generateLowResTexturePreview(this._last_tex);
            if(!tex_canvas)
                return;

            this._last_preview_tex = this._last_tex;
            this._canvas = cloneCanvas(tex_canvas);
        }
    }

    if(!this._canvas)
        return;

    //render to graph canvas
    ctx.save();
    if(!ctx.webgl) //reverse image
    {
        ctx.translate(0,this.size[1]);
        ctx.scale(1,-1);
    }
    ctx.drawImage(this._canvas,0,0,this.size[0],this.size[1]);
    ctx.restore();
}


//very slow, used at your own risk
LGraphTexture.generateLowResTexturePreview = function(tex)
{
    if(!tex) return null;

    var size = LGraphTexture.image_preview_size;
    var temp_tex = tex;

    //Generate low-level version in the GPU to speed up
    if(tex.width > size || tex.height > size)
    {
        temp_tex = this._preview_temp_tex;
        if(!this._preview_temp_tex)
        {
            temp_tex = new GL.Texture(size,size, { minFilter: gl.NEAREST });
            this._preview_temp_tex = temp_tex;
        }

        //copy
        tex.copyTo(temp_tex);
        tex = temp_tex;
    }

    //create intermediate canvas with lowquality version
    var tex_canvas = this._preview_canvas;
    if(!tex_canvas)
    {
        tex_canvas = createCanvas(size,size);
        this._preview_canvas = tex_canvas;
    }

    if(temp_tex)
        temp_tex.toCanvas(tex_canvas);
    return tex_canvas;
}

LGraphTexture.prototype.processInputCode = function()
{

    var input_codes = this.getInputCode(0);


    var texture_name = "u_" + (this.properties.name ? this.properties.name : "default_name") + "_texture"; // TODO check if there is a texture
    this.codes = this.shader_piece.getCode("color_"+this.id, input_codes[1].getOutputVar(), texture_name); // output var must be fragment

    this.codes[0].merge(input_codes[0]);
    this.codes[1].merge(input_codes[1]);

}


LiteGraph.registerNodeType("texture/textureSample", LGraphTexture );
window.LGraphTexture = LGraphTexture;


function LGraphCubemap()
{
    this.addOutput("Cubemap","Cubemap");
    this.addOutput("Color","vec4", {vec3:1, vec4:1});
    this.addInput("vec3","vec3");
    this.properties = {name:""};
    this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];

    this.shader_piece = PTextureSampleCube; // hardcoded for testing

    // default cube map
    if(typeof(gl) != "undefined" && gl.textures["cubemap"]){
        this.properties.name = "cubemap";
        this._drop_texture = gl.textures["cubemap"];
    }
}

LGraphCubemap.title = "textureSampleCube";
LGraphCubemap.desc = "textureSampleCube";

LGraphCubemap.prototype.onDropFile = function(data, filename, file)
{
    if(!data)
    {
        this._drop_texture = null;
        this.properties.name = "";
    }
    else
    {
        var no_ext_name = filename.split('.')[0];
        if( typeof(data) == "string" )
            gl.textures[no_ext_name] = this._drop_texture = GL.Texture.cubemapFromURL(data);
        else
            gl.textures[no_ext_name] =this._drop_texture = GL.Texture.fromDDSInMemory(data);
        this.properties.name = no_ext_name;
    }
}

LGraphCubemap.prototype.onExecute = function()
{

    this.processInputCode();
    if(this._drop_texture)
    {
        this.setOutputData(0, this._drop_texture);
        return;
    }

    if(!this.properties.name)
        return;

    var tex = LGraphTexture.getTexture( this.properties.name );
    if(!tex)
        return;

    this._last_tex = tex;
    this.setOutputData(0, tex);
}

LGraphCubemap.prototype.onDrawBackground = function(ctx)
{
    if( this.flags.collapsed || this.size[1] <= 20)
        return;

    if(!ctx.webgl)
        return;

    var cube_mesh = gl.meshes["cube"];
    if(!cube_mesh)
        cube_mesh = gl.meshes["cube"] = GL.Mesh.cube({size:1});

    //var view = mat4.lookAt( mat4.create(), [0,0
}


LGraphCubemap.prototype.processInputCode = function()
{

    var input_codes = this.getInputCode(0);

    var texture_name = "u_" + (this.properties.name ? this.properties.name : "default_name") + "_texture"; // TODO check if there is a texture
    this.codes = this.shader_piece.getCode("color_"+this.id, input_codes[1].getOutputVar(), texture_name); // output var must be fragment

    this.codes[0].merge(input_codes[0]);
    this.codes[1].merge(input_codes[1]);

}


LiteGraph.registerNodeType("texture/TextureSampleCube", LGraphCubemap );
window.LGraphCubemap = LGraphCubemap;

//UVS
function LGraphUVs()
{
    this.addOutput("UVs","vec2", {vec2:1});

    this.properties = { UTiling:1.0,
                        VTiling:1.0 };

    this.shader_piece = PUVs; // hardcoded for testing
}

LGraphUVs.title = "TextureCoords";
LGraphUVs.desc = "Texture coordinates";

LGraphUVs.prototype.onExecute = function()
{
    this.codes = this.shader_piece.getCode(); // I need to check texture id
}

LGraphUVs.prototype.setFloatValue = function(old_value,new_value) {
    if( typeof(new_value) == "string") new_value = parseFloat(new_value);
    old_value = new_value;
}

LGraphUVs.prototype.setValue = function(v1,v2)
{
    this.setFloatValue(this.properties["UTiling"],v1);
    this.setFloatValue(this.properties["VTiling"],v2);
};

LiteGraph.registerNodeType("texture/TextureCoords", LGraphUVs);


