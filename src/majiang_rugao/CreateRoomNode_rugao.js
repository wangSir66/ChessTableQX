/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_rugao = CreateRoomNode.extend({
    setKeyByCardFriend:function(){
        this.localStorageKey.KEY_rugao_147_xiJiang = "CF_RU_GAO_147_XI_JIANG"; //是否147喜将
        this.localStorageKey.KEY_rugao_mengzigun = "CF_RU_GAO_MEN_ZI_GUN"; //闷子棍
        this.localStorageKey.KEY_rugao_shuanglonghui = "CF_RU_GAO_SHUANG_LONG_HUI"; //双龙汇
        this.localStorageKey.KEY_rugao_huimianchuhan = "CF_RU_GAO_HUI_MIAN_CHU_HAN"; //会面出汗
        this.localStorageKey.KEY_rugao_haidilaoyue = "CF_RU_GAO_HAI_DI_LAO_YUE"; //海底捞月
        this.localStorageKey.KEY_rugao_fengdingNum = "CF_RU_GAO_FENG_DING_NUM"; //封顶数
        this.localStorageKey.KEY_rugao_daixi = "CF_RU_GAO_DAI_XI"; //带喜
        this.localStorageKey.KEY_rugao_shengyihu = "CF_RU_GAO_SHENG_YI_HU"; //剩一胡
        this.localStorageKey.KEY_rugao_maizhuang = "CF_RU_GAO_MAI_ZHUANG"; //买装
        this.localStorageKey.KEY_rugao_jizi = "CF_RU_GAO_JI_ZI"; //机子
        this.localStorageKey.KEY_rugao_tiehu = "CF_RU_GAO_TIE_HU"; //贴胡
        this.localStorageKey.KEY_rugao_qitie = "CF_RU_GAO_QI_TIE"; //起贴
        this.localStorageKey.KEY_rugao_tiehuCount = "CF_RU_GAO_TIE_HU_COUNT"; //贴胡数
    },
    setKey:function(){
        this.localStorageKey.KEY_rugao_147_xiJiang = "_RU_GAO_147_XI_JIANG"; //是否147喜将
        this.localStorageKey.KEY_rugao_mengzigun = "_RU_GAO_MEN_ZI_GUN"; //闷子棍
        this.localStorageKey.KEY_rugao_shuanglonghui = "_RU_GAO_SHUANG_LONG_HUI"; //双龙汇
        this.localStorageKey.KEY_rugao_huimianchuhan = "_RU_GAO_HUI_MIAN_CHU_HAN"; //会面出汗
        this.localStorageKey.KEY_rugao_haidilaoyue = "_RU_GAO_HAI_DI_LAO_YUE"; //海底捞月
        this.localStorageKey.KEY_rugao_fengdingNum = "_RU_GAO_FENG_DING_NUM"; //封顶数
        this.localStorageKey.KEY_rugao_daixi = "_RU_GAO_DAI_XI"; //带喜
        this.localStorageKey.KEY_rugao_shengyihu = "_RU_GAO_SHENG_YI_HU"; //剩一胡
        this.localStorageKey.KEY_rugao_maizhuang = "_RU_GAO_MAI_ZHUANG"; //买装
        this.localStorageKey.KEY_rugao_jizi = "_RU_GAO_JI_ZI"; //机子
        this.localStorageKey.KEY_rugao_tiehu = "_RU_GAO_TIE_HU"; //贴胡
        this.localStorageKey.KEY_rugao_qitie = "_RU_GAO_QI_TIE"; //起贴
        this.localStorageKey.KEY_rugao_tiehuCount = "_RU_GAO_TIE_HU_COUNT"; //贴胡数
    },

    initAll: function(IsFriendCard) {
        if (IsFriendCard)
            this.setKeyByCardFriend();
        else
            this.setKey();


        this.bg_node = ccs.load("bg_rugao.json").node;

        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_rugao");

        //为适配拖动，先把节点获取到
        this._scrollview = this.bg_node.getChildByName("scrollview");
        this._scroll_play = this._scrollview.getChildByName("play");
        this._scroll_round = this._scrollview.getChildByName("round");
    },
    initRoundNode: function() {
        this._super();
        //this.payWayNode_3.visible = true;
        //this.payWayNode_3.setEnabled(true);
        if (cc.sys.isObjectValid(this.payWayNodeArray[2]))
        {
            this.payWayNodeArray[2].visible = true;
            this.payWayNodeArray[2].setEnabled(true);
        }
    },
    initPlayNode: function() {
        this._super();
        //花
        var _play = this._scroll_play;
        this._playNode_xiJiang_1 = _play.getChildByName("xiJiang147");
        this._playNode_xiJiang_2 = _play.getChildByName("xiJiangquan");
        var nodeList = [];
        nodeList.push(_play.getChildByName("xiJiang147"));
        nodeList.push(_play.getChildByName("xiJiangquan"));
        this._playNode_jiang_radio = createRadioBoxForCheckBoxs(nodeList, this.radioBoxSelectCB);
        this.addListenerText(nodeList, this._playNode_jiang_radio);
        //封顶
        this._playNode_fengding_0 = _play.getChildByName("fengding_0");
        this._playNode_fengding_1 = _play.getChildByName("fengding_1");
        this._playNode_fengding_2 = _play.getChildByName("fengding_2");
        var nodeListfeng = [];
        nodeListfeng.push(_play.getChildByName("fengding_0"));
        nodeListfeng.push(_play.getChildByName("fengding_1"));
        nodeListfeng.push(_play.getChildByName("fengding_2"));
        this._playNode_fengding_radio = createRadioBoxForCheckBoxs(nodeListfeng, this.radioBoxSelectCB);
        this.addListenerText(nodeListfeng, this._playNode_fengding_radio);
        //增分
        this._playNode_huanglonghui = _play.getChildByName("shuanglonghui");
        this.addListenerText(this._playNode_huanglonghui);
        this._playNode_huanglonghui.addEventListener(this.clickCB, this._playNode_huanglonghui);
        //上限
        this._playNode_mengzigun = _play.getChildByName("mengzigun");
        this.addListenerText(this._playNode_mengzigun);
        this._playNode_mengzigun.addEventListener(this.clickCB, this._playNode_mengzigun);
        //带喜
        this._playNode_daixi = _play.getChildByName("daixi");
        this._playNode_daixi.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this.is_daiXi();
                    break;
            }
        },this);
        this.addListenerText(this._playNode_daixi,null,this.is_daiXi.bind(this));
        //剩一胡
        this._playNode_shengyihu = _play.getChildByName("shengyihu");
        this.addListenerText(this._playNode_shengyihu);
        this._playNode_shengyihu.addEventListener(this.clickCB, this._playNode_shengyihu);

        //吃碰杠
        this._playNode_laodilaoyue = _play.getChildByName("laodilaoyue");
        this.addListenerText(this._playNode_laodilaoyue);
        this._playNode_laodilaoyue.addEventListener(this.clickCB, this._playNode_laodilaoyue);

        //麦庄
        this._playNode_maizhuang_0 = _play.getChildByName("maizhuang0");
        this._playNode_maizhuang_1 = _play.getChildByName("maizhuang1");
        this._playNode_maizhuang_2 = _play.getChildByName("maizhuang2");
        this._playNode_maizhuang_3 = _play.getChildByName("maizhuang3");
        this._playNode_maizhuang_4 = _play.getChildByName("maizhuang4");
        var nodeListmai = [];
        nodeListmai.push(_play.getChildByName("maizhuang0"));
        nodeListmai.push(_play.getChildByName("maizhuang1"));
        nodeListmai.push(_play.getChildByName("maizhuang2"));
        nodeListmai.push(_play.getChildByName("maizhuang3"));
        nodeListmai.push(_play.getChildByName("maizhuang4"));
        this._playNode_maizhuang_radio = createRadioBoxForCheckBoxs(nodeListmai,this.radioBoxSelectCB);
        this.addListenerText(nodeListmai, this._playNode_maizhuang_radio);
        this._playNode_jizi = _play.getChildByName("jizi");
        this.addListenerText(this._playNode_jizi);
        this._playNode_jizi.addEventListener(this.clickCB, this._playNode_jizi);

        //贴胡
        this._playNode_tiehu = _play.getChildByName("rugaotiehu");
        this._playNode_tiehu.addEventListener(function(sender,type)
        {
            switch (type) {
                case ccui.CheckBox.EVENT_SELECTED:
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this.is_Tiehu();
                    break;
            }
        },this);
        this.addListenerText(this._playNode_tiehu,null,this.is_Tiehu.bind(this));


        //起贴
        this._playNode_100huqitie = _play.getChildByName("100huqitie");
        this._playNode_buxianzhi = _play.getChildByName("buxianzhi");
        var nodeQiTieList = [];
        nodeQiTieList.push(_play.getChildByName("100huqitie"));
        nodeQiTieList.push(_play.getChildByName("buxianzhi"));
        this._playNode_qitieList = createRadioBoxForCheckBoxs(nodeQiTieList, this.radioBoxSelectCB);
        this.addListenerText(nodeQiTieList, this._playNode_qitieList);

        //贴胡数
        this._playNode_tie20hu = _play.getChildByName("tie20hu");
        this._playNode_tie50hu = _play.getChildByName("tie50hu");
        var nodeTieHuList = [];
        nodeTieHuList.push(_play.getChildByName("tie20hu"));
        nodeTieHuList.push(_play.getChildByName("tie50hu"));
        this._playNode_tiehuList = createRadioBoxForCheckBoxs(nodeTieHuList, this.radioBoxSelectCB);
        this.addListenerText(nodeTieHuList, this._playNode_tiehuList);
    },
    setPlayNodeCurrentSelect: function() {
        this._super();
        var _isxijiang147 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_147_xiJiang, false);
        var list = [];
        list.push(this._playNode_xiJiang_1);
        list.push(this._playNode_xiJiang_2);
        var index = _isxijiang147 == true ? 0 : 1;
        this._playNode_xiJiang_1.setSelected(_isxijiang147);
        this._playNode_xiJiang_2.setSelected(!_isxijiang147);
        this.radioBoxSelectCB(index, list[index], list);

        var _fengxiangNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_rugao_fengdingNum, 0);
        this._playNode_fengding_0.setSelected(false);
        this._playNode_fengding_1.setSelected(false);
        this._playNode_fengding_2.setSelected(false);
        var list = [];
        list.push(this._playNode_fengding_0);
        list.push(this._playNode_fengding_1);
        list.push(this._playNode_fengding_2);
        var index = _fengxiangNum == 0 ? 0 : (_fengxiangNum == 600 ? 1 : 2);
        this["_playNode_fengding_" + index].setSelected(true);
        this.radioBoxSelectCB(index, list[index], list);

        var _mengziguan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_mengzigun, false);
        this._playNode_mengzigun.setSelected(_mengziguan);
        var text = this._playNode_mengzigun.getChildByName("text");
        this.selectedCB(text, _mengziguan)

        var _huanglonghui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_shuanglonghui, true);
        this._playNode_huanglonghui.setSelected(_huanglonghui);
        var text = this._playNode_huanglonghui.getChildByName("text");
        this.selectedCB(text, _huanglonghui)

        var _daixi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_daixi, true);
        this._playNode_daixi.setSelected(_daixi);
        var text = this._playNode_daixi.getChildByName("text");
        this.selectedCB(text, _daixi)
        this.is_daiXi();


        var _shengyihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_shengyihu, true);
        this._playNode_shengyihu.setSelected(_shengyihu);
        var text = this._playNode_shengyihu.getChildByName("text");
        this.selectedCB(text, _shengyihu)

        var _haidilaoyue = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_haidilaoyue, false);
        this._playNode_laodilaoyue.setSelected(_haidilaoyue);
        var text = this._playNode_laodilaoyue.getChildByName("text");
        this.selectedCB(text, _haidilaoyue)


        var _maiNum = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_rugao_maizhuang, 0);
        this._playNode_maizhuang_0.setSelected(false);
        this._playNode_maizhuang_1.setSelected(false);
        this._playNode_maizhuang_2.setSelected(false);
        this._playNode_maizhuang_3.setSelected(false);
        this._playNode_maizhuang_4.setSelected(false);
        var list = [];
        list.push(this._playNode_maizhuang_0);
        list.push(this._playNode_maizhuang_1);
        list.push(this._playNode_maizhuang_2);
        list.push(this._playNode_maizhuang_3);
        list.push(this._playNode_maizhuang_4);
        var index = 0;
        if (_maiNum == 0) {
            this._playNode_maizhuang_0.setSelected(true);
        } else if (_maiNum == 123) {
            this._playNode_maizhuang_1.setSelected(true);
        } else if (_maiNum == 234) {
            this._playNode_maizhuang_2.setSelected(true);
        } else if (_maiNum == 345) {
            this._playNode_maizhuang_3.setSelected(true);
        } else if (_maiNum == 5710) {
            this._playNode_maizhuang_4.setSelected(true);
        }
        this.radioBoxSelectCB(index, list[index], list);

        var _jizi = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_jizi, true);
        this._playNode_jizi.setSelected(_jizi);
        var text = this._playNode_jizi.getChildByName("text");
        this.selectedCB(text, _jizi);

        var _isxijiang147 = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_147_xiJiang, false);
        var list = [];
        list.push(this._playNode_xiJiang_1);
        list.push(this._playNode_xiJiang_2);
        var index = _isxijiang147 == true ? 0 : 1;
        this._playNode_xiJiang_1.setSelected(_isxijiang147);
        this._playNode_xiJiang_2.setSelected(!_isxijiang147);
        this.radioBoxSelectCB(index, list[index], list);

        var _tiehu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_rugao_tiehu, false);
        this._playNode_tiehu.setSelected(_tiehu);
        var text = this._playNode_tiehu.getChildByName("text");
        this.selectedCB(text, _tiehu);
        this.is_Tiehu();

        var _qitie = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_rugao_qitie, 100);
        var list = [];
        list.push(this._playNode_100huqitie);
        list.push(this._playNode_buxianzhi);
        var index = _qitie == 100 ? 0 : 1;
        this._playNode_100huqitie.setSelected(index == 0);
        this._playNode_buxianzhi.setSelected(index == 1);
        this.radioBoxSelectCB(index, list[index], list);

        var _tiehuCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_rugao_tiehuCount, 20);
        var list = [];
        list.push(this._playNode_tie50hu);
        list.push(this._playNode_tie20hu);
        var index = _tiehuCount == 50? 0 : 1;
        this._playNode_tie50hu.setSelected(index == 0);
        this._playNode_tie20hu.setSelected(index == 1);
        this.radioBoxSelectCB(index, list[index], list);



    },
    is_Tiehu:function(){
        if(this._playNode_tiehu.isSelected()){
            this._playNode_tie20hu.setVisible(true);
            this._playNode_tie50hu.setVisible(true);
            this._playNode_100huqitie.setVisible(true);
            this._playNode_buxianzhi.setVisible(true);
        }else{
            this._playNode_tie20hu.setVisible(false);
            this._playNode_tie50hu.setVisible(false);
            this._playNode_100huqitie.setVisible(false);
            this._playNode_buxianzhi.setVisible(false);
        }
        var text = this._playNode_tiehu.getChildByName("text");
        this.selectedCB(text, this._playNode_tiehu.isSelected() == true);
    },
    is_daiXi:function(){
        if (this._playNode_daixi.isSelected()) {
            this._playNode_xiJiang_1.setVisible(true);
            this._playNode_xiJiang_2.setVisible(true);
        }else{
            this._playNode_xiJiang_1.setVisible(false);
            this._playNode_xiJiang_2.setVisible(false);
        }
        var text = this._playNode_daixi.getChildByName("text");
        this.selectedCB(text, this._playNode_daixi.isSelected() == true);
    },
    getSelectedPara: function() {
        var para = {};
        if(this._nodeGPS) para.gps = this._nodeGPS.isSelected();
        para.gameType = MjClient.GAME_TYPE.RU_GAO;
        para.maxPlayer = 3;
        //para.flowerType = WithFlowerType.noFlower;
        para.menzigun = false;
        para.shuanglonghui = false;
        para.huimianchuhan = false;
        para.haidilaoyue = false;
        para.fengding = 0;
        para.daixi = true;
        para.shengyihu = true;
        para.maizhuang = 0;
        para.jizi = true;

        var isxiJiang147 = false;
        para.daixi = this._playNode_daixi.isSelected();
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_daixi, para.daixi);
        //喜将
        if (para.daixi) {
            if (this._playNode_xiJiang_1.isSelected()) {
                para.xijiang = "xijiang147";
                isxiJiang147 = true;
            } else if (this._playNode_xiJiang_2.isSelected()) {
                para.xijiang = "xijiangQuan";
                isxiJiang147 = false;
            }
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_147_xiJiang, isxiJiang147);
        }

        //封顶
        para.fengding = this._playNode_fengding_0.isSelected() == true ? 0 : (this._playNode_fengding_1.isSelected() == true ? 600 : 800);
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_rugao_fengdingNum, para.fengding);
        //闷子棍
        para.menzigun = this._playNode_mengzigun.isSelected() == true ? true : false;
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_mengzigun, para.menzigun);
        //双龙会
        if (this._playNode_huanglonghui.isSelected()) {
            para.shuanglonghui = true;
        } else {
            para.shuanglonghui = false;
        }
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_shuanglonghui, para.shuanglonghui);



        para.shengyihu = this._playNode_shengyihu.isSelected();
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_shengyihu, para.shengyihu);

        //海底捞月
        para.haidilaoyue = this._playNode_laodilaoyue.isSelected() == true ? true : false;
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_haidilaoyue, para.haidilaoyue);

        if (this._playNode_maizhuang_0.isSelected()) {
            para.maizhuang = 0;
        } else if (this._playNode_maizhuang_1.isSelected()) {
            para.maizhuang = 123;
        } else if (this._playNode_maizhuang_2.isSelected()) {
            para.maizhuang = 234;
        } else if (this._playNode_maizhuang_3.isSelected()) {
            para.maizhuang = 345;
        } else if (this._playNode_maizhuang_4.isSelected()) {
            para.maizhuang = 5710;
        }
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_rugao_maizhuang, para.maizhuang);

        para.jizi = this._playNode_jizi.isSelected();
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_jizi, para.jizi);


        para.tiehu = this._playNode_tiehu.isSelected();
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_rugao_tiehu, para.tiehu);



        if(para.tiehu)
        {
            para.qitie = this._playNode_buxianzhi.isSelected() == true ? 0 : 100;
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_rugao_qitie, para.qitie);

            para.tiehuCount = this._playNode_tie20hu.isSelected() == true ? 20 : 50;
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_rugao_tiehuCount, para.tiehuCount);
        }



        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});