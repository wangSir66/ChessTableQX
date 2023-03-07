/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_xiangshui = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_xiangshui_dadiaoche = "_xiangshui_DA_DIAO_CHE"; //花牌个数
        this.localStorageKey.KEY_xiangshui_isDuoHu = "_xiangshui_IS_DUO_HU"; //是否多胡
        this.localStorageKey.KEY_xiangshui_count  = "_xiangshui_COUNT"; //人数
        this.localStorageKey.KEY_xiangshui_tuoguan             = "_xiangshui_tuoguan";
        this.localStorageKey.KEY_xiangshui_zhuangfen            = "_xiangshui_zhuangfen";
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_xiangshui.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xiangshui");
    },
    initPlayNode: function() {
        this._super();
        var _bgxiangshuiNode = this.bg_node.getChildByName("view");
        _bgxiangshuiNode.setScrollBarEnabled(false);

        var _playWayNode = _bgxiangshuiNode.getChildByName("play_way");

        this._payDuoHuNode = _playWayNode.getChildByName("play_DuoHu");
        this.addListenerText(this._payDuoHuNode);
        this._payDuoHuNode.addEventListener(this.clickCB, this._payDuoHuNode);

        this._DaDiaoCheNode = _playWayNode.getChildByName("play_Dadiaoche");
        this.addListenerText(this._DaDiaoCheNode);
        this._DaDiaoCheNode.addEventListener(this.clickCB, this._DaDiaoCheNode);

        this._ZhuangFenNode = _playWayNode.getChildByName("play_zhuangfen");
        this.addListenerText(this._ZhuangFenNode);
        this._ZhuangFenNode.addEventListener(this.clickCB, this._ZhuangFenNode);

        //人数
        this._playNode_maxPlayer0 = _playWayNode.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _playWayNode.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _playWayNode.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _playWayNode.getChildByName("play_count3");
        var nodeCountList1 = [];
        nodeCountList1.push(_playWayNode.getChildByName("play_count0"));
        nodeCountList1.push(_playWayNode.getChildByName("play_count1"));
        nodeCountList1.push(_playWayNode.getChildByName("play_count2"));
        nodeCountList1.push(_playWayNode.getChildByName("play_count3"));
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1,function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        this.initPlayNumNode(nodeCountList1, [4, 3, 2, 4]);


        this._playNode_tuoguanType_0 = _playWayNode.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _playWayNode.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _playWayNode.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _playWayNode.getChildByName("tuoguan3");
        var tuoguanList = [];
        tuoguanList.push(_playWayNode.getChildByName("tuoguan0"));
        tuoguanList.push(_playWayNode.getChildByName("tuoguan1"));
        tuoguanList.push(_playWayNode.getChildByName("tuoguan2"));
        tuoguanList.push(_playWayNode.getChildByName("tuoguan3"));
        var self = this;
        this.tuoguanTypeList_radio = createRadioBoxForCheckBoxs(tuoguanList, function(index){
            //self.refreshZhuaNiao();
            self.radioBoxSelectCB(index,tuoguanList[index],tuoguanList);
        });
        this.addListenerText(tuoguanList,this.tuoguanTypeList_radio);
        this.tuoguanList = tuoguanList;

        var btn_tuoguanTip = _playWayNode.getChildByName("btn_tuoguanTip");
        var image_tuoguanTip = _playWayNode.getChildByName("image_tuoguanTip");
        var text = image_tuoguanTip.getChildByName("Text_10");
        text.setFlippedX(true);
        btn_tuoguanTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_tuoguanTip.setVisible(true);
            }
        }, btn_tuoguanTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_tuoguanTip.isVisible()) {
                    image_tuoguanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_tuoguanTip);

    },
    setPlayNodeCurrentSelect: function(isClub) {
        this._super();

        var _Duohu;
        if (isClub)
            _Duohu = this.getBoolItem("duohu", false);
        else
            _Duohu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangshui_isDuoHu, false);
        this._payDuoHuNode.setSelected(_Duohu);
        var text = this._payDuoHuNode.getChildByName("text");
        this.selectedCB(text, _Duohu)

        var _DaDiaoChe;
        if (isClub)
            _DaDiaoChe = this.getBoolItem("dadiaoche", false);
        else
            _DaDiaoChe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangshui_dadiaoche, false);
        this._DaDiaoCheNode.setSelected(_DaDiaoChe);
        var text = this._DaDiaoCheNode.getChildByName("text");
        this.selectedCB(text, _DaDiaoChe)

        var _ZhuangFen;
        if (isClub)
            _ZhuangFen = this.getBoolItem("zhuangfen", false);
        else
            _ZhuangFen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xiangshui_zhuangfen, false);
        this._ZhuangFenNode.setSelected(_ZhuangFen);
        var text = this._ZhuangFenNode.getChildByName("text");
        this.selectedCB(text, _ZhuangFen)

        //人数
        var _currentCount;
        if (isClub)
            if (this.getBoolItem("convertible", false))
                _currentCount = 3;
            else
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangshui_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        var _trustTime;
        if (isClub)
            _trustTime = [0, 60, 120, 180].indexOf(this.getNumberItem("trustTime", 0));
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xiangshui_tuoguan, 0);
        this.tuoguanTypeList_radio.selectItem(_trustTime);
        this.radioBoxSelectCB(_trustTime,this.tuoguanList[_trustTime],this.tuoguanList);


        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XIANG_SHUI_MJ;
        para.maxPlayer = 4;
        para.trustTime = 0;
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps
        //花的选项

        //一炮多响，截胡
        para.duohu = this._payDuoHuNode.isSelected();
        para.dadiaoche = this._DaDiaoCheNode.isSelected();
        para.zhuangfen = this._ZhuangFenNode.isSelected();

        //人数
        var _countIdx = 0;
        para.convertible = false;
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

        var tuoguan = 0;
        if (this._playNode_tuoguanType_0.isSelected()) {
           para.trustTime = 0;
            tuoguan = 0;
        }
        else if (this._playNode_tuoguanType_1.isSelected()) {
           para.trustTime = 60;
            tuoguan = 1;
        }
        else if (this._playNode_tuoguanType_2.isSelected()) {
           para.trustTime = 120;
            tuoguan = 2;
        }
        else if (this._playNode_tuoguanType_3.isSelected()) {
           para.trustTime = 180;
            tuoguan = 3;
        }
        
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangshui_dadiaoche,para.dadiaoche);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangshui_isDuoHu, para.duohu);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xiangshui_count, _countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangshui_tuoguan, tuoguan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xiangshui_zhuangfen, para.zhuangfen);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }


});