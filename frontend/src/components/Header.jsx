import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

const Header = () => {
  const {currentUser} = useSelector(state => state.user);
  return (
    <header className="bg-gray-800 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold">Realtime Voting App</h1>
        <ul className="flex flex-col md:flex-row gap-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>

          {!currentUser && (
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
          )}

          {currentUser && currentUser.role === "User" ? (
            <>
              <li>
                <Link to="/vote">Vote</Link>
              </li>
              <li>
                <Link to="/profile">
                  <img
                    src={currentUser.profilePicture}
                    alt="profile"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                </Link>
              </li>
            </>
          ) : null}

          {currentUser && currentUser.role === "Admin" ? (
            <>
              <li>
                <Link to="/admin/candidates">Candidates</Link>
              </li>
              <li>
                <Link to="/admin/result">Result</Link>
              </li>
              <li>
                <Link to="/admin/users">Users</Link>
              </li>
              <li>
                <Link to="/profile">
                  <img
                    src={currentUser.profilePicture}
                    alt="profile"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </header>
  );
}

export default Header