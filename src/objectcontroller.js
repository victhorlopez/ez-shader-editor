
function ObjectController(obj, options)
{
    this._constructor(obj,options);
}

ObjectController.prototype._constructor = function(obj,options)
{
    this._object = obj;
    this._rotation_speed = options.rotation_speed || 10.0;
    this._move_speed = options.move_speed || 10.0;
}

ObjectController.prototype.move = function(v){
    obj.move(v);
}

ObjectController.prototype.rotate = function(angle_in_deg, axis){
    obj.rotate(angle_in_deg, axis);
}

ObjectController.prototype.onMouseEvent = function(e){
    if(e.eventType == "mousewheel"){
        this.handleMouseWheel(e);
    }
}


function CameraController(obj,options){

    this._constructor(obj,options);

}
extendClass(CameraController, ObjectController);

CameraController.prototype.orbit = function(angle_in_deg, axis, center){
    obj.orbit(angle_in_deg, axis, center);
}

CameraController.prototype.orbitDistanceFactor = function(f, center){
    obj.orbit(f, center);
}

CameraController.prototype.handleMouseWheel = fucntion(e){
    this.obj.orbitDistanceFactor(1 + e.wheelDelta * App.dt * 20 * -0.05 * 0.1  );
}
CameraController.prototype.handleMouseDrag = fucntion(e){
    this.obj.orbitDistanceFactor(1 + e.wheelDelta * App.dt * 20 * -0.05 * 0.1  );
}


function NodeController(obj,options){

    this._constructor(obj,options);

}
extendClass(NodeController, ObjectController);

NodeController.prototype.NodeController = function(e){


}
