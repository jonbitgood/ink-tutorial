module github.com/inkle/ink/ink-tutorial/wasm

go 1.21

require (
	github.com/inkle/ink/compiler-go/pkg/ast v0.0.0
	github.com/inkle/ink/compiler-go/pkg/codegen v0.0.0
	github.com/inkle/ink/compiler-go/pkg/json v0.0.0
	github.com/inkle/ink/compiler-go/pkg/parser v0.0.0
	github.com/inkle/ink/compiler-go/pkg/runtime/engine v0.0.0
)

replace (
	github.com/inkle/ink/compiler-go/pkg/ast => /Users/jon/Projects/jon/inkleink/compiler-go/pkg/ast
	github.com/inkle/ink/compiler-go/pkg/codegen => /Users/jon/Projects/jon/inkleink/compiler-go/pkg/codegen
	github.com/inkle/ink/compiler-go/pkg/json => /Users/jon/Projects/jon/inkleink/compiler-go/pkg/json
	github.com/inkle/ink/compiler-go/pkg/parser => /Users/jon/Projects/jon/inkleink/compiler-go/pkg/parser
	github.com/inkle/ink/compiler-go/pkg/runtime => /Users/jon/Projects/jon/inkleink/compiler-go/pkg/runtime
	github.com/inkle/ink/compiler-go/pkg/runtime/engine => /Users/jon/Projects/jon/inkleink/compiler-go/pkg/runtime/engine
)
