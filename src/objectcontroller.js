function ObjectController(obj, options) {
    this._constructor(obj, options);
}

ObjectController.prototype._constructor = function (obj, options) {
    this._obj = obj;
    this._rotation_speed = options && options.rotation_speed || 10.0;
    this._move_speed = options && options.move_speed || 10.0;
}

ObjectController.prototype.move = function (v) {
    obj.move(v);
}

ObjectController.prototype.rotate = function (angle_in_deg, axis) {
    obj.rotate(angle_in_deg, axis);
}

//ObjectController.prototype.onMouseEvent = function(e){
//    if(e.eventType == "mousewheel"){
//        this.handleMouseWheel(e);
//    } else if (e.eventType == "mousemove"){
//        this.handleMouseMove(e);
//    }
//}

ObjectController.prototype.setObject = function (obj) {
    this._obj = obj;
    return this;
}

function CameraController(obj, options) {
    this._constructor(obj, options);
}
extendClass(CameraController, ObjectController);

CameraController.prototype.orbit = function (angle_in_deg, axis, center) {
    this._obj.orbit(angle_in_deg, axis, center);
}

CameraController.prototype.orbitDistanceFactor = function (f, center) {
    this._obj.orbit(f, center);
}

CameraController.prototype.handleMouseWheel = function (e) {
    this._obj.orbitDistanceFactor(1 + e.wheelDelta * App.dt * this._move_speed * -0.05 * 0.1);
}

CameraController.prototype.handleMouseMove = function (e) {
    if (e.dragging) {
        var sign = e.deltax > 0 ? 1 : e.deltax < 0 ? -1 : 0;
        this._obj.orbit(sign * App.dt * this._rotation_speed, [0, -1, 0], [0, 0, 0]);
        this._obj.updateMatrices();
        sign = e.deltay > 0 ? -1 : e.deltay < 0 ? 1 : 0;
        var right = this._obj.getLocalVector([1, 0, 0]);
        this._obj.orbit(sign * App.dt * this._rotation_speed, right, [0, 0, 0]);
    }
}
CameraController.prototype.handleMouseDown = function (e) {

}

function NodeController(obj, options) {
    this._constructor(obj, options);

}
extendClass(NodeController, ObjectController);


NodeController.prototype.handleMouseWheel = function (e) {
}

NodeController.prototype.handleMouseMove = function (e) {

}

NodeController.prototype.handleMouseDown = function (e) {
    console.log("hola");
    this._obj.color = [Math.random(), Math.random(), Math.random()];
}
