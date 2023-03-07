

var EndOneView_jinzhong = EndOnePanel.extend({
    initLoadJsonFile:function(){
        this._super();
        var endui = ccs.load(res.EndOne_jinzhong_json);
        this.addChild(endui.node);
        return endui.node;
    },
    initUIset:function(endoneNode){
        this._super(endoneNode);
    },
    CardLayoutForEndOne:function(node,off)
    {
        this._super(node,off);
    }
});