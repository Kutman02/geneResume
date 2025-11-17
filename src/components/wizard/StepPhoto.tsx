import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { useResume } from "../../context/ResumeContext";
import { getCroppedImg } from "../../utils/cropImage";

interface StepPhotoProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepPhoto({ onNext, onBack }: StepPhotoProps) {
  const { state, dispatch } = useResume();

  const [imageSrc, setImageSrc] = useState<string | null>(state.photoDataUrl);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Загружаем фото
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  const onCropComplete = useCallback((_: any, croppedAreaPx: any) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  async function handleApply() {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

    dispatch({
      type: "UPDATE_FIELD",
      field: "photoDataUrl",
      value: croppedImage
    });

    onNext();
  }

  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-bold">Фото</h2>

      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="block w-full border p-2 rounded"
      />

      {imageSrc && (
        <div className="relative w-full h-[350px] bg-black/20 rounded overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1 / 1} // квадрат
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}

      {imageSrc && (
        <div className="flex gap-4 items-center">
          <label className="font-medium">Zoom:</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded border bg-gray-100 hover:bg-gray-200"
        >
          Назад
        </button>

        <button
          type="button"
          disabled={!imageSrc}
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-40"
        >
          Применить →
        </button>
      </div>
    </div>
  );
}
