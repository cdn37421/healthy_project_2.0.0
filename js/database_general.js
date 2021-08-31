/*

資策會Java班期末專題第二小組的資料庫存取用程式庫。
資料庫和會員相關的註冊、登入、登出...等操作皆包含在healthyLifeStyleDBUtil中。
只需要執行healthyLifeStyleDBUtil中建構好的函式，即可向伺服器傳送請求以做各種操作。

登入功能透過session實現。當登入成功後，只要不關閉網頁以及session沒有過期(預設5分鐘內沒有任何操作則session過期)，會員都將保持登入狀態而可以執行相關操作。
登出功能則是讓使用者訪問特定網址以讓當前session失效來登出使用者。

說明：

healthyLifeStyleDBUtil.requestOrigin
存放欲傳送請求的主機位址(含通訊協定、IP、通訊阜)，不包刮路徑。非必要請勿更動。

healthyLifeStyleDBUtil.loginPath
執行登入相關請求的請求路徑。非必要請勿更動。

healthyLifeStyleDBUtil.login(user, password[, successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
讓當前瀏覽器以帳戶user，密碼password來登入伺服器。
可以提供兩個自定義回呼函式(successCallBack(data, textStatus, jqXHR), failCallBack(data, textStatus, jqXHR))以分別在登入成功、失敗時進行呼叫
傳入回乎函式的參數等同於jQuery的get、post方法中，傳給回乎函數的參數：https://api.jquery.com/jquery.post/

登入函數中有設計預設的回乎函數，呼叫回乎函數時，將會先執行預設回乎函數(其中有一個alert方法來提醒結果)，再執行傳入的自定義回乎函數。
若不想要使用預設函數。則可以將replaceSuccessCallBack或replaceFailCallBack設為true，可分別停用預設回乎函數。

healthyLifeStyleDBUtil.isLoginRequestActivate()
登入請求是否正在執行中。

healthyLifeStyleDBUtil.register(user, password[, email][, successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
向網頁伺服器提交帳戶註冊請求。
回乎函式的行為同login函式。

healthyLifeStyleDBUtil.isRegisterRequestActivate()
註冊帳戶的請求是否正在執行中。

healthyLifeStyleDBUtil.getCurrentLoginAccount([successCallBack][, failCallBack][, replaceSuccessCallBack][, replaceFailCallBack])
取得當前網頁登入的帳號。若沒有登入，則請求會失敗。
若有登入的帳號，請求會成功，回乎函式中的data會是當前登入的帳號資訊，資料格式為已解析好的json資料。
帳號資料包含兩個參數：
user: 當前登入的帳號名稱。
loginIdentity: 當前帳號的登入身分，以字串表示，可能的值有NONE,ADMIN,NORMAL_EMPLOYEE,DOCTOR;
NONE表示一般無特殊權限的登入用戶。

healthyLifeStyleDBUtil.logOut([successCallBack][, replaceSuccessCallBack])
執行後將當前網頁登入的帳號登出。

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


*/
const healthyLifeStyleDBUtil = {};

(function(){

	healthyLifeStyleDBUtil.init = function(){
		
		var activatingAJAX = {};
		
		this.requestOrigin = "https://healthylifestyle.hopto.org"//window.location.origin;
		this.loginPath = "/HealthyLifestyle/Account/Login";
		
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
				url: this.requestOrigin+"/HealthyLifestyle/Account/Register",
				data: $.param({user:user, password:password, email:email})
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
			var defaultFailCallBack = function(data){
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
				url: this.requestOrigin + "/HealthyLifestyle/Account/Logout"
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
				url: this.requestOrigin + "/HealthyLifestyle/Account/Admin/MemberManager"
			}).done(finalSuccessCallBack).fail(finalFailCallBack);

		}
		
		
	};
	
	healthyLifeStyleDBUtil.init();
	healthyLifeStyleDBUtil.init = null;

})();