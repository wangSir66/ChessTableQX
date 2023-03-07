//靖州麻将创建房间界面
var createRoomNode_JingZhouMaJiang = CreateRoomNode.extend({
    setKey: function() {
        this.localStorageKey.KEY_jingZhou_count 				   = "_jingZhou_COUNT"; 				//人数
        this.localStorageKey.KEY_jingZhou_ziyou                    = "_jingZhou_ZIYOU";               //自由人数
        this.localStorageKey.KEY_jingZhou_chouPai                  = "_jingZhou_ChouPai";               //抽牌
        this.localStorageKey.KEY_jingZhou_wuJiangHu                  = "_jingZhou_WuJiangHu";               //无将胡
        this.localStorageKey.KEY_jingZhou_queYiSe                  = "_jingZhou_QueYiSe";               //缺一色
        this.localStorageKey.KEY_jingZhou_PPH                       = "_jingZhou_PPH";               //碰碰胡
        this.localStorageKey.KEY_jingZhou_qingYiSe                 = "_jingZhou_QingYiSe";               //清一色
        this.localStorageKey.KEY_jingZhou_JJH                       = "_jingZhou_JJH";               //将将胡
        this.localStorageKey.KEY_jingZhou_JJH                       = "_jingZhou_JJH";               //将将胡
        this.localStorageKey.KEY_jingZhou_xiaoQiDUi                 = "_jingZhou_XiaoQiDui";         //小七对
        this.localStorageKey.KEY_jingZhou_daDiaoChe                 = "_jingZhou_DaDiaoChe";         //大吊车
        this.localStorageKey.KEY_jingZhou_ShouJuSuiJiZhuang         = "_jingZhou_ShouJuSuiJiZhuang";         //首局随机庄
        this.localStorageKey.KEY_jingZhou_youHuBiHu                 = "_jingZhou_YouHuBiHu";         //有胡必胡
        this.localStorageKey.KEY_jingZhou_daXiaoHuBuDieJia          = "_jingZhou_DaXiaoHuBuDieJia";  //大小胡不叠加
        this.localStorageKey.KEY_jingZhou_dengHu                    = "_jingZhou_DengHu";           //等胡
        this.localStorageKey.KEY_jingZhou_fengDing                    = "_jingZhou_FengDing";           //封顶
        this.localStorageKey.KEY_jingZhou_zhuaNiaoType               = "_jingZhou_zhuaNiaoType";           //抓鸟方式
        this.localStorageKey.KEY_jingZhou_zhuaNiao                  = "_jingZhou_zhuaNiao";           //抓鸟
        this.localStorageKey.KEY_jingZhou_zhuaNiaoCount             = "_jingZhou_zhuaNiaoCount";           //抓鸟数量
        this.localStorageKey.KEY_jingZhou_tuoguan                  = "_jingZhou_TuoGuan";           //托管
        this.localStorageKey.KEY_jingZhou_jiesuan_difen         =  "_jingZhou_difen"; // 积分底分
    },
    initAll: function(IsFriendCard) {
        if (!IsFriendCard)
            this.setKey();

        this.bgNode = ccs.load("bg_JingZhouMaJiang.json").node;
        this.addChild(this.bgNode);
        this.bg_node = this.bgNode.getChildByName("bg").getChildByName("view");
        if(!this.bg_node) this.bg_node = this.bgNode.getChildByName("bg");
    },
    initPlayNode: function() {
        var _bgjingZhouNode = this.bg_node;
        var _play = _bgjingZhouNode.getChildByName("play");
        //抽牌
        this._playNode_chouPai1 = _play.getChildByName("choupai_1");
        this._playNode_chouPai2 = _play.getChildByName("choupai_2");
        this._playNode_chouPai3 = _play.getChildByName("choupai_3");
        var chouPaiList = [];
        chouPaiList.push(this._playNode_chouPai1);
        chouPaiList.push(this._playNode_chouPai2);
        chouPaiList.push(this._playNode_chouPai3);
        this._playNode_chouPai_radio = createRadioBoxForCheckBoxs(chouPaiList, this.radioBoxSelectCB);
        this.addListenerText(chouPaiList, this._playNode_chouPai_radio);
        this.chouPaiList = chouPaiList;

        //人数
        this._playNode_maxPlayer0 = _play.getChildByName("maxPlayer4");
        this._playNode_maxPlayer1 = _play.getChildByName("maxPlayer3");
        this._playNode_maxPlayer2 = _play.getChildByName("maxPlayer2");
        var nodeCountList1 = [];
        nodeCountList1.push(this._playNode_maxPlayer0);
        nodeCountList1.push(this._playNode_maxPlayer1);
        nodeCountList1.push(this._playNode_maxPlayer2);
        this.initPlayNumNode(nodeCountList1, [4, 3, 2]);
        this._playNode_player_count_radio = createRadioBoxForCheckBoxs(nodeCountList1, function(index) { 
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, nodeCountList1[index], nodeCountList1);
        }.bind(this));
        this.addListenerText(nodeCountList1, this._playNode_player_count_radio, this.changePayForPlayerNum.bind(this));
        this._countlist = nodeCountList1;

        //无将胡
        this.play_wuJiangHu = _play.getChildByName("wuJiangHu");
        this.addListenerText(this.play_wuJiangHu);
        this.play_wuJiangHu.addEventListener(this.clickCB, this.play_wuJiangHu);

        //缺一色
        this.play_queYiSe = _play.getChildByName("queYiSe");
        this.addListenerText(this.play_queYiSe);
        this.play_queYiSe.addEventListener(this.clickCB, this.play_queYiSe);

        //碰碰胡
        this.play_PPH = _play.getChildByName("pengPengHu");
        this.addListenerText(this.play_PPH);
        this.play_PPH.addEventListener(this.clickCB, this.play_PPH);

        //清一色
        this.play_qingYiSe = _play.getChildByName("qingYiSe");
        this.addListenerText(this.play_qingYiSe);
        this.play_qingYiSe.addEventListener(this.clickCB, this.play_qingYiSe);

        //将将胡
        this.play_JJH = _play.getChildByName("JiangJiangHu");
        this.addListenerText(this.play_JJH);
        this.play_JJH.addEventListener(this.clickCB, this.play_JJH);

        //小七对
        this.play_xiaoQiDui = _play.getChildByName("xiaoQiDui");
        this.addListenerText(this.play_xiaoQiDui);
        this.play_xiaoQiDui.addEventListener(this.clickCB, this.play_xiaoQiDui);

        //大吊车
        this.play_daDiaoChe = _play.getChildByName("daDiaoChe");
        this.addListenerText(this.play_daDiaoChe);
        this.play_daDiaoChe.addEventListener(this.clickCB, this.play_daDiaoChe);

        //首局随机庄
        this.play_suiJiZhuang = _play.getChildByName("suiJiZhuang");
        this.addListenerText(this.play_suiJiZhuang);
        this.play_suiJiZhuang.addEventListener(this.clickCB, this.play_suiJiZhuang);

        //有胡必胡
        this.play_huBiHu = _play.getChildByName("youHuBiHu");
        this.addListenerText(this.play_huBiHu);
        this.play_huBiHu.addEventListener(this.clickCB, this.play_huBiHu);

        //大小胡不叠加
        this.play_daXiaoHuBuDieJia = _play.getChildByName("daXiaoHuBuDieJia");
        this.addListenerText(this.play_daXiaoHuBuDieJia);
        this.play_daXiaoHuBuDieJia.addEventListener(this.clickCB, this.play_daXiaoHuBuDieJia);
        
        //等胡
        this.play_dengHu = _play.getChildByName("dengHu");
        this.addListenerText(this.play_dengHu);
        this.play_dengHu.addEventListener(this.clickCB, this.play_dengHu);

        //翻倍
        this._playNode_fanBei1 = _play.getChildByName("fanBei_1");
        this._playNode_fanBei2 = _play.getChildByName("fanBei_2");
        this._playNode_fanBei3 = _play.getChildByName("fanBei_3");
        this._playNode_fanBei4 = _play.getChildByName("fanBei_4");
        var fanBeiNodeList = [];
        fanBeiNodeList.push(_play.getChildByName("fanBei_1"));
        fanBeiNodeList.push(_play.getChildByName("fanBei_2"));
        fanBeiNodeList.push(_play.getChildByName("fanBei_3"));
        fanBeiNodeList.push(_play.getChildByName("fanBei_4"));
        this._playNode_player_fanBei_radio = createRadioBoxForCheckBoxs(fanBeiNodeList, this.radioBoxSelectCB);
        this.addListenerText(fanBeiNodeList, this._playNode_player_fanBei_radio);
        this.fanBeiNodeList = fanBeiNodeList;

        //抓鸟方式
        this._playNode_zhuaNiaoType1 = _play.getChildByName("zhuaNiaoType_1");
        this._playNode_zhuaNiaoType2 = _play.getChildByName("zhuaNiaoType_2");
        this._playNode_zhuaNiaoType3 = _play.getChildByName("zhuaNiaoType_3");
        var zhuaNiaoTypeNodeList = [];
        zhuaNiaoTypeNodeList.push(_play.getChildByName("zhuaNiaoType_1"));
        zhuaNiaoTypeNodeList.push(_play.getChildByName("zhuaNiaoType_2"));
        zhuaNiaoTypeNodeList.push(_play.getChildByName("zhuaNiaoType_3"));
        this._playNode_player_zhuaNiaoType_radio = createRadioBoxForCheckBoxs(zhuaNiaoTypeNodeList, function(index){
            var zhongNiaoType = this._playNode_player_zhuaNiao_radio.getSelectIndex();
            this.changeZhongNiao(index, zhongNiaoType);
            this.radioBoxSelectCB(index, zhuaNiaoTypeNodeList[index], zhuaNiaoTypeNodeList);
        }.bind(this));
        this.addListenerText(zhuaNiaoTypeNodeList, this._playNode_player_zhuaNiaoType_radio, function(index){
            var zhongNiaoType = this._playNode_player_zhuaNiao_radio.getSelectIndex();
            this.changeZhongNiao(index, zhongNiaoType);
        }.bind(this));
        this.zhuaNiaoTypeNodeList = zhuaNiaoTypeNodeList;

        //中鸟加分、中鸟加倍
        this._playNode_zhongNiaoJiaFen = _play.getChildByName("zhongNiaoJiaFen");
        this._playNode_zhongNiaoJiaBei = _play.getChildByName("zhongNiaoJiaBei");
        var zhongNiaoNodeList = [];
        zhongNiaoNodeList.push(_play.getChildByName("zhongNiaoJiaFen"));
        zhongNiaoNodeList.push(_play.getChildByName("zhongNiaoJiaBei"));
        this._playNode_player_zhuaNiao_radio = createRadioBoxForCheckBoxs(zhongNiaoNodeList, function(index){
            var zhuaNiaoType = this._playNode_player_zhuaNiaoType_radio.getSelectIndex();
            this.changeZhongNiao(zhuaNiaoType, index);
            this.radioBoxSelectCB(index, zhongNiaoNodeList[index], zhongNiaoNodeList);
        }.bind(this));
        this.addListenerText(zhongNiaoNodeList, this._playNode_player_zhuaNiao_radio, function(index){
            var zhuaNiaoType = this._playNode_player_zhuaNiaoType_radio.getSelectIndex();
            this.changeZhongNiao(zhuaNiaoType, index);
        }.bind(this));
        this.zhongNiaoNodeList = zhongNiaoNodeList;

        //抓鸟
        this._playNode_zhuaNiaoCount1 = _play.getChildByName("zhuaniaoNum_1");
        this._playNode_zhuaNiaoCount2 = _play.getChildByName("zhuaniaoNum_2");
        this._playNode_zhuaNiaoCount3 = _play.getChildByName("zhuaniaoNum_3");
        this._playNode_zhuaNiaoCount4 = _play.getChildByName("zhuaniaoNum_4");
        this._playNode_zhuaNiaoCount5 = _play.getChildByName("zhuaniaoNum_5");
        this._playNode_zhuaNiaoCount6 = _play.getChildByName("zhuaniaoNum_6");
        var zhuaNiaoCountNodeList = [];
        zhuaNiaoCountNodeList.push(this._playNode_zhuaNiaoCount1);
        zhuaNiaoCountNodeList.push(this._playNode_zhuaNiaoCount2);
        zhuaNiaoCountNodeList.push(this._playNode_zhuaNiaoCount3);
        zhuaNiaoCountNodeList.push(this._playNode_zhuaNiaoCount4);
        zhuaNiaoCountNodeList.push(this._playNode_zhuaNiaoCount5);
        zhuaNiaoCountNodeList.push(this._playNode_zhuaNiaoCount6);
        this._playNode_player_zhuaNiaoCount_radio = createRadioBoxForCheckBoxs(zhuaNiaoCountNodeList, this.radioBoxSelectCB);
        this.addListenerText(zhuaNiaoCountNodeList, this._playNode_player_zhuaNiaoCount_radio);
        this.zhuaNiaoCountNodeList = zhuaNiaoCountNodeList;

        //托管
        this._playNode_tuoguanType_0 = _play.getChildByName("tuoguan0");
        this._playNode_tuoguanType_1 = _play.getChildByName("tuoguan1");
        this._playNode_tuoguanType_2 = _play.getChildByName("tuoguan2");
        this._playNode_tuoguanType_3 = _play.getChildByName("tuoguan3");
        this._playNode_tuoguanType_4 = _play.getChildByName("tuoguan4");
        var tuoguanNodeList = [];
        tuoguanNodeList.push(_play.getChildByName("tuoguan0"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan1"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan2"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan3"));
        tuoguanNodeList.push(_play.getChildByName("tuoguan4"));
        this._playNode_player_tuoguan_radio = createRadioBoxForCheckBoxs(tuoguanNodeList, this.radioBoxSelectCB);
        this.addListenerText(tuoguanNodeList, this._playNode_player_tuoguan_radio);
        this.tuoguanNodeList = tuoguanNodeList;

        var btn_tuoguanTip = _play.getChildByName("btn_tuoguanTip");
        var image_tuoguanTip = _play.getChildByName("image_tuoguanTip");
        btn_tuoguanTip.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                image_tuoguanTip.setVisible(true);
            }
        }, btn_tuoguanTip);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            status: null,
            onTouchBegan: function(touch, event) {
                if (image_tuoguanTip.isVisible()) {
                    image_tuoguanTip.setVisible(false);
                    return true;
                } else {
                    return false;
                }
            },
        }, image_tuoguanTip);

        //积分底分
        this.difenAry = [0.1,0.2,0.3,0.4,0.5,1,2,3,4,5,6,7,8,9,10];
        this.difenIndex = 0;
        var _this = this;
        
        var score = this.bg_node.getParent().getChildByName("score");
        var addBtn = this.bg_node.getParent().getChildByName("btn_add");
        var subBtn = this.bg_node.getParent().getChildByName("btn_sub");
        addBtn.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                _this.difenIndex++;
                if (_this.difenIndex > _this.difenAry.length -1)_this.difenIndex = 0;
                score.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
            }
        }, this);

        subBtn.addTouchEventListener(function(sender, type) {
            if (type == 2) {
                _this.difenIndex--;
                if (_this.difenIndex < 0)_this.difenIndex = _this.difenAry.length -1;
                score.setString(_this.difenAry[_this.difenIndex]);
                _this.setRoomCardModeFree(_this.difenAry[_this.difenIndex]);
            }
        }, this);
        
        this.initExtraPlayNode(_play);
    },

    setPlayNodeCurrentSelect: function(isClub) {
        var _play = this.bg_node.getChildByName("play");
        //人数
        var _currentCount;
        var _isConvertible = false;
        if (isClub) {
            _currentCount = this.getNumberItem("maxPlayer", 4);
        }
        else{
            _currentCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingZhou_count, 4);
        }
        var seleIdx = [4, 3, 2].indexOf(_currentCount);
        this._playNode_player_count_radio.selectItem(seleIdx);
        this.radioBoxSelectCB(seleIdx, this._countlist[seleIdx], this._countlist);

        //抽牌
        var chouPai;
        if(isClub){
            chouPai = this.getNumberItem("chouPai", 0);
        }else{
            chouPai = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingZhou_chouPai, 0);
        }
        var chouPaiIdx = [0, 20, 40].indexOf(chouPai);
        this._playNode_chouPai_radio.selectItem(chouPaiIdx);
        this.radioBoxSelectCB(chouPaiIdx, this.chouPaiList[chouPaiIdx], this.chouPaiList);
        this.changePayForPlayerNum(seleIdx);
   
        //无将胡
        var wuJiangHu;
        if (isClub)
            wuJiangHu = this.getBoolItem("wuJiangHu", true);
        else
            wuJiangHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_wuJiangHu, true);
        this.play_wuJiangHu.setSelected(wuJiangHu);
        var text = this.play_wuJiangHu.getChildByName("text");
        this.selectedCB(text, wuJiangHu);

        //缺一色
        var queYiSe;
        if (isClub)
            queYiSe = this.getBoolItem("queYiSe", true);
        else
            queYiSe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_queYiSe, true);
        this.play_queYiSe.setSelected(queYiSe);
        var text = this.play_queYiSe.getChildByName("text");
        this.selectedCB(text, queYiSe);

        //碰碰胡
        var pengPengHu;
        if (isClub)
            pengPengHu = this.getBoolItem("pengPengHu", true);
        else
            pengPengHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_PPH, true);
        this.play_PPH.setSelected(pengPengHu);
        var text = this.play_PPH.getChildByName("text");
        this.selectedCB(text, pengPengHu);

        //清一色
        var qingYiSe;
        if (isClub)
            qingYiSe = this.getBoolItem("qingYiSe", true);
        else
            qingYiSe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_qingYiSe, true);
        this.play_qingYiSe.setSelected(qingYiSe);
        var text = this.play_qingYiSe.getChildByName("text");
        this.selectedCB(text, qingYiSe);

        //将将胡
        var jiangJiangHu;
        if (isClub)
            jiangJiangHu = this.getBoolItem("jiangJiangHu", true);
        else
            jiangJiangHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_JJH, true);
        this.play_JJH.setSelected(jiangJiangHu);
        var text = this.play_JJH.getChildByName("text");
        this.selectedCB(text, jiangJiangHu);

        //小七对
        var xiaoQiDui;
        if (isClub)
            xiaoQiDui = this.getBoolItem("xiaoQiDui", true);
        else
            xiaoQiDui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_xiaoQiDUi, true);
        this.play_xiaoQiDui.setSelected(xiaoQiDui);
        var text = this.play_xiaoQiDui.getChildByName("text");
        this.selectedCB(text, xiaoQiDui);

        //大吊车
        var daDiaoChe;
        if (isClub)
            daDiaoChe = this.getBoolItem("daDiaoChe", true);
        else
            daDiaoChe = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_daDiaoChe, true);
        this.play_daDiaoChe.setSelected(daDiaoChe);
        var text = this.play_daDiaoChe.getChildByName("text");
        this.selectedCB(text, daDiaoChe);

        //首局随机定庄
        var suiJiZhuang;
        if (isClub)
            suiJiZhuang = this.getBoolItem("shouJuZhuangJia", false);
        else
            suiJiZhuang = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_ShouJuSuiJiZhuang, false);
        this.play_suiJiZhuang.setSelected(suiJiZhuang);
        var text = this.play_suiJiZhuang.getChildByName("text");
        this.selectedCB(text, suiJiZhuang);

        //有胡必胡
        var huBIHu;
        if (isClub)
            huBIHu = this.getBoolItem("youHuBiHu", false);
        else
            huBIHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_youHuBiHu, false);
        this.play_huBiHu.setSelected(huBIHu);
        var text = this.play_huBiHu.getChildByName("text");
        this.selectedCB(text, huBIHu);

        //大小胡不叠加
        var daXiaoHuBuDieJia;
        if (isClub)
            daXiaoHuBuDieJia = this.getBoolItem("daXiaoHuBuDieJia", false);
        else
            daXiaoHuBuDieJia = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_daXiaoHuBuDieJia, false);
        this.play_daXiaoHuBuDieJia.setSelected(daXiaoHuBuDieJia);
        var text = this.play_daXiaoHuBuDieJia.getChildByName("text");
        this.selectedCB(text, daXiaoHuBuDieJia);

        //等胡
        var dengHu;
        if (isClub)
            dengHu = this.getBoolItem("dengHu", false);
        else
            dengHu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_jingZhou_dengHu, false);
        this.play_dengHu.setSelected(dengHu);
        var text = this.play_dengHu.getChildByName("text");
        this.selectedCB(text, dengHu);

        //封顶
        var fengDing;
        if(isClub){
            fengDing = this.getNumberItem("fanBei", 0);
        }else{
            fengDing = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingZhou_fengDing, 0);
        }
        var fengDingIdx = [0, 3, 4, 5].indexOf(fengDing);
        this._playNode_player_fanBei_radio.selectItem(fengDingIdx);
        this.radioBoxSelectCB(fengDingIdx, this.fanBeiNodeList[fengDingIdx], this.fanBeiNodeList);

        //抓鸟方式
        var zhuaNiaoType;
        if(isClub){
            zhuaNiaoType = this.getNumberItem("zhuaNiao", 0);
        }else{
            zhuaNiaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingZhou_zhuaNiaoType, 0);
        }
        var zhuaNiaoTypeIdx = [0, 1, 2].indexOf(zhuaNiaoType);
        this._playNode_player_zhuaNiaoType_radio.selectItem(zhuaNiaoTypeIdx);
        this.radioBoxSelectCB(zhuaNiaoTypeIdx, this.zhuaNiaoTypeNodeList[zhuaNiaoTypeIdx], this.zhuaNiaoTypeNodeList);

        //鸟分就算方式
        var NiaoFen;
        if(isClub){
            NiaoFen = this.getNumberItem("zhongNiao", 0);
        }else{
            NiaoFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingZhou_zhuaNiao, 0);
        }
        var NiaoFenTypeIdx = [0, 1].indexOf(NiaoFen);
        this._playNode_player_zhuaNiao_radio.selectItem(NiaoFenTypeIdx);
        this.radioBoxSelectCB(NiaoFenTypeIdx, this.zhongNiaoNodeList[NiaoFenTypeIdx], this.zhongNiaoNodeList);

        //鸟数量
        var NiaoCount;
        if(isClub){
            NiaoCount = this.getNumberItem("niaoNum", 1);
        }else{
            NiaoCount = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingZhou_zhuaNiaoCount, 1);
        }
        var NiaoCountIdx = [1, 2, 3, 4, 6, 8].indexOf(NiaoCount);
        if(NiaoFen == 1 && NiaoCountIdx > 2){
            NiaoCountIdx = 0;
        }
        this._playNode_player_zhuaNiaoCount_radio.selectItem(NiaoCountIdx);
        this.radioBoxSelectCB(NiaoCountIdx, this.zhuaNiaoCountNodeList[NiaoCountIdx], this.zhuaNiaoCountNodeList);
        this.changeZhongNiao(zhuaNiaoTypeIdx, NiaoFenTypeIdx);

        //托管
        var _trustTime;
        if (isClub)
            _trustTime = this.getNumberItem("trustTime", 0);
        else
            _trustTime = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingZhou_tuoguan, 0);
        this._playNode_tuoguanType_0.setSelected(false);
        this._playNode_tuoguanType_1.setSelected(false);
        this._playNode_tuoguanType_2.setSelected(false);
        this._playNode_tuoguanType_3.setSelected(false);
        this._playNode_tuoguanType_4.setSelected(false);
        var index = 0;
        if (_trustTime == 0) {
            this._playNode_tuoguanType_0.setSelected(true);
            index = 0;
        } else if (_trustTime == 60) {
            this._playNode_tuoguanType_1.setSelected(true);
            index = 1;
        } else if (_trustTime == 120) {
            this._playNode_tuoguanType_2.setSelected(true);
            index = 2;
        } else if (_trustTime == 180) {
            this._playNode_tuoguanType_3.setSelected(true);
            index = 3;
        } else if (_trustTime == 300) {
            this._playNode_tuoguanType_4.setSelected(true);
            index = 4;
        }
        this.radioBoxSelectCB(index, this.tuoguanNodeList[index], this.tuoguanNodeList);

       // 积分底分
       var _jieSuanDiFen;
       if(isClub){
           _jieSuanDiFen = this.getNumberItem("jieSuanDiFen", 1);
       }else {
           _jieSuanDiFen = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_jingZhou_jiesuan_difen,1);
       }
       var score = this.bg_node.getParent().getChildByName("score");
       this.difenIndex = this.difenAry.indexOf(_jieSuanDiFen);
       score.setString(_jieSuanDiFen);
    },

    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.JING_ZHOU_MA_JIANG;
        para.maxPlayer = 4;
        para.convertible = false;//是否自由人数

        //人数
        var _countIdx = 0;
        if(this._playNode_maxPlayer0.isSelected()) {
            para.maxPlayer = 4;
        }else if (this._playNode_maxPlayer1.isSelected()) {
            para.maxPlayer = 3;
        }else if (this._playNode_maxPlayer2.isSelected()) {
            para.maxPlayer = 2;
        }

        //抽牌
        var chouPaiIdx = this._playNode_chouPai_radio.getSelectIndex();
        var chouPai = [0, 20, 40][chouPaiIdx];
        if(para.maxPlayer != 2){
            chouPai = 0;
        }
        para.chouPai = chouPai;

        //无将胡
        para.wuJiangHu = this.play_wuJiangHu.isSelected();
        //缺一色
        para.queYiSe = this.play_queYiSe.isSelected();
        //碰碰胡
        para.pengPengHu = this.play_PPH.isSelected();
        //清一色
        para.qingYiSe = this.play_qingYiSe.isSelected();
        //将将胡
        para.jiangJiangHu = this.play_JJH.isSelected();
        //小七对
        para.xiaoQiDui = this.play_xiaoQiDui.isSelected();
        //大吊车
        para.daDiaoChe = this.play_daDiaoChe.isSelected();
        //首局随机庄
        para.shouJuZhuangJia = this.play_suiJiZhuang.isSelected();
        
        //有胡必胡
        para.youHuBiHu = this.play_huBiHu.isSelected();
        //大小胡不叠加
        para.daXiaoHuBuDieJia = this.play_daXiaoHuBuDieJia.isSelected();
        //等胡
        para.dengHu = this.play_dengHu.isSelected();

        //翻倍
        para.fanBei = [0, 3, 4, 5][this._playNode_player_fanBei_radio.getSelectIndex()];

        //抓鸟方式
        para.zhuaNiao = [0, 1, 2][this._playNode_player_zhuaNiaoType_radio.getSelectIndex()];
        //中鸟
        para.zhongNiao = this._playNode_player_zhuaNiao_radio.getSelectIndex();
        //鸟数量
        para.niaoNum = [1, 2, 3, 4, 6, 8][this._playNode_player_zhuaNiaoCount_radio.getSelectIndex()];

        //托管
        if (this._playNode_tuoguanType_0.isSelected()) {
            para.trustTime = 0;
        } else if (this._playNode_tuoguanType_1.isSelected()) {
            para.trustTime = 60;
        } else if (this._playNode_tuoguanType_2.isSelected()) {
            para.trustTime = 120;
        } else if (this._playNode_tuoguanType_3.isSelected()) {
            para.trustTime = 180;
        } else if (this._playNode_tuoguanType_4.isSelected()) {
            para.trustTime = 300;
        }

        //积分底分
        var score = this.bg_node.getParent().getChildByName("score"); 
        para.jieSuanDiFen = Number(score.getString());
        
        this.getExtraSelectedPara(para);


        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingZhou_count,  para.maxPlayer);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_ziyou, para.convertible);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingZhou_chouPai,  para.chouPai);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_wuJiangHu, para.wuJiangHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_queYiSe, para.queYiSe);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_PPH, para.pengPengHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_qingYiSe, para.qingYiSe);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_JJH, para.jiangJiangHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_xiaoQiDUi, para.xiaoQiDui);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_daDiaoChe, para.daDiaoChe);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_ShouJuSuiJiZhuang, para.shouJuZhuangJia);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_youHuBiHu, para.youHuBiHu);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_daXiaoHuBuDieJia, para.daXiaoHuBuDieJia);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_jingZhou_dengHu, para.dengHu);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingZhou_fengDing,  para.fanBei);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingZhou_zhuaNiaoType,  para.zhuaNiao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingZhou_zhuaNiao,  para.zhongNiao);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingZhou_zhuaNiaoCount,  para.niaoNum);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingZhou_tuoguan, para.trustTime);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_jingZhou_jiesuan_difen, para.jieSuanDiFen);
        }
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },

    changePayForPlayerNum:function(select_number){
        this._super(select_number); 
        var chouPaiTitle = this.bg_node.getChildByName("title").getChildByName("choupai");

        chouPaiTitle.setVisible(select_number >= 2);
        for(var i = 0; i < this.chouPaiList.length; i++){
            this.chouPaiList[i].setVisible(select_number >= 2);
        }
    }, 

    changeZhongNiao: function(zhuaNiaoType, zhongNiaoType){
        for(var j = 0; j < this.zhongNiaoNodeList.length; j++){
            var zhuaNiaoTitle = this.bg_node.getChildByName("title").getChildByName("wanfa_0");
            zhuaNiaoTitle.setVisible(zhuaNiaoType != 0)
            this.zhongNiaoNodeList[j].setVisible(zhuaNiaoType != 0);
        }

        for(var i = 0; i < this.zhuaNiaoCountNodeList.length; i++){
            this.zhuaNiaoCountNodeList[i].setVisible( (i < 3 && zhuaNiaoType != 0) || (i >= 3 && zhongNiaoType == 0 && zhuaNiaoType != 0));
        }

        if(zhuaNiaoType != 0){
            if(zhongNiaoType == 1){
                var seleIdx = this._playNode_player_zhuaNiaoCount_radio.getSelectIndex();
                if(seleIdx > 2){
                    seleIdx = 0;
                    this._playNode_player_zhuaNiaoCount_radio.selectItem(seleIdx);
                    this.radioBoxSelectCB(seleIdx, this.zhuaNiaoCountNodeList[seleIdx], this.zhuaNiaoCountNodeList);
                }
            }
        }
    }
});