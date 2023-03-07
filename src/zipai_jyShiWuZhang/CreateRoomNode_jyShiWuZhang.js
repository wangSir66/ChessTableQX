/**
 * Created by WuXiaoDong on 2017/10/9.
 */

var CreateRoomNode_jyShiWuZhang = CreateRoomNode.extend({
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard) {
            this.localStorageKey.KEY_jyShiWuZhang_kingnum = "_JY_SHI_WU_ZHANGE_KING_NUM"; //kingnum
            this.localStorageKey.KEY_jyShiWuZhang_isfanxing = "_JY_SHI_WU_ZHANGE_IS_FAN_XING"; //kingnum
            this.localStorageKey.KEY_jyShiWuZhang_personCount = "_JY_SHI_WU_ZHANGE_PERSON_COUNT"; //personCount
            this.localStorageKey.KEY_jyShiWuZhang_fengDing = "_JY_SHI_WU_ZHANGE_FENG_DING";
            this.localStorageKey.Key_jyShiWuZhang_isgenxing = "_JY_SHI_WU_ZHANGE_IS_GEN_XING";
            this.localStorageKey.Key_jyShiWuZhang_qiepai = "_JY_SHI_WU_ZHANGE_QIE_PAI";//切牌
        }
        
        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundYZLDS4,  pay8:majiang.roundYZLDS8,  pay16:majiang.roundYZLDS16, pay10:majiang.roundYZLDS10};
        // this.AAPay      = {pay4:majiang.roundYZLDSAA4,pay8:majiang.roundYZLDSAA8,pay16:majiang.roundYZLDSAA16, pay10:majiang.roundYZLDSAA10};
        // this.clubPay    = {pay4:majiang.roundYZLDSCL4,pay8:majiang.roundYZLDSCL8,pay16:majiang.roundYZLDSCL16, pay10:majiang.roundYZLDSCL10};
        // this.roundNumObj = {roundNum1:8, roundNum2:8, roundNum3:12, roundNum4:10};
        // if (MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ) {
        //     this.roundNumObj = {roundNum1:5, roundNum2:5, roundNum3:20, roundNum4:10};
        // }
        
        this.bg_node = ccs.load("bg_jyShiWuZhang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_jyShiWuZhang").getChildByName("view");
    },
    initPlayNode:function()
    {
        var _bgXuzhouNode = this.bg_node;

        var _play = _bgXuzhouNode.getChildByName("play");
        if(!_play) _play = _bgXuzhouNode.getChildByName("view").getChildByName("play");
        //跟醒、翻醒
        this.genXingNode_paohuzi = _play.getChildByName("play_genxing");
        this.genXingNode_paohuzi.setSelected(true);

        this.fanXingNode_paohuzi   = _play.getChildByName("play_fanxing");

        var nodeListXing = [];
        nodeListXing.push( this.genXingNode_paohuzi );
        nodeListXing.push( this.fanXingNode_paohuzi );
        this._playNode_Xing_radio = createRadioBoxForCheckBoxs(nodeListXing,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(nodeListXing,0,this._playNode_Xing_radio),nodeListXing[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListXing,1,this._playNode_Xing_radio),nodeListXing[1].getChildByName("text"));      


        //二人 三人、四人
        this.errenNode_paohuzi = _play.getChildByName("play_erren");
        this.sanrenNode_paohuzi = _play.getChildByName("play_sanren");
        this.sanrenNode_paohuzi.setSelected(true);
        this.sirenNode_paohuzi   = _play.getChildByName("play_siren");
        var nodeListplayer = [];
        nodeListplayer.push( this.errenNode_paohuzi );
        nodeListplayer.push( this.sanrenNode_paohuzi );
        nodeListplayer.push( this.sirenNode_paohuzi );
		this.initPlayNumNode(nodeListplayer, [2, 3, 4]);
        this._playNode_player_radio = createRadioBoxForCheckBoxs(nodeListplayer,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(nodeListplayer,0,this._playNode_player_radio),nodeListplayer[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListplayer,1,this._playNode_player_radio),nodeListplayer[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListplayer,2,this._playNode_player_radio),nodeListplayer[2].getChildByName("text"));

        //封顶
        this.sanbaiNode_paohuzi = _play.getChildByName("play_sanbai");
        this.sanbaiNode_paohuzi.setSelected(true);
        this.liubaiNode_paohuzi   = _play.getChildByName("play_liubai");
        this.wushangxianNode_paohuzi   = _play.getChildByName("play_wushangxian");
        var nodeListBai = [];
        nodeListBai.push( this.sanbaiNode_paohuzi );
        nodeListBai.push( this.liubaiNode_paohuzi );
        nodeListBai.push( this.wushangxianNode_paohuzi );
        this._playNode_Bai_radio = createRadioBoxForCheckBoxs(nodeListBai,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(nodeListBai,0,this._playNode_Bai_radio),nodeListBai[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListBai,1,this._playNode_Bai_radio),nodeListBai[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListBai,2,this._playNode_Bai_radio),nodeListBai[2].getChildByName("text"));

        //六胡扫不要四局
        // var _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 1);
        // if (_currentRoundState == 1)
        // {
        //     util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RondType, 2);
        // }
        //切牌
        var list = [];
        list.push( _play.getChildByName("play_xitong"));
        list.push( _play.getChildByName("play_shoudong"));
        this._playNode_Card_radio = createRadioBoxForCheckBoxs(list,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(list,0,this._playNode_Card_radio),list[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(list,1,this._playNode_Card_radio),list[1].getChildByName("text"));
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        //跟醒、翻醒
        var paohuzi_xing;
        if(isClub){
            paohuzi_xing  = this.getBoolItem("isGenXing", true);
        }else{
            paohuzi_xing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.Key_jyShiWuZhang_isgenxing, true);
        }
        var list = [];
        list.push(this.genXingNode_paohuzi);
        list.push(this.fanXingNode_paohuzi);
        var index = 0;
        if(paohuzi_xing == true){
            this.genXingNode_paohuzi.setSelected(true);
            this.fanXingNode_paohuzi.setSelected(false);
            index = 0;
        }else if(paohuzi_xing == false){
            this.genXingNode_paohuzi.setSelected(false);
            this.fanXingNode_paohuzi.setSelected(true);
            index = 1;
        }
        //fix by 千千
        this.radioBoxSelectCB(index,list[index],list);

        //二人 三人、四人
        var paohuzi_personCount;
        if(isClub){
            paohuzi_personCount  = this.getNumberItem("maxPlayer", 3);
        }else{
            paohuzi_personCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jyShiWuZhang_personCount, 3);
        }
        list = [];
        list.push(this.errenNode_paohuzi);
        list.push(this.sanrenNode_paohuzi);
        list.push(this.sirenNode_paohuzi);
        index = 0;
        if(paohuzi_personCount == 3){
            this.errenNode_paohuzi.setSelected(false);
            this.sanrenNode_paohuzi.setSelected(true);
            this.sirenNode_paohuzi.setSelected(false);
            index = 1;
        }else if(paohuzi_personCount == 2){
            this.errenNode_paohuzi.setSelected(true);
            this.sanrenNode_paohuzi.setSelected(false);
            this.sirenNode_paohuzi.setSelected(false);
            index = 0;
        }else if(paohuzi_personCount == 4){
            this.errenNode_paohuzi.setSelected(false);
            this.sanrenNode_paohuzi.setSelected(false);
            this.sirenNode_paohuzi.setSelected(true);
            index = 2;
        }
        //fix by 千千
        this.radioBoxSelectCB(index,list[index],list);

        //封顶
        var paohuzi_fengDing;
        if(isClub){
            paohuzi_fengDing  = this.getNumberItem("fengDing", 300);
        }else{
            paohuzi_fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jyShiWuZhang_fengDing, 300);
        }
        list = [];
        list.push(this.sanbaiNode_paohuzi);
        list.push(this.liubaiNode_paohuzi);
        list.push(this.wushangxianNode_paohuzi);
        index = 0;
        if(paohuzi_fengDing == 300){
            this.sanbaiNode_paohuzi.setSelected(true);
            this.liubaiNode_paohuzi.setSelected(false);
            this.wushangxianNode_paohuzi.setSelected(false);
            index = 0;
        }else if(paohuzi_fengDing == 600){
            this.sanbaiNode_paohuzi.setSelected(false);
            this.liubaiNode_paohuzi.setSelected(true);
            this.wushangxianNode_paohuzi.setSelected(false);
            index = 1;
        }else if(paohuzi_fengDing == -1){
            this.sanbaiNode_paohuzi.setSelected(false);
            this.liubaiNode_paohuzi.setSelected(false);
            this.wushangxianNode_paohuzi.setSelected(true);
            index = 2;
        }
        //fix by 千千
        this.radioBoxSelectCB(index,list[index],list);

        //切牌
        var cardIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.Key_jyShiWuZhang_qiepai, 0);
        if(isClub){
            cardIndex = this.getNumberItem("isManualCutCard",0);
        }
        this._playNode_Card_radio.selectItem(cardIndex);
        var _play = this.bg_node.getChildByName("play");
        if(!_play) _play = this.bg_node.getChildByName("view").getChildByName("play");
        list = [];
        list.push( _play.getChildByName("play_xitong"));
        list.push( _play.getChildByName("play_shoudong"));
        this.radioBoxSelectCB(cardIndex,list[cardIndex],list);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JIANG_YONG_15Z;
        para.maxPlayer = 3;
        para.fengDing = 300;//封顶
        para.isGenXing = true;//跟醒还是翻醒

        //根醒、翻醒
        if(this.genXingNode_paohuzi.isSelected()){
            para.isGenXing = true;
        }else if(this.fanXingNode_paohuzi.isSelected()){
            para.isGenXing = false;
        }

        //三人还是四人
        if (this.sanrenNode_paohuzi.isSelected()){
            para.maxPlayer = 3;
        }else if (this.sirenNode_paohuzi.isSelected()){
            para.maxPlayer = 4;
        }else if (this.errenNode_paohuzi.isSelected()){
            para.maxPlayer = 2;
        }

        //封顶
        if(this.sanbaiNode_paohuzi.isSelected()){
            para.fengDing = 300;
        }else if(this.liubaiNode_paohuzi.isSelected()){
            para.fengDing = 600;
        }else if(this.wushangxianNode_paohuzi.isSelected()){
            para.fengDing = -1;
        }

        //切牌
        para.isManualCutCard = this._playNode_Card_radio.getSelectIndex();
        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jyShiWuZhang_personCount, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jyShiWuZhang_fengDing, para.fengDing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.Key_jyShiWuZhang_isgenxing, para.isGenXing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.Key_jyShiWuZhang_qiepai, para.isManualCutCard);
        }
        //cc.log("------gameType localStorageEncrypt: " + _gameType);
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});