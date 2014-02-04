"use strict";

define([
  'vendors/go-phantomizer/phantomizer',
  'vendors/go-qunit/loader',
  'vendors/go-dashboard/loader',
  'vendors/go-device-preview/loader'
],function(phantomizer, QUnitLoader, DashBoardLoader,DevicePreviewLoader){

  QUnitLoader = new QUnitLoader();
  DashBoardLoader = new DashBoardLoader();
  DevicePreviewLoader = new DevicePreviewLoader();

  if( window.is_built ){

    DevicePreviewLoader.load(function(has_loaded){
      if( has_loaded ){
        DevicePreviewLoader.start(function(){
          DashBoardLoader.load();
          DashBoardLoader.start();
        });
      }else{
        DashBoardLoader.load();
        DashBoardLoader.start(function(){
          QUnitLoader.load(function(){
            window.setTimeout(function(){ // we must not rely on timeout, but that s the better solution found on that very moment
              QUnitLoader.start();
            },2500);
          });
        });
      }
    });



  }else{
    var has_loaded_preview = false;
    phantomizer.beforeRender(function(next){
      DevicePreviewLoader.load(function(has_loaded){
        has_loaded_preview = has_loaded;
        if( has_loaded ){
          DevicePreviewLoader.start(function(){
            DashBoardLoader.load();
            DashBoardLoader.start(function(){ /* explicitly don't go next : to not render the page */ });
          });
        }else{
          QUnitLoader.load(next);
        }

      });
    });

    phantomizer.afterClientRender(function(next){
      if( has_loaded_preview ){
        //next(); // should never reach that statement
      }else{
        DashBoardLoader.load();
        DashBoardLoader.start(next);
      }
    });
    phantomizer.afterRender(function(next){
      if( has_loaded_preview ){
        //next();; // should never reach that statement, neither
      }else{
// starts Qunit testing phase
        QUnitLoader.start(next);
      }
    });
  }
});