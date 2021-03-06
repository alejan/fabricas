'use strict';

var app = angular.module("dragAndDrop", [])

        /*
         App Directives
         */

        .directive('droppable', function () {
            return function (scope, element) {
                var el = element[0],
                        droppable = scope.droppable;

                // If element don't have any id, create random id
                if (!el.id)
                    el.id = Math.floor((Math.random() * 100000) + 1);

                // Add element to droppable list
                droppable.push(el);

                // Start dropped items property
                el.items = [];

                // Event to drop action on droppable element
                el.addEventListener('drop', function (e) {
                    e.preventDefault();

                    var data = e.dataTransfer.getData("Text"),
                            element = document.getElementById(data),
                            box = document.getElementById(this.id);
            
                    console.log("se agrega" + data);
                    
                    box.appendChild(element);

                    droppable.forEach(function (box) {
                        var dragItem = box.childNodes;

                        box.items = [];

                        Object.keys(dragItem).forEach(function (key) {
                            if (dragItem[key].draggable === true)
                                box.items.push(dragItem[key]);
                        });
                    });

                    return false;
                },
                        false
                        );

                el.addEventListener('dragenter', function (e) {
                    this.classList.add('over');
                },
                        false
                        );

                el.addEventListener('dragleave', function (e) {
                    this.classList.remove('over');
                },
                        false
                        );

                // Event to drag over action on droppable element
                el.addEventListener('dragover', function (e) {
                    e.preventDefault();
                },
                        false
                        );
            }
        })

        .directive('draggable', function () {
            return function (scope, element) {
                var el = element[0];

                // Apply cursor style to "move" in each draggable element
                el.style.cursor = 'move';

                // Apply draggable property on element
                el.draggable = true;

                // If element don't have any id, create random id
                if (!el.id)
                    el.id = Math.floor((Math.random() * 100000) + 1);

                // Event on drag start
                el.addEventListener('dragstart', function (e) {
                    e.dataTransfer.setData('Text', e.target.id);


                    // When element is on drag, add drag class
                    this.classList.add('drag');
                },
                        false
                        );

                // Event on drag end
                el.addEventListener('dragend', function (e) {
                    // When drag over, remove drag class
                    this.classList.remove('drag');
                },
                        false
                        );
            }
        });


/*
 App Controller
 */

function dragAndDropController($scope) {

    /*
     Element list with allow drop, to see dropped items on the element.
     Use droppedItems property on each element.
     */

    $scope.droppable = [];
}


