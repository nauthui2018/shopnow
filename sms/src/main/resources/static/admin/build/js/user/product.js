let products = {} || products;
var listProduct = [];
var listOrderedProduct = [];

products.init = function () {
    products.intTable();
    products.initValidation();
    product_types.listProductType();
    warehouses.listWarehouse();
}

products.addNew = function () {
    $('.modal-title').html("Thêm sản phẩm mới");
    products.resetForm();
    $('#modalAddEdit').modal('show');
}

products.resetForm = function () {
    $('#formAddEdit')[0].reset();
    $('#id').val('');
    $('#name').val('');
    $('#brand').val('');
    $('#image').val('');
    $('#stock').val('');
    $('#unit').val('');
    $('#barcode').val('');
    $('#description').val('');
    $("#formAddEdit").validate().resetForm();
}

products.initValidation = function () {
    $("#formAddEdit").validate({
        rules: {
            name: {
                required: true,
                minlength: 3,
                maxlength: 150,
            },
        },
        messages: {
            name: {
                required: "Bạn chưa nhập tên",
                minlength: "Tên sản phẩm quá ngắn",
                maxlength: "Tên quá dài. Bạn vui lòng kiểm tra lại!",
            },
        },
    });
}

$.validator.addMethod(
    "regex",
    function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    },
    "Please check your input."
);

products.intTable = function () {
    $("#datatables").DataTable({
        ajax: {
            url: '/api/user/product/',
            method: "GET",
            datatype: "json",
            dataSrc: ""
        },
        columns: [
            { data: "id", name: "ID", title: "ID", orderable: false},
            { data: "name", name: "Tên", title: "Tên", orderable: true},
            { data: "brand", name: "Nhãn hiệu", title: "Nhãn hiệu", orderable: true},
            { data: "stock", name: "Có thể bán", title: "Có thể bán", orderable: true},
            { data: "id", name: "Action", title: "Thao tác", sortable: false,
                orderable: false, "render": function (data) {
                    return `<a href='javascript:' title='Cập nhật' onclick='products.get(${data})' data-toggle="modal" data-target="#modalAddEdit" style='color: orange'><i class="fas fa-edit"></i></a>
                        <a class='ml-3' href='javascript:' title='Xóa' onclick='products.delete(${data})' style='color: red'><i class="fas fa-trash-alt"></i></a>`;
                }
            }
        ]
    });
};

products.get = function (id) {
    var ajaxGet = $.ajax({
        url: "/api/user/product/" + id,
        method: "GET",
        dataType: "json"
    });
    ajaxGet.done(function (data) {
        $('#formAddEdit')[0].reset();
        $('.modal-title').html("Chỉnh sửa thông tin");
        $('#id').val(data.id);
        $('#name').val(data.name);
        $('#brand').val(data.brand);
        $('#image').val(data.image);
        $('#stock').val(data.stock);
        $('#current_price').val(data.current_price);
        $('#unit').val(data.unit);
        $('#barcode').val(data.barcode);
        $('#description').val(data.description);
        $('#product_type').val(data.product_type.id);
        $('#warehouse').val(data.warehouse.id);
        $('#modalAddEdit').modal('show');
    });
    ajaxGet.fail(function () {
        toastr.error('Lấy dữ liệu bị lỗi', 'INFORMATION:')
    });
}

products.save = function () {
    if ($("#formAddEdit").valid()) {
        var product = {};
        product.id = $('#id').val();
        product.name = $('#name').val();
        product.current_price = $('#current_price').val();
        product.brand = $('#brand').val();
        product.image = $('#image').val();
        product.stock = $('#stock').val();
        product.unit = $('#unit').val();
        product.barcode = $('#barcode').val();
        product.description = $('#description').val();
        var product_type = {};
        product_type.id=$('#product_type').val();
        product.product_type = product_type;
        var warehouse = {};
        warehouse.id=$('#warehouse').val();
        product.warehouse = warehouse;
        if ($('#id').val() === '') {
            var ajaxAdd = $.ajax({
                url: "/api/user/product",
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(product)
            });
            ajaxAdd.done(function () {
                $('#modalAddEdit').modal('hide');
                $("#datatables").DataTable().ajax.reload();
                toastr.info('Thêm sản phẩm thành công', 'INFORMATION:');
            });
            ajaxAdd.fail(function () {
                $('#modalAddEdit').modal('hide');
                $("#datatables").DataTable().ajax.reload();
                toastr.error('LỖI! Thêm không thành công', 'INFORMATION:');
            });
        } else {
            var ajaxUpdate = $.ajax({
                url: "/api/user/product/",
                method: "PUT",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(product)
            });
            ajaxUpdate.done(function () {
                $('#modalAddEdit').modal('hide');
                $("#datatables").DataTable().ajax.reload();
                toastr.info('Cập nhật thông tin thành công', 'INFORMATION:')
            });
            ajaxUpdate.fail(function () {
                $('#modalAddEdit').modal('hide');
                $("#datatables").DataTable().ajax.reload();
                toastr.error('LỖI!. Cập nhật không thành công', 'INFORMATION:')

            });
        }
        return false;
    }
}

products.delete = function (id) {
    bootbox.confirm({
        message: "Bạn có muốn xóa sản phẩm này không?",
        buttons: {
            confirm: {
                label: 'Có',
                className: 'btn-success'
            },
            cancel: {
                label: 'Không',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var ajaxDelete = $.ajax({
                    url: "/api/user/product/" + id,
                    method: "DELETE",
                    dataType: "json"
                });
                ajaxDelete.done(function () {
                    $("#datatables").DataTable().ajax.reload();
                    toastr.info('Xóa thành công!', 'INFORMATION:')
                });
                ajaxDelete.fail(function () {
                    toastr.error('Xóa không thành công!', 'INFORMATION:')
                });
            }
        }
    })
}

products.listProduct = function () {
    $.ajax({
        url: "/api/user/product",
        method: "GET",
        dataType: "json",
        success: function (data) {
            listProduct = data;
            $.each(data, function (i, v) {
                $('#product').append(
                    `<option value='${v.id}'>${v.name}</option>`
                );
            });
        }
    });
}

products.findById = function (id) {
    for (let i = 0; i < listProduct.length; i++) {
        if (id === listProduct[i].id) {
            return listProduct[i];
        }
    }
    return null;
}

