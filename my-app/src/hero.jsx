import React, { useState, useEffect } from "react";
import EditCard from "./edit-card";
import { supabase } from "./supabase-client";

export default function () {
  const [title, setTitle] = useState("");
  const [diary, setDiary] = useState("");
  const [diaries, setDiaries] = useState([]);

  const [diaryDate, setDiaryDate] = useState(
    new Date().toISOString().split(`T`)[0]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDiary, setEditDiary] = useState("");
  const [editDiaryDate, setEditDiaryDate] = useState(null);

  const [diaryImage, setDiaryImage] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState(null);
  const [newEditImage, setNewEditImage] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDiaries();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("diaries-channel");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "diaries" },
        (payload) => {
          setDiaries((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    }
  };

  const handleEdit = (d) => {
    console.log("Diary object:", d);
    console.log("Diary ID:", d.id);
    setEditId(d.id);
    setEditTitle(d.title);
    setEditDiary(d.diary);
    setEditImageUrl(d.image_url);
    setEditDiaryDate(d.diary_date || new Date().toISOString().split(`T`)[0]);
    setIsEditing(true);
  };

  const updateEdit = async () => {
    if (!editTitle || !editDiary) return;

    let imageUrl = editImageUrl;

    if (newEditImage) {
      imageUrl = await uploadImage(newEditImage);
    }

    const { error } = await supabase
      .from("diaries")
      .update({
        title: editTitle,
        diary: editDiary,
        image_url: imageUrl,
        diary_date: editDiaryDate,
      })
      .eq("id", editId);
    if (error) {
      console.error("Error updating", error);
    } else {
      fetchDiaries();
      setIsEditing(false);
      setNewEditImage(null);
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setDiaryImage(e.target.files[0]);
    }
  };

  const deleteImage = () => {
    setEditImageUrl(null);
    setNewEditImage(null);
  };

  return (
    <div className="mx-40">
      <div className="flex justify-center">
        <h1 className="font-serif text-5xl tracking-wide my-10 text-[#4a6378] flex justify-center">
          Dear Today
        </h1>
        <button
          type="button"
          className="sign-out mt-10 mb-12 absolute right-10 top-0 text-xl"
          onClick={handleSignout}
        >
          Sign out
        </button>
      </div>

      <div className="flex gap-16">
        <div className="my-10 flex flex-col gap-3 w-[40%]">
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
              className="h-96"
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
              }}
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="w-[60%]">
          <input
            type="text"
            placeholder="Search diaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mt-10"
          />

          {diaries
            .filter((d) => {
              if (!searchTerm) return true;

              const search = searchTerm.toLowerCase();
              return (
                d.title?.toLowerCase().includes(search) ||
                d.diary?.toLowerCase().includes(search) ||
                d.diary_date?.includes(searchTerm)
              );
            })

            .map((d) => {
              return (
                <div
                  key={d.id}
                  className="display-diaries border flex flex-col my-3 gap-3 overflow-hidden"
                >
                  <div className="flex justify-between">
                    <div className="flex-1 min-w-0">
                      <p>
                        {d.diary_date
                          ? new Date(d.diary_date).toLocaleDateString()
                          : "No date"}
                      </p>
                      <h2 className="font-serif text-3xl">{d.title}</h2>
                      <p className="font-sans whitespace-pre-wrap break-word">
                        {d.diary}
                      </p>
                    </div>
                    <div>
                      {d.image_url && (
                        <img
                          src={d.image_url}
                          style={{ height: 140 }}
                          className="rounded"
                        />
                      )}
                    </div>
                  </div>
                  <button type="button" onClick={() => handleEdit(d)}>
                    Edit
                  </button>
                </div>
              );
            })}

          {isEditing && (
            <EditCard
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editDiary={editDiary}
              setEditDiary={setEditDiary}
              editImageUrl={editImageUrl}
              setNewEditImage={setNewEditImage}
              deleteImage={deleteImage}
              editDiaryDate={editDiaryDate}
              setEditDiaryDate={setEditDiaryDate}
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
