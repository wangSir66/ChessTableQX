/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_hejinkunjin = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_yunchengtiejin_jinnum       = "yunchengtiejin_jinmun";  //金牌数
        this.localStorageKey.KEY_hejinkunjin_difen = "hejinkunjin_DI_FEN"; //底分
        this.localStorageKey.KEY_hejinkunjin_count = "hejinkunjin_COUNT"; //人数
        this.localStorageKey.KEY_hejinkunjin_gps = "_hejinkunjin_GPS"; //防作弊
        this.localStorageKey.KEY_hejinkunjin_kunJinNum = "hejinkunjin_kunJinNum"; //捆几金
        this.localStorageKey.KEY_hejinkunjin_jinfengding = "hejinkunjin_jinfengding"; //金封顶 

    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_hejinkunjin.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_hejinkunjin");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },
    initRoundNode: function() {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    initPlayNode: function() {
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
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;
        this.initPlayNumNode(nodeCountList1, [4, 3, 2, 4]);

        //底分
        this._zhuIdx = 0; //数组的引索
        var _fenshu = [1, 2, 3, 4, 5, 10, 20, 50, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        var _arrayLenth = _fenshu.length; //数组长度
        this._ZhuNum = _play.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _play.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx) % _arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = _play.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx) % _arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);

        

        //捆金几个
        this._playNode_kunYiJin = _play.getChildByName("play_kunYiJin");
        this.addListenerText(this._playNode_kunYiJin,null,function(){
            if (this._playNode_kunYiJin.isSelected()) {
                this._playNode_kunErJin.setSelected(false); 
                var text = this._playNode_kunErJin.getChildByName("text");
                this.selectedCB(text, false);
                // selectedCB
            }
        }.bind(this));
        this._playNode_kunErJin = _play.getChildByName("play_kunErJin");
        this.addListenerText(this._playNode_kunErJin,null,function(){
            if (this._playNode_kunErJin.isSelected()) {
                this._playNode_kunYiJin.setSelected(false);
                var text = this._playNode_kunYiJin.getChildByName("text");
                this.selectedCB(text, false); 
            }
        }.bind(this));
        this._playNode_kunYiJin.addEventListener(function(sender,type){
                this.clickCB();
                switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    this._playNode_kunYiJin.setSelected(true);
                    this._playNode_kunErJin.setSelected(false); 
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this._playNode_kunYiJin.setSelected(false);
                    
                    break;
            }
        },this);


        this._playNode_kunErJin.addEventListener(function(sender,type){
                switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                    this._playNode_kunYiJin.setSelected(false);
                    this._playNode_kunErJin.setSelected(true); 
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this._playNode_kunErJin.setSelected(false);
                    
                    break;
            }
        },this);


        this._playNode_erJinFengDing = _play.getChildByName("play_erJinFengDing");
        this._playNode_sanJinFengDing = _play.getChildByName("play_sanJinFengDing");
        this._playNode_siJinFengDing = _play.getChildByName("play_siJinFengDing");
        this._fengDingList = [];
        this._fengDingList.push(this._playNode_erJinFengDing);
        this._fengDingList.push(this._playNode_sanJinFengDing);
        this._fengDingList.push(this._playNode_siJinFengDing);
        this._playNode_fengDing_radio = createRadioBoxForCheckBoxs(this._fengDingList, this.radioBoxSelectCB);
        this.addListenerText(this._fengDingList, this._playNode_fengDing_radio);

        this.play_jinnum4 = _play.getChildByName("play_jinnum4");
        this.play_jinnum8 = _play.getChildByName("play_jinnum8");
        var nodejinnumList1 = [];
        nodejinnumList1.push(_play.getChildByName("play_jinnum4"));
        nodejinnumList1.push(_play.getChildByName("play_jinnum8"));
        this._playNode_player_jinnum_radio = createRadioBoxForCheckBoxs(nodejinnumList1, function(index){
            this.radioBoxSelectCB(index, nodejinnumList1[index], nodejinnumList1);
        }.bind(this));
        this.addListenerText(nodejinnumList1, this._playNode_player_jinnum_radio,this.changePayForPlayerNum.bind(this));
        this._jinnumlist = nodejinnumList1;




            // 防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        this.schedule(function() {
            var txt1 = this._playNode_kunErJin.getChildByName("text");
            if (this._playNode_kunErJin.isSelected()) {
                txt1.setTextColor(CREATEROOM_COLOR_1);
            } else {
                txt1.setTextColor(CREATEROOM_COLOR_3);
            }
            var txt2 = this._playNode_kunYiJin.getChildByName("text");
            if (this._playNode_kunYiJin.isSelected()) {
                txt2.setTextColor(CREATEROOM_COLOR_1);
            } else {
                txt2.setTextColor(CREATEROOM_COLOR_3);
            }

        }.bind(this));


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
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hejinkunjin_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);



        var _fenshu = [1, 2, 3, 4, 5, 10, 20, 50, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 1);
            _idx = _fenshu.indexOf(parseInt(_idx));
        } else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hejinkunjin_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx) % _fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_hejinkunjin_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);
        //捆金几个
        var _kunJinNum;
        if (isClub)
            _kunJinNum = this.getNumberItem("kunjinnum", 1);
        else
            _kunJinNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hejinkunjin_kunJinNum, 1);

        if (_kunJinNum === 1) {
            this._playNode_kunYiJin.setSelected(true);
            this._playNode_kunErJin.setSelected(false); 
            var text = this._playNode_kunYiJin.getChildByName("text");
            this.selectedCB(text, true);
        }else if(_kunJinNum === 2){
            this._playNode_kunYiJin.setSelected(false);
            this._playNode_kunErJin.setSelected(true); 
            var text = this._playNode_kunErJin.getChildByName("text");
            this.selectedCB(text, true);
        }else{
            this._playNode_kunYiJin.setSelected(false);
            this._playNode_kunErJin.setSelected(false); 
        }

        var _jinFengDing;
        if (isClub)
            _jinFengDing = this.getNumberItem("jinfengding", 1);
        else
            _jinFengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_hejinkunjin_jinfengding, 1);
        this._playNode_fengDing_radio.selectItem(_jinFengDing);
        cc.log(" ========= _jinFengDing ",_jinFengDing);
        this.radioBoxSelectCB(_jinFengDing,this._fengDingList[_jinFengDing],this._fengDingList);

        var _jinnum;
        if (isClub)
            _jinnum = [4, 8].indexOf(this.getNumberItem("jinshu", 4));
        else
            _jinnum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_yunchengtiejin_jinnum, 0);
        this._playNode_player_jinnum_radio.selectItem(_jinnum);
        this.radioBoxSelectCB(_jinnum, this._jinnumlist[_jinnum], this._jinnumlist)

        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HE_JIN_KUN_JIN;
        para.maxPlayer = 4;
        para.difen = 1;
        para.jinshu = 4;
        para.convertible = false;//是否自由人数

        var jinIdx = 0;
         if (this.play_jinnum4.isSelected()) {
             para.jinshu = 4;
             jinIdx = 0;
         }
         else if (this.play_jinnum8.isSelected()) {
             para.jinshu = 8;
             jinIdx = 1;
         }

        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
            _countIdx = 0;
        } else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 1;
        } else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 2;
        }
        else if (this._playNode_maxPlayer3.isSelected()) {
            para.maxPlayer = 4;
            para.convertible = true;
            _countIdx = 3;
        }

        para.difen = this._ZhuNum.getString();

        if (this._playNode_kunYiJin.isSelected()) {
            para.kunjinnum = 1;
        }else if (this._playNode_kunErJin.isSelected()) {
            para.kunjinnum = 2;
        }else{
            para.kunjinnum = 0;
        }
        para.jinfengding = this._playNode_fengDing_radio.getSelectIndex();
        //防作弊
        para.gps = this._playNode_gps.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hejinkunjin_count, _countIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_yunchengtiejin_jinnum, jinIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hejinkunjin_difen, Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_hejinkunjin_gps, para.gps);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hejinkunjin_kunJinNum, para.kunjinnum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_hejinkunjin_jinfengding, para.jinfengding);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});