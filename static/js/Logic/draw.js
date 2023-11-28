//Uploadovanje slika iz gif-a:

import PlayersURL from "../../gif/Players.png";
import MapBaseURL from "../../gif/MapBase.png";
import MapFrameURL from "../../gif/MapFrame.png";
import TileBorderURL from "../../gif/TileBorder.png"
import FullTileEntitiesURL from "../../gif/Tiles.png";
import BossURL from "../../gif/Boss.png";


// Slike =====================================================================================

let players = new Image();	
let mapBase = new Image();
let mapFrame = new Image();
let tileBorder = new Image();
let FullTileEntities = new Image();
let boss = new Image();

players.src = PlayersURL;
mapBase.src = MapBaseURL;
mapFrame.src = MapFrameURL;
tileBorder.src =  TileBorderURL;
FullTileEntities.src = FullTileEntitiesURL;
boss.src = BossURL;


// Dimenzije za Tajlove =====================================================================================
const numOfRows = 29;
const dTileW = 44;  // Skraceno od  - Destination Tile Width - Sirina tile-a na canvasu
const dTileH = 44;  // Skraceno od  - Destination Tile Height - Visina tile-a na canvasu
const sTileW =  44; // Skraceno od  - Source Tile Width - Sirinu koju uzima od izvorne slike
const sTileH =  44; // Skraceno od  - Source Tile Height - Visinu koju uzima od izvorne slike
const sPlayerW =  44; 
const sPlayerH = 44;

var angle = 0; // rotacija entiteta
var angle1 =0; // rotacija pozadine mape;
var helper = true;
var i=44;

// Tipovi entitija: =====================================================================================
const TileEntity = { // uzima delovi 1, drugi red kako to zna pitate se? ctrl f = 
    Asteroid300:   { index: 0 },
    Asteroid200:   { index: 1 },
    Asteroid100:   { index: 2 },
    WORMHOLE:   { index: 3 },
    BLACKHOLE:  { index: 4 }, 
	HEALTH :    { index: 5},
	EXPERIENCE: {index: 6}
};


export class Draw{
	constructor(ctx){
		window.ctx = ctx; 
	}

	drawRotatedPlayer(player){

		if(player.rotated == false){
			this.rotatePlayer(player);
		}		
		else if(player.moved == false){
			this.movePlayer(player);
		} else{

			ctx.save();
			ctx.translate(player.x+22,player.y+22);
			ctx.rotate(player.angle*Math.PI/180);
			ctx.drawImage(
				players,		// what image
				sPlayerW*player.index, //source image start crop
				0,				// source image start crop
				sPlayerW,		//source image width crop
				sPlayerW,       // source image 
				-22,
				-22,
				44,
				44
			)		
			ctx.restore();	

		}
	}

	rotatePlayer(player){
		
		ctx.save();
		ctx.translate(player.prevX+22,player.prevY+22);
			ctx.rotate(player.difAngle*Math.PI/180);
			ctx.drawImage(
				players,		// what image
				sPlayerW*player.index, //source image start crop
				0,				// source image start crop
				sPlayerW,		//source image width crop
				sPlayerW,       // source image 
				-22,
				-22,
				44,
				44
			)
		ctx.restore();
		calculateAngle(player);
	}

	movePlayer(player){
		ctx.save();
		ctx.translate(player.x - player.difX+22, player.y - player.difY+22);
			ctx.rotate(player.angle*Math.PI/180);
			ctx.drawImage(
				players,		// what image
				sPlayerW*player.index, //source image start crop
				0,				// source image start crop
				sPlayerW,		//source image width crop
				sPlayerW,       // source image 
				-22,
				-22,
				44,
				44
			)
		
		ctx.restore();	
		calculateDifXY(player);
		
	}
	
	// Iscrtavanje podloge mape:
	drawMapBase(){
		ctx.save();
		ctx.translate(551, 488);
		ctx.rotate(angle1*Math.PI/180);
		
		ctx.drawImage(
			mapBase,
			-551,
			-551
		)
			angle1 = angle1+0.02;
		ctx.restore();
	};
	drawMapFrame(){
		ctx.drawImage(
			mapFrame,
			-1,
			-3
		)

	}
	// Iscrtavanje Boss-a:
	drawBoss(){
		ctx.drawImage(
			boss,
			492,
			429
		)
	}
	
	// Opsta funkcija:
	drawTile(tile) {
		var [x,y] = convertCoordinates(tile.r, tile.q);
		let entity = tile.entity;
		var entityType;

		if(!(entity.type === 'EMPTY' || entity.type === 'BOSS')){		
            if(entity.type === 'ASTEROID'){
                if(entity.health > 200){
					entityType = TileEntity['Asteroid300'];
                }
                if(entity.health >100 && entity.health <= 200){
                    entityType = TileEntity['Asteroid200'];
                }
                if(entity.health <= 100 ){
                    entityType = TileEntity['Asteroid100'];
                }
            } else entityType = TileEntity[entity.type];

            this.drawEntity(x, y, entityType.index);	
		}
       this.drawTileBorder(x,y);	
	}
    // za vezbu okvir tajla:
	drawTileBorder(x,y){
        ctx.drawImage(
            tileBorder, 
            x, 
            y
        );
    }
    // Ako ima entity poziva ovo:
	drawEntity(x, y, indexOfEntityType){
		angle +=0.005;
		ctx.save();
		ctx.translate(x+22,y+22);
		ctx.rotate(angle*Math.PI/180);
		ctx.drawImage(
        	FullTileEntities,
        	sTileW * indexOfEntityType,
			0, 
			sTileW, 
			sTileH,
        	-22, 
        	-22, 
        	dTileW, 
        	dTileH
    	);
		ctx.restore();
  	}
	drawAttackedTile(r,q){
		var [x,y] = convertCoordinates(r, q);
		
		
		//console.log(x,y);
		ctx.drawImage(
        	FullTileEntities,
        	0,
			44,
			44,
			44,
			x,
			y,
			44,
			44
    	); 
		
		
	}

	drawLaserAttack(player){
		if(player.rotated == true){
			if(player.laserDrawn == false){
				ctx.beginPath();
				ctx.strokeStyle = "orange";
				ctx.lineWidth = 1;
				ctx.moveTo(player.x +22,player.y +22);
				ctx.lineTo(player.attackedX + 22 - player.difLaserX, player.attackedY + 22 - player.difLaserY);
				ctx.stroke();
				calculateDifLaserXY(player);
			} else{
				ctx.beginPath();
				ctx.strokeStyle = "orange";
				ctx.lineWidth = 1;
				ctx.moveTo(player.x +22,player.y +22);
				ctx.lineTo(player.attackedX + 22, player.attackedY + 22);
				ctx.stroke();
				calculateDifLaserXY(player);
			}
			if(player.laserDrawn == true)
				this.drawAttackedTile(player.attackedR, player.attackedQ);
		}	
	}
	drawBossLaserAttack(endR, endQ){	
		var [endX, endY] = convertCoordinates(endR, endQ);		
		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.lineWidth = 3;
		ctx.moveTo(550,535);
		ctx.lineTo(endX + 22, endY + 22);
		ctx.stroke();
	}
		
}

function convertCoordinates(r, q){
	let x = 266 + (14+r)*19 + q*38;
	let y = (14 + r)*33;
	return [x,y];
}

function calculateAngle(player){
	if(Math.abs(player.angle - player.difAngle) > 2){
		var speed = 3;
		if(player.difAngle>=269 && player.angle<=91) {
			if(player.difAngle>360) {
				player.difAngle=player.difAngle-360;
			}
			player.difAngle = player.difAngle + speed;
			return;
		}
		if(player.angle>=269 && player.difAngle<=91) {
			if(player.difAngle<0) {
				player.difAngle=360+player.difAngle;
			}
			player.difAngle = player.difAngle - speed;
			return;
		}		
		if(player.angle > player.difAngle){
			player.difAngle = player.difAngle + speed;
			
		} else player.difAngle = player.difAngle - speed;
	} else player.rotated = true;
}


function calculateDifXY(player){
	var speed = 1;

	if(player.difX > 0){
		if(player.coefXY <1){
			player.difX = player.difX- player.coefXY*speed;
		} else player.difX = player.difX- speed;
	}
	if(player.difX < 0){
		if(player.coefXY <1){
			player.difX = player.difX +  player.coefXY*speed;
		} else player.difX = player.difX +  speed;
	}
	if(player.difY > 0 ){
		if(player.coefXY >1){
			player.difY = player.difY - player.coefXY*speed;
		} else player.difY = player.difY - speed;
		
	}
	if(player.difY < 0){
		if(player.coefXY >1){
			player.difY = player.difY + player.coefXY*speed;
		} else player.difY = player.difY + speed;
	}

	if(player.difX == 0 && player.difY == 0){
		player.moved = true;
	}
}
function calculateDifLaserXY(player){
	var speed = 8;

	if(player.difLaserX > 0){
		if(player.coefLaser <1){
			player.difLaserX = player.difLaserX- player.coefLaser*speed;
		} else player.difLaserX = player.difLaserX- speed;
	}
	if(player.difLaserX < 0){
		if(player.coefLaser <1){
			player.difLaserX = player.difLaserX +  player.coefLaser*speed;
		} else player.difLaserX = player.difLaserX +  speed;
	}
	if(player.difLaserY > 0 ){
		if(player.coefLaser >1){
			player.difLaserY = player.difLaserY - player.coefLaser*speed;
		} else player.difLaserY = player.difLaserY - speed;
		
	}
	if(player.difLaserY < 0){
		if(player.coefLaser >1){
			player.difLaserY = player.difLaserY + player.coefLaser*speed;
		} else player.difLaserY = player.difLaserY + speed;
	}

	if(player.difLaserX < speed && player.difLaserY <speed){
		
		player.laserDrawn = true;
	}
}




