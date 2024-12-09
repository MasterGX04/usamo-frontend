import axios from "axios";
import React, { useRef, useState } from "react";
import './create-post.css';

interface Post {
    id?: number;
    username: string;
    title: string;
    content: string;
}

interface CreatePostProps {
    currentUser: string;
    onCancel: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onCancel }) => {
    const [post, setPost] = useState<Post>({ username: currentUser, title: '', content: '' });
    const [images, setImages] = useState<
        { src: string; width: number; height: number; x: number; y: number }[]
    >([]);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        if (contentRef.current) {
            const content = contentRef.current.innerHTML;

            const clone = contentRef.current.cloneNode(true) as HTMLDivElement;
            clone.style.position = "absolute";
            clone.style.visibility = "hidden";
            clone.style.height = "auto";
            clone.style.maxHeight = "none";
            clone.style.overflow = "visible";
            document.body.appendChild(clone);
            const textHeight = clone.scrollHeight;
            
            document.body.removeChild(clone);

            const images = contentRef.current.querySelectorAll("img") || [];
            const totalImageHeight = Array.from(images).reduce((sum, img) => {
                const imageBounds = img.getBoundingClientRect();
                return contentRef.current
                    ? Math.max(sum, imageBounds.bottom - contentRef.current.getBoundingClientRect().top)
                    : sum;
            }, 0);
            //console.log(`total image height: ${totalImageHeight}`);

            const calculatedHeight = Math.min(
                Math.max(textHeight, totalImageHeight),
                700
            );

            const currentHeight = parseInt(contentRef.current.style.height || "0", 10);
            if (calculatedHeight !== currentHeight) {
                contentRef.current.style.height = `${calculatedHeight}px`;
            }

            setPost({ ...post, content });
        }
    };

    const initResize = (e: MouseEvent, img: HTMLImageElement, direction: string) => {
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = img.offsetWidth;
        const startHeight = img.offsetHeight;

        const handleResize = (event: MouseEvent) => {
            let newWidth = startWidth;
            let newHeight = startHeight;

            if (direction.includes("right")) {
                newWidth = Math.max(50, startWidth + (event.clientX - startX));
            }
            if (direction.includes("left")) {
                newWidth = Math.max(50, startWidth - (event.clientX - startX));
            }
            if (direction.includes("bottom")) {
                newHeight = Math.max(50, startHeight + (event.clientY - startY));
            }
            if (direction.includes("top")) {
                newHeight = Math.max(50, startHeight - (event.clientY - startY));
            }

            img.style.width = `${newWidth}px`;
            img.style.height = `${newHeight}px`;
            handleInput();
        };

        const stopResize = () => {
            document.removeEventListener("mousemove", handleResize);
            document.removeEventListener("mouseup", stopResize);
        };


        document.addEventListener("mousemove", handleResize);
        document.addEventListener("mouseup", stopResize);
    }

    const initDrag = (e: MouseEvent, wrapper: HTMLElement) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;

        const rect = wrapper.getBoundingClientRect();
        const offsetX = startX - rect.left;
        const offsetY = startY - rect.top;

        const handleDrag = (event: MouseEvent) => {
            const parentBounds = contentRef.current?.getBoundingClientRect();
            if (!parentBounds) return;


            const newX = Math.max(
                Math.min(event.clientX - parentBounds.left - offsetX, parentBounds.width - rect.width),
                0
            );

            const newY = Math.max(
                Math.min(event.clientY - parentBounds.top - offsetY, parentBounds.height - rect.height),
                0
            );

            wrapper.style.left = `${newX}px`;
            wrapper.style.top = `${newY}px`;
        };

        const stopDrag = () => {
            document.removeEventListener("mousemove", handleDrag);
            document.removeEventListener("mouseup", stopDrag);
        }

        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", stopDrag);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const items = e.clipboardData.items;

        if (!contentRef.current) return;

        for (const item of items) {
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.result) {
                            const wrapper = document.createElement("div");
                            wrapper.style.position = "absolute";
                            wrapper.style.display = "inline-block";
                            wrapper.style.border = "2px solid transparent";
                            wrapper.tabIndex = 0;

                            const img = document.createElement("img");
                            img.src = reader.result as string;
                            img.style.maxWidth = "100%";
                            img.style.height = "auto";
                            img.style.resize = "both";
                            img.style.display = "block";
                            //img.style.position = "relative";
                            img.style.border = "2px solid transparent";
                            img.contentEditable = "false";
                            img.draggable = true;

                            wrapper.addEventListener("click", () => {
                                contentRef.current
                                    ?.querySelectorAll("div[tabindex]")
                                    .forEach((div) => {
                                        (div as HTMLElement).style.border = "2px solid transparent";
                                    });
                                //wrapper.style.border = "2px solid blue";

                                const handleKeyDown = (event: KeyboardEvent) => {
                                    if (event.key === "Delete" || event.key === "Backspace") {
                                        wrapper.remove();
                                        document.removeEventListener("keydown", handleKeyDown);
                                        handleInput();
                                    }
                                };

                                document.addEventListener("keydown", handleKeyDown);
                            });

                            ["top-left", "top-right", "bottom-left", "bottom-right"].forEach((direction) => {
                                const handle = document.createElement("div");
                                handle.className = `resize-handle ${direction}`;
                                handle.addEventListener('mousedown', (event) =>
                                    initResize(event, img, direction)
                                );
                                wrapper.appendChild(handle);
                            });

                            wrapper.addEventListener("mousedown", (e) => {
                                if (e.target === img || e.target === wrapper) initDrag(e, wrapper);
                            });

                            wrapper.appendChild(img);
                            contentRef.current?.appendChild(wrapper);

                            handleInput();
                        }
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                // Allow other types of pasted content (e.g., text)
                const text = e.clipboardData.getData("text");
                document.execCommand("insertText", false, text);
                handleInput();
            }
        }
    };

    const initResizeBox = (e: React.MouseEvent) => {
        e.preventDefault();
        const startY = e.clientY;
        const startHeight = contentRef.current?.offsetHeight || 0;

        const handleMouseMove = (event: MouseEvent) => {
            const newHeight = Math.max(startHeight + (event.clientY - startY), 100); // Minimum 100px
            if (contentRef.current) {
                contentRef.current.style.height = `${newHeight}px`;
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Post to submit:", post);
            const response = await axios.post('http://localhost:8080/api/posts/create-post', {
                post,
                images,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                console.log('Post created successfully:', response);
                setPost({ username: currentUser, title: '', content: '' }); // Reset form
                setImages([]);
                onCancel();
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
        }

    };

    return (
        <form className="create-post-form" onSubmit={handleSubmit}>
            <input
                className="create-post-input"
                type="text"
                name="username"
                value={post.username}
                disabled
            />
            <input
                className="create-post-input"
                type="text"
                name="title"
                placeholder="Post title"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                required
            />
            <div
                className="create-post-textarea"
                contentEditable
                ref={contentRef}
                onInput={handleInput}
                onPaste={handlePaste}
                style={{
                    maxHeight: "700px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: "10px",
                    position: "relative",
                    minHeight: "100px",
                    resize: 'none',
                }}
            >
            </div>
            <button
                className="box-resize-handle"
                onMouseDown={(e) => initResizeBox(e)}
                aria-label="Resize"
            ></button>
            <button className="create-post-button" type="submit">
                Create Post
            </button>
            <button
                className="create-post-cancel-button"
                type="button"
                onClick={onCancel}
            >
                Cancel
            </button>
        </form>
    );
};

export default CreatePost;