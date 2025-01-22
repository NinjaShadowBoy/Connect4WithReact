
type SquareProps = {
    color: string;
}

export default function Square({ color }: SquareProps) {

    return (
        <div style={{
            width: "2rem",
            height: "2rem",
            margin: "2px",
            backgroundColor: color,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "3px solid blue"
        }}></div>
    )
}