import React from 'react';
import { Routes, Route } from 'react-router-dom';


import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import Services from '../pages/Services';
import Products from '../pages/Products';
import User from '../pages/User';
import Order from '../pages/Order';
import OrderDetails from '../pages/Order/Details';
import Reports from '../pages/Reports';
import ReportOrders from '../pages/Reports/Orders';
import ReportComission from '../pages/Reports/Comission';
import CashResgister from '../pages/CashResgister';
import NewSchedule from '../pages/NewSchedule';
import ConfigBarberHour from '../pages/ConfigBarberHour';

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/products" element={<Products />} />
      <Route path="/users" element={<User />} />
      <Route path="/order" element={<Order />} />
      <Route path="/order/:id" element={<OrderDetails />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/orders" element={<ReportOrders />} />
      <Route
        path="/reports/commission"
        element={<ReportComission />}
      />
      <Route path="/schedule" element={<NewSchedule />} />
      <Route path="/cashregister" element={<CashResgister />} />
      <Route
        path="/configbarberhour"
        element={<ConfigBarberHour />}
      />
    </Routes>
  )
}

