import { PageProps } from "https://deno.land/x/fresh@1.1.6/server.ts";

export default function Greeting(props: PageProps) {
    const { name } = props.params;
    return (
        <main>
            <h1>hi, {name}!</h1>
        </main>
    );
    }