<script defer src="database_general.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script>
function logOut() {
  healthyLifeStyleDBUtil.logOut();
  alert("已登出");
  window.location.replace("index.html");
}
</script>