import React from "react";
import { TabPanel, Tabs, Tab, TabList } from "react-tabs";
import { SPokemon } from "@/interfaces";

function PokeTabs(pokemon: SPokemon) {
  return (
    <Tabs className="col-span-3">
      <TabList>
        <Tab>
          <h2 className="text-xl slate">About</h2>
        </Tab>
        <Tab>
          <h2 className="text-xl">Abilities</h2>
        </Tab>
        <Tab>
          <h2 className="text-xl">Stats</h2>
        </Tab>
        <Tab>
          <h2 className="text-xl">Types</h2>
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
              Forms: {form.name}
              {i > 1 ? ", " : ""}
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
                <th className="px-5 border border-slate-600 border-">
                  Base Stat
                </th>
                <th className="px-5 border border-slate-600 border-">Effort</th>
              </tr>
            </thead>
            <tbody>
              {pokemon.stats.map((stat, i) => (
                <tr key={i}>
                  <td className="px-5 border border-slate-700">
                    {stat.stat.name}
                  </td>
                  <td className="px-5 border border-slate-700">
                    {stat.base_stat}
                  </td>
                  <td className="px-5 border border-slate-700">
                    {stat.effort}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabPanel>
      <TabPanel>
        {pokemon.types.map((type, i) => (
          <div key={i} className="text-lg capitalize">
            <p>{type.type.name}</p>
            <p>{type.slot}</p>
          </div>
        ))}
      </TabPanel>
    </Tabs>
  );
}

PokeTabs.propTypes = {};

export default PokeTabs;
