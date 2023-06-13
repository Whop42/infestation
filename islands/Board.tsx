type BoardProps = {
    content?: string[][]
}


export default function Board({ content = [[".", "."],[".", "."]] }: BoardProps) {
    const gridSize = content.length; // Assuming square grid

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
        >
            {content.map((row, rowIndex) => {
                return (
                    <div key={rowIndex}>
                        {row.map((value, colIndex) => (
                            <div
                                key={colIndex}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    boxSizing: "border-box",
                                    border: "1px solid black",
                                }}
                            >
                                {value}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}