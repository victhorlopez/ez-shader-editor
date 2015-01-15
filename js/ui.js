/**
 * Created by vik on 15/01/2015.
 */
var vik = vik || {};
vik.app = vik.app || {};
vik.ui = vik.ui || {};


vik.ui = (function () {
    var module = {};

    module.init = function () {
        loadLayout();
    }

    function loadLayout() {
        $('#layout').w2layout({
            name: 'main_layout',
            panels: [
                { type: 'top', size: 30 }, // so far top not used
                { type: 'main' },
                { type: 'left', size: '25%', resizable: true },
                { type: 'right', size: '25%', resizable: true,
                    tabs: {
                        active: 'Palette',
                        tabs: [
                            { id: 'Palette', caption: 'Palette', closable: true }
                        ],
                        onClick: function (event) {
                            $('#tab-content').html('Tab: ' + event.target);
                        }
                    }
                },

            ],
            resize_cancel: true
        });

        $('#layout_main_layout_panel_left').w2layout({
            name: 'layout2',
            panels: [
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


        var customContainer = $("#layout_layout2_panel_preview div.w2ui-panel-content");
        var text = new FizzyText();
        var gui = new dat.GUI({
            resizable: false,
            hideable: false
        });
        gui.width = customContainer.width();
        gui.add(text, 'message');
        gui.add(text, 'speed', -5, 5);
        gui.add(text, 'displayOutline');
        gui.add(text, 'explode');
        gui.addColor(text, 'color0');
        gui.addColor(text, 'color1');
        gui.addColor(text, 'color2');
        gui.addColor(text, 'color3');
        var f1 = gui.addFolder('Flow Field');
        f1.add(text, 'speed');
        f1.add(text, 'noiseStrength');

        var f2 = gui.addFolder('Letters');
        f2.add(text, 'growthSpeed');
        f2.add(text, 'maxSize');
        f2.add(text, 'message');

        gui.add(text, 'noiseStrength').step(5); // Increment amount
        gui.add(text, 'growthSpeed', -5, 5); // Min and max
        gui.add(text, 'maxSize').min(0).step(0.25); // Mix and match

        f2.open();

        customContainer[0].appendChild(gui.domElement);
        $("#layout_layout2_panel_preview div.w2ui-panel-content")[0].appendChild(gui.domElement);

        var text = new FizzyText();
        var gui2 = new dat.GUI({
            resizable: false,
            hideable: false
        });
        gui2.width = customContainer.width();
        gui2.add(text, 'message');
        gui2.add(text, 'speed', -5, 5);
        gui2.add(text, 'displayOutline');
        gui2.add(text, 'explode');
        gui2.addColor(text, 'color0');
        gui2.addColor(text, 'color1');
        gui2.addColor(text, 'color2');
        gui2.addColor(text, 'color3');


        gui.add(text, 'noiseStrength').step(5); // Increment amount
        gui.add(text, 'growthSpeed', -5, 5); // Min and max
        gui.add(text, 'maxSize').min(0).step(0.25); // Mix and match

        f2.open();

        customContainer[0].appendChild(gui2.domElement);
        $("#layout_main_layout_panel_right div.w2ui-panel-content")[0].appendChild(gui2.domElement);
        $("#layout_main_layout_panel_top div.w2ui-panel-content").append("<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('main')\">Top</button>" +
            "<button class=\"btn\" onclick=\"w2ui['main_layout'].toggle('left')\">Left</button>" +
            "<button class=\"btn\" onclick=\"w2ui['main_layout'].toggle('right')\">Right</button>" +
            "<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('preview')\">Preview</button>" +
            "<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('main')\">main</button>" +
            "<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('bottom')\">Bottom</button>");



    }

    return module;

})();


