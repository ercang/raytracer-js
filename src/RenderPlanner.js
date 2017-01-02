define([],
       function () {
           'use strict';

           /**
            * @class RenderPlanner
            */
           function RenderPlanner(jobCount, scene, backgroundColor, width, height) {
               this.jobCount = jobCount;
               this.scene = scene;
               this.backgroundColor = backgroundColor;
               this.width = width;
               this.height = height;

               this.running = false;
               this.completedJobs = 0;

               this.onUpdateReceived = function(sectionStart, sectionHeight, buf8){};

               this.serializeScene();

               this.workers = [];
               for(var i=0; i<this.jobCount; i++)
               {
                   this.workers.push(new Worker("../src/RenderWorker.js"));
               }
           }

           RenderPlanner.prototype.initialize = function()
           {
               // prepare all workers
               for (var i=0; i < this.workers.length; i++)
               {
                   this.prepareWorker(i, this.workers[i]);
               }
           };

           RenderPlanner.prototype.start = function()
           {
               this.running = true;
               this.completedJobs = 0;

               // start all workers
               for(var i=0; i<this.workers.length; i++)
               {
                   this.startWorker(this.workers[i]);
               }

           };

           RenderPlanner.prototype.serializeScene = function()
           {
               // serialize scene
               this.serializedElements = [];
               var elements = this.scene.getElements();
               for(var i=0; i<elements.length; i++)
               {
                   var el = elements[i];
                   this.serializedElements.push(el.serialize());
               }
           };

           RenderPlanner.prototype.prepareWorker = function(index, rendererWorker)
           {
               // send scene to workers
               rendererWorker.postMessage({
                   "action": "elements",
                   "data": this.serializedElements
               });

               // set background color
               rendererWorker.postMessage({
                   "action": "backgroundColor",
                   "data": [this.backgroundColor.x, this.backgroundColor.y, this.backgroundColor.z]
               });

               var sectionHeight = Math.floor(this.height/this.jobCount);
               var sectionStart = Math.floor(index*sectionHeight);

               // set ray tracer dimensions
               rendererWorker.postMessage({
                   "action": "dimensions",
                   "data": [this.width, this.height, sectionStart, sectionHeight]
               });

               // add listeners
               rendererWorker.onmessage = function(e) {
                   var action = e.data.action;
                   var data = e.data.data;

                   if(action == "result")
                   {
                       this.completedJobs++;
                       if(this.completedJobs == this.jobCount)
                       {
                           this.running = false;
                       }

                       var buf8 = data;
                       this.onUpdateReceived(sectionStart, sectionHeight, buf8);
                   }
               }.bind(this);
           };

           RenderPlanner.prototype.startWorker = function(rendererWorker)
           {
               // start rendering!
               rendererWorker.postMessage({
                   "action": "render"
               });
           };

           RenderPlanner.prototype.isRunning = function()
           {
               return this.running;
           };

           RenderPlanner.prototype.updateScene = function()
           {
               this.serializeScene();

               for(var i=0; i<this.workers.length; i++)
               {
                   // send scene to workers
                   this.workers[i].postMessage({
                       "action": "elements",
                       "data": this.serializedElements
                   });
               }
           };

           return RenderPlanner;
       });
