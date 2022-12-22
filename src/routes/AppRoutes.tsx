import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import CashResgister from '../pages/CashResgister'
import ConfigBarberHour from '../pages/ConfigBarberHour'
import Dashboard from '../pages/Dashboard'
import Inventories from '../pages/inventory'
import { Purchase } from '../pages/inventory/Purchase'
import NewSchedule from '../pages/NewSchedule'
import NewSchedule2 from '../pages/NewSchedule/indexNew'
import Order from '../pages/Order'
import OrderDetails from '../pages/Order/Details'
import Products from '../pages/Products'
import Profile from '../pages/Profile'
import Reports from '../pages/Reports'
import ReportComission from '../pages/Reports/Comission'
import ReportOrders from '../pages/Reports/Orders'
import Services from '../pages/Services'
import { Test } from '../pages/Test'
import User from '../pages/User'

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="schedule" />} />
      <Route path="/schedule" element={<NewSchedule />} />
      <Route path="/schedule/teste" element={<NewSchedule2 />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/services" element={<Services />} />
      <Route path="/products" element={<Products />} />
      <Route path="/users" element={<User />} />
      <Route path="/order" element={<Order />} />
      <Route path="/order/:id" element={<OrderDetails />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/inventories" element={<Inventories />} />
      <Route path="/inventory/purchaseproducts" element={<Purchase />} />
      <Route path="/reports/orders" element={<ReportOrders />} />

      <Route path="/reports/commission" element={<ReportComission />} />
      <Route path="/cashregister" element={<CashResgister />} />
      <Route path="/configbarberhour" element={<ConfigBarberHour />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  )
}
