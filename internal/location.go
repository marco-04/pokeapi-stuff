package internal

type LocationDetails struct {
	Encounters []Encounters `json:"pokemon_encounters"`
}

type Encounters struct {
	Pokemon `json:"pokemon"`
}

type Pokemon struct {
	Name string `json:"name"`
}
