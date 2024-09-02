import React, { useCallback, useState } from "react";
import styles from "./App.module.scss";

export function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState<number>(800);
  const [opacity, setOpacity] = useState<number>(1);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file && file.type.startsWith("image/")) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setImageSrc(img.src);
        setImageWidth(img.width);
        window.electron.resizeWindow(img.width);
      };
    }
  }, []);

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const closeImage = () => {
    setImageSrc(null);
    setImageWidth(800);
    setOpacity(1);
    window.electron.resizeWindow(800);
  };

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newOpacity = parseFloat(event.target.value);
    // Ensure opacity is not below 0.2
    newOpacity = Math.max(newOpacity, 0.2);
    setOpacity(newOpacity);
    window.electron.setOpacity(newOpacity);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      style={{ width: "100%", opacity }}
      className={`${styles.container} ${imageSrc ? styles.imagePresent : ""}`}
    >
      {imageSrc ? (
        <div style={{ width: "100%", position: "relative" }}>
          <button onClick={closeImage} className={styles.closeButton}>
            閉じる
          </button>
          <div className={styles.scrollContainer}>
            <img
              src={imageSrc}
              alt="ドラッグされた画像"
              style={{ width: "100%", display: "block" }}
            />
          </div>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.1"
            value={opacity}
            onChange={handleOpacityChange}
            className={styles.opacitySlider}
          />
          <div className={styles.sliderLabel}>
            透明度: {(opacity * 100).toFixed(0)}%
          </div>
        </div>
      ) : (
        <p>ここに画像をドラッグアンドドロップしてください。</p>
      )}
    </div>
  );
}
