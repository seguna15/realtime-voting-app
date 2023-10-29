import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header';
import UsersTableBody from '../../../components/UsersTableBody';
import useAxiosFetch from '../../../hooks/useAxiosFetch';

const UsersPage = () => {

    const [users, setUsers] = useState([]);
    const {data, fetchError, statusObj } = useAxiosFetch('/user');
    useEffect(() => {
      setUsers(data);
    },[data])


  return (
    <>
      <Header />
      <main className="relative overflow-x-auto mt-5">
        <table className="w-[600px] mx-auto text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Profile Picture
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className=" flex justify-center px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <UsersTableBody
              error={fetchError}
              users={users}
              setUsers={setUsers}
              status={statusObj}
              
            />
          </tbody>
        </table>
      </main>
    </>
  );
}

export default UsersPage