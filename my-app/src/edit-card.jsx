import React from "react";

export default function EditCard({
  editTitle,
  setEditTitle,
  editDiary,
  setEditDiary,
  updateEdit,
  cancelEdit,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="edit-diaries border flex flex-col my-10 gap-3 bg-white">
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

        <div className="flex gap-2">
          <button type="button" onClick={updateEdit}>
            Update
          </button>
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
