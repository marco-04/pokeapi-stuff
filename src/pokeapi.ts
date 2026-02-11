export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private limit: number = 20;
  private nextPage: string | null = null;
  private prevPage: string | null = null;

  constructor() {}

  updateLimit(limit: number) {
    if (limit > 0) {
      this.limit = limit;
      this.nextPage = null;
      this.prevPage = null;
    }
  }

  private async fetchLocations(pageURL: string | null): Promise<LocationsResponse> {
    const locationURL = pageURL === null ? `${PokeAPI.baseURL}/location-area?limit=${this.limit}` : pageURL;
    console.log(`Fetching "${locationURL}"`)
    const response = await fetch(locationURL, {
      method: "GET",
      mode: "cors"
    });

    return (await response.json()) as LocationsResponse;
  }

  async fetchPage(page: "next" | "prev"): Promise<ShallowLocation[]> {
    const shallowLocations = await this.fetchLocations(page === "next" ? this.nextPage : this.prevPage);
    this.nextPage = shallowLocations.next;
    this.prevPage = shallowLocations.previous;
    return shallowLocations.results;
  }

  async fetchLocation(locationName: string): Promise<Location> {
    const locationURL = `${PokeAPI.baseURL}/location-area/${locationName}`;
    const response = await fetch(locationURL, {
      method: "GET",
      mode: "cors"
    });

    return (await response.json()) as Location;
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
  pokemon_encounters: PokemonEncounter[]
}

export interface PokemonEncounter {
  pokemon: Pokemon
  version_details: VersionDetail2[]
}

export interface Pokemon {
  name: string
  url: string
}

export interface VersionDetail2 {
  encounter_details: EncounterDetail[]
  max_chance: number
  version: Version2
}

export interface EncounterDetail {
  chance: number
  condition_values: any[]
  max_level: number
  method: Method
  min_level: number
}

export interface Method {
  name: string
  url: string
}

export interface Version2 {
  name: string
  url: string
}


