var score1=0,
	tempscore1=0,
	pigInterval,
	d1,
	d2,
	player, pig, turns, h, curPlayer,gameFinished = false;
	

$(document).ready(function(){
	//Variable declaration
	player = {
		name: "player",
		score: 0,
		$score: $('#myscore1'),
		turn: true,
		$table : $('.player-table'),
		history: [],
	},
	pig = {
		name: "pig",
		score: 0,
		$score: $('#pigscore1'),
		turn: false,
		$table : $('.pig-table'),
		history: [],
	},
	turns = 0,
	h = [],
	curPlayer = player;
	
	//Click Events
	$('.btn-roll').on('click', function(){
		roll();
	});	
	$('.btn-stop').on('click', function(){
		addToScore();
	});
	$('.btn-new').on('click', function(){
		end();
	});	
	
	//FUNCTIONS
	function gid(i){
		return document.getElementById(i)	
	}
	function startGame(){
		player.turn=true;
		rollDice(player);
	}	

	function roll(){
		if(player.turn){
			if(rollDice(player)) {
				$('.btn-stop').removeClass('disabled');
				// checkWin(player);
				changePlayer();
				roll();
			} else { //Normal play, without any 1
				
			}
		} else {
			if(!gameFinished){//game true
				pigMove();
			} else {
				end();
			}
		}		
	 }
		
	function rollDice(player){
			d1 = Math.floor((Math.random() * 6) + 1);
			$('.dice-1').html(getDice(d1));
			d2 = Math.floor((Math.random() * 6) + 1);
			$('.dice-2').html(getDice(d2));
			if(d1==1 && d2==1){
				 tempscore1+=25;
				 console.log("25");
			 }
			if((d1==1 || d2==1) && d1!=d2 ){
				 console.log("0");
				 //tempscore1=0;
				 tempscore1=0;
				 gid("tempscore1").innerHTML=0;
				addHistory(player, {
					turn: turns++,
					d1: d1,
					d2: d2,
					score: tempscore1,
					oScore: player.score
				});
				return true;
			 }
			if(d1 != 1 && d2 != 1 && d1 == d2) {
				console.log(4*d1);
				tempscore1+=4*d1;
		
			 }
			if (d1 != 1 && d2 != 1 && d1 != d2) {
				tempscore1 += d1 + d2;
				console.log(d1+"|"+d2);
			}
			addHistory(player, {
				turn: turns++,
				d1: d1,
				d2: d2,
				score: tempscore1,
				oScore: player.score
			});
			showScores();
			return false;
	}
	function showScores(){ 					// span score!
		gid("tempscore1").innerHTML=tempscore1;
	};

	function endMove(){
		gid("myscore1").innerHTML=tempscore1;
		score1 += parseInt(myscore1.innerHTML, 10);
		gid("myscore1").innerHTML=score1;
		player.score=score1;
		checkWin(player);
		tempscore1=0;	
	}
	function pigMove(){
			$('.jumbotron .buttons button').addClass('disabled');
			pigInterval = setInterval(function(){
				
				if (tempscore1 < parseInt($('#pig-logic').val())) {
					if(rollDice(pig) || !pig.turn) { //If one of dice have 1 or player move
						clearInterval(pigInterval);
						tempscore1 = 0;	
						checkWin(pig);
						changePlayer();
						$('.btn-stop').removeClass('disabled');
					}
					if(checkWin(pig)) { //If one of the players wins
						clearInterval(pigInterval);
						gameFinished = true;
					}
				} else { //Pig's stop button									
					clearInterval(pigInterval);
					pig.score+=tempscore1;
					pig.$score.html(pig.score);
					curPlayer.$table.find('.head').next().children().removeClass('danger warning').parent().addClass('success').find('.os').html(pig.score);
					checkWin(pig);
					$('.btn-stop').removeClass('disabled');
					changePlayer();
					tempscore1=0;
					reset();
				}
				
			}, 1000);
	
	}
	
	function changePlayer() {
		$('.jumbotron .buttons button').removeClass('disabled');
		player.turn = !player.turn;
		pig.turn = !pig.turn;
		curPlayer = player.turn ? player : pig;
		gid("turn").innerHTML = pig.turn ? "Pig`s " : "Your ";
		$('.panel-history').not(curPlayer.$table).removeClass('panel-success').addClass('panel-default');
		curPlayer.$table.removeClass('panel-default').addClass('panel-success');
	}
	
	function addHistory(player, history) {
		console.log(player);
		player.history.push(history);
		history.player = player;
		h.push(history);
		player.$score.html(h.score);
		
		$('.' + player.name + '-table table .head').after('<tr style="display:none">' +
			'<td>' + history.turn + '</td>' +
			'<td' + (history.d1 == 1 ? ' class="danger"' : '') + '>' + getDice(history.d1, 'table-dice') + '</td>' +
			'<td' + (history.d2 == 1 ? ' class="danger"' : '') + '>' + getDice(history.d2, 'table-dice') + '</td>' +
			'<td>' + history.score + '</td>' +
			'<td class="os">' + history.oScore + '</td>' +
		'</tr>');
		$('.' + player.name + '-table table .head').next().fadeIn(900);
		
		if(history.d1 === 1 && history.d2 === 1) {
			var t = player.$table.find('.head').next().children().removeClass('danger warning');
			if(player.name == 'pig') {
				t.parent().addClass('success').find('.os').html(history.score + history.oScore);
				player.$score.html(history.score + history.oScore);
			} else $('.jumbotron .buttons button').removeClass('disabled');
		}
	}
	function addToScore(){ //On Stop button click!
		reset();	
		endMove();
		console.log("Player Score "+score1);
		curPlayer.$table.find('.head').next().addClass('success').find('.os').html(player.score);
		changePlayer();
		if(!gameFinished) pigMove();
	}
	
	
	function checkWin(player) {
		if(player.score >= 100) {
			gameFinished=true;			
			Win(player);		
			return true;
		}
		return false;
	}	
	function Win(player) {
		var modal = '#win-player';
		if(player.name == 'pig') modal = '#win-pig';
		$(modal).modal('show');
		$(modal).on('hidden.bs.modal', function (e) {
			end();		
		});
		gameFinished = true;
	}

	function reset(){
		gid("tempscore1").innerHTML=0;
		console.log("Score added");
	}
	function getDice(i, c) {
		if(typeof c === "undefined") c = '';
		return '<img class="' + c + '" src="img/dices/d' + i + '.png">';	
	}
	function end(){
		tempscore1=0;
		showScores();
		gid("myscore1").innerHTML = '?';
		gid("pigscore1").innerHTML = '?';
		turns=0;
		h.length = player.history.length =0;
		pig.history.length = 0
		score1=0;
		player.score=0;
		pig.score=0;
		player.turn=true;
		pig.turn=false;
		gameFinished=false;
		clearInterval(pigInterval);

		$('.jumbotron .buttons button').removeClass('disabled');
		$('.panel-history table tr').not('.head').empty();
		// rollDice(player);
		curPlayer = player;
		$('.panel-history').removeClass('panel-success').addClass("panel-default");
		curPlayer.$table.removeClass('panel-default').addClass('panel-success');
		gid("turn").innerHTML = "Your ";
		console.log("Game over");
	}
});
	
	
