export class Character {
	constructor(ctx, Player) { 
		this.ctx = ctx;
		this.id = Player.playerIdx;          
		this.index = this.id - 1; 

        this.q = Player.q;      
        this.r = Player.r;
		[this.x, this.y] = convertCoordinates(this.r, this.q);             
        
		this.prevQ = this.q;
		this.prevR = this.r;
		[this.prevX, this.prevY] = convertCoordinates(this.prevR, this.prevQ);             

		this.difX = 0;
		this.difY = 0;
		this.coefXY = 1;
		this.angle = 0;
		this.rotated = true;
		this.moved = true;

		this.name = Player.name;
		this.level  = Player.level;
		this.health = Player.health;
		this.power  = Player.power;
        this.deaths = Player.deaths;
		this.kills  = Player.kills;
        this.trapped = Player.trapped;
		this.score = Player.score;
		
		this.attackedQ = null;
		this.attackedR = null;
		this.attackedX = null;
		this.attackedY = null;
		this.difLaserX = 0;
		this.difLaserY = 0;
		this.coefLaser = 1;
		this.laserDrawn = true;
		this.setInfoBox();			 	
	}

	updatePlayer(Player, playerAttack){
		 
		// Ovo uvek update-uje: 
        this.level  = Player.level;
		this.health = Player.health;
		this.power  = Player.power;
        this.deaths = Player.deaths;
		this.kills  = Player.kills;
    	this.trapped = Player.trapped;
		this.score = Player.score;
		this.setInfoBox();	
		this.attackedQ =null;
			this.attackedR = null;

		// Prethodni potez:
		var [playerX, playerY] = convertCoordinates(Player.r, Player.q);
			
// Slucaj kada se respawnovao ili otisao kroz portal:		
	if(Math.abs(playerX-this.x)>70 || Math.abs(playerY-this.y)>70){
		this.moved = true;
		this.rotated = false;

		this.prevQ = this.q;
		this.prevR = this.r;
		[this.prevX, this.prevY] = convertCoordinates(this.prevR, this.prevQ);

		// Trenutni potez: 
		this.q = Player.q;             
		this.r = Player.r;
		[this.x, this.y] = convertCoordinates(this.r, this.q); 

		// Razdaljina za akciju move: 
		this.difX  = 0;
		this.difY = 0;
		this.coefXY = 1;
		// Resetovanje za laser jer se ne koristi:
		this.difLaserX = 0;
		this.difLaserY = 0;

		// Ugao za rotaciju:
		this.difAngle = 0;
		this.angle = 0;			
		
// Slucaj kada se pomeri:
	}else if( Player.q != this.q || Player.r != this.r){
		this.moved = false;
		this.rotated = false;

		this.prevQ = this.q;
		this.prevR = this.r;
		[this.prevX, this.prevY] = convertCoordinates(this.prevR, this.prevQ);

		// Trenutni potez: 
		this.q = Player.q;             
		this.r = Player.r;
		[this.x, this.y] = convertCoordinates(this.r, this.q); 

		// Razdaljina za akciju move: 
		this.difX  = this.x - this.prevX;
		this.difY = this.y - this.prevY;
		if(this.difX!=0  || this.difY !=0){
			this.coefXY  = Math.abs(this.difX/this.difY);
		} else this.coefXY = 1;

		// Ugao za rotaciju:
		this.difAngle = this.angle;
		this.angle = find_angle(this.prevR, this.prevQ, this.r, this.q);	

		// Resetovanje za laser jer se ne koristi:
		this.difLaserX = 0;
		this.difLaserY = 0;		
		
// Slucaj kada baca laser:		
	} else if(playerAttack != null && playerAttack.playerIdx == this.id){	
			this.prevQ = this.q;
			this.prevR = this.r;
			[this.prevX, this.prevY] = convertCoordinates(this.prevR, this.prevQ);

			// Trenutni potez: 
			this.q = Player.q;             
			this.r = Player.r;
			[this.x, this.y] = convertCoordinates(this.r, this.q); 
			// Ugao za rotaciju:
			this.difAngle = this.angle;
			this.attackedQ = playerAttack.q;
			this.attackedR = playerAttack.r;
			
			[this.attackedX, this.attackedY] = convertCoordinates(this.attackedR , this.attackedQ);
			// console.log(this.attackedX, this.attackedY);
			this.angle = find_angle(this.r, this.q, this.attackedR, this.attackedQ);			
			this.difLaserX = this.attackedX - this.x;
			this.difLaserY = this.attackedY - this.y;
			if(this.difLaserX!=0  || this.difLaserY !=0){
				this.coefLaser  = Math.abs(this.difLaserX/this.difLaserY);
			} else this.coefLaser = 1;

			this.rotated = false;
			this.moved = true;
			this.laserDrawn = false;
		} 				
	}

	
	setInfoBox() {
		const div = document.querySelector(`.player${this.index+1}`);
		
		div.querySelector(".name").innerHTML = `${this.name}`;
		div.querySelector(".level").innerHTML = `${this.level}`;
		div.querySelector(".health").innerHTML = `${this.health}`;
		div.querySelector(".kills").innerHTML = `${this.kills}`;
		div.querySelector(".deaths").innerHTML = `${this.deaths}`;
		div.querySelector(".score").innerHTML = `${this.score}`;		
     }
}

function convertCoordinates(r, q){
	let x = 266 + (14+r)*19 + q*38;
	let y = (14 + r)*33;
	return [x,y];
}

function find_angle(prevR, prevQ,currR, currQ){
	
	let [Bx, By] = convertCoordinates(prevR, prevQ);
	let [Cx, Cy] = convertCoordinates(currR, currQ);

	var Ax =Bx;
	var Ay = By-10;
	var AB = Math.sqrt(Math.pow(Bx-Ax, 2) + Math.pow(By -Ay,2));
	var BC = Math.sqrt(Math.pow(Bx-Cx, 2) + Math.pow(By -Cy,2));
	var AC = Math.sqrt(Math.pow(Cx-Ax, 2) + Math.pow(Cy -Ay,2));
	var angle =Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB))*180/Math.PI;

	if(Cx < Bx){
		return 360-angle;
	} else return angle;
}