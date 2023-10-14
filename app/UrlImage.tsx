"use client";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Image } from "react-konva";
type Ref = Konva.Image;
const URLImage = forwardRef<
  Ref,
  {
    src: string;
    width?: number;
    height?: number;
    name?: string;
    x?: number;
    y?: number;
    scaleX?: number;
    scaleY?: number;
    onClick?: (evt: KonvaEventObject<MouseEvent>) => void;
    draggable?: boolean;
    onDragEnd?: (evt: KonvaEventObject<DragEvent>) => void;
  }
>(
  (
    {
      src,
      width = undefined,
      height = undefined,
      name,
      x = 0,
      y = 0,
      onClick,
      scaleX = 1,
      scaleY = 1,
      onDragEnd,
      draggable = false,
    },
    ref
  ) => {
    const imageRef = useRef(null);
    const [image, setImage] = useState<any>(null);

    const loadImage = () => {
      const img = new window.Image();
      img.src = src;
      img.crossOrigin = "Anonymous";
      // @ts-ignore
      imageRef.current = img;
      // @ts-ignore
      imageRef.current.addEventListener("load", handleLoad);
    };

    const handleLoad = () => {
      setImage(imageRef.current);
    };

    useEffect(() => {
      loadImage();
      return () => {
        if (imageRef.current) {
          // @ts-ignore
          imageRef.current.removeEventListener("load", handleLoad);
        }
      };
    }, []);

    useEffect(() => {
      loadImage();
    }, [src]);

    return (
      <Image
        ref={ref}
        draggable={draggable}
        width={width}
        height={height}
        name={name}
        x={x}
        y={y}
        scaleX={scaleX}
        scaleY={scaleY}
        onClick={onClick}
        onTransform={() => {
          console.log("transformed");
        }}
        onDragEnd={onDragEnd}
        image={image}
      />
    );
  }
);

export default URLImage;
