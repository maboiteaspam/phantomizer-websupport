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
                        QUnitLoader.start();
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