var res = {
	Update_json: "A_Update.json",
	Login_json: "A_Login.json",
	Dlgagreement_json: "A_Dlgagreement.json",
	MobilePhoneLogin_json: "A_mobilePhoneLogin.json",
	RegisterPhoneNumLayer_json: "A_registerPhoneNumLayer.json",
	Home_json: "A_Home.json",
	UserInfo_json: "A_UserInfo.json",
	ChangeHead_json: "A_ChangeHead.json",
	ChangeNickName_json: "A_ChangeNickName.json",
	ChangePWD_json: "A_ChangePWD.json",
	Friendcard_main_json: "A_Friendcard_main.json",
	SelectRulePanel_json: "A_SelectRulePanel.json",
	Friendcard_nvguanjia_json: "A_Friendcard_nvguanjia.json",
	Friendcard_gaojiSet_json: "A_Friendcard_gaojiSet.json",
	Friendcard_info_json: "A_Friendcard_info.json",

	Create_json: "createHomeTotal.json",
	Enter_json: "enter.json",
	Play_json: "Play.json",
	Block_json: "block.json",
	FangQiang_json: "fangQiang.json",
	EndOne_json: "endOne.json",
	EndAll_json: "endAll.json",
	ShowFlow_json: "showFlowerTips.json",
	RestartTip_json: "restartGameTip.json",
	GameTip_json: "GameTip.json",
};

function initResourceDir() {
	var searthPaths = jsb.fileUtils.getSearchPaths();
	cc.log("-------------initResourceDir start all searchPath:");
	for (var i = 0; i < searthPaths.length; i++) {
		cc.log(searthPaths[i]);
	}

	var writablePath = jsb.fileUtils.getWritablePath();
	var appPath = "";
	if (cc.sys.OS_WINDOWS == cc.sys.os) {
		var appDirs = {};
		appDirs[MjClient.APP_TYPE.QXSYDTZ] = "../client";
		appDirs[MjClient.APP_TYPE.QXYYQP] = "../client";
		appDirs[MjClient.APP_TYPE.QXJSMJ] = "../client";
		appDirs[MjClient.APP_TYPE.YAAN] = "../client";

		var appDir = "";
		var appType = MjClient.getAppType();
		if (appType in appDirs)
			appDir = appDirs[appType];

		var searthPaths = jsb.fileUtils.getSearchPaths();
		for (var i = 0; i < searthPaths.length; i++) {
			if (searthPaths[i].indexOf(appDir) >= 0) {
				appPath = searthPaths[i];
				break;
			}
		}
		cc.log("appPath=" + appPath + " appType=" + appType);
	}

	MjClient.Window_AppPath = appPath;
	MjClient.RESOURCE_ROOTDIR = writablePath;
	if (cc.sys.OS_WINDOWS != cc.sys.os) {
		jsb.fileUtils.addSearchPath("", false);
		jsb.fileUtils.addSearchPath(writablePath + MjClient.RESOURCE_DIR[0], false);
		jsb.fileUtils.addSearchPath("res", false);
	}
	else {
		if (MjClient.windowUpdate) {
			jsb.fileUtils.addSearchPath(writablePath + MjClient.RESOURCE_DIR[0], false);
			jsb.fileUtils.addSearchPath(appPath + "res", false);
		}
		else {
			writablePath = appPath;
		}
		jsb.fileUtils.addSearchPath(writablePath + "res", false);
	}

	// for (var i = 1; i < MjClient.RESOURCE_DIR.length; i++) {
	//     if (MjClient.RESOURCE_DIR[i])
	//         jsb.fileUtils.addSearchPath(writablePath + MjClient.RESOURCE_DIR[i], false);
	// }

	var searthPaths = jsb.fileUtils.getSearchPaths();
	for (var i = 0; i < searthPaths.length; i++) {
		cc.log(searthPaths[i]);
	}

	cc.spriteFrameCache.addSpriteFrames("chat/emoji_action_texture.plist");
	cc.spriteFrameCache.addSpriteFrames("chat/emoji.plist");
}

var sortSearchPath = function (gameType) {
	var searthPaths = jsb.fileUtils.getSearchPaths();
	var resourceClass = ResourceClass[GameClass[gameType]];
	var resourceDir = MjClient.RESOURCE_DIR[resourceClass];
	if (resourceClass == 0 || !resourceDir)
		return;

	searthPaths.sort(function (a, b) {
		if (a.indexOf(resourceDir) >= 0)
			return -1;
		else if (b.indexOf(resourceDir) >= 0)
			return 1;

		for (var i = 1; i < MjClient.RESOURCE_DIR.length; i++) {
			if (a.indexOf(MjClient.RESOURCE_DIR[i]) >= 0)
				return -1;
			else if (b.indexOf(MjClient.RESOURCE_DIR[i]) >= 0)
				return 1;
		}

		return 0;
	});

	setSearchPathByPaths(searthPaths, "sortSearchPath");
}

var resortSearchPath = function () {
	var searthPaths = jsb.fileUtils.getSearchPaths();

	searthPaths.sort(function (a, b) {
		for (var i = MjClient.RESOURCE_DIR.length - 1; i > 0; i--) {
			if (a.indexOf(MjClient.RESOURCE_DIR[i]) >= 0)
				return 1;
			else if (b.indexOf(MjClient.RESOURCE_DIR[i]) >= 0)
				return -1;
		}

		return 0;
	});

	setSearchPathByPaths(searthPaths, "resortSearchPath");
}

var setSearchPath = function (gameType) {
	var searthPaths = jsb.fileUtils.getSearchPaths();
	var resourceClass = ResourceClass[GameClass[gameType]];
	var resourceDir = MjClient.RESOURCE_DIR[resourceClass];
	if (resourceClass == 0 || !resourceDir)
		return;

	for (var i = searthPaths.length - 1; i >= 0; i--) {
		for (var j = 1; j < MjClient.RESOURCE_DIR.length; j++) {
			if (searthPaths[i].indexOf(MjClient.RESOURCE_DIR[j]) >= 0) {
				searthPaths.splice(i, 1);
				break;
			}
		}
	}
	if (cc.sys.OS_WINDOWS != cc.sys.os || MjClient.windowUpdate) {
		searthPaths.unshift(MjClient.RESOURCE_ROOTDIR + resourceDir);
	} else {
		searthPaths.unshift(MjClient.Window_AppPath + resourceDir);
	}

	setSearchPathByPaths(searthPaths, "setSearchPath");
}

var setSearchPathByPaths = function (searthPaths, tag) {
	jsb.fileUtils.setSearchPaths(searthPaths);

	tag = tag || "searchPaths";
	searthPaths = jsb.fileUtils.getSearchPaths();
	cc.log(tag + " paths:");
	for (var i = 0; i < searthPaths.length; i++) {
		cc.log(searthPaths[i]);
	}
}
var MjClient = {}

var RemoveRoomView;
var StopRoomView;
var WebViewLayer;
var InfoLayer;
var PlayLogView;
var PlayerInfoView;
var LoginView;
var UpdateView;
var CreateView;
var ChangeUidView;
var ExportDataView;
function postEvent(eName, ePara) { cc.eventManager.dispatchCustomEvent(eName, ePara); }
function createSpine(skeletonDataFile, atlasFile) {
	if (cc.ENGINE_VERSION.indexOf("3.16") >= 0)
		return sp.SkeletonAnimation.createWithJsonFile(skeletonDataFile, atlasFile);
	else
		return new sp.SkeletonAnimation(skeletonDataFile, atlasFile);
}



var g_ErrorCode =
	[
		"null",
		"没有可用的连接",
		"请求发生异常",
		"消息数组为空",
		"消息为空",
		"获取配置信息失败",
		"网络异常",//"pomelo异常",
		"获取主机端口失败",
		"8",
		"9",
		"没有版本号",
		"下载版本失败",
		"读取版本号失败",
		"NEW_VERSION_FOUND",
		"ALREADY_UP_TO_DATE",
		"UPDATE_PROGRESSION",
		"更新资源错误",
		"更新过程中断",
		"UPDATE_FINISHED",
		"更新失败",
		"解压失败"
	];




var logCount = 0;
function mylog(txt) {
	if (cc.sys.OS_WINDOWS != cc.sys.os) return;
	if (!MjClient.Scene) return;
	var size = MjClient.size;
	var helloLabel = new cc.LabelTTF(txt, "Arial", 20);
	// position the label on the center of the screen
	helloLabel.x = size.width / 2;
	helloLabel.y = - (50 * logCount);
	// add the label as a child to this layer
	MjClient.Scene.addChild(helloLabel);
	logCount++;
	helloLabel.zIndex = 2000;
	helloLabel.runAction(cc.sequence(cc.moveBy(10, 0, size.height), cc.callFunc(function () { helloLabel.removeFromParent(true); logCount--; })));
}


function setWgtLayout(wgt, pct, pos, off, isMax, isPar) {

	if (!wgt) {
		cc.log('setWgtLayout wgt is null')
		return;
	}

	var screen = MjClient.size;
	var cutsize = { width: 0, height: 0 };
	var scPar = 1;
	if (isPar) {
		var min = {};
		var psize = { width: wgt.parent.width, height: wgt.parent.height };      //wgt.parent.getSize();
		scPar = wgt.parent.scale;

		cutsize.width = Math.max(0, (psize.width * scPar - screen.width) / 2);
		cutsize.height = Math.max(0, (psize.height * scPar - screen.height) / 2);

		min.width = Math.min(screen.width, psize.width * scPar);
		min.height = Math.min(screen.height, psize.height * scPar);
		screen = min;
		//mylog(screen.width+" "+screen.height);
	}

	var size = { width: wgt.width, height: wgt.height }; //wgt.getSize();

	if (size.width == 0 || size.height == 0)
		return;

	var sw = screen.width * pct[0] / size.width, sh = screen.height * pct[1] / size.height;

	if (isMax == true) {
		var sc = Math.max(sw, sh);
		sw = sc; sh = sc;
	}
	else if (isMax == 2) {

	}
	else if (sw != 0 && sh != 0) {
		var sc = Math.min(sw, sh);
		sw = sc; sh = sc;
	}
	else {
		var sc = Math.max(sw, sh);
		sw = sc; sh = sc;
	}

	sw /= scPar; sh /= scPar;
	wgt.scaleX = sw; wgt.scaleY = sh;
	wgt.setPosition(
		cutsize.width / scPar + screen.width * pos[0] / scPar + off[0] * size.width * sw,
		cutsize.height / scPar + screen.height * pos[1] / scPar + off[1] * size.height * sh
	);
}

function UIEventBind(pjs, node, evt, func) {
	if (!node) return MjClient.showToast("当前节点不存在 节点注册事件名字： " + evt);

	cc.eventManager.addListener(cc.EventListener.create({
		event: cc.EventListener.CUSTOM,
		eventName: evt,
		callback: function (et) {
			func.call(node, et.getUserData(), evt);
		}
	}), node);
	if (evt == "resize") func.call(node);
}
var FunctionBind = {
	_event: function (pjs, node, js) {
		for (var evt in js) {
			UIEventBind(pjs, node, evt, js[evt]);
			//cc.eventManager.addCustomListener(evt,func);
		}
	},
	_index: function (pjs, node, js) {
		node.zIndex = js;
	},
	_touch: function (pjs, node, js) {
		node.addTouchEventListener(js, node);
	},
	_click: function (pjs, node, js) {
		node.addTouchEventListener(function (btn, eT) {
			if (eT == 2) {
				js(btn, eT);
			}
		}, node);
	}
	, _visible: function (pjs, node, js) {
		if (typeof js == "function") node.visible = js();
		else node.visible = js;
	}
	, _keyboard: function (pjs, node, js) {
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed: js.onKeyPressed,
			onKeyReleased: js.onKeyReleased,
		}, node);
	}
	, _check: function (pjs, node, js) {
		node.addEventListener(js, pjs);
	}
	, _layout: function (pjs, node, js) {
		var ar = [node]; for (var i = 0; i < js.length; i++)ar.push(js[i]);
		UIEventBind(pjs, node, "resize", function () {
			setWgtLayout.apply(node, ar);
		});
	},
	_text: function (pjs, node, js) {
		node.setString(js())

	},
	_run: function (pjs, node, js) {
		js.call(node);
	}
	, _slider: function (pjs, node, js) {
		node.addEventListener(js, node);
	}
	, _listener: function (pjs, node, js) {
		node.addEventListener(js, node);
	}
}

function BindUiAndLogic(node, js) {
	if (node == null) return;

	for (var cd in js) {
		if (cd.substr(0, 1) == "_") {

			var func = FunctionBind[cd];
			if (func) func(js, node, js[cd]);//js:{"_layout":[[1,1],[0.5,0.5],[0,0],true]}   node:{}  js[cd]:1,1,0.5,0.5,0,0,true
		}
		else {
			BindUiAndLogic(node.getChildByName(cd), js[cd]);
		}
	}
	js._node = node;
}


/*
 * 打印 JavaScript 函数调用堆栈
 */
function printCallStack(count) {
	var caller = arguments.callee.caller;
	var i = 0;
	count = count || 10;
	cc.log("***----------------------------------------  ** " + (i + 1));
	while (caller && i < count) {
		cc.log(caller.toString());
		caller = caller.caller;
		i++;
		cc.log("***---------------------------------------- ** " + (i + 1));
	}
}