import { useState } from "react";

import { Button, Card, Container, Grid, Image, Text } from "@nextui-org/react";
import { GetStaticProps, GetStaticPaths, NextPage } from 'next';

import confetti from 'canvas-confetti';

import { Layout } from "../../components/layouts";
import { pokeApi } from '../../api';
import { Pokemon } from '../../interfaces';
import { PokemonListResponse } from '../../interfaces/pokemon-list';
import { getPokemonInfo, localFavorites } from "../../utils";

interface Props {
	pokemon: Pokemon
}

const PokemonPageByName:NextPage<Props> = ({ pokemon }) => {

	const [isInFavorites, setIsInFavorites] = useState( localFavorites.existInFavorites( pokemon.id ) );

	const onToggleFavorite = () => {
		localFavorites.toggleFavorite( pokemon.id );
		setIsInFavorites( !isInFavorites );

		if( !isInFavorites ) return;

		confetti({
			zIndex: 999,
			particleCount: 100,
			spread: 160,
			angle: -100,
			origin: {
				x: 1,
				y: 0,
			}
		});

	};


	return (
		<Layout title={ pokemon.name }>
			<Grid.Container css={{ marginTop: '5px'}} gap={ 2 }>
				<Grid xs={ 12 } sm={ 4 }>
					<Card hoverable css={{ padding: '30px'}}>
						<Card.Body>
							<Card.Image
								src={ pokemon.sprites.other?.dream_world.front_default || '/no-image.png' }
								alt={ pokemon.name }
								width='100%'
								height={ 200 }
							/>
						</Card.Body>
					</Card>
				</Grid>

				<Grid xs= {12} sm={ 8 }>
					<Card>
						<Card.Header css={{ display: 'flex', justifyContent: 'space-between'}}>
							<Text h1 transform='capitalize'>{ pokemon.name }</Text>

							<Button
								color='gradient'
								ghost={!isInFavorites}
								onClick={ onToggleFavorite }
							>
								{ !isInFavorites ? 'Guarda en favoritos' : 'En favoritos'}

							</Button>
						</Card.Header>

						<Card.Body>
							<Text size={ 30 }>Sprites:</Text>

							<Container display='flex' direction='row' gap={ 0 }>
								<Image 
									src={ pokemon.sprites.front_default }
									alt={ pokemon.name }
									width= { 100 }
									height= { 100 }
								/>
								<Image 
									src={ pokemon.sprites.back_default }
									alt={ pokemon.name }
									width= { 100 }
									height= { 100 }
								/>
								<Image 
									src={ pokemon.sprites.front_shiny }
									alt={ pokemon.name }
									width= { 100 }
									height= { 100 }
								/>
								<Image 
									src={ pokemon.sprites.back_shiny }
									alt={ pokemon.name }
									width= { 100 }
									height= { 100 }
								/>
							</Container>
						</Card.Body>

					</Card>
				</Grid>
			</Grid.Container>
		</Layout>
	);
};





export const getStaticPaths: GetStaticPaths = async (ctx) => {

	const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151');

	const pokemon151: string[] = data.results.map( poke => poke.name );


	return {
		paths: pokemon151.map( name => ({
			params: { name }
		})),
		fallback: false
	};
};



export const getStaticProps: GetStaticProps = async ({ params }) => {

	const { name } = params as { name: string };

	return {
		props: {
			pokemon: await getPokemonInfo( name )
		}
	};
};

export default PokemonPageByName;