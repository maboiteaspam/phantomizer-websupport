require(["vendors/go-dashboard/dashboard-ui","vendors/go-dashboard/dashboard"], function(){
    window.setTimeout(function(){
            $('#stryke-db')
                .hide()
                .load_view('/js/vendors/go-dashboard/dashboard.html')
                .done(function(){
                    $('#stryke-db').dashboard().fadeIn()
                })
        }
        ,500);
})