

var CreateRoomNode_GanDengYan = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_GDY_PLAYERNUMBER   = "GDY_PLAYER_NUMBER";       //玩家数量
        this.localStorageKey.KEY_GDY_FENG_DING      = "GDY_FENG_DING";           //封顶
        this.localStorageKey.KEY_GDY_DIFEN          = "GDY_DIFEN";               //底分
        this.localStorageKey.KEY_GDY_ADD_CARD       = "GDY_ADD_CARD";               //底分
        this.localStorageKey.KEY_GDY_ZHA_DAN_FAN_BEI  = "GDY_ZHA_DAN_FAN_BEI";    //炸弹翻倍
        this.localStorageKey.KEY_GDY_GUAN_MEN_FAN_BEI  = "GDY_GUAN_MEN_FAN_BEI";    //关门翻倍
        this.localStorageKey.KEY_GDY_SAN_ZHA        = "GDY_SAN_ZHA";    //三炸
        this.localStorageKey.KEY_GDY_GPS          = "GDY_GPS";                  //防作弊
    },

    initAll:function(IsFriendCard)
    {   
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_ganDengYan.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_paodekuai");
    },
    initPlayNode:function()
    {
        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();
        }

        var _bg_Node = this.bg_node;

        // 防作弊
        this._playNode_gps = _bg_Node.getChildByName("play_gps");
        this.addListenerText(this._playNode_gps);
        this._playNode_gps.addEventListener(this.clickCB, this._playNode_gps);
        COMMON_UI.addHelpUI(this._playNode_gps);

        var _bg_Node = this.bg_node.getChildByName("view");
        var _playWay = _bg_Node.getChildByName("play_way");

        // 人数
        var nodeListA = [];
        nodeListA.push( _playWay.getChildByName("play_countFree") );
        nodeListA.push( _playWay.getChildByName("play_count5") );
        nodeListA.push( _playWay.getChildByName("play_count4") );
        nodeListA.push( _playWay.getChildByName("play_count3") );
        nodeListA.push( _playWay.getChildByName("play_count2") );       
        var cb = function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeListA[index], nodeListA);
        }.bind(this)
        this.playPlayerNum = createRadioBoxForCheckBoxs(nodeListA, cb);
        this.addListenerText(nodeListA,this.playPlayerNum, cb);
        this.nodeListA = nodeListA;
        this.initPlayNumNode(nodeListA, [5,5,4,3,2]); 

        // 封顶
        var nodeListB = [];
        nodeListB.push( _playWay.getChildByName("fengDingOption1") );
        nodeListB.push( _playWay.getChildByName("fengDingOption2") );       
        nodeListB.push( _playWay.getChildByName("fengDingOption3") );       
        this.playFengDing = createRadioBoxForCheckBoxs(nodeListB,this.radioBoxSelectCB);
        this.addListenerText(nodeListB,this.playFengDing);
        this.nodeListB = nodeListB;

        // 底分
        var fenshu = [1,2,3,4,5,6,7,8,9,10];
        var arrayLenth =  fenshu.length;//数组长度
        var btnSub = _bg_Node.getChildByName("btn_sub");
        var btnAdd = _bg_Node.getChildByName("btn_add");

        this.zhuIdx = 0;//数组的引索
        this.zhuNum = _bg_Node.getChildByName("txt_fen");
        this.zhuNum.setString(fenshu[this.zhuIdx]);
        
        btnSub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this.zhuIdx = (arrayLenth + --this.zhuIdx) % arrayLenth;
                this.zhuNum.setString(fenshu[this.zhuIdx]);
            }
        }, this);

        btnAdd.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this.zhuIdx = (arrayLenth + ++this.zhuIdx) % arrayLenth;
                this.zhuNum.setString(fenshu[this.zhuIdx]);
            }
        }, this);

        // 补牌
        var nodeListC = [];
        nodeListC.push( _playWay.getChildByName("play_winnerAddCard") );
        nodeListC.push( _playWay.getChildByName("play_allAddCard") );            
        this.playAddCard = createRadioBoxForCheckBoxs(nodeListC,this.radioBoxSelectCB);
        this.addListenerText(nodeListC,this.playAddCard);
        this.nodeListC = nodeListC;

        // 炸弹翻倍
        this.zhaDanFanBei = _playWay.getChildByName("play_zhaDanFanBei");
        this.addListenerText(this.zhaDanFanBei);
        this.zhaDanFanBei.addEventListener(this.clickCB, this.zhaDanFanBei);

        // 关门翻倍
        this.guanMenFanBei = _playWay.getChildByName("play_guanMenFanBei");
        this.addListenerText(this.guanMenFanBei);
        this.guanMenFanBei.addEventListener(this.clickCB, this.guanMenFanBei);

        this.sanZha = _playWay.getChildByName("play_sanZha");
        this.addListenerText(this.sanZha);
        this.sanZha.addEventListener(this.clickCB, this.sanZha);
    },
    initRoundNode:function()
    {
       this._super();

       //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    setPlayNodeCurrentSelect:function(isClub)
    {

        if(MjClient.APP_TYPE.QXJSMJ == MjClient.getAppType())
        {
            this._super();
        }

        //设置上次创建房间时的默认选项

        // 人数
        var option;
        if (isClub)
            if (this.getBoolItem("convertible", true))
                option = 0;
            else
                option = [5, 4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 5)) + 1;
        else
            option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_GDY_PLAYERNUMBER, 0);

        this.playPlayerNum.selectItem(option);
        this.radioBoxSelectCB(option,this.nodeListA[option],this.nodeListA);

        // 封顶
        if (isClub)
            option = this.getNumberItem("fengDing", 0);
        else
            option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_GDY_FENG_DING, 0);
        this.playFengDing.selectItem(option)
        this.radioBoxSelectCB(option,this.nodeListB[option],this.nodeListB);

        // 底分
        var fenshu = [1,2,3,4,5,6,7,8,9,10];
        if (isClub)
            option = fenshu.indexOf(this.getNumberItem("difen", 1));
        else
            option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_GDY_DIFEN, 0);
        this.zhuIdx = (fenshu.length + option) % fenshu.length;
        this.zhuNum.setString(fenshu[this.zhuIdx]);

        // 补牌
        if (isClub)
            option = this.getNumberItem("addCard", 1);
        else
            option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_GDY_ADD_CARD, 1);
        this.playAddCard.selectItem(option)
        this.radioBoxSelectCB(option,this.nodeListC[option],this.nodeListC);

        // 炸弹翻倍
        if (isClub)
            option = this.getBoolItem("zhaDanFanBei", true);
        else 
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_GDY_ZHA_DAN_FAN_BEI, true);
        this.zhaDanFanBei.setSelected(option);
        var text = this.zhaDanFanBei.getChildByName("text");
        this.selectedCB(text,option)

        // 关门翻倍
        if (isClub)
            option = this.getBoolItem("guanMenFanBei", true);
        else 
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_GDY_GUAN_MEN_FAN_BEI, true);
        this.guanMenFanBei.setSelected(option);
        var text = this.guanMenFanBei.getChildByName("text");
        this.selectedCB(text,option)

        // 三炸
        if (isClub)
            option = this.getBoolItem("sanZha", true);
        else 
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_GDY_SAN_ZHA, true);
        this.sanZha.setSelected(option);
        var text = this.sanZha.getChildByName("text");
        this.selectedCB(text,option)

        //防作弊
        if (isClub)
            option = this.getBoolItem("gps", false);
        else
            option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_GDY_GPS, false);
        this._playNode_gps.setSelected(option);
        var text = this._playNode_gps.getChildByName("text");
        this.selectedCB(text, option);
    },

    getSelectedPara:function()
    {
        var para = {};

        para.gameType = MjClient.GAME_TYPE.SHAN_XI_GAN_DENG_YAN;
        para.maxPlayer = [5,5,4,3,2][this.playPlayerNum.getSelectIndex()];
        para.convertible = this.playPlayerNum.getSelectIndex() == 0;
        para.fengDing = this.playFengDing.getSelectIndex();  // number 0、1、2
        para.difen = this.zhuIdx + 1;  // number  1、2、3等
        para.addCard = this.playAddCard.getSelectIndex();  // number 0、1
        para.zhaDanFanBei = this.zhaDanFanBei.isSelected(); // bool
        para.guanMenFanBei = this.guanMenFanBei.isSelected(); // bool
        para.sanZha = this.sanZha.isSelected(); // bool
        para.gps = this._playNode_gps.isSelected();  // bool

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_GDY_PLAYERNUMBER, this.playPlayerNum.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_GDY_FENG_DING, para.fengDing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_GDY_DIFEN, this.zhuIdx);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_GDY_ADD_CARD, para.addCard);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_GDY_ZHA_DAN_FAN_BEI, para.zhaDanFanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_GDY_GUAN_MEN_FAN_BEI, para.guanMenFanBei);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_GDY_SAN_ZHA, para.sanZha);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_GDY_GPS,  para.gps);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});