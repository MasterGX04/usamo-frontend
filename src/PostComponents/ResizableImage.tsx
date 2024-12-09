import React, { useRef, useState } from "react";
import "./resizable-image.css";

interface ResizableImageProps {
    src: string;
    initialWidth: number;
    initialHeight: number;
    initialX: number;
    initialY: number;
    parentElement: HTMLElement | null;
    onUpdate: (width: number, height: number, x: number, y: number) => void;
    onDelete: () => void;
}

const ResizableImage: React.FC<ResizableImageProps> = ({
    src,
    initialWidth,
    initialHeight,
    initialX,
    initialY,
    parentElement,
    onUpdate,
    onDelete,
}) => {
    const imgRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: initialWidth, height: initialHeight });
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isSelected, setIsSelected] = useState(false);
    
    const handleResize = (e: React.MouseEvent, directions: { width: boolean; height: boolean }) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = dimensions.width;
        const startHeight = dimensions.height;
        const { x, y } = position;

        const onMouseMove = (event: MouseEvent) => {
            const newX = x + (event.clientX - startX);
            const newY = y + (event.clientY - startY);

            const newWidth = directions.width ? Math.max(50, startWidth + (event.clientX - startX)) : startWidth;
            const newHeight = directions.height ? Math.max(50, startHeight + (event.clientY - startY)) : startHeight;

            setDimensions({ width: newWidth, height: newHeight });
            onUpdate(newWidth, newHeight, newX, newY);
        }

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            //onUpdate(dimensions.width, dimensions.height, position.x, position.y);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleDrag = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;

        if (!parentElement) {
            console.error("Parent element not found!");
            return;
        }
        //console.log("Parent element:", parentElement);

        const parentBounds = parentElement.getBoundingClientRect(); 
        //console.log("Parent bounds:", parentBounds);

        const onMouseMove = (event: MouseEvent) => {
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;

            const newX = Math.min(
                Math.max(deltaX + position.x, parentBounds.left),
                parentBounds.left + parentBounds.width - dimensions.width
            );

            const newY = Math.min(
                Math.max(deltaY + position.y, parentBounds.top),
                parentBounds.top + parentBounds.height - dimensions.height
            );

            //console.log("Dragging to:", { newX, newY });

            setPosition({ x: newX, y: newY });
            onUpdate(dimensions.width, dimensions.height, newX, newY);
        };


        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            //onUpdate(dimensions.width, dimensions.height, position.x, position.y);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        //console.log("Key pressed:", e.key); Debugging

        if (e.key === "Delete" || e.key === "Backspace") {
            console.log("Delete key pressed, removing image"); // Debugging
            onDelete();
        }
    };

    const handleClick = () => {
        //console.log("Image clicked, setting focus");
        imgRef.current?.focus();
        setIsSelected(true);
    };

    const handleBlur = () => {
        setIsSelected(false);
    }

    return (
        <div
            ref={imgRef}
            className={`resizable-image-container ${isSelected ? "selected" : ""}`}
            style={{
                width: dimensions.width,
                height: dimensions.height,
                position: "absolute",
                left: position.x,
                top: position.y,
            }}
            onMouseDown={handleDrag}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onClick={handleClick}
            onBlur={handleBlur}
        >
            <img
                src={src}
                alt="Resizable"
                style={{ width: "100%", height: "100%" }}
            />
            {/* Right resize handle */}
            <div
                className="resize-handle right"
                onMouseDown={(e) => handleResize(e, { width: true, height: false })}
            ></div>
            {/* Bottom resize handle */}
            <div
                className="resize-handle bottom"
                onMouseDown={(e) => handleResize(e, { width: false, height: true })}
            ></div>
            {/* Corner resize handle (both width and height) */}
            <div
                className="resize-handle corner"
                onMouseDown={(e) => handleResize(e, { width: true, height: true })}
            ></div>
        </div>
    );
};

export default ResizableImage;
