/**
 * Created by vik on 15/01/2015.
 */
var vik = vik || {};
vik.app = vik.app || {};
vik.ui = vik.ui || {};


vik.ui = (function () {
    var module = {};
    var details_gui = {};
    var palette_gui = {};


    module.init = function () {
        loadLayout();
    }

    module.onResize = function () {
        details_gui.width = details_gui.parent_node.width();
        details_gui.domElement.style.height = details_gui.parent_node.height();
        palette_gui.width = palette_gui.parent_node.width();
        palette_gui.domElement.style.height = palette_gui.parent_node.height();
    }


    module.updateLeftPanel = function( node ){

        for(var i in details_gui.items){
            details_gui.remove(details_gui.items[i]);
        }
        details_gui.items = [];
        var obj = node.properties;
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                var controller = details_gui.add(obj, property);
                details_gui.items.push(controller);
                controller.onChange(function(value) {
                    vik.app.compile();
                });
            }
        }
    }


    function loadLayout() {
        $('#layout').w2layout({
            name: 'main_layout',
            parent_layout: null,
            panels: [
                { type: 'top', size: 30 }, // so far top not used
                { type: 'main' },
                { type: 'left', size: '25%', resizable: true },
                { type: 'right', size: '270', resizable: true}
            ],
            resize_cancel: true
        });

        $('#layout_main_layout_panel_left').w2layout({
            name: 'layout2',
            parent_layout:'main_layout',
            panel_holder:'left',
            panels: [

                { type: 'left', size: '30', resizable: true, hidden:true },

                { type: 'main', size: '50%', resizable: true,
                    tabs: {
                        active: 'Preview',
                        tabs: [
                            { id: 'Preview', caption: 'Preview', closable: true }
                        ],
                        onClick: function (event) {
                            $('#tab-content').html('Tab: ' + event.target);
                        }
                    }
                },
                { type: 'preview', size: '50%', resizable: true,
                    tabs: {
                        active: 'Details',
                        tabs: [
                            { id: 'Details', caption: 'Details', closable: true }
                        ],
                        onClick: function (event) {
                            $('#tab-content').html('Tab: ' + event.target);
                        }
                    }
                }
            ],
            resize_cancel: true
        });
        w2ui['layout2'].content('left', w2ui['layout2_preview_tabs'].getMaximizeButton('Details', 'left') + w2ui['layout2_main_tabs'].getMaximizeButton('Preview', 'left') );

        $('#layout_main_layout_panel_right').w2layout({
            name: 'layout3',
            parent_layout:'main_layout',
            panel_holder:'right',
            panels: [

                { type: 'right', size: '30', resizable: true, hidden:true },

                { type: 'main', size: '50%', resizable: true,
                    tabs: {
                        active: 'Palette',
                        tabs: [
                            { id: 'Palette', caption: 'Palette', closable: true }
                        ],
                        onClick: function (event) {
                            $('#tab-content').html('Tab: ' + event.target);
                        }
                    }
                }
            ],
            resize_cancel: true
        });
        w2ui['layout3'].content('right',w2ui['layout3_main_tabs'].getMaximizeButton('Palette', 'right') );


        //+ w2ui['layout2_main_tabs'].getMaximizeButton('Preview')

        var FizzyText = function () {
            this.message = 'dat.gui';
            this.speed = 0.8;
            this.displayOutline = false;
            this.noiseStrength = 10;
            this.growthSpeed = -3;
            this.maxSize = 24;
            this.color0 = "#ffae23"; // CSS string
            this.color1 = [ 0, 128, 255 ]; // RGB array
            this.color2 = [ 0, 128, 255, 0.3 ]; // RGB with alpha
            this.color3 = { h: 350, s: 0.9, v: 0.3 }; // Hue, saturation, value

            this.explode = function () {
            };
            // Define render logic ...
        };


        var text = new FizzyText();
        details_gui = new dat.GUI({
            resizable: true,
            hideable: false,
        });
        details_gui.parent_node = $("#layout_layout2_panel_preview div.w2ui-panel-content");
        details_gui.width = details_gui.parent_node.width();
//        details_gui.add(text, 'message');
//        details_gui.add(text, 'speed', -5, 5);
//        details_gui.add(text, 'displayOutline');
//        details_gui.add(text, 'explode');
//        details_gui.addColor(text, 'color0');
//        details_gui.addColor(text, 'color1');
//        details_gui.addColor(text, 'color2');
//        details_gui.addColor(text, 'color3');
//        var f1 = details_gui.addFolder('Flow Field');
//        f1.add(text, 'speed');
//        f1.add(text, 'noiseStrength');
//
//        var f2 = details_gui.addFolder('Letters');
//        f2.add(text, 'growthSpeed');
//        f2.add(text, 'maxSize');
//        f2.add(text, 'message');
//
//        details_gui.add(text, 'noiseStrength').step(5); // Increment amount
//        details_gui.add(text, 'growthSpeed', -5, 5); // Min and max
//        details_gui.add(text, 'maxSize').min(0).step(0.25); // Mix and match
//
//        f2.open();

        details_gui.parent_node[0].appendChild(details_gui.domElement);


        text = new FizzyText();
        palette_gui = new dat.GUI({
            resizable: false,
            hideable: false
        });
        palette_gui.parent_node = $("#layout_layout3_panel_main div.w2ui-panel-content");
        palette_gui.width = palette_gui.parent_node.width();
        palette_gui.add(text, 'message');
        palette_gui.add(text, 'speed', -5, 5);
        palette_gui.add(text, 'displayOutline');
        palette_gui.add(text, 'explode');
        palette_gui.addColor(text, 'color0');
        palette_gui.addColor(text, 'color1');
        palette_gui.addColor(text, 'color2');
        palette_gui.addColor(text, 'color3');


        palette_gui.add(text, 'noiseStrength').step(5); // Increment amount
        palette_gui.add(text, 'growthSpeed', -5, 5); // Min and max
        palette_gui.add(text, 'maxSize').min(0).step(0.25); // Mix and match


        palette_gui.parent_node[0].appendChild(palette_gui.domElement);


//        $("#layout_main_layout_panel_top div.w2ui-panel-content").append("<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('main',true)\">Top</button>" +
//            "<button class=\"btn\" onclick=\"w2ui['main_layout'].toggle('left',true)\">Left</button>" +
//            "<button class=\"btn\" onclick=\"w2ui['main_layout'].toggle('right',true)\">Right</button>" +
//            "<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('preview',true )\">Preview</button>" +
//            "<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('main' ,true)\">main</button>");
    }

    return module;

})();


