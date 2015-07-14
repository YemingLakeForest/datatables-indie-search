$.fn.dataTable.Api.register( 'indieSearch()', function (appliedCols) {

    this.columns(appliedCols).footer().each( function () {
        var title = $('.indie-text-search').eq( $(this).index() ).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    });
    
    this.columns(appliedCols).every( function () {
        var that = this;
 
        $( 'input', this.footer() ).on( 'keyup change', function () {
            that
                .search( this.value )
                .draw();
        });
    });
});