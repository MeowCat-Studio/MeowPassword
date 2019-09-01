"use strict";
const version = "1.0.3";
$(document).ready(
    function () {
        setTimeout(function () {
            $("#site-loader").fadeOut();
        }, 500);
        const dom_length = $("#length");
        const dom_pwd = $("#pwd");
        $("#version").html(version);
        const toast = document.querySelector("#toast");
        const clipboard = new ClipboardJS("#btn_copy");
        $("#btn_copy").click(
            function () {
                clipboard.on(
                    "success", function () {
                        const action = function () {
                            $("#code").val("");
                        };
                        showtoast(toast, "复制成功 Copy to clipboard successfully", 2000, action, "清空 Clear");
                    }
                );
                clipboard.on(
                    "error", function () {
                        const action = function () {
                            $("#code").val("");
                        };
                        showtoast(toast, "复制失败 Copy to clipboard failed", 2000, action, "清空 Clear");
                    }
                );
            }
        );
        $("#form").submit(
            function (e) {
                const pwd = dom_pwd.val();
                const key = $("#key").val();
                const length = $("#length").val();
                const cb_remove = $("#cb_remove").is(":checked");
                if (pwd != null && pwd !== "" && key != null && key !== "" && length != null && length !== "") {
                    $("#code").val(generate_password(pwd, key, length, cb_remove));
                }
                $("#btn_generate").css("background", "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16));
                e.preventDefault();
            }
        );
        $("#btn_showpwd").click(
            function () {
                const type = dom_pwd.attr("type");
                if (type === "password") {
                    dom_pwd.attr("type", "text");
                    $("#btn_showpwd_icon").html("visibility_off");
                } else {
                    dom_pwd.attr("type", "password");
                    $("#btn_showpwd_icon").html("visibility");
                }
            }
        );
        $("#pwd_length").text(
            dom_length.val()
        );
        dom_length.change(
            function () {
                $("#pwd_length").text(
                    $("#length").val()
                );
            }
        );
        dom_length.on(
            "mousedown touchstart", function () {
                $(document).on(
                    "mousemove touchmove", function () {
                        $("#pwd_length").text(
                            $("#length").val()
                        );
                        $("#length.is-lowest-value").removeClass("is-lowest-value");
                    }
                );
            }
        );
    }
);

function generate_password(pwd, key, length, cb_remove) {
    if (!isNaN(length)) {
        if (length > 32) {
            length = 32;
        } else if (length < 4) {
            length = 4;
        } else {
            length = parseInt(length);
        }
    }
    const md5one = md5("$MD5$" + pwd + "$" + md5, key);
    const md5two = md5(md5one, "Mlgm");
    const md5three = md5(md5one, "Xyysd");
    const rule = md5three.split("");
    let source = md5two.split("");
    console.assert(rule.length === source.length, "md5 output length not equal");
    const str = "TheC@tsAr3BestPetAnd5ayMew0";
    for (let i = 0; i < source.length; ++i) {
        if (isNaN(source[i])) {
            if (str.search(rule[i]) > -1) {
                source[i] = source[i].toUpperCase();
            }
        }
    }
    const hash = source.join("");
    console.assert(hash.length === 32, "hash output length not equal to 32");
    const lower = "abcdefghijklmnopqrstuvwxyz".split("");
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const number = "0123456789".split("");
    let punctuation;
    if (cb_remove) {
        punctuation = "".split("");
    } else {
        punctuation = ",.:;!?@%#$^&*".split("");
    }
    const alphabet = lower.concat(upper).concat(number).concat(punctuation);
    for (let i = 0; i <= hash.length - length; ++i) {
        const sub_hash = hash.slice(i, i + length).split("");
        let count = 0;
        const map_index = sub_hash.map(
            function (c) {
                count = (count + c.charCodeAt(0)) % alphabet.length;
                return count;
            }
        );
        const pwd = map_index.map(
            function (k) {
                return alphabet[k];
            }
        );
        let matched = false;
        pwd.forEach(
            function (e) {
                matched = matched || alphabet.includes(e);
            }
        );
        if (matched) {
            return pwd.join("");
        }
    }
    return "";
}

function showtoast(snackbar, msg, timeout, action, actionText) {
    snackbar.MaterialSnackbar.showSnackbar({
        message: msg,
        timeout: timeout,
        actionHandler: action,
        actionText: actionText
    });
}