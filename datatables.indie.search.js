$.fn.dataTable.Api.register('indieSearch()', function (params) {
    
    var table = this;

    // Apply free text search
    var textSearchCols = params.freeTextCols;
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
    
    
    
    // Apply select dropdown search
    var selectSearchCols = params.selectCols;
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
    
    
    
    // Numeric range filter
    var numericSelectCols = params.numericSelectCols;
    for (i=0; i<numericSelectCols.length; i++) {
        this.columns([numericSelectCols[i]]).footer().each( function () {
            $(this).html(
                '<span>' + 
                'From' + 
                '<input type="number" class="numeric-range-search" id="numeric-search-min-' + [numericSelectCols[i]] + '"/>' + 
                'To' + 
                '<input type="number" class="numeric-range-search" id="numeric-search-max-' + [numericSelectCols[i]] + '"/>' + 
                '</span>'
            );
        });
    }
    
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            var numericSelectCols = params.numericSelectCols;
            var filtered = true;
            for (i=0; i<numericSelectCols.length; i++) {
                var min = parseInt( $('#numeric-search-min-' + numericSelectCols[i]).val(), 10 );
                var max = parseInt( $('#numeric-search-max-' + numericSelectCols[i]).val(), 10 );
                var colValue = parseFloat( data[numericSelectCols[i]] ) || 0;
                filtered = filtered && 
                     (( isNaN( min ) && isNaN( max ) ) ||
                     ( isNaN( min ) && colValue <= max ) ||
                     ( min <= colValue && isNaN( max ) ) ||
                     ( min <= colValue && colValue <= max ) )
            }
            return filtered;
        }
    );
    
    $('.numeric-range-search').keyup(function() {
        table.draw();
    });
    
});
