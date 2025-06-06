import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserLayout from "./User/UserLayout.jsx";
import Home from './User/Pages/Home.jsx'
import Profile from "./User/Pages/Profile.jsx";
import ProfileSettings from "./User/Pages/ProfileSettings.jsx";
import OrderHistory from "./User/Pages/OrderHistory.jsx";
import Library from "./User/Pages/Library.jsx";
import Book from './User/Pages/Book.jsx'
import Search from "./User/Pages/Search.jsx";
import TrendingBooks from "./User/Pages/TrendingBooks.jsx";
import HighestRatedBooks from "./User/Pages/HighestRatedBooks.jsx";
import NewReleases from "./User/Pages/NewReleases.jsx";
import GenreList from "./User/Pages/GenreList.jsx";
import GenreBooks from "./User/Pages/GenreBooks.jsx";
import AuthorBooks from "./User/Pages/AuthorBooks.jsx";
import Checkout from "./User/Pages/Checkout.jsx";
import PaymentSuccess from "./User/Pages/PaymentSuccess.jsx";

import Reader from "./User/Pages/Reader.jsx";

import AdminLayout from "./Admin/AdminLayout.jsx";

import AdminDashboard from "./Admin/AdminDashboard.jsx";

import UserManagementLayout from "./Admin/UserManagementLayout.jsx";
import UserManagement from "./Admin/Pages/UserManagement.jsx";

import BookManagementLayout from "./Admin/BookManagementLayout.jsx";
import BookManagement from "./Admin/Pages/BookManagement.jsx";
import BookChaptersManagement from "./Admin/Pages/BookChaptersManagement.jsx";

import GenreManagementLayout from "./Admin/GenreManagementLayout.jsx";
import GenreManagement from "./Admin/Pages/GenreManagement.jsx";

import OrderListLayout from "./Admin/OrderListLayout.jsx";
import OrderList from "./Admin/Pages/OrderList.jsx";
import UserLibraryManagement from "./Admin/Pages/UserLibraryManagement.jsx";
import UserReviewsManagement from "./Admin/Pages/UserReviewsManagement.jsx";

import {useAuth} from "./Shared/Context/AuthContext.jsx";
import {usePicture} from "./User/Context/PictureContext.jsx";
import {useCart} from "./User/Context/CartContext.jsx";
import {useLibrary} from "./User/Context/LibraryContext.jsx";
import {useEffect} from "react";
import AboutUs from "./User/Pages/AboutUs.jsx";

function App() {

    const { sessionData, refreshSession } = useAuth();
    const {fetchUserPicture} = usePicture();
    const { fetchLibraryData } = useLibrary();
    const {fetchCartData} = useCart();

    // Initial session fetch
    useEffect(() => {
        refreshSession();
    }, []);

    // Fetch dependent data once session is ready
    useEffect(() => {
        if (sessionData) {
            fetchLibraryData();
        }
    }, [sessionData]);

    return (
        <BrowserRouter>
            <ToastContainer position="bottom-right" autoClose={3000} />
            <Routes>

                <Route element={<UserLayout/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about" element={<AboutUs/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/profile/settings" element={<ProfileSettings/>}/>
                    <Route path="/profile/settings/order-history" element={<OrderHistory/>}/>
                    <Route path="/library" element={<Library/>}/>
                    <Route path="/book/:id" element={<Book/>}/>
                    <Route path="/search" element={<Search/>}/>
                    <Route path="/trending-books" element={<TrendingBooks/>}/>
                    <Route path="/highest-rated-books" element={<HighestRatedBooks/>}/>
                    <Route path="/new-releases" element={<NewReleases/>}/>
                    <Route path="/author/:authorName" element={<AuthorBooks />} />
                    <Route path="/genre" element={<GenreList/>}/>
                    <Route path="/genre/:genreId" element={<GenreBooks/>}/>
                    <Route path="/checkout" element={<Checkout/>}/>
                    <Route path="/payment/success" element={<PaymentSuccess/>}/>
                </Route>

                <Route path="/chapter/:bookId/:chapterNo" element={<Reader/>}/>

                <Route element={<AdminLayout/>}>
                    <Route path="/admin-dashboard" element={<AdminDashboard/>}/>

                    <Route element={<UserManagementLayout/>}>
                        <Route path="/user-management" element={<UserManagement/>}/>
                        <Route path="/user-management/:userId/library" element={<UserLibraryManagement/>}/>
                        <Route path="/user-management/:userId/reviews" element={<UserReviewsManagement/>}/>
                    </Route>

                    <Route element={<BookManagementLayout/>}>
                        <Route path="/book-management" element={<BookManagement/>}/>
                        <Route path="/book-management/:bookId/chapters" element={<BookChaptersManagement/>}/>
                    </Route>

                    <Route element={<GenreManagementLayout/>}>
                        <Route path="/genre-management" element={<GenreManagement/>}/>
                    </Route>

                    <Route element={<OrderListLayout/>}>
                        <Route path="/order-list" element={<OrderList/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
