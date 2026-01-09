package main

import (
	"fmt"
	"os"
	"strings"
)

type cliCommand struct {
	name string
	description string
	callback func(args []string) error
}

var availableCommands map[string]cliCommand

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

	command.callback(args)
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
	}
}
