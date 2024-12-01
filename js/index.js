var startGame;//地鼠计时器
var countdown;//倒计时
var score = 0;//总分
var time;//倒计时
var timeVal;//时间间隔
var curr_td = '';
var totalMoles = 0;     // 地鼠总出现次数

//难度改变，对应其实分数改变
function changeTimeValue(){
    var diff = document.getElementById("diffculty").value;
    if(diff == 'high'){
        document.getElementById("time").value = 30;
    }else if(diff == 'normal'){
        document.getElementById("time").value = 40;
    }else{
        document.getElementById("time").value = 60;
    };
}

//开始游戏
function showMouse(){
    var diff = document.getElementById("diffculty").value;

    // 重置分数为 0
    score = 0;
    document.getElementById("score").value = score;

    totalMoles = 0; // 地鼠出现次数清零

    if(diff == 'high'){
        time = 30;
        timeVal = 500;
    }else if(diff == 'normal'){
        time = 40;
        timeVal = 750;
    }else{
        time = 60;
        timeVal = 1000;
    }
    //开始游戏之后禁用开始游戏和选择难度
    document.getElementById("start").disabled = true;
    document.getElementById("diffculty").disabled = true;

    // 开始倒计时
    countdown = setInterval(function () {
        time = time - 1; // 倒计时减一
        document.getElementById("time").value = time;

        if (time <= 0) {
            clearInterval(countdown); // 停止倒计时
            window.clearInterval(startGame); // 停止地鼠移动
            endGame();
        }
    }, 1000); // 每秒更新一次倒计时

    startGame = window.setInterval(function(){
        totalMoles++; // 每次地鼠出现计数+1

        //清空所有表格里的img
        var itemArr = document.getElementsByTagName('td');
        for (var i = 0; i < itemArr.length; i++) {

            // 检查当前单元格是否为地鼠区域，忽略统计表格区域
            if (!itemArr[i].id.startsWith('item_')) {
                 continue;  // 如果是统计表格区域，跳过
            }

            itemArr[i].style.backgroundColor = '#FF5500';
            itemArr[i].innerHTML = '';
        };
        //生成一个1~25的随机数
        var mouse = parseInt(Math.random()*25+1);
        var index = 'item_'+mouse;

        //操作dom
        document.getElementById(index).style.backgroundColor = '#ffffff';
        document.getElementById(index).innerHTML = '<img src="./image/mouse.jpg" height="50px;" width="50px;">';

    },timeVal);
};

//停止游戏
function stop(){
    window.clearInterval(startGame);
    clearInterval(countdown);
    endGame();
};

//打地鼠
function bump(itemid){
    //防止多次点击
    if(curr_td == itemid){
        return false;
    };
    curr_td = itemid;

    var itemId = 'item_' + itemid;
    if(document.getElementById(itemId).innerHTML != ''){
        score = score + 1;
        document.getElementById("score").value = score;
    };
}


function endGame() {
    // 保存当前分数
    var currentScore = score;

    // 计算统计数据
    var difficulty = document.getElementById("diffculty").value;
    var misses = totalMoles - currentScore;
    var missRate = ((misses / totalMoles) * 100).toFixed(2);

    // 插入数据到表格
    var tableBody = document.getElementById("statistics-table").querySelector("tbody");
    if (!tableBody) {
        console.error("Table body not found. Check your table structure.");
        return;
    }
    var newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${difficulty}</td>
        <td>${currentScore}</td>
        <td>${misses}</td>
        <td>${missRate}</td>
    `;
    tableBody.appendChild(newRow);

    // 重置变量
    score = 0;
    totalMoles = 0;
    document.getElementById("score").value = 0;
    changeTimeValue();

    // 提示最终得分
    alert('Game Over! Your score is ' + currentScore);

    // 重新启用开始按钮和难度选择
    document.getElementById("start").disabled = false;
    document.getElementById("diffculty").disabled = false;
}

