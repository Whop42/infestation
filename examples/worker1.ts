const char: string = "A";

self.onmessage = (event) => {
    let gridState = event.data.gridState;

    

    self.postMessage({ 
        gridState: gridState
    });
}

function main(gridState: string[][]): string[][] {
    for(let y = 0; y < gridState.length; y++) {
        for(let x = 0; x < gridState[0].length; x++) {
            console.log("hi");
        }
    }

    return gridState;
}