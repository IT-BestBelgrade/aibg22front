//Uploadovanje slika iz gif-a:

import PlayersURL from "../gif/milorad.png";
import MapBaseURL from "../gif/pozadina.png";
import TerrainTilePartsURL from "../gif/delovi1.png";
import DeadRightURL from "../gif/mrtav.png";
import DeadLeftURL from  "../gif/mrtav1.png";

import { API_ROOT } from "./configuration";

// SLIKE =====================================================================================
	
let terrain = new Image();
let players = new Image();
let mapBase = new Image();

terrain.src = TerrainTilePartsURL;

players.src = PlayersURL;
mapBase.src = MapBaseURL;

//=====================================================================================
//let seconds;
//let res1;
//let timer = document.querySelector("#countdown");

// SLIKE =====================================================================================
const tileCanvasW = 44; // Velicina tile-a na canvasu
const tileCanvasH = 44; // --
const tileImageW =  44; // Velicinu slike koje ce da uzme
const tileImageH =  44; //

// SLIKE =====================================================================================
//velicina mape, broj polja
//TO DO: ovo zameniti sa necim smislenim po cemu moze da se iterira
const mapW = 25;
const mapH = 30;

//na slici sa koje se uzima jedan tile je 32px (slika preko polja)
//slika mora biti dimenzija 256x256

const tileImagePlayer =  44;

//mozda player sa leve i desne strane mozda na mapi, sirina dela za poene
const avatarCanvasW = 100;
const avatarCanvasH = 100;

const terrainCanvasSizeW = 1102;
const terrainCanvasSizeH = 968; //ovo mozemo staviti na 1000

const canvasPaddingW = 0;
const canvasPaddingH = 0;



//sve vrste Entity-a
const ITEM_TYPES = { // uzima delovi 1, drugi red kako to zna pitate se? ctrl f = 
  ISLANDFLAG: { index: 2 },
  ISLANDSHOP: { index: 3 },
  WHIRLPOOL: { index: 4 }
};
//sve vrste tile-ova
const TILE_TYPES = { // uzima delovi 1, prvi red 
  NORMAL: { index: 0 },
  ISLAND: { index: 1 }
};

const DIRECTIONS = {
  DOWN: 0,
  UP: 1,
  LEFT: 2,
  RIGHT: 3
};



class Draw{
	//ctx - canvas; terrain - izgled ostrva/entiteta; tileVersion - upitno
	constructor({ctx, terrain}){
		this.ctx = ctx; // neko sranje koje crta sve. ime za contex canva 
		this.terrain = terrain; // zapravo slika delovi1, pogledaj tyle types
	}
	
	//iscrtava podlogu mape
	drawMapBase(){
		this.ctx.drawImage(
			mapBase,
			0,
			0
		)
	};
	
	//crta pojedinacne tile-ove(x,y - koord; tile - podaci o tile-u iz JSON-a
	drawTile(x, y, tile) {
		x = qtox(tile.q, tile.r);
		y = rtoy(tile.r);

		let type = TILE_TYPES[tile.tileType];
		let entity = tile.entity;
				
		if(type.index == 1){
			this.drawTileOnCanvas({x,y}, type); // prosledjuje dictionariju xi y kao piksele 
		}

		if(entity){			
			let entityType = ITEM_TYPES[entity.type];
//			if(item.index == 2) return;
			this.drawTrapOnCanvas(x, y, entityType.index);		
		}	
	
	}
	
	//iz nasih podataka prevodi u potrebne informacije za canvas drawImage
	drawTileOnCanvas({ x, y, offsetX = 0, offsetY = 0 }, type) {
		this.ctx.drawImage(
			terrain,  // slika delovi1
			tileImageW * type.index, // zajedno iznad
			0, // pocetna koordinata na slici
			tileImageW, // velicina kvadrata, width
			tileImageH, // valicina kvadrata, height
			x + 2, // zbog bordera plus dva
			y + 8, // isto samo osam? vasilevska vlaska magija neka. 
			tileCanvasW, // velicina koja na canvasu treba da bude popunjena
			tileCanvasH // idealno tileImage i tileCanvasH su iste. 
		);
	}
	
	drawTrapOnCanvas(x, y, trap){
		this.ctx.drawImage(
        	terrain,
        	tileImageW * trap,
			tileImageH * 1, // isto kao gore samo *1 jer red
			tileImageW, 
			tileImageH,
        	x + 2, // 
        	y + 8, 
        	tileCanvasW, 
        	tileCanvasH
    	);
  	}
}

class Character {
	constructor(ctx, info, index) { // info tu je sve. index suvisan. 
		this.ctx = ctx;
        this._id = info.id; // 
        this.q = info.q; // pozicija
        this.r = info.r; // pozicija
        this.index = info._id - 1; // zbog indeksiranja sa slikom u realnosti islo 1 pa sad od 0
        this.oldHP = info.health;
        this.HP = info.health;
        this.coins = info.money;
        this.cannons = info.cannons;
        this.teamName = info.name ? info.name : info._id;
		this.update(info);
		//this.counter = this.index; potencijalno ovo ni ne treba
		this.paralysed = false;
		this.counter = 0;
		this.steps = 5000;
		this.left = 4;
	}
	
	//crtanje igraca - TODO ubacivanje directiona
	draw(){
		this.counter++;
		let index = this.index;
        if(this.HP <= 0){
        	index = 5; // kad umre index za iscrtavanje 
        }
		if(index == 17 || index == 16) index = 4;


        if(this.oldHP > 0){
        this.ctx.drawImage(
            players, //mi ovde imamo jos jedan if koji bira sliku u zavisnosti od pravca
            index*tileImageW,//this.direction * tileImageW + underAttackOffset,
            0,//this.type.index * tileImageH * 4,
            tileImagePlayer,
            tileImagePlayer,
            qtox(this.q, this.r) + canvasPaddingW,     //racunanje pozicije na mapi gde se crta igrac, konverzija koordinata
            rtoy(this.r),
            tileCanvasW,
            tileCanvasH
        );
        }
        

        if(this.oldHP > this.HP){ //pod napadomk je pa se crtaju bombice 
        this.ctx.drawImage(
            terrain, //mi ovde imamo jos jedan if koji bira sliku u zavisnosti od pravca
            2*tileImageW,//this.direction * tileImageW + underAttackOffset,
            0,//this.type.index * tileImageH * 4,
            tileImagePlayer,
            tileImagePlayer,
            qtox(this.q, this.r) + canvasPaddingW,     //racunanje pozicije na mapi gde se crta igrac, konverzija koordinata
            rtoy(this.r),
            tileCanvasW,
			tileCanvasH
        );
        }
        
	}
	
	//ne kapiram zasto ne moze samo direktno draw?
	refresh(){
		this.draw();
	}
	
	update(info) {
		/*
		this.oldHP = this.health;
		this.health = info.health;
		*/
		this.steps = info.steps;
		this.q = info.q;
		this.r = info.r;
		if(info.direction == 1){
			this.direction = 0;
		}
		if(info.direction == 0){
			this.direction = 1;
		}
		
		this.oldHP = this.HP;
        this.HP = info.health;
        this.coins = info.money;
        this.cannons = info.cannons;
		this.paralysed = info.paralysed;
		
		

		
		//TODO 
		//polja vervoatno sluze za infobox
		this.info = info;
		this.lastAction = info.lastAction;
		this.setInfoBox();
	}
	
	setInfoBox() {
		if(this._id == 17 || this._id == 18) return;
		//console.log(`.content${this.index}`);
		const div = document.querySelector(`.content${this.index+1}`);
		//console.log( div );
        if(this.HP <= 0){
          if((this.index+1)%2) div.querySelector(".slikaIgraca").src = `${DeadRightURL}`; 
          else div.querySelector(".slikaIgraca").src = `${DeadLeftURL}`;
		  div.querySelector(".steps").innerHTML = `${this.steps}`;
		  div.querySelector(".coins").innerHTML = `${this.coins}`;
		  div.querySelector(".health").innerHTML = `${this.HP}`;
		  div.querySelector(".cannons").innerHTML = `${this.cannons}`;
          return;
        }
    
        /*
        if (this.info.active) {
          div.classList.add("active");
        } else {
          div.classList.remove("active");
        }
        */
        div.querySelector("h3").innerHTML = `${this.teamName}`;     //ovo nama treba da radi!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        div.querySelector(".coins").innerHTML = `${this.coins}`;
        div.querySelector(".health").innerHTML = `${this.HP}`;
        div.querySelector(".cannons").innerHTML = `${this.cannons}`;
		div.querySelector(".steps").innerHTML = `${this.steps}`;
    
        //this.partsDiv.innerHTML = '';
    
    }
}

export class Game {
	constructor(gameId) {
        this.ctx = document.getElementById("game").getContext("2d"); // 2d kkanvas? just js things
        this.gameId = gameId;
        this.drawInstance = null; // na initu se inicij sve sto je ovde null 
        this.map = null;
        this.firstRender = true;
        this.players = [];
        this.shouldDraw = true;
        this.flagTile = null;
		this.prevRes = null;
		this.steps = 5000;
	}
	
	//inicijalizacija igrice - poziva se iz index.js
	init(){
		//kaci Draw na Game
		this.drawInstance = new Draw({
          ctx: this.ctx,
          terrain
        });
		jQuery(() => {
			//dozvoljava komunikaciju sa servervom bez reloadovanja stranice
			$.ajax({
				url: `http://${API_ROOT}/game?gameId=${this.gameId}&password=salamala`,
				dataType: "json",
				success: result => {
					//res1 = result; //???
					this.drawInstance = new Draw({
					ctx: this.ctx,
					terrain
				});
				this.update(result); //result je json od servera
				//timer.text(result.turn);//ovo se radi u update()
				this.steps = result.turn;
				//pokazuje winner pop-up
				if (result.winner !== null) {
					this.showWinner(result.winner);
				}
				//govori browser-u da pozove update funkciju neke animacije pre sledeceg redraw-a -- ovo ne radi ja mislim 
				requestAnimationFrame(this.draw.bind(this)); // bind vraca funkciju draw klase game, a prosledjuje joj Game
				},
				error: error => {
				//document.querySelector(".loading .loading-content").innerHTML =
				//	"<h1>Can't load game!</h1>";
				}
			});
		});
	}	
	
	//postavlja sledeceg igraca, ne znam sto se zove isAcitve
	isActive(player, game) {
        return this.HP>0;
    }
	
	//update-uje klasu
	//TODO NPC-evi i promenljiv broj igraca
    update(game) {
		//console.log(game.gameState);
		var game1 = JSON.parse(game.gameState);
		console.log(game1);
		console.log(game1.map);
		console.log(PlayersURL);
        console.log(game.winner);
        if (game.winner !== null) {
            this.shouldDraw = false;
			this.showWinner(game.winner);
        }
		this.flagTile = game.currFlag;
		//timer.text(game.turn);

		this.map = game1.map.tiles;
		this.steps = game1.turn;
		
        //dodati polje sa imenom tima
        const info1 = {
			_id: 1,
			steps: game.turn,
			active: this.isActive(game.player1, game),//ovo uvek vraca true, ne znam cemu sluzi
			...game.player1
        };
        const info2 = {
			_id: 2,
			steps: game.turn,
			active: this.isActive(game.player2, game),
			...game.player2
        };
        const info3 = {
			_id: 3,
			steps: game.turn,
			active: this.isActive(game.player3, game),
			...game.player3
        };
        const info4 = {
			_id: 4,
			steps: game.turn,
			active: this.isActive(game.player4, game),
			...game.player4
        };
		const info5 = {
			_id: 17,
			steps: game.turn,
			active: this.isActive(game.npc1, game),
			...game.npc1
        };
		const info6 = {
			_id: 18,
			steps: game.turn,
			active: this.isActive(game.npc2, game),
			...game.npc2
        };
		
		if (this.players.length) { 		
			
			this.players[0].update(info1);
			this.players[1].update(info2);
			this.players[2].update(info3);
			this.players[3].update(info4);
			this.players[4].update(info5);
			this.players[5].update(info6);
        } else {
			this.players = [
				new Character(this.ctx, info1,0),
				new Character(this.ctx, info2,1),
				new Character(this.ctx, info3,2),
				new Character(this.ctx, info4,3),
				new Character(this.ctx, info5,4),
				new Character(this.ctx, info6,4)
			];
        }
		/*
		i=0
		for(element of players){
			if(elemet.health <= 0){
				element.refresh();
				players.splice(i,1);
			}
			i++;
		}
		*/
		this.players.forEach(p => p.refresh())
	}
	
	draw(){
		if (this.ctx === null) {
			return;
        }
		
		this.drawInstance.drawMapBase();
        let cap = 15; //
        let sgn = 1; // 
        for (let y = 0; y < mapH; y++) {
			for (let x = 0; x < cap; x++) {
				this.drawInstance.drawTile(y, x, this.map[y][x]);
            }
			if(cap == 29) sgn = -1;
            cap = cap + sgn;
			if(sgn*cap == -14) break;
        }

       // let x = qtox(this.flagTile.q, this.flagTile.r); //iscrtavanje flega
      //  let y = rtoy(this.flagTile.r);
	//	this.drawInstance.drawTrapOnCanvas(x,y,2)
		
		this.players.forEach(p => p.refresh());
		
		if (this.shouldDraw || this.firstRender)  
			requestAnimationFrame(this.draw.bind(this));
        
		this.firstRender = false;
	}
	
	//winner pop-up
	async showWinner(winner) {
		console.log("uslo je u funkc");
        //const sleep = ms => new Promise(res => setTimeout(res, ms));
        //await sleep(2000);
        this.shouldDraw = false;
        let text = "Game over";
        const el = document.querySelector(".finished");
        if (winner) {
			text = `${winner.name} won the game!`;
        }else{
			text = `Ladies and gentleman, its a draw!`;
			el.querySelector("p").innerHTML = "";
        }
		el.querySelector("h1").innerHTML = text;
        el.classList.remove("hidden");
     }
} 



function rtoy(r){
	return (14 + r)*33; // y = 462 (idealno bi crtalo na 466, masi 4px)
}

function qtox(q,r){
	return 266 + (14+r)*19 + q*38; // 266 + (14 + 0) - 14*38
}
