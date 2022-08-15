<script>
	import { Router, Route, Link } from "svelte-navigator";
	import PrivateRoute from "./component/privateRoute/PrivateRoute.svelte";
	import { user } from "./store/userStore";
	import io from "socket.io-client"; 

	import UserSignup from "./pages/usersignup/signup.svelte";
	import UserLogin from "./pages/userlogin/login.svelte";
	import UserProfile from "./pages/myprofile/profile.svelte";
	import UserEditProfile from "./pages/user/editprofile.svelte";
	import UserConfirmDelete from "./pages/user/confirmdeleteuser.svelte";
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

	import ProductCreate from "./pages/product/createproduct.svelte";
	import ProductEdit from "./pages/product/editproduct.svelte";
	import Product from "./pages/product/product.svelte";
	import Products from "./pages/products/products.svelte";
	import ProductDelete from "./pages/product/confirmdeleteproduct.svelte";

	import ProductReceipt from "./pages/productsreceipt/productsReceipt.svelte"
	import MyProducts from "./pages/products/myProducts.svelte";



	const socket = io();
	let userOnlineCount = 0;
	socket.on("userOnline", (count) => { 
		userOnlineCount = count;
    }); 

	async function handleLogout() {
		socket.emit('logout', userOnlineCount);
		const logOutResponse = await fetch(`/logout`);
		const { logOutData } = await logOutResponse.json();
		if(logOutData === "success") {
			$user = null;
		}
	}

</script>



<main>
	<Router>
		<nav class="mb-5">
			<div id="navbar" class="container">
				<div>
					<span style="font-weight: 600;"><em>Socialz</em></span>

					{#if $user}
						<Link to="/">Home</Link>
					{/if}
				
					{#if $user}
						<Link to="community/users/{$user.id}">profile</Link>
					{/if}
					{#if $user}
						<Link to="community/users">Users</Link>
					{/if}

					{#if $user}
						<Link to="community/users/{$user.id}/events">My Events</Link>
					{/if}

					{#if $user}
						<Link to="marketplace/products">All Products</Link>
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


			<PrivateRoute path="community/editUser">
				<UserEditProfile></UserEditProfile>
			</PrivateRoute>

			<PrivateRoute path="community/confirmDeleteUser">
				<UserConfirmDelete></UserConfirmDelete>
			</PrivateRoute>

			<PrivateRoute path="community/users">
				<Users></Users>
			</PrivateRoute>

			<PrivateRoute path="community/users/:id" let:params>
				<User id={params.id}></User>
			</PrivateRoute>

			<PrivateRoute path="messages/t/:id" let:params>
				<Chat id={params.id}></Chat>
			</PrivateRoute>
			<PrivateRoute path="community/users/:id/events">
				<MyEvents></MyEvents>
			</PrivateRoute>

			<PrivateRoute path="community/createevent">
				<EventCreate></EventCreate>
			</PrivateRoute>

			<PrivateRoute path="community/events/:id" let:params>
				<Event eventID={params.id}></Event>
			</PrivateRoute>

			<PrivateRoute path="community/editEvent/:id" let:params>
				<EventEdit eventID={params.id}></EventEdit>
			</PrivateRoute>

			<PrivateRoute path="community/confirmDeleteEvent/:id" let:params>
				<EventDelete eventID={params.id}></EventDelete>
			</PrivateRoute>

			<PrivateRoute path="community/events/:id/invite" let:params>
				<EventInvitePeople eventID={params.id}></EventInvitePeople>
			</PrivateRoute>

			<PrivateRoute path="community/events/:id/users" let:params>
				<EventGuestList eventID={params.id}></EventGuestList>
			</PrivateRoute>

			<PrivateRoute path="marketplace/create">
				<ProductCreate ></ProductCreate>
			</PrivateRoute>

			<PrivateRoute path="marketplace/products">
				<Products ></Products>
			</PrivateRoute>

			<PrivateRoute path="marketplace/users/:id/myproducts">
				<MyProducts></MyProducts>
			</PrivateRoute>

			<PrivateRoute path="marketplace/products/:id" let:params>
				<Product productID={params.id}></Product>
			</PrivateRoute>

			<PrivateRoute path="marketplace/editproduct/:id" let:params>
				<ProductEdit productID={params.id}></ProductEdit>
			</PrivateRoute>

			<PrivateRoute path="marketplace/confirmdeleteproduct/:id" let:params>
				<ProductDelete productID={params.id}></ProductDelete>
			</PrivateRoute>

			<PrivateRoute path="marketplace/productreceipt/:id" let:params>
				<ProductReceipt productID={params.id}></ProductReceipt>
			</PrivateRoute>

		</div>
	</Router>
	

	<div id="footer"></div>

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

#footer {
	height: 3rem;
	background-color: #1B2A38;
	width: 100%;
	margin-top: 2rem;
}


</style>