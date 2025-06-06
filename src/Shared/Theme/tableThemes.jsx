// tableThemes.js
import { createTheme } from "react-data-table-component";

// Define and register dark theme once globally
createTheme('darkMode', {
    text: {
        primary: '#E0E0E0',       // light gray text
        secondary: '#A0A0A0',     // muted gray for secondary
    },
    background: {
        default: '#121212',       // near-black background
    },
    context: {
        background: '#1F1F1F',    // subtle highlight background
        text: '#FFFFFF',          // white text for context
    },
    divider: {
        default: '#2C2C2C',       // dark divider
    },
    button: {
        default: '#3A3A3A',       // medium dark button
        hover: '#4A4A4A',         // slightly lighter on hover
        focus: '#5A5A5A',         // subtle focus ring
        disabled: '#2A2A2A',      // very dark when disabled
    },
}, 'dark');

// Optional: export custom row styles for light/dark themes
export const getCustomTableStyles = (theme) => ({
    table: {
        style: {
            backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
            borderRadius: '8px',
            overflow: 'hidden',
        }
    },
    headRow: {
        style: {
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#F5F5F5',
            color: theme === 'dark' ? '#E0E0E0' : '#000000',
            borderBottom: '1px solid #2C2C2C',
        }
    },
    rows: {
        style: {
            backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
            color: theme === 'dark' ? '#E0E0E0' : '#000000',
            '&:hover': {
                backgroundColor: theme === 'dark' ? '#2A2A2A' : '#F0F0F0',
            }
        }
    },
    pagination: {
        style: {
            backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF',
            color: theme === 'dark' ? '#E0E0E0' : '#000000',
        }
    }
});