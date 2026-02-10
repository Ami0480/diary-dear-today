import React, { useState } from "react";
import { supabase } from "./supabase-client";

export default function NewDiary({ onClose }) {
  const [diaries, setDiaries] = useState([]);
  const [title, setTitle] = useState("");
  const [diary, setDiary] = useState("");

  const [diaryImage, setDiaryImage] = useState(null);

  const [diaryDate, setDiaryDate] = useState(
    new Date().toISOString().split(`T`)[0]
  );

  const addDiary = async () => {
    if (!title || !diary) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let imageUrl = null;
    if (diaryImage) {
      imageUrl = await uploadImage(diaryImage);
    }

    const { error } = await supabase
      .from("diaries")
      .insert([
        {
          title,
          diary,
          email: user.email,
          image_url: imageUrl,
          diary_date: diaryDate,
        },
      ])
      .select();

    if (error) {
      console.error("Error saving", error);
    } else {
      fetchDiaries();
      setTitle("");
      setDiary("");
      setDiaryImage(null);
      setDiaryDate(new Date().toISOString().split(`T`)[0]);
      onClose?.();
    }
  };

  const fetchDiaries = async () => {
    const { data, error } = await supabase
      .from("diaries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching", error);
    } else {
      setDiaries(data);
    }
  };

  const uploadImage = async (file) => {
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("diaries-images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image", error.message);
      return null;
    }

    const { data } = await supabase.storage
      .from("diaries-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setDiaryImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <input
          type="date"
          value={diaryDate}
          onChange={(e) => setDiaryDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          type="text"
          placeholder="Write your diary"
          value={diary}
          className="h-52 md:h-96"
          onChange={(e) => setDiary(e.target.value)}
        />

        <div className="flex gap-2">
          <label className="underline text-[#8dbbcc]">
            Choose file
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <span>{diaryImage ? diaryImage.name : "No file chosen"}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={addDiary}>
          Save
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setDiary("");
            onClose?.();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
