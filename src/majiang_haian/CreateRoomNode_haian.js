/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_haian = CreateRoomNode.extend({
    initAll:function()
    {
        if (!this._isFriendCard) {
            this.localStorageKey.KEY_haian_count                = "_HUAI_AN_COUNT";             //人数
            this.localStorageKey.KEY_haian_lazi                 = "_HUAI_AN_LA_ZI";             //辣子
            this.localStorageKey.KEY_haian_maizhuang            = "_HUAI_AN_MAI_ZHUANG";
            this.localStorageKey.KEY_haian_baozi                = "_HUAI_AN_BAO_ZI";
            this.localStorageKey.KEY_haian_fengding             = "_HUAI_AN_FENG_DING";
            this.localStorageKey.KEY_haian_canchi               = "_HUAI_AN_CHI";
            this.localStorageKey.KEY_haian_bihu                 = "_HUAI_AN_BI_HU";             //有胡必胡
        }

        this.bg_node = ccs.load("bg_haian.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_haian");
    },
    initPlayNode:function()
    {
        this._super();
        var _bghaianNode = this.bg_node;


        // //花
        var _play = _bghaianNode.getChildByName("play");

        //人数
        this._playNode_count_0 = _play.getChildByName("count0");   // 4人
        this._playNode_count_1 = _play.getChildByName("count1");   // 3人
        this._playNode_count_2 = _play.getChildByName("count2");   // 2人
        var nodeListcount = [];
        nodeListcount.push(_play.getChildByName("count0"));
        nodeListcount.push(_play.getChildByName("count1"));
        nodeListcount.push(_play.getChildByName("count2"));
        this._playNode_count = createRadioBoxForCheckBoxs(nodeListcount, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeListcount[index], nodeListcount);
        }.bind(this));
        this.addListenerText(nodeListcount, this._playNode_count,this.changePayForPlayerNum.bind(this));
        this._countlist = nodeListcount;
		this.initPlayNumNode(nodeListcount, [4, 3, 2]); 

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


        //买庄
        this._playNode_maizhuang_0 = _play.getChildByName("maizhuang0");
        this._playNode_maizhuang_1 = _play.getChildByName("maizhuang1");
        var nodeListmaizhuang =[];
        nodeListmaizhuang.push( _play.getChildByName("maizhuang0") );
        nodeListmaizhuang.push( _play.getChildByName("maizhuang1") );
        this._playNode_maizhuang = createRadioBoxForCheckBoxs(nodeListmaizhuang,this.radioBoxSelectCB);
        this.addListenerText(nodeListmaizhuang,this._playNode_maizhuang);

        //豹子
        this._playNode_baozi_0 = _play.getChildByName("baozi0");
        this._playNode_baozi_1 = _play.getChildByName("baozi1");
        var nodeListbaozi =[];
        nodeListbaozi.push( _play.getChildByName("baozi0") );
        nodeListbaozi.push( _play.getChildByName("baozi1") );
        this._playNode_baozi = createRadioBoxForCheckBoxs(nodeListbaozi,this.radioBoxSelectCB);
        this.addListenerText(nodeListbaozi,this._playNode_baozi);

        //可吃
        this._playNode_canchi = _play.getChildByName("canchi");
        this.addListenerText(this._playNode_canchi);
        this._playNode_canchi.addEventListener(this.clickCB, this._playNode_canchi);

        //有胡必胡
        this._playNode_bihu = _play.getChildByName("bihu");
        this.addListenerText(this._playNode_bihu);
        this._playNode_bihu.addEventListener(this.clickCB, this._playNode_bihu);

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
        //辣子
        var _fengxiangNum;
        if (isClub)
            _fengxiangNum = this.getNumberItem("lazi",20);
        else
            _fengxiangNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_haian_fengding,20);
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
        if(_fengxiangNum == 20)
        {
            this._playNode_fengding_0.setSelected(true);
            index = 0;
        }
        else if(_fengxiangNum == 40)
        {
            this._playNode_fengding_1.setSelected(true);
            index = 1;
        }
        else if(_fengxiangNum == 60)
        {
            this._playNode_fengding_2.setSelected(true);
            index = 2;
        }
        else if(_fengxiangNum == 100)
        {
            this._playNode_fengding_3.setSelected(true);
            index = 3;
        }
        this.radioBoxSelectCB(index,list[index],list);

        //人数
        var _countValue;
        if (isClub)
            _countValue = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        else
            _countValue = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_haian_count,0);
        this._playNode_count_0.setSelected(false);
        this._playNode_count_1.setSelected(false);
        this._playNode_count_2.setSelected(false);
        var list = [];
        list.push(this._playNode_count_0);
        list.push(this._playNode_count_1);
        list.push(this._playNode_count_2);
        var index = 0;
        if(_countValue == 0)
        {
            this._playNode_count_0.setSelected(true);
            index = 0;
        }
        else if(_countValue == 1)
        {
            this._playNode_count_1.setSelected(true);
            index = 1;
        }
        else if(_countValue == 2)
        {
            this._playNode_count_2.setSelected(true);
            index = 2;
        }
        this.radioBoxSelectCB(index,list[index],list);


        //麦庄
        var _maizhuang;
        if (isClub)
            _maizhuang = this.getBoolItem("maizhuang", true);
        else
            _maizhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_haian_maizhuang,true);
        this._playNode_maizhuang_0.setSelected(false);
        this._playNode_maizhuang_1.setSelected(false);
        var list = [];
        list.push(this._playNode_maizhuang_0);
        list.push(this._playNode_maizhuang_1);
        var index = 0;
        if(_maizhuang)
        {
            this._playNode_maizhuang_0.setSelected(true);
            index = 0;
        }
        else
        {
            this._playNode_maizhuang_1.setSelected(true);
            index = 1;
        }
        this.radioBoxSelectCB(index,list[index],list);

        //豹子
        var _baozi;
        if (isClub)
            _baozi = this.getBoolItem("baozi", true);
        else
            _baozi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_haian_baozi,true);
        this._playNode_baozi_0.setSelected(false);
        this._playNode_baozi_1.setSelected(false);
        var list = [];
        list.push(this._playNode_baozi_0);
        list.push(this._playNode_baozi_1);
        var index = 0;
        if(_baozi)
        {
            this._playNode_baozi_0.setSelected(true);
            index = 0;
        }
        else
        {
            this._playNode_baozi_1.setSelected(true);
            index = 1;
        }
        this.radioBoxSelectCB(index,list[index],list);


        var _canchi;
        if (isClub)
            _canchi = this.getBoolItem("canChi", true);
        else
            _canchi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_haian_canchi, true);
        this._playNode_canchi.setSelected(_canchi);
        var text = this._playNode_canchi.getChildByName("text");
        this.selectedCB(text,_canchi);

        var _bihu;
        if (isClub)
            _bihu = this.getBoolItem("biHu", false);
        else
            _bihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_haian_bihu, false);
        this._playNode_bihu.setSelected(_bihu);
        var text = this._playNode_bihu.getChildByName("text");
        this.selectedCB(text,_bihu)

    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.HAI_AN_MJ;
        para.maxPlayer = 4;
        //para.flowerType = WithFlowerType.noFlower;

        para.zhuangDouble = false;//
        para.lazi  = 20;
        para.maizhuang = false;
        para.baozi = false;
        para.canChi = true;
        para.biHu = true;

        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps

        //封顶
        if (this._playNode_fengding_0.isSelected())
        {
            para.lazi  = 20;
        }
        else if (this._playNode_fengding_1.isSelected())
        {
            para.lazi  = 40;
        }
        else if (this._playNode_fengding_2.isSelected())
        {
            para.lazi  = 60;
        }
        else if (this._playNode_fengding_3.isSelected())
        {
            para.lazi  = 100;
        }


        //人数
        var _countIdx = 1;
        if (this._playNode_count_0.isSelected())
        {
            para.maxPlayer = 4;
            _countIdx = 0;
        }
        else if (this._playNode_count_1.isSelected())
        {
            para.maxPlayer = 3;
            _countIdx = 1;
        }
        else if (this._playNode_count_2.isSelected())
        {
            para.maxPlayer = 2;
            _countIdx = 2;
        }


        //买庄
        var _maizhuang = false;
        if (this._playNode_maizhuang_0.isSelected())
        {
            para.maizhuang = true;
            _maizhuang = true;
        }
        else if (this._playNode_maizhuang_1.isSelected())
        {
            para.maizhuang = false;
            _maizhuang = false;
        }


        //豹子
        var _baozi = false;
        if (this._playNode_baozi_0.isSelected())
        {
            para.baozi = true;
            _baozi =true;
        }
        else if (this._playNode_baozi_1.isSelected())
        {
            para.baozi = false;
            _baozi = false;
        }

        para.canChi = this._playNode_canchi.isSelected();

        para.biHu = this._playNode_bihu.isSelected();

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_haian_fengding,para.lazi);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_haian_count,_countIdx);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_haian_maizhuang,_maizhuang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_haian_baozi,_baozi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_haian_canchi,para.canChi);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_haian_bihu,para.biHu);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
});