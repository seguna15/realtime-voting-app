import React from 'react'
import { useDispatch } from 'react-redux';
import { candidateDelete } from '../redux/candidates/candidateSlice';



const CandidateTableBody = ({ data, handleFetchEdit }) => {
  const dispatch = useDispatch()
  const handleDelete = async (e, id) => {
    e.preventDefault();
    dispatch(candidateDelete(id));
  };

  return (
    <>
      {data.length < 1 && (
        <tr>
          <th colSpan="4" className="w-full text-gray-600 text-center">
            No data...
          </th>
        </tr>
      )}
      {data.length >= 1 &&
        data.map((candidate, index) => (
          <tr className="bg-white border-b" key={candidate._id}>
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
              {candidate.candidateName}
            </th>
            <td className="px-6 py-4 text-gray-900">
              {candidate.politicalParty}
            </td>

            <td className="px-6 py-4">
              <div className="inline-flex gap-2  shadow-sm" role="group">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600  rounded-lg hover:bg-blue-500 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
                  onClick={(e) => handleFetchEdit(e, candidate._id)}
                >
                  <svg
                    className="w-4 h-4 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z" />
                    <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z" />
                  </svg>
                  Edit
                </button>

                <button
                  type="button"
                  className="inline-flex gap-1 items-center px-4 py-2 text-sm font-medium text-white bg-red-600  rounded-lg hover:bg-red-500 focus:z-10 focus:ring-2 focus:ring-red-700 focus:text-red-700"
                  onClick={(e) => handleDelete(e, candidate._id)}
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
        ))}
    </>
  );
};

export default CandidateTableBody