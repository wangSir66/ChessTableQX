 /**
 * Created by Tom on 2018/5/15.
 */


var CreateRoomNode_doudizhuLVLIANG = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_DDZ_LVLIANG_playerNumber       = "_DOU_DI_ZHU_LVLIANG_PLAYER_NUMBER";       //玩家数量
        this.localStorageKey.KEY_DDZ_LVLIANG_jiabei             = "_DOU_DI_ZHU_LVLIANG_JIA_BEI";           //加倍
        this.localStorageKey.KEY_DDZ_LVLIANG_difen              = "_DOU_DI_ZHU_LVLIANG_DI_FEN";              //底分
        this.localStorageKey.KEY_DDZ_LVLIANG_type               = "_DOU_DI_ZHU_LVLIANG";                     //类型
        this.localStorageKey.KEY_DDZ_LVLIANG_gps                = "_DOU_DI_ZHU_LVLIANG_GPS";                 //防作弊
        this.localStorageKey.KEY_DDZ_LVLIANG_shuangwangbijiao               = "_DOU_DI_ZHU_LVLIANG_SHUANG_WANG_BIJIAO";                 //双王必叫
        this.localStorageKey.KEY_DDZ_LVLIANG_sigeerbijiao                = "_DOU_DI_ZHU_LVLIANG_SI_GE_ER_BIJIAO";                 //四个二必叫
        this.localStorageKey.KEY_DDZ_LVLIANG_fengding           = "_DOU_DI_ZHU_FENG_DING"
    },
    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();
        this.bg_node = ccs.load("bg_doudizhuLvLiang.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_node");
        this.playScroll = this.bg_node.getChildByName("playScroll");
        this._scroll_round = this.playScroll.getChildByName("round");
    },
    initPlayNode:function()
    {
        var _bg_Node = this.playScroll;
        var _playWay = _bg_Node.getChildByName("play");

        this._playNode_type_0 = _playWay.getChildByName("play_type");    //经典斗地主玩法
        var nodeListtype = [];
        nodeListtype.push(this._playNode_type_0);
        this._playNode_tpye_radio = createRadioBoxForCheckBoxs(nodeListtype, function(index){
                this.radioBoxSelectCB(index, this._playNode_tpye_radio, nodeListtype);
        }.bind(this));
        this.gameList = nodeListtype;


        //加倍
        this._playNode_jiabei = _playWay.getChildByName("play_type1");   //加倍
        this.addListenerText(this._playNode_jiabei);
        this._playNode_jiabei.addEventListener(this.clickCB, this._playNode_jiabei);

        this._playNode_bijiaoshuangwang = _playWay.getChildByName("play_bijiaoshuangwang");   //双王必叫
        this.addListenerText(this._playNode_bijiaoshuangwang);
        this._playNode_bijiaoshuangwang.addEventListener(this.clickCB, this._playNode_bijiaoshuangwang);

        this._playNode_bijiaosigeer = _playWay.getChildByName("play_bijiaosigeer");   //四个二必叫
        this.addListenerText(this._playNode_bijiaosigeer);
        this._playNode_bijiaosigeer.addEventListener(this.clickCB, this._playNode_bijiaosigeer);


        //底分

        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,6,7,8,9,10,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _bg_Node.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = _bg_Node.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);

        //封顶
        this._playNode_fengding_0 = _playWay.getChildByName("play_fengding0");
        this._playNode_fengding_1 = _playWay.getChildByName("play_fengding1");
        this._playNode_fengding_2 = _playWay.getChildByName("play_fengding2");
        this._playNode_fengding_3 = _playWay.getChildByName("play_fengding3");
        var nodeListfeng = [];
        nodeListfeng.push( this._playNode_fengding_0 );
        nodeListfeng.push( this._playNode_fengding_1 );
        nodeListfeng.push( this._playNode_fengding_2 );
        nodeListfeng.push( this._playNode_fengding_3 );
        this._playNode_feng_radio = createRadioBoxForCheckBoxs(nodeListfeng,this.radioBoxSelectCB);
        this.addListenerText(nodeListfeng,this._playNode_feng_radio);

        //防作弊
        this._playNode_gps = this.bg_node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        //人数
        this._playNode_maxPlayer0 = _playWay.getChildByName("play_count0");
        this._playNode_maxPlayer1 = _playWay.getChildByName("play_count1");
        var nodeCountList1 = [];
        nodeCountList1.push(this._playNode_maxPlayer0);
        nodeCountList1.push(this._playNode_maxPlayer1);
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function (index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;
    },
    initRoundNode:function()
    {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    setPlayNodeCurrentSelect:function(isClub) {
        var _fengDing;
        if (isClub)
            _fengDing = this.getNumberItem("zhafengding", -1);
        else
            _fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZ_LVLIANG_fengding, -1);
        this._playNode_fengding_0.setSelected(false);
        this._playNode_fengding_1.setSelected(false);
        this._playNode_fengding_2.setSelected(false);
        this._playNode_fengding_3.setSelected(false);
        var list = [];
        list.push(this._playNode_fengding_0);
        list.push(this._playNode_fengding_1);
        list.push(this._playNode_fengding_2);
        list.push(this._playNode_fengding_3);
        var index = 0;

        if (_fengDing == 3) {
            this._playNode_fengding_0.setSelected(true);
            index = 0;
        }
        else if (_fengDing == 4) {
            index = 1;
            this._playNode_fengding_1.setSelected(true);
        }
        else if (_fengDing == 5) {
            index = 2;
            this._playNode_fengding_2.setSelected(true);
        }
        else
        {
            index = 3;
            this._playNode_fengding_3.setSelected(true);
        }
        this.radioBoxSelectCB(index, list[index], list);
        cc.log('ssssssssssssssss:'+JSON.stringify(_fengDing))
        var _type;
        if (isClub) {
            _type = this.getStringItem("type", "jingdian");
            if (_type == "jingdian") _type = 0;
            else _type = 1;
        }
        else
            _type = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZ_LVLIANG_type, 0);

        this._playNode_type_0.setSelected(true);
        var listtype = [];
        listtype.push(this._playNode_type_0);
        var index = 0;
        if(_type ==0)
        {
            this._playNode_type_0.setSelected(true);
            index = 0;
        }
        this.radioBoxSelectCB(index,listtype[index],listtype);

        var _difen;
        var _fenshu = [1,2,3,4,5,6,7,8,9,10,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
        if (isClub) {
            _difen = _fenshu.indexOf(this.getNumberItem("difen", 1));
        }
        else
            _difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZ_LVLIANG_difen, 0);
        this._zhuIdx = (_fenshu.length + _difen)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        //防作弊
        var _gps;
        if (isClub)
            _gps = this.getBoolItem("gps", false);
        else
            _gps = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_LVLIANG_gps, false);
        this._playNode_gps.setSelected(_gps);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, _gps);

        //加倍
        var _jiabei;
        if(isClub)
            _jiabei = this.getBoolItem("jiabei", true);
        else
            _jiabei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_LVLIANG_jiabei, true);
        this._playNode_jiabei.setSelected(_jiabei);
        var text = this._playNode_jiabei.getChildByName("text");
        this.selectedCB(text, _jiabei);

        //双王必叫
        var _shuangwangbijiao;
        if(isClub)
            _shuangwangbijiao = this.getBoolItem("bijiaoShuangwang", true);
        else
            _shuangwangbijiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_LVLIANG_shuangwangbijiao, true);
        this._playNode_bijiaoshuangwang.setSelected(_shuangwangbijiao);
        var text = this._playNode_bijiaoshuangwang.getChildByName("text");
        this.selectedCB(text, _shuangwangbijiao);

        //四个二必叫
        var _sigeerbijiao;
        if(isClub)
            _sigeerbijiao = this.getBoolItem("bijiaoSigeer", true);
        else
            _sigeerbijiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_LVLIANG_sigeerbijiao, true);
        this._playNode_bijiaosigeer.setSelected(_sigeerbijiao);
        var text = this._playNode_bijiaosigeer.getChildByName("text");
        this.selectedCB(text, _sigeerbijiao);

        //人数
        var _countIdx;
        if (isClub) {
            var _count = this.getNumberItem("maxPlayer", 3);
            switch (_count) {
                case 2:
                    _countIdx = 1;
                    break;
                case 3:
                    _countIdx = 0;
                    break;
                default:
                    _countIdx = 0;
                    break;
            }
        } else {
            _countIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZ_LVLIANG_playerNumber, 0);
        }
        this._playNode_player_count_radio.selectItem(_countIdx);
        this.radioBoxSelectCB(_countIdx, this._countlist[_countIdx], this._countlist);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.DOU_DI_ZHU_LV_LIANG;
        para.zhafengding  = 3;
        para.maxPlayer = 3;
        para.type = "jingdian";
        para.jiabei = true;
        para.bijiaoShuangwang=false;
        para.bijiaoSigeer=false;

        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps

        if(this._playNode_fengding_0.isSelected())
        {
            para.zhafengding = 3;
        }
        else if(this._playNode_fengding_1.isSelected())
        {
            para.zhafengding = 4;
        }
        else if(this._playNode_fengding_2.isSelected())
        {
            para.zhafengding = 5;
        }
        else if(this._playNode_fengding_3.isSelected())
        {
            para.zhafengding = -1;
        }

        var _type = 0;
        if(this._playNode_type_0.isSelected())
        {
            _type = 0;
            para.type = "jingdian";
        }

        // para.difen = parseInt(this._ZhuNum.getString());
        para.difen = this._ZhuNum.getString();

        //防作弊
        para.gps = this._playNode_gps.isSelected();

        para.jiabei = this._playNode_jiabei.isSelected();

        para.bijiaoShuangwang = this._playNode_bijiaoshuangwang.isSelected();

        para.bijiaoSigeer = this._playNode_bijiaosigeer.isSelected();

        //人数
        var _countIdx = 0;
        if (this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 3;
            _countIdx = 0;
        } else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 2;
            _countIdx = 1;
        }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZ_LVLIANG_fengding,para.zhafengding);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZ_LVLIANG_type, _type);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZ_LVLIANG_difen, this._zhuIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_LVLIANG_gps, para.gps);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_LVLIANG_jiabei, para.jiabei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_LVLIANG_shuangwangbijiao, para.bijiaoShuangwang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_LVLIANG_sigeerbijiao, para.bijiaoSigeer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZ_LVLIANG_playerNumber, _countIdx);
        }
        cc.log("lvliang_doudizhu_createara: " + JSON.stringify(para));
        return para;
    }
});