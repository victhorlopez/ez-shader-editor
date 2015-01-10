var UI = {
    main_area: null,
    left_upper_panel: null,
    left_upper_tabs: null,
    right_upper_panel:null,
    right_upper_tabs: null,
    main_panel_tabs: null,
    main_panel: null,
    main_menu: null,
    scene_tree: null,


    preinit: function () {
        //call the init to setup
        LiteGUI.init({
            menubar: "menu-bar"
        });

        //create a main container and split it in two
        this.main_area = new LiteGUI.Area("mainarea", {content_id: "canvasarea", autoresize: true, inmediateResize: true});
        this.main_area.split("horizontal", [390, null], true);
        this.main_area.getSection(1).split("horizontal", [null, 300], true);

        LiteGUI.add(this.main_area);

        this.createMainMenu();
        this.createLeftPanel();
        this.createRightPanel();
        this.createMainPanel();
    },
    postinit: function () {
        this.createToolsMenu();
    },
    createAttributesTab: function () {
        var tab = this.left_upper_tabs.getTab("Details");
        tab.content.innerHTML = "";
        var node = App.canvas_controller.getSelectedNode();
        var widgets = new LiteGUI.Inspector();
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
        tab.add(widgets);

    },
    createSceneTreeTab: function () {

    },
    updateSceneTreeTab: function () {

    },
    createRightPanel: function () {
        //create a left panel
        this.right_upper_panel = new LiteGUI.Panel("sidepanel", {title: "", width: 300});
        this.right_upper_panel.dockTo(this.main_area.getSection(1).getSection(1), "full"); // section 2 is the right one

        this.right_upper_tabs = new LiteGUI.Tabs("leftpanel-tabs");
        this.right_upper_tabs.addTab("Palette");

        this.right_upper_panel.add(this.right_upper_tabs);

    },
    createLeftPanel: function () {
        //create a left panel
        this.main_area.getSection(0).split("vertical", [440, null], true);
        this.left_upper_panel = new LiteGUI.Panel("sidepanel", {title: "", width: 390});
        this.left_upper_panel.dockTo(this.main_area.getSection(0).getSection(1), "full"); // section 0 is the left one

        this.left_upper_tabs = new LiteGUI.Tabs("leftpanel-tabs");
        this.left_upper_tabs.addTab("Details");

        this.left_upper_panel.add(this.left_upper_tabs);

        $(document).on("item_selected", function (event, item) {
            var node = App.scene.getNodeById(item.node_id);
            App.canvas_controller.selectNode(node);
            UI.createAttributesTab();
        });
        $(document).on("node_selected", function (event, node) {
            UI.createAttributesTab();
        });
        $(document).on("node_moved", function (event, node) {
            UI.createAttributesTab();
        });



    },
    createMainPanel: function () {
        //create main panel on the left side
        this.main_panel = new LiteGUI.Panel("mainpanel");
        this.main_panel.dockTo(this.main_area.getSection(1), "full"); // section 1 is the right one

        //create some tabs
        this.main_panel_tabs = new LiteGUI.Tabs("tabs");
        this.main_panel_tabs.addTab("Scene");

        this.main_panel.add(this.main_panel_tabs);
    },
    createMainMenu: function () {

        LiteGUI.mainmenu.add("Scene Editor", {callback: function () {
            window.location = "index.html";
        }});

        LiteGUI.mainmenu.add("Shader Editor", {callback: function () {
            window.location = "shader_editor.html";
        }});

        this.main_menu = LiteGUI.mainmenu;


    },
    createToolsMenu: function () {

        $(this.main_area.getSection(0).root).append(' <div id="tools-menu" class="canvas-tools-menu"></div>');
        addTool("#tools-menu","translate","Translate the selected item", App.canvas_controller.onTranslateTool);
        addTool("#tools-menu","rotate","Rotate the selected item", App.canvas_controller.onRotateTool);
        addTool("#tools-menu","scale","Scale items", App.canvas_controller.onScaleTool);
        addTool("#tools-menu","unselect","No tool selected", App.canvas_controller.onNoTool, true);

        function addTool(parent_id,id, on_hover_info, event_callback, selected){
            $(parent_id).append('<div id="tool-'+id+'" class="canvas-tool " title="'+on_hover_info+'">   </div>');
            var tag = $('#tool-'+id);
            if(selected)
                tag.addClass("selected");
            //creation of the tooltip
            tag.tooltip({ content: on_hover_info });
            // we attach the click function
            tag.bind("click", function(e) {
                tag.trigger("on_"+id+"_tool");
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
            $(document).on("on_"+id+"_tool", event_callback);

        }
    }
};



