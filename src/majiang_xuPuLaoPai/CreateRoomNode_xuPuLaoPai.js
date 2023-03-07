var CreateRoomNode_xuPuLaoPai = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_xuPuLaoPai_count          = "_xuPuLaoPai_COUNT";                //人数
        this.localStorageKey.KEY_xuPuLaoPai_hua            = "_xuPuLaoPai_HUA";       	         //是否带花
        this.localStorageKey.KEY_xuPuLaoPai_zhuangxian     = "_xuPuLaoPai_ZHUANG_XIAN";          //庄闲
        this.localStorageKey.KEY_xuPuLaoPai_znzmh          = "_xuPuLaoPai_ZNZMH";                //只能自模胡
        this.localStorageKey.KEY_xuPuLaoPai_phbctz         = "_xuPuLaoPai_PHBCTZ";               //碰后不出同张
        this.localStorageKey.KEY_xuPuLaoPai_chbctz         = "_xuPuLaoPai_CHBCTZ";               //吃后不出同张
        this.localStorageKey.KEY_xuPuLaoPai_qxgc           = "_xuPuLaoPai_QXGC";                 //取消箍臭
        this.localStorageKey.KEY_xuPuLaoPai_tingpai        = "_xuPuLaoPai_TING_PAI";             //听牌
        this.localStorageKey.KEY_xuPuLaoPai_cpqr           = "_xuPuLaoPai_CPQR";                 //吃碰确认
        this.localStorageKey.KEY_xuPuLaoPai_sjsjz          = "_xuPuLaoPai_SJSJZ";                //首局随机庄
        this.localStorageKey.KEY_xuPuLaoPai_cf             = "_xuPuLaoPai_CF";                   //冲分
        this.localStorageKey.KEY_xuPuLaoPai_cffs           = "_xuPuLaoPai_CFFS";                 //冲分分数
        this.localStorageKey.KEY_xuPuLaoPai_df             = "_xuPuLaoPai_DF";                   //底分
        this.localStorageKey.KEY_xuPuLaoPai_jsdf           = "_xuPuLaoPai_JSDF";                 //积分底分
    },

    initAll: function(IsFriendCard) {
        if (!IsFriendCard) this.setKey();
        this.bgNode = ccs.load("bg_xuPuLaoPai.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg_xuPuLaoPai").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg_xuPuLaoPai");
    },

    initPlayNode: function() {
        var bgView = this.bg_node;
        var _play = bgView.getChildByName("play");

        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("play_count0");   // 4人
        this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
        this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
        this._playNode_maxPlayer3 = _play.getChildByName("play_count3");   // 自由
        this._playNode_maxPlayer3.setVisible(false);
        var playerNumList = [this._playNode_maxPlayer0, this._playNode_maxPlayer1, this._playNode_maxPlayer2, this._playNode_maxPlayer3];
        this.initPlayNumNode(playerNumList, [4, 3, 2, 4]);
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(playerNumList, function(index) {
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, playerNumList[index], playerNumList);
        }.bind(this));
        this.addListenerText(playerNumList, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = playerNumList;



        //冲分
        this._playNode_chongfen0 = _play.getChildByName("play_kechong");
        this._playNode_chongfen1 = _play.getChildByName("play_bukechong");
        this._playNode_chongfen2 = _play.getChildByName("play_bichong");
        this._playNode_chongfen3 = _play.getChildByName("play_bchkc");
        this._playNode_chongfen4 = _play.getChildByName("play_csbcx");
        var chongFenList = [];
        chongFenList.push(this._playNode_chongfen0);
        chongFenList.push(this._playNode_chongfen1);
        chongFenList.push(this._playNode_chongfen2);
        chongFenList.push(this._playNode_chongfen3);
        chongFenList.push(this._playNode_chongfen4);
        this._playNode_chongfen_radio = createRadioBoxForCheckBoxs(chongFenList, function(index) {
            this.changeChongFenScoreShow(index);
            this.radioBoxSelectCB(index, chongFenList[index], chongFenList);
        }.bind(this));
        this.addListenerText(chongFenList, this._playNode_chongfen_radio, this.changeChongFenScoreShow.bind(this));
        this._chongFenList = chongFenList;


        //冲分分数
        this._playNode_chongfenfenshu0 = _play.getChildByName("play_cff1");
        this._playNode_chongfenfenshu1 = _play.getChildByName("play_cff2");
        this._playNode_chongfenfenshu2 = _play.getChildByName("play_cff3");
        this._playNode_chongfenfenshu3 = _play.getChildByName("play_cff4");
        var chongFenFenShouList = [];
        chongFenFenShouList.push(this._playNode_chongfenfenshu0);
        chongFenFenShouList.push(this._playNode_chongfenfenshu1);
        chongFenFenShouList.push(this._playNode_chongfenfenshu2);
        chongFenFenShouList.push(this._playNode_chongfenfenshu3);
        this._playNode_chongfenfenshou_radio = createRadioBoxForCheckBoxs(chongFenFenShouList, this.radioBoxSelectCB);
        this.addListenerText(chongFenFenShouList, this._playNode_chongfenfenshou_radio);
        this._chongFenFenShouList = chongFenFenShouList;


        //底分
        this._playNode_difen0 = _play.getChildByName("play_df1");
        this._playNode_difen1 = _play.getChildByName("play_df2");
        this._playNode_difen2 = _play.getChildByName("play_df3");
        this._playNode_difen3 = _play.getChildByName("play_df4");
        var diFenList = [];
        diFenList.push(this._playNode_difen0);
        diFenList.push(this._playNode_difen1);
        diFenList.push(this._playNode_difen2);
        diFenList.push(this._playNode_difen3);
        this._playNode_difen_radio = createRadioBoxForCheckBoxs(diFenList, this.radioBoxSelectCB);
        this.addListenerText(diFenList, this._playNode_difen_radio);
        this._diFenList = diFenList;


        // 是否带花
        this._playNode_hua0 = _play.getChildByName("play_budaihua");
        this._playNode_hua1 = _play.getChildByName("play_daihua");
        var huaList = [];
        huaList.push(this._playNode_hua0);
        huaList.push(this._playNode_hua1);
        this._playNode_hua_radio = createRadioBoxForCheckBoxs(huaList, this.radioBoxSelectCB);
        this.addListenerText(huaList, this._playNode_hua_radio);
        this._huaList = huaList;

        // 庄闲
        this._playNode_zhuangXian = _play.getChildByName("play_zhuangxian");
        this.addListenerText(this._playNode_zhuangXian);
        this._playNode_zhuangXian.addEventListener(this.clickCB, this._playNode_zhuangXian);

        // 只能自模胡
        this._playNode_ziMoHu = _play.getChildByName("play_zhizimo");
        this.addListenerText(this._playNode_ziMoHu);
        this._playNode_ziMoHu.addEventListener(this.clickCB, this._playNode_ziMoHu);

        // 碰后不出同张
        this._playNode_phbctz = _play.getChildByName("play_phbctz");
        this.addListenerText(this._playNode_phbctz);
        this._playNode_phbctz.addEventListener(this.clickCB, this._playNode_phbctz);

        // 吃后不出同张
        this._playNode_chbctz = _play.getChildByName("play_chbctz");
        this.addListenerText(this._playNode_chbctz);
        this._playNode_chbctz.addEventListener(this.clickCB, this._playNode_chbctz);

        // 取消箍臭
        this._playNode_qxgc = _play.getChildByName("play_qxgc");
        this.addListenerText(this._playNode_qxgc);
        this._playNode_qxgc.addEventListener(this.clickCB, this._playNode_qxgc);

        // 听牌
        this._playNode_tingPai = _play.getChildByName("play_tingpai");
        this.addListenerText(this._playNode_tingPai);
        this._playNode_tingPai.addEventListener(this.clickCB, this._playNode_tingPai);

        // 吃碰确认
        this._playNode_cpqr = _play.getChildByName("play_cpqr");
        this.addListenerText(this._playNode_cpqr);
        this._playNode_cpqr.addEventListener(this.clickCB, this._playNode_cpqr);

        //首局随机庄
        this._playNode_sjsjz = _play.getChildByName("play_sjsjz");
        this.addListenerText(this._playNode_sjsjz);
        this._playNode_sjsjz.addEventListener(this.clickCB, this._playNode_sjsjz);

        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;

        //积分底分
        this._difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuPuLaoPai_jsdf,1);
        if(!this._difen || typeof (this._difen) !== "number"){
            this._difen = 1;
        }
        var panelFanBei = this.bg_node.getParent().getChildByName("jieSuanDiFen");
        this._textDiFen = panelFanBei.getChildByName("text_diFen");
        if (this._textDiFen) {
            this._textDiFen.setString(this._difen);
            this._Button_sub = panelFanBei.getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type === ccui.Widget.TOUCH_ENDED) {
                    

                    _this.difenIndex--;
                    if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                    this._textDiFen.setString(_this.difenAry[_this.difenIndex]);
                    this._difen = _this.difenAry[_this.difenIndex];



                }
            }, this);
            this._Button_add = panelFanBei.getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type === ccui.Widget.TOUCH_ENDED) {
                    _this.difenIndex++;
                    if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                    this._textDiFen.setString(_this.difenAry[_this.difenIndex]);
                    this._difen = _this.difenAry[_this.difenIndex];
                }
            }, this);
        }
    },
    changeChongFenScoreShow:function(index){
        var list = this._chongFenFenShouList;
        var text = this.bg_node.getChildByName("text_cffs");
        var bool = (Number(index) !== 0 && Number(index) !== 1);
        for (var i = 0; i < list.length; i ++){
            list[i].setVisible(bool);
        }
        text.setVisible(bool);
    },
    setPlayNodeCurrentSelect: function(isClub) {

        //人数
        var _currentCount;
        if (isClub) {
            if (this.getBoolItem("convertible", false)){
                _currentCount = 3;
            } else{
                _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 3));
            }
        } else{
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuPuLaoPai_count, 1);
        }
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);



        //冲分Id
        var _chongFenId;
        if (isClub) {
            _chongFenId = this.getNumberItem("chongFenId", 0)
        } else{
            _chongFenId = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuPuLaoPai_cf, 0);
        }
        if(!_chongFenId || typeof (_chongFenId) !== "number"){
            _chongFenId = 0;
        }

        this._playNode_chongfen_radio.selectItem(_chongFenId);
        this.radioBoxSelectCB(_chongFenId, this._chongFenList[_chongFenId], this._chongFenList);
        this.changeChongFenScoreShow(_chongFenId);


        //冲分分数
        var _chongFenScore;
        if (isClub) {
            _chongFenScore = this.getNumberItem("chongFenScore", 1)
        } else{
            _chongFenScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuPuLaoPai_cffs, 1);
        }
        if(!_chongFenScore || typeof (_chongFenScore) !== "number"){
            _chongFenScore = 1;
        }

        if(_chongFenScore === 0) _chongFenScore = 1;
        var idx = [1, 2, 3, 4].indexOf(_chongFenScore);
        this._playNode_chongfenfenshou_radio.selectItem(idx);
        this.radioBoxSelectCB(_chongFenScore, this._chongFenFenShouList[idx], this._chongFenFenShouList);


        //底分
        var _diFenScore;
        if (isClub) {
            _diFenScore = this.getNumberItem("diFenScore", 1)
        } else{
            _diFenScore = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuPuLaoPai_df, 1);
        }
        if(!_diFenScore || typeof (_diFenScore) !== "number"){
            _diFenScore = 1;
        }

        var idx = [1, 2, 3, 4].indexOf(_diFenScore);
        this._playNode_difen_radio.selectItem(idx);
        this.radioBoxSelectCB(_diFenScore, this._diFenList[idx], this._diFenList);


        //积分底分
        if (isClub)
            this._difen = this.getNumberItem("difen", 1);
        else
            this._difen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuPuLaoPai_jsdf, 1);
        if (this._textDiFen){
            if(!this._difen || typeof (this._difen) !== "number"){
                this._difen = 1;
            }
            this._textDiFen.setString(this._difen);
        }

        this.difenIndex = this.difenAry.indexOf(this._difen);

        //是否带花
        var _hua;
        if (isClub) {
            _hua = this.getNumberItem("hua", 1)
        } else{
            _hua = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuPuLaoPai_hua, 1);
        }
        if(!_hua || typeof (_hua) !== "number"){
            _hua = 1;
        }
        this._playNode_hua_radio.selectItem(_hua);
        this.radioBoxSelectCB(_hua, this._huaList[_hua], this._huaList);


        //庄闲
        var zx;
        if (isClub)
            zx = this.getBoolItem("zhuangXian", true);
        else
            zx = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuPuLaoPai_zhuangxian, true);
        this._playNode_zhuangXian.setSelected(zx);
        var text = this._playNode_zhuangXian.getChildByName("text");
        this.selectedCB(text, zx);


        // 只能自模胡
        var znzmh;
        if (isClub)
            znzmh = this.getBoolItem("znzmh", false);
        else
            znzmh = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuPuLaoPai_znzmh, false);
        this._playNode_ziMoHu.setSelected(znzmh);
        var text = this._playNode_ziMoHu.getChildByName("text");
        this.selectedCB(text, znzmh);


        // 碰后不出同张
        var phbctz;
        if (isClub)
            phbctz = this.getBoolItem("phbctz", false);
        else
            phbctz = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuPuLaoPai_phbctz, false);
        this._playNode_phbctz.setSelected(phbctz);
        var text = this._playNode_phbctz.getChildByName("text");
        this.selectedCB(text, phbctz);


        // 吃后不出同张
        var chbctz;
        if (isClub)
            chbctz = this.getBoolItem("chbctz", false);
        else
            chbctz = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuPuLaoPai_chbctz, false);
        this._playNode_chbctz.setSelected(chbctz);
        var text = this._playNode_chbctz.getChildByName("text");
        this.selectedCB(text, chbctz);


        // 取消箍臭
        var qxgc;
        if (isClub)
            qxgc = this.getBoolItem("qxgc", false);
        else
            qxgc = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuPuLaoPai_qxgc, false);
        this._playNode_qxgc.setSelected(qxgc);
        var text = this._playNode_qxgc.getChildByName("text");
        this.selectedCB(text, qxgc);


        // 听牌
        var tingpai;
        if (isClub)
            tingpai = this.getBoolItem("tingPai", false);
        else
            tingpai = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuPuLaoPai_tingpai, false);
        this._playNode_tingPai.setSelected(tingpai);
        var text = this._playNode_tingPai.getChildByName("text");
        this.selectedCB(text, tingpai);


        // 吃碰确认
        var cpqr;
        if (isClub)
            cpqr = this.getBoolItem("cpqr", false);
        else
            cpqr = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuPuLaoPai_cpqr, false);
        this._playNode_cpqr.setSelected(cpqr);
        var text = this._playNode_cpqr.getChildByName("text");
        this.selectedCB(text, cpqr);


        //首局随机庄
        var sjsjz;
        if (isClub)
            sjsjz = this.getBoolItem("sjsjz", false);
        else
            sjsjz = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuPuLaoPai_sjsjz, false);
        this._playNode_sjsjz.setSelected(sjsjz);
        var text = this._playNode_sjsjz.getChildByName("text");
        this.selectedCB(text, sjsjz);

        this.changePayForPlayerNum();
    },

    changePayForPlayerNum:function(select_number)
    {
        if (select_number != null) {
            MjClient.MaxPlayerNum = 4 - select_number;
        }
        cc.log("create select_numberselect_numberselect_number -- by sking");

        this.guChouShowAndHide();

        this.setDiaNumData(this.bg_node);
    },

    // 取消箍臭是否隐藏
    guChouShowAndHide: function () {
        if (MjClient.MaxPlayerNum == 2 || [4, 3, 2, 4][this._playNode_player_count_radio.getSelectIndex()] == 2) {
            this._playNode_qxgc.visible = false;
            this._playNode_qxgc.setSelected(true);
        }
        else {
            this._playNode_qxgc.visible = true;
        }
    },

    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XU_PU_LAO_PAI;
        para.maxPlayer = [4, 3, 2, 4][this._playNode_player_count_radio.getSelectIndex()];
        para.chongFenId = this._playNode_chongfen_radio.getSelectIndex();
        para.chongFenScore = [1, 2, 3, 4][this._playNode_chongfenfenshou_radio.getSelectIndex()];
        para.diFenScore = [1, 2, 3, 4][this._playNode_difen_radio.getSelectIndex()];
        para.hua = this._playNode_hua_radio.getSelectIndex();
        para.zhuangXian = this._playNode_zhuangXian.isSelected();    //庄闲
        para.znzmh = this._playNode_ziMoHu.isSelected();             //只能自模胡
        para.phbctz = this._playNode_phbctz.isSelected();            //碰后不出同张
        para.chbctz = this._playNode_chbctz.isSelected();            //吃后不出同张
        para.qxgc = this._playNode_qxgc.isSelected();                //取消箍臭
        para.tingPai = this._playNode_tingPai.isSelected();          //听牌
        para.cpqr = this._playNode_cpqr.isSelected();                //吃碰确认
        para.sjsjz = this._playNode_sjsjz.isSelected();              //首局随机庄
        para.difen = this._difen;                                    //积分底分
        if(para.chongFenId === 0 || para.chongFenId === 1) {
            para.chongFenScore = 0;
        }

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuPuLaoPai_count, this._playNode_player_count_radio.getSelectIndex());
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuPuLaoPai_cf, para.chongFenId);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuPuLaoPai_cffs, para.chongFenScore);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuPuLaoPai_df, para.diFenScore);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuPuLaoPai_hua, para.hua);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuPuLaoPai_zhuangxian, para.zhuangXian);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuPuLaoPai_znzmh, para.znzmh);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuPuLaoPai_phbctz, para.phbctz);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuPuLaoPai_chbctz, para.chbctz);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuPuLaoPai_qxgc, para.qxgc);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuPuLaoPai_tingpai, para.tingPai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuPuLaoPai_cpqr, para.cpqr);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuPuLaoPai_sjsjz, para.sjsjz);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuPuLaoPai_jsdf, this._difen);
        }
        cc.log("xuPuLaoPai  createara: " + JSON.stringify(para));
        return para;
    }
});