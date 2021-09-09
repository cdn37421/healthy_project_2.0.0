/*
資策會Java班期末專題第二小組的資料庫存取用程式庫。
資料庫和會員相關的註冊、登入、登出...等操作皆包含在healthyLifeStyleDBUtil中。
只需要執行healthyLifeStyleDBUtil中建構好的函式，即可向伺服器傳送請求以做各種操作。
登入功能透過session實現。當登入成功後，只要不關閉網頁以及session沒有過期(預設5分鐘內沒有任何操作則session過期)，會員都將保持登入狀態而可以執行相關操作。
登出功能則是讓使用者訪問特定網址以讓當前session失效來登出使用者。
說明：
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.requestOrigin
存放欲傳送請求的主機位址(含通訊協定、IP、通訊阜)，不包刮路徑。非必要請勿更動。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.loginPath
執行登入相關請求的請求路徑。非必要請勿更動。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.login(user, password[, successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
讓當前瀏覽器以帳戶user，密碼password來登入伺服器。

可以提供兩個自定義回呼函式(successCallBack(data, textStatus, jqXHR), failCallBack(data, textStatus, jqXHR))以分別在登入成功、失敗時進行呼叫
傳入回乎函式的參數等同於jQuery的get、post方法中，傳給回乎函數的參數：https://api.jquery.com/jquery.post/
登入函數中有設計預設的回乎函數，呼叫回乎函數時，將會先執行預設回乎函數(其中有一個alert方法來提醒結果)，再執行傳入的自定義回乎函數。
若不想要使用預設函數。則可以將replaceSuccessCallBack或replaceFailCallBack設為true，可分別停用預設回乎函數。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.isLoginRequestActivate()
登入請求是否正在執行中。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.register(user, password[, email][, successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
向網頁伺服器提交帳戶註冊請求。
回乎函式的行為同login函式。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.isRegisterRequestActivate()
註冊帳戶的請求是否正在執行中。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.getCurrentLoginAccount([successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
取得當前網頁登入的帳號。若沒有登入，則請求會失敗。
若有登入的帳號，請求會成功，回乎函式中的data會是當前登入的帳號資訊，資料格式為已解析好的json資料。
帳號資料包含兩個參數：
loginProfile: 當前登入帳號的身分，實際身分為其中的loginIdentity。可能的值有NONE,ADMIN,NORMAL_EMPLOYEE,DOCTOR。
NONE表示一般無特殊權限的登入用戶。
userProfile: 當前登入帳號的所有基本資料。
帳號資料範例：
{
	"loginProfile":{
		"user":"RRR",
		"loginIdentity":"NONE"
	},
	"userProfile":{
		"user":"RRR",
		"email":"RRR@RRR.com",
		"lastName":null,
		"firstName":null,
		"gender":null,
		"bloodtypeABO":null,
		"birthday":null,
		"phone":null,
		"photo":null,
		"height":0,
		"weight":0,
		"city":null,
		"location":null,
		"availableLangs":[
			"zh_tw",
			"ja_jp"
		]
	}
}

9/9新增註釋-取得、上傳個人頭像的方法：
假設頁面有一個id為"testImg"的input檔案標籤：
<input id="testImg" type="file">

可以使用如下方法取得base64的URL:
var fr = new FileReader();
var inputimg = document.getElementById("testImg");
fr.readAsDataURL(inputimg.files[0])
console.log(fr.result)//打印出data:image/jpeg;base64,.... 之類的

之後可以如下方法來上傳圖片:
var profile;
healthyLifeStyleDBUtil.getCurrentLoginAccount(function(data){profile = data.userProfile})
profile.photo = fr.result;
healthyLifeStyleDBUtil.updateProfile(profile);

可以如下取得圖片:
var profile;
healthyLifeStyleDBUtil.getCurrentLoginAccount(function(data){profile = data.userProfile})
var newImg = document.createElement("img");
newImg.src = profile.photo;
document.body.appendChild(newImg);
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.logOut([successCallBack][, replaceSuccessCallBack])
執行後將當前網頁登入的帳號登出。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.getRegisteredMembers([successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
取得會員列表。當前登入的帳號必須要有管理員(ADMIN)權限等級才可執行成功。
目前還沒有把切換權限的功能完成。因此執行此函數時，會自動嘗試將帳號切換為管理員模式，若切換失敗則請求失敗。
若成功，則回乎函式中的data會是已註冊的會員列表(以陣列形式存放，含系統帳號)，格式為解析完成的json資料。
會列表中的會員訊息，包含下列參數：
user: 用戶帳號名稱
email: 用戶的電子郵件。可能為null
nickName: 用戶的暱稱。可能為null
gender: 用戶的性別。可能的值有:OTHER,MALE,FEMALE或null
bloodtypeABO: 用戶的ABO血型。可能的值有O,A,B,AB或null
birthday: 用戶的生日，可能為null
phone: 用戶的手機號碼，可能為null
photo: 用戶的頭像(照片)，資料格式應該是base64，可能為null。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.updateProfile(profile, [successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
更新用戶資料。

profile表示用戶資料的js物件，格式等同於healthyLifeStyleDBUtil.getCurrentLoginAccount中，帳號資料的"userProfile"的格式。
以下為更新帳戶資料的範例：
healthyLifeStyleDBUtil.getCurrentLoginAccount(function(data){
	//從伺服器取得當前登入帳戶資料後更新
	var profile = data.userProfile;
	profile.lastName = "Lu";
	profile.firstName = "Yu-Lin";
	profile.height = 8787;
	profile.availableLangs.push("en_us");
	healthyLifeStyleDBUtil.updateProfile(profile);
});
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.getSchedule([successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
取得當前登入用戶的日程表(日曆記錄)
成功時執行的回呼函數successCallBack(data, textStatus, jqXHR)中，data為解析好的日曆資料，型態為陣列。
範例：
var sch;
healthyLifeStyleDBUtil.getSchedule((e)=>{
	sch = e;
	console.log(sch);
})
控制台將打印出：
0: {date: 1628438400000, title: "YAA", theme: "green"}
1: {date: 1657468800000, title: "2ㄏ", theme: "yellow"}
length: 2
[[Prototype]]: Array(0)
﻿-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.addSchedule(scheduleData, [successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
healthyLifeStyleDBUtil.removeSchedule(scheduleData, [successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
分別對日曆進行增加以及移除的特定記錄的方法。
scheduleData的格式等同於successCallBack中，回傳陣列中的元素的值
當要移除記錄時，scheduleData中的三筆資料必須「與資料庫內的記錄完全相同」才會成功移除。
以getSchedule的範例來繼續：
healthyLifeStyleDBUtil.addSchedule({date: 1728438400000, title: "RR", theme: "blue"}) //將新增一筆如左的日曆記錄
以getSchedule中的資料為範例：
healthyLifeStyleDBUtil.removeSchedule(sch[0])
將會移除資料庫中的{date: 1628438400000, title: "YAA", theme: "green"}這筆記錄，如果存在的話。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.setSchedule(scheduleData, [successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
指定一系列日曆資料，將當前當入的使用者的所有日曆資料設為傳入的資料。
以getSchedul中的為範例：
sch.push({date: 7468800000, title: "6ㄏ", theme: "red"})
sch[1].theme = "white";
healthyLifeStyleDBUtil.setSchedule(sch);
-----------------------------------------------------------------------------------------------------
clearSchedule([successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
清空當前登入的使用者的所有日曆資料。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.getDiagBooking([successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
使用方式與getSchedule相同。
回傳資料的範例：
var boo;
healthyLifeStyleDBUtil.getSchedule((e)=>{
	boo = e;
	console.log(boo);
})
控制台將打印：
0: {interval: 1800, doctor: "Lai", diagClass: "神經內科", desc: "脖子涼涼的，感覺有東西勒著。", datetime: 1657500423000}
length: 1
[[Prototype]]: Array(0)
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.addDiagBooking(bookingData, [successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
healthyLifeStyleDBUtil.removeDiagBooking(bookingData, [successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
healthyLifeStyleDBUtil.setDiagBooking(bookingData, [successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
healthyLifeStyleDBUtil.clearDiagBooking([successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
使用方式與操作日程表相同。
唯一需要注意的是：若預約內容裡的「醫生」欄位填入了在資料庫的記錄中不是醫生的使用者，則伺服器會報錯(internal server error)。
參考預設SQL腳本來增加預設的醫生。
-----------------------------------------------------------------------------------------------------
healthyLifeStyleDBUtil.updatePermission(perm, [successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
更新當前登入用戶的登入身分。目前登入身分有: 一般會員(NONE)、醫生(DOCTOR)、一般員工(NORMAL_EMPLOYEE)、管理員(ADMIN)
必須指定完整的身分名稱(後方的大寫單字)，且該會員可以使用該身分，才可成功更新登入身分。
所有的身分可以參考https://github.com/XenonDB/III_FinalProject/blob/master/src/main/java/healthylifestyle/server/account/LoginIdentity.java
目前若該會員可以使用醫生身分，則預設登入後即被指定為醫生身分。
-----------------------------------------------------------------------------------------------------
*/
const healthyLifeStyleDBUtil = {};

(function(){

	healthyLifeStyleDBUtil.init = function(){
		
		var activatingAJAX = {};
		
		//TODO 正式上線時記得更改這邊的請求網址
		this.requestOrigin = window.location.origin+"/HealthyLifestyle";
		//this.requestOrigin = "https://healthylifestyle.hopto.org"+"/HealthyLifestyle";
		
		this.loginPath = "/Account/Login";
		
		this.schedulePath = "/UserScheduleHandler";
		this.diagBookingPath = "/DiagnosisBookingHandler";
		
		this.login = (user, password, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			
			if(activatingAJAX["login"]) return;
			activatingAJAX["login"] = true;
			
			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				alert("成功登入帳號!!");
				successCallBack(data, textStatus, jqXHR);
				//window.location.replace("account.html");
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 401:
						errmsg = "無效的帳號或密碼!!";
						break;
					case 404:
						errmsg = "伺服器沒有回應，無法登入帳號。";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤，無法登入帳號。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			};
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			$.post({
				url: this.requestOrigin+this.loginPath,
				data: $.param({user:user, password:password})
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack).always(() => {
				activatingAJAX["login"] = false;
			});
		};
		this.isLoginRequestActivate = () => {
			return !!activatingAJAX["login"];
		}
		
		
		this.register = (user, password, email, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			
			if(activatingAJAX["register"]) return;
			activatingAJAX["register"] = true;
			
			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				alert("成功註冊帳號!!");
				successCallBack(data, textStatus, jqXHR);
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 400:
						errmsg = "註冊資料(帳號、密碼或電子郵件)格式錯誤，無法註冊。";
						break;
					case 409:
						errmsg = "已存在相同的帳號，請選擇另一個帳號註冊。";
						break;
					case 404:
						errmsg = "伺服器沒有回應，無法註冊帳號。";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤，無法註冊帳號。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			}
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			$.post({
				url: this.requestOrigin+"/Account/Register",
				data: $.param({user:user, password:password, email:email})
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack).always(() => {
				activatingAJAX["register"] = false;
			});
			
		};
		this.isRegisterRequestActivate = () => {
			return !!activatingAJAX["register"];
		}
		
		
		this.getCurrentLoginAccount = (successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			
			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				successCallBack(data, textStatus, jqXHR);
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 401:
						errmsg = "登入狀態過期，請重新登入。";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤，請重新登入。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			}
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			$.get({
				url: this.requestOrigin+this.loginPath
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack);
		}
		
		this.logOut = (successCallBack, replaceSuccessCallBack) => {
			
			successCallBack = successCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				alert("成功登出帳號");
				successCallBack(data, textStatus, jqXHR);
			};
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			
			
			$.get({
				url: this.requestOrigin + "/Account/Logout"
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack);
			
		}
		
		
		this.getRegisteredMembers = (successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {

			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				alert("成功取得會員列表。");
				successCallBack(data, textStatus, jqXHR);
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 403:
						errmsg = "無權限的操作。";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			}
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			
			$.get({
				url: this.requestOrigin + "/Account/Admin/MemberManager"
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack);

		}
		
		this.updateProfile = (profile, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				alert("成功更新個人資料!");
				successCallBack(data, textStatus, jqXHR);
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 401:
						errmsg = "登入狀態過期，請重新登入。";
						break;
					case 400:
						errmsg = "個人資料格式可能有誤。";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤，無法更新資料。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			}
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			$.post({
				url: this.requestOrigin+"/Account/UpdateProfile",
				data: JSON.stringify(profile)
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack);
			
		}
		
		this.getSchedule = (successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				alert("成功取得排程表!");
				successCallBack(data, textStatus, jqXHR);
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 401:
						errmsg = "登入狀態過期，請重新登入。";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤，無法取得資料。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			}
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			$.get({
				url: this.requestOrigin+this.schedulePath
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack);
			
		}
		
		function modifySchedule(scheduleData, oper, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack){
			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				alert("成功更新排程表!");
				successCallBack(data, textStatus, jqXHR);
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 401:
						errmsg = "登入狀態過期，請重新登入。";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤，無法更新資料。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			}
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			var rqData = {};
			rqData["rq_content"] = JSON.stringify(scheduleData);
			rqData[oper] = 1;
			$.post({
				url: this.requestOrigin+this.schedulePath,
				data: $.param(rqData)
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack);
			
		}
		
		this.addSchedule = (scheduleData, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			modifySchedule.call(this,scheduleData,"rq_op_add", successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack);
		}
		
		this.removeSchedule = (scheduleData, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			modifySchedule.call(this,scheduleData,"rq_op_remove", successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack);
		}
		
		this.setSchedule = (scheduleData, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			modifySchedule.call(this,scheduleData,"rq_op_set", successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack);
		}
		
		this.clearSchedule = (successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			modifySchedule.call(this,{},"rq_op_clear", successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack);
		}
		
		//////////////////////////////////////////////////
		
		this.getDiagBooking = (successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				alert("成功取得預約表!");
				successCallBack(data, textStatus, jqXHR);
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 401:
						errmsg = "登入狀態過期，請重新登入。";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤，無法取得資料。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			}
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			$.get({
				url: this.requestOrigin+this.diagBookingPath
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack);
			
		}
		
		function modifyDiagBooking(bookingData, oper, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack){
			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				alert("成功更新預約表!");
				successCallBack(data, textStatus, jqXHR);
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 401:
						errmsg = "登入狀態過期，請重新登入。";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤，無法更新資料。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			}
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			var rqData = {};
			rqData["rq_content"] = JSON.stringify(bookingData);
			rqData[oper] = 1;
			$.post({
				url: this.requestOrigin+this.diagBookingPath,
				data: $.param(rqData)
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack);
			
		}
		
		this.addDiagBooking = (bookingData, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			modifyDiagBooking.call(this,bookingData,"rq_op_add", successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack);
		}
		
		this.removeDiagBooking = (bookingData, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			modifyDiagBooking.call(this,bookingData,"rq_op_remove", successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack);
		}
		
		this.setDiagBooking = (bookingData, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			modifyDiagBooking.call(this,bookingData,"rq_op_set", successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack);
		}
		
		this.clearDiagBooking = (successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			modifyDiagBooking.call(this,{},"rq_op_clear", successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack);
		}
		
		this.updatePermission = (perm, successCallBack, failCallBack, replaceSuccessCallBack, replaceFailCallBack) => {
			successCallBack = successCallBack || function(){};
			failCallBack = failCallBack || function(){};
			
			var defaultSuccessCallBack = function(data, textStatus, jqXHR){
				console.log("成功更新登入身分!");
				successCallBack(data, textStatus, jqXHR);
			};
			var defaultFailCallBack = function(data, textStatus, jqXHR){
				var errmsg = "";
				switch(data.status){
					case 401:
						errmsg = "登入狀態過期，請重新登入。";
						break;
					case 400:
						errmsg = "無效的身分名稱!";
						break;
					case 403:
						errmsg = "您沒有該身分!!";
						break;
					default:
						errmsg = "伺服器發生未預期錯誤，無法更新登入身分。";
				}
				alert(errmsg);
				failCallBack(data, textStatus, jqXHR);
			}
			
			var finalSuccessCallBack = !replaceSuccessCallBack ? defaultSuccessCallBack : successCallBack;
			var finalFailCallBack = !replaceFailCallBack ? defaultFailCallBack : failCallBack;
			
			$.post({
				url: this.requestOrigin+"/Account/UpdatePermission",
				data: $.param({updateLoginIdentity: perm})
				//xhrFields: {withCredentials: true},
				//crossDomain: true,
				//headers: { 'Origin': window.location.origin }
			}).done(finalSuccessCallBack).fail(finalFailCallBack);
			
		}
		
	};
	
	healthyLifeStyleDBUtil.init();
	healthyLifeStyleDBUtil.init = null;

})();