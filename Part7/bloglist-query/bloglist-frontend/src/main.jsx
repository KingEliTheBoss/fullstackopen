import ReactDOM from 'react-dom/client';
import { UsersContextProvider } from './contexts/UsersContext';
import { UserContextProvider } from './contexts/UserContext';
import { NotificationContextProvider } from './contexts/NotificationContext';
import { CommentsContextProvider } from './contexts/CommentsContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <UsersContextProvider>
        <UserContextProvider>
            <NotificationContextProvider>
                <CommentsContextProvider>
                    <QueryClientProvider client={queryClient}>
                        <Router>
                            <App />
                        </Router>
                    </QueryClientProvider>
                </CommentsContextProvider>
            </NotificationContextProvider>
        </UserContextProvider>
    </UsersContextProvider>
);