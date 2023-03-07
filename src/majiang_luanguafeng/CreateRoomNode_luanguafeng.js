/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_luanguafeng = CreateRoomNode.extend({
    setKey:function(){
        this.localStorageKey.KEY_luanguafeng_difen             = "_LUAN_GUA_FENG_DI_FEN";  //增分
        this.localStorageKey.KEY_luanguafeng_maxPlayer         = "_LUAN_GUA_FENG_MAX_PLAYER"; //人数
        this.localStorageKey.KEY_luanguafeng_qidui             = "_LUAN_GUA_FENG_QIDUI"; 
        this.localStorageKey.KEY_luanguafeng_guoHuZiMo         = "_LUAN_GUA_FENG_GUO_HU_ZIMO";
        this.localStorageKey.KEY_luanguafeng_fangzuobi         = "_LUAN_GUA_FENG_FANG_ZUO_BI"; //防作弊
        this.localStorageKey.KEY_luanguafeng_gangpaisuanfen    = "_LUAN_GUA_FENG_GANG_SUAN_FEN";
        this.localStorageKey.KEY_luanguafeng_gps               = "_LUAN_GUA_FENG_GPS"; //gps防作弊
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_luanguafeng.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_luanguafeng");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },
    initRoundNode:function()
    {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    initPlayNode:function()
    {
        //花
        var _play = this.playScroll.getChildByName("play");


        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");
        var nodeCountList1 = [];
        nodeCountList1.push(_play.getChildByName("play_count0"));
        nodeCountList1.push(_play.getChildByName("play_count1"));
        nodeCountList1.push(_play.getChildByName("play_count2"));
        nodeCountList1.push(_play.getChildByName("play_count3"));
         this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index){
             this.changePayForPlayerNum(index);
             this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
         }.bind(this));
         this.addListenerText(nodeCountList1, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
         this._countlist = nodeCountList1;
		this.initPlayNumNode(nodeCountList1, [4, 3, 2, 4]);

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,10,20,50];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = this.playScroll.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = this.playScroll.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = this.playScroll.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);

        // 防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //防作弊
        this._playNode_fangZuoBi = _play.getChildByName("play_fangzuobi");
        this.addListenerText(this._playNode_fangZuoBi);
        this._playNode_fangZuoBi.addEventListener(this.clickCB, this._playNode_fangZuoBi);

        //过胡只能自摸
        this._playNode_guoHuZiMo = _play.getChildByName("play_guohuzimo");
        this.addListenerText(this._playNode_guoHuZiMo);
        this._playNode_guoHuZiMo.addEventListener(this.clickCB, this._playNode_guoHuZiMo);

        // 杠牌算分
        this._playNode_gangpaisuanfen = _play.getChildByName("play_gangpaisuanfen");
        this.addListenerText(this._playNode_gangpaisuanfen);
        this._playNode_gangpaisuanfen.addEventListener(this.clickCB, this._playNode_gangpaisuanfen);

        // 七对
        this._playNode_qidui = _play.getChildByName("play_qidui");
        this.addListenerText(this._playNode_qidui);
        this._playNode_qidui.addEventListener(this.clickCB, this._playNode_qidui);

    },
    setPlayNodeCurrentSelect: function(isClub) {

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        }
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_luanguafeng_maxPlayer, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var _fenshu = [1,2,3,4,5,10,20,50];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_luanguafeng_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_luanguafeng_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);


        // 防作弊
        var _fangZuoBi;
        if (isClub)
            _fangZuoBi = this.getBoolItem("fangzuobi", true);
        else
            _fangZuoBi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_luanguafeng_fangzuobi, true);
        this._playNode_fangZuoBi.setSelected(_fangZuoBi);
        var text = this._playNode_fangZuoBi.getChildByName("text");
        this.selectedCB(text, _fangZuoBi);

        //七对
        var _qiDui;
        if (isClub)
            _qiDui = this.getBoolItem("qidui", false);
        else
            _qiDui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_luanguafeng_qidui, false);
        this._playNode_qidui.setSelected(_qiDui);
        var text = this._playNode_qidui.getChildByName("text");
        this.selectedCB(text, _qiDui);


        // 过胡自摸
        var _guoHuZiMo;
        if (isClub)
            _guoHuZiMo = this.getBoolItem("guohuzimo", false);
        else
            _guoHuZiMo = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_luanguafeng_guoHuZiMo, false);
        this._playNode_guoHuZiMo.setSelected(_guoHuZiMo);
        var text = this._playNode_guoHuZiMo.getChildByName("text");
        this.selectedCB(text, _guoHuZiMo);

        // 杠牌算分
        var _gangpaisuanfen;
        if (isClub)
            _gangpaisuanfen = this.getBoolItem("gangpaisuanfen", false);
        else
            _gangpaisuanfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_luanguafeng_gangpaisuanfen, false);
        this._playNode_gangpaisuanfen.setSelected(_gangpaisuanfen);
        var text = this._playNode_gangpaisuanfen.getChildByName("text");
        this.selectedCB(text, _gangpaisuanfen);

        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LUAN_GUA_FENG;
        para.maxPlayer = 4;
        para.difen = 1;
        para.fangzuobi = true;
        para.qidui = false; 
        para.guoHuZiMo = false;
        para.gangpaisuanfen = false;  
        para.convertible = false;//是否自由人数


         //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 0;
        }
        else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 1;
        }
        else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 2;
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }

        para.difen = this._ZhuNum.getString();

        //七对
        para.qidui = this._playNode_qidui.isSelected();

        //防作弊
        para.fangzuobi = this._playNode_fangZuoBi.isSelected();

        //过胡自摸
        para.guoHuZiMo = this._playNode_guoHuZiMo.isSelected();

        //杠牌算分
        para.gangpaisuanfen = this._playNode_gangpaisuanfen.isSelected();


        //防作弊
        para.gps = this._playNode_gps.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_luanguafeng_maxPlayer, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_luanguafeng_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_luanguafeng_qidui, para.qidui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_luanguafeng_guoHuZiMo,  para.guoHuZiMo);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_luanguafeng_gangpaisuanfen,  para.gangpaisuanfen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_luanguafeng_fangzuobi,  para.fangzuobi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_luanguafeng_gps,  para.gps);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});