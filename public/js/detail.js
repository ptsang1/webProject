(function ($) {
    const $tableID = $('#table');
    const $BTN = $('#export-btn');
    const $EXPORT = $('#export');

    const newTr = `
    <tr class="hide">
    <td class="pt-3-half" contenteditable="false">Example</td>
    <td class="pt-3-half" contenteditable="false">Example</td>
    <td class="pt-3-half" contenteditable="false">Example</td>
    <td>
        <span class="table-remove"><button type="button" class="btn btn-danger btn-rounded btn-sm my-0 waves-effect waves-light">Remove</button></span>
    </td>
    </tr>`;

    $tableID.on('click', '.table-remove', function () {
        let r = confirm("Confirm bid");
        if (r == true) {
            $('form').submit();
        }
        $.getJSON(`/product/detail_banBidder?email=${$(this).parents('tr').find('.mail').html()}`, function (data) {
            
        });
        $(this).parents('tr').detach();
    });

    // A few jQuery helpers for exporting only
    jQuery.fn.pop = [].pop;
    jQuery.fn.shift = [].shift;
})(jQuery);