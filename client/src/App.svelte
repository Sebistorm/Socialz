<script>
	import { Router, Route, Link } from "svelte-navigator";
	import PrivateRoute from "./component/privateRoute/PrivateRoute.svelte";

	import UserSignup from "./pages/usersignup/signup.svelte";
	import UserLogin from "./pages/userlogin/login.svelte";
	import UserProfile from "./pages/myprofile/profile.svelte";
	import UserEditProfile from "./pages/myprofile/editprofile.svelte";
	import UserConfirmDelete from "./pages/myprofile/confirmdeleteuser.svelte";
	import Users from "./pages/users/users.svelte";
	import User from "./pages/user/user.svelte"

	import Home from "./pages/home/home.svelte"; 

	import Chat from "./pages/chat/chat.svelte";

	import EventCreate from "./pages/event/createevent.svelte";
	import MyEvents from "./pages/event/usersevents.svelte";
	import Event from "./pages/event/event.svelte";
	import EventEdit from "./pages/event/editEvent.svelte";
	import EventDelete from "./pages/event/confirmdeleteEvent.svelte";

	

</script>



<main>
	<Router>
		<nav>
			<Link to="/">Home</Link>
			<Link to="signup">Signup</Link>
			<Link to="login">Login</Link>
			<Link to="profile">profile</Link>
			<Link to="users">Users</Link>
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
			<Route path="users" component={Users} />
			<Route path="users/:id" component={User} />
			<Route path="messages/t/:id" component={Chat} />
			<Route path="users/:id/events" component={MyEvents} />

			<Route path="createevnet" component={EventCreate} />
			<Route path="events/:id" component={Event} />
			<Route path="editEvent/:id" component={EventEdit} />
			<Route path="confirmDeleteEvent/:id" component={EventDelete} />
			
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

:global(.container a):hover {
	text-decoration: none !important;
	color: unset;
}
	
</style>