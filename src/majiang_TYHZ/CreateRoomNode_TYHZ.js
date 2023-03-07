/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_TYHZ = CreateRoomNode.extend({
    setKey:function()
    {
        this.localStorageKey.KEY_TYHZ_niaoTpye                  = "_TYHZ_NIAO_WAY";       //鸟的方式
        this.localStorageKey.KEY_TYHZ_zhuangxianfen             = "_TYHZ_ZHUANG_XIAN_FEN";       //庄闲分
        this.localStorageKey.KEY_TYHZ_dianpaohu                 = "_TYHZ_DIAN_PAO_HU";       //点炮胡
        this.localStorageKey.KEY_TYHZ_qiangganghu               = "_TYHZ_QIANG_GANG_HU";       //抢杠胡
        this.localStorageKey.KEY_TYHZ_qianggangquanbao          = "_TYHZ_QIANG_GANG_QUAN_BAO";       //抢杠全包
        this.localStorageKey.KEY_TYHZ_8hongzhong                = "_TYHZ_8_HONG_ZHONG";       //8红中
        this.localStorageKey.KEY_TYHZ_is7dui                    = "_TYHZ_IS_7_DUI";       //七对可胡
        this.localStorageKey.KEY_TYHZ_youhongzhongbujiepao      = "_TYHZ_HONG_ZHONG_BU_JIE_PAO";       //有红中不接炮
        this.localStorageKey.KEY_TYHZ_wuhongzhongjiabei         = "_TYHZ_WU_HONG_ZHONG_JIA_BEI";       //无红中加倍
        this.localStorageKey.KEY_TYHZ_count  = "CF_TYHZ_COUNT"; //人数
        this.localStorageKey.KEY_TYHZ_bihu 					    = "_TYHZ_BI_HU"; 			// 有胡必胡
        this.localStorageKey.KEY_TYHZ_ziyou                     = "_TYHZ_ZIYOU";            //自由人数
        this.localStorageKey.KEY_TYHZ_wuhongzhong               = "_TYHZ_WU_HONG_ZHONG";     //有红中可抢杠胡（永州）
    },
    setKeyByCardFriend:function()
    {
        this.localStorageKey.KEY_TYHZ_niaoTpye                  = "CF_TYHZ_NIAO_WAY";       //鸟的方式
        this.localStorageKey.KEY_TYHZ_zhuangxianfen             = "CF_TYHZ_ZHUANG_XIAN_FEN";       //庄闲分
        this.localStorageKey.KEY_TYHZ_dianpaohu                 = "CF_TYHZ_DIAN_PAO_HU";       //点炮胡
        this.localStorageKey.KEY_TYHZ_qiangganghu               = "CF_TYHZ_QIANG_GANG_HU";       //抢杠胡
        this.localStorageKey.KEY_TYHZ_qianggangquanbao          = "CF_TYHZ_QIANG_GANG_QUAN_BAO";       //抢杠全包
        this.localStorageKey.KEY_TYHZ_8hongzhong                = "CF_TYHZ_8_HONG_ZHONG";       //8红中
        this.localStorageKey.KEY_TYHZ_is7dui                    = "CF_TYHZ_IS_7_DUI";       //七对可胡
        this.localStorageKey.KEY_TYHZ_youhongzhongbujiepao      = "CF_TYHZ_HONG_ZHONG_BU_JIE_PAO";       //有红中不接炮
        this.localStorageKey.KEY_TYHZ_wuhongzhongjiabei         = "CF_TYHZ_WU_HONG_ZHONG_JIA_BEI";       //无红中加倍
        this.localStorageKey.KEY_TYHZ_bihu 					    = "CF_TYHZ_BI_HU"; 			// 有胡必胡
        //this.localStorageKey.KEY_TYHZ_count  = "_TYHZ_COUNT"; //人数
    },
    initAll:function(IsFriendCard)
    {
        if (IsFriendCard)
            this.setKeyByCardFriend();
        else
            this.setKey();
        


        this.bg_node = ccs.load("bg_TYHZ.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_TYHZ");
        if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP)
        {
            this.bg_node = this.bg_node.getChildByName("view");
        }
    },
    initPlayNode:function()
    {
        var _bgTYHZNode = this.bg_node;

        //莫的类型
        var _play = _bgTYHZNode.getChildByName("play");

        this._playNode_niaoType_1 = _play.getChildByName("zhuaniao1");
        this._playNode_niaoType_2 = _play.getChildByName("zhuaniao2");
        this._playNode_niaoType_3 = _play.getChildByName("zhuaniao3");
        this._playNode_niaoType_4 = _play.getChildByName("zhuaniao4");
        var nodeList1 = [];
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            this._playNode_niaoType_0 = _play.getChildByName("zhuaniao0");
            nodeList1.push(this._playNode_niaoType_0);
        }
        nodeList1.push( _play.getChildByName("zhuaniao1") );
        nodeList1.push( _play.getChildByName("zhuaniao2") );
        nodeList1.push( _play.getChildByName("zhuaniao3") );
        nodeList1.push( _play.getChildByName("zhuaniao4") );

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            this._playNode_niaoType_5 = _play.getChildByName("zhuaniao5");
            if (this._playNode_niaoType_5) {
                nodeList1.push(this._playNode_niaoType_5);
            }
        }
        this._playNode_player_type_radio = createRadioBoxForCheckBoxs(nodeList1,this.radioBoxSelectCB);
        this.addListenerText(nodeList1,this._playNode_player_type_radio);
        this.niaoList = nodeList1;

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            this._playNode_niaoFen_1 = _play.getChildByName("play_niaofen1");
            this._playNode_niaoFen_2 = _play.getChildByName("play_niaofen2");
            var niaoFenList = [];
            niaoFenList.push(this._playNode_niaoFen_1);
            niaoFenList.push(this._playNode_niaoFen_2);
            this._playNode_niaoFen_radio = createRadioBoxForCheckBoxs(niaoFenList, this.radioBoxSelectCB);
            this.addListenerText(niaoFenList, this._playNode_niaoFen_radio);
            this.niaoFenList = niaoFenList;
            this._playNode_niaoFen_1.schedule(function() {
                this._playNode_niaoFen_1.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected());
                this._playNode_niaoFen_2.setVisible(this._playNode_niaoType_2.isSelected() || this._playNode_niaoType_3.isSelected() || this._playNode_niaoType_4.isSelected());

                if((MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()) && (this._playNode_niaoType_1.isSelected() || this._playNode_niaoType_5.isSelected()))
                {
                    this._playNode_niaoFen_1.setVisible(true);
                    this._playNode_niaoFen_2.setVisible(true);
                }
            }.bind(this));
        }
        this._playNode_zhuangxianfen = _play.getChildByName("play_zhuangxianfen");
        this.addListenerText(this._playNode_zhuangxianfen);
        this._playNode_zhuangxianfen.addEventListener(this.clickCB, this._playNode_zhuangxianfen);

        this._playNode_dianpao = _play.getChildByName("play_dianpao");
        this.addListenerText(this._playNode_dianpao);
        this._playNode_dianpao.addEventListener(this.clickCB, this._playNode_dianpao);

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            this._playNode_qiangganghu = _play.getChildByName("play_qiangganghu");
            this.addListenerText(this._playNode_qiangganghu);
            this._playNode_qiangganghu.addEventListener(this.clickCB, this._playNode_qiangganghu);
        }

        this._playNode_qianggangquanbao = _play.getChildByName("play_qianggangquanbao");
        this.addListenerText(this._playNode_qianggangquanbao);
        this._playNode_qianggangquanbao.addEventListener(this.clickCB, this._playNode_qianggangquanbao);

        this._playNode_hongzhong8 = _play.getChildByName("play_hongzhong8");
        this.addListenerText(this._playNode_hongzhong8);
        this._playNode_hongzhong8.addEventListener(this.clickCB, this._playNode_hongzhong8);

        this._playNode_qidui = _play.getChildByName("play_qidui");
        this.addListenerText(this._playNode_qidui);
        this._playNode_qidui.addEventListener(this.clickCB, this._playNode_qidui);

        this._playNode_youhongzhongbujiepao = _play.getChildByName("play_youhongzhongbujiepao");
        this.addListenerText(this._playNode_youhongzhongbujiepao);
        this._playNode_youhongzhongbujiepao.addEventListener(this.clickCB, this._playNode_youhongzhongbujiepao);

        this._playNode_wuhongzhongjiabei = _play.getChildByName("play_wuhongzhongjiabei");
        this.addListenerText(this._playNode_wuhongzhongjiabei);
        this._playNode_wuhongzhongjiabei.addEventListener(this.clickCB, this._playNode_wuhongzhongjiabei);

        //有胡必胡
        this._playNode_biHuType = _play.getChildByName("play_bihu");
        if(!this._playNode_biHuType)
        {
            return MjClient.showToast("请添加，有胡必胡的开房选项UI")
        }
        this.addListenerText(this._playNode_biHuType);
        this._playNode_biHuType.addEventListener(this.clickCB, this._playNode_biHuType);
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            this._playNode_Count_0 = _play.getChildByName("playerCount_0");
            this._playNode_Count_1 = _play.getChildByName("playerCount_1");
            this._playNode_Count_2 = _play.getChildByName("playerCount_2");
            this._playNode_Count_3 = _play.getChildByName("playerCount_3");

            var nodeListCount = [];
            nodeListCount.push( _play.getChildByName("playerCount_0"));
            nodeListCount.push( _play.getChildByName("playerCount_1"));
            nodeListCount.push( _play.getChildByName("playerCount_2"));
            if(this._playNode_Count_3){
                nodeListCount.push( _play.getChildByName("playerCount_3"));
            }
            this._playNode_playerCount_radio = createRadioBoxForCheckBoxs(nodeListCount, this._radioBoxSelectCB.bind(this));
            this.addListenerText(nodeListCount, this._playNode_playerCount_radio,this.changeAAPayForPlayerNum.bind(this));

            var list = [];
            list.push(_play.getChildByName("play_qiangganghuWu"));
            list.push(_play.getChildByName("play_qiangganghu"));
            list.push(_play.getChildByName("play_qianggangdianpao"));
            var qiangGangCallBack = function(index, sender, list){
                this.radioBoxSelectCB(index, sender, list);
                this._playNode_qianggangquanbao.setVisible(false);
                this._playNode_wuHongZhong.setVisible(false);
                if(index == 1){
                    this._playNode_qianggangquanbao.setVisible(true);
                }
                if(index != 0){
                    this._playNode_wuHongZhong.setVisible(true);
                }
            }.bind(this);
            this._playNode_qiangganghu = createRadioBoxForCheckBoxs(list,qiangGangCallBack);
            var textCallBack = function(index){
                qiangGangCallBack(index, list[index], list);
            };
            this.addListenerText(list, this._playNode_qiangganghu,textCallBack.bind(this));

            //有红中可抢杠胡
            this._playNode_wuHongZhong = _play.getChildByName("play_wuhongzhong");
            this._playNode_wuHongZhong.getChildByName("text").setString("有红中可抢杠胡");
            this.addListenerText(this._playNode_wuHongZhong);
            this._playNode_wuHongZhong.addEventListener(this.clickCB, this._playNode_wuHongZhong);
        }

    },
    setPlayNodeCurrentSelect:function(isClub)
    {
        var _niaoType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_niaoTpye,1);
        if(this._playNode_niaoType_0){
            this._playNode_niaoType_0.setSelected(false);
        }
        this._playNode_niaoType_1.setSelected(false);
        this._playNode_niaoType_2.setSelected(false);
        this._playNode_niaoType_3.setSelected(false);
        this._playNode_niaoType_4.setSelected(false);
        if(this._playNode_niaoType_5){
            this._playNode_niaoType_5.setSelected(false);
        }
        var index = 0;
        var offset = MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP ? 1 : 0;
        if(_niaoType == 0 && this._playNode_niaoType_0)
        {
            this._playNode_niaoType_0.setSelected(true);
            index = 0;
        }
        else if(_niaoType == 1)
        {
            this._playNode_niaoType_1.setSelected(true);
            index = 0 + offset;
        }
        else if(_niaoType == 2)
        {
            this._playNode_niaoType_2.setSelected(true);
            index = 1 + offset;
        }
        else if(_niaoType == 4)
        {
            this._playNode_niaoType_3.setSelected(true);
            index = 2 + offset;
        }
        else if(_niaoType == 6)
        {
            this._playNode_niaoType_4.setSelected(true);
            index = 3 + offset;
        }
        else if(_niaoType == 8 && this._playNode_niaoType_5){
            this._playNode_niaoType_5.setSelected(true);
            index = 5;
        }
        this.radioBoxSelectCB(index,this.niaoList[index],this.niaoList);

        this._zhuangxianfen = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_zhuangxianfen,true);
        this._playNode_zhuangxianfen.setSelected(this._zhuangxianfen);
        var text = this._playNode_zhuangxianfen.getChildByName("text");
        this.selectedCB(text,this._zhuangxianfen)

        this._dianpao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_dianpaohu,true);
        this._playNode_dianpao.setSelected(this._dianpao);
        var text = this._playNode_dianpao.getChildByName("text");
        this.selectedCB(text,this._dianpao)

        if (MjClient.getAppType() != MjClient.APP_TYPE.QXYZQP) {
            this._qiangganghu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_qiangganghu,true);
            this._playNode_qiangganghu.setSelected(this._qiangganghu);
            var text = this._playNode_qiangganghu.getChildByName("text");
            this.selectedCB(text,this._qiangganghu)
        }

        this._qianggangquanbao= util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_qianggangquanbao,true);
        this._playNode_qianggangquanbao.setSelected(this._qianggangquanbao);
        var text = this._playNode_qianggangquanbao.getChildByName("text");
        this.selectedCB(text,this._qianggangquanbao)

        this._8hongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_8hongzhong,true);
        this._playNode_hongzhong8.setSelected(this._8hongzhong);
        var text = this._playNode_hongzhong8.getChildByName("text");
        this.selectedCB(text,this._8hongzhong)

        this._is7dui = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_is7dui,true);
        this._playNode_qidui.setSelected(this._is7dui);
        var text = this._playNode_qidui.getChildByName("text");
        this.selectedCB(text,this._is7dui)

        this._hongzhongbujiepao = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_youhongzhongbujiepao,true);
        this._playNode_youhongzhongbujiepao.setSelected(this._hongzhongbujiepao);
        var text = this._playNode_youhongzhongbujiepao.getChildByName("text");
        this.selectedCB(text,this._hongzhongbujiepao)

        this._wuhongzhongjiabei = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhongjiabei,true);
        this._playNode_wuhongzhongjiabei.setSelected(this._wuhongzhongjiabei);
        var text = this._playNode_wuhongzhongjiabei.getChildByName("text");
        this.selectedCB(text,this._wuhongzhongjiabei)


        // // 有胡必胡
        var _youhubihu = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_bihu,true);
        this._playNode_biHuType.setSelected(_youhubihu);
        var text = this._playNode_biHuType.getChildByName("text");
        this.selectedCB(text,_youhubihu)


        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            var listCount = [];
            listCount.push(this._playNode_Count_0);
            listCount.push(this._playNode_Count_1);
            listCount.push(this._playNode_Count_2);
            if(this._playNode_Count_3){
                listCount.push(this._playNode_Count_3);
            }
            var indexCount = 0;
            var _Count;
            if(isClub){
                var count = this.getNumberItem("maxPlayer", 4);
                _Count = count == 4 ? 0 : count == 3 ? 1 : 2;
                if (this.getBoolItem("convertible", false)){
                    _Count = 3;
                }
            }else{
                var ziyou = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_ziyou,false);
                if(ziyou){
                    _Count = 3;
                }else{
                    _Count = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_TYHZ_count,0);
                }
            }

            this._playNode_Count_0.setSelected(false);
            this._playNode_Count_1.setSelected(false);
            this._playNode_Count_2.setSelected(false);
            if(this._playNode_Count_3){
                this._playNode_Count_3.setSelected(false);
            }
            if(_Count == 3 && this._playNode_Count_3){
                this._playNode_Count_3.setSelected(true);
                indexCount = 3;
            }
            else if(_Count == 0)
            {
                this._playNode_Count_0.setSelected(true);
                indexCount = 0;
            }
            else if(_Count == 1)
            {
                this._playNode_Count_1.setSelected(true);
                indexCount = 1;
            }
            else if(_Count == 2)
            {
                this._playNode_Count_2.setSelected(true);
                indexCount = 2;
            }
            this.radioBoxSelectCB(indexCount,listCount[indexCount],listCount);

            var qianggang;
            if (isClub) {
                qianggang = this.getNumberItem("qianggang", 1);
            }else{
                qianggang = util.localStorageEncrypt.getStringItem(this.localStorageKey.KEY_TYHZ_qiangganghu, "1");
                if (qianggang == "true")
                    qianggang = 1;
                else if (qianggang == "false")
                    qianggang = 0;
                else if (cc.isNumber(Number(qianggang)))
                    qianggang = Number(qianggang);
                else
                    qianggang = 1;
            }
            this._playNode_qiangganghu.selectItem(qianggang);
            var _play = this.bg_node.getChildByName("play");
            var list = [];
            list.push(_play.getChildByName("play_qiangganghuWu"));
            list.push(_play.getChildByName("play_qiangganghu"));
            list.push(_play.getChildByName("play_qianggangdianpao"));
            this.radioBoxSelectCB(this._playNode_qiangganghu,list[qianggang],list);

            //有红中可抢杠胡
            var _wuhongzhong;
            if(isClub){
                _wuhongzhong = this.getBoolItem("wuhongzhong",true);
            }else{
                _wuhongzhong = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhong, true);
            }
            this._playNode_wuHongZhong.setSelected(_wuhongzhong);
            var text = this._playNode_wuHongZhong.getChildByName("text");
            this._setItemTextColor(this._playNode_wuHongZhong, _wuhongzhong);
            this._playNode_wuHongZhong.setVisible(qianggang != 0);
        }
    },
    getSelectedPara:function()
    {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.TY_HONGZHONG;
        para.maxPlayer = 4;
        para.flowerType = WithFlowerType.noFlower;
        para.zhuaniao = 1;//抓鸟
        para.zhuangxianfen = true;//闲庄分
        para.dianpao = true;//点炮胡
        para.qianggang = true;//抢杠胡
        para.qianggangquanbao = true;//抢杠全包
        para.hongzhong8 = true;//8红中
        para.qidui = true;//七对可胡
        para.youhongzhongbujiepao = true;//有红中不接炮
        para.wuhongzhongjiabei = true;//无红中加倍
        para.bihuType = false;//有胡必胡

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            para.wuhongzhong = this._playNode_wuHongZhong.isSelected(); //有红中可抢杠胡
        }
        if (this._playNode_niaoType_0 && this._playNode_niaoType_0.isSelected())
        {
            para.zhuaniao = 0;
        }
        else if (this._playNode_niaoType_1.isSelected())
        {
            para.zhuaniao = 1;
        }
        else if (this._playNode_niaoType_2.isSelected())
        {
            para.zhuaniao = 2;
        }
        else if (this._playNode_niaoType_3.isSelected())
        {
            para.zhuaniao = 4;
        }
        else if (this._playNode_niaoType_4.isSelected())
        {
            para.zhuaniao = 6;
        }
        else if(this._playNode_niaoType_5 && this._playNode_niaoType_5.isSelected()){
            para.zhuaniao = 8;
        }
        util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_niaoTpye,para.zhuaniao);

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            // 中鸟得分
            var niaofenIndex = this._playNode_niaoFen_radio.getSelectIndex();
            para.niaofen = niaofenIndex + 1;
            if((para.zhuaniao == 1 || para.zhuaniao == 8)) para.niaofen = 1;
        }
        para.zhuangxianfen = this._playNode_zhuangxianfen.isSelected();
        para.dianpao = this._playNode_dianpao.isSelected();//点炮胡
        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            para.qianggang = this._playNode_qiangganghu.getSelectIndex();//抢杠胡
        } else {
            para.qianggang = this._playNode_qiangganghu.isSelected();//抢杠胡
        }
        para.qianggangquanbao = this._playNode_qianggangquanbao.isSelected();//抢杠全包
        para.hongzhong8 = this._playNode_hongzhong8.isSelected();//8红中
        para.qidui = this._playNode_qidui.isSelected();//七对可胡
        para.youhongzhongbujiepao = this._playNode_youhongzhongbujiepao.isSelected();//有红中不接炮
        para.wuhongzhongjiabei = this._playNode_wuhongzhongjiabei.isSelected();//无红中加倍
        para.bihuType = this._playNode_biHuType.isSelected();//有胡必胡

        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_zhuangxianfen,para.zhuangxianfen);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_dianpaohu,para.dianpao);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_qiangganghu,para.qianggang);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_qianggangquanbao,para.qianggangquanbao);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_8hongzhong,para.hongzhong8);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_is7dui,para.qidui);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_youhongzhongbujiepao,para.youhongzhongbujiepao);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhongjiabei,para.wuhongzhongjiabei);
        util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_bihu,para.bihuType);

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_wuhongzhong,para.wuhongzhong);
        }

        if (MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP) {
            var _index = 0;
            if(this._playNode_Count_3 && this._playNode_Count_3.isSelected()){
                para.maxPlayer = 4;
                _index = 3;
            }
            else if (this._playNode_Count_0.isSelected())
            {
                para.maxPlayer = 4;
                _index = 0;
            }
            else if (this._playNode_Count_1.isSelected())
            {
                para.maxPlayer = 3;
                _index = 1;
            }
            else if (this._playNode_Count_2.isSelected())
            {
                para.maxPlayer = 2;
                _index = 2;
            }

            if(this._playNode_Count_3){
                para.convertible = this._playNode_Count_3.isSelected(); // 自由人数
            }
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_TYHZ_count,_index);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_TYHZ_ziyou,para.convertible);
        }

        // //人数
        // var _countIdx = 0;
        // if (this._playNode_maxPlayer0.isSelected()) {
        //     para.maxPlayer = 4;
        //     _countIdx = 0;
        // }
        // else if (this._playNode_maxPlayer1.isSelected()) {
        //     para.maxPlayer = 3;
        //     _countIdx = 1;
        // }
        // else if (this._playNode_maxPlayer2.isSelected()) {
        //     para.maxPlayer = 2;
        //     _countIdx = 2;
        // }
        // util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_LYG_count, _countIdx)
        cc.log("createara: " + JSON.stringify(para));
        return para;
    },
    _radioBoxSelectCB : function(index,sender, list){
        this.radioBoxSelectCB(index,sender, list);
        this.changeAAPayForPlayerNum();
    },
    changeAAPayForPlayerNum:function()
    {
        this.setDiaNumData(this.bg_node, this.roundNumObj, this.fangzhuPay, this.AAPay, this.clubPay);
        this.setDiaNumData_tyzz();
    },

    setDiaNumData:function(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay)
    {
        this._super(gameNode, roundNumObj,fangzhuPay,AAPay,clubPay);

        this.setDiaNumData_tyzz();
    },

    updateSelectDiaNum: function() {  // 更新选定选项的建房消耗元宝
        this._super();
        this.setDiaNumData_tyzz();
    },

    setDiaNumData_tyzz : function(){
        var round = this.bg_node.getChildByName("round");
        var roomPay = round.getChildByName("payWay_1").getChildByName("text");
        var aaPay = round.getChildByName("payWay_2").getChildByName("text");
        roomPay.ignoreContentAdaptWithSize(true);
        aaPay.ignoreContentAdaptWithSize(true);

    },
    _setItemTextColor : function(item,flg){
        if(item){
            var txt = item.getChildByName("text");
            var selectColor = cc.color(237,101,1);
            var unSelectColor = cc.color(158,118,78);
            if(MjClient.getAppType() == MjClient.APP_TYPE.QXYZQP || MjClient.getAppType() == MjClient.APP_TYPE.BDYZPHZ){
                selectColor = cc.color(208,88,60);
                unSelectColor = cc.color(72,94,112);
            }
            if(MjClient.getAppType() == MjClient.APP_TYPE.HUNANWANGWANG || MjClient.APP_TYPE.QXSYDTZ == MjClient.getAppType()){
                selectColor = cc.color(211,38,14);
                unSelectColor = cc.color(68,51,51);
            }
            if(flg){
                txt.setTextColor(selectColor);
            }else{
                txt.setTextColor(unSelectColor);
            }
        }
    },
});