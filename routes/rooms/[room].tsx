import { Handlers, PageProps } from "https://deno.land/x/fresh@1.1.6/server.ts";
import Board  from "../../islands/Board.tsx";
import { MultipartReader } from "https://deno.land/std@0.84.0/mime/mod.ts";
import { multiParser, Form, FormFile } from 'https://deno.land/x/multiparser@0.114.0/mod.ts'

let data = new Map<string, Array<string>>();
let gridStates = new Map<string, string[][]>();
let workers = new Map<string, Map<string, Worker>>();

type CodeFile = {
    filename: string,
    content: string
}

const width = 20;
const height = 20;

export const handler: Handlers = {
    async GET(req, ctx) {
        return await ctx.render();
    },
    async POST(req, ctx) {
        const formData = await req.formData();
        const file = formData.get("code") as File;

        return new Response(null, {
            headers: {
              "a": await file.text(),
            },
          });
    }
}

// function createWorkers(room: string) {
//     if(!workers.has(room)) {
//         workers.set(room, new Map<string, Worker>());
//     }

//     const roomData = data.get(room);
//     const roomWorkers = workers.get(room);
//     roomData?.forEach((file: string) => {
//         const worker = new Worker(new URL(file, import.meta.url).href, {type: "module"});
//         roomWorkers?.set(file, worker);
//     })
// }

// function runWorkers(room: string): string[][] | undefined {
//     const roomWorkers = workers.get(room);
//     let gridState = gridStates.get(room);

//     roomWorkers?.forEach((worker: Worker, file: string) => {
//         console.log("running " + file);

//         // worker.postMessage({
//         //     gridState: gridState,
//         //     virusPosition: 
//         // })

//     });

//     return gridState;
// }

export default function Room(props: PageProps) {
    const { room } = props.params;

    // if(!data.has(room)) {
    //     data.set(room, new Array<string>);
    // }

    // if(!gridStates.has(room)) {
    //     const defaultState = [];
    //     for(let i = 0; i < height; i++) {
    //         for(let j = 0; j < width; j++) {
    //             defaultState[i][j] = ".";
    //         }
    //     }
    //     gridStates.set(room, defaultState);
    // }

    // const grid = gridStates.get(room);

    return (
        <main>
            <h1>Room: {room}</h1>

            <Board />

            <form method="post" encType="multipart/form-data">
                <label for="code">Upload file: </label>
                <input name="code" type="file"></input>
                <input type="submit"></input>
            </form>
        </main>
    );
} 