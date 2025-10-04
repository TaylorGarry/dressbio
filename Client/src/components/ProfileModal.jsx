import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ProfileModal = ({ onLogout, toggle }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [preview, setPreview] = useState(null);

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated!");
      toggle();
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white shadow-md border rounded z-50 p-4">
      <h3 className="font-bold mb-2">Profile</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="file"
          {...register("avatar")}
          onChange={(e) =>
            e.target.files[0] ? setPreview(URL.createObjectURL(e.target.files[0])) : null
          }
        />
        {preview && <img src={preview} alt="preview" className="w-16 h-16 rounded mt-2" />}
        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
      <button
        onClick={onLogout}
        className="w-full mt-2 bg-red-600 text-white py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileModal;
