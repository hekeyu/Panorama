var canvas = document.getElementById("canvas");
var gl = canvas.getContext('webgl'); 
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);
var look = LookAt(0, 0, 0, 0, 0, -100, 0, 1, 0);   
var pers = SetPerspective(60, canvas.width / canvas.height, 0.1, 700);
var temp = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
var mvpMatrix = multiply(look, pers);
gl.enable(gl.DEPTH_TEST); 
  

function DragTest(canvas){  
	    this.textureMaker = new TextureMaker(gl, canvas); 
	    this.rotate = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];  //初始旋转矩阵
	     
  		this.dx = 0;                    //鼠标横向移动时的速度
		  this.dy = 0;                    //鼠标纵向移动的速度
		  this.x = 0;                     //鼠标横向移动的距离
		  this.y = 0;                     //鼠标纵向移动的距离
		
		  this.deltaY = 0;                  //鼠标滚轮的状态
		  this.state = 0;
			
		  var dragging = false;         // Dragging or not
		  var lastX = 0, lastY = 0;     // Last position of the mouse
		  var that = this;
		  
		  canvas.onmousedown = function(ev) {   // Mouse is pressed
		    var x = ev.clientX, y = ev.clientY;
		    // Start dragging if a moue is in <canvas>
		    var rect = ev.target.getBoundingClientRect();
		    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom){
		    	
		      lastX = x; lastY = y;
		      dragging = true;
		    }
		  };
		  canvas.onmouseup = function(ev) {  
		  	dragging = false;    
		  	var ans = calculate(multiplyMV(that.rotate, [0, 0, -1, 1]), 1);
		  	console.log(ans.src);
		  	
		  }; // Mouse is released 
		  canvas.onmousemove = function(ev) { // Mouse is moved
		    if (dragging) { 
		  
		      var factor = 100 / canvas.height; // The rotation ratio

		       that.x += factor * (ev.clientX - lastX);   
		       that.y += factor * (ev.clientY - lastY);
		       that.y = Math.max(-90, Math.min(90, that.y)); 
           that.rotate = multiply(rotateY(that.x), rotateX(that.y));
		   
		       lastX = ev.clientX, lastY = ev.clientY;
		      
		      
		    }  
		  };  
		  
		  canvas.onmousewheel = function(ev){
		  	  that.deltaY += ev.deltaY / 20;     
		  	  that.deltaY = Math.max(-20, Math.min(10, that.deltaY));
 
		  	  if(that.deltaY >= 0)
		  	     that.state = 0;
		  	  else if(that.deltaY >= -10)
		  	     that.state = 1;
		  	  else that.state = 2;
		  	  
		//  	  console.log(that.deltaY); 
		  }
};
 
 

var Init = function(){
	  this.rotate = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];  //初始旋转矩阵
	  var x = 0;
	  var y = 0;
	  var sphere = new Sphere(gl);          //绘制的球体
   
    var drag = new DragTest(canvas);      //拖拽事件控制 

	function tick(){
	/*	 
		look = multiply(rotateY(drag.dx), look);
		look = multiply(look, rotateX(drag.dy));
		
			mvpMatrix = multiply(look, pers);  
	*/ 
		


		look = LookAt(0, 0, drag.deltaY, 0, 0, -100, 0, 1, 0);  
	  mvpMatrix = multiply(multiply(drag.rotate, look),pers);
	    
	
		//sphere.draw(mvpMatrix);
		sphere.drawTest(mvpMatrix, 0);
		requestAnimationFrame(tick); 
		
	}
	    
  var image = new Image();               //导入的图片 	   
	image.onload = function(){
            
	          var texture = gl.createTexture();
          //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);    
            gl.activeTexture(gl.TEXTURE0); 
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);       
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            //sphere.draw(mvpMatrix);
            tick(); 
            
	};   
    
	image.src = "img/source.jpg";  
	
}
 
//var init = new Init();
  

////////////////////////////////////////////////////////////////////////////////////



function DragTest2(canvas){  
	    this.textureMaker = new TextureMaker(gl, canvas); 
	    this.rotate = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];  //初始旋转矩阵
	     
  		this.dx = 0;                    //鼠标横向移动时的速度
		  this.dy = 0;                    //鼠标纵向移动的速度
		  this.x = 0;                     //鼠标横向移动的距离
		  this.y = 0;                     //鼠标纵向移动的距离
		
		  this.deltaY = 0;                  //鼠标滚轮的状态
		  this.state = 1;
			
		  var dragging = false;         // Dragging or not
		  var lastX = 0, lastY = 0;     // Last position of the mouse
		  var that = this;
		  
		  canvas.onmousedown = function(ev) {   // Mouse is pressed
		    var x = ev.clientX, y = ev.clientY;
		    // Start dragging if a moue is in <canvas>
		    var rect = ev.target.getBoundingClientRect();
		    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom){
		    	
		      lastX = x; lastY = y;
		      dragging = true;
		    } 
		  };
		  canvas.onmouseup = function(ev) {  
		  	dragging = false;   
		  	var ans = calculate(multiplyMV(that.rotate, [0, 0, -1, 1]), that.state);
		  	that.textureMaker.drawTexture(ans.src, ans.startX, ans.startY, ans.endX, ans.endY); 
		  	console.log(ans.src);
		  	
		  }; // Mouse is released
		  canvas.onmousemove = function(ev) { // Mouse is moved
		    if (dragging) { 
		  
		      var factor = 100 / canvas.height; // The rotation ratio

		       that.x += factor * (ev.clientX - lastX);   
		       that.y += factor * (ev.clientY - lastY);
		       that.y = Math.max(-90, Math.min(90, that.y)); 
           that.rotate = multiply(rotateY(that.x), rotateX(that.y));
		   
		       lastX = ev.clientX, lastY = ev.clientY;
		      
		      
		    }  
		  }; 
		  
		  canvas.onmousewheel = function(ev){
		  	  that.deltaY += ev.deltaY / 20;      
		  	  that.deltaY = Math.max(-20, Math.min(10, that.deltaY));
		  	  if(that.deltaY >= 0)
		  	     that.state = 1;
		  	  else if(that.deltaY >= -10)
		  	     that.state = 1;
		  	  else that.state = 2;
		  	  
		//  	  console.log(that.deltaY); 
		  }
};
 

var InitTest = function(){ 
	  var x = 0; 
	  var y = 0;
	  var sphere = new Sphere(gl);          //绘制的球体   
    var drag = new DragTest2(canvas);      //拖拽事件控制 
    
	function tick(){
		look = LookAt(0, 0, drag.deltaY, 0, 0, -100, 0, 1, 0);  
	  mvpMatrix = multiply(multiply(drag.rotate, look),pers);
	   
		sphere.drawTest(mvpMatrix, drag.textureMaker.TEXTURENUM); 
		requestAnimationFrame(tick); 
		 
	} 
	drag.textureMaker.drawTexture("img/source.jpg", 0, 0, 1, 1);  
	tick();
} 
  
var initTest = new InitTest(); 
