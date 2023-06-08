import { Handlers, PageProps } from "https://deno.land/x/fresh@1.1.6/server.ts";
import { Button } from "../../../components/Button.tsx";

export const handler: Handlers = {
    async POST(req, ctx) {
        const form = await req.formData();
        const codeFile = form.get("")
    }
}