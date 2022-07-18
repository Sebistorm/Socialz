<script>
	import { Router, Route, Link } from "svelte-navigator";
	import PrivateRoute from "./component/privateRoute/PrivateRoute.svelte";

	import UserSignup from "./pages/usersignup/signup.svelte"
	import UserLogin from "./pages/userlogin/login.svelte"
	import UserProfile from "./pages/userprofile/profile.svelte"
	import UserEditProfile from "./pages/userprofile/editprofile.svelte"
	import UserConfirmDelete from "./pages/userprofile/confirmdeleteuser.svelte"
	import Home from "./pages/home/home.svelte"

	

</script>



<main>
	<Router>
		<nav>
			<Link to="/">Home</Link>
			<Link to="signup">Signup</Link>
			<Link to="login">Login</Link>
			<Link to="profile">profile</Link>
		</nav>
		<div>
			<Route path="/">
				<Home />
			</Route>
			<Route path="signup" component={UserSignup} />
			<Route path="login" component={UserLogin} />
			<Route path="profile" component={UserProfile} />
			<Route path="editUser" component={UserEditProfile} />
			<Route path="confirmDeleteUser" component={UserConfirmDelete} />
			
		</div>
	</Router>
	

</main>

<style>

:global(.container a) {
    text-decoration: none !important;
    color: white !important;
  }

:global(.container a):hover {
	text-decoration: none !important;
	color: unset;
}
	
</style>