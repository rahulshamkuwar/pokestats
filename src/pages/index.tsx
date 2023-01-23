import Head from "next/head";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { PokemonClient } from "pokenode-ts";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { SPokemon } from "@/interfaces";
import "react-tabs/style/react-tabs.css";
import { NextRouter, useRouter } from "next/router";
import PokeTabs from "@/components/PokeTabs";
import React from "react";

export default function Home({
  pokemon: data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const pokemon: SPokemon = data as SPokemon;
  const router: NextRouter = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  return (
    <>
      <Head>
        <title>PokéStats</title>
        <meta
          name="description"
          content="Website that displays Pokémen stats using PokéAPI."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Navbar></Navbar>
      <main>
        <div className="container mx-auto">
          <h1 className="text-2xl capitalize">{pokemon.name}</h1>
          <div className="lg:grid lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="md:w-64 md:h-64 w-48 h-48 relative object-contain m-5">
                <Image
                  src={pokemon.sprites.other?.dream_world.front_default ?? ""}
                  alt={pokemon.name}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    placeHolder(256, 256)
                  )}`}
                />
              </div>
              <div className="grid grid-cols-4">
                <div className="w-16 h-16 relative object-contain col-span-1">
                  <Image
                    src={pokemon.sprites.front_default ?? ""}
                    alt={`${pokemon.name}-back-default`}
                    fill
                    priority
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      placeHolder(128, 128)
                    )}`}
                  />
                </div>
                <div className="w-16 h-16 relative object-contain col-span-1">
                  <Image
                    src={pokemon.sprites.back_default ?? ""}
                    alt={`${pokemon.name}-back-default`}
                    fill
                    priority
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      placeHolder(128, 128)
                    )}`}
                  />
                </div>
                <div className="w-16 h-16 relative object-contain col-span-1">
                  <Image
                    src={pokemon.sprites.front_shiny ?? ""}
                    alt={`${pokemon.name}-back-default`}
                    fill
                    priority
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      placeHolder(128, 128)
                    )}`}
                  />
                </div>
                <div className="w-16 h-16 relative object-contain col-span-1">
                  <Image
                    src={pokemon.sprites.back_shiny ?? ""}
                    alt={`${pokemon.name}-back-default`}
                    fill
                    priority
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      placeHolder(128, 128)
                    )}`}
                  />
                </div>
              </div>
            </div>
            <PokeTabs {...pokemon}></PokeTabs>
          </div>
          <div className="my-5 grid place-items-center">
            <button
              className="rounded-full bg-slate-500 py-2 px-5 text-xl transition-all"
              onClick={refreshData}
            >
              <h3>New Pokémon</h3>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

const placeHolder = (w: number, h: number) =>
  `<div className="animate-pulse bg-slate-700 p-4 ring-1 ring-slate-900/5 rounded-lg shadow-lg" style={{ height: ${h}, width: ${w} }} ></div>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const getServerSideProps: GetServerSideProps<{
  pokemon: SPokemon | { notFound: boolean };
}> = async () => {
  const api = new PokemonClient({
    // Cache for one day
    cacheOptions: {
      maxAge: 86400000,
      readOnError: true,
      clearOnStale: true,
    },
  });
  const data = await api
    .getPokemonById(Math.floor(Math.random() * 500))
    .catch(err => {
      console.log(err);
      return {
        notFound: true,
      };
    });

  const pokemon: SPokemon = data as SPokemon;
  delete pokemon.is_default;
  delete pokemon.order;
  delete pokemon.game_indices;
  delete pokemon.held_items;
  delete pokemon.location_area_encounters;
  pokemon.moves = pokemon.moves?.slice(0, 5);
  delete pokemon.order;

  return { props: { pokemon } };
};
