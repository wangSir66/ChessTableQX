var setting_anXiangWeiMaQue = setting_ziPai.extend({
	ctor : function(){
		this._super("ziPai_Setting.json");
	},

	//胡息显示
    initHuXi : function(gongNeng){
        var huxi = gongNeng.getChildByName("huxi");
        huxi.getChildByName("title").ignoreContentAdaptWithSize(true);
        huxi.visible = false;
        // var huXiList = [];
        // huXiList.push(huxi.getChildByName("kaiqi"));
        // huXiList.push(huxi.getChildByName("guanbi"));
        // var type = MjClient.playui.getHuXiType();
        // this.huXiRadio = createRadioBoxForCheckBoxs(huXiList, null, type);
        // for(var i = 0; i < huXiList.length; i++){
        //     cc.eventManager.addListener(this.setTextClick(huXiList,i,this.huXiRadio),huXiList[i].getChildByName("text"));
        // }
        // this.huXiRadio.setSelectCallBack(function(index, sender, nodeList){
        //     util.localStorageEncrypt.setNumberItem(MjClient.KEY_ZI_PAI_HU_XI_TYPE, index);
        //     postEvent("EZP_huXi", index);
        // });
    },
})