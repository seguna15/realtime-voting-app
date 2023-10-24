import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from '../firebase';
import axios from 'axios';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOut, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';

const Profile = () => {
  const {currentUser, loading, error, success} = useSelector(state => state.user);
  const [image, setImage] = useState(undefined);
  const [visible, setVisible] = useState();
  const fileRef= useRef(null);
  const [imagePercent , setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  
  const dispatch = useDispatch();

  //to upload image 
  const handleImageUpload = async (image) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + image.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImagePercent(Math.round(progress));
        },
        (error) => {
        setImageError(true);
        },
        async ()=> {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({...formData, profilePicture:downloadURL});
        }
      );
      
  }


  useEffect(()=> {
    if(image) {
      handleImageUpload(image)
    }
  },[image])


  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await axios.put(`/user/${currentUser._id}`, formData, {withCredentials: true});
      const {data} = res;
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  }

  const handleDeleteAccount = async () => {
   
    try {
      dispatch(deleteUserStart())
      await axios.delete(`/user/${currentUser._id}`, {}, {withCredentials: true});
      localStorage.removeItem("authToken");
      dispatch(deleteUserSuccess())
    } catch (error) {
      dispatch(deleteUserFailure())
    }
  }

  const handleSignOut =  async () => {
    try {
      await axios.post(`/auth/logout`, {}, {
        withCredentials: true,
      });
      localStorage.removeItem("authToken")
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt="profile"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{`Uploading: ${imagePercent}% `}</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : null}
        </p>
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <div className="relative">
          <input
            type={visible ? "text" : "password"}
            id="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-3 w-full"
            onChange={handleChange}
          />
          <div className="absolute top-4 right-2">
            {visible ? (
              <FaEye onClick={(e) => setVisible(!visible)} />
            ) : (
              <FaEyeSlash onClick={(e) => setVisible(!visible)} />
            )}
          </div>
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "loading..." : "update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteAccount} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
      <p className="text-green-700 mt-5">
        {success && "User updated successfully"}
      </p>
    </section>
  );
}

export default Profile