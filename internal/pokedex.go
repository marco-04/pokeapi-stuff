package internal

type Pokedex map[string]PokemonInfo

func NewPokedex() Pokedex {
	return make(Pokedex)
}

func (p Pokedex) Add(name string, info PokemonInfo) {
	if _, ok := p[name]; !ok {
		p[name] = info
	}
}

func (p Pokedex) Get(name string) (PokemonInfo, bool) {
	if v, ok := p[name]; !ok {
		return PokemonInfo{}, false
	} else {
		return v, true
	}
}

func (p Pokedex) ListAll() []string {
	if len(p) == 0 {
		return nil
	}

	keys := make([]string, 0, len(p))
	
	for k := range p {
		keys = append(keys, k)
	}

	return keys
}
