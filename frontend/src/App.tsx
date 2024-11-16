import {AppRoutes} from "./AppRoutes.tsx";
import {BrowserRouter} from "react-router-dom";
import {Navigation} from "./pages/home/Nav";

import {ChakraProvider} from "@chakra-ui/react";

export const App = () => {
  return (
      <ChakraProvider>
      <BrowserRouter>
        <Navigation />
        <AppRoutes />
      </BrowserRouter>
      </ChakraProvider>
  )
}

// export default App
