
(function() {
    var majiang = {};
    var flowerArray = [31, 41, 51, 61, 71, 81, 91];//花的列表，根据不同来设置

    //是否是花
    majiang.isCardFlower = function(card)
    {
        return flowerArray.indexOf(card) >= 0;
    }

    //设置花，参数是[]，必须设置
    majiang.setFlower = function(flower)
    {
        flowerArray = flower || [];
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
        var tData = MjClient.data.sData.tData;
        return tData.shuffleCardsNum;
    };

    majiang.setFlowerImg = function (node, pl)
    {
        //获取方位转换
        if (!pl) return;
        var DirType = 0;
        var tData = MjClient.data.sData.tData;
        if (pl.dirNumber != -1) 
        {
            DirType = 31 + pl.dirNumber * 10;
        }
        else
        {
            var curDir = 0;
            var index = tData.roundAll / 4;
            for(var i = 4; i >= 1; i--){
                if(tData.roundNum <= (i * index) && tData.roundNum > ((i-1) * index))
                {
                    curDir = 4 - i;
                }
            }
            DirType = 31 + curDir * 10;
        }

        //对应方位的风牌分数加一

        var fengnum = 0;
        if (pl.mjflower && pl.mjflower.indexOf(DirType) >= 0) 
        {
            fengnum += 1;
        }

        //cc.log("pl花牌数据  ",JSON.stringify(pl),"DirType",DirType,"fengnum",fengnum);

        var icountNode = node.getChildByName("head").getChildByName("huaCount");
        if(icountNode != null && pl) {
            var icount = pl.mjflower.length + fengnum;
            icountNode.visible = true;
            cc.log("set flower ------ icount = " + icount);
            changeAtalsForLabel(icountNode,icount);
        }

    };  

    majiang.setJiaZhuNum = function (node, pl)
    {

    };


    if (typeof(MjClient) != "undefined")
    {
        MjClient.majiang_xiangshui = majiang;
    }
    else
    {
        module.exports = majiang;
    }
})();
