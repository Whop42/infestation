type BoardProps = {
    content?: string[][]
}

function game(roomName: string) {
    const room: RoomType = rooms.find((room: RoomType) => room.name === roomName);
    const randomizedArray: string[][] = room.gridState.map(row => row.map(value => String.fromCharCode(Math.floor(Math.random() * 26) + 97)));
    room.gridState = randomizedArray;
}

export default function Board({ content = [[".", "."],[".", "."]] }: BoardProps) {
    const gridSize = content.length; // Assuming square grid

    setInterval(game, 100);

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: "10px",
                maxHeight: "100vh",
                overflow: "auto",
            }}
        >
            {content.map((row, rowIndex) => {
                return (
                    <div key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <pre
                                key={colIndex}
                                style={{
                                    margin: 0,
                                }}
                            >
                                {value}
                            </pre>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
