var PACMAN_DIRECTION = 3; // Almacena la dirección actual de Pac-Man
var PACMAN_DIRECTION_TRY = -1; // Variable de control para un intento de cambio de dirección
var PACMAN_DIRECTION_TRY_TIMER = null; // Temporizador utilizado para cancelar el intento de cambio de dirección
var PACMAN_DIRECTION_TRY_CANCEL = 1000; // Cancelar direccion 
// Almacenan las coordenadas de la posición actual de Pac-Man
var PACMAN_POSITION_X = 276; //Posicion x de pacman
var PACMAN_POSITION_Y = 416; // Posicion y de pacman

var PACMAN_POSITION_STEP = 2; // Define el incremento de movimiento de Pac-Man
// Controlan el estado de la boca de Pac-Man mientras se mueve
var PACMAN_MOUNTH_STATE = 3; // Este y
var PACMAN_MOUNTH_STATE_MAX = 6; // Este

var PACMAN_SIZE = 16;  // Define el tamaño de Pac-Man
var PACMAN_MOVING = false; // Indica si Pac-Man está en movimiento
var PACMAN_MOVING_TIMER = -1; // Temporizador utilizado para el movimiento continuo de Pac-Man.
var PACMAN_MOVING_SPEED = 15; // Velocidad de movimiento de Pac-Man
var PACMAN_CANVAS_CONTEXT = null; // Contexto del lienzo HTML utilizado para dibujar a Pac-Man
// Distancias utilizadas para detectar colisiones entre Pac-Man, fantasmas y frutas
var PACMAN_EAT_GAP = 15;
var PACMAN_GHOST_GAP = 20;
var PACMAN_FRUITS_GAP = 15;
// Controlan la animación y velocidad de la muerte de Pac-Man
var PACMAN_KILLING_TIMER = -1;
var PACMAN_KILLING_SPEED = 70;

var PACMAN_RETRY_SPEED = 2100; // Velocidad de reinicio después de perder una vida
var PACMAN_DEAD = false; // Indica si Pac-Man está muerto

// Inicializa el juego y obtiene el contexto del lienzo para dibujar a Pac-Man 
function initPacman() { 
	var canvas = document.getElementById('canvas-pacman');
	canvas.setAttribute('width', '550');
	canvas.setAttribute('height', '550');
	if (canvas.getContext) { 
		PACMAN_CANVAS_CONTEXT = canvas.getContext('2d');
	}
}
// Reinicia las variables relacionadas con Pac-Man
function resetPacman() { 
	stopPacman();

	PACMAN_DIRECTION = 3;
	PACMAN_DIRECTION_TRY = -1;
	PACMAN_DIRECTION_TRY_TIMER = null;
	PACMAN_POSITION_X = 276;
	PACMAN_POSITION_Y = 416;
	PACMAN_MOUNTH_STATE = 3;
	PACMAN_MOVING = false;
	PACMAN_MOVING_TIMER = -1;
	PACMAN_KILLING_TIMER = -1;
	PACMAN_DEAD = false;
	PACMAN_SUPER = false;
}
// Devuelve el contexto del lienzo utilizado para dibujar a Pac-Man
function getPacmanCanevasContext() { 
	return PACMAN_CANVAS_CONTEXT;
}
// Detiene el movimiento de Pac-Man
function stopPacman() { 
	if (PACMAN_MOVING_TIMER != -1) { 
		clearInterval(PACMAN_MOVING_TIMER);
		PACMAN_MOVING_TIMER = -1;
		PACMAN_MOVING = false;
	}
	if (PACMAN_KILLING_TIMER != -1) { 
		clearInterval(PACMAN_KILLING_TIMER);
		PACMAN_KILLING_TIMER = -1;
	}
}
// Pausa el movimiento de Pac-Man
function pausePacman() { 
	if (PACMAN_DIRECTION_TRY_TIMER != null) { 
		PACMAN_DIRECTION_TRY_TIMER.pause();
	}
	
	if ( PACMAN_MOVING_TIMER != -1 ) { 
		clearInterval(PACMAN_MOVING_TIMER);
		PACMAN_MOVING_TIMER = -1;
		PACMAN_MOVING = false;
	}
}
// Reanuda el movimiento de Pac-Man después de pausarlo
function resumePacman() { 
	if (PACMAN_DIRECTION_TRY_TIMER != null) { 
		PACMAN_DIRECTION_TRY_TIMER.resume();
	}
	movePacman();
}
// Cancela el intento de cambio de dirección de Pac-Man
function tryMovePacmanCancel() { 
	if (PACMAN_DIRECTION_TRY_TIMER != null) { 
		PACMAN_DIRECTION_TRY_TIMER.cancel();
		PACMAN_DIRECTION_TRY = -1;
		PACMAN_DIRECTION_TRY_TIMER = null;
	}
}
// Intenta cambiar la dirección de Pac-Man en la próxima oportunidad
function tryMovePacman(direction) { 
	PACMAN_DIRECTION_TRY = direction;
	PACMAN_DIRECTION_TRY_TIMER = new Timer('tryMovePacmanCancel()', PACMAN_DIRECTION_TRY_CANCEL);
}
// Mueve a Pac-Man en la dirección especificada o en la dirección actual si no se proporciona ninguna dirección
function movePacman(direction) {

	if (PACMAN_MOVING === false) { 
		PACMAN_MOVING = true;
		drawPacman();
		PACMAN_MOVING_TIMER = setInterval('movePacman()', PACMAN_MOVING_SPEED);
	}
	
	var directionTry = direction;
	var quarterChangeDirection = false;
	
	if (!directionTry && PACMAN_DIRECTION_TRY != -1) { 
		directionTry = PACMAN_DIRECTION_TRY;
	}
	
	if ((!directionTry || PACMAN_DIRECTION !== directionTry)) { 
	
		if (directionTry) { 
			if (canMovePacman(directionTry)) { 
				if (PACMAN_DIRECTION + 1 === directionTry || PACMAN_DIRECTION - 1 === directionTry || PACMAN_DIRECTION + 1 === directionTry || (PACMAN_DIRECTION === 4 && directionTry === 1) || (PACMAN_DIRECTION === 1 && directionTry === 4) ) { 
					quarterChangeDirection = true;
				}
				PACMAN_DIRECTION = directionTry;
				tryMovePacmanCancel();
			} else { 
				if (directionTry !== PACMAN_DIRECTION_TRY) { 
					tryMovePacmanCancel();
				}
				if (PACMAN_DIRECTION_TRY === -1) { 
					tryMovePacman(directionTry);
				}
			}
		}

		if (canMovePacman(PACMAN_DIRECTION)) { 
			erasePacman();
			
			if (PACMAN_MOUNTH_STATE < PACMAN_MOUNTH_STATE_MAX) { 
				PACMAN_MOUNTH_STATE ++; 
			} else { 
				PACMAN_MOUNTH_STATE = 0; 
			}
						
			var speedUp = 0;
			if (quarterChangeDirection) { 
				speedUp = 6;
			}
			
			if ( PACMAN_DIRECTION === 1 ) { 
				PACMAN_POSITION_X += PACMAN_POSITION_STEP + speedUp;
			} else if ( PACMAN_DIRECTION === 2 ) { 
				PACMAN_POSITION_Y += PACMAN_POSITION_STEP + speedUp;
			} else if ( PACMAN_DIRECTION === 3 ) { 
				PACMAN_POSITION_X -= PACMAN_POSITION_STEP + speedUp;
			} else if ( PACMAN_DIRECTION === 4 ) { 
				PACMAN_POSITION_Y -= (PACMAN_POSITION_STEP + speedUp);
			}
			
			if ( PACMAN_POSITION_X === 2 && PACMAN_POSITION_Y === 258 ) { 
				PACMAN_POSITION_X = 548;
				PACMAN_POSITION_Y = 258;
			} else if ( PACMAN_POSITION_X === 548 && PACMAN_POSITION_Y === 258 ) { 
				PACMAN_POSITION_X = 2;
				PACMAN_POSITION_Y = 258;
			}
			
			drawPacman();
			
			if ((PACMAN_MOUNTH_STATE) === 0 || (PACMAN_MOUNTH_STATE) === 3) { 
				testBubblesPacman();
				testGhostsPacman();
				testFruitsPacman();
			}
		} else { 
			stopPacman();
		}
	} else if (direction && PACMAN_DIRECTION === direction) { 
		tryMovePacmanCancel();
	}
}
// Verifica si Pac-Man puede moverse en la dirección especificada
function canMovePacman(direction) { 
	
	var positionX = PACMAN_POSITION_X;
	var positionY = PACMAN_POSITION_Y;
	
	if (positionX === 276 && positionY === 204 && direction === 2) return false;
	
	if ( direction === 1 ) { 
		positionX += PACMAN_POSITION_STEP;
	} else if ( direction === 2 ) { 
		positionY += PACMAN_POSITION_STEP;
	} else if ( direction === 3 ) { 
		positionX -= PACMAN_POSITION_STEP;
	} else if ( direction === 4 ) { 
		positionY -= PACMAN_POSITION_STEP;
	}
	
	for (var i = 0, imax = PATHS.length; i < imax; i ++) { 
	
		var p = PATHS[i];
		var c = p.split("-");
		var cx = c[0].split(",");
		var cy = c[1].split(",");
	
		var startX = cx[0];
		var startY = cx[1];
		var endX = cy[0];
		var endY = cy[1];

		if (positionX >= startX && positionX <= endX && positionY >= startY && positionY <= endY) { 
			return true;
		}
	}
	
	return false;
}
// Dibuja a Pac-Man en el lienzo
function drawPacman() { 

	var ctx = getPacmanCanevasContext();
	
	ctx.fillStyle = "#fff200";// color pacman
	ctx.beginPath();
	
	var startAngle = 0;
	var endAngle = 2 * Math.PI;
	var lineToX = PACMAN_POSITION_X;
	var lineToY = PACMAN_POSITION_Y;
	if (PACMAN_DIRECTION === 1) { 
		startAngle = (0.35 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		endAngle = (1.65 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		lineToX -= 8;
	} else if (PACMAN_DIRECTION === 2) { 
		startAngle = (0.85 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		endAngle = (0.15 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		lineToY -= 8;
	} else if (PACMAN_DIRECTION === 3) { 
		startAngle = (1.35 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		endAngle = (0.65 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		lineToX += 8;
	} else if (PACMAN_DIRECTION === 4) { 
		startAngle = (1.85 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		endAngle = (1.15 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
		lineToY += 8;
	}
	ctx.arc(PACMAN_POSITION_X, PACMAN_POSITION_Y, PACMAN_SIZE, startAngle, endAngle, false);
	ctx.lineTo(lineToX, lineToY);
	ctx.fill();
	ctx.closePath();
}
// Borra a Pac-Man del lienzo
function erasePacman() { 

	var ctx = getPacmanCanevasContext();
	ctx.clearRect( (PACMAN_POSITION_X - 2) - PACMAN_SIZE, (PACMAN_POSITION_Y - 2) - PACMAN_SIZE, (PACMAN_SIZE * 2) + 5, (PACMAN_SIZE * 2) + 5);
}
// Maneja la lógica cuando Pac-Man es eliminado
function killPacman() { 
	playDieSound();

	LOCK = true;
	PACMAN_DEAD = true;
	stopPacman();
	stopGhosts();
	pauseTimes();
	stopBlinkSuperBubbles();
	PACMAN_KILLING_TIMER = setInterval('killingPacman()', PACMAN_KILLING_SPEED);
}
// Controla la animación de la muerte de Pac-Man
function killingPacman() { 
	if (PACMAN_MOUNTH_STATE > -12) { 
		erasePacman();
		PACMAN_MOUNTH_STATE --;
		drawPacman();
	} else { 
		clearInterval(PACMAN_KILLING_TIMER);
		PACMAN_KILLING_TIMER = -1;
		erasePacman();
		if (LIFES > 0) { 
			lifes(-1);
			setTimeout('retry()', (PACMAN_RETRY_SPEED));
		} else { 
			gameover();
		}
	}
}
// Verifica la interacción entre Pac-Man y los fantasmas
function testGhostsPacman() { 
	testGhostPacman('blinky');
	testGhostPacman('pinky');
	testGhostPacman('inky');
	testGhostPacman('clyde');

}
// Verifica la interacción entre Pac-Man y un fantasma específico
function testGhostPacman(ghost) { 
	eval('var positionX = GHOST_' + ghost.toUpperCase() + '_POSITION_X');
	eval('var positionY = GHOST_' + ghost.toUpperCase() + '_POSITION_Y');
		
	if (positionX <= PACMAN_POSITION_X + PACMAN_GHOST_GAP && positionX >= PACMAN_POSITION_X - PACMAN_GHOST_GAP && positionY <= PACMAN_POSITION_Y + PACMAN_GHOST_GAP && positionY >= PACMAN_POSITION_Y - PACMAN_GHOST_GAP ) { 
		eval('var state = GHOST_' + ghost.toUpperCase() + '_STATE');
		if (state === 0) { 
			killPacman();
		} else if (state === 1) { 
			startEatGhost(ghost);
		}
	}
}
// Verifica la interacción entre Pac-Man
function testFruitsPacman() { 
	
	if (FRUIT_CANCEL_TIMER != null) { 
		if (FRUITS_POSITION_X <= PACMAN_POSITION_X + PACMAN_FRUITS_GAP && FRUITS_POSITION_X >= PACMAN_POSITION_X - PACMAN_FRUITS_GAP && FRUITS_POSITION_Y <= PACMAN_POSITION_Y + PACMAN_FRUITS_GAP && FRUITS_POSITION_Y >= PACMAN_POSITION_Y - PACMAN_FRUITS_GAP ) { 
			eatFruit();
		}
	}
}
// Verifica la interacción entre Pac-Man
function testBubblesPacman() { 
	
	var r = { x: PACMAN_POSITION_X - ( PACMAN_SIZE / 2 ), y: PACMAN_POSITION_Y - ( PACMAN_SIZE / 2 ) , width: ( PACMAN_SIZE * 2 ), height: ( PACMAN_SIZE * 2 ) };
		
	for (var i = 0, imax = BUBBLES_ARRAY.length; i < imax; i ++) { 
		var bubble = BUBBLES_ARRAY[i];
		
		var bubbleParams = bubble.split( ";" );
		var testX = parseInt(bubbleParams[0].split( "," )[0]);
		var testY = parseInt(bubbleParams[0].split( "," )[1]);
		var p = { x: testX, y: testY };
		
		if ( isPointInRect( p, r ) ) { 
			
			if ( bubbleParams[4] === "0" ) { 
				var type = bubbleParams[3];
							
				eraseBubble( type, testX, testY );
				BUBBLES_ARRAY[i] = bubble.substr( 0, bubble.length - 1 ) + "1"
				
				if ( type === "s" ) { 
					setSuperBubbleOnXY( testX, testY, "1" );
					score( SCORE_SUPER_BUBBLE );
					playEatPillSound();
					affraidGhosts();
				} else { 
					score( SCORE_BUBBLE );
					playEatingSound();
				}
				BUBBLES_COUNTER --;
				if ( BUBBLES_COUNTER === 0 ) { 
					win();
				}
			} else { 
				stopEatingSound();
			}
			return;
		}
	}
}