import React, { useState } from "react";

export default function () {
  const [title, setTitle] = useState("");
  const [diary, setDiary] = useState("");
  const [diaries, setDiaries] = useState([]);

  const addDiary = async () => {
    if (!title || !diary) return;

    setDiaries([...diaries, { title, diary }]);

    setTitle("");
    setDiary("");
  };

  return (
    <div className="mx-40">
      <h1 className="font-serif text-5xl tracking-wide my-10 text-[#4a6378] flex justify-center">
        Dear Today
      </h1>
      <div className="flex gap-16">
        <div className="my-10 flex flex-col gap-3 w-[40%]">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              className="font-sans"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Write your diary"
              value={diary}
              className="font-sans h-96"
              onChange={(e) => setDiary(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="font-sans text-3xl w-32 bg-[#8dbbcc] text-white"
              onClick={addDiary}
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

        <div className="w-[60%]">
          {diaries.map((d, index) => (
            <div
              key={index}
              className="display-diaries border flex flex-col my-10 gap-3"
            >
              <h2 className="font-serif text-3xl">{d.title}</h2>
              <p className="font-sans">{d.diary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
