/**
 * Created by Administrator on 2018-10-09.
 */
var PokerWaitNode_RuanJiangQianFen = cc.Node.extend({
    node: null,
    btnTagList:{btn_wxinvite:1,btn_clubinvite:2,btn_cpRoomNum:3,btn_backHome:4,btn_delroom:5,btn_backhall:6},
    ctor: function() {
        this._super();
        var  csbNode = ccs.load("RuanJiangQianfen_WaitNode.json");
        this.node=csbNode.node;
        this.loadButton();
        this.initClickEvent();
    },
    loadButton:function() {

        var btn_clubinvite = this.node.getChildByName("btn_clubinvite");
        btn_clubinvite.visible = (getClubInfoInTable() && !MjClient.remoteCfg.guestLogin);

        var btn_wxinvite = this.node.getChildByName("btn_wxinvite");
        btn_wxinvite.visible = !MjClient.remoteCfg.guestLogin;

        var btn_backHome = this.node.getChildByName("btn_backHome");
        btn_backHome.visible = true;

        var btn_delroom = this.node.getChildByName("btn_delroom");
        btn_delroom.visible = true;

        //俱乐部返回大厅功能
        var btn_backhall = this.node.getChildByName("btn_backhall");
        btn_backhall.visible = (getClubInfoInTable() && !MjClient.remoteCfg.guestLogin);

        setWgtLayout(btn_wxinvite, [0.18, 0.18],[0.81,0.30],[0, 0]);
        setWgtLayout(btn_clubinvite, [0.18, 0.18],[0.81,0.16],[0, 0]);
        setWgtLayout(btn_backhall, [0.11, 0.11], [isIPhoneX() ? 0.10 : 0.05, 0.65], [0, 0]);
        setWgtLayout(btn_backHome, [0.11, 0.11],[isIPhoneX()?0.10:0.05, 0.50],[0, 0]);
        setWgtLayout(btn_delroom, [0.11, 0.11],[isIPhoneX()?0.10:0.05, 0.35],[0, 0]);
    },
    btnEventListener:function(sender,type) {
        var tag = sender.getTag();
        if(tag == this.btnTagList.btn_clubinvite) {
            var tData = MjClient.data.sData.tData;
            var clubInfoTable = getClubInfoInTable();
            MjClient.Scene.addChild(new FriendCard_yaoqingMember(clubInfoTable.clubId, tData.tableid, unescape(clubInfoTable.clubTitle)));
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingpaiyou", {uid:SelfUid(), gameType:MjClient.gameType});

        } else if(tag == this.btnTagList.btn_wxinvite || tag == this.btnTagList.btn_cpRoomNum) {
            var num = tag == this.btnTagList.btn_cpRoomNum ? 1 : 2;
            getPlayingRoomInfo(num);
            MjClient.native.umengEvent4CountWithProperty("Fangjiannei_Yaoqingweixinhaoyou", {uid:SelfUid(), gameType:MjClient.gameType});

        } else if(tag == this.btnTagList.btn_backHome) {
            showTipsAndLeaveGame();
        } else if(tag == this.btnTagList.btn_delroom) {
            MjClient.delRoom(true);
        }else if (tag == this.btnTagList.btn_backhall) {
            onClickBackHallBtn();
        }
    },
    btnBindCallBack:function(parent, str, tag, callback) {
        var tmpNode = parent.getChildByName(str);
        tmpNode.tag = tag;
        tmpNode.addTouchEventListener(callback);
    },
    initClickEvent:function(){
        var btnCallback = function(sender,type) {
            if(type == ccui.Widget.TOUCH_ENDED) {
                this.btnEventListener(sender,type);
            }
        }
        var btnList = ["btn_wxinvite","btn_backHome","btn_delroom","btn_clubinvite", "btn_backhall"];
        for(var i = 0;i < btnList.length;i++) {
            this.btnBindCallBack(this.node,btnList[i],this.btnTagList[btnList[i]],btnCallback.bind(this));
        }
    },
    setVisible:function(bVisible){
        this.node.visible = bVisible;
    }
});
