import React from "react";

export default function () {
  return (
    <div className="mx-40 my-20">
      <h1 className="font-serif text-5xl tracking-wide text-[#4a6378]">
        Dear Today
      </h1>
      <div className="flex flex-col">
        <input type="text" placeholder="Title" className="font-sans text-3xl" />
        <input
          type="text"
          placeholder="Write your diary"
          className="font-sans text-3xl"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="font-sans text-3xl w-32 bg-[#8dbbcc] text-white "
        >
          Save
        </button>
        <button
          type="button"
          className="font-sans text-3xl w-32 bg-[#8dbbcc] text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
