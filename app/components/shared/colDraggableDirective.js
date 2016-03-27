angular
	.module('hockeydeck')
	.directive('draggable', function($document) {
		return function(scope, element, attr) {
			var columnWidth = element.width();
			//Determine the left and right borders on which we will trigger a column swap. No Y coords, everything is just Left/Right.
			var colStartPos = element.position().left; 

			var leftBorder = 0 - (columnWidth / 2);
			var rightBorder = columnWidth / 2; 

			element.css({
				'position': 'relative',
				'display': 'block'
			});

			var startClickX = 0, relX = 0;
			element.on('mousedown', '.col-handle', function(event) { //Only ".col-handle" is draggable.
				// Prevent default dragging of selected content
				event.preventDefault();
				relX = 0; //Reset any old positioning from previous drag.
				startClickX = event.screenX - relX;
				$document.on('mousemove', mousemove);
				$document.on('mouseup', mouseup);

				element.css({
					'z-index': '1000'
				});

				element.attr('oldpos', element.attr('pos')); //Record the starting pos for later use.
			});

			function mousemove(event) {
				relX = event.screenX - startClickX; //Get distance travelled relative to "correct" position.

				if (relX <= leftBorder) {
					AnimateColumnSwap(element.prev(), element, function(colSwap, colFloat) {
						startClickX += columnWidth; //Update our starting click position as if this column had been here all along.
						relX += columnWidth; //Update our relative position. Relative to where the div SHOULD be.
					});
				}
				else if (relX >= rightBorder) {
					AnimateColumnSwap(element.next(), element, function(colSwap, colFloat) {
						startClickX -= columnWidth; //Update our starting click position as if this column had been here all along.
						relX -= columnWidth; //Update our relative position. Relative to where the div SHOULD be.
					});
				}	

				element.css({
					left:  relX + 'px'
				});
			}

			function mouseup() {
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);

				//Mouse is up. Run the final animation and clean it all up.
				var poschange = parseInt(element.attr('pos')) - parseInt(element.attr('oldpos')); 
				var desiredX = poschange * columnWidth;
				element.animate({
					left: desiredX + 'px'
				}, 500, function() {
					CleanPositions();
				}); 	
			}
		};
	});