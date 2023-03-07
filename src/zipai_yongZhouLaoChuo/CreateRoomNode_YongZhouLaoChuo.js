var CreateRoomNode_yongZhouLaoChuo = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_YZLC_PLAYERNUMBER   = "YONG_ZHOU_LAO_CHUO_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_YZLC_CHUO_TYPE = "YONG_ZHOU_LAO_CHUO_CHUO_TYPE";       //
        this.localStorageKey.KEY_YZLC_CHUONUM   = "YONG_ZHOU_LAO_CHUO_CHUO_NUM"; 
        this.localStorageKey.KEY_YZLC_JIAN_HONG_JIA_FEN = "YONG_ZHOU_LAO_CHUO_JIAN_HONG_JIA_FEN";     //
        this.localStorageKey.KEY_YZLC_QI_HU_ER_FEN = "YONG_ZHOU_LAO_CHUO_QI_HU_ER_FEN";     //
        this.localStorageKey.KEY_YZLC_HONG_CHUO_SI_FAN = "YONG_ZHOU_LAO_CHUO_HONG_CHUO_SI_FAN";     //
        this.localStorageKey.KEY_YZLC_FAN_CHUO = "YONG_ZHOU_LAO_CHUO_FAN_CHUO";   

        this.localStorageKey.KEY_YZLC_trustTime =  "YONG_ZHOU_LAO_CHUO_TRUST_TIME ";
        this.localStorageKey.KEY_YZLC_trustWay = "YONG_ZHOU_LAO_CHUO_TRUST_WAY";
        this.localStorageKey.KEY_YZLC_jieSuanDiFen= "YONG_ZHOU_LAO_CHUO_jieSuanDiFen";

        this.setExtraKey({
            tuoGuan: "YONG_ZHOU_LAO_CHUO_TUO_GUAN",          //托管
            fengDing: "YONG_ZHOU_LAO_CHUO_FENG_DING",         //封顶
            trustWhole: "YONG_ZHOU_LAO_CHUO_TRUST_WHOLE",  //整局托管
            trustWay: "YONG_ZHOU_LAO_CHUO_TRUST_WAY"  //托管方式
        });
    },


    initAll:function(IsFriendCard)
    {
        if (!IsFriendCard)
            this.setKey();

        this.bgNode = ccs.load("bg_yongZhouLaoChuo.json").node;
        this.parentBaseNode =this.bgNode.getChildByName("bg_zipai");
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_zipai").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_zipai");
        this.isAdjusted = false;
    },
    initPlayNode:function()
    {
        var that = this

        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");

        var nodeListA = [];
        nodeListA.push( _playWay.getChildByName("playerNumber_2") );  
        nodeListA.push( _playWay.getChildByName("playerNumber_3") );
        nodeListA.push( _playWay.getChildByName("playerNumber_4") );  

        var setChuoNum = function(index){
            this.nodeList_chuoNum[1].setVisible(true);
            var _text = this.nodeList_chuoNum[0].getChildByName("text");
            _text.setString("14戳");


            if(index == 2){
                this.nodeList_chuoNum[1].setVisible(false);
                _text.setString("11戳");

                this.chuoNum_radio.selectItem(0);
                this.radioBoxSelectCB(0, this.nodeList_chuoNum[0], this.nodeList_chuoNum);
            }
        }.bind(this);
             
        this._playNode_player_number_radio = createRadioBoxForCheckBoxs(nodeListA, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeListA[index], nodeListA);

            setChuoNum(index);
        }.bind(this));

        this.addListenerText(nodeListA,this._playNode_player_number_radio, function (a) {
            setChuoNum(a);
            that.changePayForPlayerNum(a)
        });
        this.nodeListA = nodeListA;
		
        this.initPlayNumNode(nodeListA, [2, 3, 4]);
        

        function setFanChuo(index){
            that.isFanChuo.visible = true;
            if(index == 1){
                that.isFanChuo.visible = false;
                that.isFanChuo.setSelected(false);
                var text = that.isFanChuo.getChildByName("text");
                that.selectedCB(text, false);
            }
        }
        var nodeListB = [];
        nodeListB.push( _playWay.getChildByName("play_chuoType_0") );
        nodeListB.push( _playWay.getChildByName("play_chuoType_1") );       
        this.chuoType_radio = createRadioBoxForCheckBoxs(nodeListB, function(index, sender, list){
            setFanChuo(index)
            that.radioBoxSelectCB(index, sender, list);
        });
        this.addListenerText(nodeListB,this.chuoType_radio, function(a){
            setFanChuo(a)
        }.bind(this));
        this.nodeListB = nodeListB;

        var nodeList_chuoNum = [];
        nodeList_chuoNum.push( _playWay.getChildByName("play_chuoNumOne") );
        nodeList_chuoNum.push( _playWay.getChildByName("play_chuoNumTwo") );
        this.chuoNum_radio = createRadioBoxForCheckBoxs(nodeList_chuoNum, this.radioBoxSelectCB);
        this.addListenerText(nodeList_chuoNum, this.chuoNum_radio);
        this.nodeList_chuoNum = nodeList_chuoNum;

        this.isJianHongJiaFen = _playWay.getChildByName("play_isJianHongJiaFen");
        this.addListenerText(this.isJianHongJiaFen);
        this.isJianHongJiaFen.addEventListener(this.clickCB, this.isJianHongJiaFen);

        this.isQiHuErFen = _playWay.getChildByName("play_isQiHuErFen");
        this.addListenerText(this.isQiHuErFen);
        this.isQiHuErFen.addEventListener(this.clickCB, this.isQiHuErFen);

        this.isHongChuoSiFan = _playWay.getChildByName("play_isHongChuoSiFan");
        this.addListenerText(this.isHongChuoSiFan);
        this.isHongChuoSiFan.addEventListener(this.clickCB, this.isHongChuoSiFan);

        this.isFanChuo = _playWay.getChildByName("play_isFanChuo");
        this.addListenerText(this.isFanChuo);
        this.isFanChuo.addEventListener(this.clickCB, this.isFanChuo);




        //不用公用的托管了
        var _play = _playWay;
        var setNodeVisi = function(index){

            var _visi = index != 0;

            for (var i = 0; i < this.trustWay_node.length; i++) {
                this.trustWay_node[i].setVisible(_visi);
                //this.trustWay_node[i].setSelected(_visi);
            }

        }.bind(this);

        // this.pnlTrustWay = _play.getChildByName("pnl_trustWay");
        // this.pnlRemain = _play.getChildByName("pnl_remain");

        var tuoGuanList = [];
        tuoGuanList.push(_play.getChildByName("tuoguan_0"));
        tuoGuanList.push(_play.getChildByName("tuoguan_1"));
        tuoGuanList.push(_play.getChildByName("tuoguan_2"));
        tuoGuanList.push(_play.getChildByName("tuoguan_3"));
        tuoGuanList.push(_play.getChildByName("tuoguan_4"));
        var tuoGuanCallBack = function(index, sender, list){
            this.radioBoxSelectCB(index, sender, list);

            setNodeVisi(index);
            // if(index == 0){
            //     this.pnlTrustWay.visible = false;
            // }else{
            //     this.pnlTrustWay.visible = true;
            // }
            //this.pnlRemain.y = this.pnlRemainYpos + (index == 0 ? this.pnlTrustWay.height : 0);
        }.bind(this);
        this.tuoGuanList_radio = createRadioBoxForCheckBoxs(tuoGuanList, tuoGuanCallBack);

        var tuoGuanTextCallBack = function(index, sender){

            setNodeVisi(index);
            // if(index == 0){
            //     this.pnlTrustWay.visible = false;
            // }else{
            //     this.pnlTrustWay.visible = true;
            // }
            //this.pnlRemain.y = this.pnlRemainYpos + (index == 0 ? this.pnlTrustWay.height : 0);              
        }.bind(this);
        this.addListenerText(tuoGuanList, this.tuoGuanList_radio, tuoGuanTextCallBack);
        this.tuoGuanList = tuoGuanList;

        // 托管方式
        var trustWay = [];
        trustWay.push(_play.getChildByName("trustWay_1"));
        trustWay.push(_play.getChildByName("trustWay_2"));
        trustWay.push(_play.getChildByName("trustWay_3"));
        this.trustWay_radio = createRadioBoxForCheckBoxs(trustWay,this.radioBoxSelectCB);
        cc.eventManager.addListener(this.setTextClick(trustWay,0,this.trustWay_radio),trustWay[0].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustWay,1,this.trustWay_radio),trustWay[1].getChildByName("text"));
        cc.eventManager.addListener(this.setTextClick(trustWay,2,this.trustWay_radio),trustWay[2].getChildByName("text"));
        this.trustWay_node = trustWay;

        var btn_tuoGuanTip = _play.getChildByName("btn_tuoguanTip");
        var tuoGuanTip = _play.getChildByName("image_tuoguanTip");
        btn_tuoGuanTip.addClickEventListener(function(btn){
            tuoGuanTip.visible = !tuoGuanTip.visible;
        });

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (tuoGuanTip.isVisible()) {
                    tuoGuanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }), tuoGuanTip);
        //////////////////////////////////////
        
        
        var text_diFen = this.parentBaseNode.getChildByName("txt_fen");
        var btn_sub = this.parentBaseNode.getChildByName("btn_sub");
        var btn_add = this.parentBaseNode.getChildByName("btn_add");
        btn_sub.addClickEventListener(function (btn) {
            var diFen = Number(text_diFen.getString());
            var diFenArr = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5];
            var fenIndex = diFenArr.indexOf(diFen)
            fenIndex -= 1;
            if(fenIndex < 0){
                fenIndex = diFenArr.length-1;
            }
            text_diFen.setString(diFenArr[fenIndex] + "");
        });
        btn_add.addClickEventListener(function (btn) {
            var diFen = Number(text_diFen.getString());
            var diFenArr = [0.01,0.02,0.03,0.04,0.05,0.1,0.2,0.3,0.4,0.5,1,2,3,4,5]
            var fenIndex = diFenArr.indexOf(diFen)
            fenIndex += 1;
            if(fenIndex >= diFenArr.length){
                fenIndex = 0;
            }
            text_diFen.setString(diFenArr[fenIndex] + "");
        });
         

        // this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        // this.difenIndex = 0;
        // var _this = this;

        // //底分
        // this._zhuIdx = 1;
        // this._ZhuNum = _bg_Node.getChildByName("txt_fen");
        // if(!this._ZhuNum) this._ZhuNum = _bg_Node.getParent().getChildByName("txt_fen");
        // if (this._ZhuNum) {
        //     this._ZhuNum.setString(this._zhuIdx);
        //     this._Button_sub = _bg_Node.getChildByName("btn_sub");
        //     if(!this._Button_sub) this._Button_sub = _bg_Node.getParent().getChildByName("btn_sub");
        //     var mask = 1
        //     if (MjClient.getAppType() == MjClient.APP_TYPE.BDHYZP ||
        //     MjClient.getAppType() == MjClient.APP_TYPE.QXSYDTZ)
        //         mask = 0.5;
        //     this._Button_sub.addTouchEventListener(function(sender, type) {
        //         if (type == 2) {
        //             _this.difenIndex--;
        //             if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
        //             this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
        //             this._zhuIdx = _this.difenAry[_this.difenIndex];
        //             this.setRoomCardModeFree(this._zhuIdx);
        //         }
        //     }, this);
        //     this._Button_add = _bg_Node.getChildByName("btn_add");
        //     if(!this._Button_add) this._Button_add = _bg_Node.getParent().getChildByName("btn_add");
        //     this._Button_add.addTouchEventListener(function(sender, type) {
        //         if (type == 2) {

        //            _this.difenIndex++;
        //             if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
        //             this._ZhuNum.setString(_this.difenAry[_this.difenIndex]);
        //             this._zhuIdx = _this.difenAry[_this.difenIndex];
        //             this.setRoomCardModeFree(this._zhuIdx);
        //         }
        //     }, this);
        // }

        if(this.isUseUIV3){
            var text_title = this.bgNode.getChildByName("bg_zipai").getChildByName("text");
            if(text_title && !this.isAdjusted ){
                this.isAdjusted = true;
                text_title.y -= 15;
                text_title.setFontSize(24);
                text_title.setTextColor(cc.color("#6d685b"));
            }
        }

        this.initExtraPlayNode(_playWay);
    },
    initRoundNode:function()
    {
        this._super();
    },


    setPlayNodeCurrentSelect:function(isClub)
    {
        var _currentPlayerNumber;
        if (isClub)
            _currentPlayerNumber = this.getNumberItem("maxPlayer", 4);
        else
            _currentPlayerNumber = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YZLC_PLAYERNUMBER, 4);
        var selectIndex = [2, 3, 4].indexOf(_currentPlayerNumber);
        this._playNode_player_number_radio.selectItem(selectIndex)
        //this.changeToPlayerNumber(_currentPlayerNumber,true)
        this.radioBoxSelectCB(selectIndex, this.nodeListA[selectIndex], this.nodeListA);

        //积分底分
        if(true){
            var diFen;
            if (isClub){
                diFen = this.getNumberItem("jieSuanDiFen", 1);
            }else {
                diFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YZLC_jieSuanDiFen, 1);
            }
            var text_diFen = this.parentBaseNode.getChildByName("txt_fen");
            text_diFen.setString(diFen + "");
        }


        var chuoNumOption;
        if (isClub)
            chuoNumOption = this.getNumberItem("chuoNum", 0);
        else
            chuoNumOption = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YZLC_CHUO_NUM, 0);
        this.chuoNum_radio.selectItem(chuoNumOption)
        this.radioBoxSelectCB(chuoNumOption,this.nodeList_chuoNum[chuoNumOption],this.nodeList_chuoNum);

        var cardNumIndex;
        if (isClub)
            cardNumIndex = this.getNumberItem("chuoType", 0);
        else
            cardNumIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YZLC_CHUO_TYPE, 0);
        this.chuoType_radio.selectItem(cardNumIndex)
        this.radioBoxSelectCB(cardNumIndex,this.nodeListB[cardNumIndex],this.nodeListB);
  

        if (isClub)
            isTrue = this.getBoolItem("isJianHongJiaFen", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YZLC_JIAN_HONG_JIA_FEN, false);
        this.isJianHongJiaFen.setSelected(isTrue);
        var text = this.isJianHongJiaFen.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("isQiHuErFen", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YZLC_QI_HU_ER_FEN, false);
        this.isQiHuErFen.setSelected(isTrue);
        var text = this.isQiHuErFen.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("isHongChuoSiFan", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YZLC_HONG_CHUO_SI_FAN, false);
        this.isHongChuoSiFan.setSelected(isTrue);
        var text = this.isHongChuoSiFan.getChildByName("text");
        this.selectedCB(text,isTrue)

        if (isClub)
            isTrue = this.getBoolItem("isFanChuo", false);
        else
            isTrue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_YZLC_FAN_CHUO, false);
        this.isFanChuo.setSelected(isTrue);
        var text = this.isFanChuo.getChildByName("text");
        this.selectedCB(text,isTrue)


        var reSetNode = function(){
            if(this._playNode_player_number_radio.getSelectIndex() == 2){
                this.nodeList_chuoNum[1].setVisible(false);
                this.nodeList_chuoNum[0].getChildByName("text").setString("11戳");
            }
            
            if(this.chuoType_radio.getSelectIndex() == 1){
                this.isFanChuo.setVisible(false);
            }
        }.bind(this);
        reSetNode();


        ////
        var tuoGuan;
        if (isClub)
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(this.getNumberItem("trustTime", -1));
        else
            tuoGuan = [-1, 60, 120, 180, 300].indexOf(util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YZLC_trustTime, -1));
        this.tuoGuanList_radio.selectItem(tuoGuan);
        this.radioBoxSelectCB(tuoGuan,this.tuoGuanList[tuoGuan],this.tuoGuanList);

        //托管方式
        var _trustWay;
        if (isClub) {
            _trustWay = this.getNumberItem("trustWay", 0);
        } else {
            _trustWay = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_YZLC_trustWay, 0);
        }
        this.trustWay_radio.selectItem(_trustWay);
        this.radioBoxSelectCB(_trustWay, this.trustWay_node[_trustWay], this.trustWay_node);

        var _visi = tuoGuan != 0;
        for (var i = 0; i < this.trustWay_node.length; i++) {
            this.trustWay_node[i].setVisible(_visi);
        }
        //this.pnlTrustWay.visible = tuoGuan != 0;
        //this.pnlRemain.y = this.pnlRemainYpos + (tuoGuan == 0 ? this.pnlTrustWay.height : 0); 

        this.setExtraPlayNodeCurrentSelect(isClub);
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.YONG_ZHOU_LAO_CHUO;
        para.maxPlayer = [2, 3, 4][this._playNode_player_number_radio.getSelectIndex()]
        
        para.chuoType = this.chuoType_radio.getSelectIndex();   
        para.chuoNum = this.chuoNum_radio.getSelectIndex(); 
        para.isJianHongJiaFen = this.isJianHongJiaFen.isSelected();     
        para.isQiHuErFen = this.isQiHuErFen.isSelected();     
        para.isHongChuoSiFan = this.isHongChuoSiFan.isSelected();   
        para.isFanChuo = this.isFanChuo.isSelected();

        para.trustTime = [-1, 60, 120, 180, 300][this.tuoGuanList_radio.getSelectIndex()];
        para.trustWay = para.trustTime == -1 ? 0 : this.trustWay_radio.getSelectIndex();
        para.isTrustWhole = para.trustWay != 0;

        //积分底分
        
            var text_diFen = this.parentBaseNode.getChildByName("txt_fen");
            para.jieSuanDiFen = parseFloat(text_diFen.getString());
        

        if (!this._isFriendCard){
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YZLC_PLAYERNUMBER, para.maxPlayer);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YZLC_CHUO_NUM, para.chuoNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YZLC_CHUO_TYPE, para.chuoType); 
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YZLC_JIAN_HONG_JIA_FEN, para.isJianHongJiaFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YZLC_QI_HU_ER_FEN, para.isQiHuErFen);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YZLC_HONG_CHUO_SI_FAN, para.isHongChuoSiFan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_YZLC_FAN_CHUO, para.isFanChuo);

            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YZLC_trustTime, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YZLC_trustWay, para.trustWay);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_YZLC_jieSuanDiFen, para.jieSuanDiFen);
        }
        

        this.getExtraSelectedPara(para);

        cc.log("createara: " + JSON.stringify(para));

        return para;
    }
});