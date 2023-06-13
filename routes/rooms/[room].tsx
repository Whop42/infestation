import { Handlers, PageProps } from "https://deno.land/x/fresh@1.1.6/server.ts";
import { Board } from "../../components/Board.tsx";

let data = new Map<string, Array<string>>();
let gridStates = new Map<string, string[][]>();
let workers = new Map<string, Map<string, Worker>>();

const width = 20;
const height = 20;

export const handler: Handlers = {
    async POST(req, ctx) {
        const form = await req.formData();
        const file = form.get("fileUpload")?.toString();
        
        
    }
}

function createWorkers(room: string) {
    if(!workers.has(room)) {
        workers.set(room, new Map<string, Worker>());
    }

    const roomData = data.get(room);
    const roomWorkers = workers.get(room);
    roomData?.forEach((file: string) => {
        const worker = new Worker(new URL(file, import.meta.url).href, {type: "module"});
        roomWorkers?.set(file, worker);
    })
}

function runWorkers(room: string): string[][] | undefined {
    const roomWorkers = workers.get(room);
    let gridState = gridStates.get(room);

    roomWorkers?.forEach((worker: Worker, file: string) => {
        console.log("running " + file);

        worker.postMessage({
            gridState: gridState,
            virusPosition: 
        })

    });

    return gridState;
}

export default function Room(props: PageProps) {
    const { room } = props.params;

    if(!data.has(room)) {
        data.set(room, new Array<string>);
    }

    if(!gridStates.has(room)) {
        let defaultState: string[][] = [];
        for(let i = 0; i < height; i++) {
            for(let j = 0; j < width; j++) {
                defaultState[i][j] = ".";
            }
        }
        gridStates.set(room, defaultState);
    }

    return (
        <main>
            <h1>Room: {room}</h1>

            <Board content={grid}/>

            <form>
                <label for="codeUpload">Upload file: </label>
                <input id="codeUpload" type="file"></input>
                <input id="submit" type="submit"></input>
            </form>
        </main>
    );
}