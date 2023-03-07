/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_xuezhanMJ = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard) {
            this.localStorageKey.KEY_xuezhanMJ_count   = "_XUE_ZHAN_MJ_COUNT";  //人数
            this.localStorageKey.KEY_xuezhanMJ_difen      = "_XUE_ZHAN_MJ_DI_FEN";     //辣子
            this.localStorageKey.KEY_xuezhanMJ_fengding  = "_XUE_ZHAN_MJ_FENG_DING";
            this.localStorageKey.KEY_xuezhanMJ_jingoudiao  = "_XUE_ZHAN_MJ_JIN_GOU_GOU";
        }

        this.bg_node = ccs.load("bg_xuezhanMJ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_xuezhanMJ");
    },
    initPlayNode:function()
    {
        this._super();
        var _bghaianNode = this.bg_node;


        // //花
        var _play = _bghaianNode.getChildByName("play");

        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("count0");
        this._playNode_maxPlayer1 = _play.getChildByName("count1");
        this._playNode_maxPlayer2 = _play.getChildByName("count2");
        var nodeCountList1 = [];
        nodeCountList1.push(_play.getChildByName("count0"));
        nodeCountList1.push(_play.getChildByName("count1"));
        nodeCountList1.push(_play.getChildByName("count2"));
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio,this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;
        this.initPlayNumNode(nodeCountList1, [4, 3, 2]);



        //底分
        this._zhuIdx = 0;//数组的引索
        var _fenshu = [1,2,3,4,5,10,20,50];
        var _arrayLenth =  _fenshu.length;//数组长度
        this._ZhuNum = _play.getChildByName("txt_fen");
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);
        this._Button_sub = _play.getChildByName("btn_sub");
        this._Button_sub.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + --this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);
        this._Button_add = _play.getChildByName("btn_add");
        this._Button_add.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                this._zhuIdx = (_arrayLenth + ++this._zhuIdx)%_arrayLenth;
                this._ZhuNum.setString(_fenshu[this._zhuIdx]);
                this.setRoomCardModeFree();
            }
        }, this);



        //封顶
        this._playNode_fengding_0 = _play.getChildByName("fengding0");
        this._playNode_fengding_1 = _play.getChildByName("fengding1");
        this._playNode_fengding_2 = _play.getChildByName("fengding2");
        this._playNode_fengding_3 = _play.getChildByName("fengding3");
        var nodeListfeng =[];
        nodeListfeng.push( _play.getChildByName("fengding0") );
        nodeListfeng.push( _play.getChildByName("fengding1") );
        nodeListfeng.push( _play.getChildByName("fengding2") );
        nodeListfeng.push( _play.getChildByName("fengding3") );
        this._playNode_fengding_radio = createRadioBoxForCheckBoxs(nodeListfeng,this.radioBoxSelectCB);
        this.addListenerText(nodeListfeng,this._playNode_fengding_radio);

        //金钩钩
        this._playNode_jingoudiao = _play.getChildByName("jingoudiao");
        this.addListenerText(this._playNode_jingoudiao);
        this._playNode_jingoudiao.addEventListener(this.clickCB, this._playNode_jingoudiao);



    },
    initRoundNode:function()
    {
        this._super();
        //this.payWayNode_3.visible = true;
        //this.payWayNode_3.setEnabled(true);
        if (cc.sys.isObjectValid(this.payWayNodeArray[2]))
        {
            this.payWayNodeArray[2].visible = true;
            this.payWayNodeArray[2].setEnabled(true);
        }
    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        this._super();
        //封顶
        var _fengdingNum;
        if (isClub)
            _fengdingNum = this.getNumberItem("fengding",5);
        else
            _fengdingNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuezhanMJ_fengding,5);
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
        if(_fengdingNum == 3)
        {
            this._playNode_fengding_0.setSelected(true);
            index = 0;
        }
        else if(_fengdingNum == 4)
        {
            this._playNode_fengding_1.setSelected(true);
            index = 1;
        }
        else if(_fengdingNum == 5)
        {
            this._playNode_fengding_2.setSelected(true);
            index = 2;
        }
        else if(_fengdingNum == 0)
        {
            this._playNode_fengding_3.setSelected(true);
            index = 3;
        }
        this.radioBoxSelectCB(index,list[index],list);

        //人数
        var _currentCount;
        if (isClub)
            _currentCount = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        else
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuezhanMJ_count, 0);
        this._playNode_player_count_radio.selectItem(_currentCount);
        this.radioBoxSelectCB(_currentCount, this._countlist[_currentCount], this._countlist);

        //底分
        var _fenshu = [1,2,3,4,5,10,20,50];
        var _idx;
        if (isClub) {
            _idx = this.getNumberItem("difen", 0);
            _idx = _fenshu.indexOf( parseInt(_idx) );
        }else
            _idx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_xuezhanMJ_difen, 0);
        this._zhuIdx = (_fenshu.length + _idx)%_fenshu.length;
        this._ZhuNum.setString(_fenshu[this._zhuIdx]);

        var _jingoudiao;
        if (isClub)
            _jingoudiao = this.getBoolItem("jingoudiao", true);
        else
            _jingoudiao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_xuezhanMJ_jingoudiao, true);
        this._playNode_jingoudiao.setSelected(_jingoudiao);
        var text = this._playNode_jingoudiao.getChildByName("text");
        this.selectedCB(text,_jingoudiao)

    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.XUE_ZHAN;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;

        para.fengding = 5;//
        para.difen  = 1;
        para.jingoudiao = true;

        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps

        //封顶
        if (this._playNode_fengding_0.isSelected())
        {
            para.fengding  = 3;
        }
        else if (this._playNode_fengding_1.isSelected())
        {
            para.fengding  = 4;
        }
        else if (this._playNode_fengding_2.isSelected())
        {
            para.fengding  = 5;
        }
        else if (this._playNode_fengding_3.isSelected())
        {
            para.fengding  = 0;
        }



        //人数
        var _countIdx = 1;
        if (this._playNode_maxPlayer0.isSelected())
        {
            para.maxPlayer = 4;
            _countIdx = 0;
        }
        else if (this._playNode_maxPlayer1.isSelected())
        {
            para.maxPlayer = 3;
            _countIdx = 1;
        }
        else if (this._playNode_maxPlayer2.isSelected())
        {
            para.maxPlayer = 2;
            _countIdx = 2;
        }



        para.jingoudiao = this._playNode_jingoudiao.isSelected();
        para.difen =Number(this._ZhuNum.getString());

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuezhanMJ_fengding,para.fengding);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_xuezhanMJ_count,_countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuezhanMJ_difen,Number(this._zhuIdx));
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_xuezhanMJ_jingoudiao,para.jingoudiao);
        }

        cc.log("createara: " + JSON.stringify(para),MjClient.MaxPlayerNum);
        return para;
    },
});