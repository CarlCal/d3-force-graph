
import "../styles/main.sass"

import axios from "axios"

const URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json"

axios.get(URL) 
		.then((response) => {
			const nodes = response.nodes,
						links = response.links

		})
.catch((error) => {
	console.error(error)
		})