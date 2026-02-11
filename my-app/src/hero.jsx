import React, { useState, useEffect } from "react";
import EditCard from "./edit-card";
import NewDiary from "./new-diary";
import { supabase } from "./supabase-client";

export default function () {
  const [diaries, setDiaries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDiary, setEditDiary] = useState("");
  const [editDiaryDate, setEditDiaryDate] = useState(null);
  const [showNewDiary, setShowNewDiary] = useState(false);

  const [newEditImage, setNewEditImage] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState(null);

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
          if (payload.new.email === user.email) {
            setDiaries((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDiaries = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("diaries")
      .select("*")
      .eq("email", user.email)
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

  const deleteImage = () => {
    setEditImageUrl(null);
    setNewEditImage(null);
  };

  return (
    <div className="m-10 md:mx-40">
      <div className="relative flex flex-col items-end mb-3 pt-10 md:items-center  md:mb-5">
        <button
          type="button"
          className="sign-out text-xl absolute right-0 top-0"
          onClick={handleSignout}
        >
          Sign out
        </button>
        <h1>Dear Today</h1>
      </div>

      <button
        type="button"
        onClick={() => setShowNewDiary(true)}
        className="new-button mb-3 flex md:hidden"
      >
        +
      </button>

      <div className="md:flex gap-10 items-start">
        <div className="hidden md:block md:w-[40%]">
          <NewDiary />
        </div>

        {showNewDiary && (
          <div className="fixed inset-0 z-50 md:hidden p-4 pt-10">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowNewDiary(false)}
            />
            <div className="relative z-10 bg-white rounded p-5 overflow-y-auto max-h-[85vh] w-full">
              <NewDiary onClose={() => setShowNewDiary(false)} />
            </div>
          </div>
        )}

        <div className="w-full md:w-[60%]">
          <input
            type="text"
            placeholder="Search diaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
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
                  <div className="md:flex justify-between">
                    <div className="md:flex-1 min-w-0">
                      <p>
                        {d.diary_date
                          ? new Date(d.diary_date).toLocaleDateString()
                          : "No date"}
                      </p>
                      <h2>{d.title}</h2>
                      <p className="display-diary break-word">{d.diary}</p>
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
