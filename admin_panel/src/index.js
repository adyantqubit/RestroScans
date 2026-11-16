import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './erp.css';
import './styles/reference.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'
import  Context  from './Context/Context';
import { AppProvider } from './Context/AppContext';

const { Button, Alert,TableContainer,Table,TableCaption,Thead,Tr,Th,Tbody,Td,Tfoot,Popover, PopoverTrigger, IconButton, FocusLock, PopoverArrow, PopoverCloseButton } = chakraTheme.components

const theme = extendBaseTheme({
  components: {
    Button, Alert,TableContainer,Table,TableCaption,Thead,Tr,Th,Tbody,Td,Tfoot,
    Popover, PopoverTrigger, IconButton, FocusLock, PopoverArrow, PopoverCloseButton
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context>
    <ChakraBaseProvider theme={theme}>
      <AppProvider>
        <BrowserRouter basename="/admin">
          <App />
        </BrowserRouter>
      </AppProvider>
    </ChakraBaseProvider>
    </Context>
);
