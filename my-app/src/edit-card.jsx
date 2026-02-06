import React, { useState } from "react";

export default function EditCard({
  editTitle,
  setEditTitle,
  editDiary,
  setEditDiary,
  editImageUrl,
  setNewEditImage,
  deleteImage,
  editDiaryDate,
  setEditDiaryDate,
  updateEdit,
  cancelEdit,
  deleteDiary,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewEditImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="edit-diaries border flex flex-col my-10 gap-3 bg-white">
        <input
          type="date"
          value={editDiaryDate}
          onChange={(e) => setEditDiaryDate(e.target.value)}
        />
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />
        <textarea
          value={editDiary}
          className="whitespace-pre-wrap"
          onChange={(e) => setEditDiary(e.target.value)}
        />

        <div className="flex flex-col">
          {(previewUrl || editImageUrl) && (
            <div>
              <img
                src={previewUrl || editImageUrl}
                style={{ height: 140 }}
                className="rounded"
              />
            </div>
          )}
          <div className="flex gap-3">
            <label className="underline text-sm">
              {editImageUrl ? "Change Image" : "Add Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {(editImageUrl || previewUrl) && (
              <label
                className="underline text-sm"
                onClick={() => {
                  deleteImage();
                  setPreviewUrl(null);
                }}
              >
                Delete Image
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={updateEdit}>
            Update
          </button>
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        </div>

        <div>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="delete-button"
            >
              Delete
            </button>
          ) : (
            <div>
              <p className="my-2 text-sm">
                Are you sure you want to delete this diary?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={deleteDiary}
                  className="delete-button"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
