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

Ext('Ext.ComponentMgr', 'Ext.util.Observable-more')

/**
 * @class Ext.Component
 * @extends Ext.util.Observable
 * <h3>Stripped down version of Ext.Component to simplify some common patterns the base library expects</h3>
 * <p>Base class for all Ext components.  All subclasses of Component may participate in the automated
 * Ext component lifecycle of creation, rendering and destruction which is provided by the {@link Ext.Container Container} class.
 * Components may be added to a Container through the {@link Ext.Container#items items} config option at the time the Container is created,
 * or they may be added dynamically via the {@link Ext.Container#add add} method.</p>
 * <p>The Component base class has built-in support for basic hide/show and enable/disable behavior.</p>
 * <p>All Components are registered with the {@link Ext.ComponentMgr} on construction so that they can be referenced at any time via
 * {@link Ext#getCmp}, passing the {@link #id}.</p>
 * <p>All user-developed visual widgets that are required to participate in automated lifecycle and size management should subclass Component (or
 * {@link Ext.BoxComponent} if managed box model handling is required, ie height and width management).</p>
 * <p>See the <a href="http://extjs.com/learn/Tutorial:Creating_new_UI_controls">Creating new UI controls</a> tutorial for details on how
 * and to either extend or augment ExtJs base classes to create custom Components.</p>
 * <p>Every component has a specific xtype, which is its Ext-specific type name, along with methods for checking the
 * xtype like {@link #getXType} and {@link #isXType}. This is the list of all valid xtypes:</p>
 * <pre>
xtype            Class
-------------    ------------------
box              {@link Ext.BoxComponent}
button           {@link Ext.Button}
buttongroup      {@link Ext.ButtonGroup}
colorpalette     {@link Ext.ColorPalette}
component        {@link Ext.Component}
container        {@link Ext.Container}
cycle            {@link Ext.CycleButton}
dataview         {@link Ext.DataView}
datepicker       {@link Ext.DatePicker}
editor           {@link Ext.Editor}
editorgrid       {@link Ext.grid.EditorGridPanel}
flash            {@link Ext.FlashComponent}
grid             {@link Ext.grid.GridPanel}
listview         {@link Ext.ListView}
multislider      {@link Ext.slider.MultiSlider}
panel            {@link Ext.Panel}
progress         {@link Ext.ProgressBar}
propertygrid     {@link Ext.grid.PropertyGrid}
slider           {@link Ext.slider.SingleSlider}
spacer           {@link Ext.Spacer}
splitbutton      {@link Ext.SplitButton}
tabpanel         {@link Ext.TabPanel}
treepanel        {@link Ext.tree.TreePanel}
viewport         {@link Ext.ViewPort}
window           {@link Ext.Window}

Store xtypes
---------------------------------------
arraystore       {@link Ext.data.ArrayStore}
directstore      {@link Ext.data.DirectStore}
groupingstore    {@link Ext.data.GroupingStore}
jsonstore        {@link Ext.data.JsonStore}
simplestore      {@link Ext.data.SimpleStore}      (deprecated; use arraystore)
store            {@link Ext.data.Store}
xmlstore         {@link Ext.data.XmlStore}
</pre>
 * @constructor
 * @param {Ext.Element/String/Object} config The configuration options may be specified as either:
 * <div class="mdetail-params"><ul>
 * <li><b>an element</b> :
 * <p class="sub-desc">it is set as the internal element and its id used as the component id</p></li>
 * <li><b>a string</b> :
 * <p class="sub-desc">it is assumed to be the id of an existing element and is used as the component id</p></li>
 * <li><b>anything else</b> :
 * <p class="sub-desc">it is assumed to be a standard config object and is applied to the component</p></li>
 * </ul></div>
 */
Ext.Component = function(config){
    config = config || {};
    if(config.initialConfig){
        if(config.isAction){           // actions
            this.baseAction = config;
        }
        config = config.initialConfig; // component cloning / action set up
    }else if(config.tagName || config.dom || Ext.isString(config)){ // element object
        config = {applyTo: config, id: config.id || config};
    }

    /**
     * This Component's initial configuration specification. Read-only.
     * @type Object
     * @property initialConfig
     */
    this.initialConfig = config;

    Ext.apply(this, config);
    this.addEvents(
        /**
         * @event added
         * Fires when a component is added to an Ext.Container
         * @param {Ext.Component} this
         * @param {Ext.Container} ownerCt Container which holds the component
         * @param {number} index Position at which the component was added
         */
        'added',
        /**
         * @event disable
         * Fires after the component is disabled.
         * @param {Ext.Component} this
         */
        'disable',
        /**
         * @event enable
         * Fires after the component is enabled.
         * @param {Ext.Component} this
         */
        'enable',
        /**
         * @event removed
         * Fires when a component is removed from an Ext.Container
         * @param {Ext.Component} this
         * @param {Ext.Container} ownerCt Container which holds the component
         */
        'removed',
        /**
         * @event beforedestroy
         * Fires before the component is {@link #destroy}ed. Return false from an event handler to stop the {@link #destroy}.
         * @param {Ext.Component} this
         */
        'beforedestroy',
        /**
         * @event destroy
         * Fires after the component is {@link #destroy}ed.
         * @param {Ext.Component} this
         */
        'destroy',
        /**
         * @event beforestaterestore
         * Fires before the state of the component is restored. Return false from an event handler to stop the restore.
         * @param {Ext.Component} this
         * @param {Object} state The hash of state values returned from the StateProvider. If this
         * event is not vetoed, then the state object is passed to <b><tt>applyState</tt></b>. By default,
         * that simply copies property values into this Component. The method maybe overriden to
         * provide custom state restoration.
         */
        'beforestaterestore',
        /**
         * @event staterestore
         * Fires after the state of the component is restored.
         * @param {Ext.Component} this
         * @param {Object} state The hash of state values returned from the StateProvider. This is passed
         * to <b><tt>applyState</tt></b>. By default, that simply copies property values into this
         * Component. The method maybe overriden to provide custom state restoration.
         */
        'staterestore',
        /**
         * @event beforestatesave
         * Fires before the state of the component is saved to the configured state provider. Return false to stop the save.
         * @param {Ext.Component} this
         * @param {Object} state The hash of state values. This is determined by calling
         * <b><tt>getState()</tt></b> on the Component. This method must be provided by the
         * developer to return whetever representation of state is required, by default, Ext.Component
         * has a null implementation.
         */
        'beforestatesave',
        /**
         * @event statesave
         * Fires after the state of the component is saved to the configured state provider.
         * @param {Ext.Component} this
         * @param {Object} state The hash of state values. This is determined by calling
         * <b><tt>getState()</tt></b> on the Component. This method must be provided by the
         * developer to return whetever representation of state is required, by default, Ext.Component
         * has a null implementation.
         */
        'statesave'
    );
    this.getId();
    Ext.ComponentMgr.register(this);
    Ext.Component.superclass.constructor.call(this);

    if(this.baseAction){
        this.baseAction.addComponent(this);
    }

    this.initComponent();

    if(this.plugins){
        if(Ext.isArray(this.plugins)){
            for(var i = 0, len = this.plugins.length; i < len; i++){
                this.plugins[i] = this.initPlugin(this.plugins[i]);
            }
        }else{
            this.plugins = this.initPlugin(this.plugins);
        }
    }

    if(this.stateful !== false){
        this.initState();
    }
};

// private
Ext.Component.AUTO_ID = 1000;

Ext.extend(Ext.Component, Ext.util.Observable, {
    /**
     * @cfg {String} id
     * <p>The <b>unique</b> id of this component (defaults to an {@link #getId auto-assigned id}).
     * You should assign an id if you need to be able to access the component later and you do
     * not have an object reference available (e.g., using {@link Ext}.{@link Ext#getCmp getCmp}).</p>
     * <p>Note that this id will also be used as the element id for the containing HTML element
     * that is rendered to the page for this component. This allows you to write id-based CSS
     * rules to style the specific instance of this component uniquely, and also to select
     * sub-elements using this component's id as the parent.</p>
     * <p><b>Note</b>: to avoid complications imposed by a unique <tt>id</tt> also see
     * <code>{@link #itemId}</code> and <code>{@link #ref}</code>.</p>
     * <p><b>Note</b>: to access the container of an item see <code>{@link #ownerCt}</code>.</p>
     */
    /**
     * @cfg {String} itemId
     * <p>An <tt>itemId</tt> can be used as an alternative way to get a reference to a component
     * when no object reference is available.  Instead of using an <code>{@link #id}</code> with
     * {@link Ext}.{@link Ext#getCmp getCmp}, use <code>itemId</code> with
     * {@link Ext.Container}.{@link Ext.Container#getComponent getComponent} which will retrieve
     * <code>itemId</code>'s or <tt>{@link #id}</tt>'s. Since <code>itemId</code>'s are an index to the
     * container's internal MixedCollection, the <code>itemId</code> is scoped locally to the container --
     * avoiding potential conflicts with {@link Ext.ComponentMgr} which requires a <b>unique</b>
     * <code>{@link #id}</code>.</p>
     * <pre><code>
var c = new Ext.Panel({ //
    {@link Ext.BoxComponent#height height}: 300,
    {@link #renderTo}: document.body,
    {@link Ext.Container#layout layout}: 'auto',
    {@link Ext.Container#items items}: [
        {
            itemId: 'p1',
            {@link Ext.Panel#title title}: 'Panel 1',
            {@link Ext.BoxComponent#height height}: 150
        },
        {
            itemId: 'p2',
            {@link Ext.Panel#title title}: 'Panel 2',
            {@link Ext.BoxComponent#height height}: 150
        }
    ]
})
p1 = c.{@link Ext.Container#getComponent getComponent}('p1'); // not the same as {@link Ext#getCmp Ext.getCmp()}
p2 = p1.{@link #ownerCt}.{@link Ext.Container#getComponent getComponent}('p2'); // reference via a sibling
     * </code></pre>
     * <p>Also see <tt>{@link #id}</tt> and <code>{@link #ref}</code>.</p>
     * <p><b>Note</b>: to access the container of an item see <tt>{@link #ownerCt}</tt>.</p>
     */
    /**
     * @cfg {String} xtype
     * The registered <tt>xtype</tt> to create. This config option is not used when passing
     * a config object into a constructor. This config option is used only when
     * lazy instantiation is being used, and a child item of a Container is being
     * specified not as a fully instantiated Component, but as a <i>Component config
     * object</i>. The <tt>xtype</tt> will be looked up at render time up to determine what
     * type of child Component to create.<br><br>
     * The predefined xtypes are listed {@link Ext.Component here}.
     * <br><br>
     * If you subclass Components to create your own Components, you may register
     * them using {@link Ext.ComponentMgr#registerType} in order to be able to
     * take advantage of lazy instantiation and rendering.
     */
    /**
     * @cfg {String} ptype
     * The registered <tt>ptype</tt> to create. This config option is not used when passing
     * a config object into a constructor. This config option is used only when
     * lazy instantiation is being used, and a Plugin is being
     * specified not as a fully instantiated Component, but as a <i>Component config
     * object</i>. The <tt>ptype</tt> will be looked up at render time up to determine what
     * type of Plugin to create.<br><br>
     * If you create your own Plugins, you may register them using
     * {@link Ext.ComponentMgr#registerPlugin} in order to be able to
     * take advantage of lazy instantiation and rendering.
     */
    /**
     * @cfg {Boolean} disabled
     * Render this component disabled (default is false).
     */
    disabled : false,
    /**
     * @cfg {Object/Array} plugins
     * An object or array of objects that will provide custom functionality for this component.  The only
     * requirement for a valid plugin is that it contain an init method that accepts a reference of type Ext.Component.
     * When a component is created, if any plugins are available, the component will call the init method on each
     * plugin, passing a reference to itself.  Each plugin can then call methods or respond to events on the
     * component as needed to provide its functionality.
     */
    /**
     * @cfg {Boolean} stateful
     * <p>A flag which causes the Component to attempt to restore the state of
     * internal properties from a saved state on startup. The component must have
     * either a <code>{@link #stateId}</code> or <code>{@link #id}</code> assigned
     * for state to be managed. Auto-generated ids are not guaranteed to be stable
     * across page loads and cannot be relied upon to save and restore the same
     * state for a component.<p>
     * <p>For state saving to work, the state manager's provider must have been
     * set to an implementation of {@link Ext.state.Provider} which overrides the
     * {@link Ext.state.Provider#set set} and {@link Ext.state.Provider#get get}
     * methods to save and recall name/value pairs. A built-in implementation,
     * {@link Ext.state.CookieProvider} is available.</p>
     * <p>To set the state provider for the current page:</p>
     * <pre><code>
Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime()+(1000*60*60*24*7)), //7 days from now
}));
     * </code></pre>
     * <p>A stateful Component attempts to save state when one of the events
     * listed in the <code>{@link #stateEvents}</code> configuration fires.</p>
     * <p>To save state, a stateful Component first serializes its state by
     * calling <b><code>getState</code></b>. By default, this function does
     * nothing. The developer must provide an implementation which returns an
     * object hash which represents the Component's restorable state.</p>
     * <p>The value yielded by getState is passed to {@link Ext.state.Manager#set}
     * which uses the configured {@link Ext.state.Provider} to save the object
     * keyed by the Component's <code>{@link stateId}</code>, or, if that is not
     * specified, its <code>{@link #id}</code>.</p>
     * <p>During construction, a stateful Component attempts to <i>restore</i>
     * its state by calling {@link Ext.state.Manager#get} passing the
     * <code>{@link #stateId}</code>, or, if that is not specified, the
     * <code>{@link #id}</code>.</p>
     * <p>The resulting object is passed to <b><code>applyState</code></b>.
     * The default implementation of <code>applyState</code> simply copies
     * properties into the object, but a developer may override this to support
     * more behaviour.</p>
     * <p>You can perform extra processing on state save and restore by attaching
     * handlers to the {@link #beforestaterestore}, {@link #staterestore},
     * {@link #beforestatesave} and {@link #statesave} events.</p>
     */
    /**
     * @cfg {String} stateId
     * The unique id for this component to use for state management purposes
     * (defaults to the component id if one was set, otherwise null if the
     * component is using a generated id).
     * <p>See <code>{@link #stateful}</code> for an explanation of saving and
     * restoring Component state.</p>
     */
    /**
     * @cfg {Array} stateEvents
     * <p>An array of events that, when fired, should trigger this component to
     * save its state (defaults to none). <code>stateEvents</code> may be any type
     * of event supported by this component, including browser or custom events
     * (e.g., <tt>['click', 'customerchange']</tt>).</p>
     * <p>See <code>{@link #stateful}</code> for an explanation of saving and
     * restoring Component state.</p>
     */
    /**
     * True if this component is disabled. Read-only.
     * @type Boolean
     * @property disabled
     */
    /**
     * True if this component has been rendered. Read-only.
     * @type Boolean
     * @property rendered
     */
    rendered : false,

    /**
     * @cfg {Mixed} data
     * The initial set of data to apply to the <code>{@link #tpl}</code> to
     * update the content area of the Component.
     */

    /**
     * @cfg {Array} bubbleEvents
     * <p>An array of events that, when fired, should be bubbled to any parent container.
     * See {@link Ext.util.Observable#enableBubble}.
     * Defaults to <tt>[]</tt>.
     */
    bubbleEvents: [],


    // private
    ctype : 'Ext.Component',

    // private
    actionMode : 'el',

    // private
    getActionEl : function(){
        return this[this.actionMode];
    },

    initPlugin : function(p){
        if(p.ptype && !Ext.isFunction(p.init)){
            p = Ext.ComponentMgr.createPlugin(p);
        }else if(Ext.isString(p)){
            p = Ext.ComponentMgr.createPlugin({
                ptype: p
            });
        }
        p.init(this);
        return p;
    },

    /* // protected
     * Function to be implemented by Component subclasses to be part of standard component initialization flow (it is empty by default).
     * <pre><code>
// Traditional constructor:
Ext.Foo = function(config){
    // call superclass constructor:
    Ext.Foo.superclass.constructor.call(this, config);

    this.addEvents({
        // add events
    });
};
Ext.extend(Ext.Foo, Ext.Bar, {
   // class body
}

// initComponent replaces the constructor:
Ext.Foo = Ext.extend(Ext.Bar, {
    initComponent : function(){
        // call superclass initComponent
        Ext.Container.superclass.initComponent.call(this);

        this.addEvents({
            // add events
        });
    }
}
</code></pre>
     */
    initComponent : function(){
        /*
         * this is double processing, however it allows people to be able to do
         * Ext.apply(this, {
         *     listeners: {
         *         //here
         *     }
         * });
         * MyClass.superclass.initComponent.call(this);
         */
        if(this.listeners){
            this.on(this.listeners);
            delete this.listeners;
        }
        this.enableBubble(this.bubbleEvents);
    },

    /**
     * @private
     * Method to manage awareness of when components are added to their
     * respective Container, firing an added event.
     * References are established at add time rather than at render time.
     * @param {Ext.Container} container Container which holds the component
     * @param {number} pos Position at which the component was added
     */
    onAdded : function(container, pos) {
        this.ownerCt = container;
        this.initRef();
        this.fireEvent('added', this, container, pos);
    },

    /**
     * @private
     * Method to manage awareness of when components are removed from their
     * respective Container, firing an removed event. References are properly
     * cleaned up after removing a component from its owning container.
     */
    onRemoved : function() {
        this.removeRef();
        this.fireEvent('removed', this, this.ownerCt);
        delete this.ownerCt;
    },

    /**
     * @private
     * Method to establish a reference to a component.
     */
    initRef : function() {
        /**
         * @cfg {String} ref
         * <p>A path specification, relative to the Component's <code>{@link #ownerCt}</code>
         * specifying into which ancestor Container to place a named reference to this Component.</p>
         * <p>The ancestor axis can be traversed by using '/' characters in the path.
         * For example, to put a reference to a Toolbar Button into <i>the Panel which owns the Toolbar</i>:</p><pre><code>
var myGrid = new Ext.grid.EditorGridPanel({
    title: 'My EditorGridPanel',
    store: myStore,
    colModel: myColModel,
    tbar: [{
        text: 'Save',
        handler: saveChanges,
        disabled: true,
        ref: '../saveButton'
    }],
    listeners: {
        afteredit: function() {
//          The button reference is in the GridPanel
            myGrid.saveButton.enable();
        }
    }
});
</code></pre>
         * <p>In the code above, if the <code>ref</code> had been <code>'saveButton'</code>
         * the reference would have been placed into the Toolbar. Each '/' in the <code>ref</code>
         * moves up one level from the Component's <code>{@link #ownerCt}</code>.</p>
         * <p>Also see the <code>{@link #added}</code> and <code>{@link #removed}</code> events.</p>
         */
        if(this.ref && !this.refOwner){
            var levels = this.ref.split('/'),
                last = levels.length,
                i = 0,
                t = this;

            while(t && i < last){
                t = t.ownerCt;
                ++i;
            }
            if(t){
                t[this.refName = levels[--i]] = this;
                /**
                 * @type Ext.Container
                 * @property refOwner
                 * The ancestor Container into which the {@link #ref} reference was inserted if this Component
                 * is a child of a Container, and has been configured with a <code>ref</code>.
                 */
                this.refOwner = t;
            }
        }
    },

    removeRef : function() {
        if (this.refOwner && this.refName) {
            delete this.refOwner[this.refName];
            delete this.refOwner;
        }
    },

    // private
    initState : function(){
        if(Ext.state.Manager){
            var id = this.getStateId();
            if(id){
                var state = Ext.state.Manager.get(id);
                if(state){
                    if(this.fireEvent('beforestaterestore', this, state) !== false){
                        this.applyState(Ext.apply({}, state));
                        this.fireEvent('staterestore', this, state);
                    }
                }
            }
        }
    },

    // private
    getStateId : function(){
        return this.stateId || ((/^(ext-comp-|ext-gen)/).test(String(this.id)) ? null : this.id);
    },

    // private
    initStateEvents : function(){
        if(this.stateEvents){
            for(var i = 0, e; e = this.stateEvents[i]; i++){
                this.on(e, this.saveState, this, {delay:100});
            }
        }
    },

    // private
    applyState : function(state){
        if(state){
            Ext.apply(this, state);
        }
    },

    // private
    getState : function(){
        return null;
    },

    // private
    saveState : function(){
        if(Ext.state.Manager && this.stateful !== false){
            var id = this.getStateId();
            if(id){
                var state = this.getState();
                if(this.fireEvent('beforestatesave', this, state) !== false){
                    Ext.state.Manager.set(id, state);
                    this.fireEvent('statesave', this, state);
                }
            }
        }
    },

    // private
    getAutoCreate : function(){
        var cfg = Ext.isObject(this.autoCreate) ?
                      this.autoCreate : Ext.apply({}, this.defaultAutoCreate);
        if(this.id && !cfg.id){
            cfg.id = this.id;
        }
        return cfg;
    },

    /**
     * Destroys this component by purging any event listeners, removing the component's element from the DOM,
     * removing the component from its {@link Ext.Container} (if applicable) and unregistering it from
     * {@link Ext.ComponentMgr}.  Destruction is generally handled automatically by the framework and this method
     * should usually not need to be called directly.
     *
     */
    destroy : function(){
        if(!this.isDestroyed){
            if(this.fireEvent('beforedestroy', this) !== false){
                this.destroying = true;
                this.beforeDestroy();
                if(this.ownerCt && this.ownerCt.remove){
                    this.ownerCt.remove(this, false);
                }
                if(this.rendered){
                    if(this.actionMode == 'container' || this.removeMode == 'container'){
                        this.container.remove();
                    }
                }
                // Stop any buffered tasks
                if(this.focusTask && this.focusTask.cancel){
                    this.focusTask.cancel();
                }
                this.onDestroy();
                Ext.ComponentMgr.unregister(this);
                this.fireEvent('destroy', this);
                this.purgeListeners();
                this.destroying = false;
                this.isDestroyed = true;
            }
        }
    },

    deleteMembers : function(){
        var args = arguments;
        for(var i = 0, len = args.length; i < len; ++i){
            delete this[args[i]];
        }
    },

    // private
    beforeDestroy : Ext.emptyFn,

    // private
    onDestroy  : Ext.emptyFn,

    /**
     * Returns the <code>id</code> of this component or automatically generates and
     * returns an <code>id</code> if an <code>id</code> is not defined yet:<pre><code>
     * 'ext-comp-' + (++Ext.Component.AUTO_ID)
     * </code></pre>
     * @return {String} id
     */
    getId : function(){
        return this.id || (this.id = 'ext-comp-' + (++Ext.Component.AUTO_ID));
    },

    /**
     * Returns the <code>{@link #itemId}</code> of this component.  If an
     * <code>{@link #itemId}</code> was not assigned through configuration the
     * <code>id</code> is returned using <code>{@link #getId}</code>.
     * @return {String}
     */
    getItemId : function(){
        return this.itemId || this.getId();
    },

    /**
     * Disable this component and fire the 'disable' event.
     * @return {Ext.Component} this
     */
    disable : function(/* private */ silent){
        if(this.rendered){
            this.onDisable();
        }
        this.disabled = true;
        if(silent !== true){
            this.fireEvent('disable', this);
        }
        return this;
    },

    // private
    onDisable : function(){
    },

    /**
     * Enable this component and fire the 'enable' event.
     * @return {Ext.Component} this
     */
    enable : function(){
        if(this.rendered){
            this.onEnable();
        }
        this.disabled = false;
        this.fireEvent('enable', this);
        return this;
    },

    // private
    onEnable : function(){
    },

    /**
     * Convenience function for setting disabled/enabled by boolean.
     * @param {Boolean} disabled
     * @return {Ext.Component} this
     */
    setDisabled : function(disabled){
        return this[disabled ? 'disable' : 'enable']();
    },

    /**
     * Clone the current component using the original config values passed into this instance by default.
     * @param {Object} overrides A new config containing any properties to override in the cloned version.
     * An id property can be passed on this object, otherwise one will be generated to avoid duplicates.
     * @return {Ext.Component} clone The cloned copy of this component
     */
    cloneConfig : function(overrides){
        overrides = overrides || {};
        var id = overrides.id || Ext.id();
        var cfg = Ext.applyIf(overrides, this.initialConfig);
        cfg.id = id; // prevent dup id
        return new this.constructor(cfg);
    },

    /**
     * Gets the xtype for this component as registered with {@link Ext.ComponentMgr}. For a list of all
     * available xtypes, see the {@link Ext.Component} header. Example usage:
     * <pre><code>
var t = new Ext.form.TextField();
alert(t.getXType());  // alerts 'textfield'
</code></pre>
     * @return {String} The xtype
     */
    getXType : function(){
        return this.constructor.xtype;
    },

    /**
     * <p>Tests whether or not this Component is of a specific xtype. This can test whether this Component is descended
     * from the xtype (default) or whether it is directly of the xtype specified (shallow = true).</p>
     * <p><b>If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.</b></p>
     * <p>For a list of all available xtypes, see the {@link Ext.Component} header.</p>
     * <p>Example usage:</p>
     * <pre><code>
var t = new Ext.form.TextField();
var isText = t.isXType('textfield');        // true
var isBoxSubclass = t.isXType('box');       // true, descended from BoxComponent
var isBoxInstance = t.isXType('box', true); // false, not a direct BoxComponent instance
</code></pre>
     * @param {String/Ext.Component/Class} xtype The xtype to check for this Component. Note that the the component can either be an instance
     * or a component class:
     * <pre><code>
var c = new Ext.Component();
console.log(c.isXType(c));
console.log(c.isXType(Ext.Component));
</code></pre>
     * @param {Boolean} shallow (optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Boolean} True if this component descends from the specified xtype, false otherwise.
     */
    isXType : function(xtype, shallow){
        //assume a string by default
        if (Ext.isFunction(xtype)){
            xtype = xtype.xtype; //handle being passed the class, e.g. Ext.Component
        }else if (Ext.isObject(xtype)){
            xtype = xtype.constructor.xtype; //handle being passed an instance
        }

        return !shallow ? ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') != -1 : this.constructor.xtype == xtype;
    },

    /**
     * <p>Returns this Component's xtype hierarchy as a slash-delimited string. For a list of all
     * available xtypes, see the {@link Ext.Component} header.</p>
     * <p><b>If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.</b></p>
     * <p>Example usage:</p>
     * <pre><code>
var t = new Ext.form.TextField();
alert(t.getXTypes());  // alerts 'component/box/field/textfield'
</code></pre>
     * @return {String} The xtype hierarchy string
     */
    getXTypes : function(){
        var tc = this.constructor;
        if(!tc.xtypes){
            var c = [], sc = this;
            while(sc && sc.constructor.xtype){
                c.unshift(sc.constructor.xtype);
                sc = sc.constructor.superclass;
            }
            tc.xtypeChain = c;
            tc.xtypes = c.join('/');
        }
        return tc.xtypes;
    },

    /**
     * Find a container above this component at any level by a custom function. If the passed function returns
     * true, the container will be returned.
     * @param {Function} fn The custom function to call with the arguments (container, this component).
     * @return {Ext.Container} The first Container for which the custom function returns true
     */
    findParentBy : function(fn) {
        for (var p = this.ownerCt; (p != null) && !fn(p, this); p = p.ownerCt);
        return p || null;
    },

    /**
     * Find a container above this component at any level by xtype or class
     * @param {String/Ext.Component/Class} xtype The xtype to check for this Component. Note that the the component can either be an instance
     * or a component class:
     * @param {Boolean} shallow (optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Ext.Container} The first Container which matches the given xtype or class
     */
    findParentByType : function(xtype, shallow){
        return this.findParentBy(function(c){
            return c.isXType(xtype, shallow);
        });
    },

    /**
     * Bubbles up the component/container heirarchy, calling the specified function with each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the bubble is stopped.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current component)
     * @return {Ext.Component} this
     */
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.apply(scope || p, args || [p]) === false){
                break;
            }
            p = p.ownerCt;
        }
        return this;
    },

    // private
    purgeListeners : function(){
        Ext.Component.superclass.purgeListeners.call(this);
        if(this.mons){
            this.on('beforedestroy', this.clearMons, this, {single: true});
        }
    },

    // private
    clearMons : function(){
        Ext.each(this.mons, function(m){
            m.item.un(m.ename, m.fn, m.scope);
        }, this);
        this.mons = [];
    },

    // private
    createMons: function(){
        if(!this.mons){
            this.mons = [];
            this.on('beforedestroy', this.clearMons, this, {single: true});
        }
    },

    /**
     * <p>Adds listeners to any Observable object (or Elements) which are automatically removed when this Component
     * is destroyed. Usage:</p><code><pre>
myGridPanel.mon(myGridPanel.getSelectionModel(), 'selectionchange', handleSelectionChange, null, {buffer: 50});
</pre></code>
     * <p>or:</p><code><pre>
myGridPanel.mon(myGridPanel.getSelectionModel(), {
    selectionchange: handleSelectionChange,
    buffer: 50
});
</pre></code>
     * @param {Observable|Element} item The item to which to add a listener/listeners.
     * @param {Object|String} ename The event name, or an object containing event name properties.
     * @param {Function} fn Optional. If the <code>ename</code> parameter was an event name, this
     * is the handler function.
     * @param {Object} scope Optional. If the <code>ename</code> parameter was an event name, this
     * is the scope (<code>this</code> reference) in which the handler function is executed.
     * @param {Object} opt Optional. If the <code>ename</code> parameter was an event name, this
     * is the {@link Ext.util.Observable#addListener addListener} options.
     */
    mon : function(item, ename, fn, scope, opt){
        this.createMons();
        if(Ext.isObject(ename)){
            var propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;

            var o = ename;
            for(var e in o){
                if(propRe.test(e)){
                    continue;
                }
                if(Ext.isFunction(o[e])){
                    // shared options
                    this.mons.push({
                        item: item, ename: e, fn: o[e], scope: o.scope
                    });
                    item.on(e, o[e], o.scope, o);
                }else{
                    // individual options
                    this.mons.push({
                        item: item, ename: e, fn: o[e], scope: o.scope
                    });
                    item.on(e, o[e]);
                }
            }
            return;
        }

        this.mons.push({
            item: item, ename: ename, fn: fn, scope: scope
        });
        item.on(ename, fn, scope, opt);
    },

    /**
     * Removes listeners that were added by the {@link #mon} method.
     * @param {Observable|Element} item The item from which to remove a listener/listeners.
     * @param {Object|String} ename The event name, or an object containing event name properties.
     * @param {Function} fn Optional. If the <code>ename</code> parameter was an event name, this
     * is the handler function.
     * @param {Object} scope Optional. If the <code>ename</code> parameter was an event name, this
     * is the scope (<code>this</code> reference) in which the handler function is executed.
     */
    mun : function(item, ename, fn, scope){
        var found, mon;
        this.createMons();
        for(var i = 0, len = this.mons.length; i < len; ++i){
            mon = this.mons[i];
            if(item === mon.item && ename == mon.ename && fn === mon.fn && scope === mon.scope){
                this.mons.splice(i, 1);
                item.un(ename, fn, scope);
                found = true;
                break;
            }
        }
        return found;
    },

    /**
     * Returns the next component in the owning container
     * @return Ext.Component
     */
    nextSibling : function(){
        if(this.ownerCt){
            var index = this.ownerCt.items.indexOf(this);
            if(index != -1 && index+1 < this.ownerCt.items.getCount()){
                return this.ownerCt.items.itemAt(index+1);
            }
        }
        return null;
    },

    /**
     * Returns the previous component in the owning container
     * @return Ext.Component
     */
    previousSibling : function(){
        if(this.ownerCt){
            var index = this.ownerCt.items.indexOf(this);
            if(index > 0){
                return this.ownerCt.items.itemAt(index-1);
            }
        }
        return null;
    },

    /**
     * Provides the link for Observable's fireEvent method to bubble up the ownership hierarchy.
     * @return {Ext.Container} the Container which owns this Component.
     */
    getBubbleTarget : function(){
        return this.ownerCt;
    }
});

Ext.reg('component', Ext.Component);
