var myCanvas = document.getElementById("myCanvas");
var context = myCanvas.getContext('2d');
window.onload = function(){             //将画布铺满浏览器高度
    myCanvas.height = window.innerHeight;
}
//#region 定义全局变量
/* 背景图片 */
var bg = new Image();
bg.src = "bg.png";
/* 游戏标题 */

/* 牛顿 */
var newton = new Image();
newton.src = "man.png";
var newtonX = myCanvas.width / 2,       //牛顿的坐标
    newtonY = myCanvas.height - 70;
/* 牛顿被砸 */
var fruithit = new Image();
fruithit.src = "man_hit.png";
var hittime = 1,                        //显示牛顿被砸图片的时间
    _hittime = 0;                       //显示牛顿被砸图片的时间
/* 书本 */
var booktime = 0,
bookarr = [];                           //存放所有书本的数组
var book = new Image();
book.src = `book.png`;
/* 水果 */
var fruittime = 0,                      //标记正在生成一个水果的时间
    fruitarr = [];                      //存放所有水果的数组 [[x, y, 下落距离， 水果类别], []...]
var fruit1 = new Image();
fruit1.src = "fruit1.png";
var fruit2 = new Image();
fruit2.src = "fruit2.png";
var fruit3 = new Image();
fruit3.src = "fruit3.png";
var fruit4 = new Image();
fruit4.src = "fruit4.png";
var fruitall = [fruit1, fruit2, fruit3, fruit4];    //水果包括（苹果、香蕉、葡萄、树莓）


/* 定义游戏类 */
var game = {                        
    gamestart: 1,                   //准备开始状态
    gamerun: 0,                     //正在游戏状态
    gameover: 0,                    //游戏结束状态
    dead: 0,                        //牛顿被砸
    score: 0,                       //得分
    life: 3,                        //生命值
    
    /* 显示得分 */
    ShowScore: function () {
        var gradient = context.createLinearGradient(0, 0, 120, 60);
        gradient.addColorStop(0, '#ff9569');
        gradient.addColorStop(1, '#e92758');
        context.font = '30px  sans-serif';
        context.fillStyle = gradient;
        context.fillText("SCORE:" + this.score, 10, 50);
    },
    /* 计算并显示生命值 */
    ShowLife: function () {
        context.font = '30px  sans-serif';
        context.fillStyle = "#D28140";
        context.fillText("LIFE:" + this.life, 400, 50);
        if (game.dead == 1 && hittime == 9 && game.life > 0) {      //被砸仍有复活机会
            game.dead = 0;
            fruittime = 0;
            hittime = 1;
            _hittime = 0;
        } else if (game.dead == 1 && game.life == 0) {              //被砸但无复活机会，游戏结束
            game.gameover = 1;
        }
    },
    
    
    //游戏状态转换（开始、结束）
    ShowBg: function () {             //显示背景图
        context.drawImage(bg, 0, 0);
    },
    Over: function () {               //游戏结束
        if (game.gameover == 1) {
            game.gamestart = 1;
            game.gameover = 0;
            game.dead = 0;
            game.gamerun = 0;
        }
    },
    Start: function () {              //游戏开始
        startbtn.className = "startbtn";
        game.life = 3;
        game.score = 0;
        newtonX = myCanvas.width / 2;
        newtonY = myCanvas.height - 70;
        fruittime = 0;
        fruitarr = [];
        hittime = 1;
        _hittime = 0;
        booktime = 0;
        bookarr = [];
        bookhitnum = 1;
        bookhittime = 0;
        context.drawImage(starthead, 110, 200);
    },
    //#endregion

    /* 牛顿跟随光标 */
    Newton: function (e) {
        if(game.gamerun == 1){
            newtonX = e.offsetX;
            context.drawImage(newton, newtonX - newton.width / 2, newtonY - newton.height / 2);
        }
    },
    /* 随机生成四类不同的水果 */
    Fruit: function () {
        fruittime++;
        var fruitnum = parseInt(Math.random() * 4);         
        if (fruittime >= 150) {         //每1500ms生成一个水果
            fruitarr.push(
                [Math.random() * 520 - fruitall[fruitnum].width / 2, -fruitall[fruitnum].height, 0, fruitnum]);
            fruittime = 0;  
        }
    },
    /* 所有水果改变屏幕位置 */
    FruitChange: function () {
        var result = [];
        for (let i = 0; i < fruitarr.length; i++) {
            if (fruitarr[i][1] + fruitarr[i][2] <= myCanvas.height) {       //水果仍在屏幕内
                context.drawImage(fruitall[fruitarr[i][3]], fruitarr[i][0], fruitarr[i][1] + fruitarr[i][2]);
                fruitarr[i][2] += 2;        //每10ms下落2px
                result.push(fruitarr[i]);
            }
        }
        fruitarr = result;
    },
    /* 随机生成书本 */
    Book: function () {
        booktime++;
        if (booktime >= 300) {      //每3000ms生成一本书
            bookarr.push(
                [Math.random() * 520 - book.width / 2, -book.height, 0]);
            booktime = 0;  
        }
    },
    /* 书本改变屏幕位置 */
    BookChange: function () {
        var result = [];
        for (let i = 0; i < bookarr.length; i++) {
            if (bookarr[i][1] + bookarr[i][2] <= myCanvas.height) {         //书本仍在屏幕内
                context.drawImage(book, bookarr[i][0], bookarr[i][1] + bookarr[i][2]);
                bookarr[i][2] += 2.5;        //每10ms下落2.5px
                result.push(bookarr[i]);
            }
        }
        bookarr = result;
    },
    /* 牛顿被砸（清屏、砸晕图片） */
    NewtonHit: function (type) {
        if(type == 'fruit'){             //仅被水果砸中时需
            game.dead = 1;
            _hittime++;
            context.drawImage(fruithit, newtonX - newton.width / 2, newtonY - newton.height / 2);       //显示牛顿被砸的图片
            if (_hittime >= 10) {        
                hittime++;
                _hittime = 0;
            }
            if (hittime == 9) {
                game.life -= 1;         //生命值-1，判断是否能够复活
                fruitarr = [];
                bookarr = [];
                newtonX = myCanvas.width / 2;
            }
        }
    },
    /* 被水果砸 */
    HitByFruit: function () {
        for (let i = 0; i < fruitarr.length; i++) {
            if(fruitarr[i][1] + fruitarr[i][2] < newtonY - newton.height / 2 + newton.height){          //y分量重合
                if (fruitarr[i][0] < newtonX - newton.width / 2) {          //左x分量重合
                    if ((fruitarr[i][0] + fruitall[fruitarr[i][3]].width > newtonX - newton.width / 2)&&
                        (fruitarr[i][1] + fruitarr[i][2] + fruitall[fruitarr[i][3]].height > newtonY - newton.height / 2)) {
                            game.NewtonHit('fruit');
                    }
                } else if (fruitarr[i][0] > newtonX - newton.width / 2) {   //右x分量重合
                    if ((fruitarr[i][0] < newtonX - newton.width / 2 + newton.width) && 
                        (fruitarr[i][1] + fruitarr[i][2] + fruitall[fruitarr[i][3]].height > newtonY - newton.height / 2)) {
                            game.NewtonHit('fruit');
                    }
                }
            }
        }
    },
    /* 被书本砸 */
    HitByBook: function () {
        for (let i = 0; i < bookarr.length; i++) {
            if(bookarr[i][1] + bookarr[i][2] < newtonY - newton.height / 2 + newton.height){          //y分量重合
                if (bookarr[i][0] < newtonX - newton.width / 2) {          //左x分量重合
                    if ((bookarr[i][0] + book.width > newtonX - newton.width / 2)&&
                        (bookarr[i][1] + bookarr[i][2] + book.height > newtonY - newton.height / 2)) {
                            game.NewtonHit('book');
                            game.score++;                   //得分+1
                            bookarr.splice(i, 1);           //从书本数组中删除这本书，做出书被收到的效果
                    }
                } else if (bookarr[i][0] > newtonX - newton.width / 2) {   //右x分量重合
                    if ((bookarr[i][0] < newtonX - newton.width / 2 + newton.width) && 
                        (bookarr[i][1] + bookarr[i][2] + book.height > newtonY - newton.height / 2)) {
                            game.NewtonHit('book');
                            game.score++;
                            bookarr.splice(i, 1);
                    }
                }
            }
        }
    },
}

/* 以10ms为周期调用函数 */
setInterval(function () {
    game.ShowBg();
    if (game.gamestart == 1) {
        game.Start();
    }
    if (game.gamerun == 1) {
        if (game.dead == 0) {       //没有被砸时
            context.drawImage(newton, newtonX - newton.width / 2, newtonY - newton.height / 2);
            game.Fruit();
            game.FruitChange();
            game.Book();
            game.BookChange();
        }
        game.HitByFruit();
        game.HitByBook();
        game.ShowLife();
        game.Over();
        game.ShowScore();
    }
}, 10)

/* 开始游戏按钮点击事件 */
var startbtn = document.getElementsByClassName("startbtn")[0];
startbtn.onclick = function () {
    startbtn.className = "startbtn none";
    game.gamestart = 0;
    game.gamerun = 1;
}

/* 监听光标移动事件*/
myCanvas.onmousemove = function (e) {
    if (game.gamerun == 1 && game.dead == 0) {
        game.Newton(e);
        this.style.cursor = "none";
    } else {
        this.style.cursor = "";
    }
}