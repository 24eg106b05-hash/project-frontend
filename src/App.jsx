import { NavLink, Route, Routes } from 'react-router-dom';
import RoomList from './pages/RoomList.jsx';
import RoomDetails from './pages/RoomDetails.jsx';
import BookRoom from './pages/BookRoom.jsx';
import RoomForm from './pages/RoomForm.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';

export default function App() {
  return (
    <>
      <header className="topbar">
        <NavLink to="/" className="brand">RoomRent</NavLink>
        <nav>
          <NavLink to="/" end>Available rooms</NavLink>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/rooms/new">Add room</NavLink>
          <NavLink to="/owner">Owner dashboard</NavLink>
        </nav>
      </header>

      <main className="page">
        <Routes>
          <Route path="/" element={<RoomList key="home" showFilters={false} />} />
          <Route path="/search" element={<RoomList key="search" showFilters />} />
          <Route path="/rooms/new" element={<RoomForm />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/rooms/:id/edit" element={<RoomForm />} />
          <Route path="/rooms/:id/book" element={<BookRoom />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="*" element={<p className="empty">That page does not exist.</p>} />
        </Routes>
      </main>
    </>
  );
}
