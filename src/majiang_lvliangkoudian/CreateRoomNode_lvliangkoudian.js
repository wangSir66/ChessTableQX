/**
 * Created by wuchengchao on 2018/3/27.
 */


var CreateRoomNode_lvliangkoudian = CreateRoomNode.extend({
    setKeyByCardFriend:function(){
        this.localStorageKey.KEY_koudian_playType        = "CF_KOU_DIAN_PLAY_TYPE";
        this.localStorageKey.KEY_koudian_difen      = "CF_KOU_DIAN_DI_FEN";     //增分
        this.localStorageKey.KEY_koudian_count      = "CF_KOU_DIAN_COUNT"; //人数
        this.localStorageKey.KEY_koudian_lunzhuang      = "CF_KOU_DIAN_LUN_ZHUANG"; //轮庄
    },
    setKey:function(){
        this.localStorageKey.KEY_koudian_playType        = "_KOU_DIAN_PLAY_TYPE";  //DUO
        this.localStorageKey.KEY_koudian_difen      = "_KOU_DIAN_DI_FEN";     //增分
        this.localStorageKey.KEY_koudian_count      = "_KOU_DIAN_COUNT"; //人数
        this.localStorageKey.KEY_koudian_lunzhuang      = "_KOU_DIAN_LUN_ZHUANG"; //轮庄
    },
    initAll:function(IsFriendCard)
    {
        if (IsFriendCard)
            this.setKeyByCardFriend();
        else
            this.setKey();       

        this.bg_node = ccs.load("bg_lvliangkoudian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_lvliangkoudian");
    },
    initRoundNode:function()
    {
        this._super();
        //打开大赢家付
        this.payWayNodeArray[2].visible = true;
        this.payWayNodeArray[2].setEnabled(true);
    },
    initPlayNode:function()
    {
        //this._super();
        var _bgkoudianNode = this.bg_node;
        //花
        var _play = _bgkoudianNode.getChildByName("play");


        // //人数
         this._playNode_maxPlayer0 = _play.getChildByName("play_count0");
         this._playNode_maxPlayer1 = _play.getChildByName("play_count1");
         this._playNode_maxPlayer2 = _play.getChildByName("play_count2");
         var nodeCountList1 = [];
         nodeCountList1.push(_play.getChildByName("play_count0"));
         nodeCountList1.push(_play.getChildByName("play_count1"));
         nodeCountList1.push(_play.getChildByName("play_count2"));
         this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index){
             this.changePayForPlayerNum(index);
             this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
         }.bind(this));
         this.addListenerText(nodeCountList1, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
         this._countlist = nodeCountList1;
		this.initPlayNumNode(nodeCountList1, [4, 3, 2]);

        //玩法playType
        this._playNode_playType0 = _play.getChildByName("play_jindian");
        this._playNode_playType1 = _play.getChildByName("play_budaifeng");
        this._playNode_playType2 = _play.getChildByName("play_daihaozi");
        var nodePlayTypeList1 = [];
        nodePlayTypeList1.push(this._playNode_playType0);
        nodePlayTypeList1.push(this._playNode_playType1);
        nodePlayTypeList1.push(this._playNode_playType2);
        this._playNode_PlayType_radio = createRadioBoxForCheckBoxs(nodePlayTypeList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodePlayTypeList1[index], nodePlayTypeList1);
        }.bind(this));
        this.addListenerText(nodePlayTypeList1, this._playNode_PlayType_radio,this.changePayForPlayerNum.bind(this));
        this._playTypelist = nodePlayTypeList1;


        // 轮庄
        this._playNode_lunzhuang = _play.getChildByName("play_lunzhuang");
        this.addListenerText(this._playNode_lunzhuang);
        this._playNode_lunzhuang.addEventListener(this.clickCB, this._playNode_lunzhuang);

        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,10,20,50];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = _bgkoudianNode.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _bgkoudianNode.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = _bgkoudianNode.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);

    },
    setPlayNodeCurrentSelect: function() {

        // // //留朵 ,不留
        // var _duoIdx = 0;
        // var _duoCount = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_koudian_duo, true);
        // if(!_duoCount)
        // {
        //     _duoIdx = 1
        // }
        // this._playNode_player_duo_radio.selectItem(_duoIdx);
        // this.radioBoxSelectCB(_duoIdx, this._Duolist[_duoIdx], this._Duolist);

        //人数
        var _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_koudian_count, 0);
        cc.log("_currentCount renshu  == " + _currentCount)
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);


        var _playType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_koudian_playType, 0);
        this._playNode_PlayType_radio.selectItem(_playType);
        this.radioBoxSelectCB(_playType, this._playTypelist[_playType], this._playTypelist);

        // 轮庄
        var _lunzhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_koudian_lunzhuang, true);
        this._playNode_lunzhuang.setSelected(_lunzhuang);
        var text = this._playNode_lunzhuang.getChildByName("text");
        this.selectedCB(text, _lunzhuang);

        var _fenshu = [1,2,3,4,5,10,20,50];
        var _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_koudian_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);



        this.changePayForPlayerNum();
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LV_LIANG_KOU_DIAN;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;
        //para.liuduo = true;//2018.1.31修改为默认留垛
        para.difen = 1;
        para.playType = 0; // 0 经典，1 不带风，2 带耗子
        para.lunzhuang = true;
        //para.gps = !!this._bGPS.isSelected();


         //人数
         var _countIdx = 0;
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
         util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_koudian_count, _countIdx)

        //人数
        if (this._playNode_playType0.isSelected()) {
            para.playType = 0;
        }
        else if (this._playNode_playType1.isSelected()) {
            para.playType = 1;
        }
        else if (this._playNode_playType2.isSelected()) {
            para.playType = 2;
        }
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_koudian_playType, para.playType)


        para.difen = this._ZhuNum.getString();
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_koudian_difen, Number(this._zhuIdx));

        // 轮庄
        para.lunzhuang = this._playNode_lunzhuang.isSelected();
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_koudian_lunzhuang,  para.lunzhuang);

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});