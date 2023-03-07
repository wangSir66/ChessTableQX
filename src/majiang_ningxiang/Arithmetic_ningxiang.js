
(function() {
    var majiang = {};

    //是否是花
    majiang.isCardFlower = function(card)
    {
        return false;
    }

    //设置花，参数是[]，必须设置
    majiang.setFlower = function(flower)
    {
    }

    //是否是混子
    majiang.isEqualHunCard = function(card)
    {
        return card == 200;
    }

    majiang.CardCount = function (pl)
    {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if(pl.mjhand)
        {
            rtn += pl.mjhand.length;
        }
        return rtn;
    };

    majiang.getAllCardsTotal = function ()
    {
        var cardsnum = 108;
        var tData = MjClient.data.sData.tData;
        if(tData.shuffleCardsNum)
        {
            cardsnum = tData.shuffleCardsNum;
        }
        if (tData.areaSelectMode["maipai"] > 0) 
        {
            cardsnum -= tData.areaSelectMode["maipai"];
        }

        return cardsnum;
    };

    majiang.setFlowerImg = function (node, pl)
    {
    };

    majiang.setJiaZhuNum = function (node, pl)
    {
        if(!pl) return;
        var icountNode = node.getChildByName("head").getChildByName("jiaZhu");
        var tData = MjClient.data.sData.tData;
        cc.log("===========飘分 = " + pl.jiazhuNum);
        if(pl.jiazhuNum > 0) {
            icountNode.visible = true;
            icountNode.ignoreContentAdaptWithSize(true);
            icountNode.setAnchorPoint(cc.p(1, 0.5))
            icountNode.setString("飘" + pl.jiazhuNum + "分");
        }else{
            icountNode.setString("");
        }
    };

    // 向服务器发送吃牌
    majiang.MJChiToServer = function(pos, cd)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJChiToServer=================pos=" + pos);
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJChi",
            card: cd,
            pos: pos,
            eatFlag: this.EatFlag()
        });
    }

    majiang.MJHuToServer = function(cd)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================majiang.MJHuToServer=================");
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJHu",
            card: cd,
            eatFlag: this.EatFlag()
        });
    }

    majiang.MJPengToServer = function(cd)
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJPengToServer=================");
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPeng",
            card: cd,
            eatFlag: this.EatFlag()
        });
    }

    //向服务器发送杠牌
    majiang.MJGangToServer = function(cd, isKaiGang)
    {
        cc.log("cd=" + cd)

        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJGangToServer=================");
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJGang",
            card: cd,
            isKaiGang: isKaiGang || false,
            eatFlag: this.EatFlag()
        });

        // 我可以开杠， 有两人可以胡， 我开杠后， 一人点胡牌， 我会再次显示选择按钮 wuyh fix
        // getUIPlayer(0).eatFlag = 0;
        // getUIPlayer(0).eatFlag2= 0;
    }

    majiang.MJPassConfirmToServer = function()
    {
        if (MjClient.rePlayVideo != -1) return; // 回放时候不能请求
        cc.log("====================MJPassConfirmToServer 11111 =================");
        MjClient.playui.hideAllEat();
        MjClient.gamenet.request("pkroom.handler.tableMsg", {
            cmd: "MJPass",
            eatFlag: this.EatFlag()
        });
    }

    majiang.EatFlag = function()
    {
        var pl = getUIPlayer(0);
        var ef = pl.eatFlag | pl.eatFlag2
        // 我可以开杠， 有两人可以胡， 我开杠后， 一人点胡牌， 我会再次显示选择按钮 wuyh fix
        pl.eatFlag = 0;
        pl.eatFlag2 = 0;
        return ef;
    }

    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_ningxiang = majiang;
    }
    else
    {
        module.exports = majiang;
    };

})();
