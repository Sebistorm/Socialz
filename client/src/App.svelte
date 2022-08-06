<script>
	import { Router, Route, Link } from "svelte-navigator";
	import PrivateRoute from "./component/privateRoute/PrivateRoute.svelte";
	import { user } from "./store/userStore";
	import io from "socket.io-client"; 

	import UserSignup from "./pages/usersignup/signup.svelte";
	import UserLogin from "./pages/userlogin/login.svelte";
	import UserProfile from "./pages/myprofile/profile.svelte";
	import UserEditProfile from "./pages/myprofile/editprofile.svelte";
	import UserConfirmDelete from "./pages/myprofile/confirmdeleteuser.svelte";
	import Users from "./pages/users/users.svelte";
	import User from "./pages/user/user.svelte"

	import Chat from "./pages/chat/chat.svelte";

	import Home from "./pages/home/home.svelte"; 

	import EventCreate from "./pages/event/createevent.svelte";
	import MyEvents from "./pages/event/usersevents.svelte";
	import Event from "./pages/event/event.svelte";
	import EventEdit from "./pages/event/editevent.svelte";
	import EventDelete from "./pages/event/confirmdeleteevent.svelte"; 
	import EventInvitePeople from "./pages/event/invitepeopletoevent.svelte";
	import EventGuestList from "./pages/event/guestlist.svelte";

	import ProductCreate from "./pages/products/product/createproduct.svelte";
	import ProductEdit from "./pages/products/product/editproduct.svelte";
	import Product from "./pages/products/product/product.svelte";
	import ProductDelete from "./pages/products/product/confirmdeleteproduct.svelte";


	import MyProducts from "./pages/products/products/myProducts.svelte";



	const socket = io();
	let userOnlineCount = 0;
	socket.on("userOnline", (count) => { 
		userOnlineCount = count;
    }); 

	function handleLogout() {
		socket.emit('logout', userOnlineCount);
		console.log("logout")
		$user = null;
	}

</script>



<main>
	<Router>
		<nav>
			<Link to="/">Home</Link>
			<Link to="signup">Signup</Link>
			<Link to="login">Login</Link>
			<Link to="profile">profile</Link>
			<Link to="users">Users</Link>

			<span>{userOnlineCount} users online</span> 
			<span on:click={handleLogout}>Logout</span>
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
			<Route path="events/:id/invite" component={EventInvitePeople} />
			<Route path="events/:id/users" component={EventGuestList} />

			<Route path="marketplace/create" component={ProductCreate} />
			<Route path="marketplace/users/:id/myproducts" component={MyProducts} />
			<Route path="marketplace/products/:id" component={Product} />
			<Route path="marketplace/editproduct/:id" component={ProductEdit} />
			<Route path="marketplace/confirmdeleteproduct/:id" component={ProductDelete} />
			
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
:global(.container a.text-blue) {
    color: #4599ff !important;
  }

	
</style>