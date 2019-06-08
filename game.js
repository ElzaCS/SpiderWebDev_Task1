var myGamePiece;
var myObstacles = [];
var score=0;
var speed=150;
var play=true;

var re = document.querySelector('.re');
re.addEventListener("click",refresh);
function refresh() {
	document.location.reload();
    clearInterval(interval);
 }
 
var paus = document.querySelector('.paus');
paus.addEventListener("click",fpause);
function fpause() {
	if (play) {
    	play=false;
		myGameArea.stop(); }
    else {
    	play=true;
        myGameArea.start(); }      
}
	
 
function startGame() {
    myGamePiece = new component("red");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    
    start : function() {
        this.canvas.width = 270;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = 'rgba(255, 255, 0)';
  		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 15);
    	
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
       		 })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
       		 })
  	  },
    
    stop : function() {
        clearInterval(this.interval);
   	 }, 
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(color,x,y) {
     this.angleCh=0;
     this.angle=10*Math.PI/180;
     this.y=y;
     this.x=x;
 
    this.update = function() {
    
    	if (color=="red") {
           ctx = myGameArea.context;
           ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';   //Path
            ctx.beginPath();
             ctx.arc(130, 400, 45, 0, Math.PI * 2);
            ctx.stroke();
            ctx.save();
           ctx.translate(130, 400);    
           ctx.rotate(this.angle);
           
			ctx.fillStyle = "orange";
            circle = new Path2D();  
             circle.moveTo(0, -45);
            circle.arc(0, -45, 10, 0, 2 * Math.PI);
            ctx.fill(circle);
            circle.moveTo(130,160);
             circle.arc(0, 45, 10, 0, 2 * Math.PI);
             ctx.fill(circle);   

            ctx.restore(); 
            this.hx1=45*Math.sin(this.angle)+130;
            this.hy1=400-(45*Math.cos(this.angle));
            this.hx2=45*Math.sin(this.angle+Math.PI)+130;
            this.hy2=400-(45*Math.cos(this.angle+Math.PI));
            
          }
        
         else if (color == "white") {
         ctx = myGameArea.context;
            ctx.fillStyle = "white";
            ctx.fillRect(this.x, this.y, 60, 10) ;
             }
     }
     
     	
    this.newPos = function() {
        this.angle += this.angleCh * Math.PI / 180;
    }
    
  
}

function crashCheck() {
var i=0;
var crash=false;
for (i = 0; i < myObstacles.length; i += 1) 
{
  if ( (myObstacles[i].x-10)<=(myGamePiece.hx1-5) && (myGamePiece.hx1-5)<=(myObstacles[i].x+60) &&  (myObstacles[i].x)<=(myGamePiece.hx1+5) && (myGamePiece.hx1+5)<=(myObstacles[i].x+70) )
 {
   if ( (myObstacles[i].y-10)<=(myGamePiece.hy1-5) && (myGamePiece.hy1-5)<=(myObstacles[i].y+10) && (myObstacles[i].y)<=(myGamePiece.hy1+5) && (myGamePiece.hy1+5)<=(myObstacles[i].y+20) )
   crash=true;
 }
      
 if ( ((myObstacles[i].x-10)<=(myGamePiece.hx2-5) && (myGamePiece.hx2-5)<=(myObstacles[i].x+60)) &&  ((myObstacles[i].x)<=(myGamePiece.hx2+5) && (myGamePiece.hx2+5)<=(myObstacles[i].x+70)) )
 {
   if ( ((myObstacles[i].y-10)<=(myGamePiece.hy2-5) && (myGamePiece.hy2-5)<=(myObstacles[i].y+10)) && ((myObstacles[i].y)<=(myGamePiece.hy2+5) && (myGamePiece.hy2+5)<=(myObstacles[i].y+20)) )
   crash=true;
 }
}
       if (crash==true)
       return crash;
       else {
       score=score+1;
    	ctx.font = "16px Arial";
    ctx.fillStyle = 'rgb(179, 209, 255)';
    ctx.fillText("Score: "+score, 8, 25); }
  }
     
function updateGameArea() {
	var x, y;
    myGameArea.clear();
    myGameArea.frameNo += 1;
    myGameArea.context.fillStyle = 'rgba(0, 0, 0,0.7)';
  	myGameArea.context.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    if (myGameArea.frameNo == 1 || everyinterval(speed)) {
        x = Math.round(1000*Math.random());
        if (x<0)
        	x=-1*x;
        while (x>210) {
        	x=x-210; }
        y = 0;
        speed=speed-2; //Increases speed
        myObstacles.push(new component("white", x,y));
      
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].y += 1;
        myObstacles[i].update();
    }
	
    myGamePiece.angleCh = 0; //To not rotate continuously
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.angleCh = -1; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.angleCh = 1; }
    myGamePiece.newPos();    
    myGamePiece.update(); 
    if (crashCheck()==true)
    { myGameArea.stop();
    	ctx.fillStyle = "black";
       ctx.fillRect(35,205,190, 50) ;
       ctx.font = "32px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: "+score, 55, 240);}  //final score
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
