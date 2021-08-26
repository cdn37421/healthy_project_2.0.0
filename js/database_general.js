





const healthyLifeStyleDBUtil = {};

(function(){

	healthyLifeStyleDBUtil.init = function(){
		
		this.requestOrigin = window.location.origin;
		this.activatingAJAX = {};
		this.login = (user, password, successCallBack, failCallBack) => {
			
			if(this.activatingAJAX["login"]) return;
			this.activatingAJAX["login"] = true;
			
			successCallBack = successCallBack || function(){
				alert("成功登入帳號!!");
				window.location.replace("account.html");
			};
			failCallBack = failCallBack || function(data){
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
			};
			
			$.post({
				url: this.requestOrigin+"/HealthyLifestyle/Account/Login",
				data: $.param({user:user, password:password})
			}).done(successCallBack).fail(failCallBack).always(() => {
				this.activatingAJAX["login"] = false;
			});
		};
		
		this.register = (user, password, email, successCallBack, failCallBack) => {
			
			if(this.activatingAJAX["register"]) return;
			this.activatingAJAX["register"] = true;
			
			successCallBack = successCallBack || function(){
				alert("成功註冊帳號!!");
			};
			failCallBack = failCallBack || function(data){
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
			}
			
			$.post({
				url: this.requestOrigin+"/HealthyLifestyle/Account/Register",
				data: $.param({user:user, password:password, email:email})
			}).done(successCallBack).fail(failCallBack).always(() => {
				this.activatingAJAX["register"] = false;
			});
			
		};
		
	};
	
	healthyLifeStyleDBUtil.init();
	healthyLifeStyleDBUtil.init = null;

})();