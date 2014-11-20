var UI = {
    main_area: null,
    side_panel: null,
    side_panel_tabs: null,
    main_panel_tabs: null,
    main_panel: null,
    main_menu: null,


    init: function () {
        //call the init to setup
        LiteGUI.init({
            menubar: "menu-bar"
        });

        //create a main container and split it in two
        this.main_area = new LiteGUI.Area("mainarea", {content_id: "canvasarea", autoresize: true, inmediateResize: true});
        this.main_area.split("horizontal", [500, null], true);
        LiteGUI.add(this.main_area);

        this.createMainMenu();
        this.createLeftPanel();
        this.createMainPanel();

    },
    createAttributesTab: function () {
        var tab = this.side_panel_tabs.getTab("Attributes");
        tab.content.innerHTML = "";
        var widgets = new LiteGUI.Inspector();
        var node = App.canvas_controller.getSelectedNode();
        widgets.addColor("Color", node.color,  {
            callback: function(color) {
                node.color = color;
            }});
        tab.add(widgets);

    },
    createSceneTreeTab: function () {

        var tab = this.side_panel_tabs.addTab("SceneTree");
        var tree = new LiteGUI.Tree("SceneTree", { id: "scene-root-node", content: "root"});
        tab.add(tree);
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
        this.main_panel.dockTo(this.main_area.getSection(1), "full"); // section 0 is the left one

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


    }
};



