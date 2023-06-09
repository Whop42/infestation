import { Handlers, PageProps } from "https://deno.land/x/fresh@1.1.6/server.ts";
import Board  from "../../islands/Board.tsx";
import { MultipartReader } from "https://deno.land/std@0.84.0/mime/mod.ts";
import { multiParser, Form, FormFile } from 'https://deno.land/x/multiparser@0.114.0/mod.ts'
import { CatchClause } from "https://deno.land/x/ts_morph@17.0.1/ts_morph.js";
import { useEffect } from "https://esm.sh/v118/preact@10.13.1/hooks/src/index.js";

let data = new Map<string, Array<string>>();
let gridStates = new Map<string, string[][]>();
let workers = new Map<string, Map<string, Worker>>();

let rooms = new Array<Room>();

type RoomType = {
    name: string,
    files: CodeFile[],
    workers: Worker[],
    gridState: string[][]
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

        // TODO: make a form for this instead?
        runWorkers(roomName);

        return new Response(null, {
            status: 303,
            headers: {
                roomData: JSON.stringify(room),
                location: "/rooms/" + roomName
            }
          });
    }
}

function initBoard(roomName: string): void {
    const room: RoomType = rooms.find((room) => room.name === roomName);

    let gridState: Array<Array<string>> = [];
    for(let i = 0; i < height; i++) {
        gridState[i] = [];
        for(let j = 0; j < width; j++) {
            gridState[i][j] = "_";
        }
    }

    room.gridState = gridState;
}

function createWorkers(roomName: string) {
    const room = rooms.find((room) => room.name === roomName);

    const roomWorkers = room.workers;
    const roomFiles = room.files;

    roomFiles.forEach(async (file: CodeFile) => {

        const text = await file.file.text()

        const worker: Worker = new Worker(URL.createObjectURL(new Blob([text], {type: "application/typescript"})), {type: "module"});
        roomWorkers.push(worker);
    })
}

function runWorkers(roomName: string): string[][] | undefined {
    const room: RoomType = rooms.find((room: RoomType) => room.name === roomName)
    const roomWorkers: Worker[] = room.workers;
    let gridState: string[][] = room.gridState;

    roomWorkers?.forEach((worker: Worker) => {
        console.log("running " + roomWorkers.indexOf(worker));



    });

    return gridState;
}

function ensureRoom(roomName: string) {
    if(!rooms.find((room) => room.name === roomName)) {
        const newRoom = {
            name: roomName,
            files: new Array<File>(),
            workers: new Array<Worker>(),
            gridState: new Array<Array<string>>(),
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

    if(room.gridState?.length < height) {
        initBoard(roomName);
    }

    return (
        <main>
            <h1>Room: {roomName}</h1>

            <Board content={room.gridState}/>

            <form method="post" encType="multipart/form-data">
   
                <label for="code">Upload file: </label>
                <input name="code" type="file" accept=".ts"></input>
                <input type="submit" name="submit" value="submit"></input>
            </form>
            <br />
            <div>
                {JSON.stringify(room)}
            </div>
        </main>
    );
} 