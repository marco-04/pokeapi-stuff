package main

import (
	"fmt"
	"os"
	"time"
	"strings"
	"math/rand"

	"github.com/marco-04/godex/internal"
)

type cliCommand struct {
	name string
	description string
	callback func(args []string) error
}

var availableCommands map[string]cliCommand
var pokedex = internal.NewPokedex()

func cleanInput(text string) []string {
	wordsList := strings.Split(strings.ToLower(strings.TrimSpace(text)), " ")
	words := make([]string, 0, len(wordsList))

	for _, word := range wordsList {
		if word != "" {
			words = append(words, word)
		}
	}

	return words
}

func printLocations(locations []Location) {
	for _, location := range locations {
		fmt.Println(location.Name)
	}
}

var locationNavigator = LocationNavigator()
var commandMapNext = func([]string) error {
	locations, err := locationNavigator(next)
	if err != nil {
		return err
	}

	printLocations(locations)

	return nil
}

var commandMapPrev = func([]string) error {
	locations, err := locationNavigator(prev)
	if err != nil {
		return err
	}

	printLocations(locations)

	return nil
}

func dispatchCommand(cmd []string) {
	if len(cmd) == 0 {
		return
	}

	command, ok := availableCommands[cmd[0]]
	if !ok {
		fmt.Printf("Command \"%s\" not found\n", cmd)
	}

	var args []string
	if len(cmd) > 1 {
		args = cmd[1:]
	} else {
		args = nil
	}

	err := command.callback(args)
	if err != nil {
		fmt.Println(err)
	}
}

func commandExplore(args []string) error {
	if len(args) == 0 {
		return fmt.Errorf("No map specified")
	}

	location := args[0]
	locationDetails, err := GetLocationDetails(location)
	if err != nil {
		return fmt.Errorf("could not get location details: %w", err)
	}

	for _, encounter := range locationDetails.Encounters {
		fmt.Println(encounter.Name)
	}
	
	return nil
}

func commandCatch(args []string) error {
	if len(args) == 0 {
		return fmt.Errorf("No pokemon specified")
	}

	pokemon := args[0]
	pokemonInfo, err := GetPokemonInfo(pokemon)
	if err != nil {
		return fmt.Errorf("could not get pokemon info: %w", err)
	}

	fmt.Printf("Throwing a Pokeball at %s...", pokemon)

	var caught bool
	const maxEXP int = 500
	baseEXP := pokemonInfo.BaseEXP

	rand := rand.New(rand.NewSource(time.Now().Unix()))
	caught = rand.Int() % maxEXP > baseEXP

	time.Sleep(1 * time.Second)

	for range 3 {
		if caught || rand.Int() % 2 == 0 {
			fmt.Print(" *tick*")
		} else {
			break
		}

		time.Sleep(1 * time.Second)
	}

	if caught {
		fmt.Printf("\n%s was caught!\n", pokemon)
		pokedex.Add(pokemon, pokemonInfo)
	} else {
		fmt.Printf("\n%s escaped!\n", pokemon)
	}

	return nil
}

func commandExit([]string) error {
	fmt.Println("Closing the Pokedex... Goodbye!")
	os.Exit(0)
	return nil
}

func commandHelp([]string) error {
	fmt.Print("Welcome to the Pokedex!\nUsage:\n\n")
	// fmt.Println("help: Displays a help message")
	for k, v := range availableCommands {
		fmt.Printf("%s: %s\n", k, v.description)
	}
	return nil
}

func init() {
	availableCommands = map[string]cliCommand{
		"exit": {
				name:        "exit",
				description: "Exit the Pokedex",
				callback:    commandExit,
		},
		"help": {
				name:        "help",
				description: "Displays a help message",
				callback:    commandHelp,
		},
		"map": {
				name:        "map",
				description: "Display the name of the next 20 locations",
				callback:    commandMapNext,
		},
		"mapb": {
				name:        "map",
				description: "Display the name of the previous 20 locations",
				callback:    commandMapPrev,
		},
		"explore": {
				name:        "explore",
				description: "List all Pokémons living in a map",
				callback:    commandExplore,
		},
		"catch": {
				name:        "catch",
				description: "Try to catch a Pokémon",
				callback:    commandCatch,
		},
	}
}
