import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

const Header = () => {
  const {currentUser} = useSelector(state => state.user);
  return (
    <header className="bg-gray-800 text-white">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold">Auth App</h1>
        <ul className="flex gap-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>

          {currentUser ? 
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
            : 
            <li>
              <Link to="/sign-in">Sign In</Link>
            </li>
          }
         
        </ul>
      </div>
    </header>
  );
}

export default Header