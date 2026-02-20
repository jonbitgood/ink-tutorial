.PHONY: build clean

WASM_OUT = ../static/wasm/ink.wasm
WASM_EXEC_OUT = ../static/wasm/wasm_exec.js

build:
	GOOS=js GOARCH=wasm go build -o $(WASM_OUT) main.go
	cp "$$(go env GOROOT)/lib/wasm/wasm_exec.js" $(WASM_EXEC_OUT)
	@echo "Built $(WASM_OUT)"
	@ls -lh $(WASM_OUT)

clean:
	rm -f $(WASM_OUT) $(WASM_EXEC_OUT)
