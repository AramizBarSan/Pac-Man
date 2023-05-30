// llamar a la funciones mp3
var EATING_SOUND = new buzz.sound([ 
    "./sound/eating.mp3" 
]);
var GHOST_EATEN_SOUND = new buzz.sound([
	"./sound/ghost-eaten.mp3" 
]);
var EXTRA_LIFE_SOUND = new buzz.sound([
    "./sound/extra-life.mp3" 
]);
var EAT_PILL_SOUND = new buzz.sound([
    "./sound/me van a matar causa .mp3" 
]);
var EAT_FRUIT_SOUND = new buzz.sound([
    "./sound/que bendicion.mp3" 
]);
var EAT_GHOST_SOUND = new buzz.sound([
    "./sound/el diablo.mp3" 
]);
var SIREN_SOUND = new buzz.sound([
    "./sound/siren.mp3" 
]);
var WAZA_SOUND = new buzz.sound([
    "./sound/waza.mp3" 
]);
var READY_SOUND = new buzz.sound([
    "./sound/pacp.mp3"

]);
var DIE_SOUND = new buzz.sound([
    "./sound/siganviendo .mp3" 
]);
 var BACK_SOUND = new buzz.sound([
    "./sound/QUE PRO.mp3"
]);
var GAME_OVER_SOUND = new buzz.sound([
    "./sound/mataroon.mp3"
]);

//* variables asignadas de los mp3
var GROUP_SOUND = new buzz.group( [ EATING_SOUND, SIREN_SOUND, EAT_PILL_SOUND, EAT_GHOST_SOUND, READY_SOUND, DIE_SOUND, WAZA_SOUND, GHOST_EATEN_SOUND, EXTRA_LIFE_SOUND, EAT_FRUIT_SOUND, BACK_SOUND ] );

var EATING_SOUND_LOOPING = false;

// variables de los sonidos para retornar los sonidos
function isAvailableSound() { 
	return !($("#sound").css("display") === "none");
}

function loadAllSound() { // sonido de carga 
	if ( isAvailableSound() ) GROUP_SOUND.load();
}

function playEatingSound() {  // sonido de comer
	if (isAvailableSound()) { 
		if ( !EATING_SOUND_LOOPING ) { 
			EATING_SOUND_LOOPING = true;
			
			EATING_SOUND.setSpeed(1.35);
			EATING_SOUND.loop();
			EATING_SOUND.play();
		}
	}
}
function stopEatingSound() { // sonido parar de comer
	if (isAvailableSound()) { 
		if ( EATING_SOUND_LOOPING ) { 
			EATING_SOUND.unloop();
			EATING_SOUND_LOOPING = false;
		}
	}
}

function playExtraLifeSound() {  // sonido de vidas extra
	if (isAvailableSound()) { 
		EXTRA_LIFE_SOUND.play();
	}
}

function playEatFruitSound() {  // sonido al comer frutas
	if (isAvailableSound()) { 
		EAT_FRUIT_SOUND.play();
	}
}
function playEatPillSound() {  // sonido al comer puntos
	if (isAvailableSound()) { 
		EAT_PILL_SOUND.play();
	}
}
function playEatGhostSound() {  // sonido al comer fantasmas
	if (isAvailableSound()) { 
		EAT_GHOST_SOUND.play();
	}
}

function playWazaSound() {  // sonido del pacman "waza"
	if (isAvailableSound()) { 
		stopSirenSound();
		stopEatSound();
		WAZA_SOUND.loop();
		WAZA_SOUND.play();
	}
}
function stopWazaSound() {  // parar el sonido de pacman "waza"
	if (isAvailableSound()) { 
		WAZA_SOUND.stop();
	}
}

function playGhostEatenSound() {  // sonido de los fantasmas al comer
	if (isAvailableSound()) { 
		stopSirenSound();
		stopWazaSound();
		GHOST_EATEN_SOUND.play();
		GHOST_EATEN_SOUND.loop();
	}
}
function stopEatSound() {  // parar sonido de comer
	if (isAvailableSound()) { 
		GHOST_EATEN_SOUND.stop();
	}
}

function playSirenSound() {  // sonido de los fantasmas 
	if (isAvailableSound()) { 
		stopWazaSound();
		stopEatSound();
		SIREN_SOUND.loop();
		SIREN_SOUND.play();
	}
}
function stopSirenSound() {  // para sonidos de los fantasmas
	if (isAvailableSound()) { 
		SIREN_SOUND.stop();
	}
}

function playReadySound() {  // reanudar sondo
	if (isAvailableSound()) { 
		READY_SOUND.play();
		 
	}
}

function playDieSound() {  // sonido de muerte
	if (isAvailableSound()) { 
		GROUP_SOUND.stop();
		DIE_SOUND.play();
	}
}

function stopAllSound() {  // 
	if (isAvailableSound()) { 
		GROUP_SOUND.stop();
	}
	function playbacksound() { 
		if (isAvailableSound()) { 
			BACK_SOUND.play(); // sonido al ganar 

		}
	}
}
