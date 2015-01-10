var UI = {

    main_area: null,
    main_menu: null,
    main_panel: null,
    main_panel_tabs: null,

    editor: {
        tab: null,
        mid_area: null,
        left_area: null,
        right_area: null,
        left_upper_panel: null,
        left_upper_tabs: null,
        left_upper_tabs: null,
        left_lower_tabs: null,
        right_upper_panel: null,
        right_upper_tabs: null,
        right_lower_panel: null,
        right_lower_tabs: null,
        canvas_id: null,
        mode: null
    },

    preinit: function () {
        //call the init to setup
        LiteGUI.init({
            menubar: "menu-bar"
        });

        this.createMainArea();
        this.createMainMenu();
        this.createLeftPanel();
        this.createRightPanel();
        this.createMainPanel();
        this.changeMode("scene");
    },
    postinit: function () {
        this.createToolsMenu();
    },
    getCanvasContainer: function () {
        return $("#" + this.canvas_id);
    },
    getCanvasWidthAndHeight: function () {
        var container = $("#" + this.canvas_id);
        return {width: container.width(), height: container.parent().parent().height() - container.parent().height()};
    },
    createMainArea: function () {

        this.main_area = new LiteGUI.Area("main_area", {content_id: "main_area", autoresize: true, inmediateResize: true});
        this.main_area.split("horizontal", [390, null], true);
        this.main_area.getSection(1).split("horizontal", [null, 390], true);
        this.editor.left_area = this.main_area.getSection(0);
        this.editor.mid_area = this.main_area.getSection(1).getSection(0);
        this.editor.right_area = this.main_area.getSection(1).getSection(1);
        LiteGUI.add(this.main_area);

    },
    createRightPanel: function () {
        //create a left panel
        this.editor.right_area.split("vertical", [175, null], true);
        this.editor.right_upper_panel = new LiteGUI.Panel("right-sidepanel", {title: "", width: 390});
        this.editor.right_upper_panel.dockTo(this.editor.right_area, "full"); // section 0 is the left one
        this.editor.right_lower_panel = new LiteGUI.Panel("right-sidepanel", {title: "", width: 390});
        this.editor.right_lower_panel.dockTo(this.editor.right_area.getSection(1), "full"); // section 0 is the left one

        this.editor.right_upper_tabs = new LiteGUI.Tabs("rightpanel-upper-tabs");
        this.editor.right_lower_tabs = new LiteGUI.Tabs("rightpanel-lower-tabs");
        this.editor.right_upper_panel.add(this.editor.right_upper_tabs);
        this.editor.right_lower_panel.add(this.editor.right_lower_tabs);
    },
    createLeftPanel: function () {
        //create a left panel
        this.editor.left_upper_panel = new LiteGUI.Panel("left-sidepanel", {title: "", width: 390});
        this.editor.left_upper_panel.dockTo(this.editor.left_area, "full");

        this.editor.left_upper_tabs = new LiteGUI.Tabs("leftpanel-tabs");
               this.editor.left_upper_panel.add(this.editor.left_upper_tabs);


    },
    createPaletteTab: function (container) {

        container = container || this.editor.left_upper_panel; // default place
        var tab = container.getTab("Palette");
        if(!container.selected)
            tab = container.addTab("Palette", {selected: true});
        tab.content.innerHTML = "";
    },
    createSceneTreeTab: function (container) {

        container = container || this.editor.right_upper_tabs; // default place
        var tab = container.getTab("SceneTree");
        if(!container.selected)
            tab = container.addTab("SceneTree", {selected: true});
        tab.content.innerHTML = "";
        this.scene_tree = new LiteGUI.Tree("SceneTree", {id: "uid_0", node_id: "0", content: "root", allow_rename: false}); // hardcoded values, need improvement
        tab.add(this.scene_tree);


        // Events of scene tree tab
        $(document).on("item_selected", function (event, item) {
            var node = App.scene.getNodeById(item.node_id);
            App.canvas_controller.selectNode(node);
            UI.createAttributesTab();
        });
        $(document).on("node_selected", function (event, node) {
            UI.scene_tree.setSelectedItem("uid_" + node._uid);
            UI.createAttributesTab();
        });
        $(document).on("node_moved", function (event, node) {
            UI.createAttributesTab();
        });


    },
    updateSceneTreeTab: function () {
        var nodes = App.scene.root.getAllChildren();
        for (var i in nodes) {
            var node = nodes[i];
            if (!node.unselectable) {
                var parent_id = node.parentNode ? "uid_" + node.parentNode._uid : null;
                var node_uid = "uid_" + node._uid;
                this.scene_tree.insertItem({id: node_uid, node_id: node.id, content: node.id ? node.id : "root", allow_rename: (parent_id != null)}, parent_id);
            }
        }
    },
    createSceneTab: function (container,id) {
        container = container || this.main_panel_tabs; // default place
        this.canvas_id = id || "canvas_render";
        var tab = container.getTab("Scene");
        if(!container.selected)
            tab = container.addTab("Scene", {id: this.canvas_id});
        //tab.content.innerHTML = "";

    },
    createNodeGraphTab: function (container) {
        container = container || this.editor.main_panel_tabs; // default place
        var id = "node_canvas";
        var tab = container.getTab("Shader Editor");
        if(!container.selected)
            tab = container.addTab("Shader Editor", {id: id, selected:true });
        tab.content.innerHTML = "";

        container = $("#"+ id);
        var h = container.parent().parent().height() - container.parent().height();
        var w = container.width();
        var html = "<canvas class='graph' width='"+ w +"' height='"+ h +"'></canvas>";
        container.append(html);
        var graph = new LGraph();
        var gcanvas = new LGraphCanvas(container.children()[0], graph);
        gcanvas.background_image = "../img/grid.png";
        gcanvas.drawBackCanvas();

    },
    createAttributesTab: function (container) {
        container = container || this.editor.right_lower_tabs; // default place
        var tab = container.getTab("Attributes");
        if(!container.selected)
            tab = container.addTab("Attributes", {selected:true });
        tab.content.innerHTML = "";

        var widgets = new LiteGUI.Inspector();
        if (App.canvas_controller) {
            var node = App.canvas_controller.getSelectedNode();
            if (node) {
                widgets.addColor("Color", node.color, {
                    callback: function (color) {
                        node.color = color;
                    }});
                widgets.addSection("Transform");
                widgets.addVector3("Position", node.getGlobalPosition(), {
                    callback: function (pos) {
                        node.position = pos;
                    }});
                widgets.addVector3("Rotation", node.rotation, {
                    callback: function (rot) {
                        node.setRotationFromEuler(rot);
                    }});
                widgets.addVector3("Scale", node.scale, {
                    callback: function (sca) {
                        node.scale = sca;
                    }});
            }
        }
        widgets.addSeparator();
        widgets.addButton("","Edit Shader",{callback: function() { UI.changeMode("shader");}});
        tab.add(widgets);

    },
    createMainPanel: function () {
        //create main panel on the left side
        this.main_panel = new LiteGUI.Panel("mainpanel");
        this.main_panel.dockTo(this.editor.mid_area, "full"); // section 1 is the right one
        this.main_panel_tabs = new LiteGUI.Tabs("mainpanel-tabs");
        this.main_panel.add(this.main_panel_tabs);
    },
    createMainMenu: function () {


//        LiteGUI.mainmenu.add("file/new");
//        LiteGUI.mainmenu.add("file/open");
//        LiteGUI.mainmenu.add("file/save");
//        LiteGUI.mainmenu.add("edit/undo");
//        LiteGUI.mainmenu.add("edit/redo");
//        LiteGUI.mainmenu.add("edit/");
//        LiteGUI.mainmenu.add("edit/copy", {callback: function () {
//            trace("FOOOO");
//        }});
//        LiteGUI.mainmenu.add("edit/paste");
//        LiteGUI.mainmenu.add("edit/clear");
//
//        LiteGUI.mainmenu.add("view/bottom panel", {callback: function () {
//            docked_bottom.show();
//        }});
//        LiteGUI.mainmenu.add("view/fixed size", {callback: function () {
//            LiteGUI.setWindowSize(1000, 600);
//        }});
//        LiteGUI.mainmenu.add("view/");
//        LiteGUI.mainmenu.add("view/side panel", {callback: function () {
//            //createSidePanel();
//        }});
//        LiteGUI.mainmenu.add("view/maximize", {callback: function () {
//            LiteGUI.setWindowSize();
//        }});
//
//        LiteGUI.mainmenu.add("debug/dialog", {callback: function () {
//            //createDialog();
//        }});
//
//        LiteGUI.mainmenu.add("debug/message", {callback: function () {
//            LiteGUI.showMessage("This is an example of message");
//        }});
//
//        LiteGUI.mainmenu.add("debug/modal", {callback: function () {
//            var dialog = new LiteGUI.Panel("blarg", {width: 300, height: 100, close: true, content: "This is an example of modal dialog"});
//            dialog.makeModal();
//            dialog.addButton("Accept", {close: true});
//            dialog.addButton("Cancel", {close: 'fade'});
//        }});


//        LiteGUI.mainmenu.add("Scene Editor", {callback: function () {
//            window.location = "index.html";
//        }});
//
//        LiteGUI.mainmenu.add("Shader Editor", {callback: function () {
//            window.location = "shader_editor.html";
//        }});
//
//        this.main_menu = LiteGUI.mainmenu;


    },
    createToolsMenu: function () {

        $(this.editor.mid_area.root).append(' <div id="tools-menu" class="canvas-tools-menu"></div>');
        addTool("#tools-menu", "translate", "Translate the selected item", App.canvas_controller.onTranslateTool);
        addTool("#tools-menu", "rotate", "Rotate the selected item", App.canvas_controller.onRotateTool);
        addTool("#tools-menu", "scale", "Scale items", App.canvas_controller.onScaleTool);
        addTool("#tools-menu", "unselect", "No tool selected", App.canvas_controller.onNoTool, true);

        function addTool(parent_id, id, on_hover_info, event_callback, selected) {
            $(parent_id).append('<div id="tool-' + id + '" class="canvas-tool " title="' + on_hover_info + '">   </div>');
            var tag = $('#tool-' + id);
            if (selected)
                tag.addClass("selected");
            //creation of the tooltip
            tag.tooltip({ content: on_hover_info });
            // we attach the click function
            tag.bind("click", function (e) {
                tag.trigger("on_" + id + "_tool");
                $("#tools-menu div").removeClass("selected");
                tag.addClass("selected");
            });
            // we add the hover eeffect
            $("#tools-menu div").hover(
                function () {
                    $(this).addClass("hover");
                },
                function () {
                    $(this).removeClass("hover");
                }
            );
            $(document).on("on_" + id + "_tool", event_callback);

        }
    },
    moveSceneTab: function (container) {
        this.createSceneTab(container, "canvas_shader_render");
        App.renderer.saveState();
        App.scene.clear();
        App.renderer.clear();
        App.createShaderEditorScene();
        var tab = this.editor.right_upper_tabs.getTab("Scene");
        var canvas_ct = $("#canvas_shader_render");

        canvas_ct.append( gl.canvas );

        //tab.add(gl.canvas);
        console.log(gl);

    },
    resetTabs: function(container) {
        var nodes = container.root.childNodes;
        for(var i=0; i<nodes.length; i++) {
            nodes[i].innerHTML = "";
        }
        container.selected = null;
    },

    changeMode: function (new_mode) {

        if(new_mode == "scene"){
            this.createSceneTab(this.main_panel_tabs);
            this.createPaletteTab(this.editor.left_upper_tabs);
            this.createSceneTreeTab(this.editor.right_upper_tabs);
            this.createAttributesTab(this.editor.right_lower_tabs);
        } else if( new_mode == "shader" ){
            this.resetTabs(this.editor.right_upper_tabs);
            this.resetTabs(this.editor.left_upper_tabs);
            this.resetTabs(this.editor.right_lower_tabs);
            this.resetTabs(this.main_panel_tabs);

            this.editor.right_area.moveSplit(265); // temporary workaround TODO remove this

            this.createNodeGraphTab(this.main_panel_tabs);
            this.moveSceneTab(this.editor.right_upper_tabs);
            this.createPaletteTab(this.editor.left_upper_tabs);
            this.createAttributesTab(this.editor.right_lower_tabs);
            this.updateSceneTreeTab();
        }
        this.editor.mode = new_mode;
    }
};



