/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateLock from './components/CreateLock';
import ViewLock from './components/ViewLock';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateLock />} />
        <Route path="/view" element={<ViewLock />} />
      </Routes>
    </Router>
  );
}
