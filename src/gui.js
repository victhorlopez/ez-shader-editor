var UI = {
    main_area: null,
    side_panel: null,
    side_panel_tabs: null,
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
        this.main_area.split("horizontal", [225, null], true);
        LiteGUI.add(this.main_area);

        //this.createMainMenu();
        this.createLeftPanel();
        this.createMainPanel();
    },
    postinit: function () {
        this.createToolsMenu();
    },
    createAttributesTab: function () {
        var tab = this.side_panel_tabs.getTab("Attributes");
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


        var tab = this.side_panel_tabs.addTab("SceneTree");
        this.scene_tree = new LiteGUI.Tree("SceneTree", {id: "uid_0", node_id: "0", content: "root", allow_rename: false}); // hardcoded values, need improvement
        tab.add(this.scene_tree);
    },
    updateSceneTreeTab: function () {
        var nodes = App.scene.root.getAllChildren();
        for (var i in nodes) {
            var node = nodes[i];
            if (!node.unselecteble) {
                var parent_id = node.parentNode ? "uid_" + node.parentNode._uid : null;
                var node_uid = "uid_" + node._uid;
                this.scene_tree.insertItem({id: node_uid, node_id: node.id, content: node.id ? node.id : "root", allow_rename: (parent_id != null)}, parent_id);
            }
        }
    },
    createTestTab: function () {
        //create a inspector (widget container)
        var widgets = new LiteGUI.Inspector();
        widgets.addTitle("Dialogs");
        widgets.addButton("Alert", "Show", function () {
            LiteGUI.alert("foo");
        });
        widgets.addButton("Prompt", "Show", function () {
            LiteGUI.prompt("What are you?");
        });
        widgets.addButton("Confirm", "Show", function () {
            LiteGUI.confirm("Are you sure?");
        });
        widgets.addButton("Dialog", "Show", function () {
            var dialog = new LiteGUI.Dialog("simple-dialog", {title: "My dialog", close: true, draggable: true});
            dialog.show();
            dialog.center();
        });
        widgets.addSeparator();
        var tab = this.side_panel_tabs.addTab("Test");
        tab.add(widgets);
    },
    createLeftPanel: function () {
        //create a left panel
        this.side_panel = new LiteGUI.Panel("sidepanel", {title: "Inspector", width: 500});
        this.side_panel.dockTo(this.main_area.getSection(0), "full"); // section 1 is the right one

        this.side_panel_tabs = new LiteGUI.Tabs("leftpanel-tabs");
        this.side_panel_tabs.addTab("Attributes");
        this.createSceneTreeTab();

//        this.createTestTab(tab);

        this.side_panel.add(this.side_panel_tabs);

    },
    createMainPanel: function () {
        //create main panel on the left side
        this.main_panel = new LiteGUI.Panel("mainpanel");
        this.main_panel.dockTo(this.main_area.getSection(1), "full"); // section 1 is the right one

        //create some tabs
        this.main_panel_tabs = new LiteGUI.Tabs("tabs");
        this.main_panel_tabs.addTab("Scene");

//        var code_tab = tabs.addTab("Code");
//
//        //show the code applying the most basic code beautify algorithm (by me!)
//        var code = escapeHtmlEntities(document.querySelector("body script").innerHTML);
//        code = beautifyCode(code);
//
//        //code_tab.content.innerHTML = "<h2>Code of this example</h2><pre>" + code + "</pre>";
//        tabs.addTab("Example");

        this.main_panel.add(this.main_panel_tabs);
    },
    createMainMenu: function () {


        LiteGUI.mainmenu.add("file/new");
        LiteGUI.mainmenu.add("file/open");
        LiteGUI.mainmenu.add("file/save");
        LiteGUI.mainmenu.add("edit/undo");
        LiteGUI.mainmenu.add("edit/redo");
        LiteGUI.mainmenu.add("edit/");
        LiteGUI.mainmenu.add("edit/copy", {callback: function () {
            trace("FOOOO");
        }});
        LiteGUI.mainmenu.add("edit/paste");
        LiteGUI.mainmenu.add("edit/clear");

        LiteGUI.mainmenu.add("view/bottom panel", {callback: function () {
            docked_bottom.show();
        }});
        LiteGUI.mainmenu.add("view/fixed size", {callback: function () {
            LiteGUI.setWindowSize(1000, 600);
        }});
        LiteGUI.mainmenu.add("view/");
        LiteGUI.mainmenu.add("view/side panel", {callback: function () {
            //createSidePanel();
        }});
        LiteGUI.mainmenu.add("view/maximize", {callback: function () {
            LiteGUI.setWindowSize();
        }});

        LiteGUI.mainmenu.add("debug/dialog", {callback: function () {
            //createDialog();
        }});

        LiteGUI.mainmenu.add("debug/message", {callback: function () {
            LiteGUI.showMessage("This is an example of message");
        }});

        LiteGUI.mainmenu.add("debug/modal", {callback: function () {
            var dialog = new LiteGUI.Panel("blarg", {width: 300, height: 100, close: true, content: "This is an example of modal dialog"});
            dialog.makeModal();
            dialog.addButton("Accept", {close: true});
            dialog.addButton("Cancel", {close: 'fade'});
        }});

        this.main_menu = LiteGUI.mainmenu;


    },
    createToolsMenu: function () {

        $(this.main_area.root).append(' <div id="tools-menu" class="canvas-tools-menu"></div>');
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



