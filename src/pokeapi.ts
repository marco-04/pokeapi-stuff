import { Cache } from "./cache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private limit: number = 20;
  private nextPage: string | null = null;
  private prevPage: string | null = null;

  private cache: Cache;

  private pokedex: Record<string, Pokemon> = {};

  constructor(cacheInterval: number) {
    this.cache = new Cache(cacheInterval);
  }

  stopCache() {
    this.cache.stopReapLoop();
  }

  updateLimit(limit: number) {
    if (limit > 0) {
      this.limit = limit;
      this.nextPage = null;
      this.prevPage = null;
    }
  }

  private async cachedFetchJSON(input: string, init?: RequestInit) {
    const cachedVal = this.cache.get(input);
    if (cachedVal === undefined) {
      console.log(`Fetching "${input}"`)
      const response = await fetch(input, init);

      if (response.status >= 400) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const responseJSON = await response.json();
      this.cache.add(input, responseJSON);
      return responseJSON;
    } else {
      this.cache.add(input, cachedVal);
      return cachedVal;
    }
  }

  private async fetchLocations(pageURL: string | null): Promise<LocationsResponse> {
    const locationURL = pageURL === null ? `${PokeAPI.baseURL}/location-area?limit=${this.limit}` : pageURL;
    const locations = await this.cachedFetchJSON(locationURL, {
      method: "GET",
      mode: "cors"
    }) as LocationsResponse;

    return locations;
  }

  async fetchPage(page: "next" | "prev"): Promise<ShallowLocation[]> {
    const shallowLocations = await this.fetchLocations(page === "next" ? this.nextPage : this.prevPage);
    this.nextPage = shallowLocations.next;
    this.prevPage = shallowLocations.previous;
    return shallowLocations.results;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const locationURL = `${PokeAPI.baseURL}/location-area/${locationName}`;
    const location = await this.cachedFetchJSON(locationURL, {
      method: "GET",
      mode: "cors"
    }) as Location;

    return location;
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    const pokemonURL = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;
    const pokemon = await this.cachedFetchJSON(pokemonURL, {
      method: "GET",
      mode: "cors"
    }) as Pokemon;

    return pokemon;
  }

  registerPokemon(pokemon: Pokemon) {
    this.pokedex[pokemon.name] = pokemon;
  }

  getRegisteredPokemons() {
    return Object.keys(this.pokedex);
  }
}

export interface LocationsResponse {
  count: number,
  next: string | null,
  previous: string | null,
  results: ShallowLocation[]
};

export interface ShallowLocation {
  name: string,
  url: string
};

export interface Location {
  id: number
  name: string
  pokemon_encounters: {
    pokemon: Pokemon
  }[]
}

export interface Pokemon {
  name: string
  base_experience?: number
}

