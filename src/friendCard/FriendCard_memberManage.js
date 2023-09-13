/**亲友圈-成员操作界面 */
var MemberManage = cc.Layer.extend({
    ctor: function () {
        this._super();
        var node = ccs.load(res.Friendcard_member_manage_json).node;
        this.addChild(node);
        this.node = node;
        this.memberManage = node.getChildByName("Image_bg");
        this.block = node.getChildByName("block");
        setWgtLayout(this.block, [1, 1], [0.5, 0.5], [0, 0], true);
        setWgtLayout(this.memberManage, [0.8, 0.8], [0.5, 0.5], [0, 0]);

        var close = this.memberManage.getChildByName("close");
        close.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                this.visible = false;
                MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Chengyuan_Chengyuanliebiao_Caozuo_Close", { uid: SelfUid() });
            }
        }, this);
        this.memberManage.getChildByName('title').ignoreContentAdaptWithSize(true);
        MjClient.MemberManage = this;
        this.initBtns();
        return true;
    },
    showView: function (clubInfo, itemData, openType, curUserGrp, showingIndex, index, callBack) {
        this.resetView(clubInfo, itemData, openType, curUserGrp, showingIndex, index, callBack);
        popupAnm(this.memberManage);
        this.visible = true;
    },
    //重置界面
    resetView: function (clubInfo, itemData, openType, curUserGrp, showingIndex, index, callBack) {
        let isGroupLeader = FriendCard_Common.isGroupLeader(clubInfo, itemData.userId),
            isAssistant = FriendCard_Common.isAssistants(clubInfo, itemData.userId),
            optIsLeader = FriendCard_Common.isLeader(this.clubInfo),
            optIsManager = FriendCard_Common.isManager(this.clubInfo),
            optIsGroupLeader = FriendCard_Common.isGroupLeader(clubInfo),
            optIsAssistants = FriendCard_Common.isAssistants(clubInfo),
            _roleId = optIsAssistants ? 4 : (optIsGroupLeader ? 2 : (optIsLeader ? 3 : (optIsManager ? 1 : 0)));
        this.closeBtns();
        var isUnAdmit = 0;
        if (openType == "member_member") {
            isUnAdmit = (itemData.userStatus & 2) || (itemData.userStatus & 32);
            if (!isAssistant && !isGroupLeader) this.Button_tichu.visible = true;
            else {
                if ((optIsLeader || (optIsGroupLeader && itemData.group == curUserGrp)) && itemData.userId != MjClient.data.pinfo.uid)
                    this.Button_tichu.visible = true;
            }
            this.Button_Xinyu.visible = showingIndex == 0 ? (optIsLeader || optIsGroupLeader) : (optIsLeader && !!isGroupLeader);
        } else if (openType == "member_group") {
            isUnAdmit = itemData.userStatus & 8;
            this.button_checkCY.visible = true;
            if (optIsLeader) {
                this.button_tickAll.visible = true;
                this.Button_Xinyu.visible = !!isGroupLeader;
                this.Button_chouchengbili.visible = !!isGroupLeader;
            } else {
                this.Button_tichu.visible = true;
            }
        } else if (openType == "member_zhuli") {
            isUnAdmit = itemData.userStatus & 16;
            if (optIsGroupLeader) {
                this.button_tickAll.visible = true;
            } else {
                this.Button_tichu.visible = true;
            }
        }
        // 踢出
        this.Button_tichu.visible = (optIsLeader || (optIsManager && itemData.position == 0)) && itemData.userId != MjClient.data.pinfo.uid;
        // 设为管理
        this.Button_mamager.visible = optIsLeader && itemData.userId != MjClient.data.pinfo.uid && itemData.position == 0;
        // 撤销管理
        this.Button_unMamager.visible = optIsLeader && itemData.userId != MjClient.data.pinfo.uid && itemData.position == 2;
        // 是否进房UI显示
        this.Button_unAdmit.visible = !isUnAdmit;
        this.Button_admit.visible = !!isUnAdmit;
        this.button_group.visible = optIsManager && !isGroupLeader;
        //组长
        this.Button_remarks.visible = true;
        if (optIsGroupLeader) {
            this.Button_zhuli.visible = (curUserGrp && itemData.group == curUserGrp && !(itemData.roleId == 4));
            this.Button_unZhuli.visible = (curUserGrp && itemData.group == curUserGrp && (itemData.roleId == 4));
        } else if (optIsAssistants) {
        } else {
            this.Button_groupMag.visible = !isGroupLeader
            if (FriendCard_Common.isLeader()) this.Button_unGroupMag.visible = isGroupLeader;
        }
        this.button_frozen.visible = ((itemData.roleId == 2 && _roleId == 3) ||
            (itemData.roleId == 4 && _roleId == 2)) &&
            (!itemData.isFrozen);
        this.button_unfrozen.visible = ((itemData.roleId == 2 && _roleId == 3) ||
            (itemData.roleId == 4 && _roleId == 2)) &&
            (itemData.isFrozen);
        //添加到其他亲友圈 如果是管理
        this.Button_AddOtherClub.visible = (optIsLeader && itemData.userId != MjClient.data.pinfo.uid) && !(optIsGroupLeader && itemData.userId != MjClient.data.pinfo.uid);
        var buttonList = [
            this.button_checkCY,
            this.Button_groupMag, this.Button_unGroupMag, this.Button_mamager,
            this.Button_unMamager, this.button_group, this.Button_remarks,
            this.Button_admit, this.Button_unAdmit, this.Button_AddOtherClub,
            this.Button_zhuli, this.Button_unZhuli, this.Button_tichu,
            this.button_frozen, this.button_unfrozen, this.button_tickAll, this.Button_Xinyu,
            this.Button_chouchengbili
        ];
        //查看成员
        if (openType === "member_group") {
            var keepStatusBtn = [
                this.button_checkCY, this.button_tickAll
            ]
            if (itemData.roleId != 2 && itemData.roleId != 3) {
                for (var i = 0; i < buttonList.length; i++) {
                    if (keepStatusBtn.indexOf(buttonList[i]) < 0) {
                        buttonList[i].visible = false;
                    }
                }
            }
        }
        var visibleList = [];
        for (var i = 0; i < buttonList.length; i++) {
            if (buttonList[i] && buttonList[i].visible) {
                visibleList.push(buttonList[i]);
            }
        }


        for (var i = 0; i < visibleList.length; i++) {
            if (i < this.postionList.length) {
                visibleList[i].setPosition(this.postionList[i]);
            }
        }

        this.Button_unAdmit.data = itemData;
        if (openType != "member_member") {
            if (FriendCard_Common.getSkinType() == 4) {
                this.Button_unAdmit.setTitleText("全员禁玩");
            } else {
                this.Button_unAdmit.loadTextureNormal("friendCards/memberManage/btn_notAdmit2_n.png");
                this.Button_unAdmit.loadTexturePressed("friendCards/memberManage/btn_notAdmit2_s.png");
            }
        } else {
            if (FriendCard_Common.getSkinType() == 4) {
                this.Button_unAdmit.setTitleText("禁止进房");
            } else {
                this.Button_unAdmit.loadTextureNormal("friendCards/memberManage/btn_notAdmit_n.png");
                this.Button_unAdmit.loadTexturePressed("friendCards/memberManage/btn_notAdmit_s.png");
            }

        }
        this.callBack = callBack;
        this.itemData = itemData;
        this.openType = openType;
        this.index = index;
    },
    //隐藏所有按钮
    closeBtns: function () {
        this.button_tickAll.visible = false;
        this.Button_Xinyu.visible = false;
        this.Button_chouchengbili.visible = false;
    },
    //初始化按钮
    initBtns: function () {
        this.Button_mamager = this.memberManage.getChildByName("Button_mamager");
        this.Button_unMamager = this.memberManage.getChildByName("Button_unMamager");
        this.Button_tichu = this.memberManage.getChildByName("Button_tichu");
        this.Button_admit = this.memberManage.getChildByName("Button_admit");
        this.Button_AddOtherClub = this.memberManage.getChildByName("Button_AddOtherClub");
        this.Button_unAdmit = this.memberManage.getChildByName("Button_unAdmit");
        this.Button_remarks = this.memberManage.getChildByName("Button_remarks"); //备注
        this.Button_groupMag = this.memberManage.getChildByName("Button_groupMag");//设置组长
        this.Button_unGroupMag = this.memberManage.getChildByName("Button_unGroupMag");//取消组长
        this.Button_zhuli = this.memberManage.getChildByName("Button_zhuli");//设置助理
        this.Button_unZhuli = this.memberManage.getChildByName("Button_unZhuli");//撤销助理
        this.button_frozen = this.memberManage.getChildByName("Button_frozen");
        this.button_unfrozen = this.memberManage.getChildByName("Button_unfrozen");
        this.button_checkCY = this.memberManage.getChildByName("Button_checkCY");//查看成员
        this.Button_Xinyu = this.memberManage.getChildByName("Button_Xinyu");//信誉
        this.Button_chouchengbili = this.memberManage.getChildByName("Button_chouchengbili");//抽成比例
        this.button_group = this.memberManage.getChildByName("Button_group");//增加玩家分组

        //下面是动态添加的按钮
        this.button_tickAll = this.memberManage.getChildByName("Button_tickAll");//踢出全部人
        if (!this.button_tickAll) {
            this.button_tickAll = FriendCard_Common.createCommonBtn({ resArr: ["A_FriendCard/Member/btn_tick_all_n.png", "A_FriendCard/Member/btn_tick_all_s.png", "A_FriendCard/Member/btn_tick_all_s.png"], type: 1 });
            this.button_tickAll.setName("Button_tickAll");
            this.memberManage.addChild(this.button_tickAll);
        }
        //调整位置
        if (!this.postionList) {
            this.postionList = [
                this.Button_groupMag.getPosition(), this.Button_mamager.getPosition(), this.Button_unGroupMag.getPosition(),
                this.button_group.getPosition(), this.Button_remarks.getPosition(), this.Button_unMamager.getPosition(),
                this.Button_unAdmit.getPosition(), this.Button_admit.getPosition(), this.Button_AddOtherClub.getPosition(),
            ];
        }
        this.closeBtns();
        //查看成员
        this.button_checkCY.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                if (this.callBack) this.callBack(sender.name, this.itemData);
                this.visible = false;
            }
        }, this);
        //允许进房
        this.Button_admit.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                if (this.callBack) this.callBack(sender.name, this.itemData, this.openType);
            }
        }, this);
        //禁止进房
        this.Button_unAdmit.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                if (this.callBack) this.callBack(sender.name, this.itemData, this.openType);
            }
        }, this);
        //设置助理
        this.Button_zhuli.addTouchEventListener(function (sender, type) {
            if (type == 2 && this.callBack) this.callBack(sender.name, this.itemData);
        }, this);
        //撤销助理
        this.Button_unZhuli.addTouchEventListener(function (sender, type) {
            if (type == 2 && this.callBack) this.callBack(sender.name, this.itemData);
        }, this);

        //踢出全部人按钮
        this.button_tickAll.addTouchEventListener(function (sender, type) {
            if (type == 2 && this.callBack) this.callBack(sender.name, this.itemData, null, this.index);
        }, this);
        //踢出按钮
        this.Button_tichu.addTouchEventListener(function (sender, type) {
            if (type == 2 && this.callBack) this.callBack(sender.name, this.itemData);
        }, this);

        //管理
        this.Button_mamager.addTouchEventListener(function (sender, type) {
            if (type == 2) {
                cc.log("设为管理");
                if (itemData.position > 0) {
                    MjClient.showToast("请取消其特殊身份后再试");
                    return;
                }
                MjClient.block();
                MjClient.gamenet.request("pkplayer.handler.clubSetPosition", { id: itemData.id, roleId: 1 }, function (rtn) {
                    MjClient.unblock();
                    if (rtn.code == 0) {
                        MjClient.showToast(rtn.message);
                        if (cc.sys.isObjectValid(that)) {
                            itemData.position = 2;
                            itemData.roleId = 1;
                            that.reLoadCurPanleListUI();
                            that.Panle_memberManage.visible = false
                        }
                    }
                    else {
                        FriendCard_Common.serverFailToast(rtn);
                    }
                });
                MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Chengyuan_Chengyuanliebiao_Caozuo_Sheweiguanliyuan", { uid: SelfUid() });
            }
        }, this);

        // //撤销管理
        // Button_unMamager.addTouchEventListener(function (sender, type) {
        //     if (type == 2) {
        //         cc.log("撤销管理");
        //         MjClient.block();
        //         MjClient.gamenet.request("pkplayer.handler.clubSetPosition", { id: itemData.id, roleId: 0 }, function (rtn) {
        //             MjClient.unblock();
        //             if (rtn.code == 0) {
        //                 MjClient.showToast(rtn.message);
        //                 if (cc.sys.isObjectValid(that)) {
        //                     itemData.position = 0;
        //                     itemData.roleId = 0;
        //                     that.reLoadCurPanleListUI();
        //                     that.Panle_memberManage.visible = false
        //                 }
        //             }
        //             else {
        //                 FriendCard_Common.serverFailToast(rtn);
        //             }
        //         });
        //         MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Chengyuan_Chengyuanliebiao_Caozuo_Quxiaoguanliyuan", { uid: SelfUid() });
        //     }
        // }, this);

        // //备注
        // Button_remarks.addTouchEventListener(function (sender, type) {
        //     if (type == 2) {
        //         MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Chengyuan_Chengyuanliebiao_Caozuo_Tianjiabeizhu", { uid: SelfUid() });
        //         this.showInputRemarksNameDialog(itemData);
        //     }
        // }, this);

        // //添加到其他亲友圈
        // Button_AddOtherClub.addTouchEventListener(function (sender, type) {
        //     if (type == 2) {
        //         if (!FriendCard_Common.isLeader() && ((optIsManager && itemData.group) && hasGroupLeader)) {
        //             MjClient.showToast("不可操作，请联系该组组长");
        //             return;
        //         }
        //         /*if((optIsGroupLeader && itemData.assistantNo) && hasGroupLeader){
        //             MjClient.showToast("操作失败，请联系助理");
        //             return;
        //         }*/
        //         MjClient.block();
        //         MjClient.gamenet.request("pkplayer.handler.clubList", { type: 2 },
        //             function (rtn) {
        //                 MjClient.unblock();

        //                 if (!cc.sys.isObjectValid(that))
        //                     return;

        //                 if (rtn.code == 0) {
        //                     if (rtn.data.length <= 1) {
        //                         MjClient.showToast("你没有创建其他亲友圈");
        //                         that.removeFromParent(true);
        //                     }
        //                     else {
        //                         that.daochu_data = rtn.data && rtn.data.list ? rtn.data.list : [];
        //                         that.Panle_daochu.visible = true;
        //                         that.refreshDaoChuList(itemData);
        //                     }
        //                 } else {
        //                     FriendCard_Common.serverFailToast(rtn)
        //                 }
        //             }
        //         );
        //         MjClient.native.umengEvent4CountWithProperty("Qinyouquan_Chengyuan_Chengyuanliebiao_Caozuo_Tianjiadaoqitapengyouquan", { uid: SelfUid() });
        //     }
        // }, this);


        // button_group.addTouchEventListener(function (sender, type) {
        //     if (type == 2) {
        //         if (!FriendCard_Common.isLeader() && ((optIsManager && itemData.group) && hasGroupLeader)) {
        //             MjClient.showToast("不可操作，请联系该组组长");
        //             return;
        //         }
        //         if ((optIsGroupLeader && itemData.assistantNo) && hasGroupLeader) {
        //             MjClient.showToast("操作失败，请联系助理");
        //             return;
        //         }
        //         var others = [];
        //         others.push("不分组");
        //         var data_selectGroup = { event: "MEMBER_FENZU", numberGroup: FriendCard_Common.getGroupNumber(), others: others };
        //         data_selectGroup.callBackFunc = function (eD) {
        //             var setGroupType = eD.groupType == "不分组" ? 0 : eD.groupType;
        //             setGroupType = setGroupType + "";
        //             MjClient.block();
        //             MjClient.gamenet.request("pkplayer.handler.clubPlayerUpdate", {
        //                 clubId: that.clubInfo.clubId, userId: itemData.userId, type: 4, value: setGroupType
        //             }, function (rtn) {
        //                 MjClient.unblock();
        //                 if (rtn.code == 0) {
        //                     MjClient.showToast(rtn.message);
        //                     if (cc.sys.isObjectValid(that)) {
        //                         itemData.group = setGroupType;
        //                         that.reLoadCurPanleListUI();
        //                         that.Panle_memberManage.visible = false;
        //                     }
        //                 }
        //                 else {
        //                     FriendCard_Common.serverFailToast(rtn);
        //                 }
        //             });
        //         };
        //         that.addChild(new friendcard_selectGroup(data_selectGroup));
        //     }
        // }, this);

        // //设置组长
        // Button_groupMag.addTouchEventListener(function (sender, type) {
        //     if (type == 2) {

        //         if (itemData.position > 0) {
        //             MjClient.showToast("请取消其特殊身份后再试");
        //             return;
        //         }
        //         if (!FriendCard_Common.isLeader() && ((optIsManager && itemData.group) && hasGroupLeader)) {
        //             MjClient.showToast("不可操作，请联系该组组长");
        //             return;
        //         }
        //         if ((optIsGroupLeader && itemData.assistantNo) && hasGroupLeader) {
        //             MjClient.showToast("操作失败，请联系助理");
        //             return;
        //         }
        //         var others = [];
        //         var data_selectGroup = { event: "MEMBER_FENZU", numberGroup: FriendCard_Common.getGroupNumber(), ignoreGroups: groupList, others: others };
        //         data_selectGroup.callBackFunc = function (eD) {

        //             var groupType = eD.groupType == "不分组" ? 0 : eD.groupType;
        //             MjClient.block();
        //             MjClient.gamenet.request("pkplayer.handler.clubSetPosition", { id: itemData.id, groupId: groupType, roleId: 2 }, function (rtn) {
        //                 MjClient.unblock();
        //                 if (rtn.code == 0) {
        //                     MjClient.showToast(rtn.message);
        //                     if (cc.sys.isObjectValid(that)) {
        //                         var groupMap = that.clubInfo.groupMap;
        //                         groupMap[itemData.userId] = groupType;
        //                         itemData.position = 3;
        //                         itemData.roleId = 2;
        //                         itemData.group = groupType;
        //                         that.reLoadCurPanleListUI();
        //                         that.Panle_memberManage.visible = false;
        //                     }
        //                 }
        //                 else {
        //                     FriendCard_Common.serverFailToast(rtn);
        //                 }
        //             });

        //         };
        //         that.addChild(new friendcard_selectGroup(data_selectGroup));
        //     }
        // }, this);

        // Button_unGroupMag.addTouchEventListener(function (sender, type) {
        //     if (type == 2) {
        //         MjClient.gamenet.request("pkplayer.handler.clubSetPosition", { id: itemData.id, groupId: itemData.group, roleId: 0 }, function (rtn) {
        //             MjClient.unblock();
        //             if (rtn.code == 0) {
        //                 MjClient.showToast(rtn.message ? rtn.message : "撤销组长成功");
        //                 if (cc.sys.isObjectValid(that)) {
        //                     var groupMap = that.clubInfo.groupMap;
        //                     delete groupMap[itemData.userId.toString()];
        //                     itemData.position = 0;
        //                     itemData.roleId = 0;
        //                     that.reLoadCurPanleListUI();
        //                     that.Panle_memberManage.visible = false;
        //                 }
        //             }
        //             else {
        //                 FriendCard_Common.serverFailToast(rtn);
        //             }
        //         });
        //     }
        // }, this);


        // //冻结
        // button_frozen.addTouchEventListener(function (sender, type) {
        //     if (type == 2) {
        //         var uiPara = {}
        //         uiPara.uiStyle = "friendcard_posUpMsg_daoshu2";
        //         uiPara.msgRed2 = "冻结后该用户将无法进行提现";
        //         //uiPara.msgRed = "";
        //         uiPara.msg = "是否确认冻结";
        //         uiPara.showTime = 0;
        //         uiPara.yes = function () {
        //             var sendInfo = {};
        //             sendInfo.clubId = that.clubInfo.clubId;
        //             sendInfo.userId = itemData.userId;
        //             sendInfo.isFrozen = 1;
        //             cc.log("clubSetFrozen sendInfo", JSON.stringify(sendInfo))
        //             MjClient.block();
        //             MjClient.gamenet.request("pkplayer.handler.clubSetFrozen", sendInfo, function (rtn) {
        //                 MjClient.unblock();
        //                 if (rtn.code == 0) {
        //                     MjClient.showToast(rtn.message ? rtn.message : "冻结成功");
        //                     if (cc.sys.isObjectValid(that)) {
        //                         itemData.isFrozen = 1;
        //                         that.reLoadCurPanleListUI();
        //                         that.Panle_memberManage.visible = false;
        //                     }
        //                 } else {
        //                     FriendCard_Common.serverFailToast(rtn);
        //                 }
        //             });
        //         };
        //         uiPara.no = function () {
        //         }
        //         uiPara.close = function () {
        //         }
        //         MjClient.FriendCard_main_ui.addChild(new Friendcard_popUpMeg(uiPara))
        //     }

        // });
        // //解冻
        // button_unfrozen.addTouchEventListener(function (sender, type) {
        //     if (type == 2) {
        //         var uiPara = {}
        //         uiPara.uiStyle = "friendcard_posUpMsg_daoshu2";
        //         uiPara.msgRed2 = "解冻后该用户可以正常提现";
        //         //uiPara.msgRed = "";
        //         uiPara.msg = "是否确认解冻";
        //         uiPara.showTime = 0;
        //         uiPara.yes = function () {
        //             var sendInfo = {};
        //             sendInfo.clubId = that.clubInfo.clubId;
        //             sendInfo.userId = itemData.userId;
        //             sendInfo.isFrozen = 0;
        //             cc.log("clubSetFrozen sendInfo", JSON.stringify(sendInfo))
        //             MjClient.block();
        //             MjClient.gamenet.request("pkplayer.handler.clubSetFrozen", sendInfo, function (rtn) {
        //                 MjClient.unblock();
        //                 if (rtn.code == 0) {
        //                     MjClient.showToast(rtn.message ? rtn.message : "解冻成功");
        //                     if (cc.sys.isObjectValid(that)) {
        //                         itemData.isFrozen = 0;
        //                         that.reLoadCurPanleListUI();
        //                         that.Panle_memberManage.visible = false;
        //                     }
        //                 } else {
        //                     FriendCard_Common.serverFailToast(rtn);
        //                 }
        //             });
        //         };
        //         uiPara.no = function () {
        //         }
        //         uiPara.close = function () {
        //         }
        //         MjClient.FriendCard_main_ui.addChild(new Friendcard_popUpMeg(uiPara))
        //     }
        // });
        // if (Button_Xinyu.visible) {
        //     Button_Xinyu.addTouchEventListener(function (sender, type) {
        //         if (type == 2) {
        //             this.showOption1Panel(itemData);
        //         }
        //     }, this);
        // }
        // if (Button_chouchengbili.visible) {
        //     let c = Button_chouchengbili.getChildByName('Text').getColor()
        //     Button_chouchengbili.addTouchEventListener(function (sender, type) {
        //         if (type == 0) sender.getChildByName('Text').setColor(cc.color(150, 150, 150));
        //         else if (type == 2) {
        //             sender.getChildByName('Text').setColor(c);
        //             this.Panle_memberManage.addChild(new FriendCard_setRatio1({ clubId: this.clubInfo.clubId, groupRatio: itemData.groupRatio, group: itemData.group, msg: itemData }));
        //         } else if (type == 3) sender.getChildByName('Text').setColor(c);
        //     }.bind(this), this);
        // }
    },
});