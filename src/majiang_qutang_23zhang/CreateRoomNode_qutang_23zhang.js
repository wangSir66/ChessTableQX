
var CreateRoomNode_qutang_23zhang_ = CreateRoomNode.extend({
    setKeyByCardFriend:function(){
        this.localStorageKey.KEY_qutang_23zhang_count             = "CF_QU_TANG_23_ZHANG_COUNT";    //人数
        this.localStorageKey.KEY_qutang_23zhang_jiabei            = "CF_QU_TANG_23_ZHANG_JIA_BEI";  //是否加倍
        this.localStorageKey.KEY_qutang_23zhang_shuang_jiabei     = "CF_QU_TANG_23_ZHANG_SHUANG_JIA_BEI";  //双加倍x3
        this.localStorageKey.KEY_qutang_23zhang_shupai_bubaofen = "CF_QU_TANG_23_ZHANG_SHUPAI_BUBAOFENG";  //熟牌不包分
    },
    setKey:function(){
        this.localStorageKey.KEY_qutang_23zhang_count             = "_QU_TANG_23_ZHANG_COUNT"; //人数
        this.localStorageKey.KEY_qutang_23zhang_jiabei            = "_QU_TANG_23_ZHANG_JIA_BEI";  //是否加倍
        this.localStorageKey.KEY_qutang_23zhang_shuang_jiabei     = "_QU_TANG_23_ZHANG_SHUANG_JIA_BEI";  //双加倍x3
        this.localStorageKey.KEY_qutang_23zhang_shupai_bubaofen = "_QU_TANG_23_ZHANG_SHUPAI_BUBAOFENG";  //熟牌不包分
    },

    initAll: function(IsFriendCard) {
        if (IsFriendCard)
            this.setKeyByCardFriend();
        else
            this.setKey();

        this.bg_node = ccs.load("bg_qutang_23zhang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_qutang_23zhang");

        //为适配拖动，先把节点获取到
        this._scrollview = this.bg_node.getChildByName("scrollview");
        this._scroll_play = this._scrollview.getChildByName("play");
        this._scroll_round = this._scrollview.getChildByName("round");
    },
    initRoundNode: function() {
        this._super();
        if (cc.sys.isObjectValid(this.payWayNodeArray[2]))
        {
            this.payWayNodeArray[2].visible = true;
            this.payWayNodeArray[2].setEnabled(true);
        }
    },
    initPlayNode: function() {
        this._super();

        var _play = this._scroll_play;

        //人数
        this._playerNumber2_node = _play.getChildByName("playerNumber_2");
        this._playerNumber3_node = _play.getChildByName("playerNumber_3");
        var nodeCountList = [];
        nodeCountList.push(this._playerNumber3_node);
        nodeCountList.push(this._playerNumber2_node);
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList[index], nodeCountList);
        }.bind(this));
        this.addListenerText(nodeCountList, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList;
        this.initPlayNumNode(nodeCountList, [3, 2]);


        //加倍
        this._jiabei_node = _play.getChildByName("jiabei");
        this._jiabei_text = this._jiabei_node.getChildByName("text");
        this._jiabei_node.addEventListener(function (sender, type) {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this.isCanJiaBeiFun();
                    break;
            }
        }, this);
        this.addListenerText(this._jiabei_node, null, this.isCanJiaBeiFun.bind(this));

        //双加倍
        this._shuang_jiabei_node = _play.getChildByName("jiabei2");
        this._shuang_jiabei_text = this._shuang_jiabei_node.getChildByName("text");
        this.addListenerText(this._shuang_jiabei_node);
        this._shuang_jiabei_node.addEventListener(this.clickCB, this._shuang_jiabei_node);


        //熟牌不包分
        this._shupaibubaofen_node = _play.getChildByName("shuPaiBuBaoFen");
        this._shupaibubaofen_text = this._shupaibubaofen_node.getChildByName("text");
        this.addListenerText(this._shupaibubaofen_node);
        this._shupaibubaofen_node.addEventListener(this.clickCB, this._shupaibubaofen_node);
    },
    isCanJiaBeiFun: function(){
        this._shuang_jiabei_node.setVisible(this._jiabei_node.isSelected());
        this.selectedCB(this._jiabei_text, this._jiabei_node.isSelected());
    },
    setPlayNodeCurrentSelect: function(isClub) {
        this._super();

        // 人数
        var _count;
        if (isClub){
            if (this.getBoolItem("convertible", false))
                _count = 3;
            else
                _count = [3, 2].indexOf(this.getNumberItem("maxPlayer", 3));
        } else{
            _count = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_qutang_23zhang_count, 0);
        }
        this._playNode_player_count_radio.selectItem(_count);
        this.radioBoxSelectCB(_count, this._countlist[_count], this._countlist);


        //加倍
        var _jiabei;
        if(isClub)
            _jiabei = this.getBoolItem("canJiaBei", true);
        else
            _jiabei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_qutang_23zhang_jiabei, true);
        this._jiabei_node.setSelected(_jiabei);
        this.selectedCB(this._jiabei_text, _jiabei);

        //熟牌不包分
        var _shupaibubaofen;
        if(isClub)
            _shupaibubaofen = this.getBoolItem("shoupaibubaofen", false);
        else
            _shupaibubaofen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_qutang_23zhang_shupai_bubaofen, false);
        this._shupaibubaofen_node.setSelected(_shupaibubaofen);
        this.selectedCB(this._shupaibubaofen_text, _shupaibubaofen);


        //双加倍 x 3
        var _shuangJiaBei;
        if(isClub)
            _shuangJiaBei = this.getBoolItem("double3", true);
        else
            _shuangJiaBei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_qutang_23zhang_shuang_jiabei, true);
        this._shuang_jiabei_node.setSelected(_shuangJiaBei);
        this.selectedCB(this._shuang_jiabei_text, _shuangJiaBei);
        this.isCanJiaBeiFun();
    },
    getSelectedPara: function() {
        var para = {};
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();
        para.gameType = MjClient.GAME_TYPE.QU_TANG_23_ZHANG;
        para.maxPlayer = 3;
        para.canJiaBei = this._jiabei_node.isSelected();
        para.shoupaibubaofen = this._shupaibubaofen_node.isSelected();
        if(para.canJiaBei){
            para.double3 = this._shuang_jiabei_node.isSelected();
        }

        if(this._playerNumber2_node.isSelected()){
            para.maxPlayer = 2;
        }


        // 默认3人
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_qutang_23zhang_jiabei, para.canJiaBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_qutang_23zhang_count, [3, 2].indexOf(para.maxPlayer));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_qutang_23zhang_shuang_jiabei, para.double3);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_qutang_23zhang_shupai_bubaofen, para.shoupaibubaofen);
        }
        cc.log("qutang_23zhang_createRoom: " + JSON.stringify(para));
        return para;
    },
});