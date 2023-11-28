export class Timer{
    constructor(timer){
      this.timer = timer;
        this.updateCountdown(this.timer);
    }
    
    updateCountdown(timer){
        let countdownEl = document.getElementById('countdown');
        timer=timer/1000;
        const minutes = Math.floor(timer/60);
        let seconds = timer % 60;
      
        seconds = seconds < 10 ? "0" + seconds : seconds; 
      
        countdownEl.innerHTML = `${minutes}: ${seconds}`;
      
        if(minutes == 0 && seconds ==0){
          openPopup();
        }
      }

}

let popup = document.getElementById("popup"); 

addEventListener("keydown", e=>{
  if(e.code == "KeyR"){
    popup.classList.add("open-popup");
  }
})
addEventListener("keyup", e=>{
  if(e.code == "KeyR"){
  popup.classList.remove("open-popup");
  }
})

let canvas = document.getElementById("game");

let counter=1;
addEventListener("keypress", e=>{
  if(e.code == "KeyZ" && counter%2 ==1){
    canvas.classList.add("full-screen")
    counter++;
  }
  else{
    canvas.classList.remove("full-screen")
    counter++;
  }
})