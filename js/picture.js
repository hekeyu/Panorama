var canvas = document.getElementById("canvas");
var gl = canvas.getContext('webgl'); 
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);
var look = LookAt(0, 0, 5, 0, 0, 0, 0, 1, 0); 
var pers = SetPerspective(40, canvas.width / canvas.height, 0.1, 10);
var mvpMatrix = multiply(look, pers);
 
 

   

var Pl = function(gl){

	this.program = createProgram(gl, "planeVertex", "planeFragment");
	var vertices = new Float32Array([   // Coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
   
   //  1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
  
	]);
  	var indices = new Uint8Array([
	     0, 1, 2,   0, 2, 3,    // front
	  
 	]);
 	
 	var verticesBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  	gl.bindBuffer(gl.ARRAY_BUFFER, null);
  	
  	var indexBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
	this.draw = function(u_MvpMatrix){
	    gl.useProgram(this.program);
	    
	  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
	  	gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT, false, 0, 0);  
	  	gl.enableVertexAttribArray(this.program.a_Position);
 	     
 	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
 	    
 	    gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, u_MvpMatrix);
 	    
 	    gl.uniform1i(this.program.u_Sampler, 0);
      
 	    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0); 
	} 
	
	this.drawTest = function(u_MvpMatrix, num){
	    gl.useProgram(this.program);
	    
	  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
	  	gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT, false, 0, 0);  
	  	gl.enableVertexAttribArray(this.program.a_Position);
 	     
 	    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
 	    
 	    gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, u_MvpMatrix);
 	    
 	    gl.uniform1i(this.program.u_Sampler, num);
      
 	    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0); 
	} 
}

//////////////////////////////////////////////////////




var Draw = function(gl){
	this.program = createProgram(gl, "drawVertex", "drawFragment");
	var vertices = new Float32Array([   // Coordinates
     -1.0, -1.0,  -1.0, 1.0,   1.0, 1.0,   1.0,-1.0
	]);  
	var texPos = new Float32Array([   // Coordinates
     -1.0, -1.0,  -1.0, 1.0,   1.0, 1.0,   1.0,-1.0
	]); 
  	var indices = new Uint8Array([
	     0, 1, 2,   0, 2, 3,    // front
	  
 	]);
 	var verticesBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texPos, gl.STATIC_DRAW); 
		
  	
  	var indexBuffer = gl.createBuffer();
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  
  
	this.drawTest = function(startX, startY, endX, endY, textureNum){ 
		gl.useProgram(this.program);
		vertices[0] = startX * 2 - 1;    vertices[1] = startY * 2 - 1;
		vertices[2] = startX * 2 - 1;    vertices[3] = endY   * 2 - 1;
	 	vertices[4] = endX   * 2 - 1;    vertices[5] = endY   * 2 - 1;
	 	vertices[6] = endX   * 2 - 1;    vertices[7] = startY * 2 - 1;
        
        gl.uniform1i(this.program.u_Sampler, textureNum);
 	 
		gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);	
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);  
		gl.vertexAttribPointer(this.program.a_Position, 2, gl.FLOAT, false, 0, 0);  
	  	gl.enableVertexAttribArray(this.program.a_Position);
 	    
 	    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
 	    gl.bufferData(gl.ARRAY_BUFFER, texPos, gl.STATIC_DRAW);  
 	    gl.vertexAttribPointer(this.program.a_Texture, 2, gl.FLOAT, false, 0, 0);  
	    gl.enableVertexAttribArray(this.program.a_Texture);
	     
  		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0); 
		}
	 
}

 

function createFBOTest (gl, width, height, num) {
    gl.activeTexture(gl['TEXTURE' + num]);   
    var texture = gl.createTexture();  
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);              
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height,  0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
     
    this.texture = texture;
    this.frameBuffer = fbo;
    this.textureNum = num;
 
}


 
var TextureMaker = function(gl, canvas){
	var LOCK = 1;
	var fbo1 = new createFBOTest(gl, 4096, 2048, 7);
	var fbo2 = new createFBOTest(gl, 4096, 2048, 8);   
	var draw = new Draw(gl); 
	var imageTexture = gl.createTexture(); 
	this.TEXTURENUM = 7;
    function swap(){
    	var temp = fbo1;   	 
    	fbo1 = fbo2;
    	fbo2 = temp;
    }
	this.drawTexture = function(src, startX, startY, endX, endY){
		var image = new Image();
		var that = this;
		image.onload = function(){
 
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);           //加载图片到9号纹理
            gl.activeTexture(gl.TEXTURE9); 
            gl.bindTexture(gl.TEXTURE_2D, imageTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);       
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);      
             
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo1.frameBuffer);
            gl.viewport(0, 0, 2048, 1024); 
            gl.clearColor(1, 1, 0, 1); 
            gl.clear(gl.COLOR_BUFFER_BIT); 
            
              
            draw.drawTest(0, 0, 1, 1, fbo2.textureNum);    //绘制原来的图像 
            draw.drawTest(startX, startY, endX, endY, 9);             //绘制新图像
                
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            
            gl.viewport(0, 0, canvas.width, canvas.height);
            that.TEXTURENUM = fbo1.textureNum;
              
        //////    
            pl.drawTest(mvpMatrix, textureMaker.TEXTURENUM); 
        //////
			swap();
			
			
		}
		image.src = src;	
	}	 
}
  
var pl = new Pl(gl);
var textureMaker = new TextureMaker(gl, canvas);
 
textureMaker.drawTexture("img/1.jpg", 0, 0, 0.7, 0.7);  

textureMaker.drawTexture("img/1.jpg", 0.3, 0.3, 1.0, 1.0);  
 
 
  
