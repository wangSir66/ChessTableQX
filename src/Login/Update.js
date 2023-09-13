// loading 界面，添加默认的 tips 提示信息，根据 appID 获取
var LoadingTipsInfoList = {};
// 通用 tips 提示
LoadingTipsInfoList["normal"] = [
    "开房勾选防作弊，再也不用担心作弊问题啦！",
    "加入亲友圈，凑局更容易",
    "棋牌会友，禁止赌博",
    "铸就属于自己的传奇--传奇来了",
    "绑定代理，让游戏中的自己有个依靠",
    "代理创建亲友圈，要什么房间有什么房间",
    "凑局困难？快来试试自由人数吧！",
    "牌桌：2D拍牌更大，3D更逼真",
    "我看您印堂发光，这是大赢的征兆啊！",
    "天天游戏两小时，健康生活一百年"
];
// 金币场的通用 loading tips 提示
LoadingTipsInfoList["jinbichang"] = [
    "开房勾选防作弊，再也不用担心作弊问题啦！",
    "加入亲友圈，凑局更容易",
    "棋牌会友，禁止赌博",
    "铸就属于自己的传奇--传奇来了",
    "绑定代理，让游戏中的自己有个依靠",
    "代理创建亲友圈，要什么房间有什么房间",
    "凑局困难？快来试试自由人数吧！",
    "牌桌：2D拍牌更大，3D更逼真",
    "我看您印堂发光，这是大赢的征兆啊！",
    "天天游戏两小时，健康生活一百年",
    "百万金币免费送，快来金币场看看吧！",
    "进入娱乐场，让金币来的更猛烈一些吧"
];

var arrayTips = LoadingTipsInfoList["normal"];

//字符串\n替换
var formatStr = function (obj) {
    if (!obj) return;
    for (var key in obj) {
        if (cc.isString(obj[key]))
            obj[key] = obj[key].replace(/\\n/g, "\n");
    }
    return obj;
};
//日期格式替换
var formatData = function (data) {
    if (!data) return false;
    var times = data.split(",");
    for (var i = 0; i < times.length; i++) {
        times[i] = Number(times[i]);
    }
    return times;
};

//检测到js文件不全处理
var checkJsFileFail = function () {
    var tempList = cc.game.config["jsList"];
    var jsList = tempList.slice(0);
    for (var i = 0; i < jsList.length; i++) {
        var filePath = "update/" + jsList[i].replace(".js", ".jsc");
        if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + filePath))
            jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + filePath);
    }
    if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + "update/project.json"))
        jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/project.json");
    if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + "update/main.jsc"))
        jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/main.jsc");
    removeUpdataDirectory();//次方法会重启
};
//检测project.json jsList下的文件是否存在
var checkAllJSFile = function (callback) {
    if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + "update/project.json")) {
        cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + "update/project.json", function (er, txt) {
            if (txt && txt.length > 0) {
                try {
                    var projectJson = (JSON.parse(txt));
                    if (projectJson && projectJson["jsList"]) {
                        var updatejsList = projectJson["jsList"];
                        cc.log("checkAllJSFile jsList is update file, length is " + updatejsList.length);
                        for (var i = 0; i < updatejsList.length; i++) {
                            if (!jsb.fileUtils.isFileExist(updatejsList[i]) && !jsb.fileUtils.isFileExist(updatejsList[i].replace(".js", ".jsc"))) {
                                cc.log("checkAllJSFile fail  " + updatejsList[i] + " not found");
                                if (callback) callback(false);
                                return;
                            }
                        }
                        cc.log("checkAllJSFile success");
                        if (callback) callback(true);
                    } else {
                        cc.log("checkAllJSFile update/project.json file error1");
                        if (callback) callback(false);
                    }
                } catch (e) {
                    cc.log("checkAllJSFile update/project.json file error2");
                    if (callback) callback(false);
                }
            } else {
                cc.log("checkAllJSFile update/project.json file error3");
                if (callback) callback(false);
            }
        });
    }
    else {
        if (callback) callback(true);
    }
};


//非广告包是否要提示更新
var isTipDownloadAdsApp = function () {
    var result = false;
    if (cc.sys.OS_ANDROID == cc.sys.os && !MjClient.native.mobgiAds.isAdsApp()) {
        var curTimestamp = parseInt(new Date().getTime() / 1000);
        var installAppTimestamp = util.localStorageEncrypt.getNumberItem("InstallAppTimestamp", curTimestamp);
        if (installAppTimestamp == curTimestamp) {//首次安装app
            util.localStorageEncrypt.setNumberItem("InstallAppTimestamp", curTimestamp);
        }
        // else if (curTimestamp - installAppTimestamp >= 15 * 86400) {//安装超过了15天
        //     result = true;
        // }
    }
    return result;
};


//开启配置文件更新
function startUpdateCfg() {
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("GET", GameDownloadCfgUrl[MjClient.getAppType()] + "configuration.json");

    var loadUpdateCfgFailed = function () {
        cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + "configuration.json", function (er, txt) {
            if (txt && txt.length > 0) {
                try {
                    MjClient.updateCfg = /*formatStr*/(JSON.parse(txt));
                    GetRemoteCfg();
                }
                catch (e) {
                    CfgGetFail();
                }
            }
            else {
                CfgGetFail();
            }
        });
    };

    xhr.onreadystatechange = function () {
        //cc.log("=====doomsky say:JSON.stringify(xhr)======", JSON.stringify(xhr));
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                MjClient.updateCfg = /*formatStr*/(JSON.parse(xhr.responseText));
                jsb.fileUtils.writeStringToFile(xhr.responseText, jsb.fileUtils.getWritablePath() + "configuration.json");
                GetRemoteCfg();
            }
            catch (e) {
                loadUpdateCfgFailed();
            }
        }
        else if (!MjClient.updateCfg) {
            loadUpdateCfgFailed();
        }
    };

    xhr.onerror = function (event) {
        if (!MjClient.updateCfg) {
            loadUpdateCfgFailed();
        }
    };
    xhr.ontimeout = function (event) {
        if (!MjClient.updateCfg) {
            loadUpdateCfgFailed();
        }
    };
    xhr.onabort = function (event) {
        if (!MjClient.updateCfg) {
            loadUpdateCfgFailed();
        }
    };
    xhr.timeout = 3000;//3s超时
    xhr.send();
}



function ChangeCfg4GuestLogin() {
    //if (!MjClient.remoteCfg.guestLogin)//审核则不初始化定位
    {
        MjClient.native.setEnv(AppEnv[MjClient.getAppType()]);
        MjClient.native.InitAMap();
    }
}


function CfgGetFail() {
    postEvent("disconnect", 5);
}



function LoadConfig(remoteCfgName) {
    var loadRemoteCfgFailed = function () {
        //读取缓存
        cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + remoteCfgName, function (er, txt) {
            if (txt && txt.length > 0) {
                try {
                    MjClient.remoteCfg = JSON.parse(txt);
                    GetRemoteCfg();
                }
                catch (e) {
                    CfgGetFail();
                }
            }
            else {
                CfgGetFail();
            }
        });
    };

    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("GET", GameDownloadCfgUrl[MjClient.getAppType()] + remoteCfgName);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                MjClient.remoteCfg = JSON.parse(xhr.responseText);
                jsb.fileUtils.writeStringToFile(xhr.responseText, jsb.fileUtils.getWritablePath() + remoteCfgName);
                GetRemoteCfg();
            }
            catch (e) {
                loadRemoteCfgFailed();
            }
        }
        else {
            loadRemoteCfgFailed();
        }
    };
    xhr.onerror = function (event) {
        loadRemoteCfgFailed();
    };
    xhr.ontimeout = function (event) {
        loadRemoteCfgFailed();
    };
    xhr.onabort = function (event) {
        loadRemoteCfgFailed();
    };
    xhr.timeout = 3000;//3s超时
    xhr.send();
}




//检查native版本和res版本
function checkVersions() {

    // return;

    var downloadApk = function (showDialog) {
        var apkUrl = MjClient.remoteCfg.apk.url;
        var filePath = jsb.fileUtils.getWritablePath();
        var fileNameVec = apkUrl.split("/");
        var fileName = fileNameVec[fileNameVec.length - 1];
        var eventName = "downloadApkFinish";

        var checkAndInstall = function () {
            if (getFileMD5(filePath + fileName).toLowerCase() == MjClient.remoteCfg.apk.md5.toLowerCase()) {
                MjClient.showMsg("新安装包下载完成，是否立即安装？", function () {
                    MjClient.native.installApp(filePath + fileName);
                }, function () { });
            }
            else {
                MjClient.showMsg("安装包下载失败，是否重新下载？", function () {
                    jsb.fileUtils.removeFile(filePath + fileName);
                    downloadApk(showDialog);
                }, function () { });
            }
        };
        UIEventBind(null, MjClient.Scene, eventName, checkAndInstall);

        if (jsb.fileUtils.isFileExist(filePath + fileName)) {
            checkAndInstall();
        }
        else {
            MjClient.native.DownLoadFile(filePath, fileName, apkUrl, eventName);
            if (showDialog) {
                var msg = "正在下载新的安装包，请稍后";
                var dialog = new UnclosedTipLayer(msg);
                var jindu = 0;
                dialog.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
                    var dot = ["", ".", "..", "..."];
                    dialog.setMsg("正在下载新的安装包，请稍后" + dot[jindu]);
                    jindu++;
                    if (jindu > 3) {
                        jindu = 0;
                    }
                }), cc.delayTime(40 / 100))));
                MjClient.Scene.addChild(dialog);
                UIEventBind(null, dialog, eventName, function () {
                    dialog.removeFromParent();
                });
            }
        }
    };


    if (!isCurrentNativeVersionBiggerThan(MjClient.remoteCfg.minNativeVer)) {
        if (cc.sys.OS_ANDROID == cc.sys.os && isCurrentNativeVersionBiggerThan("13.0.0") && MjClient.remoteCfg.apk) {
            MjClient.showMsg("当前App的版本太旧，点击“确定”将自动下载安装新版本。", function () {
                downloadApk(true);
            });
        }
        else {
            MjClient.showUnclosedMsg("当前App的版本太旧，请先卸载后，重新下载安装。", function () {
                MjClient.native.OpenUrl(MjClient.remoteCfg.wxShareUrl);
            });
        }
        return;
    }

    if (!isCurrentResVersionBiggerThan(MjClient.remoteCfg.minResVer)) {
        MjClient.showUnclosedMsg("当前资源版本太旧，请确认网络连接后重试。或卸载后重新下载安装。", function () {
            MjClient.restartGame();
        });
        return;
    }

    if (!isCurrentNativeVersionBiggerThan(MjClient.remoteCfg.newNativeVer)) {
        if (cc.sys.OS_ANDROID == cc.sys.os && isCurrentNativeVersionBiggerThan("13.0.0") && MjClient.remoteCfg.apk) {
            MjClient.showMsg("检测到新版本，点击“确定”将自动下载安装新版本",
                function () {
                    postEvent("updateFinish");
                    downloadApk(false);
                },
                function () {
                    postEvent("updateFinish");
                }
            );
        }
        else {
            MjClient.showMsg("检测到新版本，请先卸载后，下载安装新版本有更多新功能哦。",
                function () {
                    postEvent("updateFinish");
                    MjClient.native.OpenUrl(MjClient.remoteCfg.wxShareUrl);
                },
                function () {
                    postEvent("updateFinish");
                }
            );
        }
        return;
    }

    if (isTipDownloadAdsApp() && isCurrentNativeVersionBiggerThan("13.0.0") && MjClient.remoteCfg.apk) {
        MjClient.showMsg("您很久没有下载新版本了，点击“确定”将自动为您下载安装",
            function () {
                postEvent("updateFinish");
                downloadApk(false);
            },
            function () {
                postEvent("updateFinish");
            }
        );
        return;
    }

    postEvent("updateFinish");
}



function GetRemoteCfgLocal() {
    var remoteCfgName = MjClient.native.GetVersionName();
    if (!MjClient.updateCfg || !MjClient.updateCfg[remoteCfgName]) {
        if (cc.sys.OS_IOS == cc.sys.os) {
            remoteCfgName = "ios";
        }
        else {
            remoteCfgName = "android";
        }
    }

    if (MjClient.updateCfg && MjClient.updateCfg[remoteCfgName]) {
        MjClient.remoteCfg = MjClient.updateCfg[remoteCfgName];
        GetRemoteCfg();
    }
    else {
        GetRemoteCfgNet();
    }
}


function GetRemoteCfgNet() {
    var remoteCfgName = "android.json";
    if (cc.sys.OS_IOS == cc.sys.os) {
        remoteCfgName = MjClient.native.GetVersionName() + ".json";
    }
    LoadConfig(remoteCfgName);
}



function GetRemoteCfg() {

    if (!MjClient.updateCfg) {
        startUpdateCfg();
    }
    else if (!MjClient.remoteCfg) {
        GetRemoteCfgLocal();
    }
    else {
        checkVersions();
        ChangeCfg4GuestLogin();
    }
}




function createAssetsManager(manifestFile, storagePath) {
    var manager = new jsb.AssetsManager(manifestFile, storagePath);
    manager.setVersionCompareHandle(function (versionA, versionB) {
        cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    });
    manager.setVerifyCallback(function (filePath, asset) {
        if (typeof getFileMD5 === "undefined") {
            return true;
        }
        else {
            var md5 = getFileMD5(filePath);
            if (md5 !== asset.md5) {
                MjClient.native.umengEvent4CountWithProperty("UpdateFile_MD5_fail", { tag: filePath + ":" + md5 + ":" + asset.md5 });
            }
            return md5 === asset.md5;
        }
    });

    if (cc.sys.os === cc.sys.OS_ANDROID) {
        // Some Android device may slow down the download process when concurrent tasks is too much.
        // The value may not be accurate, please do more test and find what's most suitable for your game.
        manager.setMaxConcurrentTask(2);
    }

    if (manager)
        manager.retain();

    return manager;
}


function CheckUpdateResource() {

    MjClient.Scene.addChild(new UpdateView(true));
    if (cc.sys.isObjectValid(MjClient.updateui))
        MjClient.updateui.setVisible(false);
}


UpdateView = cc.Layer.extend({
    ctor: function (isReconnect) {
        this._super();
        var updateui = ccs.load(res.Update_json);
        this.addChild(updateui.node);
        MjClient.updateui = this;

        /// 输出 tips 提示
        this.showTips(arrayTips);
        this._isShowTips = false;
        this.__failCount = 0;
        this.manager = null;
        this._updateListener = null;
        this._isReconnect = isReconnect;
        this._oldSearchPaths = jsb.fileUtils.getSearchPaths().slice();


        var _back = updateui.node.getChildByName("back");
        setWgtLayout(_back, [1, 1], [0.5, 0.5], [0, 0], true);
        var textLoad = _back.getChildByName("load_percent");
        var barbk = _back.getChildByName("barbk");
        var bgMask = _back.getChildByName("bg_mask");
        setWgtLayout(bgMask, [1, 1], [0.5, 0], [0, 0], false, true);
        setWgtLayout(barbk, [1, 1], [0.5, 0.1], [0, 0], false, true);
        setWgtLayout(textLoad, [0.25, 0.25], [0.5, 0.07], [0, 0], false, true);
        if (isIPhoneX()) {
            setWgtLayout(barbk, [1, 1], [0.5, 0.12], [0, 0], false, true);
            setWgtLayout(textLoad, [0.25, 0.25], [0.5, 0.9], [0, 0], false, true);
        }
        textLoad.ignoreContentAdaptWithSize(true);
        var jindu = 0;
        textLoad.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
            jindu++;
            var dot = "";
            switch (jindu) {
                case 1:
                    dot = "."
                    break;
                case 2:
                    dot = ".."
                    break;
                case 3:
                    dot = "..."
                    break;
                default:
                    dot = ""
                    break;
            }
            textLoad.setString("网络连接中请稍后" + dot);
            if (jindu > 3) {
                jindu = 0;
            }
        }), cc.delayTime(40 / 100))));
        this.load_percentNode = textLoad;

        var barbk = updateui.node.getChildByName("back").getChildByName("barbk");
        this.lightNode = barbk.getChildByName("light");
        this.barNode = barbk.getChildByName("bar");
        if (this.barNode) {
            this.barSize = this.barNode.getContentSize();
        }

        return true;
    },
    showUpdataToast: function (arrTips) { // updata tips ：loading 界面的 tips 提示
        if (haveThirdPartyWebView() || !arrTips || arrTips.length < 1) {
            return;
        }

        arrTips = arrTips.slice(); // 轮播的 tips 内容列表
        var index = 0; // 当前轮播的索引

        // 轮播容器
        var toastUI = new ccui.Layout();
        toastUI.setClippingEnabled(true); // 裁切内容
        toastUI.setAnchorPoint(0.5, 0.5);
        if (this.getChildByName("tipsLayer")) this.removeChildByName("tipsLayer");
        this.addChild(toastUI, 99999);
        toastUI.setName("tipsLayer");

        // bg
        var bg = new ccui.ImageView("loading/TIPS_BG.png");
        var bgWidth = bg.getContentSize().width;
        var bgHeight = bg.getContentSize().height;
        bg.setAnchorPoint(0.5, 0.5);
        bg.setPosition(cc.p(bgWidth / 2, bgHeight / 2));

        // 当前显示 tips
        var text = new ccui.Text();
        text.setName("text");
        text.setAnchorPoint(0.5, 0.5);
        text.setFontSize(24);
        text.setFontName("fonts/lanting.ttf");
        text.setColor(cc.color("#ffeb8c"));
        text.setPosition(cc.p(bgWidth / 2, bgHeight / 2));
        text.setString(arrTips[index] + "");
        text.ignoreContentAdaptWithSize(true);

        toastUI.setContentSize(bgWidth, bgHeight);
        toastUI.addChild(bg);
        toastUI.addChild(text);
        setWgtLayout(toastUI, [0.5, 0.5], [0.5, 0.3], [0, 0]);

        function wheelplanting(node, msg) {
            // 当前显示 tips
            var text = node.getChildByName("text");
            var textPos = text.getPosition(); // 当前显示 tips 的位置
            var d_value = node.getContentSize().height; // 动画移动的差值

            // 创建一个新的 tips，放在 text 的下面
            var nestTxt = text.clone();
            nestTxt.setString(msg + "");
            nestTxt.ignoreContentAdaptWithSize(true);
            nestTxt.setPosition(cc.p(textPos.x, textPos.y - d_value));
            node.addChild(nestTxt);

            // 动画
            text.runAction(
                cc.sequence(
                    cc.delayTime(2.5),
                    cc.moveBy(0.3, 0, d_value).easing(cc.easeSineOut()),
                    cc.removeSelf(true)
                )
            );
            nestTxt.runAction(
                cc.sequence(
                    cc.delayTime(2.5),
                    cc.moveBy(0.3, 0, d_value).easing(cc.easeSineOut()),
                    cc.callFunc(function () {
                        nestTxt.setName("text"); // 动画完成，将新的 tips 设置成当前 tips
                    })
                )
            );
        }

        if (arrTips.length > 1) {
            var tipsFun = cc.callFunc(function () {
                index++;
                wheelplanting(toastUI, arrTips[index % arrTips.length]);
            });
            toastUI.runAction(cc.sequence(tipsFun, cc.delayTime(3)).repeatForever());
        }

    },
    close: function () {
        if (MjClient.updateui) {
            MjClient.updateui.removeFromParent(true);
            MjClient.updateui = null;
        }
    },
    setPercentInfo: function (percent) {
        if (this.barNode != null)
            this.barNode.setPercent(percent);

        if (this.lightNode) {
            this.lightNode.x = this.barSize.width * this.barNode.scale * percent / 100;
        }

        var str = "正在加载资源(" + parseInt(percent) + "%),请不要离开游戏！";
        if (this._resourceClass > 0) {
            str = "正在加载" + getResourceClassName(this._resourceClass) + "资源(" + parseInt(percent) + "%),请不要离开游戏！";
        }
        if (this.load_percentNode != null)
            this.load_percentNode.setString(str);
    },
    onExit: function () {
        this._super();

        if (this.manager) {
            this.manager.release();
            this.manager = null;
        }

        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
    },
    onEnter: function () {
        this._super();

        if (cc.sys.OS_WINDOWS == cc.sys.os && !MjClient.windowUpdate) {
            if (this._isReconnect) {
                this.close();
            }
            else {
                MjClient.resVersion = "h5";
                GetRemoteCfg();
            }

            return;
        }

        this._resourceClasses = [];
        for (var key in MjClient.RESOURCE_CLASS) {
            var resourceClass = MjClient.RESOURCE_CLASS[key];
            if (resourceClass != MjClient.RESOURCE_CLASS.GOLD_FIELD && util.localStorageEncrypt.getStringItem("VERSION_RESOURCE_CLASS_" + resourceClass).length > 0) {
                this._resourceClasses.push(resourceClass);
            }
        }

        var appPath = "";
        if (cc.sys.OS_WINDOWS == cc.sys.os) {
            appPath = MjClient.Window_AppPath;
        }

        var hallSearchPaths = [
            jsb.fileUtils.getWritablePath() + "update",
            appPath,
            jsb.fileUtils.getWritablePath() + "update/res",
            appPath + "res"
        ];

        setSearchPathByPaths(hallSearchPaths, "UpdateView start");

        this.manager = createAssetsManager("project.manifest", jsb.fileUtils.getWritablePath() + "update");
        if (!this.manager || !this.manager.getLocalManifest().isLoaded()) {
            setSearchPathByPaths(this._oldSearchPaths, "UpdateView oldSearchPaths");

            if (this._isReconnect && !this.isVisible()) {
                this.close();
            }
            else {
                GetRemoteCfg();
            }
        }
        else {
            this._updateListener = new jsb.EventListenerAssetsManager(this.manager, this.updateCallback.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);
            this.manager.update();
        }


    },
    updateCallback: function (event) {
        MjClient.unblock();
        this.load_percentNode.stopAllActions();
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                if (this._isReconnect) {
                    this.setVisible(true);
                    this.setLocalZOrder(9999999);
                    stopEffect(playTimeUpEff);
                    playTimeUpEff = null;
                    if (MjClient.gamenet) {
                        MjClient.gamenet.disconnect();
                    }
                    if (MjClient.homeui && cc.sys.isObjectValid(MjClient.homeui)) {
                        MjClient.homeui.removeFromParent();
                        MjClient.homeui = null;
                    }
                    if (MjClient.playui && cc.sys.isObjectValid(MjClient.playui)) {
                        MjClient.playui.removeFromParent();
                        MjClient.playui = null;
                    }
                }
                break;
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                if (this._isReconnect && !this.isVisible()) {
                    setSearchPathByPaths(this._oldSearchPaths, "UpdateView oldSearchPaths");
                    this.close();
                }
                else {
                    MjClient.resVersion = this.manager.getLocalManifest().getVersion();
                    this.updateResourceClass();
                }

                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.__failCount++;
                if (this.__failCount < 5) {
                    this.manager.downloadFailedAssets();
                }
                else {
                    this.__failCount = 0;
                    MjClient.resVersion = this.manager.getLocalManifest().getVersion();
                    checkAllJSFile(function (result) {
                        if (result) {
                            this.updateResourceClass();
                        } else {
                            checkJsFileFail();
                        }
                    }.bind(this));
                }
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:

                this.setPercentInfo(event.getPercent());

                if (MjClient.updateui && !MjClient.updateui._isShowTips) {
                    MjClient.updateui.showTips();
                    MjClient.updateui._isShowTips = true;
                }

                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                MjClient.resVersion = this.manager.getLocalManifest().getVersion();
                this.updateResourceClass();
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                checkAllJSFile(function (result) {
                    if (result) {
                        MjClient.restartGame();
                    } else {
                        checkJsFileFail();
                    }
                });
                break;
            default:
                break;
        }
    },
    updateResourceClass: function () {
        if (this.manager) {
            this.manager.release();
            this.manager = null;
        }

        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }

        this._resourceClass = this._resourceClasses.shift();
        if (!this._resourceClass) {//玩法资源全部热更完成
            setSearchPathByPaths(this._oldSearchPaths, "UpdateView oldSearchPaths");
            if (this._isReconnect && !this.isVisible()) {//断线重连时检查热更，且没有发生热更
                this.close();
            }
            else {
                GetRemoteCfg();
            }
        }
        else if (checkVersionString(MjClient.resVersion, util.localStorageEncrypt.getStringItem("VERSION_RESOURCE_CLASS_" + this._resourceClass)) <= 0) {
            this.updateResourceClass();
        }
        else {
            if (this.load_percentNode != null)
                this.load_percentNode.setString("即将更新" + getResourceClassName(this._resourceClass) + "资源");

            var appPath = "";
            if (cc.sys.OS_WINDOWS == cc.sys.os) {
                appPath = MjClient.Window_AppPath;
            }

            var resourceManifestPath = getManifestFilePath(this._resourceClass);
            var resourceClassSearchPaths = [
                jsb.fileUtils.getWritablePath() + "update/" + resourceManifestPath,
                appPath + "res/" + resourceManifestPath,
                jsb.fileUtils.getWritablePath() + "update/res/" + resourceManifestPath
            ];
            setSearchPathByPaths(resourceClassSearchPaths, "UpdateView updateResourceClass");

            this.manager = createAssetsManager("project.manifest", jsb.fileUtils.getWritablePath() + "update/" + resourceManifestPath);
            if (!this.manager || !this.manager.getLocalManifest().isLoaded()) {
                updateResourceClass(this._oldSearchPaths, "UpdateView oldSearchPaths");
                if (this._isReconnect && !this.isVisible()) {
                    this.close();
                }
                else {
                    MjClient.showUnclosedMsg(resourceManifestPath + "版本文件加载失败，将重启游戏", function () {
                        MjClient.restartGame();
                    });
                }
            }
            else {
                this._updateListener = new jsb.EventListenerAssetsManager(this.manager, this.updateResourceClassCallback.bind(this));
                cc.eventManager.addListener(this._updateListener, 1);
                this.manager.update();
            }
        }
    },
    updateResourceClassCallback: function (event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                if (this._isReconnect) {
                    this.setVisible(true);
                    this.setLocalZOrder(9999999);
                    stopEffect(playTimeUpEff);
                    playTimeUpEff = null;
                    if (MjClient.gamenet) {
                        MjClient.gamenet.disconnect();
                    }
                    if (MjClient.homeui && cc.sys.isObjectValid(MjClient.homeui)) {
                        MjClient.homeui.removeFromParent();
                        MjClient.homeui = null;
                    }
                    if (MjClient.playui && cc.sys.isObjectValid(MjClient.playui)) {
                        MjClient.playui.removeFromParent();
                        MjClient.playui = null;
                    }
                }
                break;
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                setSearchPathByPaths(this._oldSearchPaths, "UpdateView oldSearchPaths");
                if (checkVersionString(MjClient.resVersion, this.manager.getLocalManifest().getVersion()) > 0) {
                    if (this._isReconnect && !this.isVisible()) {
                        this.updateResourceClass();
                    }
                    else {
                        MjClient.showMsg(getResourceClassName(this._resourceClass) + "资源更新失败(code:" + event.getEventCode() + ")，将重启游戏", function () {
                            MjClient.restartGame();
                        });
                    }
                }
                else {
                    MjClient.showToast("跳过" + getResourceClassName(this._resourceClass) + "资源更新(code:" + event.getEventCode() + ")");
                    this.updateResourceClass();
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.__failCount++;
                if (this.__failCount < 5) {
                    this.manager.downloadFailedAssets();
                }
                else {
                    this.__failCount = 0;
                    setSearchPathByPaths(this._oldSearchPaths, "UpdateView oldSearchPaths");
                    if (checkVersionString(MjClient.resVersion, this.manager.getLocalManifest().getVersion()) > 0) {
                        MjClient.showMsg(getResourceClassName(this._resourceClass) + "资源更新失败(code:" + event.getEventCode() + ")，将重启游戏", function () {
                            MjClient.restartGame();
                        });
                    }
                    else {
                        MjClient.showToast("跳过" + getResourceClassName(this._resourceClass) + "资源更新(code:" + event.getEventCode() + ")");
                        this.updateResourceClass();
                    }
                }
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.setPercentInfo(event.getPercent());
                if (MjClient.updateui && !MjClient.updateui._isShowTips) {
                    MjClient.updateui.showTips();
                    MjClient.updateui._isShowTips = true;
                }
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                util.localStorageEncrypt.setStringItem("VERSION_RESOURCE_CLASS_" + this._resourceClass, this.manager.getLocalManifest().getVersion());
                this.updateResourceClass();
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log("VERSION_RESOURCE_CLASS_" + this._resourceClass + ":" + this.manager.getLocalManifest().getVersion());
                util.localStorageEncrypt.setStringItem("VERSION_RESOURCE_CLASS_" + this._resourceClass, this.manager.getLocalManifest().getVersion());
                this.updateResourceClass();
                break;
            default:
                break;
        }
    },
    showTips: function () {
        // 输出 tips 提示
        this.showUpdataToast(arrayTips);
    }

});



function getResourceClassName(resourceClass) {
    var str = "";
    switch (resourceClass) {
        case MjClient.RESOURCE_CLASS.MA_JIANG:
            str = "麻将";
            break;
        case MjClient.RESOURCE_CLASS.POKER:
            str = "扑克";
            break;
        case MjClient.RESOURCE_CLASS.PAO_DE_KUAI:
            str = "跑得快斗地主";
            break;
        case MjClient.RESOURCE_CLASS.ZI_PAI:
            str = "字牌";
            break;
        case MjClient.RESOURCE_CLASS.CHANG_PAI:
            str = "长牌";
            break;
        case MjClient.RESOURCE_CLASS.GOLD_FIELD:
            str = "娱乐场";
            break;
    }
    return str;
}

function getManifestFilePath(resourceClass) {
    var manifestFile = null;
    switch (resourceClass) {
        case MjClient.RESOURCE_CLASS.MA_JIANG:
            manifestFile = "res_majiang";
            break;
        case MjClient.RESOURCE_CLASS.ZI_PAI:
            manifestFile = "res_zipai";
            break;
        case MjClient.RESOURCE_CLASS.POKER:
            manifestFile = "res_poker";
            break;
        case MjClient.RESOURCE_CLASS.PAO_DE_KUAI:
            manifestFile = "res_paodekuai";
            break;
        case MjClient.RESOURCE_CLASS.CHANG_PAI:
            manifestFile = "res_changpai";
            break;
        case MjClient.RESOURCE_CLASS.GOLD_FIELD:
            manifestFile = "res_goldField";
            break;
    }
    return manifestFile;
}

function CheckUpdateResourceClass(gameClass, callback) {
    if (cc.sys.OS_WINDOWS == cc.sys.os && !MjClient.windowUpdate) {
        if (callback) callback();
        return;
    }

    if (gameClass != MjClient.RESOURCE_CLASS.GOLD_FIELD) {
        if (callback) callback();
        return;
    }

    if (cc.sys.isObjectValid(MjClient.updateResourceClassUI)) {
        MjClient.updateResourceClassUI.showThenHide();
        MjClient.showToast("正在加载资源，请加载完成后再试");
        return;
    }

    if (cc.isUndefined(gameClass)) {
        if (callback) callback();
    }

    var resourceClass = ResourceClass[gameClass];
    if (cc.isUndefined(resourceClass)) {
        if (callback) callback();
    }
    var resourceClassVersion = util.localStorageEncrypt.getStringItem("VERSION_RESOURCE_CLASS_" + resourceClass);
    if (resourceClassVersion.length > 0) {//资源存在
        if (callback) callback();
    }
    else if (!cc.sys.isObjectValid(MjClient.playui)) {//如果在房间中，不能进行加载
        var updateView = new UpdateResourceClassView(gameClass, callback);
        MjClient.Scene.addChild(updateView, 9999999);
    }
}


// 加载玩法资源界面
var UpdateResourceClassView = cc.Layer.extend({
    ctor: function (gameClass, callback) {
        this._super();
        MjClient.updateResourceClassUI = this;
        this.__failCount = 0;
        this.manager = null;
        this._gameClass = gameClass;
        this._resourceClass = ResourceClass[gameClass];
        this._updateListener = null;
        this._callback = callback;
        this._oldSearchPaths = jsb.fileUtils.getSearchPaths().slice();

        if (gameClass == MjClient.RESOURCE_CLASS.GOLD_FIELD) {
            var updateui = ccs.load("Update_3.json");
            this.addChild(updateui.node);
            var _panel = updateui.node.getChildByName("Panel");
            setWgtLayout(_panel, [1, 1], [0.5, 0.5], [0, 0], true);
            var _back = _panel.getChildByName("back");
            this.backNode = _back;
            setWgtLayout(_back, [1, 1], [0.5, 1], [0, 0], false, true);
            this.backNode.originalPos = this.backNode.getPosition();

            this.text = _back.getChildByName("text");
            this.text.ignoreContentAdaptWithSize(true);
        }
        else {
            var updateui = ccs.load("Update_2.json");
            this.addChild(updateui.node);
            var _panel = updateui.node.getChildByName("Panel");
            setWgtLayout(_panel, [1, 1], [0.5, 0.5], [0, 0], true);
            var _back = _panel.getChildByName("back");
            this.backNode = _back;
            setWgtLayout(_back, [1, 1], [0.5, 1], [0, 0], false, true);
            this.backNode.originalPos = this.backNode.getPosition();


            var barbk = _back.getChildByName("barbk");
            this.barNode = barbk.getChildByName("bar");
            this.textPer = _back.getChildByName("text_per");
            this.textPer.ignoreContentAdaptWithSize(true);
            this.textPer.setString("正在加载" + getResourceClassName(this._resourceClass) + "资源");
            this.textJZ = _back.getChildByName("text_jiazai");
            this.textJZ.ignoreContentAdaptWithSize(true);
            this.textJZ.setString("请稍候");
        }

        UIEventBind(null, this, "disconnect", this.showThenHide);

        return true;
    },
    showThenHide: function () {
        if (this.backNode && !this.backNode.willClosing) {
            var that = this;
            this.backNode.stopAllActions();
            this.backNode.runAction(cc.sequence(
                cc.moveTo(0.1, that.backNode.originalPos.x, that.backNode.originalPos.y - that.backNode.getBoundingBox().height),
                cc.delayTime(2),
                cc.moveTo(0.1, that.backNode.originalPos)
            ));
        }
    },
    showThenClose: function (callback) {
        if (this.backNode) {
            var that = this;
            this.backNode.stopAllActions();
            this.backNode.willClosing = true;
            this.backNode.runAction(cc.sequence(
                cc.moveTo(0.1, that.backNode.originalPos.x, that.backNode.originalPos.y - that.backNode.getBoundingBox().height),
                cc.delayTime(2),
                cc.moveTo(0.1, that.backNode.originalPos),
                cc.callFunc(function () {
                    that.close();
                    if (callback) callback();
                })
            ));
        }
    },
    close: function () {
        if (MjClient.updateResourceClassUI) {
            MjClient.updateResourceClassUI.removeFromParent(true);
            MjClient.updateResourceClassUI = null;
        }
    },
    run_load: function (load_percent) {
        if (this._gameClass == MjClient.RESOURCE_CLASS.GOLD_FIELD) {
            postEvent("goldField_refreshUpdatePer", load_percent > 90 ? 90 : load_percent);
        }
        else {
            this.barNode.setPercent(load_percent);
            this.textJZ.setString("已完成" + load_percent + "%");
        }
    },
    onExit: function () {
        this._super();

        if (this.manager) {
            this.manager.release();
            this.manager = null;
        }

        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }

        setSearchPathByPaths(this._oldSearchPaths, "UpdateResourceClassView oldSearchPaths");
        MjClient.updateResourceClassUI = null;
    },
    onEnter: function () {
        this._super();


        var appPath = "";
        if (cc.sys.OS_WINDOWS == cc.sys.os) {
            appPath = MjClient.Window_AppPath;
        }

        var resourceManifestPath = getManifestFilePath(this._resourceClass);
        var resourceClassSearchPaths = [
            jsb.fileUtils.getWritablePath() + "update/res",
            appPath + "res"
        ];
        setSearchPathByPaths(resourceClassSearchPaths, "UpdateResourceClassView start");

        var manifest = MjClient.updateResIndex == 2 ? "/project_2.manifest" : "/project.manifest";
        if (manifest != "/project.manifest" && !jsb.fileUtils.isFileExist(resourceManifestPath + manifest)) {
            manifest = "/project.manifest";
        }

        if (!jsb.fileUtils.isFileExist(resourceManifestPath + manifest)) {
            this.close();
            setSearchPathByPaths(this._oldSearchPaths, "UpdateResourceClassView oldSearchPaths");
            if (this._callback)
                this._callback();
            return;
        }

        //清理旧的temp文件
        jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/" + resourceManifestPath + "_temp/project.manifest.temp");
        jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/" + resourceManifestPath + "_temp/" + resourceManifestPath + ".zip.tmp");
        jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + "update/" + resourceManifestPath + "_temp");

        this.manager = createAssetsManager(resourceManifestPath + manifest, jsb.fileUtils.getWritablePath() + "update/" + resourceManifestPath);
        if (!this.manager || !this.manager.getLocalManifest().isLoaded()) {
            setSearchPathByPaths(this._oldSearchPaths, "UpdateResourceClassView oldSearchPaths");
            this.close();
            MjClient.showUnclosedMsg(resourceManifestPath + "版本文件加载失败，将重启游戏", function () {
                MjClient.restartGame();
            });
        }
        else {
            this._updateListener = new jsb.EventListenerAssetsManager(this.manager, this.updateCallback.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);
            this.manager.update();
            this.showThenHide();
        }
    },
    updateCallback: function (event) {
        MjClient.unblock();
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                break;
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            //case jsb.EventAssetsManager.ERROR_UPDATING://单个文件失败
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                setSearchPathByPaths(this._oldSearchPaths, "UpdateResourceClassView oldSearchPaths");
                // MjClient.showMsg(getResourceClassName(this._resourceClass) + "资源加载失败(code:" + event.getEventCode() + ")，请重试", function () {
                //     jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "/project.manifest");
                //     jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "_temp/project.manifest.temp");
                //     jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "_temp/" + getManifestFilePath(this._resourceClass) + ".zip.tmp");
                //     jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "_temp");
                //     this.close();
                //     CheckUpdateResourceClass(this._gameClass, this._callback);
                // }.bind(this), function () {
                //     this.close();
                // }.bind(this));

                // if (this._gameClass == MjClient.RESOURCE_CLASS.GOLD_FIELD) {
                //     postEvent("goldField_refreshUpdateFail", {});
                // }
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.__failCount++;
                if (this.__failCount < 5) {
                    this.manager.downloadFailedAssets();
                }
                else {
                    this.__failCount = 0;

                    cc.log("更新游戏内资源 " + getResourceClassName(this._resourceClass) + " 失败：resIndex=" + MjClient.updateResIndex);
                    MjClient.native.umengEvent4CountWithProperty("UpdateRes_fail", { resIndex: MjClient.updateResIndex });
                    MjClient.updateResIndex = MjClient.updateResIndex == 2 ? 1 : 2;

                    setSearchPathByPaths(this._oldSearchPaths, "UpdateResourceClassView oldSearchPaths");
                    // MjClient.showMsg(getResourceClassName(this._resourceClass) + "资源加载失败(code:" + event.getEventCode() + ")，请重试", function () {
                    //     jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "/project.manifest");
                    //     jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "_temp/project.manifest.temp");
                    //     jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "_temp/" + getManifestFilePath(this._resourceClass) + ".zip.tmp");
                    //     jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "_temp");
                    //     this.close();
                    //     CheckUpdateResourceClass(this._gameClass, this._callback);
                    // }.bind(this), function () {
                    //     this.close();
                    // }.bind(this));

                    // if (this._gameClass == MjClient.RESOURCE_CLASS.GOLD_FIELD) {
                    //     postEvent("goldField_refreshUpdateFail", {});
                    // }
                }
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.run_load(parseInt(event.getPercent()));
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                setSearchPathByPaths(this._oldSearchPaths, "UpdateResourceClassView oldSearchPaths");
                util.localStorageEncrypt.setStringItem("VERSION_RESOURCE_CLASS_" + this._resourceClass, this.manager.getLocalManifest().getVersion());
                this.showThenClose(function () {
                    if (MjClient.UpdateResourceClassViewCallback) {
                        delete MjClient.UpdateResourceClassViewCallback;
                        if (cc.sys.isObjectValid(MjClient.webViewLayer)) MjClient.webViewLayer.close();
                        if (cc.sys.isObjectValid(MjClient.shareWXOrXLLayer)) {
                            MjClient.shareWXOrXLLayer.removeFromParent();
                            MjClient.shareWXOrXLLayer = null;
                        }
                        if (cc.sys.isObjectValid(MjClient.setui)) {
                            MjClient.setui.removeFromParent();
                            MjClient.setui = null;
                        }
                        if (this._callback) this._callback();
                    }
                }.bind(this));
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                MjClient.native.umengEvent4CountWithProperty("UpdateRes_success", { resIndex: MjClient.updateResIndex });

                setSearchPathByPaths(this._oldSearchPaths, "UpdateResourceClassView oldSearchPaths");
                jsb.fileUtils.removeFile(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "/project.manifest");
                jsb.fileUtils.renameFile(jsb.fileUtils.getWritablePath() + "update/" + getManifestFilePath(this._resourceClass) + "/", "project_rename.manifest", "project.manifest");
                cc.log("VERSION_RESOURCE_CLASS_" + this._resourceClass + ":" + this.manager.getLocalManifest().getVersion());
                util.localStorageEncrypt.setStringItem("VERSION_RESOURCE_CLASS_" + this._resourceClass, this.manager.getLocalManifest().getVersion());
                if (this._gameClass == MjClient.RESOURCE_CLASS.GOLD_FIELD) {
                    postEvent("goldField_refreshUpdatePer", 100);
                    this.text.setString("娱乐场资源加载完成！");
                } else {
                    this.textJZ.setString("加载成功!");
                }
                this.showThenClose(function () {
                    if (MjClient.UpdateResourceClassViewCallback) {
                        delete MjClient.UpdateResourceClassViewCallback;
                        if (cc.sys.isObjectValid(MjClient.webViewLayer)) MjClient.webViewLayer.close();
                        if (cc.sys.isObjectValid(MjClient.shareWXOrXLLayer)) {
                            MjClient.shareWXOrXLLayer.removeFromParent();
                            MjClient.shareWXOrXLLayer = null;
                        }
                        if (cc.sys.isObjectValid(MjClient.setui)) {
                            MjClient.setui.removeFromParent();
                            MjClient.setui = null;
                        }
                        if (this._callback) this._callback();
                    }
                }.bind(this));
                break;
            default:
                break;
        }
    }
});

