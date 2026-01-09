package internal

type LocationDetails struct {
	Encounters []Encounters `json:"pokemon_encounters"`
}

type Encounters struct {
	PokemonEncounter `json:"pokemon"`
}

type PokemonEncounter struct {
	Name string `json:"name"`
}
