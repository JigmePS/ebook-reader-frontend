import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.jsx'
import {SidebarProvider} from "./Admin/Context/SidebarContext.jsx";
import {AuthProvider} from "./Shared/Context/AuthContext.jsx";
import {CartProvider} from "./User/Context/CartContext.jsx";
import {LibraryProvider} from "./User/Context/LibraryContext.jsx";
import {ReaderProvider} from "./User/Context/ReaderContext.jsx";
import {ReaderSidebarProvider} from "./User/Context/ReaderSidebarContext.jsx";
import {CustomiseProvider} from "./User/Context/CustomiseContext.jsx";
import {ReviewProvider} from "./User/Context/ReviewContext.jsx";
import {PictureProvider} from "./User/Context/PictureContext.jsx";
import {ThemeProvider} from "./Shared/Context/ThemeContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <PictureProvider>
                    <CartProvider>
                        <LibraryProvider>
                            <ReviewProvider>
                                <ReaderProvider>
                                    <ReaderSidebarProvider>
                                        <CustomiseProvider>
                                            <SidebarProvider>
                                                <App/>
                                            </SidebarProvider>
                                        </CustomiseProvider>
                                    </ReaderSidebarProvider>
                                </ReaderProvider>
                            </ReviewProvider>
                        </LibraryProvider>
                    </CartProvider>
                </PictureProvider>
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>
)
