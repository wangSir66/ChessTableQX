
var setting_chenZhouZiPai = setting_ziPai.extend({
	ctor : function(jsonSrc){
		this._super(jsonSrc);
	},

	//Override
    initChuPai : function(gongNeng){
    	this._super(gongNeng);
    	var chupai = gongNeng.getChildByName("chupai");
        chupai.visible = true;
    }
})