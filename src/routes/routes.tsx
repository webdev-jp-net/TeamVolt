import { FC } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Home } from 'components/pages/Home';
import { Play } from 'components/pages/Play';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
};
