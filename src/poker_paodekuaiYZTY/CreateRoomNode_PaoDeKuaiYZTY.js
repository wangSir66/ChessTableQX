//永州，邵阳，湘乡，耒阳，衡阳的跑得快公用

var CreateRoomNode_PaoDeKuaiYZTY = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_PDK_PLAYERNUMBER   = "PAO_DE_KUAI_TY_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_PDK_CARDNUMBER   = "KEY_PDK_CARDNUMBER";                   //手牌数量
        this.localStorageKey.KEY_PDK_MUST_PUT     = "PAO_DE_KUAI_TY_MUST_BEAT";              //能管必管(字段被下面占用了。。。。)
        this.localStorageKey.KEY_PDK_ZHADANBUCHAI = "PAO_DE_KUAI_TY_MUST_PUT";                 //炸弹不可拆
        this.localStorageKey.KEY_PDK_SHOWCARDNUMBER = "PAO_DE_KUAI_TY_SHOW_CARD_NUMBER";       //显示牌数
        this.localStorageKey.KEY_PDK_FIRSTHEITAO3 = "PAO_DE_KUAI_TY_FIRST_HEI_TAO_3";     //先出黑桃3
        this.localStorageKey.KEY_PDK_TWOPLAYER_FIRSRPUTRULE = "PAO_DE_KUAI_TY_TWOPLAYER_FIRSRPUTRULE" // 两个人时先出规则
        this.localStorageKey.KEY_PDK_4DAI2 = "PAO_DE_KUAI_TY_4DAI2";     //4带2
        this.localStorageKey.KEY_PDK_4DAI3 = "PAO_DE_KUAI_TY_4DAI3";     //4带3
        this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO = "PAO_DE_KUAI_TY_HONG_TAO_10_NIAO";     //红桃10扎鸟
        this.localStorageKey.KEY_PDK_FANG_ZUO_BI    = "PAO_DE_KUAI_TY_FANG_ZUO_BI";     // 防作弊
        this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN  = "PAO_DE_KUAI_TY_CAN_3A_ZHADAN";   // 三个A算炸弹
        this.localStorageKey.KEY_PDK_CAN_3ge3_ZHADAN= "PAO_DE_KUAI_TY_CAN_3ge3_ZHADAN";     // 三个3算炸弹
        this.localStorageKey.KEY_PDK_IS_AUTOTIP = "PAO_DE_KUAI_IS_AUTOTIP"; //自动提示
        this.localStorageKey.KEY_PDK_canPutAnyFeiji = "PAO_DE_KUAI_TY_CAN_PUT_ANY_FEIJI";       //飞机可少带接完
        this.localStorageKey.KEY_PDK_canPutAnySanZhang = "PAO_DE_KUAI_TY_CAN_PUT_ANY_SANZHANG";         //三张可少带接完
        this.localStorageKey.KEY_PDK_SHUFFLE_OPTION = "PAO_DE_KUAI_TY_SHUFFLE_OPTION" // 切牌
        this.localStorageKey.KEY_PDK_DIFEN          = "PAO_DE_KUAI_TY_DIFEN";//底分
        this.localStorageKey.KEY_PDK_PLAYSPEED   = "PAO_DE_KUAI_TY_PLAY_SPEED";           //速度
        this.localStorageKey.KEY_PDK_ZHA_NIAO   = "PAO_DE_KUAI_TY_ZHA_NIAO";  //扎鸟
        this.localStorageKey.KEY_PDK_ZHA_NIAO_ZHADAN   = "PAO_DE_KUAI_TY_ZHA_NIAO_ZHADAN";  //扎鸟含炸弹
        this.localStorageKey.KEY_PDK_HAVE_ZHADAN   = "PAO_DE_KUAI_TY_HAVE_ZHADAN";//有炸弹
        this.localStorageKey.KEY_PDK_IS_PER_FIRST_RULE   = "PAO_DE_KUAI_TY_IS_PER_FIRST_RULE";//
        this.localStorageKey.KEY_PDK_JIA_FEN   = "PAO_DE_KUAI_TY_JIA_FEN";//加分
        this.localStorageKey.KEY_PDK_PIAO_FEN   = "PAO_DE_KUAI_TY_PIAO_FEN";//飘分

        this.setExtraKey({
            fanBei: "PAO_DE_KUAI_TY_FAN_BEI",  //大结算翻倍
            fanBeiScore: "PAO_DE_KUAI_TY_FAN_BEI_SCORE",  //少于X分大结算翻倍
            tuoGuan: "PAO_DE_KUAI_TY_TUO_GUAN",          //托管
            fengDing: "PAO_DE_KUAI_TY_FENG_DING",          //封顶
            trustWhole: "PAO_DE_KUAI_TY_TRUST_WHOLE",  //整局托管
            trustWay: "PAO_DE_KUAI_TY_TRUST_WAY"  // 托管方式
        });
    },
    changeToCardNum: function()
    {
        var b = false;
        if (this.checkBoxhavezhadan) b = this._card_number_radio.getSelectIndex() == 0 && this.checkBoxhavezhadan.isSelected();
        else b = this._card_number_radio.getSelectIndex() == 0;
        this.can3aZhaDan.setVisible(b); 
        this.can3aZhaDan.setSelected(b);
        if (!this._isFriendCard){
            util.localStorageEncrypt.setBoolItem(b);
        }
    },
    changeToHaveZhaDan: function()
    {
        this.can3aZhaDan.setVisible(this.checkBoxhavezhadan.isSelected() && this._card_number_radio.getSelectIndex() == 0);
        this.zhaDanBuChai.setVisible(this.checkBoxhavezhadan.isSelected());
        this.can3ge3ZhaDan.setVisible(this.checkBoxhavezhadan.isSelected());
        if (this.checkBoxhavezhadan.isSelected() == false)
        {
            this.can3aZhaDan.setSelected(false);
            this.zhaDanBuChai.setSelected(false);
            this.can3ge3ZhaDan.setSelected(false);
            if (!this._isFriendCard){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN,false);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHADANBUCHAI, false);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_3ge3_ZHADAN, false);
            }

            this.can3aZhaDan.getChildByName("text").setTextColor(CREATEROOM_COLOR_SY_UNSELECT);
            this.zhaDanBuChai.getChildByName("text").setTextColor(CREATEROOM_COLOR_SY_UNSELECT);
            this.can3ge3ZhaDan.getChildByName("text").setTextColor(CREATEROOM_COLOR_SY_UNSELECT);
        }

    },
    changeToPlayerNumber:function (num) {
        if (num == 2){
            this.fangZuoBi.setVisible(false);
            if (MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ)
            {
                this.firstHeiTao3.setVisible(false)
                for(var i = 0; i < this.nodeListFirstOutCard.length; i++){
                    var radio = this.nodeListFirstOutCard[i]
                    radio.setVisible(true)
                } 
                this.zhaDanBuChai.setPosition(this.fangZuoBiPos)
            }
        }else{
            this.fangZuoBi.setVisible(true);
            if (MjClient.getAppType() != MjClient.APP_TYPE.QXSYDTZ)
            {
                this.firstHeiTao3.setVisible(true)
                for(var i = 0; i < this.nodeListFirstOutCard.length; i++){
                    var radio = this.nodeListFirstOutCard[i]
                    radio.setVisible(false)
                }  
                this.zhaDanBuChai.setPosition(this.zhaDanBuChaiPos)
            }
        }
        this.changeToPlayerNumber_jiaFen(num);
    },
    initAll:function(IsFriendCard)
    {
        var appType = MjClient.getAppType();
        if(MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP || MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PayWay, 0);
        }
        if (appType == MjClient.APP_TYPE.QXSYDTZ || appType == MjClient.APP_TYPE.HUNANWANGWANG) {
            this._costName = '黄金';
        }

        if (!IsFriendCard)
            this.setKey();

        // var majiang = MjClient.data.gameInfo.js3mj;
        // this.fangzhuPay = {pay4:majiang.roundYZPaoDeKuaiYZTY5,  pay8:majiang.roundYZPaoDeKuaiYZTY10,  pay16:majiang.roundYZPaoDeKuaiYZTY15};
        // this.AAPay      = {pay4:majiang.roundYZPaoDeKuaiYZTYAA5,pay8:majiang.roundYZPaoDeKuaiYZTYAA10,pay16:majiang.roundYZPaoDeKuaiYZTYAA15};
        // this.clubPay    = {pay4:majiang.roundYZPaoDeKuaiYZTYCL5,pay8:majiang.roundYZPaoDeKuaiYZTYCL10,pay16:majiang.roundYZPaoDeKuaiYZTYCL15};
        
        // this.roundNumObj = {roundNum1:5, roundNum2:10, roundNum3:15};
        // if (appType == MjClient.APP_TYPE.BDYZPHZ || appType == MjClient.APP_TYPE.BDHYZP) {
        //     this.roundNumObj = {roundNum1:5, roundNum2:10, roundNum3:20};

        // }else if(appType == MjClient.APP_TYPE.QXSYDTZ){
        //     this.roundNumObj = {roundNum1:5, roundNum2:10, roundNum3:15,roundNum4:20};
        // }
        // else if (appType == MjClient.APP_TYPE.QXLYQP) {
        //     this.roundNumObj = {roundNum1:10, roundNum2:15, roundNum3:20};
        // }

        this.bg_node = ccs.load("bg_PaoDeKuaiTY.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_paodekuai");

        if(MjClient.APP_TYPE.QXSYDTZ == appType || MjClient.APP_TYPE.QXXXGHZ == appType || 
            MjClient.APP_TYPE.QXYZQP == appType || MjClient.APP_TYPE.QXLYQP == appType ||
            MjClient.APP_TYPE.HUNANWANGWANG == appType ||
            MjClient.APP_TYPE.BDHYZP == appType){
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var that = this
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");

        

        this.showCardNumber = _playWay.getChildByName("play_showCardNumber");
        cc.eventManager.addListener(this.setTextClick(),this.showCardNumber.getChildByName("text"));
        //fix by 千千
         this.showCardNumber.addEventListener(this._clickCB, this.showCardNumber);

        this.firstHeiTao3 = _playWay.getChildByName("play_firstHeiTao");
        cc.eventManager.addListener(this.setTextClick(),this.firstHeiTao3.getChildByName("text"));
        //fix by 千千
         this.firstHeiTao3.addEventListener(this._clickCB, this.firstHeiTao3);

        this.can4dai2 = _playWay.getChildByName("play_can4dai2");
        this.can4dai2.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(),this.can4dai2.getChildByName("text"));
        //fix by 千千
         this.can4dai2.addEventListener(this._clickCB, this.can4dai2);

        this.can4dai3 = _playWay.getChildByName("play_can4dai3");
        cc.eventManager.addListener(this.setTextClick(),this.can4dai3.getChildByName("text"));
        //fix by 千千
         this.can4dai3.addEventListener(this._clickCB, this.can4dai3);

        this.ht10zhaniaohanzhadan = _playWay.getChildByName("play_ht10zhaniaohanzhadan");
        if (this.ht10zhaniaohanzhadan)
        {
            this.ht10zhaniaohanzhadan.getChildByName("text").ignoreContentAdaptWithSize(true);
            cc.eventManager.addListener(this.setTextClick(),this.ht10zhaniaohanzhadan.getChildByName("text"));        
            this.ht10zhaniaohanzhadan.addEventListener(this._clickCB, this.can4dai3);
        }
      

        this.hongTao10Niao = _playWay.getChildByName("play_hongtao10niao");
        this.hongTao10Niao.getChildByName("text").ignoreContentAdaptWithSize(true);
        cc.eventManager.addListener(this.setTextClick(null, null, null,function(number, parent){
            if(that.hongTao10Niao.isSelected()){
                if (that.ht10zhaniaohanzhadan)that.ht10zhaniaohanzhadan.visible = true;
            }else{
                if (that.ht10zhaniaohanzhadan)that.ht10zhaniaohanzhadan.setSelected(false);
                if (that.ht10zhaniaohanzhadan)that.ht10zhaniaohanzhadan.visible = false;
            }
        }),this.hongTao10Niao.getChildByName("text"));
        //fix by 千千
         this.hongTao10Niao.addEventListener(function(sender, type){
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    if(sender.isSelected()){
                        txt.setTextColor(cc.color(211,38,14));
                        if (that.ht10zhaniaohanzhadan)that.ht10zhaniaohanzhadan.visible = true;
                    }else{
                        txt.setTextColor(cc.color(68,51,51));
                        if (that.ht10zhaniaohanzhadan)that.ht10zhaniaohanzhadan.setSelected(false);
                        if (that.ht10zhaniaohanzhadan)that.ht10zhaniaohanzhadan.visible = false;
                    }
                    break;
            }
         }, this.hongTao10Niao);

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ)
            this.hongTao10Niao.visible = false;

        var nodeListA = [];
        nodeListA.push( _playWay.getChildByName("playerNumber_3") );
        nodeListA.push( _playWay.getChildByName("playerNumber_2") );

        this._playNode_player_number_radio = createRadioBoxForCheckBoxs(nodeListA,function (index) {
            that.radioBoxSelectCB(index,nodeListA[index],nodeListA)
            that._radioBoxSelectCB();
            if (index == 1){
                that.changeToPlayerNumber(2);
            }else{
                that.changeToPlayerNumber(3);
            }
        });

        cc.eventManager.addListener(this.setTextClick(nodeListA,0,this._playNode_player_number_radio,function(){
            that._radioBoxSelectCB();
            that.changeToPlayerNumber(3);
        }),nodeListA[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(nodeListA,1,this._playNode_player_number_radio,function(){
            that._radioBoxSelectCB();
            that.changeToPlayerNumber(2);
        }),nodeListA[1].getChildByName("text"));

        // var nodeListB = [];
        // nodeListB.push( _playWay.getChildByName("cardNum16") );
        // nodeListB.push( _playWay.getChildByName("cardNum15") );
        // this._card_number_radio = createRadioBoxForCheckBoxs(nodeListB,this.radioBoxSelectCB);
        // cc.eventManager.addListener(this.setTextClick(nodeListB,0,this._card_number_radio),nodeListB[0].getChildByName("text"));
        // cc.eventManager.addListener(this.setTextClick(nodeListB,1,this._card_number_radio),nodeListB[1].getChildByName("text"));



        var nodeListB = [];
        nodeListB.push( _playWay.getChildByName("cardNum16") );
        nodeListB.push( _playWay.getChildByName("cardNum15") );       
        this._card_number_radio = createRadioBoxForCheckBoxs(nodeListB, function(index, sender, list){
            that.radioBoxSelectCB(index, sender, list);
            that.changeToCardNum();
        });
        this.addListenerText(nodeListB,this._card_number_radio, function(a){
            that.changeToCardNum();
        }.bind(this));
        this.nodeListB = nodeListB;


        // 是否必管
        var checkBoxNotMustPut = _playWay.getChildByName("checkBoxNotMustPut")
        if(checkBoxNotMustPut){
            this.checkBoxNotMustPut = checkBoxNotMustPut
            this.addListenerText(this.checkBoxNotMustPut);
            this.checkBoxNotMustPut.addEventListener(this._clickCB, this.checkBoxNotMustPut);
        }

        // 黑桃三和随机先手
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)//暂时只做邵阳
        {
            var nodeListFirstOutCard = [];
            nodeListFirstOutCard.push( _playWay.getChildByName("play_mustHeiTao_radio") );
            nodeListFirstOutCard.push( _playWay.getChildByName("play_firstHeiTao") );
            nodeListFirstOutCard.push( _playWay.getChildByName("play_firstRand_radio") );
            if (_playWay.getChildByName("play_mustHeiTao_radio_pre"))
            {
                nodeListFirstOutCard.push( _playWay.getChildByName("play_mustHeiTao_radio_pre") );
                nodeListFirstOutCard.push( _playWay.getChildByName("play_firstHeiTao_pre") );
                nodeListFirstOutCard.push( _playWay.getChildByName("play_firstRand_radio_pre") );            
            }
            this.player_firstOut_radio = createRadioBoxForCheckBoxs(nodeListFirstOutCard,this.radioBoxSelectCB);
            this.addListenerText(nodeListFirstOutCard,this.player_firstOut_radio);
            this.nodeListFirstOutCard = nodeListFirstOutCard;
        }
        else{
            var nodeListFirstOutCard = [];
            nodeListFirstOutCard.push( _playWay.getChildByName("play_firstHeiTao_radio") );
            nodeListFirstOutCard.push( _playWay.getChildByName("play_firstRand_radio") );
            this.two_player_firstOut_radio = createRadioBoxForCheckBoxs(nodeListFirstOutCard,this.radioBoxSelectCB);
            this.addListenerText(nodeListFirstOutCard,this.two_player_firstOut_radio);
            this.nodeListFirstOutCard = nodeListFirstOutCard;
        }
        this.fangZuoBi = _playWay.getChildByName("play_fangZuoBi");
        this.fangZuoBi.getChildByName("text").ignoreContentAdaptWithSize(true);
		cc.eventManager.addListener(this.setTextClick(),this.fangZuoBi.getChildByName("text"));
        this.fangZuoBi.addEventListener(this._clickCB, this.fangZuoBi);
        this.fangZuoBiPos = this.fangZuoBi.getPosition()

        this.zhaDanBuChai = _playWay.getChildByName("play_zhaDanBuChai");
        cc.eventManager.addListener(this.setTextClick(),this.zhaDanBuChai.getChildByName("text"));
        this.zhaDanBuChai.addEventListener(this._clickCB, this.zhaDanBuChai);
        this.zhaDanBuChaiPos = this.zhaDanBuChai.getPosition()
        
        this.can3aZhaDan = _playWay.getChildByName("play_can3aZhaDan");
        cc.eventManager.addListener(this.setTextClick(),this.can3aZhaDan.getChildByName("text"));
        this.can3aZhaDan.addEventListener(this._clickCB, this.can3aZhaDan);
        this.can3aZhaDan.getChildByName("text").ignoreContentAdaptWithSize(true);
        
        // this.can3aZhaDan.schedule(function() {
        //     this.can3aZhaDan.setVisible(this._card_number_radio.getSelectIndex() == 0);
        // }.bind(this));

        this.can3ge3ZhaDan = _playWay.getChildByName("play_can3ge3ZhaDan");
        if (this.can3ge3ZhaDan) {
            cc.eventManager.addListener(this.setTextClick(),this.can3ge3ZhaDan.getChildByName("text"));
            this.can3ge3ZhaDan.addEventListener(this._clickCB, this.can3ge3ZhaDan);
            this.can3ge3ZhaDan.getChildByName("text").ignoreContentAdaptWithSize(true);
        }

        this.isAutoTip = _playWay.getChildByName("play_autoTip");
        this.addListenerText(this.isAutoTip);
        this.isAutoTip.addEventListener(this._clickCB, this.isAutoTip);

        this.canPutAnyFeiji = _playWay.getChildByName("canPutAnyFeiji");
		cc.eventManager.addListener(this.setTextClick(),this.canPutAnyFeiji.getChildByName("text"));
        this.canPutAnyFeiji.addEventListener(this._clickCB, this.canPutAnyFeiji);

        this.canPutAnySanZhang = _playWay.getChildByName("canPutAnySanZhang");
		cc.eventManager.addListener(this.setTextClick(),this.canPutAnySanZhang.getChildByName("text"));
        this.canPutAnySanZhang.addEventListener(this._clickCB, this.canPutAnySanZhang);

        var btn_fangZuoBiTip = this.fangZuoBi.getChildByName("btn_fangZuoBiTip");
        var image_fangZuoBiTip = this.fangZuoBi.getChildByName("image_fangZuoBiTip");
        btn_fangZuoBiTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_fangZuoBiTip.setVisible(true);
            }
        }, btn_fangZuoBiTip);

        // 切牌
        if (_playWay.getChildByName("shuffleSys"))
        {
            var nodeListShuffle = [];
            nodeListShuffle.push( _playWay.getChildByName("shuffleSys") );
            nodeListShuffle.push( _playWay.getChildByName("shufflePlayer") );
            this.shuffle_radio = createRadioBoxForCheckBoxs(nodeListShuffle,this.radioBoxSelectCB);
            this.addListenerText(nodeListShuffle,this.shuffle_radio);
            this.nodeListShuffle = nodeListShuffle;
        }

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;

        //底分
        this._zhuIdx = 1;
        this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        if(!this._ZhuNum) this._ZhuNum = _bg_Node.getParent().getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = _bg_Node.getChildByName("btn_sub");
            if(!this._Button_sub) this._Button_sub = _bg_Node.getParent().getChildByName("btn_sub");
            var mask = 1
            if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
            MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
                mask = 0.5;
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    _this.difenIndex--;
                    if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                    this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                    this._zhuIdx = _this.difenAry[_this.difenIndex];
                    this.setRoomCardModeFree();
                    
                }
            }, this);
            this._Button_add = _bg_Node.getChildByName("btn_add");
            if(!this._Button_add) this._Button_add = _bg_Node.getParent().getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {

                   _this.difenIndex++;
                    if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                    this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
                    this._zhuIdx = _this.difenAry[_this.difenIndex];
                    this.setRoomCardModeFree();
                }
            }, this);
        }

        // 扎鸟
        if (_playWay.getChildByName("play_buzhaniao")) {
            var nodeListZhaniao = [];

            var tempnode = _playWay.getChildByName("play_buzhaniao");
            if (tempnode) nodeListZhaniao.push(tempnode );

            tempnode = _playWay.getChildByName("play_hongtao9fanbei");
            if (tempnode) nodeListZhaniao.push(tempnode );

            tempnode = _playWay.getChildByName("play_hongtao10fanbei");
            if (tempnode) nodeListZhaniao.push(tempnode );

            tempnode = _playWay.getChildByName("play_hongtao10piao5fen");
            if (tempnode) nodeListZhaniao.push( tempnode );

            tempnode = _playWay.getChildByName("play_hongtao10piao10fen");
            if (tempnode) nodeListZhaniao.push( tempnode );

            this.zhaniao_radio = createRadioBoxForCheckBoxs(nodeListZhaniao,this.radioBoxSelectCB);
            this.addListenerText(nodeListZhaniao,this.zhaniao_radio);
            this.nodeListZhaniao = nodeListZhaniao;

            if (this.hongTao10Niao)
            {
                this.hongTao10Niao.visible = false;
                this.hongTao10Niao.setSelected(false);
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO, false);
            }
        }

        // 速度
        if (_playWay.getChildByName("play_speed_fast")) {
            var nodeListSpeed = [];
            nodeListSpeed.push(_playWay.getChildByName("play_speed_fast"));
            nodeListSpeed.push(_playWay.getChildByName("play_speed_slow"));
            this.speed_radio = createRadioBoxForCheckBoxs(nodeListSpeed, this.radioBoxSelectCB);
            this.addListenerText(nodeListSpeed, this.speed_radio);
            this.nodeListSpeed = nodeListSpeed;
        }

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_fangZuoBiTip.isVisible()) {
                    image_fangZuoBiTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_fangZuoBiTip);

        //有无炸弹
        var checkBoxhavezhadan= _playWay.getChildByName("play_havezhadan")
        if(checkBoxhavezhadan){
            this.checkBoxhavezhadan = checkBoxhavezhadan;
            this.addListenerText(this.checkBoxhavezhadan, null, function(a){
                that.changeToHaveZhaDan();
            });
            this.checkBoxhavezhadan.addEventListener(function(sender, type)
            {
                that.clickCB(sender, type);
                that.changeToHaveZhaDan();
            }, this.checkBoxhavezhadan);
        }

        // 大结加分
        if (_playWay.getChildByName("play_nojiafen")) {
            var nodeListJiaFen = [];
            this.jiaFenTxt = _playWay.getChildByName("jiafenText")
            nodeListJiaFen.push(_playWay.getChildByName("play_nojiafen"));
            nodeListJiaFen.push(_playWay.getChildByName("play_jiafennum"));
            this.jiafen_radio = createRadioBoxForCheckBoxs(nodeListJiaFen, this.fanBeiRadioBoxSelectCB.bind(this));
            var that = this;
            this.addListenerText(nodeListJiaFen, this.jiafen_radio, function (index,sender) {
                that.fanBeiRadioBoxSelectCB(index, sender,nodeListJiaFen);
            });
            this.nodeListJiaFen = nodeListJiaFen;
        

            var subButton = nodeListJiaFen[1].getChildByName("btn_sub");
            var addButton = nodeListJiaFen[1].getChildByName("btn_add");
            var scoreLabel = nodeListJiaFen[1].getChildByName("score");
            subButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore -= 5;
                    if (curScore < 5) {
                        curScore = 50;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);

            addButton.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    var curScore = parseInt(scoreLabel.getString());

                    curScore += 5;
                    if (curScore > 50) {
                        curScore = 5;
                    }

                    scoreLabel.setString(curScore + "分");
                }
            }, this);
        }

        //加分，控件位置调整
        var winName = ["tuoguanText","tuoGuanChaoShi", "tuoguan0", "tuoguan1","tuoguan2","tuoguan3","tuoguan4","btn_tuoguanTip","play_trustWhole","image_tuoguanTip"];
        this.jiaFenMoveWin = [];
        for (var i = 0; i < winName.length; i++)
        {
            var win = _playWay.getChildByName(winName[i]);
            if (win)
                this.jiaFenMoveWin.push( {win : win, pos : win.getPosition()});
        }

        // 飘分
        if (_playWay.getChildByName("piao_0")) {
            var nodeListPiaofen = [];
            nodeListPiaofen.push( _playWay.getChildByName("piao_0") );
            nodeListPiaofen.push( _playWay.getChildByName("piao_1") );
            nodeListPiaofen.push( _playWay.getChildByName("piao_2") );
            nodeListPiaofen.push( _playWay.getChildByName("piao_3") );

            var _piao_4 = _playWay.getChildByName("piao_4");
            var _piao_5 = _playWay.getChildByName("piao_5");

            if(_piao_4){
                nodeListPiaofen.push(_piao_4 );
            }
            if(_piao_5){
                nodeListPiaofen.push( _piao_5);
            }

            this.piaofen_radio = createRadioBoxForCheckBoxs(nodeListPiaofen,this.radioBoxSelectCB);
            this.addListenerText(nodeListPiaofen,this.piaofen_radio);
            this.nodeListPiaofen = nodeListPiaofen;
        }

        this.initExtraPlayNode(_playWay);
    },

    _clickCB : function(sender,type){
        switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    var txt = sender.getChildByName("text");
                    var selectColor = cc.color(237,101,1);
                    var unSelectColor = cc.color(158,118,78);
                    var appType = MjClient.getAppType();

                    if(appType == MjClient.APP_TYPE.QXYZQP || appType == MjClient.APP_TYPE.BDYZPHZ){
                        selectColor = cc.color(208,88,60);
                        unSelectColor = cc.color(72,94,112);
                    }
                    else if(appType == MjClient.APP_TYPE.QXLYQP || MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || 
                        MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ){
                        selectColor = cc.color(211,38,14);
                        unSelectColor = cc.color(68,51,51);
                    }
                    else if(appType == MjClient.APP_TYPE.BDHYZP) {
                        selectColor = cc.color("#d21400");
                        unSelectColor = cc.color("#255662");
                    }

                    if(sender.isSelected()){
                        txt.setTextColor(selectColor);
                    }else{
                        txt.setTextColor(unSelectColor);
                    }
                    break;
            }
    },

    setPlayNodeCurrentSelect:function(atClub)
    {
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");
        var list = [];
        index = 0;

        //设置上次创建房间时的默认选项
        var _currentPlayerNumber;
        if (atClub)
            _currentPlayerNumber = this.getNumberItem("maxPlayer", 3);
        else
            _currentPlayerNumber = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, 3);
        var setlectIndex = _currentPlayerNumber == 2 ? 1 : 0;
        this._playNode_player_number_radio.selectItem(setlectIndex)
        if (setlectIndex == 1) {
            this.changeToPlayerNumber(2)
        }else{
            this.changeToPlayerNumber(3)
        }
        //fix by 千千
        list.push( _playWay.getChildByName("playerNumber_3") );
        list.push( _playWay.getChildByName("playerNumber_2") );
        this.radioBoxSelectCB(setlectIndex,list[setlectIndex],list);

        var cardNumIndex;
        if (atClub)
            cardNumIndex = this.getNumberItem("cardNumIndex", 0);
        else
            cardNumIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_CARDNUMBER, 0);
        this._card_number_radio.selectItem(cardNumIndex)
        this.changeToCardNum();
        //fix by 千千
        list = [];
        list.push( _playWay.getChildByName("cardNum16") );
        list.push( _playWay.getChildByName("cardNum15") );
        this.radioBoxSelectCB(cardNumIndex,list[cardNumIndex],list);

        if(this.checkBoxNotMustPut){
            var isTrue;
            if (atClub)
                isTrue = this.getBoolItem("mustPut", true);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_MUST_PUT, true);
            this.checkBoxNotMustPut.setSelected(!isTrue);
            var text = this.checkBoxNotMustPut.getChildByName("text");
            this.radioTextColor(text, !isTrue);
            // if(!isTrue){
            //     text.setTextColor(cc.color(237,101,1));
            // }else{
            //     text.setTextColor(cc.color(158,118,78));
            // }
        }


        var isTrue;
        if (atClub)
            isTrue = this.getBoolItem("zhaDanBuChai", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_ZHADANBUCHAI, false);
        this.zhaDanBuChai.setSelected(isTrue);
        //fix by 千千
        var txt = this.zhaDanBuChai.getChildByName("text");
        this.radioTextColor(txt, isTrue);
        // if(isTrue){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        if (atClub)
            isTrue = this.getBoolItem("showCardNumber", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_SHOWCARDNUMBER, false);
        this.showCardNumber.setSelected(isTrue);
        //fix by 千千
        var txt = this.showCardNumber.getChildByName("text");
        this.radioTextColor(txt, isTrue);
        // if(isTrue){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)//暂时只做邵阳
        {
            var player_firstOut_radioItem
            if (atClub){
                var option = this.getNumberItem("firstPutRule", 1);// == 3 ? 0 : 1;
                player_firstOut_radioItem = option
            }
            else{
                var option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_TWOPLAYER_FIRSRPUTRULE, 1);
                player_firstOut_radioItem = option;// == 3 ? 0 : 1;
            }
    
            var isPreRoundFirstRule;//是否每局执行下手规则
            if (atClub){
                var option = this.getNumberItem("isPreRoundFirstRule", false);// == 3 ? 0 : 1;
                isPreRoundFirstRule = option
            }
            else{
                var option = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_IS_PER_FIRST_RULE, false);
                isPreRoundFirstRule = option;// == 3 ? 0 : 1;
            }
    
            //兼容服务器其他通用跑得快
            if (player_firstOut_radioItem == 3 || player_firstOut_radioItem == 1)isPreRoundFirstRule? player_firstOut_radioItem = 3:player_firstOut_radioItem = 0;
            else if (player_firstOut_radioItem == 2)isPreRoundFirstRule? player_firstOut_radioItem = 4:player_firstOut_radioItem = 1;
            else if (player_firstOut_radioItem == 4)isPreRoundFirstRule? player_firstOut_radioItem = 5:player_firstOut_radioItem = 2;
    
            this.player_firstOut_radio.selectItem(player_firstOut_radioItem)
            this.radioBoxSelectCB(player_firstOut_radioItem,this.nodeListFirstOutCard[player_firstOut_radioItem],this.nodeListFirstOutCard);
    
        }
        else{
            var two_player_firstOut_radioItem
            if (atClub){
                var option = this.getNumberItem("firstPutRule", 3) == 3 ? 0 : 1;
                two_player_firstOut_radioItem = option
            }
            else{
                var option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_TWOPLAYER_FIRSRPUTRULE, 3);
                two_player_firstOut_radioItem = option == 3 ? 0 : 1;
            }
            this.two_player_firstOut_radio.selectItem(two_player_firstOut_radioItem)
            this.radioBoxSelectCB(two_player_firstOut_radioItem,this.nodeListFirstOutCard[two_player_firstOut_radioItem],this.nodeListFirstOutCard);
        
            if (atClub)
                isTrue = this.getBoolItem("firstHeiTao3", true);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_FIRSTHEITAO3, true);
            this.firstHeiTao3.setSelected(isTrue);
        }


        
        //fix by 千千
        var txt = this.firstHeiTao3.getChildByName("text");
        this.radioTextColor(txt, isTrue);
        // if(isTrue){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        if (atClub)
            isTrue = this.getBoolItem("can4dai2", true);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_4DAI2, true);
        this.can4dai2.setSelected(isTrue);
        //fix by 千千
        var txt = this.can4dai2.getChildByName("text");
        this.radioTextColor(txt, isTrue);
        // if(isTrue){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        if (atClub)
            isTrue = this.getBoolItem("can4dai3", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_4DAI3, false);
        this.can4dai3.setSelected(isTrue);
        //fix by 千千
        var txt = this.can4dai3.getChildByName("text");
        this.radioTextColor(txt, isTrue);
        // if(isTrue){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        if (atClub)
            isTrue = this.getBoolItem("hongTao10Niao", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO, false);
        if (this.zhaniao_radio) isTrue = false;
        this.hongTao10Niao.setSelected(isTrue);
        //fix by 千千
        var txt = this.hongTao10Niao.getChildByName("text");
        this.radioTextColor(txt, isTrue);


        
        var Isht10zhaniaohanzhadan = false;
        if (isTrue)//扎鸟含炸弹，，只有当选中红桃十扎鸟才有此选项
        {
            if (atClub)
                Isht10zhaniaohanzhadan = this.getBoolItem("ht10zhaniaohanzhadan", false);
            else
                Isht10zhaniaohanzhadan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_ZHA_NIAO_ZHADAN, false);
        }
        if (this.ht10zhaniaohanzhadan)
        {
            this.ht10zhaniaohanzhadan.visible = isTrue;
            this.ht10zhaniaohanzhadan.setSelected(Isht10zhaniaohanzhadan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHA_NIAO_ZHADAN, Isht10zhaniaohanzhadan);
            var txt = this.ht10zhaniaohanzhadan.getChildByName("text");
            this.radioTextColor(txt, Isht10zhaniaohanzhadan);
        }


        if (atClub)
            isTrue = this.getBoolItem("fangZuoBi", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_FANG_ZUO_BI, false);
        this.fangZuoBi.setSelected(isTrue);
        var txt = this.fangZuoBi.getChildByName("text");
        this.radioTextColor(txt, isTrue);
        // if(isTrue){
        //     txt.setTextColor(cc.color(237,101,1));
        // }else{
        //     txt.setTextColor(cc.color(158,118,78));
        // }

        if (atClub)
            isTrue = this.getBoolItem("can3aZhaDan", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN, false);
        this.can3aZhaDan.setSelected(isTrue);
        var txt = this.can3aZhaDan.getChildByName("text");
        this.radioTextColor(txt, isTrue);
        // if (isTrue) {
        //     txt.setTextColor(cc.color(237, 101, 1));
        // } else {
        //     txt.setTextColor(cc.color(158, 118, 78));
        // }

        if (this.can3ge3ZhaDan) {
            if (atClub)
                isTrue = this.getBoolItem("can3ge3ZhaDan", false);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_CAN_3ge3_ZHADAN, false);
            this.can3ge3ZhaDan.setSelected(isTrue);
            var txt = this.can3ge3ZhaDan.getChildByName("text");
            this.radioTextColor(txt, isTrue);
            // if (isTrue) {
            //     txt.setTextColor(cc.color(237, 101, 1));
            // } else {
            //     txt.setTextColor(cc.color(158, 118, 78));
            // }
        }

        if (atClub)
            isTrue = this.getBoolItem("isAutoTip", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_IS_AUTOTIP, false);
        this.isAutoTip.setSelected(isTrue);
        var text = this.isAutoTip.getChildByName("text");
        this.radioTextColor(text, isTrue);
        // if (isTrue) {
        //     text.setTextColor(cc.color(237, 101, 1));
        // } else {
        //     text.setTextColor(cc.color(158, 118, 78));
        // }

        if (atClub)
            isTrue = this.getBoolItem("canPutAnyFeiji", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_canPutAnyFeiji, false);
        this.canPutAnyFeiji.setSelected(isTrue);
        var txt = this.canPutAnyFeiji.getChildByName("text");
        this.radioTextColor(txt, isTrue);
        // if (isTrue) {
        //     txt.setTextColor(cc.color(237, 101, 1));
        // } else {
        //     txt.setTextColor(cc.color(158, 118, 78));
        // }

        if (atClub)
            isTrue = this.getBoolItem("canPutAnySanZhang", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_canPutAnySanZhang, false);
        this.canPutAnySanZhang.setSelected(isTrue);
        var txt = this.canPutAnySanZhang.getChildByName("text");
        this.radioTextColor(txt, isTrue);
		// if (isTrue) {
  //           txt.setTextColor(cc.color(237, 101, 1));
  //       } else {
  //           txt.setTextColor(cc.color(158, 118, 78));
  //       }

        if (atClub)
            this._zhuIdx = this.getNumberItem("paodekuaiTY_difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_DIFEN, 1);
        if (this._ZhuNum)
            this._ZhuNum.setString(this._zhuIdx + "");

        this.difenIndex = this.difenAry.indexOf(this._zhuIdx);
        
        if (this.difenIndex < 0) this.difenIndex = 1;

        if(this._ZhuNum){
            this._ZhuNum.setString(this.difenAry[this.difenIndex] + "");
        }
        


        if (this.shuffle_radio){
            var shuffle_radioItem
            if (atClub){
                var option = this.getNumberItem("isPlayerShuffle", 0);
                shuffle_radioItem = option
            }
            else{
                var option = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, 0);
                shuffle_radioItem = option;
            }
            this.shuffle_radio.selectItem(shuffle_radioItem)
            this.radioBoxSelectCB(shuffle_radioItem,this.nodeListShuffle[shuffle_radioItem],this.nodeListShuffle);
        }

        if (this.speed_radio) {
            // 速度
            var playSpeedOption;
            if (atClub)
                playSpeedOption = this.getNumberItem("playSpeed", 1);
            else
                playSpeedOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_PLAYSPEED, 1);
            this.speed_radio.selectItem(playSpeedOption)
            this.radioBoxSelectCB(playSpeedOption, this.nodeListSpeed[playSpeedOption], this.nodeListSpeed);
        }

        // 扎鸟
        if (this.zhaniao_radio) {
            var zhaniaoOption;
            if (atClub)
                zhaniaoOption = this.getNumberItem("zhaniao", 0);
            else
                zhaniaoOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_ZHA_NIAO, 0);
            this.zhaniao_radio.selectItem(zhaniaoOption)
            this.radioBoxSelectCB(zhaniaoOption,this.nodeListZhaniao[zhaniaoOption],this.nodeListZhaniao);
        }

        if (this.checkBoxhavezhadan)
        {
            if (atClub)
                isTrue = this.getBoolItem("havezhadan", true);
            else
                isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_PDK_HAVE_ZHADAN, true);
            this.checkBoxhavezhadan.setSelected(isTrue);
            var text = this.checkBoxhavezhadan.getChildByName("text");
            this.selectedCB(text, isTrue);
            this.changeToHaveZhaDan();            
        }


        if (this.jiafen_radio) {
            // 大结加分
            var jiaFen;
            if (atClub) {
                jiaFen = this.getNumberItem("jiaFen", 0);
            }
            else {
                jiaFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_JIA_FEN, 0);
            }
            var selectIndex = jiaFen == 0 ? 0:1
            this.jiafen_radio.selectItem(selectIndex);
            this.nodeListJiaFen[1].getChildByName("score").setString((jiaFen == 0? 5:jiaFen) + "分");
            this.fanBeiRadioBoxSelectCB(selectIndex, this.nodeListJiaFen[selectIndex], this.nodeListJiaFen);
        }

        // 飘分
        if (this.piaofen_radio) {
            var piaofenOption;
            if (atClub)
                piaofenOption = this.getNumberItem("piaofen", 0);
            else
                piaofenOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_PDK_PIAO_FEN, 0);
            this.piaofen_radio.selectItem(piaofenOption)
            this.radioBoxSelectCB(piaofenOption,this.nodeListPiaofen[piaofenOption],this.nodeListPiaofen);
        }

        this.setExtraPlayNodeCurrentSelect(atClub);
    },

    setRoundNodeCurrentSelect:function(){
        this._super();
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXXXGHZ){
            //this.payWayNode_1.setSelected(true);
        }
    },

    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YZ_PAO_DE_KUAI_TY;
        para.maxPlayer = this._playNode_player_number_radio.getSelectIndex() == 0 ? 3 : 2;// this.playerNumber_2.isSelected() ? 2 : 3;
        para.cardNumIndex = this._card_number_radio.getSelectIndex();   // 手牌数量 0:16张手牌  1:15张手牌
        if (this.checkBoxNotMustPut){
            para.mustPut  = !this.checkBoxNotMustPut.isSelected();  //是否必管(界面上的反义)
        }
        // para.firstHeiTao3 = this.firstHeiTao3.isSelected();   // 黑桃3先出
        para.zhaDanBuChai = this.zhaDanBuChai.isSelected();     // 炸弹不可拆
        para.showCardNumber = this.showCardNumber.isSelected(); // 显示牌数量
        para.can4dai2 = this.can4dai2.isSelected();     // 4带2
        para.can4dai3 = this.can4dai3.isSelected();     // 4带3
        para.hongTao10Niao = this.hongTao10Niao.isSelected();   // 红桃10扎鸟
        para.ht10zhaniaohanzhadan = this.ht10zhaniaohanzhadan? this.ht10zhaniaohanzhadan.isSelected():false;   // 红桃10扎鸟含炸弹    
        para.fangZuoBi = this.fangZuoBi.isSelected();
        para.can3aZhaDan = this.can3aZhaDan.isSelected();
        para.isAutoTip = this.isAutoTip.isSelected();
        if (this.can3ge3ZhaDan)
            para.can3ge3ZhaDan = this.can3ge3ZhaDan.isSelected();
        para.canPutAnyFeiji = this.canPutAnyFeiji.isSelected();
        para.canPutAnySanZhang = this.canPutAnySanZhang.isSelected();
        if (this.checkBoxhavezhadan)
            para.havezhadan = this.checkBoxhavezhadan.isSelected();

        // 切牌
        if (this.shuffle_radio) {
            para.isPlayerShuffle = this.shuffle_radio.getSelectIndex();
        }

        if (this._ZhuNum) {
            para.paodekuaiTY_difen = this._zhuIdx;
            if (!this._isFriendCard)
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_DIFEN, para.paodekuaiTY_difen);
        }

        if (this.speed_radio) {
            para.playSpeed = this.speed_radio.getSelectIndex(); // 速度 0:快 1:慢
        }

        if (this.zhaniao_radio) {
            para.zhaniao = this.zhaniao_radio.getSelectIndex(); // 扎鸟 ：0不扎鸟 1红桃9翻倍 2红桃10翻倍 3红桃10飘5分 4红桃10飘10分
        }

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)//暂时只做邵阳
        {
            //兼容服务器其他通用跑得快
            var player_firstOut_radioItem = this.player_firstOut_radio.getSelectIndex();
            if (player_firstOut_radioItem == 0 ) player_firstOut_radioItem = para.maxPlayer == 2? 3:1;
            else if (player_firstOut_radioItem == 1 ) player_firstOut_radioItem = 2; 
            else if (player_firstOut_radioItem == 2) player_firstOut_radioItem = 4;
            else if (player_firstOut_radioItem == 3 ) player_firstOut_radioItem = para.maxPlayer == 2? 3:1;
            else if (player_firstOut_radioItem == 4 ) player_firstOut_radioItem = 2; 
            else if (player_firstOut_radioItem == 5) player_firstOut_radioItem = 4;

            para.isPreRoundFirstRule = this.player_firstOut_radio.getSelectIndex()>=3;
            para.firstPutRule = player_firstOut_radioItem;// == 0 ? 3 : 4;
        } 
        else if (para.maxPlayer == 2)
            para.firstPutRule = this.two_player_firstOut_radio.getSelectIndex() == 0 ? 3 : 4;
        else
            para.firstPutRule = this.firstHeiTao3.isSelected() ? 1 : 2;

        // 两个人的时候屏蔽防作弊选项，但不清除之前保存的选择
        // （如上次3人选择防作弊，这次2人的时候不会显示防作弊选项，并且不勾选，下次三个人的时候仍然还是选择了防作弊）
        if (para.maxPlayer == 2){
            para.fangZuoBi = false;
        }

        if (this.jiafen_radio) {
            para.jiaFen = (this.jiafen_radio.getSelectIndex() == 0 || para.maxPlayer == 3 )? 0: parseInt(this.nodeListJiaFen[1].getChildByName("score").getString());
        }

        if (this.piaofen_radio)
            para.piaofen = this.piaofen_radio.getSelectIndex(); // //飘分 ：0不飘 1飘123 2飘235 3飘258
        
        // if (!this._isFriendCard) {
        //     util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, para.maxPlayer);
        //     util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_CARDNUMBER, para.cardNumIndex);
        //     if (para.mustPut != null){
        //         util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_MUST_PUT, para.mustPut);
        //     }
        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHADANBUCHAI, para.zhaDanBuChai);
        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_SHOWCARDNUMBER, para.showCardNumber);
        //     // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_FIRSTHEITAO3, para.firstHeiTao3);
        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_4DAI2, para.can4dai2);
        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_4DAI3, para.can4dai3);
        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO, para.hongTao10Niao);

        //     // 1:3人玩法有黑桃3首出,必须出3
        //     // 2：3人玩法有黑桃3首出,可以不出3
        //     // 3：2人玩法有黑桃3首出,必须出3
        //     // 4: 2人玩法，随机先手，可以不出3
        //     // 两个人的时候屏蔽防作弊选项，但不清除之前保存的选择
        //     // （如上次3人选择防作弊，这次2人的时候不会显示防作弊选项，并且不勾选，下次三个人的时候仍然还是选择了防作弊）
        //     if (para.maxPlayer == 2){
        //         util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_TWOPLAYER_FIRSRPUTRULE, para.firstPutRule);
        //     }else{
        //         util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_FANG_ZUO_BI, para.fangZuoBi);
        //         var isFirstHeiTao3 = this.firstHeiTao3.isSelected()
        //         util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_FIRSTHEITAO3, isFirstHeiTao3);
        //     }

        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_FANG_ZUO_BI, para.fangZuoBi);  
        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN, para.can3aZhaDan);
        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_IS_AUTOTIP, para.isAutoTip);
        //     if (this.can3ge3ZhaDan)
        //         util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_3ge3_ZHADAN, para.can3ge3ZhaDan);
        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_canPutAnyFeiji, para.canPutAnyFeiji);  
        //     util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_canPutAnySanZhang, para.canPutAnySanZhang);
        //     if (this.shuffle_radio){
        //         util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, para.isPlayerShuffle);
        //     }

        // }

        // 15张牌没有3个a， 所以不提示3a炸弹
        if(1 == para.cardNumIndex) para.can3aZhaDan = false;

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    createRoom:function()
    {
        var para = this.getSelectedPara();
        this.savePara(para);
        this._super();
    },

    savePara : function(para){
        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PLAYERNUMBER, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_CARDNUMBER, para.cardNumIndex);
            if (para.mustPut != null){
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_MUST_PUT, para.mustPut);
            }
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHADANBUCHAI, para.zhaDanBuChai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_SHOWCARDNUMBER, para.showCardNumber);
            // util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_FIRSTHEITAO3, para.firstHeiTao3);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_4DAI2, para.can4dai2);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_4DAI3, para.can4dai3);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_HONG_TAO_10_NIAO, para.hongTao10Niao);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_ZHA_NIAO_ZHADAN, para.ht10zhaniaohanzhadan);

            // 1:3人玩法有黑桃3首出,必须出3
            // 2：3人玩法有黑桃3首出,可以不出3
            // 3：2人玩法有黑桃3首出,必须出3
            // 4: 2人玩法，随机先手，可以不出3
            // 两个人的时候屏蔽防作弊选项，但不清除之前保存的选择
            // （如上次3人选择防作弊，这次2人的时候不会显示防作弊选项，并且不勾选，下次三个人的时候仍然还是选择了防作弊）
            if (para.maxPlayer == 2){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_TWOPLAYER_FIRSRPUTRULE, para.firstPutRule);
            }else{
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_FANG_ZUO_BI, para.fangZuoBi);
                var isFirstHeiTao3 = this.firstHeiTao3.isSelected()
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_FIRSTHEITAO3, isFirstHeiTao3);
            }

            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_FANG_ZUO_BI, para.fangZuoBi);  
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_3A_ZHADAN, para.can3aZhaDan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_IS_AUTOTIP, para.isAutoTip);
            if (this.can3ge3ZhaDan)
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_CAN_3ge3_ZHADAN, para.can3ge3ZhaDan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_canPutAnyFeiji, para.canPutAnyFeiji);  
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_canPutAnySanZhang, para.canPutAnySanZhang);
            if (this.shuffle_radio){
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_SHUFFLE_OPTION, para.isPlayerShuffle);
            }

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_TWOPLAYER_FIRSRPUTRULE, para.firstPutRule);
            if (para.isPreRoundFirstRule)
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_IS_PER_FIRST_RULE, para.isPreRoundFirstRule);
            if (this.checkBoxhavezhadan)
                util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_PDK_HAVE_ZHADAN, para.havezhadan);

            if (this.speed_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PLAYSPEED, para.playSpeed);
            }

            // 扎鸟
            if (this.zhaniao_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_ZHA_NIAO, para.zhaniao);
            }

            // 加分
            if (this.jiafen_radio) {
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_JIA_FEN, para.jiaFen);
            }    

            if (this.piaofen_radio)
                util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_PDK_PIAO_FEN, para.piaofen);
        }
    },
     _radioBoxSelectCB : function(){ 
        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_pdkTY();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    { 
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_pdkTY();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_pdkTY();
    },

    setDiaNumData_pdkTY : function(){
        // var para = this.getSelectedPara();
        // var gameType = para.gameType;
        // var maxPlayer = para.maxPlayer;
        // var payWay = this.getSelectedPayWay();

        var round = this.bg_node.getChildByName("round");
        var roomPay = round.getChildByName("payWay_1").getChildByName("text");
        var aaPay = round.getChildByName("payWay_2").getChildByName("text");
        roomPay.ignoreContentAdaptWithSize(true);
        aaPay.ignoreContentAdaptWithSize(true);
         
    },

    changeToPlayerNumber_jiaFen:function (num) {
        if (!this.jiafen_radio) return;
        this.jiaFenTxt.setVisible(num == 2)
        for(var i = 0; i < this.nodeListJiaFen.length; i++)
            this.nodeListJiaFen[i].setVisible(num == 2);

        var offsetY = num == 2? 0 : 50;
        for(var i = 0; i < this.jiaFenMoveWin.length; i++)
            this.jiaFenMoveWin[i].win.setPositionY(this.jiaFenMoveWin[i].pos.y + offsetY);
    }
});