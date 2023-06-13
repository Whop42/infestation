# fresh project

### Usage

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.


## each virus needs:

`code`: file uploaded with code in it
- needs getMove(gridState, position), getChar(), self.onmessage()
- messages to respond to:
```json
{
    type: "MOVE",
    gridState: [[abc, abc, abc], [abc]],
    position: (0, 0)
} -> {
    type: "MOVE",
    action: "MOVE_LEFT" // MOVE_direction, INFECT, SUICIDE
}
```
```json
{
    type: "CHAR"
} -> {
    type: "CHAR",
    char: "a"
}
```
