//go:build js && wasm

package main

import (
	"encoding/json"
	"sync"
	"syscall/js"

	"github.com/inkle/ink/compiler-go/pkg/ast"
	"github.com/inkle/ink/compiler-go/pkg/codegen"
	inkjson "github.com/inkle/ink/compiler-go/pkg/json"
	"github.com/inkle/ink/compiler-go/pkg/parser"
	"github.com/inkle/ink/compiler-go/pkg/runtime/engine"
)

var (
	stories     = make(map[int]*engine.Story)
	storyMutex  sync.Mutex
	nextStoryID = 1
)

func main() {
	// Register functions
	js.Global().Set("inkCompile", js.FuncOf(compileInk))
	js.Global().Set("inkCreateStory", js.FuncOf(createStory))
	js.Global().Set("inkStoryCanContinue", js.FuncOf(storyCanContinue))
	js.Global().Set("inkStoryContinue", js.FuncOf(storyContinue))
	js.Global().Set("inkStoryGetChoices", js.FuncOf(storyGetChoices))
	js.Global().Set("inkStoryChoose", js.FuncOf(storyChoose))
	js.Global().Set("inkStoryHasEnded", js.FuncOf(storyHasEnded))
	js.Global().Set("inkStoryGetTags", js.FuncOf(storyGetTags))
	js.Global().Set("inkStoryGetVariables", js.FuncOf(storyGetVariables))
	js.Global().Set("inkStoryReset", js.FuncOf(storyReset))
	js.Global().Set("inkDestroyStory", js.FuncOf(destroyStory))
	js.Global().Set("inkStoryGetState", js.FuncOf(storyGetState))
	js.Global().Set("inkStoryLoadState", js.FuncOf(storyLoadState))

	// Keep the program running
	select {}
}

// compileInk compiles ink source code to JSON
// Returns: { json: string, errors: string[] }
func compileInk(_ js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return makeResult("", []string{"No source provided"})
	}

	source := args[0].String()

	// Collect errors during parsing
	var errors []string
	errorHandler := func(message string, errorType ast.ErrorType) {
		errors = append(errors, message)
	}

	// Parse the ink source
	p := parser.NewInkParser(source, "main.ink", errorHandler, nil)
	astStory := p.Parse()
	if astStory == nil {
		if len(errors) == 0 {
			errors = []string{"Parse failed with unknown error"}
		}
		return makeResult("", errors)
	}

	// Check for parse errors
	if len(errors) > 0 {
		return makeResult("", errors)
	}

	// Generate runtime code
	gen := codegen.NewGenerator(astStory)
	runtimeStory := gen.Generate()
	if runtimeStory == nil {
		return makeResult("", []string{"Code generation failed"})
	}

	// Convert to JSON
	jsonBytes, err := inkjson.WriteStory(runtimeStory, gen.ListDefinitions())
	if err != nil {
		return makeResult("", []string{err.Error()})
	}

	return makeResult(string(jsonBytes), nil)
}

// createStory creates a new story from compiled JSON
// Returns: storyId (int) or -1 on error
func createStory(_ js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return -1
	}

	jsonData := args[0].String()

	story, err := engine.NewStory([]byte(jsonData))
	if err != nil {
		return -1
	}

	storyMutex.Lock()
	id := nextStoryID
	nextStoryID++
	stories[id] = story
	storyMutex.Unlock()

	return id
}

// storyCanContinue checks if the story can continue
func storyCanContinue(_ js.Value, args []js.Value) interface{} {
	story := getStory(args)
	if story == nil {
		return false
	}
	return story.CanContinue()
}

// storyContinue continues the story and returns the next text
func storyContinue(_ js.Value, args []js.Value) interface{} {
	story := getStory(args)
	if story == nil {
		return ""
	}
	return story.Continue()
}

// storyGetChoices returns the current choices as JSON
func storyGetChoices(_ js.Value, args []js.Value) interface{} {
	story := getStory(args)
	if story == nil {
		return "[]"
	}

	choices := story.CurrentChoices()
	result := make([]map[string]interface{}, 0, len(choices))

	for _, choice := range choices {
		if choice.IsInvisibleDefault {
			continue
		}
		result = append(result, map[string]interface{}{
			"text":  choice.Text,
			"index": choice.Index,
		})
	}

	jsonBytes, err := json.Marshal(result)
	if err != nil {
		return "[]"
	}
	return string(jsonBytes)
}

// storyChoose selects a choice by index
func storyChoose(_ js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return false
	}

	story := getStory(args)
	if story == nil {
		return false
	}

	index := args[1].Int()
	err := story.ChooseChoiceIndex(index)
	return err == nil
}

// storyHasEnded checks if the story has ended
func storyHasEnded(_ js.Value, args []js.Value) interface{} {
	story := getStory(args)
	if story == nil {
		return true
	}
	return story.HasEnded()
}

// storyGetTags returns the current tags as JSON array
func storyGetTags(_ js.Value, args []js.Value) interface{} {
	story := getStory(args)
	if story == nil {
		return "[]"
	}

	tags := story.CurrentTags()
	jsonBytes, err := json.Marshal(tags)
	if err != nil {
		return "[]"
	}
	return string(jsonBytes)
}

// storyGetVariables returns all global variables as JSON
func storyGetVariables(_ js.Value, args []js.Value) interface{} {
	story := getStory(args)
	if story == nil {
		return "{}"
	}

	vars := story.GlobalVariables()
	jsonBytes, err := json.Marshal(vars)
	if err != nil {
		return "{}"
	}
	return string(jsonBytes)
}

// storyReset resets the story to the beginning
func storyReset(_ js.Value, args []js.Value) interface{} {
	story := getStory(args)
	if story == nil {
		return false
	}
	story.ResetState()
	return true
}

// destroyStory removes a story from memory
func destroyStory(_ js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return false
	}

	id := args[0].Int()
	storyMutex.Lock()
	delete(stories, id)
	storyMutex.Unlock()

	return true
}

// storyGetState returns the current save state as JSON
func storyGetState(_ js.Value, args []js.Value) interface{} {
	story := getStory(args)
	if story == nil {
		return ""
	}

	state, err := story.SaveState()
	if err != nil {
		return ""
	}
	return state
}

// storyLoadState loads a save state
func storyLoadState(_ js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return false
	}

	story := getStory(args)
	if story == nil {
		return false
	}

	state := args[1].String()
	err := story.LoadState(state)
	return err == nil
}

// Helper functions

func getStory(args []js.Value) *engine.Story {
	if len(args) < 1 {
		return nil
	}

	id := args[0].Int()
	storyMutex.Lock()
	story := stories[id]
	storyMutex.Unlock()

	return story
}

func makeResult(jsonStr string, errors []string) interface{} {
	result := map[string]interface{}{
		"json":   jsonStr,
		"errors": errors,
	}
	jsonBytes, _ := json.Marshal(result)
	return string(jsonBytes)
}
