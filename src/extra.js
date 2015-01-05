Mesh.boundingFrame = function (options) {
    options = options || {};
    var sizex = options.sizex || 1;
    var sizey = options.sizey || 1;
    var sizez = options.sizez || 1;
    sizex *= 0.5;
    sizey *= 0.5;
    sizez *= 0.5;

    var buffers = {};
    //[[-1,1,-1],[-1,-1,+1],[-1,1,1],[-1,1,-1],[-1,-1,-1],[-1,-1,+1],[1,1,-1],[1,1,1],[1,-1,+1],[1,1,-1],[1,-1,+1],[1,-1,-1],[-1,1,1],[1,-1,1],[1,1,1],[-1,1,1],[-1,-1,1],[1,-1,1],[-1,1,-1],[1,1,-1],[1,-1,-1],[-1,1,-1],[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,1],[1,1,-1],[-1,1,-1],[-1,1,1],[1,1,1],[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,-1],[1,-1,1],[-1,-1,1]]
    buffers.vertices = new Float32Array([
        //front
        -1, 1, 1,
        1, 1, 1,
        1, 1, 1,
        1, -1, 1,
        1, -1, 1,
        -1, -1, 1,
        -1, -1, 1,
        -1, 1, 1,
        // right
        1, 1, 1,
        1, 1, -1,
        1, 1, -1,
        1, -1, -1,
        1, -1, -1,
        1, -1, 1,
        //back
        1, 1, -1,
        -1, 1, -1,
        -1, -1, -1,
        1, -1, -1,
        -1, -1, -1,
        -1, 1, -1,
        // left
        -1, 1, -1,
        -1, 1, 1,
        -1, -1, 1,
        -1, -1, -1]);


    //for(var i in options.vertices) for(var j in options.vertices[i]) options.vertices[i][j] *= size;
    for (var i = 0, l = buffers.vertices.length; i < l; i += 3) {
        buffers.vertices[i] *= sizex;
        buffers.vertices[i + 1] *= sizey;
        buffers.vertices[i + 2] *= sizez;
    }


    return Mesh.load(buffers, options);
}

function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}
