import { ComponentChildren, JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

type MainProps = {
        title?: string;
        children: ComponentChildren;
}

export function Main({ title = "Infestation", children }: MainProps) {
  return (
    <>
        <head>
            <title>{title}</title>
            <meta charSet="UTF-8" />
            <meta name="description" content="Online programming game" />
            <meta name="keywords" content="Infestation, Programming, Game, Fresh" />
            <meta name="author" content="whop42" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body class="">
            {children}
        </body>
    </>
  );
}