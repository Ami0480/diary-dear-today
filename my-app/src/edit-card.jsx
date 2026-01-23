import React from "react";

export default function EditCard() {
  return (
    <div>
      <div className="edit-diaries border flex flex-col my-10 gap-3">
        <h2 className="font-serif text-3xl">title</h2>
        <p className="font-sans whitespace-pre-wrap">dairy</p>
        <button
          type="button"
          className="font-sans text-3xl w-32 bg-[#8dbbcc] text-white rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
}
