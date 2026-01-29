import React, { useState, useEffect } from "react";
import EditCard from "./edit-card";
import { supabase } from "./supabase-client";

export default function () {
  const [title, setTitle] = useState("");
  const [diary, setDiary] = useState("");
  const [diaries, setDiaries] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDiary, setEditDiary] = useState("");

  useEffect(() => {
    fetchDiaries();
  }, []);

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

  const addDiary = async () => {
    if (!title || !diary) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("diaries")
      .insert([{ title, diary, email: user.email }])
      .select();

    if (error) {
      console.error("Error saving", error);
    } else {
      fetchDiaries();
      setTitle("");
      setDiary("");
    }
  };

  const handleEdit = (d) => {
    console.log("Diary object:", d);
    console.log("Diary ID:", d.id);
    setEditId(d.id);
    setEditTitle(d.title);
    setEditDiary(d.diary);
    setIsEditing(true);
  };

  const updateEdit = async () => {
    if (!editTitle || !editDiary) return;

    const { error } = await supabase
      .from("diaries")
      .update({ title: editTitle, diary: editDiary })
      .eq("id", editId);
    if (error) {
      console.error("Error updating", error);
    } else {
      fetchDiaries();
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const deleteDiary = async () => {
    const { error } = await supabase.from("diaries").delete().eq("id", editId);

    if (error) {
      console.error("Error deleting", error);
    } else {
      fetchDiaries();
      setIsEditing(false);
    }
  };

  const handleSignout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="mx-40">
      <div className="flex justify-center">
        <h1 className="font-serif text-5xl tracking-wide my-10 text-[#4a6378] flex justify-center">
          Dear Today
        </h1>
        <button
          type="button"
          className="sign-out mt-10 mb-12 absolute right-10 top-0"
          onClick={handleSignout}
        >
          Sign out
        </button>
      </div>

      <div className="flex gap-16">
        <div className="my-10 flex flex-col gap-3 w-[40%]">
          <div className="flex flex-col gap-3">
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
              className="h-96"
              onChange={(e) => setDiary(e.target.value)}
            />
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
              }}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="w-[60%]">
          {diaries.map((d) => (
            <div
              key={d.id}
              className="display-diaries border flex flex-col my-10 gap-3"
            >
              <h2 className="font-serif text-3xl">{d.title}</h2>
              <p className="font-sans whitespace-pre-wrap">{d.diary}</p>
              <button type="button" onClick={() => handleEdit(d)}>
                Edit
              </button>
            </div>
          ))}

          {isEditing && (
            <EditCard
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editDiary={editDiary}
              setEditDiary={setEditDiary}
              updateEdit={updateEdit}
              cancelEdit={cancelEdit}
              deleteDiary={deleteDiary}
            />
          )}
        </div>
      </div>
    </div>
  );
}
