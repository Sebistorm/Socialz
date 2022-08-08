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
		<nav class="mb-5">
			<div id="navbar" class="container">
				<div>
					{#if $user}
						<Link to="/">Home</Link>
					{/if}
				
					{#if $user}
						<Link to="profile/">profile1</Link>
					{/if}
					{#if $user}
						<Link to="users/{$user.id}">profile2</Link>
					{/if}
					{#if $user}
						<Link to="users">Users</Link>
					{/if}

					{#if $user}
						<span id="onlineUsers">{userOnlineCount} users online</span>
					{/if}
				</div>

				<div>
					{#if !$user}
						<Link to="signup">Signup</Link>
					{/if}
					{#if !$user}
						<Link to="login">Login</Link>
					{/if}
					{#if $user}
						<span id="logout" on:click={handleLogout}>Logout</span>
					{/if}
				</div>
			 
			</div>
		</nav>
		<div>
			<PrivateRoute path="/" let:location>
				<Home></Home>
			</PrivateRoute>
			<Route path="signup" component={UserSignup} />
			<Route path="login" component={UserLogin} />

			<PrivateRoute path="profile" let:location>
				<UserProfile></UserProfile>
			</PrivateRoute>

			<PrivateRoute path="editUser" let:location>
				<UserEditProfile></UserEditProfile>
			</PrivateRoute>

			<PrivateRoute path="confirmDeleteUser" let:location>
				<UserConfirmDelete></UserConfirmDelete>
			</PrivateRoute>
			<PrivateRoute path="users" let:location>
				<Users></Users>
			</PrivateRoute>

			<PrivateRoute path="users/:id" let:location>
				<User></User>
			</PrivateRoute>

			<PrivateRoute path="messages/t/:id" let:location>
				<Chat></Chat>
			</PrivateRoute>
			<PrivateRoute path="users/:id/events" let:location>
				<MyEvents></MyEvents>
			</PrivateRoute>

			<PrivateRoute path="createevent" let:location>
				<EventCreate></EventCreate>
			</PrivateRoute>

			<PrivateRoute path="events/:id" let:location>
				<Event></Event>
			</PrivateRoute>

			<PrivateRoute path="editEvent/:id" let:location>
				<EventEdit></EventEdit>
			</PrivateRoute>

			<PrivateRoute path="confirmDeleteEvent/:id" let:location>
				<EventDelete></EventDelete>
			</PrivateRoute>

			<PrivateRoute path="events/:id/invite" let:location>
				<EventInvitePeople></EventInvitePeople>
			</PrivateRoute>

			<PrivateRoute path="events/:id/users" let:location>
				<EventGuestList></EventGuestList>
			</PrivateRoute>

			<PrivateRoute path="marketplace/create" let:location>
				<ProductCreate></ProductCreate>
			</PrivateRoute>

			<PrivateRoute path="marketplace/users/:id/myproducts" let:location>
				<MyProducts></MyProducts>
			</PrivateRoute>

			<PrivateRoute path="marketplace/products/:id" let:location>
				<Product></Product>
			</PrivateRoute>

			<PrivateRoute path="marketplace/editproduct/:id" let:location>
				<ProductEdit></ProductEdit>
			</PrivateRoute>

			<PrivateRoute path="marketplace/confirmdeleteproduct/:id" let:location>
				<ProductDelete></ProductDelete>
			</PrivateRoute>

		</div>
	</Router>
	

</main>

<style>

:global(body) {
	padding: 0px;
}

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

#navbar {
	display: flex;
	justify-content: space-between;
	
}

:global(#navbar a, #navbar span) {
	color: white !important;
	padding: 0px 10px
}

nav {
	background-color: #1B2A38;
	padding: 20px 0px;
}


</style>