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
        // remove old controllers
        for(var i in details_gui.items){
            details_gui.remove(details_gui.items[i]);
        }
        details_gui.items = [];
        // take the properties nd its options
        var obj = node.properties;
        var opts = node.options;
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {


                var opts_ctrl = opts ? opts[property] : undefined;
                var min = opts_ctrl ? (opts_ctrl.min) : undefined;
                var max = opts_ctrl ? (opts_ctrl.max) : undefined;
                var step = opts_ctrl ? (opts_ctrl.step) : undefined;

                var controller = details_gui.add(obj, property, min, max, step );
                details_gui.items.push(controller);
                controller.onChange(function(value) {
                    vik.app.compile();
                });
            }
        }
    }


    function loadLayout() {
        // main layout
        $('#layout').w2layout({
            name: 'main_layout',
            parent_layout: null,
            panels: [
                { type: 'top', size: 67,
                    content:'<div id="top-buttons">' +
                        '<div class="top-button"><a id="download_code" href="#" download="graph.json"><i  class="fa fa-download fa-2x"></i>Download</a></div>' +
                        '<div class="top-button"><a id="load_graph" href="#"><i  class="fa fa-upload fa-2x"></i>Load</a></div>' +
                        '</div>' }, // so far top not used
                { type: 'main', content:'<div id="code" style="display:none"></div>',
                    tabs: {
                    active: 'Graph',
                    tabs: [
                        { id: 'Graph', caption: 'Graph', closable: false },
                        { id: 'Code', caption: 'Code', closable: false }
                    ],
                    onClick: function (event) {
                        $('#code').toggle();
                        $('#graph').toggle();
                    }
                } },
                { type: 'left', size: '25%', resizable: true },
                { type: 'right', size: '270', resizable: true}
            ],
            resize_cancel: true
        });
        // layout inside main_layout left panel
        // named as layout2
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

        // layout inside main_layout right panel
        // named as layout3
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

        details_gui = new dat.GUI({
            resizable: true,
            hideable: false,
            autoPlace: false
        });
        details_gui.parent_node = $("#layout_layout2_panel_preview div.w2ui-panel-content");
        details_gui.width = details_gui.parent_node.width();


        details_gui.parent_node[0].appendChild(details_gui.domElement);

        palette_gui = new dat.GUI({
            resizable: false,
            hideable: false,
            autoPlace: false
        });
        palette_gui.parent_node = $("#layout_layout3_panel_main div.w2ui-panel-content");
        palette_gui.width = palette_gui.parent_node.width();
        var node_types = LiteGraph.getNodeTypesCategories();
        for(var i = node_types.length -1; i >= 0; --i){
            if(node_types[i] !== ""){
                var f = palette_gui.addFolder(node_types[i]);
                var nodes = LiteGraph.getNodeTypesInCategory(node_types[i]);
                for(var j = nodes.length -1; j >= 0; --j) {
                    if(nodes[j]){
                        var o = {};
                        o[nodes[j].title] = function() {};
                        var controller = f.add(o, nodes[j].title);
                        var html_node = controller.__li.firstChild.firstChild;
                        html_node.id = f.name +"/"+ controller.property;
                        html_node.setAttribute('draggable', true);
                        html_node.addEventListener('dragstart', function(e) {
                            e.dataTransfer.setData('text', this.id);
                        });
                    }
                }
                f.open();
            }

        }

        palette_gui.parent_node[0].appendChild(palette_gui.domElement);

// for debugging panels
//        $("#layout_main_layout_panel_top div.w2ui-panel-content").append("<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('main',true)\">Top</button>" +
//            "<button class=\"btn\" onclick=\"w2ui['main_layout'].toggle('left',true)\">Left</button>" +
//            "<button class=\"btn\" onclick=\"w2ui['main_layout'].toggle('right',true)\">Right</button>" +
//            "<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('preview',true )\">Preview</button>" +
//            "<button class=\"btn\" onclick=\"w2ui['layout2'].toggle('main' ,true)\">main</button>");
    }

    return module;

})();


