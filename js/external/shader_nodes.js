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

    var nodes = this.getInputNodes();
    var node = nodes[0]; // 0 it's base color
    var input_code = node.code;
    this.shader_piece.getCode(input_code, "");
}

//    this.code = this.shader_piece.getCode("color_"+node.id, input_code.output_var, node.id); // I need to check texture id
//
//    this.code.vertex = input_code.vertex.concat(this.code.vertex);
//    this.code.fragment = input_code.fragment.concat(this.code.fragment);
//
//    for (var inc in input_code.includes) { this.code.includes[inc] = input_code.includes[inc]; }


//var nodes = this.getInputNodes();
//for(var i = 0; i < nodes.length; ++i){
//    var node = nodes[i];
//    node.shader_piece.getCode();
//}



LiteGraph.registerNodeType("core/ShaderNode",LGraphShader);
//**************************
function LGraphTexturePreview()
{
    this.addInput("Texture","Texture");
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
function LGraphTexture()
{
    this.addOutput("Texture","Texture");
    this.addOutput("Color","vec4");
    this.addOutput("R","R");
    this.addOutput("G","G");
    this.addOutput("B","B");
    this.addOutput("A","A");
    this.addInput("UVs","vec2");
    this.properties = {name:""};
    this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];

    this.shader_piece = PTextureSample; // hardcoded for testing
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
        case LGraphTexture.REUSE: return origin; break;
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

    var nodes = this.getInputNodes();
    var node = nodes[0];
    var input_code = node.code;
    var texture_name = "u_" + this.properties.name + "_texture";
    this.code = this.shader_piece.getCode("color_"+node.id, input_code.output_var, texture_name);

    this.code.vertex.body = input_code.vertex.body.concat(this.code.vertex.body);
    this.code.vertex.uniforms = input_code.vertex.uniforms.concat(this.code.vertex.uniforms);
    this.code.fragment.body = input_code.fragment.body.concat(this.code.fragment.body);
    this.code.fragment.uniforms = input_code.fragment.uniforms.concat(this.code.fragment.uniforms);

    for (var inc in input_code.includes) { this.code.includes[inc] = input_code.includes[inc]; }
}

//var nodes = this.getInputNodes();
//for(var i = 0; i < nodes.length; ++i){
//    var node = nodes[i];
//    node.shader_piece.getCode();
//}

LiteGraph.registerNodeType("texture/textureSample", LGraphTexture );
window.LGraphTexture = LGraphTexture;

//UVS
function LGraphUVs()
{
    this.addOutput("value","vec2");
    this.properties = { value:1.0 };
    this.editable = { property:"value", type:"number" };

    this.shader_piece = PUVs; // hardcoded for testing
}

LGraphUVs.title = "UVs";
LGraphUVs.desc = "The texture coordinates";


LGraphUVs.prototype.setValue = function(v)
{
    if( typeof(v) == "string") v = parseFloat(v);
    this.properties["value"] = v;
    this.setDirtyCanvas(true);
};

LGraphUVs.prototype.onExecute = function()
{
    this.code = this.shader_piece.getCode(); // I need to check texture id
    this.setOutputData(0, parseFloat( this.properties["value"] ) );
}

LGraphUVs.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.properties["value"].toFixed(3);
}

LGraphUVs.prototype.onWidget = function(e,widget)
{
    if(widget.name == "value")
        this.setValue(widget.value);
}

LiteGraph.registerNodeType("texture/UVs", LGraphUVs);

