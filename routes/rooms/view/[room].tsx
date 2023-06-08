import { PageProps } from "https://deno.land/x/fresh@1.1.6/server.ts";
import { Button } from "../../../components/Button.tsx";

export default function Room(props: PageProps) {
    const { room } = props.params;
    return (
        <main>
            <h1 class="">Room: {room}</h1>

            <Button>Upload File</Button>
        </main>
    );
    }