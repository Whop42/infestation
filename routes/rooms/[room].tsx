import { Handlers, PageProps } from "https://deno.land/x/fresh@1.1.6/server.ts";
import Board  from "../../islands/Board.tsx";
import { MultipartReader } from "https://deno.land/std@0.84.0/mime/mod.ts";
import { multiParser, Form, FormFile } from 'https://deno.land/x/multiparser@0.114.0/mod.ts'
import { CatchClause } from "https://deno.land/x/ts_morph@17.0.1/ts_morph.js";

let data = new Map<string, Array<string>>();
let gridStates = new Map<string, string[][]>();
let workers = new Map<string, Map<string, Worker>>();

let rooms = new Array<Room>();

type RoomType = {
    name: string,
    files: CodeFile[],
    workers: Worker[],
}

type CodeFile = {
    file: File,
    uploadDate: number
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

        // get room from headers (scary)
        const roomName: string = req.url.split("/").at(-1);

        ensureRoom(roomName);

        const room: RoomType = rooms.find((room) => room.name === roomName);

        const roomFiles: Array<CodeFile> = room.files;

        if(!roomFiles.find((f) => f.file == file)) {
            const code: CodeFile = {
                file: file,
                uploadDate: Date.now()
            }
            roomFiles.push(code);
        }

        createWorkers(roomName);

        return new Response(null, {
            status: 303,
            headers: {
                roomData: JSON.stringify(room),
                location: "/rooms/" + roomName
            }
          });
    }
}

function createWorkers(roomName: string) {
    const room = rooms.find((room) => room.name === roomName);

    const roomWorkers = room.workers;
    const roomFiles = room.files;

    roomFiles.forEach(async (file: CodeFile) => {

        const text = await file.file.text()

        const worker = new Worker(URL.createObjectURL(new Blob([text], {type: "application/typescript"})), {type: "module"});
        roomWorkers.push(worker);
        try {
            worker.postMessage({type: "ATTACK"});
        } catch(error) {
            console.log("oops");
        }
    })
}

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

function ensureRoom(roomName: string) {
    if(!rooms.find((room) => room.name === roomName)) {
        const newRoom = {
            name: roomName,
            files: new Array<File>(),
            workers: new Array<Worker>(),
        }

        rooms.push(newRoom);
    }
}

export default function Room(props: PageProps) {
    const { roomName } = props.params;

    ensureRoom(roomName);

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

    const room: RoomType = rooms.find((room: RoomType) => room.name === roomName);

    return (
        <main>
            <h1>Room: {roomName}</h1>

            <Board />

            <form method="post" encType="multipart/form-data">
                <label for="code">Upload file: </label>
                <input name="code" type="file" accept=".ts"></input>
                <input type="submit" name="submit" value="submit"></input>
            </form>
            <br />
            <div>
                {JSON.stringify(rooms)}
            </div>
        </main>
    );
} 