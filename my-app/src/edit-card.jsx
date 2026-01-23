import React from "react";

export default function EditCard({
  editTitle,
  setEditTitle,
  editDiary,
  setEditDiary,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="edit-diaries border flex flex-col my-10 gap-3 bg-white">
        <input
          type="text"
          value={editTitle}
          className="font-serif text-3xl"
          onChange={(e) => setEditTitle(e.target.value)}
        />

        <textarea
          value={editDiary}
          className="font-sans whitespace-pre-wrap"
          onChange={(e) => setEditDiary(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            type="button"
            className="font-sans text-3xl w-32 bg-[#8dbbcc] text-white rounded"
          >
            Update
          </button>
          <button
            type="button"
            className="font-sans text-3xl w-32 bg-[#8dbbcc] text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
