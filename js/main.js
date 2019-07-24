"use strict";
var version = "1.0.2";
$(document).ready(
	function() {
		$("#version").html(version);
		var toast = document.querySelector("#toast");
		var clipboard = new ClipboardJS("#btn_copy");
		$("#btn_copy").click(
			function() {
				clipboard.on(
					"success", function() {
						var action = function(event) {
							$("#code").val("");
						}
						showtoast(toast, "复制成功 Copy to clipboard successfully", 2000, action, "清空 Clear");
					}
				);
				clipboard.on(
					"error", function() {
						var action = function(event) {
							$("#code").val("");
						}
						showtoast(toast, "复制失败 Copy to clipboard failed", 2000, action, "清空 Clear");
					}
				);
			}
		)
		$("#form").submit(
			function(e) {
				var pwd = $("#pwd").val();
				var key = $("#key").val();
				var length = $("#length").val();
				var cb_remove = $("#cb_remove").is(":checked");
				if (pwd != null && pwd != "" && key != null && key != "" && length != null && length != "") {
					$("#code").val(generate_password(pwd, key, length, cb_remove));
				}
				$("#btn_generate").css("background","#" + Math.floor(Math.random() * 0xFFFFFF).toString(16));
				e.preventDefault();
			}
		);
		$("#btn_showpwd").click(
			function() {
				var type = $("#pwd").attr("type");
				if (type == "password") {
					$("#pwd").attr("type", "text");
					$("#btn_showpwd_icon").html("visibility_off");
				} else {
					$("#pwd").attr("type", "password");
					$("#btn_showpwd_icon").html("visibility");
				}
			}
		);
		$("#pwd_length").text(
			$("#length").val()
		);
		$("#length").change(
			function() {
				$("#pwd_length").text(
					$("#length").val()
				);
			}
		);
		$("#length").on(
			"mousedown touchstart", function() {
				$(document).on(
					"mousemove touchmove", function() {
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
	var pwdmd5 = md5(pwd);
	var md5one = md5("$MD5$"+pwd+"$"+md5, key);
	var md5two = md5(md5one, "Mlgm");
	var md5three = md5(md5one, "Xyysd");
	var rule = md5three.split("");
	var source = md5two.split("");
	console.assert(rule.length === source.length, "md5 output length not equal");
	var str = "TheC@tsAr3BestPetAnd5ayMew0";
	for (var i = 0; i < source.length; ++i) {
		if (isNaN(source[i])) {
			if (str.search(rule[i]) > -1) {
				source[i] = source[i].toUpperCase();
			}
		}
	}
	var hash = source.join("");
	console.assert(hash.length === 32, "hash output length not equal to 32");
	var lower = "abcdefghijklmnopqrstuvwxyz".split("");
	var upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	var number = "0123456789".split("");
	if (cb_remove) {
		var punctuation = "".split("");
	} else {
		var punctuation = ",.:;!?@%#$^&*".split("");
	}
	var alphabet = lower.concat(upper).concat(number).concat(punctuation);
	for (var i = 0; i <= hash.length - length; ++i) {
		var sub_hash = hash.slice(i, i + length).split("");
		var count = 0;
		var map_index = sub_hash.map(
			function(c) {
				count = (count + c.charCodeAt()) % alphabet.length;
				return count;
			}
		);
		var pwd = map_index.map(
			function(k) {
				return alphabet[k];
			}
		);
		var matched = false;
		pwd.forEach(
			function(e) {
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
	var data = {
		message: msg,
		timeout: timeout,
		actionHandler: action,
		actionText: actionText
	};
	snackbar.MaterialSnackbar.showSnackbar(data);
}