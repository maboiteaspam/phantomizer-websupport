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
        QUnitLoader.load(function(){
            DashBoardLoader.load();

            DevicePreviewLoader.load();

            DashBoardLoader.start(function(){
                DevicePreviewLoader.start(function(){
                    QUnitLoader.start();
                });
            });
        });

    }else{
        phantomizer.beforeRender(function(next){
            QUnitLoader.load(next);

        });

        phantomizer.afterClientRender(function(next){
            DashBoardLoader.load();

            DevicePreviewLoader.load();

            DashBoardLoader.start(function(){
                DevicePreviewLoader.start(next);
            });
        });
        phantomizer.afterRender(function(next){
            QUnitLoader.start(next);
        });
    }
});