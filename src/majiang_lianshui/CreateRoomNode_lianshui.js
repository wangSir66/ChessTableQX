/**
 * Created by maoyu on 2017/7/21.
 */


var CreateRoomNode_lianshui = CreateRoomNode.extend({
    initAll: function(IsFriendCard) {
        if (!IsFriendCard) {
            this.localStorageKey.KEY_lianshui_zhuangType    = "_LIAN_SHUI_BAO_ZHUANG";          //包庄
            this.localStorageKey.KEY_lianshui_zhuangTing    = "_LIAN_SHUI_BAO_ZHUANG_TING";     //打包庄，是否听
            this.localStorageKey.KEY_lianshui_count         = "_LIAN_SHUI_count";               //count
            this.localStorageKey.KEY_lianshui_difen         = "_LIAN_SHUI_DI_FEN";              // 底分
        }

        this.bg_node = ccs.load("bg_lianshui.json").node;
        this.addChild(this.bg_node);
        this.bg_node = this.bg_node.getChildByName("bg_lianshui");
    },
    initPlayNode: function() {
        var _bgHuaianNode = this.bg_node;
        //花
        var _play = _bgHuaianNode.getChildByName("play");
        //大包庄，是否可听
        this._playNode_zhuangTing = _play.getChildByName("dabaozhuang_ting");
        this.addListenerText(this._playNode_zhuangTing);
        this._playNode_zhuangTing.addEventListener(this.clickCB, this._playNode_zhuangTing);
        this._playNode_zhuangType_1 = _play.getChildByName("xiaobaozhuang");
        this._playNode_zhuangType_2 = _play.getChildByName("dabaozhuang");
        var nodeList1 = [];
        nodeList1.push(_play.getChildByName("xiaobaozhuang"));
        nodeList1.push(_play.getChildByName("dabaozhuang"));
        this.baoList = nodeList1;
        this._playNode_flower_radio = createRadioBoxForCheckBoxs(nodeList1, this.radioBoxSelectCB);
        this.addListenerText(nodeList1, this._playNode_flower_radio);
        var that = this;

        this._playNode_zhuangType_1.schedule(function() {
            that._playNode_zhuangTing.visible = that._playNode_zhuangType_2.isSelected() == true ? true : false;
        })


        // 人数
        var playNumList = [];
        playNumList.push( _play.getChildByName("play_count0") );
        playNumList.push( _play.getChildByName("play_count1") );
        playNumList.push( _play.getChildByName("play_count2") );
        playNumList.push( _play.getChildByName("play_count3") );
        this.initPlayNumNode(playNumList, [4, 3, 2, 4]);   // playNumList[选项1， 选项2， 选项x3 ] 对应 [4人， 3人, 2人]
        this._playNum_radio = createRadioBoxForCheckBoxs(playNumList, function(index){
            this.changePayForPlayerNum(index);
            this.radioBoxSelectCB(index, playNumList[index], playNumList);
        }.bind(this));
        this.addListenerText(playNumList, this._playNum_radio, this.changePayForPlayerNum.bind(this));
        this._playNumList = playNumList;

        //底分
        this._zhuIdx = 1;
        var difenNode = _bgHuaianNode.getChildByName("difen");
        this._ZhuNum = difenNode.getChildByName("txt_fen");
        if (this._ZhuNum) {
            this._ZhuNum.setString(this._zhuIdx);
            this._Button_sub = difenNode.getChildByName("btn_sub");
            this._Button_sub.addTouchEventListener(function(sender, type) {
                if (type == 2) {
                    if (this._zhuIdx == 0) {
                        this._zhuIdx = 11;
                    }
                    if (this._zhuIdx > 0) {
                        this._zhuIdx--;
                        this.setDiFen();
                        this._Button_add.setTouchEnabled(true);
                        this._Button_add.setBright(true);
                    }
                }
            }, this);
            this._Button_add = difenNode.getChildByName("btn_add");
            this._Button_add.addTouchEventListener(function(sender, type) {
                if (type == 2) {

                    if (this._zhuIdx == 10) {
                        this._zhuIdx = -1;
                    }
                    if (this._zhuIdx < 10) {
                        this._zhuIdx++;
                        this.setDiFen();
                        this._Button_sub.setTouchEnabled(true);
                        this._Button_sub.setBright(true);
                    }
                }
            }, this);
        }

    },
    setDiFen: function () {
        this._ZhuNum.setString([0.5,1,2,3,4,5,6,7,8,9,10][Math.floor(this._zhuIdx)] + "");
        this.setRoomCardModeFree();
    },
    setPlayNodeCurrentSelect: function(isClub) {
        var _zhuangType;
        if (isClub)
            _zhuangType = this.getNumberItem("baoZhuangType", 0);
        else
            _zhuangType = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lianshui_zhuangType, 0);
        this._playNode_zhuangType_1.setSelected(_zhuangType != 1);
        this._playNode_zhuangType_2.setSelected(_zhuangType == 1);
        var index = _zhuangType == 1 ? 1:0;
        this.radioBoxSelectCB(index,this.baoList[index],this.baoList);

        var _zhuangTing;
        if (isClub)
            _zhuangTing = this.getBoolItem("zhuangTing", false);
        else
            _zhuangTing = util.localStorageEncrypt.getBoolItem(this.localStorageKey.KEY_lianshui_zhuangTing, false);
        this._playNode_zhuangTing.setSelected(_zhuangTing);
        var text = this._playNode_zhuangTing.getChildByName("text");
        this.selectedCB(text, _zhuangTing)

        //人数
        var _playnumIndex;
        if (isClub)
            if (this.getBoolItem("convertible", false))
                _playnumIndex = 3;
            else
                _playnumIndex = [4, 3, 2].indexOf(this.getNumberItem("maxPlayer", 4));
        else
            _playnumIndex = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lianshui_count, 0);
        this._playNum_radio.selectItem(_playnumIndex);
        var text = this._playNum_radio.getSelectItem().getChildByName("text");
        this.selectedCB(text, _playnumIndex);

        //底分
        if (isClub)
            this._zhuIdx = this.getNumberItem("difen", 1);
        else
            this._zhuIdx = util.localStorageEncrypt.getNumberItem(this.localStorageKey.KEY_lianshui_difen, 1);
        if (this._ZhuNum)
            this.setDiFen();


        this.changePayForPlayerNum();
    },
    getSelectedPara: function() {
        var para = {};
        para.gameType = MjClient.GAME_TYPE.LIAN_SHUI;
        para.maxPlayer = 4;
        para.flowerType = WithFlowerType.commonFlower;
        para.baoZhuangType = 0;
        para.zhuangTing = false;
        //包庄类型
        para.baoZhuangType = this._playNode_zhuangType_1.isSelected() == true ? 0 : 1;
        para.zhuangTing = this._playNode_zhuangTing.isSelected();

        // 人数
        var indexToNum = {0:4, 1:3, 2:2, 3:4};
        var _playnumIndex = this._playNum_radio.getSelectIndex();
        para.maxPlayer = indexToNum[_playnumIndex];
        para.convertible = false;
        if (_playnumIndex == 3) 
        {
            para.convertible = true;
        }

        para.difen = Number(this._ZhuNum.getString());// 底分

        if (!this._isFriendCard) {
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lianshui_zhuangType, para.baoZhuangType);
            util.localStorageEncrypt.setBoolItem(this.localStorageKey.KEY_lianshui_zhuangTing, para.zhuangTing);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lianshui_count, _playnumIndex);
            util.localStorageEncrypt.setNumberItem(this.localStorageKey.KEY_lianshui_difen, this._zhuIdx);
        }

        cc.log("createara: " + JSON.stringify(para));
        return para;
    }
});