import React, { useState } from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { CALL_STATUS } from '../Status';

const UsersTableBody = ({error,users, setUsers,status}) => {
 const [deleteStatus, setDeleteStatus] =  useState(CALL_STATUS.IDLE);
 const [deleteError, setDeleteError] = useState(null);
 const [message, setMessage] = useState(null);

 const handleDelete = async (e, userId) => {
   e.preventDefault();
   try {
     setDeleteStatus(CALL_STATUS.LOADING);

     const res = await axios.delete(
       `/user/${userId}`,
       {},
       { withCredentials: true }
     );
     setMessage(res.data);
     const newUsers = users.filter((user) => user._id !== userId);
     setUsers(newUsers);
     setDeleteStatus(CALL_STATUS.SUCCESS);
   } catch (error) {
     console.log(error);
     setDeleteError(error);
     setDeleteStatus(CALL_STATUS.ERROR);
   }
 };

 const deleteStatusData = {
   isLoading: deleteStatus === CALL_STATUS.LOADING,
   isSuccess: deleteStatus === CALL_STATUS.SUCCESS,
   isError: deleteStatus === CALL_STATUS.ERROR,
 };

 if (deleteStatusData.isSuccess === true) {
   toast.warning(message, {
     position: "top-center",
   });
 }

 if (deleteStatusData.isError === true) {
   toast.error(deleteError, {
     position: "top-center",
   });
 }



  return (
    <>
      {status.isLoading && (
        <tr>
          <td className="text-center text-bold text-gray-900" colSpan={5}>
            Data is loading
          </td>
        </tr>
      )}
      {status.isError && (
        <tr>
          <td className="text-center text-bold text-red-600" colSpan={5}>
            {error}
          </td>
        </tr>
      )}
      {status.isSuccess && users.length < 1 ? (
        <tr>
          <th colSpan="4" className="w-full text-gray-600 text-center">
            No data...
          </th>
        </tr>
      ) : (
        users.map((user, index) => (
          <tr className="bg-white border-b" key={user._id}>
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              {++index}
            </th>
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              {user.username}
            </th>
            <td className="px-6 py-4 text-gray-900">{user.email}</td>
            <td className="px-6 py-4 text-gray-900">
              <img
                src={user.profilePicture}
                alt="profile picture"
                title={user.username}
                className=" h-10 w-10 block mx-auto rounded-full object-cover"
              />
            </td>
            <td className="px-6 py-4 text-gray-900">
              {user.activationStatus ? (
                <span className="bg-green-700 text-white p-1 rounded-sm shadow-lg">
                  Active
                </span>
              ) : (
                <span className="bg-red-600 text-white p-1 rounded-sm shadow-lg">
                  Inactive
                </span>
              )}
            </td>

            <td className="px-6 py-4">
              <div className="inline-flex gap-2  shadow-sm" role="group">
                <button
                  type="button"
                  className="inline-flex gap-1 items-center px-4 py-2 text-sm font-medium text-white bg-red-600  rounded-lg hover:bg-red-500 focus:z-10 focus:ring-2 focus:ring-red-700 focus:text-red-700"
                  onClick={(e) => handleDelete(e, user._id)}
                >
                  <svg
                    className="w-4 h-4 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </>
  );
};

export default UsersTableBody