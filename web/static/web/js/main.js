window.captcha_txn_id = ""
window.otp_txn_id = ""
window.uid = ""

function change_capthca_image(b64data) {
    var image = new Image();
    image.src = b64data;
    var cid = document.getElementById("cid");
    cid.innerHTML = "";
    document.getElementById("cid").appendChild(image);
}

function populate_captcha() {
    $.get("/api/accounts/ekyc/generate-captcha/", function (data) {
        window.captcha_txn_id = data["data"]["captchaTxnId"];
        var b64_data = data["data"]["captchaBase64String"];
        var img_src = `data:image/jpg;base64,${b64_data}`;
        change_capthca_image(img_src);
    });
}

$("#start-request").click(function () {
    $("#zero").remove();
    $("#one").css("display", "flex");
});

$("#send-otp").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var data = {
        "uid": $("#uid").val()
    }
    var json_data = JSON.stringify(data);
    $.ajax({
        url: form.attr('action'),
        type: form.attr('method'),
        contentType: 'application/json',
        data: json_data,
        success: function (response) {
            console.log(response);
            window.otp_txn_id = response["data"]["txnId"];
            window.uid = $("#uid").val();
            $("#one").remove();
            $("#two").css("display", "flex");
        }
    });
    return false;
});

$("#verify-otp").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var data = {
        "uid": window.uid,
        "txnId": window.otp_txn_id,
        "otp": $("#otp").val(),
        "request_id": $("#rid").val(),
        "web": true
    }
    var json_data = JSON.stringify(data);
    $.ajax({
        url: form.attr('action'),
        type: form.attr('method'),
        contentType: 'application/json',
        data: json_data,
        success: function (response) {
            console.log(response);
            $("#two").remove();
            $("#three").css("display", "flex");
        }
    });
    return false;
});