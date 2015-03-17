
function LGraph1ParamNode()
{
    this.addOutput("result","notype", this.getOutputTypes(), this.getOutputExtraInfo() );
    this.addInput("A","notype", this.getInputTypes(), this.getInputExtraInfo());
    this.shader_piece = LiteGraph.CodeLib[this.getCodeName()]; // hardcoded for testing

}

LGraph1ParamNode.prototype.constructor = LGraph1ParamNode;


LGraph1ParamNode.prototype.onExecute = function()
{
    this.processInputCode();
}


LGraph1ParamNode.prototype.processInputCode = function()
{

    var code_A = this.getInputCode(0); // normal

    if(code_A){
        // (output, incident, normal)
        var output_code = this.codes[0] = this.shader_piece.getCode(this.getCodeName()+"_"+this.id, code_A.getOutputVar(), this.getScope(), this.getOutputType()); // output var must be fragment
        output_code.order = this.order;
        output_code.merge(code_A);
    }

}

LGraph1ParamNode.prototype.getOutputType = function()
{
    var obj = this.output_types ? this.output_types :  this.T_types;
    return Object.keys(obj)[0];
}


LGraph1ParamNode.prototype.getOutputTypes = function()
{
    return this.output_types ? this.output_types :  this.T_types;
}

LGraph1ParamNode.prototype.getInputTypes = function()
{
    return this.intput_types ? this.intput_types :  this.T_types;
}

LGraph1ParamNode.prototype.getScope = function()
{
    return CodePiece.FRAGMENT; // TODO need to really check the scope
}

LGraph1ParamNode.prototype.getCodeName = function()
{
    return this.code_name;
}

LGraph1ParamNode.prototype.getInputExtraInfo = function()
{
    return this.in_extra_info;
}

LGraph1ParamNode.prototype.getOutputExtraInfo = function()
{
    return this.out_extra_info;
}

//LiteGraph.registerNodeType("texture/reflect", LGraphReflect);



function LGraph2ParamNode()
{
    this.addOutput("Result","", this.getOutputTypes(), this.getOutputExtraInfo() );
    this.addInput("A","", this.getInputTypesA(), this.getInputExtraInfoA());
    this.addInput("B","", this.getInputTypesB(), this.getInputExtraInfoB());
    this.shader_piece = LiteGraph.CodeLib[this.getCodeName()];

}

LGraph2ParamNode.prototype.constructor = LGraph2ParamNode;


LGraph2ParamNode.prototype.onExecute = function()
{
    this.processInputCode();
}

LGraph2ParamNode.prototype.processInputCode = function()
{

    var output_code = LiteGraph.EMPTY_CODE;

    var code_A = this.getInputCode(0) || this.onGetNullCode(0);
    var code_B = this.getInputCode(1) || this.onGetNullCode(1);
    if(code_A && code_B){
        // (out_var, a, b, c, scope, out_type)
        output_code = this.codes[0] = this.shader_piece.getCode( this.getCodeName()+"_"+this.id,
            code_A.getOutputVar(),
            code_B.getOutputVar(),
            this.getScope(),
            this.getOutputType()); // output var must be fragment
        // if the alpha is an input, otherwise hardcoded
        output_code.order = this.order;
        output_code.merge(code_A);
        output_code.merge(code_B);
    }


}

LGraph2ParamNode.prototype.getOutputTypes = function()
{
    return this.output_types ? this.output_types :  this.T_types;
}

LGraph2ParamNode.prototype.getInputTypesA = function()
{
    return this.intput_typesA ? this.intput_typesA :  this.T_types;
}

LGraph2ParamNode.prototype.getInputTypesB = function()
{
    return this.intput_typesB ? this.intput_typesB :  this.T_types;
}


LGraph2ParamNode.prototype.getOutputType = function()
{
    var obj = this.output_types ? this.output_types :  this.T_types;
    return Object.keys(obj)[0];
}

LGraph2ParamNode.prototype.getScope = function()
{
    return CodePiece.FRAGMENT; // TODO need to really check the scope
}

LGraph2ParamNode.prototype.getCodeName = function()
{
    return this.code_name;
}

LGraph2ParamNode.prototype.getInputExtraInfoA = function()
{
    return this.in_extra_infoA;
}

LGraph2ParamNode.prototype.getInputExtraInfoB = function()
{
    return this.in_extra_infoB;
}


LGraph2ParamNode.prototype.getOutputExtraInfo = function()
{
    return this.out_extra_info;
}


//LiteGraph.registerNodeType("texture/reflect", LGraphReflect);





function LGraph3ParamNode()
{
    this.addOutput("Result","", this.getOutputTypes(), this.getOutputExtraInfo() );
    this.addInput("A","", this.getInputTypesA(), this.getInputExtraInfoA());
    this.addInput("B","", this.getInputTypesB(), this.getInputExtraInfoB());
    this.addInput("C","", this.getInputTypesC(), this.getInputExtraInfoC());
    this.shader_piece = LiteGraph.CodeLib[this.getCodeName()]; // hardcoded for testing

}

LGraph3ParamNode.prototype.constructor = LGraph3ParamNode;

LGraph3ParamNode.prototype.onExecute = function()
{
    this.processInputCode();
}

LGraph3ParamNode.prototype.processInputCode = function()
{

    var output_code = LiteGraph.EMPTY_CODE;

    var code_A = this.getInputCode(0) || this.onGetNullCode(0);
    var code_B = this.getInputCode(1) || this.onGetNullCode(1);
    var code_C = this.getInputCode(2) || this.onGetNullCode(2);
    if(code_A && code_B && code_C){
        // (out_var, a, b, c, scope, out_type)
        output_code = this.codes[0] = this.shader_piece.getCode( this.getCodeName()+"_"+this.id,
            code_A.getOutputVar(),
            code_B.getOutputVar(),
            code_C.getOutputVar(),
            this.getScope(),
            this.getOutputType()); // output var must be fragment
        // if the alpha is an input, otherwise hardcoded
        // we need to set the order into the code so the lines set up correctly
        output_code.order = this.order;

        if(code_C){
            output_code.merge(code_C);
        }
        output_code.merge(code_A);
        output_code.merge(code_B);
    }


}


LGraph3ParamNode.prototype.getOutputTypes = function()
{
    return this.output_types ? this.output_types :  this.T_types;
}

LGraph3ParamNode.prototype.getInputTypesA = function()
{
    return this.intput_typesA ? this.intput_typesA :  this.T_types;
}

LGraph3ParamNode.prototype.getInputTypesB = function()
{
    return this.intput_typesB ? this.intput_typesB :  this.T_types;
}

LGraph3ParamNode.prototype.getInputTypesC = function()
{
    return this.intput_typesC ? this.intput_typesC :  this.T_types;
}

LGraph3ParamNode.prototype.getOutputType = function()
{
    var obj = this.output_types ? this.output_types :  this.T_types;
    return Object.keys(obj)[0];
}

LGraph3ParamNode.prototype.getScope = function()
{
    return CodePiece.FRAGMENT; // TODO need to really check the scope
}

LGraph3ParamNode.prototype.getCodeName = function()
{
    return this.code_name;
}

LGraph3ParamNode.prototype.getInputExtraInfoA = function()
{
    return this.in_extra_infoA;
}

LGraph3ParamNode.prototype.getInputExtraInfoB = function()
{
    return this.in_extra_infoB;
}

LGraph3ParamNode.prototype.getInputExtraInfoC = function()
{
    return this.in_extra_infoC;
}

LGraph3ParamNode.prototype.getOutputExtraInfo = function()
{
    return this.out_extra_info;
}


//LiteGraph.registerNodeType("texture/reflect", LGraphReflect);




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
    this.codes[0] = this.shader_piece.getCode("float_"+this.id, this.properties["value"].toFixed(3), CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;

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

LiteGraph.registerNodeType("constants/"+LGraphConstant.title, LGraphConstant);



//Constant
function LGraphTime()
{
    this.addOutput("time","float", {float:1});

    this.shader_piece = PTime; // hardcoded for testing
}

LGraphTime.title = "Time";
LGraphTime.desc = "Time since execution started";



LGraphTime.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode(CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;

}

LiteGraph.registerNodeType("constants/"+LGraphTime.title , LGraphTime);



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

// repeated function should refactor
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
    this.codes[0] = this.shader_piece.getCode("vec2_"+this.id, this.valueToString(), CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;
}

LGraphConstVec2.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.valueToString();
}

LGraphConstVec2.prototype.valueToString = function()
{
    return "vec2("+this.properties["v1"].toFixed(3)+","+this.properties["v2"].toFixed(3)+")";
}

LiteGraph.registerNodeType("constants/"+LGraphConstVec2.title, LGraphConstVec2);



//Constant
function LGraphConstVec3()
{
    this.addOutput("value","vec3", {vec3:1});
    this.properties = { v1:1.0,
                        v2:1.0,
                        v3:1.0};
    this.editable = { property:"value", type:"vec3" };

    this.shader_piece = new PConstant("vec3"); // hardcoded for testing
}

LGraphConstVec3.title = "ConstVec3";
LGraphConstVec3.desc = "Constant vector3";

// repeated function should refactor
LGraphConstVec3.prototype.setFloatValue = function(old_value,new_value) {
    if( typeof(new_value) == "string") new_value = parseFloat(new_value);
    old_value = new_value;
}

LGraphConstVec3.prototype.setValue = function(v1,v2,v3)
{
    this.setFloatValue(this.properties["v1"],v1);
    this.setFloatValue(this.properties["v2"],v2);
    this.setFloatValue(this.properties["v3"],v3);
    this.setDirtyCanvas(true);
};

LGraphConstVec3.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode("vec3_"+this.id, this.valueToString(), CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;
}

LGraphConstVec3.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.valueToString();
}

LGraphConstVec3.prototype.valueToString = function()
{
    return "vec3("+this.properties["v1"].toFixed(3)+","+this.properties["v2"].toFixed(3)+","+this.properties["v3"].toFixed(3)+")";
}

LiteGraph.registerNodeType("constants/"+LGraphConstVec3.title, LGraphConstVec3);



//Constant
function LGraphConstVec4()
{
    this.addOutput("value","vec4", {vec4:1});
    this.properties = { v1:1.0,
                        v2:1.0,
                        v3:1.0,
                        v4:1.0};
    this.editable = { property:"value", type:"vec4" };

    this.shader_piece = new PConstant("vec4"); // hardcoded for testing
}

LGraphConstVec4.title = "ConstVec4";
LGraphConstVec4.desc = "Constant vector4";


// repeated function should refactor
LGraphConstVec4.prototype.setFloatValue = function(old_value,new_value) {
    if( typeof(new_value) == "string") new_value = parseFloat(new_value);
    old_value = new_value;
}

LGraphConstVec4.prototype.setValue = function(v1,v2,v3,v4)
{
    this.setFloatValue(this.properties["v1"],v1);
    this.setFloatValue(this.properties["v2"],v2);
    this.setFloatValue(this.properties["v3"],v3);
    this.setFloatValue(this.properties["v4"],v4);
    this.setDirtyCanvas(true);
};

LGraphConstVec4.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode("vec4_"+this.id, this.valueToString(), CodePiece.FRAGMENT); // need to check scope
    this.codes[0].order = this.order;
}

LGraphConstVec4.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.outputs[0].label = this.valueToString();
}

LGraphConstVec4.prototype.valueToString = function()
{
    return "vec4("+this.properties["v1"].toFixed(3)+","+this.properties["v2"].toFixed(3)+","+this.properties["v3"].toFixed(3)+","+this.properties["v4"].toFixed(3)+")";
}

LiteGraph.registerNodeType("constants/"+LGraphConstVec4.title, LGraphConstVec4);


//UVS
function LGraphCamToPixelWS()
{
    this.addOutput("Camera To Pixel","vec3", {vec3:1});


    this.shader_piece = PCameraToPixelWS; // hardcoded for testing
}

LGraphCamToPixelWS.title = "CameraToPixelWS";
LGraphCamToPixelWS.desc = "The vector from camera to pixel";

LGraphCamToPixelWS.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode(); // I need to check texture id
    this.codes[0].order = this.order;
}


LiteGraph.registerNodeType("coordinates/"+ LGraphCamToPixelWS.title , LGraphCamToPixelWS);



//UVS
function LGraphPixelNormalWS()
{
    this.addOutput("Pixel Normal","vec3", {vec3:1});


    this.shader_piece = PPixelNormalWS; // hardcoded for testing
}

LGraphPixelNormalWS.title = "PixelNormalWS";
LGraphPixelNormalWS.desc = "The normal in world space";

LGraphPixelNormalWS.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode(); // I need to check texture id
    this.codes[0].order = this.order;
}


LiteGraph.registerNodeType("coordinates/"+LGraphPixelNormalWS.title, LGraphPixelNormalWS);



//UVS
function LGraphUVs()
{
    this.addOutput("UVs","vec2", {vec2:1});

    this.properties = { UTiling:1.0,
                        VTiling:1.0 };
    this.options = {    UTiling:{min:0, max:1, step:0.01},
                        VTiling:{min:0, max:1, step:0.01}
    };
    this.shader_piece = PUVs; // hardcoded for testing
}

LGraphUVs.title = "TextureCoords";
LGraphUVs.desc = "Texture coordinates";

LGraphUVs.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode(); // I need to check texture id
    this.codes[0].order = this.order;
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

LiteGraph.registerNodeType("coordinates/"+LGraphUVs.title , LGraphUVs);





function LGraphVertexPosWS()
{
    this.addOutput("vec3","vec3", {vec3:1});


    this.shader_piece = PVertexPosWS; // hardcoded for testing
}

LGraphVertexPosWS.title = "VertexPositionWS";
LGraphVertexPosWS.desc = "Vertex position in WS";

LGraphVertexPosWS.prototype.onExecute = function()
{
    this.codes[0] = this.shader_piece.getCode(); // I need to check texture id
    this.codes[0].order = this.order;
}


LiteGraph.registerNodeType("coordinates/"+LGraphVertexPosWS.title, LGraphVertexPosWS);




/**
 * Created by vik on 21/01/2015.
 */


function LGraphShader()
{
    this.uninstantiable = true;
    this.addInput("albedo","vec3", {vec3:1});
    this.addInput("normal","vec3", {vec3:1}); // tangent space normal, if written
    this.addInput("emission","vec3", {vec3:1});
    this.addInput("specular","number", {number:1}); // specular power in 0..1 range
    this.addInput("gloss","number", {number:1});
    this.addInput("alpha","number", {number:1});
    this.addInput("bump offset","vec3", {vec3:1});


    //inputs: ["base color","metallic", "specular", "roughness", "emissive color", "opacity", "opacitiy mask", "normal", "world position offset", "world displacement", "tesselation multiplier", "subsurface color", "ambient occlusion", "refraction"],
    this.size = [125,250];
    this.shader_piece = ShaderConstructor;
}

LGraphShader.title = "Output";
LGraphShader.desc = "Output Main Node";


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

    var color_code = this.getInputCode(0) || LiteGraph.EMPTY_CODE; // 0 it's the color
    var normal_code = this.getInputCode(1) || LiteGraph.EMPTY_CODE; // 1 it's the normal
    var emission_code = this.getInputCode(2) || LiteGraph.EMPTY_CODE; // 2 it's the emission
    var specular_code = this.getInputCode(3) || LiteGraph.EMPTY_CODE; // 3 it's the specular
    var gloss_code = this.getInputCode(4) || LiteGraph.EMPTY_CODE; //  4 it's the gloss
    var alpha_code = this.getInputCode(5) || LiteGraph.EMPTY_CODE; //  5 it's the alpha
    var world_offset_code = this.getInputCode(6) || LiteGraph.EMPTY_CODE; // 1 it's the position offset

    var shader = this.shader_piece.createShader(color_code,normal_code,emission_code,specular_code,gloss_code,alpha_code,world_offset_code);
    this.graph.shader_output = shader;
    var texture_nodes = this.graph.findNodesByType("texture/"+LGraphTexture.title);// we need to find all the textures used in the graph
    this.graph.shader_textures = [];
    // we set all the names in one array
    // useful to render nodes
    for(var i = 0; i < texture_nodes.length; ++i){
        this.graph.shader_textures.push(texture_nodes[i].properties.name);
    }
    texture_nodes = this.graph.findNodesByType("texture/"+LGraphCubemap.title);// we need to find all the textures used in the graph
    for(var i = 0; i < texture_nodes.length; ++i){
        this.graph.shader_textures.push(texture_nodes[i].properties.name);
    }


}



LiteGraph.registerNodeType("core/"+ LGraphShader.title ,LGraphShader);

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

LiteGraph.registerNodeType("texture/"+LGraphTexturePreview.title, LGraphTexturePreview );
window.LGraphTexturePreview = LGraphTexturePreview;

function LGraphTexture()
{
    this.addOutput("Texture","Texture",{Texture:1});
    this.addOutput("Color","vec3", {vec3:1});
    this.addOutput("R","float", {float:1});
    this.addOutput("G","float", {float:1});
    this.addOutput("B","float", {float:1});
    this.addOutput("A","float", {float:1});
    this.addInput("UVs","vec2", {vec2:1});
    this.properties =  this.properties || {};
    this.properties.name = "";
    this.properties.texture_type = "Color";
    this.multichoice = {texture_type:[ 'Color', 'Normal map', 'Bump map' ]};

    //this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];
    this.size = [170,165];
    this.shader_piece = PTextureSample; // hardcoded for testing
    this.uvs_piece = PUVs;
    // default texture
//    if(typeof(gl) != "undefined" && gl.textures["default"]){
//        this.properties.name = "default";
//        this._drop_texture = gl.textures["default"];
//    }
}

LGraphTexture.title = "TextureSample";
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
    var container =  gl.textures || LGraphTexture.textures_container; // changedo order, otherwise it bugs with the multiple context

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

LGraphTexture.loadTextureFromFile = function(data, filename, file, callback, gl){

    gl = gl || window.gl;
    if(data)
    {
        var texture = null;
        var no_ext_name = LiteGraph.removeExtension(filename);
        if( typeof(data) == "string" )
            gl.textures[no_ext_name] = texture = GL.Texture.fromURL( data, {}, callback, gl );
        else if( filename.toLowerCase().indexOf(".dds") != -1 )
            texture = GL.Texture.fromDDSInMemory(data, gl);
        else
        {
            var blob = new Blob([file]);
            var url = URL.createObjectURL(blob);
            texture = GL.Texture.fromURL( url, {}, callback, gl  );
        }
        texture.name = no_ext_name;
        return texture;
    }

}

LGraphTexture.prototype.onDropFile = function(data, filename, file, callback, gl)
{
    if(!data)
    {
        this._drop_texture = null;
        this.properties.name = "";
    } else {
        var tex = LGraphTexture.loadTextureFromFile(data, filename, file, callback, gl);
        if(tex){
            this._drop_texture = tex;
            this._last_tex = this._drop_texture;
            this.properties.name = tex.name;
            this._drop_texture.current_ctx = LiteGraph.current_ctx;
        }
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

    if(this._drop_texture ){

        if(this._drop_texture.current_ctx != LiteGraph.current_ctx){
            this._drop_texture = LGraphTexture.getTexture( this.properties.name );
        }
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
        ctx.drawImage(this._drop_texture,this.size[1]* 0.05,this.size[1]* 0.2,this.size[0]* 0.75,this.size[1]* 0.75);
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
        else if( !this._drop_texture || this._drop_texture && !this._drop_texture.hasOwnProperty("ready"))
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
    ctx.drawImage(this._canvas,this.size[1]* 0.05,this.size[1]* 0.1,this.size[0]* 0.75,this.size[1]* 0.75);
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

    var input_code = this.getInputCode(0) || this.onGetNullCode(0);
    var texture_type = this.properties.texture_type == "Normal map" ? LiteGraph.NORMAL_MAP : this.properties.texture_type == "Bump map" ?  LiteGraph.BUMP_MAP : LiteGraph.COLOR_MAP;

    if(input_code){
        var texture_name = "u_" + (this.properties.name ? this.properties.name : "default_name") + "_texture"; // TODO check if there is a texture
        var color_output = this.codes[1] = this.shader_piece.getCode("color_"+this.id, input_code.getOutputVar(), texture_name, texture_type); // 1 it's the color output
        color_output.order = this.order;

        color_output.merge(input_code);
        var r_chan = color_output.clone();
        r_chan.output_var = color_output.getOutputVar()+".r";
        this.codes[2] = r_chan;
        var g_chan = color_output.clone();
        g_chan.output_var = color_output.getOutputVar()+".g";
        this.codes[3] = g_chan;
        var b_chan = color_output.clone();
        b_chan.output_var = color_output.getOutputVar()+".b";
        this.codes[4] = b_chan;
        var a_chan = color_output.clone();
        a_chan.output_var = color_output.getOutputVar()+".a";
        this.codes[5] = a_chan;
//        this.codes[3]
//        this.codes[4]
//        this.codes[5]
    } else {
        this.codes[0] = LiteGraph.EMPTY_CODE;
        this.codes[1] = LiteGraph.EMPTY_CODE;
        this.codes[2] = LiteGraph.EMPTY_CODE;
        this.codes[3] = LiteGraph.EMPTY_CODE;
        this.codes[4] = LiteGraph.EMPTY_CODE;
        this.codes[5] = LiteGraph.EMPTY_CODE;
    }

}

LGraphTexture.prototype.onGetNullCode = function(slot)
{
    if(slot == 0)
        return this.uvs_piece.getCode();

}

LiteGraph.registerNodeType("texture/"+LGraphTexture.title, LGraphTexture );
window.LGraphTexture = LGraphTexture;



function LGraphCubemap()
{
    this.addOutput("Cubemap","Cubemap");
    this.addOutput("Color","vec3", {vec3:1});
    this.addInput("vec3","vec3");
    this.properties =  this.properties || {};
    this.properties.name = "";
    this.size = [LGraphTexture.image_preview_size, LGraphTexture.image_preview_size];

    this.shader_piece = PTextureSampleCube; // hardcoded for testing
    this.vector_piece = new PReflected();
    this.size = [170,165];
}

LGraphCubemap.title = "TextureSampleCube";
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
    //    if( this.flags.collapsed || this.size[1] <= 20)
//        return;
//
//    if(!ctx.webgl)
//        return;
//
//    var cube_mesh = gl.meshes["cube"];
//    if(!cube_mesh)
//        cube_mesh = gl.meshes["cube"] = GL.Mesh.cube({size:1});
//
//    //var view = mat4.lookAt( mat4.create(), [0,0


}


LGraphCubemap.prototype.processInputCode = function()
{

    var input_code = this.getInputCode(0) || this.onGetNullCode(0); // get input in link 0
    if(input_code){
        var texture_name = "u_" + (this.properties.name ? this.properties.name : "default_name") + "_texture"; // TODO check if there is a texture
        var color_code = this.codes[1] = this.shader_piece.getCode("color_"+this.id, input_code.getOutputVar(), texture_name);
        color_code.order = this.order;
        color_code.merge(input_code);
    } else {
        this.codes[0] = LiteGraph.EMPTY_CODE;
        this.codes[1] = LiteGraph.EMPTY_CODE;
    }

}

LGraphCubemap.prototype.onGetNullCode = function(slot)
{
    if(slot == 0)
        return this.vector_piece.getCode();

}

LiteGraph.registerNodeType("texture/"+LGraphCubemap.title, LGraphCubemap );
window.LGraphCubemap = LGraphCubemap;



//Constant
function LGraphVecToComps()
{
    this.addInput("vec","vec4", {vec4:1,vec3:1,vec2:1});
    this.addOutput("x","number", {float:1});
    this.addOutput("y","number", {float:1});
    this.addOutput("z","number", {float:1});
    this.addOutput("v","number", {float:1});

}

LGraphVecToComps.title = "VecToComps";
LGraphVecToComps.desc = "Vector To Components";


LGraphVecToComps.prototype.onExecute = function()
{
    var input_code = this.getInputCode(0);

    if(input_code){
        var x_chan = input_code.clone();
        x_chan.output_var = input_code.getOutputVar()+".x";
        this.codes[0] = x_chan;
        var y_chan = input_code.clone();
        y_chan.output_var = input_code.getOutputVar()+".y";
        this.codes[1] = y_chan;
        var z_chan = input_code.clone();
        z_chan.output_var = input_code.getOutputVar()+".z";
        this.codes[2] = z_chan;
        var v_chan = input_code.clone();
        v_chan.output_var = input_code.getOutputVar()+".v";
        this.codes[4] = v_chan;

    }
}



LiteGraph.registerNodeType("coordinates/"+LGraphVecToComps.title , LGraphVecToComps);





function LGraphAbs()
{
    this._ctor(LGraphAbs.title);

    this.code_name = "abs";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_types = null;
    this.in_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};


    LGraph1ParamNode.call( this);
}

LGraphAbs.prototype = Object.create(LGraph1ParamNode);
LGraphAbs.prototype.constructor = LGraphAbs;

LGraphAbs.title = "Abs";
LGraphAbs.desc = "Abs of input";


LiteGraph.extendClass(LGraphAbs,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphAbs.title, LGraphAbs);





function LGraphCos()
{
    this.code_name = "cos";
    this.output_types = {float:1, vec3:1, vec4:1, vec2:1};
    this.intput_types = {float:1, vec3:1, vec4:1, vec2:1};
    this.output_type = "float";

    LGraph1ParamNode.call( this);
    console.log(this);
}

LGraphCos.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity
LGraphCos.prototype.constructor = LGraphSin;

LGraphCos.title = "Cos";
LGraphCos.desc = "cosine of input";


LiteGraph.extendClass(LGraphCos,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphCos.title, LGraphCos);





function LGraphSin()
{
    this._ctor(LGraphSin.title);

    this.code_name = "sin";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_types = null;
    this.in_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    LGraph1ParamNode.call( this);
}

LGraphSin.prototype = Object.create(LGraph1ParamNode); // we inherit from Entity

LGraphSin.prototype.constructor = LGraphSin;

LGraphSin.title = "Sin";
LGraphSin.desc = "sine of input";


LiteGraph.extendClass(LGraphSin,LGraph1ParamNode);
LiteGraph.registerNodeType("math/"+LGraphSin.title, LGraphSin);






function LGraphOperation()
{
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesA = null;
    this.in_extra_infoA = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1}
    this.intput_typesB = null;
    this.in_extra_infoB = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};

    this.number_piece = new PConstant("float"); // hardcoded when the inputs are null
    this.properties = { A:0.0, B:0.0};

    LGraph2ParamNode.call( this);
}
LGraphOperation.prototype = Object.create(LGraph2ParamNode);
LGraphOperation.prototype.constructor = LGraphOperation;



LGraphOperation.prototype.infereTypes = function( output, target_slot) {
    this.in_conected_using_T++;
    var input = this.inputs[target_slot];
    if(input.use_t && this.in_conected_using_T == 1){
        for(var k in output.types)
            this.T_types[k] = output.types[k];
    }

//    var output_type = Object.keys(output.types)[0];
//    if(target_slot == 2 && output_type == "number")
//        return;
//
//    this.in_conected_using_T++;
//    var input = this.inputs[target_slot];
//    if (input.use_t && this.in_conected_using_T == 1) {
//        for (var k in output.types)
//            this.T_types[k] = output.types[k];
//    }
}


LGraphOperation.prototype.onGetNullCode = function(slot)
{
    if(slot == 0){
        return this.number_piece.getCode("float_"+this.id, this.properties["A"].toFixed(3), CodePiece.FRAGMENT); // need to check scope;
    } else if(slot == 1){
        return this.number_piece.getCode("float_"+this.id, this.properties["B"].toFixed(3), CodePiece.FRAGMENT); // need to check scope;
    }

}

LGraphOperation.prototype.onDrawBackground = function(ctx)
{
    this.inputs[0].label = "A";
    if(!this.isInputConnected(0))
        this.inputs[0].label += "="+this.properties["A"].toFixed(3);

    this.inputs[1].label = "B";
    if(!this.isInputConnected(1))
        this.inputs[1].label += "="+this.properties["B"].toFixed(3);
}


LiteGraph.extendClass(LGraphOperation,LGraph2ParamNode);







function LGraphAddOp()
{
    this._ctor(LGraphAddOp.title);

    this.code_name = "add";

    LGraphOperation.call( this);
}
LGraphAddOp.prototype = Object.create(LGraphOperation);
LGraphAddOp.prototype.constructor = LGraphAddOp;

LGraphAddOp.title = "Add";
LGraphAddOp.desc = "Add the inputs";



LiteGraph.extendClass(LGraphAddOp,LGraphOperation);
LiteGraph.registerNodeType("operations/"+LGraphAddOp.title, LGraphAddOp);






function LGraphMix()
{
    this._ctor(LGraphMix.title);

    this.code_name = "mix";
    this.output_types = null;
    this.out_extra_info = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};
    this.intput_typesA = null;
    this.in_extra_infoA = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1}
    this.intput_typesB = null;
    this.in_extra_infoB = {types_list: {float:1, vec3:1, vec4:1, vec2:1},   use_t:1};

    this.properties = { alpha:0.5};
    this.options = { alpha:{min:0, max:1, step:0.01}};
    this.number_piece = new PConstant("float");
    LGraph3ParamNode.call( this);
}

LGraphMix.prototype = Object.create(LGraph3ParamNode); // we inherit from Entity
LGraphMix.prototype.constructor = LGraphMix;

LGraphMix.title = "Mix";
LGraphMix.desc = "mix of input";

LGraphMix.prototype.infereTypes = function( output, target_slot) {
    var output_type = Object.keys(output.types)[0];
    if(target_slot == 2 && output_type == "float")
        return;

    this.in_conected_using_T++;
    var input = this.inputs[target_slot];
    if (input.use_t && this.in_conected_using_T == 1) {
        for (var k in output.types)
            this.T_types[k] = output.types[k];
    }
}

LGraphMix.prototype.onGetNullCode = function(slot)
{
    if(slot == 2){
        return this.number_piece.getCode("float_"+this.id, this.properties["alpha"].toFixed(3), CodePiece.FRAGMENT); // need to check scope;
    }

}

LGraphMix.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.inputs[2].label = "alpha";
    if(!this.isInputConnected(2))
        this.inputs[2].label += "="+this.properties["alpha"].toFixed(3);
}

LiteGraph.extendClass(LGraphMix,LGraph3ParamNode);
LiteGraph.registerNodeType("operations/"+LGraphMix.title, LGraphMix);




function LGraphMixer()
{
    this.addOutput("Result","vec4",{vec4:1, vec3:1});
    this.addInput("A","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("B","vec3", {vec4:1, vec3:1, float:1});
    this.addInput("alpha","number", {float:1, number:1});

    this.properties = { alpha:0.5};
    this.options = { alpha:{min:0, max:1, step:0.01}};
    this.shader_piece = LiteGraph.CodeLib["mix"];
}

LGraphMixer.title = "Mix";
LGraphMixer.desc = "Lerp between A and B";

LGraphMixer.prototype.onExecute = function()
{
    this.processInputCode();

}

LGraphMixer.prototype.processInputCode = function()
{
    var output_code = LiteGraph.EMPTY_CODE;

    var code_A = this.getInputCode(0);
    var code_B = this.getInputCode(1);
    var code_alpha = this.getInputCode(2);
    var alpha = code_alpha ? code_alpha.getOutputVar() :  this.properties["alpha"].toFixed(3); // need to put the correct scope

    if(code_A && code_B){
        // (out_var, a, b, c, scope, out_type)
        output_code = this.codes[0] = this.shader_piece.getCode( "mixed_"+this.id, code_A.getOutputVar(), code_B.getOutputVar(),alpha, CodePiece.FRAGMENT, "vec4"); // output var must be fragment
        output_code.order = this.order;
        // if the alpha is an input, otherwise hardcoded
        if(code_alpha){
            output_code.merge(code_alpha);
        }
        output_code.merge(code_A);
        output_code.merge(code_B);
    } else {
        this.codes[0] = LiteGraph.EMPTY_CODE;
    }

}

LGraphMixer.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.inputs[2].label = "alpha";
    if(!this.isInputConnected(2))
        this.inputs[2].label += "="+this.properties["alpha"].toFixed(3);
}

//LiteGraph.registerNodeType("texture/"+LGraphMixer.title, LGraphMixer );





function LGraphMulOp()
{
    this._ctor(LGraphMulOp.title);
    this.code_name = "mul";
    LGraphOperation.call( this);
}


LGraphMulOp.title = "Mul";
LGraphMulOp.desc = "Mul the inputs";


//LGraphMulOp.prototype = Object.create(LGraphOperation); // we inherit from Entity
//LGraphMulOp.prototype.constructor = LGraphMulOp;
LiteGraph.extendClass(LGraphMulOp,LGraphOperation);
LiteGraph.registerNodeType("operations/"+LGraphMulOp.title, LGraphMulOp);



//UVS
function LGraphReflect()
{
    this.addOutput("reflect vector","vec3", {vec3:1});
    this.addInput("normal","vec3", {vec3:1});
    this.addInput("vector","vec3", {vec3:1});

    this.shader_piece = LiteGraph.CodeLib["reflect"]; // hardcoded for testing
}

LGraphReflect.title = "Reflect";
LGraphReflect.desc = "To reflect a vector3";


LGraphReflect.prototype.onExecute = function()
{
    this.processInputCode();
}


LGraphReflect.prototype.processInputCode = function()
{

    var code_normal = this.getInputCode(0); // normal
    var code_incident = this.getInputCode(1); // inident vector

    // (output, incident, normal)
    if(code_incident && code_normal){
        var output_code = this.codes[0] = this.shader_piece.getCode("reflect_"+this.id, code_incident.getOutputVar(), code_normal.getOutputVar(), CodePiece.FRAGMENT, "vec3"); // output var must be fragment
        output_code.order = this.order;

        output_code.merge(code_normal);
        output_code.merge(code_incident);
    } else {
        this.codes[0] = LiteGraph.EMPTY_CODE;
    }

}

LiteGraph.registerNodeType("texture/"+LGraphReflect.title, LGraphReflect);




function LGraphSmooth()
{
    this.addOutput("Result","float",{float:1});
    this.addInput("lower","float", {float:1});
    this.addInput("upper","float", {float:1});
    this.addInput("x","float", {float:1});

    this.properties = { lower:0.0,
                        upper:1.5};
    this.shader_piece = PSmooth; // hardcoded for testing
}

LGraphSmooth.title = "SmoothStep";
LGraphSmooth.desc = "Hermite interpolation";

LGraphSmooth.prototype.onExecute = function()
{
    this.processInputCode();
}

LGraphSmooth.prototype.processInputCode = function()
{

    var lower_code = this.getInputCode(0);
    var upper_code = this.getInputCode(1);
    var x_code = this.getInputCode(2);

    var lower = lower_code ? lower_code.getOutputVar() :  this.properties["lower"].toFixed(3); // need to put the correct scope
    var upper = upper_code ? upper_code.getOutputVar() :  this.properties["upper"].toFixed(3); // need to put the correct scope
    var x_var = x_code ? x_code.getOutputVar() :  "0.0";

    var output_code = this.codes[0] = this.shader_piece.getCode( "smoothed_"+this.id, lower, upper, x_var); // output var scope unknown
    output_code.order = this.order;
    if(x_code){
        output_code.merge(x_code);
        if(lower_code)
            output_code.merge(lower_code);
        if(upper_code)
            output_code.merge(upper_code);
    } else {
        output_code = LiteGraph.EMPTY_CODE;
    }


}

LGraphSmooth.prototype.onDrawBackground = function(ctx)
{
    //show the current value
    this.inputs[0].label = "lower";
    if(!this.isInputConnected(0))
        this.inputs[0].label += "="+this.properties["lower"].toFixed(3);
    this.inputs[1].label = "upper";
    if(!this.isInputConnected(0))
        this.inputs[1].label += "="+this.properties["upper"].toFixed(3);
}

LiteGraph.registerNodeType("texture/"+LGraphSmooth.title, LGraphSmooth );
