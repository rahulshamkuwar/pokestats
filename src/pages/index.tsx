import Head from 'next/head';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Pokemon, PokemonClient } from "pokenode-ts";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { SPokemon } from '@/interfaces';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


export default function Home({ pokemon: data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const pokemon: SPokemon = data as SPokemon;
  return (
    <>
      <Head>
        <title>PokéStats</title>
        <meta name="description" content="Website that displays Pokémen stats using PokéAPI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar></Navbar>
      <div className="container mx-auto">
        <h1 className="text-2xl capitalize">
        {pokemon.name}
        </h1>
        <div className="grid grid-cols-8">
          <Image 
            className="float-left col-span-1" 
            src={pokemon.sprites.front_default ?? ""} 
            alt={pokemon.name} 
            width={200} 
            height={200}
            priority={true}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(200, 200))}`}
          />
          <Tabs className="col-span-7">
            <TabList>
              <Tab>
                <h2 className="text-xl slate">
                  About
                </h2>
              </Tab>
              <Tab>
                <h2 className="text-xl">
                  Abilities
                </h2>
              </Tab>
              <Tab>
                <h2 className="text-xl">
                  Stats
                </h2>
              </Tab>
              <Tab>
                <h2 className="text-xl">
                  Types
                </h2>
              </Tab>
            </TabList>
            <TabPanel>
              <div className="text-lg capitalize">
                <p>Height: {pokemon.height}</p>
                <p>Weight: {pokemon.weight}</p>
                <p>Species: {pokemon.species.name}</p>
                <p>Base Experience: {pokemon.base_experience}</p>
                {pokemon.forms.map((form, i) => (
                  <p key={i}>
                    Forms: {form.name}{i > 1 ? ", " : ""}
                  </p>
                ))}
              </div>
            </TabPanel>
            <TabPanel>
              {pokemon.abilities.map((ability, i) => (
                <p key={i} className="capitalize text-lg">
                  {ability.ability.name}
                </p>
              ))}
            </TabPanel>
            <TabPanel>
              <div className="text-lg capitalize text-left">
              <table className="table-auto border-collapse border border-slate-500 w-1/2">
                <thead>
                  <tr>
                    <th className="px-5 border border-slate-600 border-">Stat</th>
                    <th className="px-5 border border-slate-600 border-">Base Stat</th>
                    <th className="px-5 border border-slate-600 border-">Effort</th>
                  </tr>
                </thead>
                <tbody>
                  {pokemon.stats.map((stat, i) => (
                    <tr key={i}>
                      <td className="px-5 border border-slate-700">{stat.stat.name}</td>
                      <td className="px-5 border border-slate-700">{stat.base_stat}</td>
                      <td className="px-5 border border-slate-700">{stat.effort}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </TabPanel>
            <TabPanel>
              {pokemon.types.map((type, i) => (
                <div key={i} className="text-lg capitalize">
                  <p>
                    {type.type.name}
                  </p>
                  <p>
                    {type.slot}
                  </p>
                </div>
              ))}
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export const getServerSideProps: GetServerSideProps<{ pokemon: SPokemon | { notFound: boolean } } > = async (context) => {
  const api = new PokemonClient({
    // Cache for one day
    cacheOptions: {
      maxAge: 86400000,
      readOnError: true,
      clearOnStale: true
    }
  });
  const data = await api.getPokemonById(Math.floor(Math.random() * 500)).catch((err) => {
    console.log(err);
    return {
      notFound: true,
    };
  });

  // const pokemon: SPokemon = (({ id, name, base_experience, height, weight, abilities, forms, held_items, location_area_encounters, sprites, species, stats, types }) => ({ id, name, base_experience, height, weight, abilities, forms, held_items, location_area_encounters, sprites, species, stats, types }))(data as Pokemon);

  const pokemon: SPokemon = data as SPokemon;
  delete pokemon.is_default;
  delete pokemon.order;
  delete pokemon.game_indices;
  delete pokemon.held_items;
  delete pokemon.location_area_encounters;
  delete pokemon.moves;
  delete pokemon.order;

  return { props: { pokemon } };
}
