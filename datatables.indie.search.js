$.fn.dataTable.Api.register('indieSearch()', function (params) {

    var textSearchCols = params.freeTextIndex;
    this.columns(textSearchCols).footer().each(function () {
        var title = $('.indie-text-search').eq($(this).index()).text();
        $(this).html('<input type="text" placeholder="Search ' + title + '" />');
    });

    this.columns(textSearchCols).every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
            that
                .search(this.value)
                .draw();
        });
    });
    
    var selectSearchCols = params.selectIndex;
    this.columns(selectSearchCols).every( function () {
        var column = this;
        var select = $('<select><option value=""></option></select>')
            .appendTo( $(column.footer()).empty() )
            .on( 'change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );

                column
                    .search( val ? '^'+val+'$' : '', true, false )
                    .draw();
            });

        column.data().unique().sort().each( function ( d, j ) {
            select.append( '<option value="'+d+'">'+d+'</option>' )
        });
    });
    
});
