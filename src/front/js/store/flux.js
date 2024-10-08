const getState = ({ getStore, getActions, setStore }) => {
	const storedUserData = localStorage.getItem('userData');
	const initialUser = storedUserData ? JSON.parse(storedUserData) : null;

	return {
		store: {
			token: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],

			user: initialUser,
			email: null, 
			posts: [],
            loading: false,
            error: null,
		},

		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},


			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			addUser: async (newUser) => {
				const url = `${process.env.BACKEND_URL}/api/user`;
				const options = {
					method: 'POST',
					body: JSON.stringify(newUser),
					headers: { 'Content-Type': 'application/json' }
				};
				try {
					const resp = await fetch(url, options);
					
					if (resp.ok) {
						console.log('La solicitud se realizó con éxito');
						try {
							const data = await resp.json();
							console.log('Respuesta del servidor:', data);
						} catch (jsonError) {
							console.error('Error al analizar JSON:', jsonError);
						}
					} else {
						const errorText = await resp.text();
						console.error('La solicitud no se realizó con éxito');
						console.error('Estado:', resp.status);
						console.error('Texto del Estado:', resp.statusText);
						console.error('Respuesta del Servidor:', errorText);
					}
				} catch (error) {
					console.error('Error en la solicitud', error);
				}
			},			
			loginUser: async (userCredentials) => {
				const url = process.env.BACKEND_URL + '/api/login';
				const options = {
					method: 'POST',
					body: JSON.stringify(userCredentials),
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				};
				try {
					const resp = await fetch(url, options);
					console.log()
					if (resp.ok) {
						const data = await resp.json();
						console.log('La solicitud se realizó con éxito');
						localStorage.setItem('userToken', data.token);
						
						await setStore({ user: data.user, token: data.token });
						localStorage.setItem('userData', JSON.stringify(data.user));
						let { user } = getStore()
						// console.log("loginuserdata" + JSON.stringify(user))
						return { success: true };


					} else {
						console.log('La solicitud de login no se realizó con éxito');
						return { success: false, error: 'Contraseña incorrecta' };
					}
				} catch (error) {
					console.error(error);
					return { success: false, error: 'Error de red' };
				}
			},
			updateUser: async (data) => {
				const url = `${process.env.BACKEND_URL}/api/user/${data.id}`; // Asegúrate de que la URL sea correcta
			
				const options = {
					method: 'PATCH',
					body: JSON.stringify(data),
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				};
			
				try {
					const resp = await fetch(url, options);
					if (resp.ok) {
						console.log('La solicitud se realizó con éxito');
						let { user } = getStore();
						const updatedUser = { ...user, ...data };
						await setStore({ user: updatedUser });
						localStorage.setItem('userData', JSON.stringify(updatedUser));
					} else {
						console.error('La solicitud no se realizó con éxito');
					}
				} catch (error) {
					console.error(error);
				}
			},
			logout: async () => {
				const token = localStorage.getItem('userToken');
				if (!token) {
					console.error('No se encontró un token en localStorage');
					return;
				}
				const url = process.env.BACKEND_URL + '/api/logout';
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Authorization': 'Bearer ' + token
					}

				}
				try {
					const resp = await fetch(url, options);
					if (resp.ok) {
						localStorage.removeItem('userToken');
						localStorage.removeItem('userData');
						await setStore({ user: null, token: null });
						return { success: true };
					} else {
						console.error('La solicitud de logout no se realizó con éxito');
					}
				} catch (error) {
					console.error(error);
				}
			},
			checkToken: async (token) => {

				const url = process.env.BACKEND_URL + '/api/check-token';
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Authorization': 'Bearer ' + token
					}

				}
				try {
					const resp = await fetch(url, options);
					if (resp.ok) {
						const data = JSON.stringify(resp.json)
						return data;
					} else {
						console.error('La solicitud de logout no se realizó con éxito');
					}
				} catch (error) {
					console.error(error);
				}
			},
			createPost: async (postData) => {
				const token = localStorage.getItem('userToken');
				const url = process.env.BACKEND_URL + '/api/posts';
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,  // Incluir el token en el encabezado de autorización
					},
					body: JSON.stringify(postData)  // Convertir los datos del post a formato JSON
				};
			
				try {
					const response = await fetch(url, options);
					const result = await response.json();
					if (response.ok) {
						console.log('Post creado exitosamente:', result);
					} else {
						console.error('Error al crear el post:', result);
					}
				} catch (error) {
					console.error('Error al realizar la solicitud:', error);
				}
			},
			
			recoveryPassword: async (email) => {
				const url = process.env.BACKEND_URL + '/api/requestpassword';
				const options = {
					method: 'POST',
					body: JSON.stringify({
						email
					}),
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}


				}
				try {
					const resp = await fetch(url, options);
					if (resp.ok) {
						return { success: true, "msg": "mail Enviado" };
					} else {
						console.error('La solicitud de logout no se realizó con éxito');
					}
				} catch (error) {
					console.error(error);
				}
			},
			getUser: async (userid) => {
				const url = process.env.BACKEND_URL + '/api/user/' + userid;
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				}
			
				try {
					const resp = await fetch(url, options);
					if (resp.ok) {
						const data = await resp.json();
						return data;
					} else {
						console.error('Error fetching user:', resp.statusText);
						return null; // Indicar que hubo un error al obtener los datos
					}
				} catch (error) {
					console.error('Fetch error:', error);
					return null; // Indicar que hubo un error en la solicitud
				}
			},
			
			decrypt: async (token) => {
				const url = process.env.BACKEND_URL + '/api/decrypt';
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Authorization': 'Bearer ' + token
					}
				}
				try {
					const resp = await fetch(url, options);
					if (resp.ok) {
						const data = await resp.json()
						return data
					}
				} catch (error) {
					console.error(error)
				}
			},
			changePassword: async (credentials) => {
				const url = process.env.BACKEND_URL + '/api/changepassword';
				console.log(credentials)
				const options = {
					method: 'PATCH',
					body: JSON.stringify({
						"email": credentials.email,
						"password": credentials.password
					}),
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'

					}
				}
				try {
					const resp = await fetch(url, options);
					if (resp.ok) {
						const data = await resp.json()
						return data
					}
				} catch (error) {
					console.error(error)
				}
			},
			rechargeToken: ()=>{
				setStore({ token: localStorage.getItem('userToken') })
			},

			// Posts de usuarios

			
			getAllPosts: async () => {
				const url = process.env.BACKEND_URL + '/api/posts';
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					}
				};
		
				try {
					const resp = await fetch(url, options);
					if (resp.ok) {
						const data = await resp.json();
						return data.posts; // Asegúrate de que esta propiedad exista en la respuesta.
					} else {
						console.error('Error al obtener posts:', resp.statusText);
					}
				} catch (error) {
					console.error('Error al obtener posts:', error);
				}
			},
			getUserPosts: async (userId) => {
				const token = localStorage.getItem('userToken');
				const url = `${process.env.BACKEND_URL}/api/posts/user/${userId}`;
				const options = {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,  // Incluir el token en el encabezado de autorización
					}
				};
			
				try {
					const response = await fetch(url, options);
					const result = await response.json();
					if (response.ok) {
						console.log('Posts del usuario cargados exitosamente:', result);
						return result.posts;  // Ajusta si la estructura de respuesta es diferente
					} else {
						console.error('Error al obtener los posts del usuario:', result);
						return [];  // Retorna un array vacío en caso de error
					}
				} catch (error) {
					console.error('Error al realizar la solicitud:', error);
					return [];  // Retorna un array vacío en caso de error
				}
			},
			



		},
	};
};
export default getState;
