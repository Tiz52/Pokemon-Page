import { pokeApi } from "../api";
import { Pokemon } from "../interfaces";

export const getPokemonInfo = async( name0rId: string ) => {
	
	const { data } = await pokeApi.get<Pokemon>(`/pokemon/${ name0rId }`);

	return  {
		id: data.id,
		name: data.name,
		sprites: data.sprites
	};
};