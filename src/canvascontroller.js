function CanvasController(){
    this.camera_controller = new CameraController(App.camera, {rotation_speed: 100});
    this.obj_controller = new CameraController(null, {rotation_speed: 100});
}

CanvasController.prototype.onMouseEvent = function(e)
{
    var obj = this.getNodeOnMouse(e.canvasx, e.canvasy);
    console.log(obj);
    if(e.eventType == "mousewheel"){
        this.handleMouseWheel(e);
    } else if (e.eventType == "mousemove"){
        this.handleMouseMove(e);
    }
}

CanvasController.prototype.getNodeOnMouse = function(canvas_x, canvas_y){

    var nodes = App.scene.root.getAllChildren();
    var RT = new GL.Raytracer(App.camera._view_matrix,App.camera._projection_matrix);
    var ray = RT.getRayForPixel(canvas_x,canvas_y);

    var closest_node = null;
    var closest_t = 100000000;

    for(var i in nodes){
        var node = nodes[i];
        console.log(gl.meshes[node.mesh]);
        if(App.gl.meshes[node.mesh].bounding){
            var result = Raytracer.hitTestBox( App.camera._position, ray, BBox.getMin(App.gl.meshes[node.mesh].bounding), BBox.getMax(App.gl.meshes[node.mesh].bounding), node._local_matrix );
            if(result && closest_t > result.t){
                closest_node = node;
                closest_t = result.t;
            }
        }
    }
    return closest_node;
}
