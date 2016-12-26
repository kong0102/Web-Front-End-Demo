//By KongZheng

var canvas = document.getElementsByTagName('canvas')[0];
var context = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth*0.7;
canvas.height = document.documentElement.clientHeight*0.8;

var radius = 20;//球半径 10-50
var color = '#33cc66';//球颜色

var step = 0.3;//虚拟时间差
var loss = 0.2;//碰撞损耗

var g = 10;//重力加速度
var fri =0.05;//摩擦系数

var down = 1;//球向下为1，向上为-1,
var right = 1;//球向右为1，向左为-1
//时间
var t = 0;
var tx = 0;
//初始速度
var v0x = 20;
var v0y = 0;
//瞬时速度
var vty = 0;
var vtx = v0x;

var dx = canvas.width/2;//小球初始x坐标
var dy = radius;//运动方向改变时初始坐标

var sx = 0;//横向坐标
var sy = 0;//竖向坐标

var s0y = 0;
var s0x = 0;
var ace = 0;

window.addEventListener("resize", function () {
    canvas.width = document.documentElement.clientWidth*0.7;
    canvas.height = document.documentElement.clientHeight*0.8;
});
/*-----DOM事件响应-----*/ 
var bt = document.getElementById('reset');
var op = document.all.op;

canvas.addEventListener("click", function (e) {
	e.preventDefault();
	
	down = 1;
	v0y = v0y + Math.random()*30+20;
	vty = v0y;

	v0x = v0x + Math.random()*30+10;
	vtx = v0x;	
},false);

bt.addEventListener("click", function () {
	document.getElementById('form1').reset();    
	v0x = 20;
    v0y = 0;
    dx = canvas.width/2;
    dy = radius;
    t = 0;
    tx = 0;
    sx = 0;
    sy = 0;
    down = 1;
    right = 1;	
},false);

function getValue(){
	color = op[0].value.replace(/\s+/g,"");
	radius = parseFloat(Math.min(Math.max(op[1].value,10),50));
	step = parseFloat(Math.min(Math.max(op[2].value,0.1),1));
	g = parseFloat(Math.min(Math.max(op[3].value,0),20));
	loss = parseFloat(Math.min(Math.max(op[4].value,0),0.9));
	fri = parseFloat(Math.min(Math.max(op[5].value,0),0.9));
}
/*-----匀加速运动函数-----*/ 
function move(speed,time,key,dis,a,boundary){
    var s,vt;	
    if(key == -1){
	vt = speed - a*time;
	s = boundary - (speed*time - a*time*time/2) - dis;
	}
	if(key == 1){
	vt = speed + a*time;
    s = speed*time + a*time*time/2 + dis;
	}	
	var result =[s,vt];
	return result;
}
/*------------------*/   
function ball() {
	this.draw = function(){
	 /*-----地面滑动受摩擦时x坐标-----*/    
		if(canvas.height - sy - radius <= 1 && vty <= 1){
		   down =0;
		   if(vtx <= 0.5){
		   sx = sx;
		   }
		   else{
		     ace = (-right)*fri*g;		   
		     if(right == -1){dx = canvas.width - sx;}
		     if(right == 1){dx = sx;}
		   
		   s0x = move(vtx,step,right,dx,ace,canvas.width);
		   sx = s0x[0];
		   vtx = s0x[1];		   
		   }	   
		}
	/*-----水平匀速运动x坐标----*/  
		else{s0x = move(v0x,tx,right,dx,0,canvas.width);
		sx = s0x[0];
		vtx = s0x[1];
		}
	/*-----自由落体运动y坐标----*/     
	    if(down != 0){
        s0y = move(v0y,t,down,dy,g,canvas.height);	
        sy = s0y[0];
		vty = s0y[1];
		}
	/*-----地面滑动时y坐标不变---*/ 
		else {
		sy = canvas.height - radius;
		}
	/*------------------*/     
		context.beginPath();
		context.arc(sx, sy, radius, 0, Math.PI*2, false);
		context.fillStyle = color;
		context.fill();
		context.closePath();
	};
	
	this.update = function () {		
	 /*-----竖向状态改变-----*/ 		
		if(vty <= 1 && down == -1){
		down = 1;
		v0y = 0;
		t = 0;
		dy = sy;
		}
	/*------------------*/ 
	/*-----边界碰撞-----*/  
	    if(canvas.width - sx - radius <= 0 && right != -1){	
		right = -1;
		v0x = v0x*(1-loss);
		tx = 0;
		dx = radius;
		}
		
		if(sx - radius <= 0 && right == -1){	
		right = 1;
		v0x = v0x*(1-loss);
		tx = 0;	
		dx = radius;
		}

		if(canvas.height - sy - radius <= radius*step && down == 1){	
		down = -1;
		v0y = vty*(1-loss);
		t = 0;
		dy = radius;
		}
		
		if(sy - radius <= 0 && down == -1){						
		down = 1;
		v0y = vty*(1-loss);
		t = 0;
		dy = radius;
		}	
	/*------------------*/ 	
		this.draw();
	};	
}					
var ball1 = new ball();

function animate() {
    context.fillStyle = "#FFF8DC";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
	t = t + step;
	tx = tx + step;
    getValue();
	
	window.requestAnimationFrame(animate);
    ball1.update();	
}
animate();