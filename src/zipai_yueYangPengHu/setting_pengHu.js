
var setting_pengHu = setting_ziPai.extend({
	ctor : function(jsonSrc){
		this._super(jsonSrc);
	},

    initSuDu : function(gongNeng){
        var suDuList = [];
        suDuList.push(gongNeng.getChildByName("suDu").getChildByName("yb"));
        suDuList.push(gongNeng.getChildByName("suDu").getChildByName("bz"));
        var man = gongNeng.getChildByName("suDu").getChildByName("man");
        var jiKuai = gongNeng.getChildByName("suDu").getChildByName("jiKuai");
        man.visible = false;
        jiKuai.visible = false;
        var type = MjClient.playui.getSuDuType();
        this.suDuRadio = createRadioBoxForCheckBoxs(suDuList, null, type);
        for(var i = 0; i < suDuList.length; i++){
            cc.eventManager.addListener(this.setTextClick(suDuList,i,this.suDuRadio),suDuList[i].getChildByName("text"));
        }
        this.suDuRadio.setSelectCallBack(function(index, sender, nodeList){
            util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_SU_DU_TYPE, index);
            postEvent("EZP_suDu", {});
        });
    },

    //听牌提示
    initTingPai : function(gongNeng){
		this._super(gongNeng);
        var tingpai = gongNeng.getChildByName("tingpai");
        tingpai.getChildByName("title").ignoreContentAdaptWithSize(true);
        tingpai.visible = false;
    },

    //胡息显示
    initHuXi : function(gongNeng){
        this._super(gongNeng);
        var huxi = gongNeng.getChildByName("huxi");
        huxi.getChildByName("title").ignoreContentAdaptWithSize(true);
        huxi.visible = false;
    },
	
})