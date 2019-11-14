	
function pointTransform(u, v){
	return [Math.cos(u * Math.PI) * Math.sin(v * Math.PI), Math.cos(v * Math.PI), Math.sin(u * Math.PI) * Math.sin(v * Math.PI)];
}
 
function distance(vecA, vecB){
	return Math.pow(vecA[0] - vecB[0], 2) + Math.pow(vecA[1] - vecB[1], 2) + Math.pow(vecA[2] - vecB[2], 2);
}


 
function calculate(vec, num){
    
   var mark;
   var startX, startY, endX, endY;
   
   if(distance(pointTransform(0.5, 0.5), vec) < distance(pointTransform(1.5, 0.5), vec)){
   	     startX = 0.0; startY = 0.0;
   	     endX = 1.0; endY = 1.0;
   	     mark = 1;
   }
   else{
   	     startX = 1.0; startY = 0.0;
   	     endX = 2.0; endY = 1.0;
   	     mark = 2;
   }
    
  // console.log(mark)
    
   for(var n = 0; n < num; n++){
   	  var gapX = (endX - startX) / 2;
   	  var gapY = (endY - startY) / 2; 
   	  var beginX = startX + gapX / 2;
   	  var beginY = startY + gapY / 2;
   	  
   	  var dist = 9999999;
   	  
   	  var a, b;
   	  
   	  for(var i = 0; i < 2; i++)
   	  	for(var j = 0; j < 2; j++){
   	  		var temp = distance(pointTransform(beginX + j * gapX, beginY + i * gapY), vec);
   	  		if(temp < dist){
   	  		   dist = temp;
   	  		   a = i;
   	  		   b = j;
   	  		  }
   	  	}
   	  startX += b * gapX;
   	  startY += a * gapY;
   	  endX = startX + gapX;
   	  endY = startY + gapY;
   	  mark = mark * 4 - 3 + a * 2 + b;
   	     
   }  
   return {
   	  src:"img/"+ num + "/" +mark +".jpg",
   	  startX: startX / 2,
   	  startY:startY,
   	  endX:endX / 2,
   	  endY:endY 
   }
}  
  
var Sphere = function(gl){ 
  this.program = createProgram(gl, "sphereVertex", "sphereFragment");
  var d = 30;
  var h = 30;
  var r = 30; 
  var vertices = [];
  var indices = []; 
  var colors = [];
  var tex = [];
  var perD = Math.PI * 2 / d;
  var perH = Math.PI / h;
  
  /*
  for(var i = 0; i <= d; i++){

   
  	vertices.push(0.0, r, 0.0); 
  	var color = hsva(0, 0, 1, 1);
  	colors.push(color[0], color[1], color[2]);
  	tex.push(1 / d * i, 0);
  	for(var j = 1; j <= h; j++){	
  		 vertices.push(r * Math.cos(i * perD) * Math.sin(j * perH),
  		 			   r * Math.cos(j * perH), 
  		               r * Math.sin(i * perD) * Math.sin(j * perH)); 
  		             
  		 tex.push(1 / d * i, 1 / h * j);
  		 
  		 var color = hsva(360 / d * i, 1, 1, 1);
  		 colors.push(color[0], color[1], color[2]);
  		 indices.push(i * (h+1) + j,   ((i + 1) * (h+1) + j - 1) % (d * (h+1)),   i * (h+1) + j - 1);
  		 indices.push(i * (h+1) + j,   ((i + 1) * (h+1) + j)%(d * (h+1)),    ((i + 1) * (h+1) + j - 1)%(d * (h+1)));  
  	}  
  } 
  */
//////////////////////////////////////////////////////////////////// 
  for(var j = 0; j <= h; j++){
  	vertices.push(r * Math.sin(j * perH),
  				  r * Math.cos(j * perH),
  				  0
  	);
  	tex.push(0, 1 / h * j);
  }
  
  for(var i = 1; i <= d; i++){
  	
  	vertices.push(0, r, 0);
  	tex.push(1 / d * i, 0);
  	
  	for(var j = 1; j <= h; j++){
  		vertices.push( r * Math.cos(i * perD) * Math.sin(j * perH),
  		 			   r * Math.cos(j * perH), 
  		               r * Math.sin(i * perD) * Math.sin(j * perH)
  		             ); 
  		tex.push(1 / d * i, 1 / h * j);
  		indices.push( (i - 1) * (h + 1) + j - 1, i * (h + 1) + j - 1, (i - 1) * (h + 1) + j,
  					   i * (h + 1) + j - 1, i * (h + 1) + j, (i - 1) * (h + 1) + j
  					);
  	}
  }
  	
//////////////////////////////////////////////////////////////////////
  var verticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
 
  var texBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex), gl.STATIC_DRAW);
   
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  
  this.draw = function(mvpMatrix){
  	gl.useProgram(this.program);
  	
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.program.a_Position);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.vertexAttribPointer(this.program.a_Tex, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.program.a_Tex);
      
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  	gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, mvpMatrix);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);	
  }
  
  this.drawTest = function(mvpMatrix, texNum){
  	gl.useProgram(this.program);
  	
  	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.program.a_Position);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.vertexAttribPointer(this.program.a_Tex, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.program.a_Tex);
      
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  	gl.uniformMatrix4fv(this.program.u_MvpMatrix, false, mvpMatrix);
  	gl.uniform1i(this.program.u_Sampler, texNum);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);	
  }
}
 
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
	var fbo1 = new createFBOTest(gl, 2048, 1024, 7);
	var fbo2 = new createFBOTest(gl, 2048, 1024, 8);   
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
  
			//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);           //加载图片到9号纹理
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
         //   pl.drawTest(mvpMatrix, textureMaker.TEXTURENUM);

        //////
			swap();
			
			
		}
		image.src = src;	
	}	 
}
 