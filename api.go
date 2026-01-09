package main

import (
	"io"
	"fmt"
	"net/http"
	"encoding/json"
	"strings"
	"time"

	"github.com/marco-04/godex/internal"
)

type Direction string
const (
	next Direction = "next"
	prev Direction = "prev"
)

type mapNavigation struct {
	Next     *string    `json:"next"`
	Previous *string    `json:"previous"`
	Results  []Location `json:"results"`
}

type Location struct {
	Name string `json:"name"`
	URL  string `json:"url"`
}

var apiCache internal.Cache = internal.NewCache(10 * time.Second)

func getLocationBatch(url string) (mapNavigation, error) {
	var data []byte

	cache, ok := apiCache.Get(url)
	if ok {
		data = cache
	} else {
		res, err := http.Get(url)
		if err != nil {
			return mapNavigation{}, fmt.Errorf("network error: %w", err)
		}
		defer res.Body.Close()

		body, err := io.ReadAll(res.Body)
		if err != nil {
			return mapNavigation{}, fmt.Errorf("I/O error: %w", err)
		}

		apiCache.Add(url, body)

		data = body
	}

	var nav mapNavigation
	if err := json.Unmarshal(data, &nav); err != nil {
		return mapNavigation{}, fmt.Errorf("json decoding error: %w", err)
	}

	return nav, nil
}

func LocationNavigator() func (Direction) ([]Location, error) {
	url := "https://pokeapi.co/api/v2/location-area?offset=0&limit=20"
	nextURL := ""
	prevURL := ""

	return func(direction Direction) ([]Location, error) {
		switch direction {
		case next:
			if nextURL != "" {
				url = nextURL
			}
		case prev:
			if prevURL != "" {
				url = prevURL
			}
		}

		nav, err := getLocationBatch(url)
		if err != nil {
			return nil, fmt.Errorf("could not get locations: %w", err)
		}

		if nav.Next != nil {
			nextURL = *nav.Next
		}
		if nav.Previous != nil {
			prevURL = *nav.Previous
		}

		return nav.Results, nil
	}
}

func GetLocationDetails(location string) (internal.LocationDetails, error) {
	location = strings.ReplaceAll(location, "/", "")
	url := "https://pokeapi.co/api/v2/location-area/" + location

	var data []byte

	cache, ok := apiCache.Get(url)
	if ok {
		data = cache
	} else {
		res, err := http.Get(url)
		if err != nil {
			return internal.LocationDetails{}, fmt.Errorf("network error: %w", err)
		}
		if res.StatusCode != http.StatusOK {
			return internal.LocationDetails{}, fmt.Errorf("http error: %d", res.StatusCode)
		}
		defer res.Body.Close()

		body, err := io.ReadAll(res.Body)
		if err != nil {
			return internal.LocationDetails{}, fmt.Errorf("I/O error: %w", err)
		}

		apiCache.Add(url, body)

		data = body
	}

	var locationDetails internal.LocationDetails
	if err := json.Unmarshal(data, &locationDetails); err != nil {
		return internal.LocationDetails{}, fmt.Errorf("json decoding error: %w", err)
	}

	return locationDetails, nil
}

func GetPokemonInfo(name string) (internal.PokemonInfo, error) {
	name = strings.ReplaceAll(name, "/", "")
	url := "https://pokeapi.co/api/v2/pokemon/" + name

	var data []byte

	cache, ok := apiCache.Get(url)
	if ok {
		data = cache
	} else {
		res, err := http.Get(url)
		if err != nil {
			return internal.PokemonInfo{}, fmt.Errorf("network error: %w", err)
		}
		if res.StatusCode != http.StatusOK {
			return internal.PokemonInfo{}, fmt.Errorf("http error: %d", res.StatusCode)
		}
		defer res.Body.Close()

		body, err := io.ReadAll(res.Body)
		if err != nil {
			return internal.PokemonInfo{}, fmt.Errorf("I/O error: %w", err)
		}

		apiCache.Add(url, body)

		data = body
	}

	var pokemon internal.PokemonInfo
	if err := json.Unmarshal(data, &pokemon); err != nil {
		return internal.PokemonInfo{}, fmt.Errorf("json decoding error: %w", err)
	}

	return pokemon, nil
}
