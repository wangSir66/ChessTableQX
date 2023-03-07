/**
 * Created by sking 2019.4.16
 */

var maJiang_showChicken = cc.Layer.extend({
    birdArr: [],
    flipTime:1,
    itemSpace: 110,
    _finishCallBack:null,
    _backLayout:null,
    _cardScale:1,
    ctor:function (showCards, finishCallBack) {
        this._super();
        this.birdArr = showCards.slice(0);

        // 创建一个layout 有颜色设置透明度
        var backLayout = new ccui.Layout();
        backLayout.setContentSize(cc.size(cc.winSize.width,cc.winSize.height));
        backLayout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        backLayout.setBackGroundColor(cc.color(0,0,0));
        backLayout.setBackGroundColorOpacity(255 * 0.6);
        backLayout.setAnchorPoint(0,0);
        this._backLayout = backLayout;
        this.addChild(backLayout);
        var cardNode  = new ccui.ImageView("res/playing/MJ/Mj_big.png");
        cardNode.setName("copyNode");
        cardNode.setScale(0.45);
        setWgtLayout(cardNode, [0.12,0.12],[0.5,0.5],[0,0]);
        backLayout.addChild(cardNode);
        cardNode.visible = false;
        this._cardScale = cc.winSize.height/750;

        setWgtLayout(this, [1,1],[0,0],[0,0], true);


        this._finishCallBack = finishCallBack;
        // 翻转时间每一贞
        this.flipTime = 0.05;


        var jiNode = new ccui.ImageView("res/playing/gameTable/zhuobian_07_2.png");
        setWgtLayout(jiNode,[0, 0.2], [0.55, 0.6], [0, 0], true);
        // jiNode.setName("jiNode");
        this.addChild(jiNode);


        var roleAni = createSpine("spine/zhuoji/zhuoji.json", "spine/zhuoji/zhuoji.atlas");
        roleAni.setAnimation(0, 'animation', false);
        //roleAni.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        roleAni.setPosition(0,0);
        roleAni.setScale(1);
        // var that = this;
        // roleAni.setCompleteListener(function (sender,event) {
        //
        // });
        // setWgtLayout(roleAni, [1,1],[0,0],[0,0], true);
        jiNode.addChild(roleAni,100);
        // // 显示翻转效果
        this.birdEffectFlip();


        UIEventBind(null, backLayout, "mjhand", function (eD) {
            this.removeFromParent(true);
        });

        return true;
    },
    // 翻拍的的中鸟边框特效
    addBoxEffect: function(node){
        var projNode = createSpine("spine/zhuaniaotexiao/skeleton.json", "spine/zhuaniaotexiao/skeleton.atlas");
        projNode.setAnimation(0, 'animation', true);
        projNode.setPosition(node.width / 2,node.height / 2);
        projNode.setTimeScale(0.35);
        node.addChild(projNode,1); 
        var anmSize = cc.size(110,160);
        projNode.setScaleX(node.width / anmSize.width);
        projNode.setScaleY(node.height / anmSize.height);
    },
    // 翻转效果
    birdEffectFlip: function(){
        var leng = this.birdArr.length;
        // 新位置需求换行
        var cardLeng = leng > 6 ? 4 : leng;
        var maxNum = leng > 6 ? 4 : leng;
        if(leng >= 9){
            maxNum++; cardLeng++;
        }

        var _delayTime = 0.2;
        for (var i = 0; i < leng; i++) {
            var sprite = new cc.Sprite();
            sprite.setScale(this._cardScale);
            this.addChild(sprite);

            if(leng == 3)
            {
                if(i == 1)
                    _delayTime = 0.2;
                else
                    _delayTime = 0.5;
            }
            else if(leng == 2)
            {
                if(i == 0)
                    _delayTime = 0.2;
                else
                    _delayTime = 0.5;
            }


            var itemWidth = this.itemSpace*sprite.getScale(); // 10 间隔
            var subLineY = i >= maxNum ? 1 : -1;
            if(leng < 7)
                subLineY = 0;
            // 起始位置
            var startX = cc.winSize.width / 2 - (cardLeng / 2 * itemWidth) + (itemWidth / 2);
            var sc = isIPhoneX() ? 0.5 : 0.49; // 所在的高度位置
            sprite.setPosition(cc.p(startX + ((i % maxNum) * itemWidth),cc.winSize.height * sc - (180 / 2 * subLineY) ));
            sprite.setTag(i);
            var fanzhuanAction = cc.animate(this.buildFanZhuanAction());
            var temp = this;
            var callFunc = cc.callFunc(function(){
                temp.createEndBirdCard(startX,this);
            }.bind(sprite));



            // setWgtLayout(sprite,[0, 0.02], [0.55, 0.6], [0, 0], true);

            sprite.runAction(cc.sequence(cc.delayTime(_delayTime),fanzhuanAction,cc.removeSelf(),callFunc ));
        }
        // 退出场景
        var that = this;
        var sumTime = this.flipTime * 3 + 0.8; // 翻转一帧的时间*3贞*每个鸟牌 + 2秒延迟显示
        this.runAction(cc.sequence(
            cc.delayTime(sumTime),
            cc.callFunc(function(){
                for(var off = 0 ; off < 4 ;off++)
                {
                    that.showPlayerJiCards(off);
                }
            }),
            cc.delayTime(2),
            cc.callFunc(function(){
                if(this._finishCallBack){
                    this._finishCallBack();
                }
                this.removeFromParent();
            }.bind(this))));
    },

    // 翻转后创建结束扑克
    createEndBirdCard : function(startX,sp){
        var _path = "res/playing/MJ/JiCardAni/";
        var itemWidth = this.itemSpace;
        var img = new ccui.ImageView(_path + "Mj_01.png");
        img.setScale(this._cardScale);
        img.setPosition(cc.p(sp.x,sp.y));
        this.addChild(img);
        var cardID = this.birdArr[ sp.getTag() ];
        var fileName2 = this.getCardFaceFileName(cardID); 
        var itemFace = new ccui.ImageView(fileName2);
        img.addChild(itemFace);
        itemFace.setPosition(cc.p(img.width / 2,img.height * 0.6));

        if(MjClient.playui.getIsBenJi(cardID,this.birdArr)){
           this.addBoxEffect(img); 
        }
    },

    getCardFaceFileName: function(cd){
         // 贴在麻将上面可变的图
        var path = "playing/MJ/"
        var imgName = "";
        var imgNames = ["Bamboo_", "Character_", "Dot_", "Wind_east", "Wind_south", "Wind_west", "Wind_north", "Red", "Green", "White"];
        if(cd < 30)
        {
            //条，筒，万
            imgName = imgNames[Math.floor(cd / 10)] + cd % 10;
        }
        else if (cd <= 91)
        {   //东南西北中发白
            imgName = imgNames[Math.floor(cd / 10)];//东南西北中发白
        }
        else if (cd <= 181){
            imgName = "flower_" + cd;
        }
        return path + imgName + ".png";
    },
    buildFanZhuanAction:function () {
        var anim = new cc.Animation();
        anim.setDelayPerUnit(this.flipTime);
        // Mj_04_new
        //var MJBgType = getCurrentMJBgType();

        var _path = "res/playing/MJ/JiCardAni/";
        anim.addSpriteFrameWithFile(_path + "Mj_04.png");
        anim.addSpriteFrameWithFile(_path + "Mj_f02.png");
        anim.addSpriteFrameWithFile(_path + "Mj_f03.png");
        anim.addSpriteFrameWithFile(_path + "Mj_01.png");
        // anim.addSpriteFrameWithFile(getNewMJBgFile("playing/MJ/Mj_f02.png"))
        // anim.addSpriteFrameWithFile(getNewMJBgFile("playing/MJ/Mj_f03.png"))
        // anim.addSpriteFrameWithFile(getNewMJBgFile("playing/MJ/Mj_01.png"))
        return anim;
    }
    , showPlayerJiCards: function(off){
        var pl = MjClient.playui.getPlayerInfoByOff(off);
        if(!pl) return;
        if(pl.tingCards && pl.tingCards.length == 0)
        {
            var _tingPos = [[0.5,0.1],[0.9,0.5],[0.5,0.9],[0.1,0.5]];
            var _tingImg = new ccui.ImageView("res/playing/paixing/weiting.png");
            _tingImg.setPosition(cc.winSize.width*_tingPos[off][0],cc.winSize.height*_tingPos[off][1]);
            if(off == 1) _tingImg.setRotation(-90);
            else if(off == 3) _tingImg.setRotation(90);

            this._backLayout.addChild(_tingImg);
            return;
        }

        //var jiCards = {"shangji":[24,0],"benji":[25,0],"xiaji":[26,3],"yaoji":[1,0,0],"wuguji":[28,3,1],"hongzhongji":[71,0,0]}; //
        var jiCards =  pl.jiCards;
        var jiCardNames = {"shangji":"上鸡","benji":"本鸡","xiaji":"下鸡","yaoji":"幺鸡","wuguji":"乌骨鸡","hongzhongji":"红中鸡",
                            "weekji":"星期鸡", "weekji_tiao":"星期鸡", "weekji_wan":"星期鸡", "weekji_tong":"星期鸡", 
                            "huanleji":"欢乐鸡", "huanleji_tiao":"欢乐鸡", "huanleji_wan":"欢乐鸡", "huanleji_tong":"欢乐鸡"};
        var jiCardNodeArr = [];
        for(var key in jiCards){
            var cards = jiCards[key];
            var cardInfo = cards[0] > 1000 ? cards[0] - 1000 : cards[0];    // 当前鸡麻将的值
            var cardNum = cards[1];                               // 当前鸡麻将的张数
            var isJinJi = cards[2];                               // 当前麻将是否金鸡  0:No, 1:Yes
            if(cardInfo == 0 || cardInfo == 1000) continue;
            if(cardNum > 0)
            {
                /*多个是分开显示*/
                for(var n = 0; n < cardNum;n++)
                {
                    var cardNode = this._backLayout.getChildByName("copyNode").clone();
                    cardNode.visible = true;
                    var img = MjClient.playui.getCardFaceImg2D(cardInfo);
                    img.setPosition(cardNode.getContentSize().width/2,cardNode.getContentSize().height/2);
                    cardNode.addChild(img);
                    this._backLayout.addChild(cardNode);

                    var numText = new ccui.Text(jiCardNames[key]+ "×" + 1, "chicken", 25);
                    cardNode.addChild(numText);
                    numText.setColor(cc.color("#ffffff"));
                    //numText.setFontName(MjClient.fzcyfont);
                    numText.setAnchorPoint(cc.p(0, 0));
                    numText.setPosition(0, -cardNode.height/4);
                    jiCardNodeArr.push(cardNode);

                    // if(key == "weekji" && cardInfo == 91){
                    //     var cardImg = cardNode.getChildByName("cardImg");
                    //     cardImg.loadTexture("gameOver/Account_little/xing.png");
                    // }

                    // if(key == "huanleji" && cardInfo == 91){
                    //     var cardImg = cardNode.getChildByName("cardImg");
                    //     cardImg.loadTexture("gameOver/Account_little/huan.png");
                    // }

                    if(isJinJi && cardNode){
                        cardNode.setColor(cc.color(255, 215, 0));
                        numText.setString("金鸡×" +cardNum)
                    }
                }

                /* 一起显示*/
                // var cardNode = this._backLayout.getChildByName("copyNode").clone();
                // cardNode.visible = true;
                // var img = MjClient.playui.getCardFaceImg2D(cardInfo);
                // img.setPosition(cardNode.getContentSize().width/2,cardNode.getContentSize().height/2);
                // cardNode.addChild(img);
                // this._backLayout.addChild(cardNode);
                // var numText = new ccui.Text(jiCardNames[key]+ "×" +cardNum, "chicken", 25);
                // cardNode.addChild(numText);
                // numText.setColor(cc.color("#ffffff"));
                // //numText.setFontName(MjClient.fzcyfont);
                // numText.setAnchorPoint(cc.p(0, 0));
                // numText.setPosition(0, -cardNode.height/4);
                // jiCardNodeArr.push(cardNode);
            }
        }



        var chickenCard = this._backLayout.getChildByName("copyNode");
        var width = chickenCard.width * chickenCard.scale + 10;
        var _posOff = [[0.36,0.15 - 0.02],[0.8 + 0.1,0.8],[0.36,0.9 + 0.02],[0.2 - 0.1,0.8]];

        var offIdx = off;
        var tData = MjClient.data.sData.tData;
        if(tData.maxPlayer == 3)
        {
            if(offIdx == 2)
            {
                offIdx = 3
            }
        }
        else if(tData.maxPlayer == 2)
        {
            if(offIdx == 1)
            {
                offIdx = 2
            }
        }
        for(var i = 0; i < jiCardNodeArr.length; i ++){
            var cd = jiCardNodeArr[i];
            cd.visible = true;
            cd.enabled = false;
            if(offIdx == 0)
            {
                cd.x = cc.winSize.width*_posOff[offIdx][0] + width * i + (5 - jiCardNodeArr.length)* width*0.5;
                cd.y = cc.winSize.height*_posOff[offIdx][1];
            }
            else if(offIdx == 1){
                cd.setRotation(-90);
                cd.x = cc.winSize.width*_posOff[offIdx][0] ;
                cd.y = cc.winSize.height*_posOff[offIdx][1] - width * i - (6 - jiCardNodeArr.length)* width*0.5;
            }
            else if(offIdx == 2)
            {
                cd.x = cc.winSize.width*_posOff[offIdx][0] +  width * i + (5 - jiCardNodeArr.length)* width*0.5;
                cd.y = cc.winSize.height*_posOff[offIdx][1];
            }
            else if(offIdx == 3)
            {
                cd.setRotation(90);
                cd.x = cc.winSize.width*_posOff[offIdx][0];
                cd.y = cc.winSize.height*_posOff[offIdx][1] - width * i -  (6 - jiCardNodeArr.length)* width*0.5;
            }
        }
    }

});



  