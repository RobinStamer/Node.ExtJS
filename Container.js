/*
This file is part of Ext JS 3.4

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-04-03 15:07:25
*/

Ext('Ext.Component')

/**
 * @class Ext.Container
 * @extends Ext.Component
 * <p>Base class for any {@link Ext.Component} that may contain other Components. Containers handle the
 * basic behavior of containing items, namely adding, inserting and removing items.</p>
 *
 * <p>The most commonly used Container classes are {@link Ext.Panel}, {@link Ext.Window} and {@link Ext.TabPanel}.
 * If you do not need the capabilities offered by the aforementioned classes you can create a lightweight
 * Container to be encapsulated by an HTML element to your specifications by using the
 * <code><b>{@link Ext.Component#autoEl autoEl}</b></code> config option. This is a useful technique when creating
 * embedded {@link Ext.layout.ColumnLayout column} layouts inside {@link Ext.form.FormPanel FormPanels}
 * for example.</p>
 *
 * <p>The code below illustrates both how to explicitly create a Container, and how to implicitly
 * create one using the <b><code>'container'</code></b> xtype:<pre><code>
// explicitly create a Container
var embeddedColumns = new Ext.Container({
    autoEl: 'div',  // This is the default
    layout: 'column',
    defaults: {
        // implicitly create Container by specifying xtype
        xtype: 'container',
        autoEl: 'div', // This is the default.
        layout: 'form',
        columnWidth: 0.5,
        style: {
            padding: '10px'
        }
    },
//  The two items below will be Ext.Containers, each encapsulated by a &lt;DIV> element.
    items: [{
        items: {
            xtype: 'datefield',
            name: 'startDate',
            fieldLabel: 'Start date'
        }
    }, {
        items: {
            xtype: 'datefield',
            name: 'endDate',
            fieldLabel: 'End date'
        }
    }]
});</code></pre></p>
 *
 * <p><u><b>Layout</b></u></p>
 * <p>Container classes delegate the rendering of child Components to a layout
 * manager class which must be configured into the Container using the
 * <code><b>{@link #layout}</b></code> configuration property.</p>
 * <p>When either specifying child <code>{@link #items}</code> of a Container,
 * or dynamically {@link #add adding} Components to a Container, remember to
 * consider how you wish the Container to arrange those child elements, and
 * whether those child elements need to be sized using one of Ext's built-in
 * <b><code>{@link #layout}</code></b> schemes. By default, Containers use the
 * {@link Ext.layout.ContainerLayout ContainerLayout} scheme which only
 * renders child components, appending them one after the other inside the
 * Container, and <b>does not apply any sizing</b> at all.</p>
 * <p>A common mistake is when a developer neglects to specify a
 * <b><code>{@link #layout}</code></b> (e.g. widgets like GridPanels or
 * TreePanels are added to Containers for which no <code><b>{@link #layout}</b></code>
 * has been specified). If a Container is left to use the default
 * {@link Ext.layout.ContainerLayout ContainerLayout} scheme, none of its
 * child components will be resized, or changed in any way when the Container
 * is resized.</p>
 * <p>Certain layout managers allow dynamic addition of child components.
 * Those that do include {@link Ext.layout.CardLayout},
 * {@link Ext.layout.AnchorLayout}, {@link Ext.layout.FormLayout}, and
 * {@link Ext.layout.TableLayout}. For example:<pre><code>
//  Create the GridPanel.
var myNewGrid = new Ext.grid.GridPanel({
    store: myStore,
    columns: myColumnModel,
    title: 'Results', // the title becomes the title of the tab
});

myTabPanel.add(myNewGrid); // {@link Ext.TabPanel} implicitly uses {@link Ext.layout.CardLayout CardLayout}
myTabPanel.{@link Ext.TabPanel#setActiveTab setActiveTab}(myNewGrid);
 * </code></pre></p>
 * <p>The example above adds a newly created GridPanel to a TabPanel. Note that
 * a TabPanel uses {@link Ext.layout.CardLayout} as its layout manager which
 * means all its child items are sized to {@link Ext.layout.FitLayout fit}
 * exactly into its client area.
 * <p><b><u>Overnesting is a common problem</u></b>.
 * An example of overnesting occurs when a GridPanel is added to a TabPanel
 * by wrapping the GridPanel <i>inside</i> a wrapping Panel (that has no
 * <code><b>{@link #layout}</b></code> specified) and then add that wrapping Panel
 * to the TabPanel. The point to realize is that a GridPanel <b>is</b> a
 * Component which can be added directly to a Container. If the wrapping Panel
 * has no <code><b>{@link #layout}</b></code> configuration, then the overnested
 * GridPanel will not be sized as expected.<p>
 *
 * <p><u><b>Adding via remote configuration</b></u></p>
 *
 * <p>A server side script can be used to add Components which are generated dynamically on the server.
 * An example of adding a GridPanel to a TabPanel where the GridPanel is generated by the server
 * based on certain parameters:
 * </p><pre><code>
// execute an Ajax request to invoke server side script:
Ext.Ajax.request({
    url: 'gen-invoice-grid.php',
    // send additional parameters to instruct server script
    params: {
        startDate: Ext.getCmp('start-date').getValue(),
        endDate: Ext.getCmp('end-date').getValue()
    },
    // process the response object to add it to the TabPanel:
    success: function(xhr) {
        var newComponent = eval(xhr.responseText); // see discussion below
        myTabPanel.add(newComponent); // add the component to the TabPanel
        myTabPanel.setActiveTab(newComponent);
    },
    failure: function() {
        Ext.Msg.alert("Grid create failed", "Server communication failure");
    }
});
</code></pre>
 * <p>The server script needs to return an executable Javascript statement which, when processed
 * using <code>eval()</code>, will return either a config object with an {@link Ext.Component#xtype xtype},
 * or an instantiated Component. The server might return this for example:</p><pre><code>
(function() {
    function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
    };

    var store = new Ext.data.Store({
        url: 'get-invoice-data.php',
        baseParams: {
            startDate: '01/01/2008',
            endDate: '01/31/2008'
        },
        reader: new Ext.data.JsonReader({
            record: 'transaction',
            idProperty: 'id',
            totalRecords: 'total'
        }, [
           'customer',
           'invNo',
           {name: 'date', type: 'date', dateFormat: 'm/d/Y'},
           {name: 'value', type: 'float'}
        ])
    });

    var grid = new Ext.grid.GridPanel({
        title: 'Invoice Report',
        bbar: new Ext.PagingToolbar(store),
        store: store,
        columns: [
            {header: "Customer", width: 250, dataIndex: 'customer', sortable: true},
            {header: "Invoice Number", width: 120, dataIndex: 'invNo', sortable: true},
            {header: "Invoice Date", width: 100, dataIndex: 'date', renderer: formatDate, sortable: true},
            {header: "Value", width: 120, dataIndex: 'value', renderer: 'usMoney', sortable: true}
        ],
    });
    store.load();
    return grid;  // return instantiated component
})();
</code></pre>
 * <p>When the above code fragment is passed through the <code>eval</code> function in the success handler
 * of the Ajax request, the code is executed by the Javascript processor, and the anonymous function
 * runs, and returns the instantiated grid component.</p>
 * <p>Note: since the code above is <i>generated</i> by a server script, the <code>baseParams</code> for
 * the Store, the metadata to allow generation of the Record layout, and the ColumnModel
 * can all be generated into the code since these are all known on the server.</p>
 *
 * @xtype container
 */
Ext.Container = Ext.extend(Ext.Component, {
    /**
     * @cfg {String/Number} activeItem
     * A string component id or the numeric index of the component that should be initially activated within the
     * container's layout on render.  For example, activeItem: 'item-1' or activeItem: 0 (index 0 = the first
     * item in the container's collection).  activeItem only applies to layout styles that can display
     * items one at a time (like {@link Ext.layout.AccordionLayout}, {@link Ext.layout.CardLayout} and
     * {@link Ext.layout.FitLayout}).  Related to {@link Ext.layout.ContainerLayout#activeItem}.
     */
    /**
     * @cfg {Object/Array} items
     * <pre><b>** IMPORTANT</b>: be sure to <b>{@link #layout specify a <code>layout</code>} if needed ! **</b></pre>
     * <p>A single item, or an array of child Components to be added to this container,
     * for example:</p>
     * <pre><code>
// specifying a single item
items: {...},
layout: 'fit',    // specify a layout!

// specifying multiple items
items: [{...}, {...}],
layout: 'anchor', // specify a layout!
     * </code></pre>
     * <p>Each item may be:</p>
     * <div><ul class="mdetail-params">
     * <li>any type of object based on {@link Ext.Component}</li>
     * <li>a fully instanciated object or</li>
     * <li>an object literal that:</li>
     * <div><ul class="mdetail-params">
     * <li>has a specified <code>{@link Ext.Component#xtype xtype}</code></li>
     * <li>the {@link Ext.Component#xtype} specified is associated with the Component
     * desired and should be chosen from one of the available xtypes as listed
     * in {@link Ext.Component}.</li>
     * <li>If an <code>{@link Ext.Component#xtype xtype}</code> is not explicitly
     * specified, the {@link #defaultType} for that Container is used.</li>
     * <li>will be "lazily instanciated", avoiding the overhead of constructing a fully
     * instanciated Component object</li>
     * </ul></div></ul></div>
     * <p><b>Notes</b>:</p>
     * <div><ul class="mdetail-params">
     * <li>Ext uses lazy rendering. Child Components will only be rendered
     * should it become necessary. Items are automatically laid out when they are first
     * shown (no sizing is done while hidden), or in response to a {@link #doLayout} call.</li>
     * <li>Do not specify <code>{@link Ext.Panel#contentEl contentEl}</code>/
     * <code>{@link Ext.Panel#html html}</code> with <code>items</code>.</li>
     * </ul></div>
     */
    /**
     * @cfg {Object|Function} defaults
     * <p>This option is a means of applying default settings to all added items whether added through the {@link #items}
     * config or via the {@link #add} or {@link #insert} methods.</p>
     * <p>If an added item is a config object, and <b>not</b> an instantiated Component, then the default properties are
     * unconditionally applied. If the added item <b>is</b> an instantiated Component, then the default properties are
     * applied conditionally so as not to override existing properties in the item.</p>
     * <p>If the defaults option is specified as a function, then the function will be called using this Container as the
     * scope (<code>this</code> reference) and passing the added item as the first parameter. Any resulting object
     * from that call is then applied to the item as default properties.</p>
     * <p>For example, to automatically apply padding to the body of each of a set of
     * contained {@link Ext.Panel} items, you could pass: <code>defaults: {bodyStyle:'padding:15px'}</code>.</p>
     * <p>Usage:</p><pre><code>
defaults: {               // defaults are applied to items, not the container
    autoScroll:true
},
items: [
    {
        xtype: 'panel',   // defaults <b>do not</b> have precedence over
        id: 'panel1',     // options in config objects, so the defaults
        autoScroll: false // will not be applied here, panel1 will be autoScroll:false
    },
    new Ext.Panel({       // defaults <b>do</b> have precedence over options
        id: 'panel2',     // options in components, so the defaults
        autoScroll: false // will be applied here, panel2 will be autoScroll:true.
    })
]
     * </code></pre>
     */


    /** @cfg {Boolean} autoDestroy
     * If true the container will automatically destroy any contained component that is removed from it, else
     * destruction must be handled manually (defaults to true).
     */
    autoDestroy : true,

    /** @cfg {String} defaultType
     * <p>The default {@link Ext.Component xtype} of child Components to create in this Container when
     * a child item is specified as a raw configuration object, rather than as an instantiated Component.</p>
     * <p>Defaults to <code>'panel'</code>, except {@link Ext.menu.Menu} which defaults to <code>'menuitem'</code>,
     * and {@link Ext.Toolbar} and {@link Ext.ButtonGroup} which default to <code>'button'</code>.</p>
     */
    defaultType : 'panel',

    /**
     * @cfg {Array} bubbleEvents
     * <p>An array of events that, when fired, should be bubbled to any parent container.
     * See {@link Ext.util.Observable#enableBubble}.
     * Defaults to <code>['add', 'remove']</code>.
     */
    bubbleEvents: ['add', 'remove'],

    // private
    initComponent : function(){
        Ext.Container.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event beforeadd
             * Fires before any {@link Ext.Component} is added or inserted into the container.
             * A handler can return false to cancel the add.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component being added
             * @param {Number} index The index at which the component will be added to the container's items collection
             */
            'beforeadd',
            /**
             * @event beforeremove
             * Fires before any {@link Ext.Component} is removed from the container.  A handler can return
             * false to cancel the remove.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component being removed
             */
            'beforeremove',
            /**
             * @event add
             * @bubbles
             * Fires after any {@link Ext.Component} is added or inserted into the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component that was added
             * @param {Number} index The index at which the component was added to the container's items collection
             */
            'add',
            /**
             * @event remove
             * @bubbles
             * Fires after any {@link Ext.Component} is removed from the container.
             * @param {Ext.Container} this
             * @param {Ext.Component} component The component that was removed
             */
            'remove'
        );

        /**
         * The collection of components in this container as a {@link Ext.util.MixedCollection}
         * @type MixedCollection
         * @property items
         */
        var items = this.items;
        if(items){
            delete this.items;
            this.add(items);
        }
    },

    // private
    initItems : function(){
        if(!this.items){
            this.items = new Ext.util.MixedCollection(false, this.getComponentId);
        }
    },

    // private - used as the key lookup function for the items collection
    getComponentId : function(comp){
        return comp.getItemId();
    },

    /**
     * <p>Adds {@link Ext.Component Component}(s) to this Container.</p>
     * <br><p><b>Description</b></u> :
     * <div><ul class="mdetail-params">
     * <li>Fires the {@link #beforeadd} event before adding</li>
     * <li>The Container's {@link #defaults default config values} will be applied
     * accordingly (see <code>{@link #defaults}</code> for details).</li>
     * <li>Fires the {@link #add} event after the component has been added.</li>
     * </ul></div>
     * <br><p><b>Notes</b></u> :
     * <div><ul class="mdetail-params">
     * <li>If the Container is <i>already rendered</i> when <code>add</code>
     * is called, you may need to call {@link #doLayout} to refresh the view which causes
     * any unrendered child Components to be rendered. This is required so that you can
     * <code>add</code> multiple child components if needed while only refreshing the layout
     * once. For example:<pre><code>
var tb = new {@link Ext.Toolbar}();
tb.render(document.body);  // toolbar is rendered
tb.add({text:'Button 1'}); // add multiple items ({@link #defaultType} for {@link Ext.Toolbar Toolbar} is 'button')
tb.add({text:'Button 2'});
tb.{@link #doLayout}();             // refresh the layout
     * </code></pre></li>
     * <li><i>Warning:</i> Containers directly managed by the BorderLayout layout manager
     * may not be removed or added.  See the Notes for {@link Ext.layout.BorderLayout BorderLayout}
     * for more details.</li>
     * </ul></div>
     * @param {...Object/Array} component
     * <p>Either one or more Components to add or an Array of Components to add.  See
     * <code>{@link #items}</code> for additional information.</p>
     * @return {Ext.Component/Array} The Components that were added.
     */
    add : function(comp){
        this.initItems();
        var args = arguments.length > 1;
        if(args || Ext.isArray(comp)){
            var result = [];
            Ext.each(args ? arguments : comp, function(c){
                result.push(this.add(c));
            }, this);
            return result;
        }
        var c = this.lookupComponent(this.applyDefaults(comp));
        var index = this.items.length;
        if(this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false){
            this.items.add(c);
            // *onAdded
            c.onAdded(this, index);
            this.onAdd(c);
            this.fireEvent('add', this, c, index);
        }
        return c;
    },

    onAdd : function(c){
        // Empty template method
    },

    // private
    onAdded : function(container, pos) {
        //overridden here so we can cascade down, not worth creating a template method.
        this.ownerCt = container;
        this.initRef();
        //initialize references for child items
        this.cascade(function(c){
            c.initRef();
        });
        this.fireEvent('added', this, container, pos);
    },

    /**
     * Inserts a Component into this Container at a specified index. Fires the
     * {@link #beforeadd} event before inserting, then fires the {@link #add} event after the
     * Component has been inserted.
     * @param {Number} index The index at which the Component will be inserted
     * into the Container's items collection
     * @param {Ext.Component} component The child Component to insert.<br><br>
     * Ext uses lazy rendering, and will only render the inserted Component should
     * it become necessary.<br><br>
     * A Component config object may be passed in order to avoid the overhead of
     * constructing a real Component object if lazy rendering might mean that the
     * inserted Component will not be rendered immediately. To take advantage of
     * this 'lazy instantiation', set the {@link Ext.Component#xtype} config
     * property to the registered type of the Component wanted.<br><br>
     * For a list of all available xtypes, see {@link Ext.Component}.
     * @return {Ext.Component} component The Component (or config object) that was
     * inserted with the Container's default config values applied.
     */
    insert : function(index, comp) {
        var args   = arguments,
            length = args.length,
            result = [],
            i, c;
        
        this.initItems();
        
        if (length > 2) {
            for (i = length - 1; i >= 1; --i) {
                result.push(this.insert(index, args[i]));
            }
            return result;
        }
        
        c = this.lookupComponent(this.applyDefaults(comp));
        index = Math.min(index, this.items.length);
        
        if (this.fireEvent('beforeadd', this, c, index) !== false && this.onBeforeAdd(c) !== false) {
            if (c.ownerCt == this) {
                this.items.remove(c);
            }
            this.items.insert(index, c);
            c.onAdded(this, index);
            this.onAdd(c);
            this.fireEvent('add', this, c, index);
        }
        
        return c;
    },

    // private
    applyDefaults : function(c){
        var d = this.defaults;
        if(d){
            if(Ext.isFunction(d)){
                d = d.call(this, c);
            }
            if(Ext.isString(c)){
                c = Ext.ComponentMgr.get(c);
                Ext.apply(c, d);
            }else if(!c.events){
                Ext.applyIf(c.isAction ? c.initialConfig : c, d);
            }else{
                Ext.apply(c, d);
            }
        }
        return c;
    },

    // private
    onBeforeAdd : function(item){
        if(item.ownerCt){
            item.ownerCt.remove(item, false);
        }
        if(this.hideBorders === true){
            item.border = (item.border === true);
        }
    },

    /**
     * Removes a component from this container.  Fires the {@link #beforeremove} event before removing, then fires
     * the {@link #remove} event after the component has been removed.
     * @param {Component/String} component The component reference or id to remove.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Ext.Component} component The Component that was removed.
     */
    remove : function(comp, autoDestroy){
        this.initItems();
        var c = this.getComponent(comp);
        if(c && this.fireEvent('beforeremove', this, c) !== false){
            this.doRemove(c, autoDestroy);
            this.fireEvent('remove', this, c);
        }
        return c;
    },

    onRemove: function(c){
        // Empty template method
    },

    // private
    doRemove: function(c, autoDestroy){
        this.items.remove(c);
        c.onRemoved();
        this.onRemove(c);
        if(autoDestroy === true || (autoDestroy !== false && this.autoDestroy)){
            c.destroy();
        }
    },

    /**
     * Removes all components from this container.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Array} Array of the destroyed components
     */
    removeAll: function(autoDestroy){
        this.initItems();
        var item, rem = [], items = [];
        this.items.each(function(i){
            rem.push(i);
        });
        for (var i = 0, len = rem.length; i < len; ++i){
            item = rem[i];
            this.remove(item, autoDestroy);
            if(item.ownerCt !== this){
                items.push(item);
            }
        }
        return items;
    },

    /**
     * Examines this container's <code>{@link #items}</code> <b>property</b>
     * and gets a direct child component of this container.
     * @param {String/Number} comp This parameter may be any of the following:
     * <div><ul class="mdetail-params">
     * <li>a <b><code>String</code></b> : representing the <code>{@link Ext.Component#itemId itemId}</code>
     * or <code>{@link Ext.Component#id id}</code> of the child component </li>
     * <li>a <b><code>Number</code></b> : representing the position of the child component
     * within the <code>{@link #items}</code> <b>property</b></li>
     * </ul></div>
     * <p>For additional information see {@link Ext.util.MixedCollection#get}.
     * @return Ext.Component The component (if found).
     */
    getComponent : function(comp){
        if(Ext.isObject(comp)){
            comp = comp.getItemId();
        }
        return this.items.get(comp);
    },

    // private
    lookupComponent : function(comp){
        if(Ext.isString(comp)){
            return Ext.ComponentMgr.get(comp);
        }else if(!comp.events){
            return this.createComponent(comp);
        }
        return comp;
    },

    // private
    createComponent : function(config, defaultType){
        if (config.render) {
            return config;
        }
        // add in ownerCt at creation time but then immediately
        // remove so that onBeforeAdd can handle it
        var c = Ext.create(Ext.apply({
            ownerCt: this
        }, config), defaultType || this.defaultType);
        delete c.initialConfig.ownerCt;
        delete c.ownerCt;
        return c;
    },

    // private
    beforeDestroy : function(){
        var c;
        if(this.items){
            while(c = this.items.first()){
                this.doRemove(c, true);
            }
        }
        Ext.Container.superclass.beforeDestroy.call(this);
    },

    /**
     * Cascades down the component/container heirarchy from this component (called first), calling the specified function with
     * each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the cascade is stopped on that branch.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current component)
     * @param {Array} args (optional) The args to call the function with (defaults to passing the current component)
     * @return {Ext.Container} this
     */
    cascade : function(fn, scope, args){
        if(fn.apply(scope || this, args || [this]) !== false){
            if(this.items){
                var cs = this.items.items;
                for(var i = 0, len = cs.length; i < len; i++){
                    if(cs[i].cascade){
                        cs[i].cascade(fn, scope, args);
                    }else{
                        fn.apply(scope || cs[i], args || [cs[i]]);
                    }
                }
            }
        }
        return this;
    },

    /**
     * Find a component under this container at any level by id
     * @param {String} id
     * @deprecated Fairly useless method, since you can just use Ext.getCmp. Should be removed for 4.0
     * If you need to test if an id belongs to a container, you can use getCmp and findParent*.
     * @return Ext.Component
     */
    findById : function(id){
        var m = null, 
            ct = this;
        this.cascade(function(c){
            if(ct != c && c.id === id){
                m = c;
                return false;
            }
        });
        return m;
    },

    /**
     * Find a component under this container at any level by xtype or class
     * @param {String/Class} xtype The xtype string for a component, or the class of the component directly
     * @param {Boolean} shallow (optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Array} Array of Ext.Components
     */
    findByType : function(xtype, shallow){
        return this.findBy(function(c){
            return c.isXType(xtype, shallow);
        });
    },

    /**
     * Find a component under this container at any level by property
     * @param {String} prop
     * @param {String} value
     * @return {Array} Array of Ext.Components
     */
    find : function(prop, value){
        return this.findBy(function(c){
            return c[prop] === value;
        });
    },

    /**
     * Find a component under this container at any level by a custom function. If the passed function returns
     * true, the component will be included in the results. The passed function is called with the arguments (component, this container).
     * @param {Function} fn The function to call
     * @param {Object} scope (optional)
     * @return {Array} Array of Ext.Components
     */
    findBy : function(fn, scope){
        var m = [], ct = this;
        this.cascade(function(c){
            if(ct != c && fn.call(scope || c, c, ct) === true){
                m.push(c);
            }
        });
        return m;
    },

    /**
     * Get a component contained by this container (alias for items.get(key))
     * @param {String/Number} key The index or id of the component
     * @deprecated Should be removed in 4.0, since getComponent does the same thing.
     * @return {Ext.Component} Ext.Component
     */
    get : function(key){
        return this.getComponent(key);
    }
});

Ext.reg('container', Ext.Container);
