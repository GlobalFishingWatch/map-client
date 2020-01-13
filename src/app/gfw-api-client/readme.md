# GFW API CLIENT

Simply pure js library to help on the GFW API with:
- login/logout steps
- fetch authenticated resources

## Usage

### Initialize

There are two options to initialize the library:

1. The simplest way, just include the basic config in the `.env` when no extra configuration is needed.
	`API_AUTH_URL=https://gateway.api.dev.globalfishingwatch.org`

	```js
		import GFWAPI from 'gfw-api-client'
		// use where needed
	```

	The library will use by default the tokens stored in the localStorage to keep it as simple as possible, if you need to use your own config use the option 2.

2. Create your own class instance using the configuration params, when extra configuration is needed.
	```js
	Example:
		import { GFW_API } from 'gfw-api-client'
		const GFWAPI = new GFW_API({
			baseUrl: 'https://gateway.api...',
			token: 'your_token',
			tokenStorageKey: 'MY_KEY...'
			debug: true|false
		})
	```

### Usage

#### Login

1. On the very first usage time the library needs the `access-token` to generate the session `token` and the `refreshToken` but it won't be useful anymore.

```js
try {
	const user = await GFWAPI.login({ accessToken: 'acces_token_here' })
	console.log(user) // returns user data
} catch(e) {
	console.warn('Something happened on the login', e)
}
```

2. Once it was logged for first time you can login using your `refreshToken`:
```js
try {
	const user = await GFWAPI.login({ refreshToken: 'refresh_token_here' })
	console.log(user) // returns user data
} catch(e) {
	console.warn('Something happened on the login', e)
}
```

3. If you want the library to use the stored keys in the localStorage just use:
```js
try {
	const user = await GFWAPI.login()
	console.log(user) // returns user data
} catch(e) {
	console.warn('Something happened on the login', e)
}
```


#### Fetch resources

1. Once the initialization and the login were good to you will be able to consume Global Fishing Watch endpoints data using:

```js
try {
	const data = await GFWAPI.fetch('your_url_here')
	console.log(data) // returns the desired data
} catch(e) {
	console.warn('Something happened on the gfw api fetch', e)
}
```


#### Logout

1. To remove invalidate the current session and removed stored `token` and `refreshToken` just use:

```js
try {
	const logged = await GFWAPI.logout()
	console.log(logged) // returns true when logout was good
} catch(e) {
	console.warn('Something happened on the logout', e)
}
```

### FAQ

<details>
<summary>Do you need the token or the refreshToken in your app ?</summary>
<p>
Just use:
```js
GFWAPI.getToken()
// or
GFWAPI.getRefreshToken()
```
</p>
</details>

<details>
<summary>Do you need the debug the requests?</summary>
<p>
Use your [own instance of the API client](#Initialize) including this param:
```js
	const GFWAPI = new GFW_API({
		....
		debug: true
	})
```
</p>
</details>
