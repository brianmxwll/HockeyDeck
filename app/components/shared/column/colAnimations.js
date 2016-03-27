//colSwap = column to make the full move; colFloat = column that is currently being dragged.
function AnimateColumnSwap(colSwap, colFloat, callback) {
	//Check if we are already animating. If we are, hard stop.
	if (colSwap.is(':animated')) {
		return;
	}

	//Before we move the colums, let's update their tracked positions.
	var swapPos = colSwap.attr('pos');
	var floatPos = colFloat.attr('pos');
	colSwap.attr('pos', floatPos);
	colFloat.attr('pos', swapPos);

	//Track where we were
	var startPos = colSwap.position().left;
	var endPos = colFloat.position().left - parseInt(colFloat.css('left')); //get the current position and remove the positioning we've added.

	console.log(startPos + ' goes to ' + endPos);
	
	colSwap.css({
 		position: 'relative'
	});

	//Now animate us moving to our real/current position.
	colSwap.animate({
    	left: (endPos - startPos) + 'px'
  	}, 500, function() {

  		//Animation complete, wrap this up.
    	callback(colSwap, colFloat);

    	//Swap in the DOM
		//swapElements(colSwap[0], colFloat[0]);
  	});
}

//Animations have been moving items around, let's fix all of that to maintain a consistent DOM.
function CleanPositions() {
	var cols = $('[draggable]');
	cols.css({'left' : '', 'z-index' : ''})
	cols.sort(function(a,b){
		var an = parseInt(a.getAttribute('pos'));
		var bn = parseInt(b.getAttribute('pos'));

		if(an > bn) {
			return 1;
		}
		if(an < bn) {
			return -1;
		}
		return 0;
	});

	cols.detach().appendTo('#scrollcontent');
}

function swapElements(elm1, elm2) {
    var parent1, next1,
        parent2, next2;

    parent1 = elm1.parentNode;
    next1   = elm1.nextSibling;
    parent2 = elm2.parentNode;
    next2   = elm2.nextSibling;

    parent1.insertBefore(elm2, next1);
    parent2.insertBefore(elm1, next2);
}