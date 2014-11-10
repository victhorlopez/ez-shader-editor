function CanvasController() {
    this._camera_controller = new CameraController(App.camera, {rotation_speed: 5});
    this._node_controller = new NodeController(null, {rotation_speed: 10});
}

CanvasController.prototype.onMouseEvent = function (e) {

        var obj = this.getNodeOnMouse(e.canvasx, e.canvasy);
        var controller = null;
        if (obj) {
            e.obj = obj;
            controller = this._node_controller;
        } else {
            controller = this._camera_controller;
        }


        if (e.eventType == "mousewheel") {
            this._camera_controller.handleMouseWheel(e);
        }
        if (e.eventType == "mousemove") {
            controller.handleMouseMove(e);
        }
        if(e.eventType == "mousedown"){
            controller.handleMouseDown(e);
        }


}

CanvasController.prototype.getNodeOnMouse = function (canvas_x, canvas_y) {

    var nodes = App.scene.root.getAllChildren();
    var RT = new GL.Raytracer(App.camera._view_matrix, App.camera._projection_matrix);
    var ray = RT.getRayForPixel(canvas_x, canvas_y);

    var closest_node = null;
    var closest_t = 100000000;

    for (var i in nodes) {
        var node = nodes[i];
        var mesh = gl.meshes[node.mesh];
        if (mesh.bounding) {
            var result = Raytracer.hitTestBox(App.camera._position, ray, BBox.getMin(mesh.bounding), BBox.getMax(mesh.bounding), node._local_matrix);
            if (result && closest_t > result.t) {
                closest_node = node;
                closest_t = result.t;
            }
        }
    }
    return closest_node;
}
