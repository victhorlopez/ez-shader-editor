function CanvasController() {
    this._camera_controller = new CameraController(App.camera, {rotation_speed: 5});
    this._node_controller = new NodeController(null, {rotation_speed: 10});
    this._controller = null;
}

CanvasController.prototype.onMouseEvent = function (e) {

    var obj = null;
    if (e.eventType != "mousemove") {
        obj = this.getNodeOnMouse(e.canvasx, gl.canvas.height - e.canvasy); // the y coordinates start from the bottom in the event
        if (obj) {
            if (obj.parentNode && obj.parentNode.id == "gizmo") {
                this._node_controller.setGizmoAxis(obj);
            } else {
                e.obj = obj;
                this._node_controller._is_gizmo = false;
                this._controller = this._node_controller;
            }
        } else {
            this._controller = this._camera_controller;
        }
    }

    if (e.eventType == "mousewheel") {
        this._camera_controller.handleMouseWheel(e);
        // we require to scale the gizmo on the wheel event
        this._node_controller.handleMouseWheel(e);
    }
    if (e.eventType == "mousemove" && e.dragging) {
        this._controller.handleMouseMove(e);
    }
    if (e.eventType == "mousedown") {
        this._controller.handleMouseDown(e);
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
        if (mesh && mesh.bounding) {
            var result = Raytracer.hitTestBox(App.camera._position, ray, BBox.getMin(mesh.bounding), BBox.getMax(mesh.bounding), node._global_matrix);
            if (result && closest_t > result.t) {
                closest_node = node;
                closest_t = result.t;
            }
        }
    }
    return closest_node;
}

CanvasController.prototype.getSelectedNode = function () {
    return this._node_controller._obj;
}

CanvasController.prototype.selectNode = function (node) {
    this._node_controller.selectNode(node);
}

CanvasController.prototype.onTranslateTool = function () {
    App.canvas_controller._node_controller.activateGizmo();
}

CanvasController.prototype.onRotateTool = function () {
}

CanvasController.prototype.onScaleTool = function () {
}

CanvasController.prototype.onNoTool = function () {
    App.canvas_controller._node_controller.desactivateTools();
}

