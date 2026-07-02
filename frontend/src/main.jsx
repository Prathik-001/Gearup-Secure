import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';
import './index.css';
import App from './App.jsx';
import Home from './components/Home/home.jsx';
import Body from './components/Body/body.jsx';
import Navbar from './components/Navbar/nav.jsx';
import Login from './components/Login/login.jsx';
import Shedule from './components/Shedule/shedule.jsx';
import More from './components/Cards/more.jsx';
import Not_found from './components/Not_found/notfound.jsx';
import Singup from './components/Singnup/singnup.jsx'
import Admin from './components/Admin/admin.jsx'
import Add from './components/Admin/add.jsx';
import Userdash from './components/Userdash/userdash.jsx';
import About from './components/About/about.jsx';
import ViewAllCars from './components/Vehicles/ViewAllCars.jsx'
import ViewAllBikes from './components/Vehicles/ViewAllBike.jsx';
import CarInfo from "./components/Cards/more.jsx"
import BikeInfo from "./components/Cards/bmore.jsx"
import Badd from './components/Admin/Badd.jsx';
import Bmore from './components/Cards/bmore.jsx'
import AdminLayout from './components/Admin/AdminLayout.jsx';
import PaymentRecipt from './components/Booking/PaymentRecipt.jsx'
import UserData from './components/Admin/UserData.jsx';
import Booking from './components/Booking/Booking.jsx';
import BikeCardList from './components/Admin/BikeCardList.jsx';
import ActiveRental from './components/Userdash/activeRentalCard.jsx'; 
import { ToastContainer } from 'react-toastify';
import CarCardList from './components/Admin/CarCardList.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';
import TermsAndConditions from './components/Terms and condition/TermsAndCondition.jsx';
import HelpLine from './components/Terms and condition/HelpLine.jsx';
import UserHelpline from './components/Admin/UserHelpline.jsx';
const router= createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children: [
      {
        path:"/",
        element:<Home />,
      },
      {
        path:"/body",
        element:<Body />
      },
      {
        path:"/navbar",
        element:<Navbar />
      },
      {
        path:"/login",
        element:<Login />
      },
      {
        path:"/shedule",
        element:
        <ProtectedRoute>
        <Shedule />
        </ProtectedRoute>
      },
      {
        path:"/car",
        element:
        <ProtectedRoute>
          <ViewAllCars />
        </ProtectedRoute>
      },
      {
        path:"/bike",
        element:
        <ProtectedRoute>
          <ViewAllBikes />
        </ProtectedRoute>
      },
      {
        path:"/car-info/:id",
        element:<CarInfo />
      },
      {
        path:"/bike-info/:id",
        element:<BikeInfo />
      },

      {
        path:"/more",
        element:<Bmore />
      },
      {
        path:"*",
        element:<Not_found />
      },
      {
        path:"/singup",
        element:<Singup />
      },
      {
        path:"/userdata",
        element:<UserData />
      },
      {
        path:"/FY5675ytrytavytf6gvyvhCXt",
        element:<AdminLayout/>,
        children:[
          { 
            index: true, 
            element: <Admin /> 
          },
          {
            path:"add",
            element:<Add />,
          },
          {
            path:"badd",
            element:<Badd/>,
          },
          {
            path:"clist",
            element:<CarCardList />,
          },
          {
            path:"blist",
            element:<BikeCardList />,
          },
        ]
      },
      {
        path:"/bmore",
        element:<Bmore />,
      },
      {
        path:"/userdash",
        element:
        <ProtectedRoute>
        <Userdash />
        </ProtectedRoute>
      },
      {
        path:"/about",
        element:<About />
      },
      {
        path: "/receipt",
        element: <PaymentRecipt />
      },
      {
        path:"/booking",
        element:<Booking/>
      },
      {
        path:"/activerental",
        element:<ActiveRental/>
      },
      {
        path:"/terms-and-conditions",
        element:<TermsAndConditions/>
      },
      {
        path:"/helpline",
        element:<ProtectedRoute>
        <HelpLine/>
        </ProtectedRoute>
      },
      {
        path:"/userhelpline",
        element:<UserHelpline/>
      }
    ],
  },
],)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer/>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
export default router
