/**
 * Created by sking on 2017/7/21.
 */


var CreateRoomNode_diantuo = CreateRoomNode.extend({
    initAll:function()
    {
        this.localStorageKey.KEY_DIAN_TUO_maxPlayer         = "_DIAN_TUO_ZUI_max_player";   // 人数
        this.localStorageKey.KEY_DIAN_TUO_max_score         = "_DIAN_TUO_MAX_SCORE";        //最大分数局数
        this.localStorageKey.KEY_DIAN_TUO_remove_card       = "_DIAN_TUO_REMOVE_CARD";      //去掉三四
        this.localStorageKey.KEY_DIAN_TUO_look_card         = "_DIAN_TUO_LOOK_CARD";        // 看队友牌
        this.localStorageKey.KEY_DIAN_TUO_round_pos         = "_DIAN_TUO_ROUND_POS";
        this.localStorageKey.KEY_DIAN_TUO_bu_da_gang        = "_DIAN_TUO_BU_DA_GANG";       //不打港
 
        this.localStorageKey.KEY_DIAN_TUO_zhaDan_youXi      = "_DIAN_TUO_ZHA_DAN_YOU_XI";   //炸弹有喜
        this.localStorageKey.KEY_DIAN_TUO_siHei_siHong      = "_DIAN_TUO_SI_HEI_SI_XI";     //四红四黑
        
        this.localStorageKey.KEY_DIAN_TUO_tian_zha_score    = "_DIAN_TUO_TIAN_ZHA_SCORE"; 

        this.localStorageKey.KEY_DIAN_TUO_show_card_num     = "_DIAN_TUO_SHOW_CARD_NUM";    // 看手牌数
        this.localStorageKey.KEY_DIAN_TUO_no_shunZi         = "_DIAN_TUO_NO_SHUN_ZI";       // 不打顺子

        this.localStorageKey.KEY_DIAN_TUO_zha_no_king       = "_DIAN_TUO_ZHA_NO_KING";      // 炸弹不带王
        this.localStorageKey.KEY_DIAN_TUO_hua_se_valid      = "_DIAN_TUO_HUA_SE_VALID";     // 五十k区分花色
        this.localStorageKey.KEY_DIAN_TUO_zui_hou_shao_dai  = "_DIAN_TUO_ZUI_HOU_SHAO_DAI"; // 看手牌数量
        
        this.localStorageKey.KEY_DIAN_TUO_realTime_voice    = "_DIAN_TUO_ZUI_realTime_voice";// 实时语音
        this.localStorageKey.KEY_DIAN_TUO_san_fu_pai        = "_DIAN_TUO_SAN_FU_PAI";       //3副牌

        this.setExtraKey({
            jieSuanDiFen: "_DIAN_TUO_JIE_SUAN_DI_FEN",  //积分底分
        });
 
        this.bgNode = ccs.load("bg_DianTuo.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_DianTuo").getChildByName("view");
        if(!this.bg_node){
            this.bg_node = this.bgNode.getChildByName("bg_DianTuo");
        }
    },
    initPlayNode:function()
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");         //玩法
        var _scoreNode = _bg_Node.getChildByName("round");          //分数
        var _xiFenNode = _bg_Node.getChildByName("xifen_node");     //喜分
        var _tianZhaNode = _bg_Node.getChildByName("tianzha_node"); //天炸
        var _play = _bg_Node.getChildByName("play");  //人数栏          

        this.initXiFenNodePosY = _xiFenNode.y;
        this.initTianZhaNodePosY = _tianZhaNode.y;
        this.xiFenNode = _xiFenNode;
        this.tianZhaNode = _tianZhaNode;

        var maxPlayerList = [];
        maxPlayerList.push(_play.getChildByName("maxPlayer1"));
        maxPlayerList.push(_play.getChildByName("maxPlayer2"));
        this.initPlayNumNode(maxPlayerList, [4, 3]);
        this.maxPlayerList_radio = createRadioBoxForCheckBoxs(maxPlayerList,this._radioBoxSelectCB.bind(this));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,0,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(maxPlayerList,1,this.maxPlayerList_radio,this.changeAAPayForPlayerNum.bind(this)),maxPlayerList[1].getChildByName("text"));
       
        this.playerList_node = maxPlayerList;

        var self = this;
        var _clickCB = function(sender,type){ 
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED: 
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text"); 

                    if(sender.getName() == "zhaDanYouXi"){
                        self.resetChangeView(2,sender.isSelected()); 
                    }
                    else if(sender.getName() == "realtimeVoice"){
                        self.setDiaNumData(self.bg_node);
                    }
                    else if(sender.getName() == "roundPos" && type == ccui.CheckBox.EVENT_SELECTED) {
                        self.buDaGang.setSelected(false);
                        var text = self.buDaGang.getChildByName("text");
                        text.setTextColor(CREATEROOM_COLOR_3);
                    }
                    else if(sender.getName() == "buDaGang" && type == ccui.CheckBox.EVENT_SELECTED) {
                        self.roundPos.setSelected(false);
                        var text = self.roundPos.getChildByName("text");
                        text.setTextColor(CREATEROOM_COLOR_3);
                    }
                    else if(sender.getName() == "sanFuPai") {
                        self.selectSanFuPai();
                    }

                    if(sender.isSelected()){
                        txt.setTextColor(self._selectColor); 
                    }else{
                        txt.setTextColor(self._unSelectColor);
                    }
                    break;
            }
        }

        var textClickCb = function(number, node) {
            if(node.getName() == "roundPos" && node.isSelected()) {
                self.buDaGang.setSelected(false);
                _clickCB(self.buDaGang, ccui.CheckBox.EVENT_UNSELECTED);
            }
            else if(node.getName() == "buDaGang" && node.isSelected()) {
                self.roundPos.setSelected(false);
                _clickCB(self.roundPos, ccui.CheckBox.EVENT_UNSELECTED);
            }
            else if(node.getName() == "sanFuPai") {
                self.selectSanFuPai();
            }
        }

        // 玩法 首轮展示
        this.removeCard = _playWay.getChildByName("removeCard");
        this.addListenerText(this.removeCard);
        this.removeCard.addEventListener(_clickCB, this.removeCard); 
    
        this.lookCard = _playWay.getChildByName("lookCard");
        this.addListenerText(this.lookCard);
        this.lookCard.addEventListener(_clickCB, this.lookCard);

        this.isShowRemainCards  = _playWay.getChildByName("isShowRemainCards");
        this.addListenerText(this.isShowRemainCards );
        this.isShowRemainCards.addEventListener(_clickCB, this.isShowRemainCards );

        this.isNoShunZi = _playWay.getChildByName("isNoShunZi");
        this.addListenerText(this.isNoShunZi );
        this.isNoShunZi.addEventListener(_clickCB, this.isNoShunZi);

        this.isZhaNoKing = _playWay.getChildByName("isZhaNoKing");
        this.addListenerText(this.isZhaNoKing );
        this.isZhaNoKing.addEventListener(_clickCB, this.isZhaNoKing);
        this.zhaNoKingPos = {};
        this.zhaNoKingPos.x = this.isZhaNoKing.x;
        this.zhaNoKingPos.y = this.isZhaNoKing.y;

        this.isHuaSeValid = _playWay.getChildByName("isHuaSeValid");
        this.addListenerText(this.isHuaSeValid );
        this.isHuaSeValid.addEventListener(_clickCB, this.isHuaSeValid);

        this.isZuiHouShaoDai = _playWay.getChildByName("isZuiHouShaoDai");
        this.addListenerText(this.isZuiHouShaoDai );
        this.isZuiHouShaoDai.addEventListener(_clickCB, this.isZuiHouShaoDai);

        this.roundPos = _playWay.getChildByName("roundPos");
        this.addListenerText(this.roundPos, null, textClickCb);
        this.roundPos.addEventListener(_clickCB, this.roundPos); 

        this.buDaGang = _playWay.getChildByName("buDaGang");
        this.addListenerText(this.buDaGang, null, textClickCb);
        this.buDaGang.addEventListener(_clickCB, this.buDaGang);
        this.buDaGang.visible = false;  //4人玩法才有

        this.realtimeVoice = _play.getChildByName("realtimeVoice");
        this.addListenerText(this.realtimeVoice,null,this.changeAAPayForPlayerNum.bind(this));
        this.realtimeVoice.addEventListener(_clickCB, this.realtimeVoice);

        // 新增.3副牌
        this.sanFuPai = _play.getChildByName("sanFuPai");
        this.addListenerText(this.sanFuPai, null, textClickCb);
        this.sanFuPai.addEventListener(_clickCB, this.sanFuPai);
        this.sanFuPai.visible = false;  //4人玩法才有

        // 第二轮 

        this.zhaDanYouXi = _xiFenNode.getChildByName("zhaDanYouXi");
        this.addListenerText(this.zhaDanYouXi,null,function(){
            self.resetChangeView(2,self.zhaDanYouXi.isSelected());
        });
        this.zhaDanYouXi.addEventListener(_clickCB, this.zhaDanYouXi);

        this.siHeiSiHong = _xiFenNode.getChildByName("siHeiSiHong");
        this.addListenerText(this.siHeiSiHong);
        this.siHeiSiHong.addEventListener(_clickCB, this.siHeiSiHong); 

        // 天炸计分
        // this.sanFen = _tianZhaNode.getChildByName("sanFen");
        // this.addListenerText(this.sanFen);
        // this.sanFen.addEventListener(_clickCB, this.sanFen);

        // this.siFen = _tianZhaNode.getChildByName("siFen");
        // this.addListenerText(this.siFen);
        // this.siFen.addEventListener(_clickCB, this.siFen);  

        var tianZha_scoreList = [];
        tianZha_scoreList.push(_tianZhaNode.getChildByName("tianZha_score_1"));
        tianZha_scoreList.push(_tianZhaNode.getChildByName("tianZha_score_2"));
 
        var self = this;
 
        this.tianZha_scoreList_radio = createRadioBoxForCheckBoxs(tianZha_scoreList, function(index) { 
            this.radioBoxSelectCB(index, tianZha_scoreList[index], tianZha_scoreList);
        }.bind(this)); 

        cc.eventManager.addListener(this.setTextClick(tianZha_scoreList,0,this.tianZha_scoreList_radio),tianZha_scoreList[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(tianZha_scoreList,1,this.tianZha_scoreList_radio),tianZha_scoreList[1].getChildByName("text"));
   
        this.difenAry = [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1,2,3,4,5,6,7,8,9,10];
        this.initExtraPlayNode(_play);
    },
    setPlayNodeCurrentSelect:function(atClub)
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");
        var _scoreNode = _bg_Node.getChildByName("round");
        var _xiFenNode = _bg_Node.getChildByName("xifen_node");
        var _tianZhaNode = _bg_Node.getChildByName("tianzha_node");
        var _play = _bg_Node.getChildByName("play");

        //人数
        var _maxPlayer;
        if (atClub){ 
            var temp_maxPlayer = this.getNumberItem("maxPlayer", 4);
            _maxPlayer = [4, 3].indexOf(temp_maxPlayer);
        }
        else{
            _maxPlayer = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DIAN_TUO_maxPlayer, 0);
        }
        this.maxPlayerList_radio.selectItem(_maxPlayer);
        this.radioBoxSelectCB(_maxPlayer,this.playerList_node[_maxPlayer],this.playerList_node); 
        this.selectPlayNum(_maxPlayer);
 
        // var _scoreIndex;
        // var jsonIndex = {m100 : 0,m600 : 1,m60 :0,m400 : 1};
        // if(this._isFriendCard && this.clubRule){
        //     if(_maxPlayer == 0){
        //         _scoreIndex = jsonIndex["m" + this.getNumberItem("nScoreLine", 100)];
        //     }else{
        //         _scoreIndex = jsonIndex["m" + this.getNumberItem("nScoreLine", 60)];
        //     }

        // }else{
        //     var maxScore = 0;
        //     if(_maxPlayer == 0){
        //         maxScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DIAN_TUO_max_score, 100);
        //     }else{
        //         maxScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DIAN_TUO_max_score, 60);
        //     }
        //     _scoreIndex = jsonIndex["m" + maxScore]; 
        //     cc.log("4444444444444444444444444 ",_scoreIndex);

        // } 

        // this.scoreList_radio.selectItem(_scoreIndex); 
        // this.resetChangeView(1,_scoreIndex == 1); 
        // var _scoreNode = _bg_Node.getChildByName("round");
        // var scoreList = []; 
        // scoreList.push(_scoreNode.getChildByName("round_1"));
        // scoreList.push(_scoreNode.getChildByName("round_2")); 
        // this.radioBoxSelectCB(_scoreIndex,scoreList[_scoreIndex],scoreList);

        var self = this;
        function changeTextColor(node){
            var txt = node.getChildByName("text");
            if(node.isSelected()){
                txt.setTextColor(self._selectColor);
            }else{
                txt.setTextColor(self._unSelectColor);
            }
        } 

  
        var _isRemoveCard,_isLookCard,_isRoundPos,_zhaDanYouXi,_siHeiSiHong,_isShowRemainCards,_isNoShunZi
            ,_isZhaNoKing,_isHuaSeValid,_isZuiHouShaoDai,_realtimeVoice,_isBuDaGang,_sanFuPai;

        if(atClub){
            _isRemoveCard = this.getBoolItem("isFullCard", false); 
            _isLookCard = this.getBoolItem("isSeeTeamCard", false); 
            _isRoundPos = this.getBoolItem("isRdTeam", false);
            _isBuDaGang = this.getBoolItem("isBuDaGang", false);

            _zhaDanYouXi = this.getBoolItem("isBombScore", false); 
            _siHeiSiHong = this.getBoolItem("isRedBlackScore", false); 

            _isShowRemainCards = this.getBoolItem("isShowRemainCards", false);

            _isNoShunZi = this.getBoolItem("isNoShunZi", false);

            _isZhaNoKing = this.getBoolItem("isZhaNoKing", false);
            _isHuaSeValid = this.getBoolItem("isHuaSeValid", false);
            _isZuiHouShaoDai = this.getBoolItem("isZuiHouShaoDai", false);

            _realtimeVoice = this.getBoolItem("realtimeVoice", false); 
            _sanFuPai = this.getBoolItem("isSanFuPai", false);
        }else{
            _isRemoveCard = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_remove_card, false); 
            _isLookCard = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_look_card, false); 
            _isRoundPos = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_round_pos, false);
            _isBuDaGang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_bu_da_gang, false);

            _zhaDanYouXi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_zhaDan_youXi, false); 
            _siHeiSiHong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_siHei_siHong, false); 

            _isShowRemainCards = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_show_card_num, false);

            _isNoShunZi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_no_shunZi, false);

            _isZhaNoKing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_zha_no_king, false);
            _isHuaSeValid = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_hua_se_valid, false);
            _isZuiHouShaoDai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_zui_hou_shao_dai, false);

            _realtimeVoice = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_realTime_voice, false); 
            _sanFuPai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DIAN_TUO_san_fu_pai, false);
        }
 
        this.removeCard.setSelected(_isRemoveCard); 
        changeTextColor(this.removeCard);

        this.lookCard.setSelected(_isLookCard); 
        changeTextColor(this.lookCard);

        this.isNoShunZi.setSelected(_isNoShunZi); 
        changeTextColor(this.isNoShunZi);

        this.isZhaNoKing.setSelected(_isZhaNoKing); 
        changeTextColor(this.isZhaNoKing);

        this.isHuaSeValid.setSelected(_isHuaSeValid); 
        changeTextColor(this.isHuaSeValid);

        this.isZuiHouShaoDai.setSelected(_isZuiHouShaoDai); 
        changeTextColor(this.isZuiHouShaoDai);

        this.roundPos.setSelected(_isRoundPos); 
        changeTextColor(this.roundPos);

        this.buDaGang.setSelected(_isBuDaGang);
        changeTextColor(this.buDaGang);

        this.realtimeVoice.setSelected(_realtimeVoice); 
        changeTextColor(this.realtimeVoice);

        this.sanFuPai.setSelected(_sanFuPai);
        changeTextColor(this.sanFuPai);
        this.selectSanFuPai();

        this.zhaDanYouXi.setSelected(_zhaDanYouXi); 
        changeTextColor(this.zhaDanYouXi); 
       
        this.resetChangeView(2,_zhaDanYouXi);  
      

        this.siHeiSiHong.setSelected(_siHeiSiHong); 
        changeTextColor(this.siHeiSiHong);

        this.isShowRemainCards.setSelected(_isShowRemainCards); 
        changeTextColor(this.isShowRemainCards);

        // this.sanFen.setSelected(_sanFen); 
        // changeTextColor(this.sanFen);

        // this.siFen.setSelected(_siFen); 
        // changeTextColor(this.siFen);

        //this.tianZha_scoreList_radio 
        var _tianzhaNum;
        if(atClub){
            _tianzhaNum = this.getNumberItem("nTianZhaScore", 3); 
        }else{
            _tianzhaNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DIAN_TUO_tian_zha_score, 3);
        }  
        var _tianzhaIndex = _tianzhaNum == 3 ? 0 : 1;

        this.tianZha_scoreList_radio.selectItem(_tianzhaIndex);  

        var tianZhaScoreList = []; 
        tianZhaScoreList.push(_tianZhaNode.getChildByName("tianZha_score_1"));
        tianZhaScoreList.push(_tianZhaNode.getChildByName("tianZha_score_2")); 
        this.radioBoxSelectCB(_tianzhaIndex,tianZhaScoreList[_tianzhaIndex],tianZhaScoreList);
    
        //积分底分
        if(this.jieSuanDiFen){
            var diFen;
            if (atClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.jieSuanDiFen, 1);
            }
            this.difenIndex = this.difenAry.indexOf(diFen);
            if (this.difenIndex < 0) this.difenIndex = 1;
            var text_diFen = this.jieSuanDiFen.getChildByName("text_diFen");
            text_diFen.setString(this.difenAry[this.difenIndex] + "");
        }
        
        this.setExtraPlayNodeCurrentSelect(atClub);
    },
    initRoundNode: function() {
        this._super();
        var _bg_Node = this.bg_node;
        var _scoreNode = _bg_Node.getChildByName("round");
         // 分数
        var scoreList = [];
        for(var i = 0; i < 5; i++) {
            scoreList.push(_scoreNode.getChildByName("round_" + (i + 1)));
        }
        this.scoreList_node = scoreList;

        var self = this;

        function changeData(index ,sender){
            self.resetChangeView(1,index == 3); 
            self.setDiaNumData(_bg_Node);
            // 100分和三副牌互斥
            var maxPlIdx = self.maxPlayerList_radio.getSelectIndex();
            self.setNodeGray(self.sanFuPai, maxPlIdx == 0 && index == 3);
            self.setNodeGray(self.scoreList_node[3], maxPlIdx == 0 ? self.sanFuPai.isSelected() : false);
        }

        this.scoreList_radio = createRadioBoxForCheckBoxs(scoreList, function(index) {
            // this.changePayForPlayerNum(index);   
            this.radioBoxSelectCB(index, scoreList[index], scoreList);
            changeData(index);
        }.bind(this)); 

        for(var i = 0; i < scoreList.length; i++) {
            cc.eventManager.addListener(this.setTextClick(scoreList,i,this.scoreList_radio,changeData),scoreList[i].getChildByName("text"));
        }
    },
    setRoundNodeCurrentSelect: function(){
        this._super(); 

        var priceNum = this.getRealtimeVoicePirce();
        var pricrText = this.realtimeVoice.getChildByName("price");
        pricrText.setString("("+priceNum+"黄金)");
        if(this._isRoomCardMode){
            pricrText.visible = false;
        }
        var score = this.getSelectedRoundNum(); 
        score = parseInt(score);
        if(score == 600 || score == 400 || score == 1 || score == 2 || score == 4)
            this.resetChangeView(1,false); 

        this.selectSanFuPai();
    },

     
    // 重置 1喜分，2天炸 
    resetChangeView : function(type,bool){
        var _bg_Node = this.bg_node;
        var _xiFenNode = _bg_Node.getChildByName("xifen_node");
        var _tianZhaNode = _bg_Node.getChildByName("tianzha_node");
        
        _xiFenNode.setVisible(false);
        _tianZhaNode.setVisible(false);

        if(bool){  
            _xiFenNode.setVisible(true);
            _tianZhaNode.setVisible(type == 2);
            if(type == 1){
               this.zhaDanYouXi.setSelected(false); 
               this.zhaDanYouXi.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
               this.siHeiSiHong.setSelected(false);
               this.siHeiSiHong.getChildByName("text").setTextColor(CREATEROOM_COLOR_3);
            } 
            this.tianZha_scoreList_radio.selectItem(0); 

            var tianZha_scoreList = [];
            tianZha_scoreList.push(_tianZhaNode.getChildByName("tianZha_score_1"));
            tianZha_scoreList.push(_tianZhaNode.getChildByName("tianZha_score_2")); 
            this.radioBoxSelectCB(0, tianZha_scoreList[0], tianZha_scoreList);

        }else{ 
            _xiFenNode.setVisible(type != 1);
            _tianZhaNode.setVisible(false); 
        } 
    },
 
    selectPlayNum : function(index,sender, list){
        if(!index || index > 1)
            index = 0;
        // 修改分数
        var _bg_Node = this.bg_node; 
        // var _scoreNode = _bg_Node.getChildByName("round");
        // var scoreArr = [[100,600],[60,400]]; // 四人和三人分别的分数
        // var score_1 = _scoreNode.getChildByName("round_1").getChildByName("text");
        // var score_2 = _scoreNode.getChildByName("round_2").getChildByName("text");
        // score_1.setString(scoreArr[index][0]);
        // score_2.setString(scoreArr[index][1]);
        // 开启关闭玩法的部分按钮选择

        var _play_way = _bg_Node.getChildByName("play_way");

        var removeCard = _play_way.getChildByName("removeCard");
        var lookCard = _play_way.getChildByName("lookCard");
        var roundPos = _play_way.getChildByName("roundPos");

        // 三人
        var noRoundPos = _play_way.getChildByName("noRoundPos");
        var roundRmoveCard = _play_way.getChildByName("roundRmoveCard");
        var removeCard_new = _play_way.getChildByName("removeCard_new");

        var xiFenNode = _bg_Node.getChildByName("xifen_node");
        var tianZhaNode = _bg_Node.getChildByName("tianzha_node");

        xiFenNode.y = index == 0 ? this.initXiFenNodePosY : this.initXiFenNodePosY + 45;
        tianZhaNode.y = index == 0 ? this.initTianZhaNodePosY : this.initTianZhaNodePosY + 45;

        var self = this;
        // 改变文本颜色
        function changeTextColor(node){
            var txt = node.getChildByName("text");
            if(node.isSelected()){
                txt.setTextColor(self._selectColor); 
            }else{
                txt.setTextColor(self._unSelectColor);
            }
        } 

        noRoundPos.setVisible(index == 1);
        roundRmoveCard.setVisible(index == 1);
        removeCard_new.setVisible(index == 1);

        lookCard.setVisible(index != 1);
        roundPos.setVisible(index != 1); 
        removeCard.setVisible(index != 1); 

        changeTextColor(removeCard_new); 
        changeTextColor(noRoundPos); 
        changeTextColor(roundRmoveCard); 
        
        //4人玩法时有不打港选项
        if(index == 0) {
            this.buDaGang.visible = true;
            this.isZhaNoKing.setPosition(cc.p(this.zhaNoKingPos.x, this.zhaNoKingPos.y));
            //增加三副牌玩法
            this.sanFuPai.visible = true;
            this.setNodeGray(this.sanFuPai, this.scoreList_node[3].isSelected());
        }else {
            this.buDaGang.visible = false;
            this.isZhaNoKing.setPosition(this.buDaGang.getPosition());
            this.sanFuPai.visible = false;
        }
        this.selectSanFuPai();
    },
    _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        var index = this.maxPlayerList_radio.getSelectIndex();
        this.selectPlayNum(index || 0);
        this.setDiaNumData(this.bg_node);
    },

    // 设置显示实时语音的价格
    getRealtimeVoicePirce: function(){
        var para = this.getSelectedPara();
        var payWay = this.getSelectedPayWay();
        var gameType = para.gameType;
        var maxPlayer = para.maxPlayer;
        var round = para.nScoreLine;

        if (MjClient.data.gamePrice[gameType][maxPlayer][round].length > payWay + 5) {
            var num = MjClient.data.gamePrice[gameType][maxPlayer][round][payWay + 5];
            return num;
        }
        return 0;
    },

    selectPay: function(roundNumObj,str_type, str_pay) {

        for (var i=0; i<this.roundNodeArray.length; i++)
        {
            var unit = Number(roundNumObj[i]);
            var roundNode = this.roundNodeArray[i];
            if (cc.sys.isObjectValid(roundNode) )
            {
                if(! unit || !str_pay || (str_pay[i] && str_pay[i]<0)) {
                    roundNode.visible = false;
                    cc.log('warn 局数按钮隐藏 selectPay no roundNumObj', roundNumObj, i, str_pay)
                    continue;
                }

                var text = roundNode.getChildByName("text");
                var text_0 = roundNode.getChildByName("text_0");
                if (text_0) {
                    if(unit == 1 || unit == 2 || unit == 4) {
                        text.setString(unit + "局");
                    }else {
                        text.setString(unit + "分");
                    }
                    text_0.setString("(" + str_pay[i] + this._costName + ")");
                    if(this._isRoomCardMode){
                        text_0.visible = false;
                    }
                }
                else {
                    if(this._isRoomCardMode){
                        if(unit == 1 || unit == 2 || unit == 4) {
                            text.setString(unit + "局");
                        }else {
                            text.setString(unit + "分");
                        }
                    }else{
                        if(unit == 1 || unit == 2 || unit == 4) {
                            text.setString(unit + "局(" + str_pay[i] + this._costName + ")");
                        }else {
                            text.setString(unit + "分(" + str_pay[i] + this._costName + ")");
                        }
                    }
                }
            }
        }
        
    },

    setDiaNumData: function(gameNode){
        this._super(gameNode);
        var _btn_create_diamond = gameNode.getChildByName("btn_create_diamond");
        if(!_btn_create_diamond)
        {
            // 岳阳选项内容滑动，加在view下，创建房间，保存规则在上一层
            _btn_create_diamond = gameNode.getParent().getChildByName("btn_create_diamond");
        }
        var _diamondNumNode = _btn_create_diamond.getChildByName("dia_num");
        var createPrice = parseInt(_diamondNumNode.getString()) || 0;
        var voicePrice = this.getRealtimeVoicePirce();
        if( this.realtimeVoice.isSelected() ){
            var sumPrice = createPrice + voicePrice;
            _diamondNumNode.setString(sumPrice); 
        }
    },

    selectSanFuPai: function() {
        //只有4人才有三副牌玩法
        var index = this.maxPlayerList_radio.getSelectIndex();
        if (index > 0) {
            this.sanFuPai.visible = false;
        }
        var bSel = index == 0 ? this.sanFuPai.isSelected() : false; 
        //三副牌下，置灰 100分, 去掉34, 看队友手牌, 随机分组, 不打港
        this.setNodeGray(this.scoreList_node[3], bSel);
        this.setNodeGray(this.removeCard, bSel);
        this.setNodeGray(this.lookCard, bSel);
        this.setNodeGray(this.roundPos, bSel);
        this.setNodeGray(this.buDaGang, bSel);
        this.setNodeGray(this.isZhaNoKing, bSel);
        if (bSel) {
            //没有天炸和喜分
            this.xiFenNode.visible = false;
            this.tianZhaNode.visible = false;
        } else {
            var bXiFen = this.scoreList_node[3].isSelected();
            var bTianZha = this.zhaDanYouXi.isSelected();
            this.xiFenNode.visible = bXiFen;
            this.tianZhaNode.visible = bXiFen && bTianZha;
        }
    },

    // 按钮置灰
    setNodeGray: function(node, bGray) {
        if (!cc.sys.isObjectValid(node)) {
            return;
        }
        var selectColor = this._selectColor;
        var unSelectColor = this._unSelectColor;
        var unEnableColor = CREATEROOM_COLOR_3;
        node.setEnabled(!bGray);
        if (bGray) {
            node.setSelected(false);
        }
        var txt = node.getChildByName("text");
        if (txt) {
            txt.setTextColor(bGray ? unEnableColor : (node.isSelected() ? selectColor : unSelectColor));
        }
    },

    getSelectedPara:function()
    {
        var para = {};
        var maxPlayerIndex = this.maxPlayerList_radio.getSelectIndex(); 
        para.gameType = MjClient.GAME_TYPE.DIAN_TUO; 
        para.maxPlayer = [4, 3][maxPlayerIndex];

        //三副牌
        var isSanFuPai = maxPlayerIndex == 0 ? this.sanFuPai.isSelected() : false;
        var score = this.getSelectedRoundNum();   
        para.nScoreLine = parseInt(score);     //分数
        para.isFullCard = isSanFuPai ? true : !this.removeCard.isSelected();       //去掉3、4是false
        para.isSeeTeamCard = isSanFuPai ? false : this.lookCard.isSelected(); //看队友牌
        para.isNoShunZi = this.isNoShunZi.isSelected(); //不许打顺子

        para.isZhaNoKing = this.isZhaNoKing.isSelected(); //炸弹不带王
        para.isHuaSeValid = this.isHuaSeValid.isSelected(); //分花色五十K
        para.isZuiHouShaoDai = this.isZuiHouShaoDai.isSelected(); //最后的飞机可以少带
        para.isRdTeam = isSanFuPai ? false : this.roundPos.isSelected();           //随机分组
        para.isBuDaGang = isSanFuPai ? false : (para.maxPlayer == 4 ? this.buDaGang.isSelected() : false);   //不打港
        para.realtimeVoice = this.realtimeVoice.isSelected(); //实时语音
        para.isSanFuPai = isSanFuPai;
        para.isBombScore = isSanFuPai ? false : this.zhaDanYouXi.isSelected(); //炸弹有喜
        para.isRedBlackScore = isSanFuPai ? false : this.siHeiSiHong.isSelected(); //四红四黑
        para.isShowRemainCards = this.isShowRemainCards.isSelected(); //看手牌数
        para.nTianZhaScore = [3,4][this.tianZha_scoreList_radio.getSelectIndex()]; //天炸分
        this.getExtraSelectedPara(para);

        if(para.maxPlayer == 3){
            para.isFullCard = false; // false 为去掉3、4

            para.isRdTeam = false;
            para.isSeeTeamCard = false; 
        }else if (!this._isFriendCard){
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_look_card, para.isSeeTeamCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_round_pos, para.isRdTeam);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_bu_da_gang, para.isBuDaGang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_remove_card, this.removeCard.isSelected());
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_san_fu_pai, isSanFuPai);
        }
        if(!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DIAN_TUO_maxPlayer, this.maxPlayerList_radio.getSelectIndex());

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_zhaDan_youXi, para.isBombScore);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_siHei_siHong, para.isRedBlackScore);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DIAN_TUO_tian_zha_score, para.nTianZhaScore);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DIAN_TUO_show_card_num, para.isShowRemainCards); 
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_no_shunZi, para.isNoShunZi);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_zha_no_king, para.isZhaNoKing);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_hua_se_valid, para.isHuaSeValid);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_zui_hou_shao_dai, para.isZuiHouShaoDai);

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DIAN_TUO_realTime_voice, para.realtimeVoice);
        }
 
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
    
});