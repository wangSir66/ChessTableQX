/**
 * Created by sking on 2017/7/21.
 */


var CreateRoomNode_doudizhuHA = CreateRoomNode.extend({
    setKey: function () {
        this.localStorageKey.KEY_DDZ_playerNumber = "_DOU_DI_ZHU_PLAYER_NUMBER";     //玩家数量
        this.localStorageKey.KEY_DDZ_fengding = "_DOU_DI_ZHU_FENG_DING";         //封顶 0 不封顶，1  3倍封顶 2 4倍封顶
        this.localStorageKey.KEY_DDZ_BJ_SHUANGWANG = "_DOU_DI_ZHU_BJ_SHUANGWANG";                //必叫
        this.localStorageKey.KEY_DDZ_BJ_SIGEER = "_DOU_DI_ZHU_BJ_SIGEER";
        this.localStorageKey.KEY_DDZ_BJ_WANGSHUANGER = "_DOU_DI_ZHU_BJ_WANGSHUANGER";
        this.localStorageKey.KEY_DDZ_BJ_ZHADAN = "_DOU_DI_ZHU_BJ_ZHADAN";
        this.localStorageKey.KEY_DDZ_JIAOFEN = "_DOU_DI_ZHU_JIAOFEN";         //叫分

        this.localStorageKey.KEY_DDZ_daiti = "_DOU_DI_ZHU_daiti";             //带踢翻倍
        this.localStorageKey.KEY_DDZ_sidaier = "_DOU_DI_ZHU_sidaier";           //四带二
        this.localStorageKey.KEY_DDZ_yingjiachu = "_DOU_DI_ZHU_yingjiachu";         //赢家出

    },
    initAll: function (IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        this.bg_node = ccs.load("bg_doudizhuHA.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_doudizhuHA");
    },
    initRoundNode: function () {
        this._super();
        //this.payWayNode_3.visible = true;
        //this.payWayNode_3.setEnabled(true);
        if (cc.sys.isObjectValid(this.payWayNodeArray[2])) {
            this.payWayNodeArray[2].visible = true;
            this.payWayNodeArray[2].setEnabled(true);
        }
    },
    initPlayNode: function () {
        this._super();
        cc.log(" =============== dpidizhu--------------")
        var _bg_Node = this.bg_node;
        var _playWay = _bg_Node.getChildByName("play_way");
        this._playNode_fengding_0 = _playWay.getChildByName("play_bufengding");
        this._playNode_fengding_1 = _playWay.getChildByName("play_fengding3");
        this._playNode_fengding_2 = _playWay.getChildByName("play_fengding4");
        var nodeListfeng = [];
        nodeListfeng.push(_playWay.getChildByName("play_bufengding"));
        nodeListfeng.push(_playWay.getChildByName("play_fengding3"));
        nodeListfeng.push(_playWay.getChildByName("play_fengding4"));
        this.fengList = nodeListfeng;
        this._playNode_fengding_radio = createRadioBoxForCheckBoxs(nodeListfeng, this.radioBoxSelectCB);
        this.addListenerText(nodeListfeng, this._playNode_fengding_radio);

        this._playNode_bj_shuangwang = _playWay.getChildByName("play_bijiaoshuangwang");
        this.addListenerText(this._playNode_bj_shuangwang);
        this._playNode_bj_shuangwang.addEventListener(this.clickCB, this._playNode_bj_shuangwang);

        this._playNode_bj_sigeer = _playWay.getChildByName("play_bijiaosigeer");
        this.addListenerText(this._playNode_bj_sigeer);
        this._playNode_bj_sigeer.addEventListener(this.clickCB, this._playNode_bj_sigeer);

        this._playNode_bj_wangshuanger = _playWay.getChildByName("play_bijiaowangshuanger");
        this.addListenerText(this._playNode_bj_wangshuanger);
        this._playNode_bj_wangshuanger.addEventListener(this.clickCB, this._playNode_bj_wangshuanger);

        this._playNode_bj_zhadan = _playWay.getChildByName("play_bijiaozhadan");
        this.addListenerText(this._playNode_bj_zhadan);
        this._playNode_bj_zhadan.addEventListener(this.clickCB, this._playNode_bj_zhadan);

        this._playNode_daitifanbei = _playWay.getChildByName("play_daitifanbei");
        this.addListenerText(this._playNode_daitifanbei);
        this._playNode_daitifanbei.addEventListener(this.clickCB, this._playNode_daitifanbei);

        this._playNode_sidaier = _playWay.getChildByName("play_sidaier");
        this.addListenerText(this._playNode_sidaier);
        this._playNode_sidaier.addEventListener(this.clickCB, this._playNode_sidaier);

        this._playNode_yingjiaxiaochu = _playWay.getChildByName("play_yingjiaxianchu");
        this.addListenerText(this._playNode_yingjiaxiaochu);
        this._playNode_yingjiaxiaochu.addEventListener(this.clickCB, this._playNode_yingjiaxiaochu);

        this._playNode_jiaofen = _playWay.getChildByName("play_jiaofen");
        this.addListenerText(this._playNode_jiaofen);
        this._playNode_jiaofen.addEventListener(this.clickCB, this._playNode_jiaofen);


    },
    setPlayNodeCurrentSelect: function (isClub) {
        this._super();
        //设置上次创建房间时的默认选项
        var _fengDing;
        if (isClub)
            _fengDing = this.getNumberItem("zhafengding", 0)
        else
            _fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_DDZ_fengding, 0);
        var index = [0, 3, 4].indexOf(_fengDing);
        if (index == -1)
            index = 0;
        this._playNode_fengding_radio.selectItem(index)
        this["_playNode_fengding_" + index].setSelected(true);
        this.radioBoxSelectCB(index, this.fengList[index], this.fengList);

        var _bi_shuangwang;
        if (isClub)
            _bi_shuangwang = this.getBoolItem("bijiaoShuangwang", false);
        else
            _bi_shuangwang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_BJ_SHUANGWANG, false);
        this._playNode_bj_shuangwang.setSelected(_bi_shuangwang);
        var text = this._playNode_bj_shuangwang.getChildByName("text");
        this.selectedCB(text, _bi_shuangwang)

        var _bi_sigeer;
        if (isClub)
            _bi_sigeer = this.getBoolItem("bijiaoSigeer", false);
        else
            _bi_sigeer = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_BJ_SIGEER, false);
        this._playNode_bj_sigeer.setSelected(_bi_sigeer);
        var text = this._playNode_bj_sigeer.getChildByName("text");
        this.selectedCB(text, _bi_sigeer)

        var _bi_wangshuanger;
        if (isClub)
            _bi_wangshuanger = this.getBoolItem("bijiaoWangshuanger", false);
        else
            _bi_wangshuanger = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_BJ_WANGSHUANGER, false);
        this._playNode_bj_wangshuanger.setSelected(_bi_wangshuanger);
        var text = this._playNode_bj_wangshuanger.getChildByName("text");
        this.selectedCB(text, _bi_wangshuanger)

        var _bi_zhadan;
        if (isClub)
            _bi_zhadan = this.getBoolItem("bijiaoZhadan", false);
        else
            _bi_zhadan = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_BJ_ZHADAN, false);
        this._playNode_bj_zhadan.setSelected(_bi_zhadan);
        var text = this._playNode_bj_zhadan.getChildByName("text");
        this.selectedCB(text, _bi_zhadan)

        var _bi_daiti;
        if (isClub)
            _bi_daiti = this.getBoolItem("daiti", false);
        else
            _bi_daiti = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_daiti, false);
        this._playNode_daitifanbei.setSelected(_bi_daiti);
        var text = this._playNode_daitifanbei.getChildByName("text");
        this.selectedCB(text, _bi_daiti)

        var _bi_sidaier;
        if (isClub)
            _bi_sidaier = this.getBoolItem("sidaier", false);
        else
            _bi_sidaier = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_sidaier, false);
        this._playNode_sidaier.setSelected(_bi_sidaier);
        var text = this._playNode_sidaier.getChildByName("text");
        this.selectedCB(text, _bi_sidaier)

        var _bi_yingjiachu;
        if (isClub)
            _bi_yingjiachu = this.getBoolItem("yingjiaxianchu", false);
        else
            _bi_yingjiachu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_yingjiachu, false);
        this._playNode_yingjiaxiaochu.setSelected(_bi_yingjiachu);
        var text = this._playNode_yingjiaxiaochu.getChildByName("text");
        this.selectedCB(text, _bi_yingjiachu)

        var _jiaoFen;
        if (isClub)
            _jiaoFen = this.getBoolItem("jiaofen", false);
        else
            _jiaoFen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_DDZ_JIAOFEN, false);
        this._playNode_jiaofen.setSelected(_jiaoFen);
        var text = this._playNode_jiaofen.getChildByName("text");
        this.selectedCB(text, _jiaoFen)

    },
    getSelectedPara: function () {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.DOU_DI_ZHU_HA;
        para.maxPlayer = 3;
        para.zhafengding = 0;
        para.bijiaoShuangwang = this._playNode_bj_shuangwang.isSelected();
        para.bijiaoSigeer = this._playNode_bj_sigeer.isSelected();
        para.bijiaoWangshuanger = this._playNode_bj_wangshuanger.isSelected();
        para.bijiaoZhadan = this._playNode_bj_zhadan.isSelected();
        para.daiti = this._playNode_daitifanbei.isSelected();
        para.sidaier = this._playNode_sidaier.isSelected();
        para.yingjiaxianchu = this._playNode_yingjiaxiaochu.isSelected();
        para.jiaofen = this._playNode_jiaofen.isSelected();
        if (this._nodeGPS) para.gps = this._nodeGPS.isSelected(); // add by sking for creat room need gps

        para.zhafengding = this._playNode_fengding_0.isSelected() == true ? 0 : (this._playNode_fengding_1.isSelected() == true ? 3 : 4);

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_DDZ_fengding, para.zhafengding);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_BJ_SHUANGWANG, para.bijiaoShuangwang);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_BJ_SIGEER, para.bijiaoSigeer);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_BJ_WANGSHUANGER, para.bijiaoWangshuanger);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_BJ_ZHADAN, para.bijiaoZhadan);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_daiti, para.daiti);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_sidaier, para.sidaier);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_yingjiachu, para.yingjiaxianchu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_DDZ_JIAOFEN, para.jiaofen);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});