import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";

import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { username } = useParams();

  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

  const isMyProfile = authUser?._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following.includes(user?._id);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
<<<<<<< HEAD
    <div className="flex-[4_4_0] mt-16 border-r border-gray-700 min-h-screen w-full max-w-xl mx-auto px-2 sm:px-4">
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />} 
      {!isLoading && !isRefetching && !user && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      {!isLoading && !isRefetching && user && (
        <>
          <div className="flex gap-4 px-4 py-2 items-center">
            <Link to="/homepage">
              <FaArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <div className="flex flex-col">
              <p className="font-bold text-lg sm:text-xl">{user?.fullName}</p>
              <span className="text-sm text-slate-500">{POSTS?.length} posts</span>
            </div>
          </div>
          <div className="relative group/cover">
            <img
              src={coverImg || user?.coverImg || "/cover.png"}
              className="h-40 sm:h-52 w-full object-cover"
              alt="cover"
            />
            {isMyProfile && (
              <div
                className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                onClick={() => coverImgRef.current.click()}
              >
                <MdEdit className="w-5 h-5 text-white" />
=======
    <>
      <Helmet>
        <title>Profile Page | Snapzy </title>
      </Helmet>
      <div className="flex-[4_4_0] mt-16 border-r border-gray-700 min-h-screen w-full max-w-xl mx-auto px-2 sm:px-4">
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        {!isLoading && !isRefetching && user && (
          <>
            <div className="flex gap-4 px-4 py-2 items-center">
              <Link to="/">
                <FaArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <div className="flex flex-col">
                <p className="font-bold text-lg sm:text-xl">{user?.fullName}</p>
                <span className="text-sm text-slate-500">{POSTS?.length} posts</span>
>>>>>>> b18e720 (Helmet Dynamic added)
              </div>
            </div>
            <div className="relative group/cover">
              <img
                src={coverImg || user?.coverImg || "/cover.png"}
                className="h-40 sm:h-52 w-full object-cover"
                alt="cover"
              />
              {isMyProfile && (
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center px-4 mt-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                <img
                  src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
                  className="w-full h-full object-cover"
                />
              </div>
              {isMyProfile && <EditProfileModal authUser={authUser} />}
            </div>
            <div className="px-4 mt-4">
              <p className="font-bold text-lg">{user?.fullName}</p>
              <p className="text-sm text-slate-500">@{user?.username}</p>
              <p className="text-sm my-1">{user?.bio}</p>
            </div>
            <div className="px-4 mt-4 flex gap-2">
              <div className="flex gap-2 items-center">
                <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-500">{memberSinceDate}</span>
              </div>
            </div>
            <div className="flex w-full border-b border-gray-700 mt-4">
              <div
                className={`flex justify-center flex-1 p-3 text-sm sm:text-base cursor-pointer ${feedType === "posts" ? "border-b-2 border-primary" : "text-slate-500"}`}
                onClick={() => setFeedType("posts")}
              >
                Posts
              </div>
              <div
                className={`flex justify-center flex-1 p-3 text-sm sm:text-base cursor-pointer ${feedType === "likes" ? "border-b-2 border-primary" : "text-slate-500"}`}
                onClick={() => setFeedType("likes")}
              >
                Likes
              </div>
            </div>
            <Posts feedType={feedType} username={username} userId={user?._id} />
          </>
        )}
      </div>
    </>
  );
};
export default ProfilePage;
