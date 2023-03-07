// 溆浦跑胡子算法
(function() {
    function PaoHuZiXuPu() {
    	this.handCount = 20;   //庄家21张，其他玩家20张
    	this.LimitHuType = {};
        this.sortType = 0;  //默认排序
    }

	PaoHuZiXuPu.prototype.randomCards = function(areaSelectMode) {
		var cards = [
			101,102,103,104,105,106,107,108,109,110,//方块
	        201,202,203,204,205,206,207,208,209,210,//梅花
	        301,302,303,304,305,306,307,308,309,310,//红桃
	        401,402,403,404,405,406,407,408,409,410,//黑桃
	        101,102,103,104,105,106,107,108,109,110,//方块
	        201,202,203,204,205,206,207,208,209,210,//梅花
	        301,302,303,304,305,306,307,308,309,310,//红桃
	        401,402,403,404,405,406,407,408,409,410 //黑桃
		];

		shuffleArray(cards);

		return cards;
	};

	PaoHuZiXuPu.prototype.cardsCount = function() {
		return 80;
	};

	PaoHuZiXuPu.prototype.value = function(card) {
	    var value = card;
	    if (value > 300){
	        value -= 200;
	    }
	    return value;
	};

	PaoHuZiXuPu.prototype.sameValue = function(card1, card2) {
	    return card1 == card2 || Math.abs(card1 - card2) == 200;
	};

	// card的数量
	PaoHuZiXuPu.prototype.cardHandCount = function(cardArr, card) {
		var cardCount = 0;
		for (var i = 0, length = cardArr.length; i < length; i++) {
			if (this.sameValue(cardArr[i], card)) {
				cardCount++;
			}
		}
		return cardCount;
	};

	// card的绝对数量
	PaoHuZiXuPu.prototype.cardHandAbsCount = function(cardArr, card) {
		var cardCount = 0;
		for (var i = 0, length = cardArr.length; i < length; i++) {
			if (cardArr[i] == card) {
				cardCount++;
			}
		}
		return cardCount;
	};

	// 获取其他花色但数值相同的牌
	PaoHuZiXuPu.prototype.getOtherCards = function(cardArr, card) {
		var cards = [];
		for (var i = 0, length = cardArr.length; i < length; i++) {
			if (!this.sameValue(cardArr[i], card) && cardArr[i] % 100 == card % 100) {
				cards.push(cardArr[i]);
			}
		}
		return cards;
	};

	// 获取相同花色和数值相同的牌
	PaoHuZiXuPu.prototype.getSameCards = function(cardArr, card) {
		var cards = [];
		for (var i = 0, length = cardArr.length; i < length; i++) {
			if (this.sameValue(cardArr[i], card)) {
				cards.push(cardArr[i]);
			}
		}
		return cards;
	};

	// 使用哪种类型进行跑牌 1:手牌有三张  2:偎牌有三张  3:碰牌有三张
	// isNew 是否是从牌堆摸的牌
	PaoHuZiXuPu.prototype.paoPos = function(pl, putCard, isNew) {
		if (this.cardHandCount(pl.mjhand, putCard) == 3) {
			return 1;
		}

		for(var i = 0; i < pl.mjwei.length; i++) {
			if(this.sameValue(pl.mjwei[i][0], putCard)) {
				return 2;
			}
		}

		if(isNew) {
			for(var i = 0; i < pl.mjpeng.length; i++) {
				if(this.sameValue(pl.mjpeng[i][0], putCard)) {
					return 3;
				}
			}
		}

		return 0;
	};

	//跑牌
	PaoHuZiXuPu.prototype.canPao = function(pl,putCard,isNew) {
		var pos = this.paoPos(pl,putCard,isNew);
		return pos > 0;	
	};

	//获得能吃的牌
	PaoHuZiXuPu.prototype.getChiSet = function(cardArr, putCard, isBi) {
		cardArr = cardArr.slice();
		var chiSet = [];
		var chiRules = [
			[-1, 1],
			[1, 2],
			[-1, -2]
		];
		for (var i = 0; i < chiRules.length; i++) {
			var rule = chiRules[i];
			var firstCard = putCard + rule[0];
			var secCard = putCard + rule[1];
			if (this.cardHandCount(cardArr, firstCard) > 0 && this.cardHandCount(cardArr, firstCard) <= 2 &&
				this.cardHandCount(cardArr, secCard) > 0 && this.cardHandCount(cardArr, secCard) <= 2) {
				var set = [putCard, firstCard, secCard];
				// set.sort(function(a, b) {
				// 	return (a % 100) - (b % 100);
				// });
				chiSet.push(set);
			}
		}

		var otherRulesCards = [
			[102, 107, 110], //红
			[102, 107, 310],
			[102, 307, 310],
			[102, 307, 110],
			[302, 307, 310],
			[302, 307, 110],
			[302, 107, 110],
			[302, 107, 310],

			[202, 207, 210], //黑
			[202, 207, 410],
			[202, 407, 410],
			[202, 407, 210],
			[402, 407, 410],
			[402, 407, 210],
			[402, 207, 410],
			[402, 207, 210]
		];

		var otherRules = [
			[2, 7, 10]
		];

		for (var k = 0; k < otherRules.length; k++) {
			var other = otherRules[k];
			var cardIndex = other.indexOf(putCard % 100);
			if (cardIndex >= 0) {
				var ss = true;
				var ruleCards = [];
				for(var idx = 0; idx < otherRulesCards.length; idx++) {
					if(otherRulesCards[idx].indexOf(putCard) >= 0){
						ruleCards = otherRulesCards[idx];
						break;
					}
				}

				for (var i = 0; i < ruleCards.length; i++) {
					if (ruleCards[i] == putCard) {
						continue;
					}
					if (this.cardHandCount(cardArr, ruleCards[i]) == 0 || this.cardHandCount(cardArr, ruleCards[i]) > 2) {
						ss = false;
					}
				}
				if (ss) {
					var set = [];
					for(var j = 0; j < ruleCards.length; j++) {
						if(j == cardIndex) {
							set.push(putCard);
						}else {
							set.push(this.getSameCards(cardArr, ruleCards[j])[0]);
						}
					}
					chiSet.push(set);
				}
			}
		}

		var type = Math.floor(putCard / 100) % 2;
		var another = type == 1 ? putCard + 100 : putCard - 100;
		var anotherCount = this.cardHandCount(cardArr, another);
		var cardCount = this.cardHandCount(cardArr, putCard);
		var tmpCardCount = cardCount == 0 ? 1 : cardCount;
		if (anotherCount <= 2 && tmpCardCount <= 2 && (anotherCount + tmpCardCount) >= (isBi ? 3 : 2)) {
			var set = null;
			var anotherCards = this.getOtherCards(cardArr, putCard);
			var sameCards = this.getSameCards(cardArr, putCard);

			if (anotherCount == 2) {
				set = [putCard, anotherCards[0], anotherCards[1]];
				// set.sort(function(a, b) {
				// 	return (a % 100) - (b % 100);
				// });
				chiSet.push(set);
				if (cardCount > 0) {
					set = [putCard, sameCards[0], anotherCards[0]];
					// set.sort(function(a, b) {
					// 	return (a % 100) - (b % 100);
					// });
					if(isBi) {
						if(cardCount == 2) {
							chiSet.push(set);
						}
					}else {
						chiSet.push(set);
					}
				}
			}
			if (anotherCount == 1 && cardCount > 0) {
				set = [putCard, sameCards[0], anotherCards[0]];
				// set.sort(function(a, b) {
				// 	return (a % 100) - (b % 100);
				// });
				chiSet.push(set);
			}
		}

		// 比牌不加入 modified 2019-10-9
		if (!isBi) {
			cardArr.push(putCard);
		}
		
		//还原成实际的牌
		for(var i = 0; i < chiSet.length; i++) {
			var set = chiSet[i];
			this.restoreChiSet(cardArr, set, isBi ? null : putCard);
		}
		return chiSet;
	};

	PaoHuZiXuPu.prototype.restoreChiSet = function(cardArr, set, putCard) {
		cardArr = cardArr.slice();
		for(var j = 0; j < set.length; j++) {
			if(cardArr.indexOf(set[j]) >= 0){
				cardArr.splice(cardArr.indexOf(set[j]), 1);
				continue;
			}
			for(var n = 0; n < cardArr.length; n++) {
				var c = cardArr[n];
				if(this.sameValue(set[j], c)) {
					if(!this.sameValue(set[j], putCard)) {
						set[j] = c;
					}
					break;
				}
			}
		}
	};

	PaoHuZiXuPu.prototype.canChiCard = function(mjhand, putCard) {
		if (!putCard) {
			return false;
		}

		var chiSet = this.getChiSet(mjhand, putCard);
		//针对每种吃的牌进行判断
		for (var i = 0; i < chiSet.length; i++) {
			var tmpSet = chiSet[i];
			var tmpCardArr = tmpSet.slice();
			this.removeSameCard(tmpCardArr, putCard);

			var baseArr = mjhand.slice();
			for (var k = 0; k < tmpCardArr.length; k++) {
				baseArr.splice(baseArr.indexOf(tmpCardArr[k]), 1);
			}
			if (this.getCardCount(baseArr, putCard) > 0) {
				this.removeSameCard(baseArr, putCard);

				var biCards = this.getChiSet(baseArr, putCard, true);
				if (biCards.length > 0) {
					for (var k = 0; k < biCards.length; k++) {
						var tmpBiSet = biCards[k];
						this.removeSameCard(tmpBiSet, putCard);
						var array = baseArr.slice();
						for (var m = 0; m < tmpBiSet.length; m++) {
							array.splice(array.indexOf(tmpBiSet[m]), 1);
						}
						if (this.getCardCount(array, putCard) > 0) {
							array.splice(array.indexOf(putCard), 1);
							var secBiCards = this.getChiSet(array, putCard, true);
							if (secBiCards.length > 0 && this.remove34Left(array) > 2) {
								return true;
							}
						} else if (this.remove34Left(array) > 0) {
							return true;
						}
					}
				}
			} else if (this.remove34Left(baseArr) > 0) {
				return true;
			}
		}
		return false;
	};

	//是否可以碰
	PaoHuZiXuPu.prototype.canPeng = function(mjhand, putCard) {
		var cardCount = this.cardHandCount(mjhand, putCard);
		if (cardCount != 2) {
			return false;
		}
		return true;
	};

	PaoHuZiXuPu.prototype.getCardCount = function(cardArr, card) {
		var count = 0;
		for (var i = 0; i < cardArr.length; i++) {
			if (cardArr[i].length) {
	            count += this.getCardCount(cardArr[i], card);
	        } else if (this.sameValue(cardArr[i], card)) {
				count++;
			}
		}

		return count;
	}

	//二维
	PaoHuZiXuPu.prototype.getCardIdxInArr = function(cardArr, card) {
		for (var i = 0; i < cardArr.length; i++) {
			if(cardArr[i].indexOf(card) >= 0) {
				return i;
			}
		}

		return -1;
	}

	//刷新mjsort中的index(主要针对提、跑)
	PaoHuZiXuPu.prototype.updateSortIndex = function(mjsort, name, beginIndex) {
	    for (var i=0;i<mjsort.length;i++) {
	        var sort = mjsort[i];
	        if(sort.name == name){
	            if(sort.pos >= beginIndex){
	                sort.pos -= 1;
	            }
	        }
	    }  
	}

	PaoHuZiXuPu.prototype.handNum = function(pl, card) {
		var rtn = 0;
		for (var i = 0; i < pl.mjhand.length; i++) {
			if (this.sameValue(pl.mjhand[i], card)) rtn++;
		}
		return rtn;
	}

	PaoHuZiXuPu.prototype.remove34Left = function(hand) {
		var cardNum = {};
		for (var i = 0; i < hand.length; i++) {
			var card = this.value(hand[i]);
			cardNum[card] = this.cardHandCount(hand, card);
		}

		var count = 0;
		for (var k in cardNum) {
			if (cardNum[k] < 3) {
				count += cardNum[k];
			}
		}
		return count;
	}

	PaoHuZiXuPu.prototype.isRed = function(card) {
		return (card % 100 == 2 || card % 100 == 7 || card % 100 == 10)
	}

	PaoHuZiXuPu.prototype.getLong = function(pl) {
	    var longList = [];
	    var cardNum = {};
	    for (var i = 0; i < pl.mjhand.length; i++) {
	        var card = this.value(pl.mjhand[i]);
	        cardNum[card] = cardNum[card] ? cardNum[card] + 1 : 1;
	    }

	    for (var k in cardNum) {
	        if (cardNum[k] == 4) {
	            longList.push(Number(k));
	        }
	    }
		return longList;
	}

	PaoHuZiXuPu.prototype.getRelateCount = function(hand, card) {
		// 牌点少2，牌点少1，牌点等于，牌点大1，牌点大2，牌点一样 大小相反，组成2-7-10的其余牌 牌点较小的，组成2-7-10的其余牌 牌点较大的
		var num = [0, 0, 0, 0, 0, 0, 0, 0];
		if (card % 100 == 2 || card % 100 == 7 || card % 100 == 10) {
			if(this.sameValue(card, 202)){
				num[6] = this.cardHandCount(hand, 207);
				num[7] = this.cardHandCount(hand, 210);
			}
			else if(this.sameValue(card, 207)){
				num[6] = this.cardHandCount(hand, 202);
				num[7] = this.cardHandCount(hand, 210);
			}
			else if(this.sameValue(card, 210)){
				num[6] = this.cardHandCount(hand, 202);
				num[7] = this.cardHandCount(hand, 207);
			}
			else if(this.sameValue(card, 102)){
				num[6] = this.cardHandCount(hand, 107);
				num[7] = this.cardHandCount(hand, 110);
			}
			else if(this.sameValue(card, 107)){
				num[6] = this.cardHandCount(hand, 102);
				num[7] = this.cardHandCount(hand, 110);
			}
			else if(this.sameValue(card, 110)){
				num[6] = this.cardHandCount(hand, 102);
				num[7] = this.cardHandCount(hand, 107);
			}
		}

		for (var i = 0; i < hand.length; i++) {
			var dif = this.value(hand[i]) - this.value(card);
			switch (dif) {
				case -2:
				case -1:
				case 0:
				case 1:
				case 2:
					num[dif + 2]++;
					break;
				case 100:
				case -100:
					num[5]++;
					break;
			}
		}

		return num;
	}

	PaoHuZiXuPu.prototype.getAllCardCount = function(pl){
		var rtn = (pl.mjgang0.length + pl.mjgang1.length) * 4 + (pl.mjpeng.length + pl.mjwei.length) * 3;
		for (var i = 0; i < pl.mjchi.length; i++) {
			rtn += 3;

			var biCards = pl.mjchi[i].biCards;
			if (biCards) {
				for (var j = 0; j < biCards.length; j++) {
					var biRow = biCards[j];
					rtn += 3;
				}
			}
		}
		if (pl.mjhand) rtn += pl.mjhand.length;
		return rtn;
	};

	PaoHuZiXuPu.prototype.sortCard = function(hand, sortType) {
	    sortType = sortType || this.sortType % 3 + 1;
	    this.sortType = sortType;

	    var maxColNum = 10; 
	    var self = this;

	    // 有息句构成值
	    var xiList = [
	        [101, 102, 103], 
	        [102, 107, 110], 
	        [201, 202, 203], 
	        [202, 207, 210]
	    ];

	    // 无息句构成值
	    var wuXiList = [];
	    for (var i = 102; i <= 108; i++) {
	        wuXiList.push([i, i + 1, i + 2]);
	        wuXiList.push([i + 100, i + 101, i + 102])
	    }

	    // 绞牌构成值
	    var jiaoList = [];
	    for (var i = 101; i <= 110; i++) {
	        var jiao = i + 100;
	        jiaoList.push([i, i, jiao]);
	        jiaoList.push([i, jiao, jiao]);
	    }

	    // 排序
	    function sort(list, isJiao) {
	        // 纵向排序
	        for (var i = 0; i < list.length; i++) {
	            list[i].sort(function(a, b) {
	                return b - a;
	            });
	            list[i].sort(function(a, b) {
	                return self.value(b) - self.value(a);
	            });
	            if (isJiao) {
	                // 绞牌纵向排序比较特殊. 相同两张放下面
	                if (self.value(list[i][0]) == self.value(list[i][1])) {
	                    list[i].unshift(list[i].pop());
	                }
	            }
	        }
	        
	        // 横向排序
	        list.sort(function(arr1, arr2) {
	            return self.value(arr1[0]) - self.value(arr2[0]);
	        });
	    }

	    hand = hand.slice();
	    hand.sort(function(a, b) {
	        return self.value(a) - self.value(b);
	    });

	    var matrix = [];
	    var dict = [];
	    var dictCard = [];  
	    for (var i = 0; i < hand.length; i++) {
	        var value = self.value(hand[i]);
	        dict[value] = dict[value] ? dict[value] + 1 : 1;
	        if (dictCard[value]) {
	            dictCard[value].push(hand[i]);
	        } else {
	            dictCard[value] = [hand[i]];
	        }
	    }

	    function delRow(row) {
	        for (var i = 0; i < row.length; i++) {
	            var card = row[i];
	            var value = self.value(card);
	            hand.splice(hand.indexOf(card), 1);
	            dict[value]--;
	            dictCard[value].splice(dictCard[value].indexOf(card), 1);
	        }
	    }

	    // 获取3/4张
	    function getKanMatrix() {
	        var kanMatrix = [];
	        for (var k in dict) {      
	            if (dict[k] >= 3) {
	                var row = dictCard[k].slice();
	                kanMatrix.push(row);
	                delRow(row);
	            }
	        }
	        sort(kanMatrix);
	        return kanMatrix;
	    }

	    // 计算对子
	    function calDuiZiMatrix() {
	        var duiZiMatrix = [];
	        for (var k in dict) {     
	            if (dict[k] == 2) {
	                var row = dictCard[k].slice();
	                duiZiMatrix.push(row);
	                delRow(row);
	            }
	        }
	        sort(duiZiMatrix);
	        matrix = matrix.concat(duiZiMatrix);
	    }

	    // 获取一句话/绞牌 param1.是否句, param2.是否有息句
	    function calPatternMatrix(bJu, bXi) {
	        var patternMatrix = [];
	        var list = bJu ? (bXi ? xiList : wuXiList) : jiaoList;
	        // 模式匹配
	        var getPattern = function(pattern) {
	            var row = [];
	            if (dict[pattern[0]] > 0 && dict[pattern[1]] > 0 && dict[pattern[2]] > 0) {
	                if (bJu) {
	                    row.push(dictCard[pattern[0]][0], dictCard[pattern[1]][0], dictCard[pattern[2]][0]);
	                } else {
	                    if (pattern[0] == pattern[1]) {
	                        if (dict[pattern[0]] >= 2) {
	                            row.push(dictCard[pattern[0]][0], dictCard[pattern[1]][1], dictCard[pattern[2]][0]);
	                        }
	                    } else {
	                        if (dict[pattern[2]] >= 2) {
	                            row.push(dictCard[pattern[0]][0], dictCard[pattern[1]][0], dictCard[pattern[2]][1]);
	                        }
	                    }
	                }
	            }
	            if (row.length > 0) {
	                patternMatrix.push(row);
	                delRow(row);
	                getPattern(pattern);
	            }
	        }

	        for (var i = 0; i < list.length; i++) {
	            var pattern = list[i];
	            getPattern(pattern);
	        }

	        sort(patternMatrix, !bJu);
	        matrix = matrix.concat(patternMatrix);
	    }

	    // 获取有关联的牌
	    function calLinkMatrix(bJu, bXi) {
	        var linkMatrix = [];
	        var list = bJu ? (bXi ? xiList : wuXiList) : jiaoList;
	        for (var i = 0; i < list.length; i++) {
	            var row = list[i].slice();
	            var tmp = [];
	            for (var j = 0; j < 3; j++) {
	                var value = self.value(row[j]);
	                if (j > 0 && value == self.value(row[j - 1])) {
	                    continue;
	                }

	                if (dict[value] > 0) {
	                    tmp.push(dictCard[value][0]);
	                }
	            }
	            
	            if (tmp.length >= 2) {
	                linkMatrix.push(tmp);
	                delRow(tmp);
	            }
	        }

	        sort(linkMatrix, !bJu);
	        matrix = matrix.concat(linkMatrix);
	    }

	    // 按序计算
	    var kanMatrix = getKanMatrix();
	    // 1.有胡息一句话 -- 无胡息一句话 -- 绞牌 -- 对子 -- 有关联的牌  默认.
	    // 2.对子 -- 有胡息\无胡息一句话 -- 绞牌 -- 有关联的牌
	    // 3.有胡息一句话 -- 绞牌 -- 对子 -- 无胡息一句话 -- 有关联的牌
	    switch (sortType) {
	        case 1:
	            calPatternMatrix(true, true);
	            calPatternMatrix(true);
	            calPatternMatrix();
	            calDuiZiMatrix();
	            break;
	        case 2:
	            calDuiZiMatrix();
	            calPatternMatrix(true, true);
	            calPatternMatrix(true);
	            calPatternMatrix();
	            break;
	        case 3:
	            calPatternMatrix(true, true);
	            calPatternMatrix();
	            calDuiZiMatrix();
	            calPatternMatrix(true);
	            break;
	    }

	    calLinkMatrix(true, true);
	    calLinkMatrix(true);
	    calLinkMatrix();

	    for (var i = 0; i < hand.length; i++) {
	        matrix.push([hand[i]]);
	    }

	    // 最大列数处理
	    if (matrix.length + kanMatrix.length > maxColNum) {
	        var total = matrix.length + kanMatrix.length - maxColNum;
	        for (var i = 1; i <= total; i++) {
	            for (var j = 0; j < matrix.length; j++) {
	                if (matrix[j].length == 1) {
	                    for (var k = j + 1; k < matrix.length; k++) {
	                        if (matrix[k].length == 1) {
	                            matrix[j] = matrix[j].concat(matrix[k]);
	                            matrix.splice(k, 1);
	                            j = matrix.length;
	                            break;
	                        }
	                    }
	                }
	            }
	        }
	    }

	    return kanMatrix.concat(matrix);
	}

	// 能否胡牌
	PaoHuZiXuPu.prototype.canHu = function(tb, pl, card) {
		var huMatrix = [];
		var allHuMatrix_pao = null;
		var max_pao = null;
		var canPaoHu = false;
		var maxWinOne = 0; // 过胡判断用
		// 能否跑胡
		if (card) {
			var plCpy = {
				mjpeng: [],
				mjwei: [],
				mjgang0: [],
				mjgang1: [],
				mjchi: [],
				mjhand: []
			}
			for (var k in plCpy) {
				if(k == "mjpeng" || k == "mjwei") {
					var list = pl[k];
					for(var i = 0; i < list.length; i++) {
						plCpy[k].push(list[i].concat());
					}
				}else {
					plCpy[k] = Array.prototype.concat.apply([], pl[k]);
				}
			}
			plCpy.uid = pl.uid;
			plCpy.limitHuTypeList = pl.limitHuTypeList || [];
			plCpy.isPutCardOnce = pl.isPutCardOnce;

			var canPao = false;
			if (this.getCardCount(plCpy.mjpeng, card) > 0 && tb.tData.putType == 1) {
				for(var i = 0; i < plCpy.mjpeng.length; i++) {
					if(this.sameValue(plCpy.mjpeng[i][0], card)) {
						plCpy.mjpeng.splice(i, 1);
					}
				}
				canPao = true;
			} else if (this.getCardCount(plCpy.mjwei, card) > 0) {
				for(var i = 0; i < plCpy.mjwei.length; i++) {
					if(this.sameValue(plCpy.mjwei[i][0], card)) {
						plCpy.mjwei.splice(i, 1);
					}
				}
				canPao = true;
			} else if (this.handNum(plCpy, card) == 3) {
				canPao = true;
				for (var i = 0; i < 3; i++) {
					this.removeSameCard(plCpy.mjhand, card);
				}
			}

			if (canPao && plCpy.mjhand.length > 0) {
				plCpy.mjgang0.push(card);
				allHuMatrix_pao = this.canHuHand(plCpy, null);
				if (allHuMatrix_pao.length > 0) {
					max_pao = this.maxHu(tb, plCpy, null, allHuMatrix_pao);
					if (this.getHuxi(tb, plCpy, null, false) + max_pao.maxHuxi >= tb.tData.minHuxi) 
					{
						canPaoHu = true;
					}
				}
			}
		}

		var allHuMatrix = this.canHuHand(pl, card);
		if (allHuMatrix.length > 0) {
			var max = this.maxHu(tb, pl, card, allHuMatrix);
			if (this.getHuxi(tb, pl, card, false) + max.maxHuxi >= tb.tData.minHuxi) {
				if (!(canPaoHu && max_pao.maxWinOne > max.maxWinOne)) {
					huMatrix.push(allHuMatrix[max.maxIdx]);
					maxWinOne = max.maxWinOne;
				}
			}
		}

		if (canPaoHu && huMatrix.length == 0) {
			var v = this.value(card);
			var row = [[v, v, 200 + v, 200 + v]];
			huMatrix.push(row.concat(allHuMatrix_pao[max_pao.maxIdx]));
			maxWinOne = max_pao.maxWinOne;
		}

		return {huMatrix: huMatrix, maxWinOne: maxWinOne};
	}

	// 获取胡牌组合
	PaoHuZiXuPu.prototype.canHuHand = function(pl, card) {
		var self = this;
		var hand = [].concat(pl.mjhand);
		var tempCard = card;
		card = this.value(card);
		if (card) hand.push(card);

		var huMatrix = [];
		var allHuMatrix = [];

		if (card === undefined) {
			return allHuMatrix;
		}

		var cardNum = {};
		for (var k = 0; k < hand.length; k++) {
			cardNum[this.value(hand[k])] = this.cardHandCount(hand, hand[k]);
		}

		// p破跑
		if (card && cardNum[this.value(card)] == 4) {
			var list = this.getSameCards(hand, card);
			list.splice(list.indexOf(card), 1);
			huMatrix.push([card, list[0], list[1]]);
			cardNum[this.value(card)] -= 3;
		}

		var longNum = 0;
		// 坎 垅
		for (var k in cardNum) {
			if ((cardNum[k] == 3 && !(card && this.sameValue(Number(k), card))) || cardNum[k] == 4) {
				var list = this.getSameCards(hand, Number(k));
				list.splice(list.indexOf(Number(k)), 1);
				list.unshift(Number(k));

				var cardRow = [];
				for (var i = 0; i < cardNum[k]; ++i) {
					cardRow.push(list[i]);
				}
				huMatrix.push(cardRow);

				if (cardNum[k] == 4) {
					longNum++;
				}
			}
		}

		if (longNum > 0) { // 手牌中有垅 牌不够 不能胡
			var allCardCount = this.getAllCardCount(pl);
			if (card) allCardCount++;

			var initHandCount = 14;
			if (allCardCount >= 21) {  // 字牌只有15张(15-18) 21张 (21-26)
				initHandCount = 20;
			}

			if (allCardCount - pl.mjgang0.length - pl.mjgang1.length - longNum < initHandCount) {
				return [];
			}
		}

		var twoIdxTab = [];
		var popTwoIdx = -1;

		var fiveIdxTab = [];
		var popFiveIdx = -1;

		var popColIdx = -1;
		var colLinkNum = [];

		function hu() {
			var isRowHu = true;
			var tmpHuMatrix = [].concat(huMatrix);

			function getRow() {
				for (var k in cardNum) //是否顺序 遍历?！！！！！
				{
					if (cardNum[k] > 0 && cardNum[k] < 3) {
						var myK = parseInt(k);
						if (myK % 100 < 9 && cardNum[myK + 1] > 0 && cardNum[myK + 1] < 3 && cardNum[myK + 2] > 0 && cardNum[myK + 2] < 3) {
							cardNum[myK]--;
							cardNum[myK + 1]--;
							cardNum[myK + 2]--;
							tmpHuMatrix.push([myK, myK + 1, myK + 2]);
							getRow();
							cardNum[myK]++;
							cardNum[myK + 1]++;
							cardNum[myK + 2]++;
						} else {
							isRowHu = false;
						}
						break;
					} else if (cardNum[k] < 0) // bug 算胡时多牌了
					{
						isRowHu = false;
					}
				}
			}
			getRow();
			if (isRowHu) {
				allHuMatrix.push(tmpHuMatrix);
			}

			for (var i = 100; i <= 109; i++) {
				if (i >= popColIdx && colLinkNum[i] >= 3) {
					if (i == popColIdx && colLinkNum[i] == 4) {
						// console.log("InCol:" + popColIdx);
						popColIdx = i + 0.5;
						cardNum[i + 1] -= 1;
						cardNum[i + 101] -= 2;
						colLinkNum[i] -= 3;
						huMatrix.push([i + 101, i + 101, i + 1]);
						hu();
						huMatrix.pop();
						colLinkNum[i] += 3;
						cardNum[i + 1] += 1;
						cardNum[i + 101] += 2;
						popColIdx = i + 0.5;
						// console.log("outCol:" + popColIdx);
					} else if (i > popColIdx) {
						popColIdx = i;
						// console.log("inCol:" +  popColIdx);
						colLinkNum[i] -= 3;
						if (cardNum[i + 1] == 2) {
							if (colLinkNum[i] == 1) {
								cardNum[i + 1] -= 2;
								cardNum[i + 101] -= 1;
								huMatrix.push([i + 101, i + 1, i + 1]);
								hu();
								popColIdx = i;
								colLinkNum[i] += 3;
								huMatrix.pop();
								cardNum[i + 1] += 2;
								cardNum[i + 101] += 1;
								i--; // 这种情况i 还是原值
							} else {
								cardNum[i + 1] -= 2;
								cardNum[i + 101] -= 1;
								huMatrix.push([i + 101, i + 1, i + 1]);
								hu();
								huMatrix.pop();
								popColIdx = i;
								colLinkNum[i] += 3;
								cardNum[i + 1] += 2;
								cardNum[i + 101] += 1;
							}
						} else if (cardNum[i + 1] == 1) {
							cardNum[i + 1] -= 1;
							cardNum[i + 101] -= 2;
							huMatrix.push([i + 101, i + 101, i + 1]);
							hu();
							huMatrix.pop();
							popColIdx = i;
							colLinkNum[i] += 3;
							cardNum[i + 1] += 1;
							cardNum[i + 101] += 2;
						}
						// console.log("outCol:" + popColIdx);
					}
				}
			}
		}

		function noTwoTypeHu() {
			popColIdx = -1;
			colLinkNum = [];
			for(var i = 100; i <= 109; i++) {
				colLinkNum[i] = 0;
			}
			for (var i = 100; i <= 109; i++) {
				if (cardNum[i + 1] < 3) {
					colLinkNum[i] += cardNum[i + 1];
				}

				if (cardNum[i + 101] < 3) {
					colLinkNum[i] += cardNum[i + 101];
				}
			}
			// console.log(colLinkNum);
			hu();

			for (var i = 0; i < twoIdxTab.length; i++) {
				if (twoIdxTab[i] > popTwoIdx) {
					// console.log("-----------------------InTwoIdx" + twoIdxTab[i])
					popTwoIdx = twoIdxTab[i];
					switch (twoIdxTab[i]) {
						case 3:
							cardNum[102]--;
							cardNum[107]--;
							cardNum[110]--;
							huMatrix.push([102, 107, 110]);
							noTwoTypeHu();
							huMatrix.pop();
							cardNum[102]++;
							cardNum[107]++;
							cardNum[110]++;
							break;
						case 4:
							cardNum[102]--;
							cardNum[107]--;
							cardNum[110]--;
							huMatrix.push([102, 107, 110]);
							noTwoTypeHu();
							huMatrix.pop();
							cardNum[102]++;
							cardNum[107]++;
							cardNum[110]++;
							break;
						case 1:
							cardNum[202]--;
							cardNum[207]--;
							cardNum[210]--;
							huMatrix.push([202, 207, 210]);
							noTwoTypeHu();
							huMatrix.pop();
							cardNum[202]++;
							cardNum[207]++;
							cardNum[210]++;
							break;
						case 2:
							cardNum[202]--;
							cardNum[207]--;
							cardNum[210]--;
							huMatrix.push([202, 207, 210]);
							noTwoTypeHu();
							huMatrix.pop();
							cardNum[202]++;
							cardNum[207]++;
							cardNum[210]++;
							break;
					}
					popTwoIdx = twoIdxTab[i];
					// console.log("-----------------------outTwoIdx" + twoIdxTab[i])
				}
			}
		}

		function initTwoIdxTab() {
			popTwoIdx = -1;

			twoIdxTab = [];
			if (cardNum[202] > 0 && cardNum[202] < 3 && cardNum[207] > 0 && cardNum[207] < 3 && cardNum[210] > 0 && cardNum[210] < 3)
				twoIdxTab.push(1);
			if (cardNum[202] == 2 && cardNum[207] == 2 && cardNum[210] == 2)
				twoIdxTab.push(2);
			if (cardNum[102] > 0 && cardNum[102] < 3 && cardNum[107] > 0 && cardNum[107] < 3 && cardNum[110] > 0 && cardNum[110] < 3)
				twoIdxTab.push(3);
			if (cardNum[102] == 2 && cardNum[107] == 2 && cardNum[110] == 2)
				twoIdxTab.push(4);
		}

		function twoCardInHandHu() {
			// 手牌里有两张 card一样的
			if (card && cardNum[self.value(card)] == 3) {
				var num = self.getRelateCount(hand, card);

				if (num[3] > 0 && num[3] < 3 && num[4] > 0 && num[4] < 3) {
					// console.log("inChi 0");
					cardNum[card]--;
					cardNum[card + 1]--;
					cardNum[card + 2]--;
					huMatrix.push([card, card + 1, card + 2]);
					initTwoIdxTab();
					noTwoTypeHu();
					huMatrix.pop();
					cardNum[card]++;
					cardNum[card + 1]++;
					cardNum[card + 2]++;
					// console.log("outChi 0");
				}

				if (num[1] > 0 && num[1] < 3 && num[3] > 0 && num[3] < 3) {
					// console.log("inChi 1");
					cardNum[card - 1]--;
					cardNum[card]--;
					cardNum[card + 1]--;
					huMatrix.push([card - 1, card, card + 1]);
					initTwoIdxTab();
					noTwoTypeHu();
					huMatrix.pop();
					cardNum[card - 1]++;
					cardNum[card]++;
					cardNum[card + 1]++;
					// console.log("outChi 1");
				}

				if (num[0] > 0 && num[0] < 3 && num[1] > 0 && num[1] < 3) {
					// console.log("inChi 2");
					cardNum[card - 2]--;
					cardNum[card - 1]--;
					cardNum[card]--;
					huMatrix.push([card - 2, card - 1, card]);
					initTwoIdxTab();
					noTwoTypeHu();
					huMatrix.pop();
					cardNum[card - 2]++;
					cardNum[card - 1]++;
					cardNum[card]++;
					// console.log("outChi 2");
				}

				if (num[5] > 0 && num[5] < 3) {
					// console.log("inChi 3");
					var distance = card < 200 ? 100 : -100;
					cardNum[card] -= 2;
					cardNum[card + distance]--;
					if (card < 200)
						huMatrix.push([card + 100, card, card]);
					else
						huMatrix.push([card, card, card - 100]);
					initTwoIdxTab();
					noTwoTypeHu();
					huMatrix.pop();
					cardNum[card] += 2;
					cardNum[card + distance]++;
					// console.log("outChi 3");
				}

				if (num[5] == 2) {
					// console.log("inChi 4");
					var distance = card < 200 ? 100 : -100;
					cardNum[card + distance] -= 2;
					cardNum[card]--;
					if (card < 200)
						huMatrix.push([card + 100, card + 100, card]);
					else
						huMatrix.push([card, card - 100, card - 100]);
					initTwoIdxTab();
					noTwoTypeHu();
					huMatrix.pop();
					cardNum[card + distance] += 2;
					cardNum[card]++;
					// console.log("outChi 4");
				}

				if (num[6] > 0 && num[6] < 3 && num[7] > 0 && num[7] < 3) {
					// console.log("inChi 5");
					var distance = card < 200 ? 0 : 100;
					cardNum[102 + distance]--;
					cardNum[107 + distance]--;
					cardNum[110 + distance]--;
					huMatrix.push([102 + distance, 107 + distance, 110 + distance]);
					initTwoIdxTab();
					noTwoTypeHu();
					huMatrix.pop();
					cardNum[102 + distance]++;
					cardNum[107 + distance]++;
					cardNum[110 + distance]++;
					// console.log("outChi 5");
				}
			}
		}



		// console.log(longNum);
		// 不需要将
		if (hand.length % 3 == 0 && longNum == 0) {
			if (card && cardNum[card] == 3) {
				huMatrix.push([card, card, card]);
			}
			initTwoIdxTab();
			noTwoTypeHu();
			if (card && cardNum[card] == 3) {
				huMatrix.pop();
			}

			twoCardInHandHu();
		}
		// else if (hand.length % 3 == 2) // 需要将
		else { // 需要将
			// console.log("需要将@@ ");
			for (var k in cardNum) {
				if (cardNum[k] == 2 || (card && k == card && cardNum[k] == 3)) {
					// console.log("inJiang   " + k)
					cardNum[k] -= 2;
					var arr = this.getSameCards(hand, parseInt(k));
					hand.splice(hand.indexOf(arr[0]), 1); // twoCardInHandHu()需要用到hand
					hand.splice(hand.indexOf(arr[1]), 1);
					huMatrix.push([parseInt(k), parseInt(k)]);
					if (card && cardNum[card] == 3) {
						huMatrix.push([card, card, card]);
					}
					initTwoIdxTab();
					noTwoTypeHu();
					if (card && cardNum[card] == 3) {
						huMatrix.pop();
					}

					twoCardInHandHu();
					// console.log("cardNum:", cardNum);

					huMatrix.pop();
					cardNum[k] += 2;
					hand.push(arr[0]);
					hand.push(arr[1]);
					// console.log("outJiang   " + k)
				}
			}
		}


		//还原成实际的牌
		for(var i = 0; i < allHuMatrix.length; i++) {
			var hand = [].concat(pl.mjhand);
			this.restoreCards(hand, allHuMatrix[i]);
		}
		return allHuMatrix;
	}

	//三提五坎
	PaoHuZiXuPu.prototype.canSanTiWuKan = function (pl) {
		var cardNum = [];
		for(var i = 0; i < pl.mjhand.length; i++){
			var card = this.value(pl.mjhand[i]);
			cardNum[card] = this.cardHandCount(pl.mjhand, card);
		}
		var tiCount = 0;
		var kanCount = 0;
	    for (var k in card) {
	        if (card[k] == 4) {
	            tiCount++;
	            kanCount++;
	        }else if(card[k] == 3){
	            kanCount++;
			}
	    }
	    if(tiCount >= 3 || kanCount >= 5){
	    	return true;
		}
		return false;
	}

	//还原成实际的牌
	PaoHuZiXuPu.prototype.restoreCards = function(hand, matrix) {
		for(var i = 0; i < matrix.length; i++) {
			var list = matrix[i];
			for(var j = 0; j < list.length; j++) {
				for(var n = 0; n < hand.length; n++) {
					var c = hand[n];
					if(this.sameValue(list[j], c)) {
						list[j] = c;
						hand.splice(n, 1);
						break;
					}
				}
			}
		}
	}

	// 最大胡牌
	PaoHuZiXuPu.prototype.maxHu = function(tb, pl, card, allHuMatrix) {
		var maxWinOne = -1;
		var maxHandScore = 0;
		var maxHandIdx = 0;
		// // todo 跑胡没算 次方法不能不传allHuMatrix直接调用
		// if (!allHuMatrix) { 
		// 	allHuMatrix = this.canHuHand(pl, card);
		// }

		// console.log("allHuMatrix@@ " + JSON.stringify(allHuMatrix));
		for (var m = 0; m < allHuMatrix.length; m++) {
			var handScore = 0;
			var winOne = 0;
			var huMatrix = allHuMatrix[m];
			for (var j = 0; j < huMatrix.length; j++) {
				if (huMatrix[j].length == 3) {
					if (this.sameValue(huMatrix[j][0], huMatrix[j][1]) && this.sameValue(huMatrix[j][0], huMatrix[j][2])) {
						if (card && this.sameValue(card, huMatrix[j][1])) {
							var cardInHandNum = 0;
							for (var k = 0; k < pl.mjhand.length; k++) {
								if (this.sameValue(pl.mjhand[k], card))
									cardInHandNum++;
							}

							if (cardInHandNum >= 3)
								handScore += this.value(huMatrix[j][1]) > 200 ? 3 : 6;
							else if (cardInHandNum == 2) {
								handScore += this.value(huMatrix[j][0]) > 200 ? 1 : 3;
							} else if (cardInHandNum <= 1) // 王变坎 
							{
								handScore += this.value(huMatrix[j][0]) > 200 ? 3 : 6;
							}
						} else{
							handScore += this.value(huMatrix[j][1]) > 200 ? 3 : 6;
						}
					} else {
						handScore += this.getRowHuxi(huMatrix[j]);
					}
				} else if (huMatrix[j].length == 4) // 手牌垅
				{
					handScore += this.value(huMatrix[j][0]) > 200 ? 9 : 12;
				}
			}

			var tData = tb.tData;
			var totalHuxi = this.getHuxi(tb, pl, card, false) + handScore;
			winOne = totalHuxi;
			if (winOne > maxWinOne) {
				maxHandIdx = m;
				maxHandScore = handScore;
				maxWinOne = winOne;
			}
		}

		return {"maxIdx": maxHandIdx, "maxHuxi": maxHandScore, "maxWinOne": maxWinOne};
	}

	// 胡息
	PaoHuZiXuPu.prototype.getHuxi = function(tb, pl, card, isWithHand) {
		var score = 0;
		// 提
		for (var i = 0; i < pl.mjgang1.length; i++) {
			score += this.value(pl.mjgang1[i]) > 200 ? 9 : 12;
		}

		// 跑
		for (var i = 0; i < pl.mjgang0.length; i++) {
			score += this.value(pl.mjgang0[i]) > 200 ? 6 : 9;
		}

		// 偎
		for (var i = 0; i < pl.mjwei.length; i++) {
			score += this.value(pl.mjwei[i][0]) > 200 ? 3 : 6;
		}

		// 碰
		for (var i = 0; i < pl.mjpeng.length; i++) {
			score += this.value(pl.mjpeng[i][0]) > 200 ? 1 : 3;
		}

		// 吃
		for (var i = 0; i < pl.mjchi.length; i++) {
			var chiRow = pl.mjchi[i].eatCards;
			score += this.getRowHuxi(chiRow);

			var biCards = pl.mjchi[i].biCards;
			if (biCards) {
				for (var j = 0; j < biCards.length; j++) {
					var biRow = biCards[j];
					score += this.getRowHuxi(biRow);
				}
			}
		}

		return score;

		// todo 加上胡牌时手牌胡息 if (isWithHand)
	}

	PaoHuZiXuPu.prototype.getRowHuxi = function(chiRow) {
		var score = 0;
		chiRow = [].concat(chiRow);

		chiRow.sort(function(a, b) {
			return a % 100 - b % 100;
		});

		if (this.sameValue(chiRow[0], 201) && this.sameValue(chiRow[1], 202) && this.sameValue(chiRow[2], 203)) {
			score += 3;
		} else if (this.sameValue(chiRow[0], 101) && this.sameValue(chiRow[1], 102) && this.sameValue(chiRow[2], 103)) {
			score += 6;
		} else if (this.sameValue(chiRow[0], 202) && this.sameValue(chiRow[1], 207) && this.sameValue(chiRow[2], 210)) {
			score += 3;
		} else if (this.sameValue(chiRow[0], 102) && this.sameValue(chiRow[1], 107) && this.sameValue(chiRow[2], 110)) {
			score += 6;
		}
		return score;
	}

	// 胡牌玩家 结算
	PaoHuZiXuPu.prototype.getHuInfo = function(tb, pl, card, huMatrix) {
		if (!huMatrix) {
			if(pl.isSanTiWuKan){
		        huMatrix = this.sortCard(pl.mjhand, 1);
			}else{
		        huMatrix = this.canHu(tb, pl, card).huMatrix[0];
			}
		}

		var hand = pl.mjhand;
		var handSort = [];
		var inHandHuxi = 0; // 手牌总胡息
		for (var j = 0; j < huMatrix.length; j++) {
			var huxi = 0;
			var name = null;
			if (huMatrix[j].length == 3) {
				if (this.sameValue(huMatrix[j][0], huMatrix[j][1]) && this.sameValue(huMatrix[j][0], huMatrix[j][2])) {
					if (card && this.sameValue(card, huMatrix[j][1])) {
						var cardInHandNum = 0;
						for (var k = 0; k < hand.length; k++) {
							if (this.sameValue(hand[k], card))
								cardInHandNum++;
						}

						if (cardInHandNum >= 3) {
							huxi = this.value(huMatrix[j][0]) > 200 ? 3 : 6;
							inHandHuxi += huxi;
							name = "kan";
						} else if (cardInHandNum == 2) {
							huxi = this.value(huMatrix[j][0]) > 200 ? 1 : 3;
							inHandHuxi += huxi;
							name = "peng";
						} else if (cardInHandNum <= 1) // 王变坎 
						{
							huxi = this.value(huMatrix[j][0]) > 200 ? 3 : 6;
							inHandHuxi += huxi;
							name = "kan";
						}
					} else {
						huxi = this.value(huMatrix[j][0]) > 200 ? 3 : 6;
						inHandHuxi += huxi;
						name = "kan";
					}
				} else {
					huxi = this.getRowHuxi(huMatrix[j]);
					inHandHuxi += huxi;
					name = "chi";
				}
			} else if (huMatrix[j].length == 4) // 手牌垅
			{
				huxi = this.value(huMatrix[j][0]) > 200 ? 9 : 12;
				inHandHuxi += huxi;
				name = "ti";
			}

			var info = {
				cards: huMatrix[j],
				score: huxi
			};
			if (name) {
				info.name = name;
			}
			handSort.push(info);
		}
		
		var tData = tb.tData;
		var totalHuxi = inHandHuxi + this.getHuxi(tb, pl, card, false);
		var hzdesc = {};
		var rate = 0;
		if (pl.winType == WinType.pickNormal) { // 自摸
			rate = 2;
			hzdesc.name = "自摸";
		}else if(pl.winType == WinType.eatPut) { //点炮
			rate = 3;
			hzdesc.name = "接炮胡";
		}else {
			rate = 1;
			hzdesc.name = "平胡";
		}

	    return {handSort: handSort, totalHuxi: totalHuxi, rate: rate, hzdesc: hzdesc};
	}

	PaoHuZiXuPu.prototype.canTing = function(tb, pl) {
		var tData = tb.tData;
		var huCard = [];
		var allCardList = [];
		for (var i = 101; i <= 110; i++) {
			allCardList.push(i, 100 + i);
		}

		for (var i = 0; i < allCardList.length; i++) {
			var card = allCardList[i];
			if (this.canHu(tb, pl, card).huMatrix.length > 0) {
				huCard.push(card);
			}
		}

		return huCard;
	}

	PaoHuZiXuPu.prototype.removeSameCard = function(cardArr, card) {
		for(var i = 0; i < cardArr.length; i++) {
			if(this.sameValue(cardArr[i], card)) {
				cardArr.splice(i, 1);
				break;
			}
		}
	}

	// 获取能打牌的数量
	PaoHuZiXuPu.prototype.getCanPutCardNum = function (pl, usedCards) {
		usedCards = usedCards || [];
		var hand = [].concat(pl.mjhand);
		
		var cardNum = {};
		for (var i = 0; i < hand.length; i++) {
			var card = hand[i];
			cardNum[this.value(card)] = this.cardHandCount(hand, card);
		}

		// 删除3张及以上牌
		for (var k in cardNum) {
			if (cardNum[k] >= 3) {
				for (var i = 0; i < cardNum[k]; i++) {
					this.removeSameCard(hand, Number(k));
				}
			}
		}

		// 删除需要用掉的牌
		for (var i = 0; i < usedCards.length; i++) {
			var card = usedCards[i];
			this.removeSameCard(hand, card);
		}

		var num = 0;
		var canNotPutCard = pl.canNotPutCard;
		for (var i = 0; i < hand.length; i++) {
			var card = hand[i];
			if (canNotPutCard.indexOf(card) < 0) {
				num++;
			}
		}

		return num;
	}


    /**********************前端接口--start**********************/
    PaoHuZiXuPu.prototype.getAllCardsTotal = function() {
        return 80 - MjClient.data.sData.tData.areaSelectMode.maiPaiNum;
    };

    //删手牌重排序
    PaoHuZiXuPu.prototype.sortByUser = function(arr) {
        if (!MjClient.HandCardArr) {
            return [];
        }
        var cardArr = MjClient.HandCardArr;
        if (arr) {
            cardArr = arr;
        }

        var tmpArr = [];
        for (var i = 0; i < cardArr.length; i++) {
            for (var k = 0; k < cardArr[i].length; k++) {
                tmpArr.push(cardArr[i][k]);
            }
        }

        return this.sortCard(tmpArr);
    }

    //吃牌数组(剔除过吃)
    PaoHuZiXuPu.prototype.getChiCards = function(mjhand, card) {
        var chiSet = this.getChiSet(mjhand, card);
        var indexArr = [];
        for (var i = 0; i < chiSet.length; i++) {
			var tmpSet = chiSet[i];
			var tmpCardArr = tmpSet.slice();
			this.removeSameCard(tmpCardArr, card);
			var baseArr = mjhand.slice();
			for (var k = 0; k < tmpCardArr.length; k++) {
				baseArr.splice(baseArr.indexOf(tmpCardArr[k]), 1);
			}
			if (this.getCardCount(baseArr, card) > 0) {
				if (baseArr.indexOf(card) < 0) {
					card = card > 300 ? card - 200 : card + 200;
				}
				var biCards = this.getChiSet(baseArr, card, true);
				if (biCards.length > 0 && this.remove34Left(baseArr) > 3) {
					var failCount = 0; 
					for (var k = 0; k < biCards.length; k++) {
						var tmpBiSet = biCards[k];
						var array = baseArr.slice();
						for (var m = 0; m < tmpBiSet.length; m++) {
							array.splice(array.indexOf(tmpBiSet[m]), 1);
						}
						if (this.getCardCount(array, card) > 0) {
							if (array.indexOf(card) < 0) {
								card = card > 300 ? card - 200 : card + 200;
							}
							var secBiCards = this.getChiSet(array, card, true);
							if(secBiCards.length == 0 || this.remove34Left(array) <= 3){
                                failCount ++;
                            }
						}
					}
					if(failCount == biCards.length){
                        if(indexArr.indexOf(i) < 0){
                           indexArr.push(i); 
                        }
                    } 
				}else {
					indexArr.push(i);
				}
			}
		}
        for(var t = indexArr.length-1; t >= 0; t--){
            chiSet.splice(indexArr[t],1);
        }
        //return this.sortChiBiCards(chiSet);
        return chiSet;
    };

    PaoHuZiXuPu.prototype.getBiCards = function(cardArr, card) {
    	//card = this.getSameCards(cardArr, card)[0];
    	if (cardArr.indexOf(card) < 0) {
    		card = card > 300 ? card - 200 : card + 200;
    	}
        var biSet = this.getChiSet(cardArr, card, true);
        //多次比牌的判断
        var indexArr = [];
        for(var i = 0;i < biSet.length;i++){
            var tmpCardArr = cardArr.slice();
            var tmpBiArr = biSet[i];
            for(var k = 0;k < tmpBiArr.length;k++){
                var idx = tmpCardArr.indexOf(tmpBiArr[k]);
                if (idx >= 0) {
                	tmpCardArr.splice(idx,1);
                }
            }
            if(this.cardHandCount(tmpCardArr, card) > 0){
            	if (tmpCardArr.indexOf(card) < 0) {
		    		card = card > 300 ? card - 200 : card + 200;
		    	}
                var tmpSet = this.getChiSet(tmpCardArr, card, true);
                if(tmpSet.length == 0 || this.remove34Left(tmpCardArr) <= 3){
                    indexArr.push(i);
                }
            }
        }
        for(var i = indexArr.length-1;i >= 0 ;i--){
            biSet.splice(i,1);
        }

        //return this.sortChiBiCards(biSet);
        return biSet;
    };

    PaoHuZiXuPu.prototype.sortChiBiCards = function(arr) {
        var arr = arr.concat();
        arr.sort(function(a1, a2){
            var isSame1 = (a1[0] % 100 == a1[1] % 100) && (a1[1] % 100  == a1[2] % 100);
            var isSame2 = (a2[0] % 100 == a2[1] % 100) && (a2[1] % 100  == a2[2] % 100);
            if(isSame1 && isSame2){
                return 0;
            }else if(isSame1){
                return -1;
            }else{
                return 1;
            }
        });
        return arr;
    };

    //手牌胡息
    PaoHuZiXuPu.prototype.getHandHuxi = function(arr) {
        if (!arr || arr.length == 0) {
            return 0;
        }

        var huXi = 0;
        var self = this;

        // 判断提
        function isTi(row) {
            return (row.length == 4 &&
                    self.value(row[0]) == self.value(row[1]) &&
                    self.value(row[1]) == self.value(row[2]) &&
                    self.value(row[2]) == self.value(row[3]))
        }

        // 判断坎
        function isKan(row) {
            return (row.length == 3 &&
                    self.value(row[0]) == self.value(row[1]) &&
                    self.value(row[1]) == self.value(row[2]))
        }

        // 判断句
        function isJu(row) {
            if (row.length != 3 || !isSameColor(row)) {
                return false;
            }
            row = row.slice();
            row.sort(function(a, b) {
                return self.value(a) - self.value(b);
            })
            return ((row[0] % 100 == 1 && row[1] % 100 == 2 && row[2] % 100 == 3) ||
                    (row[0] % 100 == 2 && row[1] % 100 == 7 && row[2] % 100 == 10))
        }
        
        // 是否红牌
        function isRedCard(card) {
            return Math.floor(card / 100) % 2 == 1;
        }

        // 是否同色
        function isSameColor(row) {
            var bRed = isRedCard(row[0]);
            for (var i = 1; i < row.length; i++) {
                if (isRedCard(row[i]) != bRed) {
                    return false;
                }
            }
            return true;
        }

        for (var i = 0; i < arr.length; i++) {
            var row = arr[i];
            if (isTi(row)) {
                huXi += isRedCard(row[0]) ? 12 : 9;
            } else if (isKan(row)) {
                huXi += isRedCard(row[0]) ? 6 : 3;
            } else if (isJu(row)) {
                huXi += isRedCard(row[0]) ? 6 : 3;
            }
        }

        return huXi;
    }

    //听牌
    PaoHuZiXuPu.prototype.getRemainStats = function(tb, pl) {
    	if (!pl || !pl.mjhand) {
    		return {};
    	}
    	var stats = {};
    	var tData = tb.tData;
        for (var uid in tb.players) {

        	var p = tb.players[uid];

            var add = function(cd, num) {
                stats[cd] = stats[cd] ? stats[cd] + num : num;
            }

            //吃碰偎的牌
            var addEatNum = function(list, isChi) {
            	for (var i = 0; i < list.length; i++) {
	                var row = isChi ? list[i].eatCards : list[i];
	                for (var j = 0; j < 3; j++) {
	                    add(row[j], 1);
	                }
	            }
            }

            //跑、提牌
            var addGangNum = function(list) {
                if (!list) return;
                for (var i = 0; i < list.length; i++) {
                    //构造数据
                	var card = list[i] > 300 ? list[i] - 200 : list[i];
                	var cards = [card, card, card + 200, card + 200];
                	for (var j = 0; j < cards.length; j++) {
                		add(cards[j], 1);
                	}
                }
            }

            addEatNum(p.mjchi, true);
            addEatNum(p.mjpeng);
            addEatNum(p.mjwei);
            addGangNum(p.mjgang0);
            addGangNum(p.mjgang1);
            
            //统计打出的牌
            for (var i = 0; i < p.mjput.length; i++) {
                if (tData.tState == TableState.waitEat) { // 牌在展示阶段
                    if (p.info.uid == tData.uids[tData.curPlayer] && i == p.mjput.length - 1) {
                        continue;
                    }
                }
                add(p.mjput[i], 1);
            }

            //统计自己手牌
            if (p.info.uid == pl.info.uid) {
                for (var i = 0; i < p.mjhand.length; i++) {
                    add(p.mjhand[i], 1);
                }
            }
        }
        return stats;
    }

    PaoHuZiXuPu.prototype.getTingCards = function(tb, pl, putCard) {
    	if (!pl || !pl.mjhand) {
    		return [];
    	}
    	var copy = pl.mjhand.slice();
        if (putCard != undefined) {
            var idx = copy.indexOf(putCard);
            if (idx < 0) {
                return [];
            }
            pl.mjhand.splice(idx, 1);
        } 

        var allCards = [];
        for (var i = 101; i <= 110; i++) {
            allCards.push(i, i+100, i+200, i+300);
        }

        //统计听的牌
        //var stats = this.getRemainStats(tb, pl);
        var tingCards = [];
        this.isTingAll = true;
        for(var k in allCards) {
            var card = allCards[k];
            //cc.log("验证听牌", card);
            var huRet = this.canHu(tb, pl, card);
            if (huRet.huMatrix && huRet.huMatrix.length > 0) {
                //cc.log("可以听", card);
                tingCards.push(card);
            } else {
                //cc.log("不能听", card);
                //不能全听
                this.isTingAll = false;
            }
        }

        pl.mjhand = copy;

        /* 此处不删全out的，改为getTingStats接口处理
        for (var i = 0; i < tingCards.length; i++) {
            var outCard = stats[tingCards[i]];
            if (outCard >= 2) { //每张牌有2张
                tingCards.splice(i, 1);
                i--;
            }
        }
        */

        var self = this;
        tingCards.sort(function(a, b) {return self.value(a) - self.value(b)});
        return tingCards;
    };

    PaoHuZiXuPu.prototype.getTingStats = function(tb, pl, putCard) {
        var tingCards = this.getTingCards(tb, pl, putCard);
        var stats = this.getRemainStats(tb, pl);
        var tingStats = {};
        for (var i = 0; i < tingCards.length; i++) {
            var card = tingCards[i];
            var totalNum = 2;
            var remainNum = totalNum - (stats[card] || 0);
            if (remainNum > 0) {
            	tingStats[card] = remainNum;	//过滤剩0张的牌
            }
        }

        return tingStats;
    };

    PaoHuZiXuPu.prototype.hintPutCardsToTing = function() {
        var sData = MjClient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[SelfUid()];
        if (tData.tState != TableState.waitPut || tData.uids[tData.curPlayer] != pl.info.uid) {
            return [];
        }

        var hand = pl.mjhand.slice();
        var dict = {};
        for (var i = 0; i < hand.length; i++) {
            dict[hand[i]] = dict[hand[i]] ? dict[hand[i]] + 1 : 1;
        }

        var hintList = [];
        var canNotPut = this.getCanNotPutCards(pl);
        for (var k in dict) {
            var card = Number(k);
            if (canNotPut.indexOf(this.value(card)) >= 0) {
                continue;
            }
            var tingList = this.getTingStats(sData, pl, card);
            for(var key in tingList) {
                if (tingList[key] > 0) {
                    hintList.push(card);
                    break;   //只要有一个可听的牌，此牌贴角标
                }
            }
        }

        return hintList;
    };

    //获取不能出的牌
    PaoHuZiXuPu.prototype.getCanNotPutCards = function(pl) {
    	if (!pl || !pl.mjhand) {
    		return [];
    	}

    	var canNotPut = [];
    	//1. 3-4张不可出
    	var dict = [];
	    for (var i = 0; i < pl.mjhand.length; i++) {
	        var value = this.value(pl.mjhand[i]);
	        dict[value] = dict[value] ? dict[value] + 1 : 1;
	      	//2. 放偎不能听则不能打, 懒的重写了, 调用下
    		if (MjClient.playui && MjClient.playui.checkFangWeiGray(pl.mjhand[i], pl)) {
    			canNotPut.push(value);
    		}
	    }
	    for (var k in dict) {
	    	k = Number(k);
	    	if (dict[k] >= 3 && canNotPut.indexOf(k) < 0) {
	    		canNotPut.push(k);
	    	}
	    }

	    return canNotPut;
    }

    //test...
    PaoHuZiXuPu.prototype.sortHandCardSpecial = function(handArr) {
        var tData = MjClient.data.sData.tData;
        return this.sortCard(handArr, this.sortType);
    };

    /**********************end**********************/

    if (typeof(MjClient) != "undefined") {
        MjClient.majiang_xuPuPaoHuZi = new PaoHuZiXuPu();
    }

    var test = function() {
    	var tb = {
	        tData: {
	            maxPlayer:2,
	            uids: [100, 101],
	            curPlayer: 1,
	            minHuxi: 18,
	            putCardCount: 1,
	            areaSelectMode: {
	                
	            },
	            currCard:402
	        },
	    };
	    var pl = {
	        uid: 100,
	        mjhand:[101, 101, 101, 205, 205, 205, 201, 202, 203, 206, 207, 208, 209, 409, 302, 103, 402, 203, 105, 310],
	        mjwei: [],
	        mjchi: [{"eatCards": [301,103,102]},{"eatCards": [202,407,410]},{"eatCards": [105,304,106]}],
	        mjpeng: [[110,310,110]],
	        mjgang0: [],
	        mjgang1: [],
	        mjput: []
	    }
    	var phz = new PaoHuZiXuPu();
    	//phz.getTingCards(tb, pl, 405);
    	// var cards = phz.getSameCards(cardArr, card);
    	// console.log(cards);
    	// cards = phz.getOtherCards(cardArr, card);
    	// console.log(cards);

    	// console.log(phz.getChiSet(cardArr, card));

    	// console.log(phz.remove34Left([101,101,301,201,202,402,402,201]));
    	// console.log(phz.canChiCard(cardArr, card));

    	// console.log(phz.getRelateCount(cardArr, 102));

    	//console.log(phz.getCanPutCardNum({mjhand: cardArr, canNotPutCard: [401, 201]}));

        //前端排序测试
        /*吃比测试1
        var hand = [103,103,303,207,207,407,203,204,202,408,209,410,101,301,307,308,409,210,104,203];
        var card = 208;
        console.log("吃牌", phz.getChiCards(hand, card));
        hand = [103,103,303,207,207,407,203,204,202,408,209,101,301,307,308,210,104,203];
        console.log("比牌", phz.getBiCards(hand, card));
        */

        /*
        var hand = [201, 402, 403, 104, 305, 306, 108, 108, 105, 306, 203, 205, 101];
        var card = 304;
        */
        
        // 线上不能吃黑9的牌
        var hand = [104,104,104,203,203,203,401,402,403,207,208,209,409,109,110,101,406];
		var card = 209;

        console.log("吃牌", phz.getChiCards(hand, card));
        //console.log("比牌", phz.getBiCards(hand, card));
        //hand = [205,208,405,101,103,105,203,101,202,301,405,409,310,209,207,206,402,302];
        //console.log("比牌", phz.getBiCards(hand, card));
        //hand = [101, 101, 101, 205, 205, 205, 201, 203, 206, 207, 208, 209, 409, 302, 103, 402, 203, 105, 310];
        //console.log("比牌", phz.getChiSet(hand, card, true));

        /*
        var hand = [305,210,306,102,105,203,204,404,403,101,109,401,402,104,308,408,107,407,307,310];
        var card = 106;
        console.log("吃牌", phz.getChiCards(hand, card));
        hand = [210,306,102,105,203,204,404,403,101,109,401,402,308,408,107,407,307,310];
        console.log("比牌", phz.getBiCards(hand, card));
        */
        /*
        var hand = [104,304,407,101,203,303,206,408,109,408,405,306,110,210,107,409,409,310,307,202,207];
        var arr = phz.sortCard(hand, 1);
        console.log("排序", JSON.stringify(arr))
        var card = 406;
        console.log("获取吃", phz.getChiSet(hand, card));
        console.log("吃牌", phz.getChiCards(hand, card));
         hand = [104,304,101,203,303,206,109,408,405,306,110,210,107,409,409,310,307,202,207]
         console.log("比牌", phz.getBiCards(hand, card));
         */
    }
    // test();
})();
