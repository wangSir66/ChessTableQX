/**
 * Created by Administrator on 2018-10-25.
 */
/**
 * Created by sking on 2017/7/21.
 */


var CreateRoomNode_RuanJiangQianFenYueYang = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_RJQFYY_playerNumber       = "_RAUGN_JIANG_PLAYER_NUMBER";     //
        this.localStorageKey.KEY_RJQFYY_xifen           = "_RAUGN_JIANG_XI_FEN";           //
        this.localStorageKey.KEY_RJQFYY_remove67            = "_RAUGN_JIANG_REMOVE67";           //
        this.localStorageKey.KEY_RJQFYY_ranking         = "_RAUGN_JIANG_RANKING";         //
        this.localStorageKey.KEY_RJQFYY_reward         = "_RAUGN_JIANG_REWARD";         //
        this.localStorageKey.KEY_RJQFYY_jiesuandifen         = "_RAUGN_JIANG_QF_JIESUANDIFEN";         //        
        this.setExtraKey({
            tuoGuan: "_RAUGN_JIANG_QF_TUO_GUAN",          //托管
            trustWhole: "_RAUGN_JIANG_TRUST_WHOLE",  //整局托管
            trustWay: "_RAUGN_JIANG_TRUST_WAY"  //托管方式
        });
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_RuanJiangQianFen.json").node;
        this.addChild(this.bg_node);
        // this.text_remove67 = this.bg_node.getChildByName("text_remove67");
        this.bg_node = this.bg_node.getChildByName("bg_ruangjiangqiangfen");
        this.bg_node = this.bg_node.getChildByName("view");
        this.text_remove67 = this.bg_node.getChildByName("text_remove67");
        
    },
    initPlayNode:function()
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play");

        //人数
        this._playNode_playercount_0 = _playWay.getChildByName("playercount_1");
        var costText0 = this._playNode_playercount_0.getChildByName("text");
        costText0.setString(this.getCostString(2));

        this._playNode_playercount_1 = _playWay.getChildByName("playercount_2");
        var costText1 = this._playNode_playercount_1.getChildByName("text");
        costText1.setString(this.getCostString(3));

        this._playNode_playercount_2 = _playWay.getChildByName("playercount_3");
        var costText2 = this._playNode_playercount_2.getChildByName("text");
        costText2.setString(this.getCostString(4));
        
        var nodePlayercount = [];
        nodePlayercount.push( this._playNode_playercount_0 );
        nodePlayercount.push( this._playNode_playercount_1 );
        nodePlayercount.push( this._playNode_playercount_2 );

        var that = this;

        function updateRanking(idx)
        {
            if(idx == 0)
            {
                that._playNode_ranking_0.visible = true;
                that._playNode_ranking_0.getChildByName("text").setString("60/-60")
                that._playNode_ranking_0.setSelected(true);
                that._playNode_ranking_1.visible = false;
                that._playNode_ranking_2.visible = false;

                that._playNode_reward_2.visible = true;

                that._playNode_remove67.visible = false;
                that.text_remove67.visible = false;
                that.setCurrentReward(0);
                that.setCurrentPaiMing(0);
            }
            else if(idx == 1){
                that._playNode_ranking_0.visible = true;
                that._playNode_ranking_0.getChildByName("text").setString("100/-40/-60")
                that._playNode_ranking_1.visible = true;
                that._playNode_ranking_1.getChildByName("text").setString("100/-30/-70")
                that._playNode_ranking_2.visible = true;
                that._playNode_ranking_2.getChildByName("text").setString("40/0/-40")

                that._playNode_reward_2.visible = false;
                that._playNode_remove67.visible = true;
                that.text_remove67.visible = true;
                that.setCurrentReward(0);
                that.setCurrentPaiMing(0);
            }
            else {
                that._playNode_ranking_0.visible = true;
                that._playNode_ranking_0.getChildByName("text").setString("100/-20/-30/-50")
                that._playNode_ranking_0.setSelected(true);
                that._playNode_ranking_1.visible = false;
                that._playNode_ranking_2.visible = false;

                that._playNode_reward_2.visible = false;

                that._playNode_remove67.visible = false;
                that.text_remove67.visible = false;
                that.setCurrentReward(0);
                that.setCurrentPaiMing(0);
            }
        }

        this._playNode_Player_radio = createRadioBoxForCheckBoxs(nodePlayercount,function(index){
            updateRanking(index);
            that.radioBoxSelectCB(index, nodePlayercount[index], nodePlayercount);
            if (that.setLevelText)
                that.setLevelText();
        });
        this.addListenerText(nodePlayercount,this._playNode_Player_radio,updateRanking);

        //喜分
        this._playNode_xifen_0 = _playWay.getChildByName("play_xifen0");
        this._playNode_xifen_1 = _playWay.getChildByName("play_xifen1");
        var nodeListxifen = [];
        nodeListxifen.push( this._playNode_xifen_0 );
        nodeListxifen.push( this._playNode_xifen_1 );
        this._playNode_xifen_radio = createRadioBoxForCheckBoxs(nodeListxifen,this.radioBoxSelectCB);
        this.addListenerText(nodeListxifen,this._playNode_xifen_radio);

        //去除67
        this._playNode_remove67           = _playWay.getChildByName("play_remove67");
        this.addListenerText(this._playNode_remove67);
        this._playNode_remove67.addEventListener(this.clickCB, this._playNode_remove67);

        //排名
        this._playNode_ranking_0 = _playWay.getChildByName("play_ranking0");
        this._playNode_ranking_1 = _playWay.getChildByName("play_ranking1");
        this._playNode_ranking_2 = _playWay.getChildByName("play_ranking2");
        var nodeListranking = [];
        nodeListranking.push( this._playNode_ranking_0 );
        nodeListranking.push( this._playNode_ranking_1 );
        nodeListranking.push( this._playNode_ranking_2 );
        this._playNode_ranking_radio = createRadioBoxForCheckBoxs(nodeListranking,this.radioBoxSelectCB);
        this.addListenerText(nodeListranking,this._playNode_ranking_radio);

        //奖分
        this._playNode_reward_0 = _playWay.getChildByName("play_reward0");
        this._playNode_reward_1 = _playWay.getChildByName("play_reward1");
        this._playNode_reward_2 = _playWay.getChildByName("play_reward2");
        var nodeListreward = [];
        nodeListreward.push( this._playNode_reward_0 );
        nodeListreward.push( this._playNode_reward_1 );
        nodeListreward.push( this._playNode_reward_2 );
        this._playNode_reward_radio = createRadioBoxForCheckBoxs(nodeListreward,this.radioBoxSelectCB);
        this.addListenerText(nodeListreward,this._playNode_reward_radio);

        //积分底分
        this.difenAry = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5];
        this.difenIndex = 0;
        var _this = this;

        var text_diFen = _bg_Node.getParent().getChildByName("txt_fen");
        if (text_diFen) {
            this.text_diFen = text_diFen;

            var btn_sub = _bg_Node.getParent().getChildByName("btn_sub");
            var btn_add = _bg_Node.getParent().getChildByName("btn_add");
            btn_sub.addClickEventListener(function (btn) {
                _this.difenIndex--;
                if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                text_diFen.setString(_this.difenAry[_this.difenIndex]);
            });
            btn_add.addClickEventListener(function (btn) {
                _this.difenIndex++;
                if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                text_diFen.setString(_this.difenAry[_this.difenIndex]);
            });
        }

        this.initExtraPlayNode(_playWay);
    },
    setCurrentReward: function(idx) {
        this._playNode_reward_0.setSelected(false);
        this._playNode_reward_1.setSelected(false);
        this._playNode_reward_2.setSelected(false);
        if(idx == 0) {
            this._playNode_reward_0.setSelected(true);
        } else if(idx == 1) {
            this._playNode_reward_1.setSelected(true);
        } else {
            this._playNode_reward_2.setSelected(true);
        }
    },
    setCurrentPaiMing: function(idx) {
        this._playNode_ranking_0.setSelected(false);
        this._playNode_ranking_1.setSelected(false);
        this._playNode_ranking_2.setSelected(false);
        if(idx == 0) {
            this._playNode_ranking_0.setSelected(true);
        } else if(idx == 1) {
            this._playNode_ranking_1.setSelected(true);
        } else {
            this._playNode_ranking_2.setSelected(true);
        }
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        this._super();
        //设置上次创建房间时的默认选项
        //人数
        var _playernumber;
        if (isClub)
            _playernumber = this.getNumberItem("maxPlayer", 2);
        else
            _playernumber = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RJQFYY_playerNumber, 2);
        this._playNode_playercount_0.setSelected(false);
        this._playNode_playercount_1.setSelected(false);
        this._playNode_playercount_2.setSelected(false);

        var list = [];
        list.push(this._playNode_playercount_0);
        list.push(this._playNode_playercount_1);
        list.push(this._playNode_playercount_2);
        var index = 0;

        if(_playernumber == 2)
        {
            this._playNode_playercount_0.setSelected(true);
            index = 0;
        }
        else if (_playernumber == 3)
        {
            index = 1;
            this._playNode_playercount_1.setSelected(true);
        }
        else if (_playernumber == 4)
        {
            index = 2;
            this._playNode_playercount_2.setSelected(true);
        }
        this.radioBoxSelectCB(index,list[index],list);
        //去除67
        var _remove67;
        if (isClub)
            _remove67 = this.getNumberItem("quDiao67", 0);
        else
            _remove67 = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RJQFYY_remove67, 0);
        this._playNode_remove67.setSelected(_remove67 == 0);
        var text = this._playNode_remove67.getChildByName("text");
        this.selectedCB(text,_remove67)

        var that = this;
        function updateRanking(idx)
        {
            if(idx == 0)
            {
                that._playNode_ranking_0.visible = true;
                that._playNode_ranking_0.getChildByName("text").setString("60/-60")
                that._playNode_ranking_1.visible = false;
                that._playNode_ranking_2.visible = false;

                that._playNode_reward_2.visible = true;

                that._playNode_remove67.visible = false;
                that.text_remove67.visible = false;
            }
            else if(idx == 1){
                that._playNode_ranking_0.visible = true;
                that._playNode_ranking_0.getChildByName("text").setString("100/-40/-60")
                that._playNode_ranking_1.visible = true;
                that._playNode_ranking_1.getChildByName("text").setString("100/-30/-70")
                that._playNode_ranking_2.visible = true;
                that._playNode_ranking_2.getChildByName("text").setString("40/0/-40");

                that._playNode_reward_2.visible = false;

                that._playNode_remove67.visible = true;
                that.text_remove67.visible = true;
            }
            else {
                that._playNode_ranking_0.visible = true;
                that._playNode_ranking_0.getChildByName("text").setString("100/-20/-30/-50")
                that._playNode_ranking_1.visible = false;
                that._playNode_ranking_2.visible = false;

                that._playNode_reward_2.visible = false;

                that._playNode_remove67.visible = false;
                that.text_remove67.visible = false;
            }
        }
        updateRanking(index);

        //喜分
        var _xifen;
        if (isClub)
            _xifen = this.getNumberItem("xiFen", 0);
        else
            _xifen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RJQFYY_xifen, 0);
        this._playNode_xifen_0.setSelected(false);
        this._playNode_xifen_1.setSelected(false);
        var listxifen = [];
        listxifen.push(this._playNode_xifen_0);
        listxifen.push(this._playNode_xifen_1);
        var index = 0;
        if(_xifen == 0 ) {
            this._playNode_xifen_0.setSelected(true);
            index = 0;
        }
        else if (_xifen == 1) {
            index = 1;
            this._playNode_xifen_1.setSelected(true);
        }
        this.radioBoxSelectCB(index,listxifen[index],listxifen);

        //排名
        var _ranking;
        if (isClub)
            _ranking = this.getNumberItem("paiMing", 0);
        else
            _ranking = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RJQFYY_ranking, 0);
        this._playNode_ranking_0.setSelected(false);
        this._playNode_ranking_1.setSelected(false);
        this._playNode_ranking_2.setSelected(false);

        var listranking = [];
        listranking.push(this._playNode_ranking_0);
        listranking.push(this._playNode_ranking_1);
        listranking.push(this._playNode_ranking_2);
        var index = 0;

        if(_ranking == 0 || _ranking == 1 || _ranking == 4)
        {
            this._playNode_ranking_0.setSelected(true);
            index = 0;
        }
        else if (_ranking == 2)
        {
            index = 1;
            this._playNode_ranking_1.setSelected(true);
        }
        else if (_ranking == 3)
        {
            index = 2;
            this._playNode_ranking_2.setSelected(true);
        }
        this.radioBoxSelectCB(index,listranking[index],listranking);

        //奖分
        var _reward;
        if (isClub)
            _reward = this.getNumberItem("jiangFen", 0);
        else
            _reward = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RJQFYY_reward, 0);
        this._playNode_reward_0.setSelected(false);
        this._playNode_reward_1.setSelected(false);
        var listreward = [];
        listreward.push(this._playNode_reward_0);
        listreward.push(this._playNode_reward_1);
        listreward.push(this._playNode_reward_2);
        var index = 0;
        if(_reward == 0 ) {
            this._playNode_reward_0.setSelected(true);
            index = 0;
        }
        else if (_reward == 1) {
            index = 1;
            this._playNode_reward_1.setSelected(true);
        } else if (_reward == 2) {
            index = 1;
            this._playNode_reward_2.setSelected(true);
        }
        this.radioBoxSelectCB(index,listreward[index],listreward);

        //积分底分
        if(this.text_diFen){
            var diFen;
            if (isClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RJQFYY_jiesuandifen, 1);
            }
            this.difenIndex = this.difenAry.indexOf(diFen);
            if (this.difenIndex < 0) this.difenIndex = 1;
            this.text_diFen.setString(this.difenAry[this.difenIndex] + "");
        }

        this.setExtraPlayNodeCurrentSelect(isClub);

    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YUE_YANG_YUAN_JIANG_QIAN_FEN;
        para.maxPlayer = 2; //人数
        if(this._playNode_playercount_0.isSelected()) {
            para.maxPlayer = 2;
        } else if(this._playNode_playercount_1.isSelected()) {
            para.maxPlayer = 3;
        }   else if(this._playNode_playercount_2.isSelected()) {
            para.maxPlayer = 4;
        }
        para.quDiao67 = this._playNode_remove67.isSelected() ? 0 : 1; //去67

        //喜分
        if(this._playNode_xifen_0.isSelected()) {
            para.xiFen = 0;
        } else if(this._playNode_xifen_1.isSelected()) {
            para.xiFen = 1;
        }

        //排名
        if(this._playNode_ranking_0.isSelected()) {
            if(para.maxPlayer == 2) {
                para.paiMing = 0;
                para.quDiao67 = 1;
            } else if(para.maxPlayer == 3) {
                para.paiMing = 1;
            } else if(para.maxPlayer == 4) {
                para.paiMing = 4;
                para.quDiao67 = 1;
            }
        }
         else if(this._playNode_ranking_1.isSelected()) {
            para.paiMing = 2;
        }
        else if(this._playNode_ranking_2.isSelected()) {
            para.paiMing = 3;
        }

        //奖分
        if(this._playNode_reward_0.isSelected()) {
            para.jiangFen = 0;
        } else if(this._playNode_reward_1.isSelected()) {
            para.jiangFen = 1;
        } else if(this._playNode_reward_2.isSelected()) {
            para.jiangFen = 2;
        }

        //积分底分
        para.jieSuanDiFen = this.difenAry[this.difenIndex];

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RJQFYY_playerNumber, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RJQFYY_xifen, para.xiFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RJQFYY_remove67, para.quDiao67);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RJQFYY_ranking, para.paiMing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RJQFYY_reward, para.jiangFen);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_RJQFYY_jiesuandifen, para.jieSuanDiFen);
        }

        this.getExtraSelectedPara(para);
        return para;
    },
    setRoundNodeCurrentSelect:function()
    {
        this._super();
        if(MjClient.getAppType() != MjClient.APP_TYPE.QXXZMJ)
        {
            return;
        }
        var pPriceCfg = this.getPriceCfg();
        if(!pPriceCfg) return false;
        var selectItemNum = Object.keys(pPriceCfg).length;
        var _currentRoundState;

        if (this._isFriendCard && this.clubRule) {
            var roundNumObj = Object.keys(pPriceCfg).sort(function(a, b) {
                return a - b
            });
            _currentRoundState = roundNumObj.indexOf(this.clubRule.round + "");
            if (_currentRoundState != -1)
                _currentRoundState ++;
            else
                _currentRoundState = 2;
        }
        else {
            if (!this._isFriendCard){
                _currentRoundState = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_RondType, 2);
            }else{
                _currentRoundState = 2;
            }
            if(_currentRoundState > selectItemNum) _currentRoundState = selectItemNum;
            if(_currentRoundState == 3) _currentRoundState = 2;
        }

        for (var i=0; i<this.roundNodeArray.length && i<selectItemNum; i++)
        {
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode))
            {
                if (i+1 == _currentRoundState)
                {
                    roundNode.setSelected(true);
                    var text = roundNode.getChildByName("text");
                    this.selectedCB(text,true);
                }
                else
                {
                    roundNode.setSelected(false);
                }
            }
        }
        // 支付方式选项   默认选择_payWay
        var _payWay = 0;
        if (this._isFriendCard)
            _payWay = this.getNumberItem("payWay", 0);
        else
            _payWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PayWay, 0);

        if(_payWay == 2 && MjClient.APP_TYPE.QXXZMJ === MjClient.getAppType())
        {
            _payWay = 0;
        }

        for (var i=0; i<this.payWayNodeArray.length; i++)
        {
            var payWayNode = this.payWayNodeArray[i];
            if (cc.sys.isObjectValid(payWayNode))
            {
                if (i == _payWay)
                {
                    payWayNode.setSelected(true);
                    var text = payWayNode.getChildByName("text");
                    this.selectedCB(text,true);
                }
                else
                {
                    payWayNode.setSelected(false);
                }
            }
        }
    },
    setDiaNumData: function(gameNode) {
        var pPriceCfg = this.getPriceCfg();
        if(!pPriceCfg) return false;

        var roundNumObj = Object.keys(pPriceCfg);
        var _btn_create_diamond = gameNode.getParent().getChildByName("btn_create_diamond");
        var _diamondNumNode = _btn_create_diamond.getChildByName("dia_num");
        _diamondNumNode.ignoreContentAdaptWithSize(true);
        _diamondNumNode.setString(pPriceCfg[roundNumObj[0]][0]);

    },
    getCostString: function(playerCnt) {
        var pGameType = this._data.gameType;
        var roundNumObj = Object.keys(MjClient.data.gamePrice[pGameType][playerCnt]);
        var num = MjClient.data.gamePrice[pGameType][playerCnt][roundNumObj[0]][0];
        if(this._isRoomCardMode){
            return playerCnt + "人";
        }else{
            return playerCnt + "人" + "(" + num +"黄金" + ")";
        }
    }
});